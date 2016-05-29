var child_process = require('child_process');
var _ = require('underscore');
var spawn = require('child_process').spawn;
var debug = require('debug')('mount-on.vagrant');

function Vagrant(name) {
  this.name = name;
}

Vagrant.prototype.up = function up(callback) {
  var args = _.compact(['up', this.name]);
  debug('command vagrant: ', args);
  var ls = spawn('vagrant', args);
  var error = '';

  ls.stdout.on('data', function (data) {
    debug('stdout: ', data.toString());
  });

  ls.stderr.on('data', function (data) {
    debug('stderr: ', data.toString());
    stderr = stderr + data.toString() + '\n';
  });

  ls.on('close', function (code) {
    debug('vagrant up process exited with code ', code.toString());
    if (code) {
      var error = new Error(stderr);
      error.code = code;
      callback(error);
    } else {
      callback();
    }
  });
}

Vagrant.prototype.sshCommand = function sshCommand(command, callback) {
  return this.ssh(['-c'].concat([command]), callback);
}

Vagrant.prototype.ssh = function ssh(args, callback) {
  var spawn = require('child_process').spawn;
  var args = _.compact(['ssh', this.name]).concat(args);
  debug('command vagrant: ', args);
  var ls = spawn('vagrant', args);
  var stderr = '';

  ls.stdout.on('data', function (data) {
    debug('stdout: ', data.toString());
  });

  ls.stderr.on('data', function (data) {
    debug('stderr: ', data.toString());
    stderr = stderr + data.toString() + '\n';
  });

  ls.on('close', function (code) {
    debug('vagrant ssh process exited with code : [' + code.toString() + ']', code.toString());
    if (code) {
      var error = new Error(stderr);
      error.code = code;
      callback(error);
    } else {
      callback();
    }
  });
}

function run(command, args, callback) {
  args = [command].concat(args);
  var runner = spawn('vagrant', args, { silent: true });
  runner.on('close', function(data) {
    callback(data);
  });
}

module.exports = Vagrant;
