var parseArguments = require('./parse-arguments');
var mountOn = require('./mount-on');

module.exports = function () {
  mountOn(parseArguments(process.argv));
};
