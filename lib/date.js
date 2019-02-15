const pad = require('./pad')

module.exports = function() {
  let dt = new Date()

  return [
    pad(dt.getFullYear(), 2),
    pad(dt.getMonth() + 1, 2),
    pad(dt.getDate(), 2)
  ].join('-')
}
