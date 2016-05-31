var parseArguments = require('../../lib/parse-arguments');

describe('parse-arguments', function () {
  var options = {
    local: {
      host: '192.168.33.20',
      folder: '/vagrant/.tmp/local-folder',
      user: 'vagrant',
      password: 'vagrant'
    },
    remote: {
      host: '192.168.33.10',
      folder: '/vagrant/.tmp/remote-folder',
      user: 'vagrant',
      password: 'vagrant'
    },
    autoconnect: true
  };

  describe('parses all arguments', function () {
    var args = [
      'node',
      'bin/mount-on',
      '--local-host=192.168.33.20',
      '--local-folder=/vagrant/.tmp/local-folder',
      '--local-user=vagrant',
      '--local-password=vagrant',
      '--remote-host=192.168.33.10',
      '--remote-folder=/vagrant/.tmp/remote-folder',
      '--remote-user=vagrant',
      '--remote-password=vagrant',
      '--autoconnect'
    ];

    it('has all options', function () {
      expect(parseArguments(args)).toEqual(options);
    });
  });

  describe('parses all shorthands', function () {
    var args = [
      'node',
      'bin/mount-on',
      '-lh=192.168.33.20',
      '-lf=/vagrant/.tmp/local-folder',
      '-lu=vagrant',
      '-lp=vagrant',
      '-rh=192.168.33.10',
      '-rf=/vagrant/.tmp/remote-folder',
      '-ru=vagrant',
      '-rp=vagrant',
      '-a'
    ];

    it('has all options', function () {
      expect(parseArguments(args)).toEqual(options);
    });
  });

  describe('parsing host', function () {
    var args = [
      'node',
      'bin/mount-on',
      '192.168.33.10',
      '--local-host=192.168.33.20',
      '--local-folder=/vagrant/.tmp/local-folder',
      '--local-user=vagrant',
      '--local-password=vagrant',
      '--remote-folder=/vagrant/.tmp/remote-folder',
      '--remote-user=vagrant',
      '--remote-password=vagrant',
      '--autoconnect'
    ];

    it('has host', function () {
      expect(parseArguments(args).remote.host).toEqual('192.168.33.10');
    });

    it('has all options', function () {
      expect(parseArguments(args)).toEqual(options);
    });
  });

  describe('parsing user and host', function () {
    var args = [
      'node',
      'bin/mount-on',
      'vagrant@192.168.33.10'
    ];

    it('has user', function () {
      expect(parseArguments(args).remote.user).toEqual('vagrant');
    });

    it('has host', function () {
      expect(parseArguments(args).remote.host).toEqual('192.168.33.10');
    });
  });

  describe('parsing user, host and absolute path', function () {
    var args = [
      'node',
      'bin/mount-on',
      'vagrant@192.168.33.10:/tmp/mount-point'
    ];

    it('has user', function () {
      expect(parseArguments(args).remote.user).toEqual('vagrant');
    });

    it('has host', function () {
      expect(parseArguments(args).remote.host).toEqual('192.168.33.10');
    });

    it('has folder', function () {
      expect(parseArguments(args).remote.folder).toEqual('/tmp/mount-point');
    });
  });

  describe('parsing user, host and home path', function () {
    var args = [
      'node',
      'bin/mount-on',
      'vagrant@192.168.33.10:~/mount-point'
    ];

    it('has user', function () {
      expect(parseArguments(args).remote.user).toEqual('vagrant');
    });

    it('has host', function () {
      expect(parseArguments(args).remote.host).toEqual('192.168.33.10');
    });

    it('has folder', function () {
      expect(parseArguments(args).remote.folder).toEqual('~/mount-point');
    });
  });

  describe('parsing user, host and path', function () {
    var args = [
      'node',
      'bin/mount-on',
      'vagrant@192.168.33.10:mount-point'
    ];

    it('has user', function () {
      expect(parseArguments(args).remote.user).toEqual('vagrant');
    });

    it('has host', function () {
      expect(parseArguments(args).remote.host).toEqual('192.168.33.10');
    });

    it('has folder', function () {
      expect(parseArguments(args).remote.folder).toEqual('~/mount-point');
    });
  });

  describe('parsing user, host and home path', function () {
    var args = [
      'node',
      'bin/mount-on',
      'vagrant@192.168.33.10:/mount-point',
      '~/local-dir'
    ];

    it('has local folder', function () {
      expect(parseArguments(args).local.folder).toEqual('~/local-dir');
    });
  });

  describe('set missing local-folder', function () {
    var args = [
      'node',
      'bin/mount-on',
      'vagrant@192.168.33.10:/mount-point'
    ];

    it('has local folder', function () {
      expect(parseArguments(args).local.folder).toEqual(process.cwd());
    });
  });
});
