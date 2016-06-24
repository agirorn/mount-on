var _ = require('underscore');
var untildify = require('untildify');
var path = require('path');
var mustache = { interpolate: /\{\{(.+?)\}\}/g };
var read = require('read');
var Client = require('ssh2').Client;
var sshDebug = (
  process.env.DEBUG_MOUNT_ON || process.env.MOUNT_ON_DEBUG ?
  require('debug')('SSH-DEBUG') :
  function () {}
);

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

function runSSHCommandNow(command, options) {
  var conn = new Client();

  conn.on('ready', function ready() {
    conn.shell(function shell(err, stream) {
      if (err) { throw err; }
      stream.on('close', function closed() {
        sshDebug('Stream :: close');
        conn.end();
      });

      stream.on('data', function ennterPassword(data) {
        sshDebug('STDOUT: ' + data);
        handleAutoconnect(stream, data, options);
        if (data.indexOf('password') > 0) {
          if (data.indexOf('sudo') > 0) {
            handleSudoPassword(stream, options);
          } else {
            handlePassword(stream, options);
          }
        }
      });

      stream.write('sudo ' + command + '\n');
    });
  });

  conn.on('end', function on() {
    process.exit();
  });

  conn.on('keyboard-interactive', function () {
    sshDebug('keyboard-interactive', arguments);
  });

  conn.connect({
    host: options.remote.host,
    username: options.remote.user,
    password: options.remote.password,
    tryKeyboard: true,
    agent: process.env.SSH_AUTH_SOCK
  });
}

function handleAutoconnect(stream, data, options) {
  var prompt = 'Are you sure you want to continue connecting (yes/no): ';

  if (data.indexOf('Are you sure you want to continue connecting') >= 0) {
    if (options.autoconnect) {
      stream.write('yes\n');
    } else {
      read({ prompt: prompt, silent: true },
        function reader(er, answer) {
          stream.write(answer + '\n');
        });
    }
  }
}

function handleSudoPassword(stream, options) {
  if (options.remote.password) {
    stream.write(options.remote.password + '\n');
  } else {
    read(
      { prompt: 'SUDO Password: ', silent: true },
      function reader(er, readPassword) {
        stream.write(readPassword + '\n');
      });
  }
}

function handlePassword(stream, options) {
  if (options.local.password) {
    stream.write(options.local.password + '\n');
  } else {
    read({ prompt: 'LOACL Password: ', silent: true },
      function reader(er, readPassword) {
        stream.write(readPassword + '\n');
      });
  }
}
