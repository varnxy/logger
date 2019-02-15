const date = require('./date')

module.exports = function() {
  return 'log-' + date() + '.log'
}
