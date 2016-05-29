var parseArguments = require('../../lib/parse-arguments');

describe('parse-arguments', function () {
  it('parses all arguments', function () {
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
      '--remote-password=vagrant'
    ];

    expect(parseArguments(args)).toEqual({ local:
       { host: '192.168.33.20',
         folder: '/vagrant/.tmp/local-folder',
         user: 'vagrant',
         password: 'vagrant' },
      remote:
       { host: '192.168.33.10',
         folder: '/vagrant/.tmp/remote-folder',
         user: 'vagrant',
         password: 'vagrant' } }
    );
  });

  it('parses all shorthands', function () {
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
      '-rp=vagrant'
    ];

    expect(parseArguments(args)).toEqual({ local:
       { host: '192.168.33.20',
         folder: '/vagrant/.tmp/local-folder',
         user: 'vagrant',
         password: 'vagrant' },
      remote:
       { host: '192.168.33.10',
         folder: '/vagrant/.tmp/remote-folder',
         user: 'vagrant',
         password: 'vagrant' } }
    );
  });
});
