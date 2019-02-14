const pad = require('./pad')

module.exports = function() {
  let dt = new Date()

  return [
    pad(dt.getHours(), 2),
    pad(dt.getMinutes(), 2),
    pad(dt.getSeconds(), 2)
  ].join(':')
}
