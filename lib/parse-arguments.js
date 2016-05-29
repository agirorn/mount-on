var nopt = require('nopt');
var knownOpts = {
  'local-host': String,
  'local-folder': String,
  'local-user': String,
  'local-password': String,
  'remote-host': String,
  'remote-folder': String,
  'remote-user': String,
  'remote-password': String
};
var shortHands = {
  lh: '--local-host',
  lf: '--local-folder',
  lu: '--local-user',
  lp: '--local-password',
  rh: '--remote-host',
  rf: '--remote-folder',
  ru: '--remote-user',
  rp: '--remote-password'
};

function cliParser(argv) {
  var parsed = nopt(knownOpts, shortHands, argv, 2);

  var options = {
    local: {
      host: parsed['local-host'],
      folder: parsed['local-folder'],
      user: parsed['local-user'],
      password: parsed['local-password']
    },
    remote: {
      host: parsed['remote-host'],
      folder: parsed['remote-folder'],
      user: parsed['remote-user'],
      password: parsed['remote-password']
    }
  };

  return options;
}

module.exports = cliParser;
