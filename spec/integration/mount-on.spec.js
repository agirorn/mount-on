if (process.env.NODE_ENV === 'integration') {
  /* eslint-disable vars-on-top */
  /* eslint-disable global-require */
  var Vagrant = require('../helpers/vagrant');
  var vagrant = new Vagrant();
  var fs = require('fs-extra');
  var touch = require('touch');
  /* eslint-enable vars-on-top */
  /* eslint-enable global-require */

  describe('mount-on', function () {
    var timeout = 10000;
    var local = new Vagrant('local');

    beforeAll(function (done) {
      fs.mkdirsSync('.tmp/local-folder');
      fs.mkdirsSync('.tmp/remote-folder');
      touch.sync('.tmp/remote-folder/new-file');
      vagrant.up(done);
    }, timeout);

    afterEach(function () {
      fs.removeSync('.tmp/local-folder');
      fs.removeSync('.tmp/remote-folder');
    });

    describe('mount', function () {
      afterEach(function (done) {
        local.sshCommand('rm -Rf folder', done);
      }, timeout);

      beforeEach(function (done) {
        local.sshCommand([
          '/vagrant/bin/mount-on.js',
          '--local-host=192.168.33.20',
          '--local-folder=/vagrant/.tmp/local-folder',
          '--local-user=vagrant',
          '--local-password=vagrant',
          '--remote-host=192.168.33.10',
          '--remote-folder=/vagrant/.tmp/remote-folder',
          '--remote-user=vagrant',
          '--remote-password=vagrant'
        ].join(' '), done);
      }, timeout);

      it('works', function () {
        expect(fs.existsSync('.tmp/remote-folder/new-file')).toBe(true);
      });
    });
  });
}
