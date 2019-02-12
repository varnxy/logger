const mkdirp = require('mkdirp')
    , path = require('path')
    , vsprintf = require('sprintf-js').vsprintf
    , timestamp = require('time-stamp')
    , chalk = require('chalk')
    , rtrim = require('rtrim')

function Logger(name, outDir) {
  this.name = name || ''
  this.outDir = outDir
  this.defaultArgsFormat = []
  this.logTypes = ['info', 'error', 'warn']
  this.colorMap = {
    info: 'blue',
    error: 'red',
    warn: 'yellow'
  }

  this.setup()
}

Logger.prototype.setup = function() {
  if (this.outDir) {
    this.outDir = path.resolve(path.dirname(require.main.filename), this.outDir)

    mkdirp.sync(this.outDir)
    this._createRotateLogger()
  } else {
    this._createChalkLogger()
  }

}

Logger.prototype._createRotateLogger = function() {
  let logStream = require('file-stream-rotator').getStream({
    filename: path.join(this.outDir, 'log-%DATE%.log'),
    frequency:"daily",
    verbose: false
  })

  this.logTypes.forEach(msgType => {
    this[msgType] = (msg) => {
      let fmtArgs = this._createFormatArgs(msgType, msg)

      logStream.write(vsprintf(fmtArgs.format, fmtArgs.args))
    }
  })
}

Logger.prototype._createChalkLogger = function() {
  this.logTypes.forEach(msgType => {
    this[msgType] = (msg) => {
      let fmtArgs = this._createFormatArgs(msgType, msg)

      fmtArgs.args[0] = chalk.green(fmtArgs.args[0])
      fmtArgs.args[1] = chalk[this.colorMap[msgType]](fmtArgs.args[1])

      if (fmtArgs.args.length > 3) {
        fmtArgs.args[2] = chalk.magenta(fmtArgs.args[2])
        fmtArgs.args[3] = rtrim(fmtArgs.args[3], '\r\n')
      } else {
        fmtArgs.args[2] = rtrim(fmtArgs.args[2], '\r\n')
      }

      console.log(vsprintf(fmtArgs.format, fmtArgs.args))
    }
  })
}

Logger.prototype._createFormatArgs = function(msgType, msg) {
  msg = (msg + '') + '\r\n'
  let fmt = (this.name) ? '[%s:%s:%s] %s' : '[%s:%s] %s'
    , args = (this.name)
    ? [timestamp('HH:mm:ss'), msgType.toUpperCase(), this.name, msg]
    : [timestamp('HH:mm:ss'), msgType.toUpperCase(), msg]

  return {
    format: fmt,
    args: args
  }
}

module.exports = function(name, outDir) {
  return new Logger(name, outDir)
}
