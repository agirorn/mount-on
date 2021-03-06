var fs = require('fs-extra');
var touch = require('touch');
var exec = require('child_process').exec;
var Vagrant = require('../helpers/vagrant');
var vagrant = new Vagrant();

describe('mount-on', function () {
  var timeout = 1000000;
  var local = new Vagrant('local');

  beforeAll(function (done) {
    fs.mkdirsSync('.tmp/local-folder');
    fs.mkdirsSync('.tmp/remote-folder');
    touch.sync('.tmp/local-folder/new-file');
    vagrant.up(done);
  }, timeout);

  afterEach(function () {
    fs.removeSync('.tmp/local-folder');
    fs.removeSync('.tmp/remote-folder');
  });

  describe('mount', function () {
    beforeEach(function (done) {
      local.sshCommand([
        'export NVM_DIR="/home/vagrant/.nvm";',
        '. "$NVM_DIR/nvm.sh";', // # This loads nvm
        '/vagrant/bin/mount-on.js',
        '--local-host=192.168.33.20',
        '--local-folder=/vagrant/.tmp/local-folder',
        '--local-user=vagrant',
        '--local-password=vagrant',
        '--remote-host=192.168.33.10',
        '--remote-folder=/vagrant/.tmp/remote-folder',
        '--remote-user=vagrant',
        '--remote-password=vagrant',
        '--autoconnect'
      ].join(' '), done);
    }, timeout);

    it('works', function () {
      exec("vagrant ssh remote -c 'file /vagrant/.tmp/remote-folder/new-file'", function (err, stdout, stderr) {
        expect(err).toBe(null);
      });
    });
  });
});
