var _ = require('underscore');
var nopt = require('nopt');
var knownOpts = {
  'local-host': String,
  'local-folder': String,
  'local-user': String,
  'local-password': String,
  'remote-host': String,
  'remote-folder': String,
  'remote-user': String,
  'remote-password': String,
  autoconnect: Boolean
};
var shortHands = {
  lh: '--local-host',
  lf: '--local-folder',
  lu: '--local-user',
  lp: '--local-password',
  rh: '--remote-host',
  rf: '--remote-folder',
  ru: '--remote-user',
  rp: '--remote-password',
  a: '--autoconnect'
};

function cliParser(argv) {
  var options;
  var first;
  var parsed = nopt(knownOpts, shortHands, argv, 2);
  var remain = parsed.argv.remain;

  if (remain.length > 0) {
    first = _.first(remain);
    parsed['remote-host'] = extractHost(first);

    if (hasUser(first)) {
      parsed['remote-user'] = extractUser(first);
    }

    if (hasFolder(first)) {
      parsed['remote-folder'] = extractFolder(first);
    }

    if (remain.length > 1) {
      parsed['local-folder'] = second(remain);
    }
  }

  parsed['local-folder'] = parsed['local-folder'] || process.cwd();

  function extractHost(host) {
    var hostAndPath;
    if (_.contains(host, '@')) {
      hostAndPath = second(host.split('@'));
      if (hasFolder(hostAndPath)) {
        return _.first(hostAndPath.split(':'));
      }
      return hostAndPath;
    }
    return host;
  }

  function hasUser(host) {
    return _.contains(host, '@');
  }

  function extractUser(host) {
    if (_.contains(host, '@')) {
      return _.first(host.split('@'));
    }
    return host;
  }

  function hasFolder(host) {
    return _.contains(host, ':');
  }

  function extractFolder(host) {
    var folder = host;
    if (_.contains(host, ':')) {
      folder = second(host.split(':'));
    }

    if (_.first(folder) === '/') {
      return folder;
    }

    if (_.first(folder) === '~') {
      return folder;
    }

    return '~/' + folder;
  }

  function second(list) {
    return list[1];
  }

  options = {
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
    },
    autoconnect: parsed.autoconnect
  };

  return options;
}

module.exports = cliParser;
