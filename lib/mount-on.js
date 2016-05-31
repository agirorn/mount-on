var _ = require('underscore');
var untildify = require('untildify');
var debug = (
  process.env.DEBUG_MOUNT_ON || process.env.MOUNT_ON_DEBUG ?
  function () { console.error.apply(console, arguments); } :
  function () {}
);
var sshDebug = require('debug')('SSH-DEBUG');
var path = require('path');
var mustache = { interpolate: /\{\{(.+?)\}\}/g };
var read = require('read');
var Client = require('ssh2').Client;

/**
 * expand ~ and $HOME to a real path.
 */
var absalute = _.template(
  '`dirname {{ path }}`/`basename {{ path }}`',
  mustache
);

function resolve(directory) {
  return path.resolve(untildify(directory));
}

function mountOn(options) {
  var command = mountCommand(options);
  runSSHCommandNow(command, options);
}

function mountCommand(options) {
  return [
    mkdir(options),
    mount(options),
    list(options),
    exit(options)
  ].join(';');
}

function mkdir(options) {
  var mkdirTemplate = _.template('mkdir {{ path }}', mustache);

  return mkdirTemplate({ path: absalute({ path: options.remote.folder }) });
}

function mount(options) {
  var mountTemplate = _.template(
    'sshfs -o reconnect {{ user }}@{{ host }}:{{ local }} {{ remote }}',
    mustache
  );

  return mountTemplate({
    user: options.local.user,
    host: options.local.host,
    local: resolve(options.local.folder),
    remote: absalute({ path: options.remote.folder })
  });
}

function list(options) {
  var ls = _.template('ls {{ path }}', mustache);

  return ls({ path: absalute({ path: options.remote.folder }) });
}

function exit() {
  return 'exit;';
}

module.exports = mountOn;

function runSSHCommandNow(cmd, opts) {
  // var promptForPassword = true;

  // if (promptForPassword) {
  //   read({ prompt: 'Password: ', silent: true }, function reader(er, newPassword) {
  //     password = newPassword;
  //     runSSHCommands();
  //   });
  // } else {
  //   runSSHCommands();
  // }

  function runSSHCommands(command, options) {
    var conn = new Client();

    conn.on('ready', function ready() {
      debug('SSH:Client :: ready');
      conn.shell(function shell(err, stream) {
        if (err) throw err;
        // process.stdin.pipe(stream);
        // process.stdin.resume();
        stream.on('close', function closed() {
          sshDebug('Stream :: close');
          conn.end();
        });

        stream.on('data', function ennterPassword(data) {
          sshDebug('STDOUT: ' + data);
          if (data.indexOf('Are you sure you want to continue connecting') >= 0) {
            if (options.autoconnect) {
              stream.write('yes\n');
            } else {
              read(
                { prompt: 'Are you sure you want to continue connecting (yes/no): ', silent: true },
                function reader(er, yesNo) {
                  stream.write(yesNo + '\n');
                }
              );
            }
          }
          if (data.indexOf('password') > 0) {
            if (data.indexOf('sudo') > 0) {
              if (options.remote.password) {
                stream.write(options.remote.password + '\n');
              } else {
                sshDebug('Now you should enter SUDO password');
                // stream.write('vagrant\n');
                sshDebug('Password written');
                read(
                  { prompt: 'SUDO Password: ', silent: true },
                  function reader(er, readPassword) {
                    sshDebug('Your password is: [%s]', readPassword);
                    stream.write(readPassword + '\n');
                  }
                );
              }
            } else {
              if (options.local.password) {
                stream.write(options.local.password + '\n');
              } else {
                sshDebug('Now you should enter LOCAL password');
                // stream.write('vagrant\n');
                sshDebug('Password written');
                read(
                  { prompt: 'LOACL Password: ', silent: true },
                  function reader(er, readPassword) {
                    sshDebug('Your password is: [%s]', readPassword);
                    stream.write(readPassword + '\n');
                  }
                );
              }
            }
          }
        });

        stream.on('error', function on(data) {
          sshDebug('error:: ' + data);
        });

        stream.stderr.on('data', function on(data) {
          sshDebug('STDERR: ' + data);
        });

        stream.write('sudo ' + command + '\n');
      });
    })
    .on('error', function on(err) {
      sshDebug('con error: ' + err);
    })
    .on('end', function on() {
      process.exit();
    })
    .on('keyboard-interactive', function () {
      sshDebug('keyboard-interactive', arguments);
    })
    .connect({
      host: '192.168.33.10',
      username: 'vagrant',
      password: 'vagrant',
      tryKeyboard: true,
      agent: process.env.SSH_AUTH_SOCK
    });
  }

  runSSHCommands(cmd, opts);
}
