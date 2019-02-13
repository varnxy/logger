const mkdirp = require('mkdirp')
    , path = require('path')
    , vsprintf = require('sprintf-js').vsprintf
    , sprintf = require('sprintf-js').sprintf
    , timestamp = require('time-stamp')
    , chalk = require('chalk')
    , caller = require('caller')
    , ltrim = require('ltrim')
    , timestampFormat = 'HH:mm:ss'

let logDirectory = ''

function Logger(name, basefile) {
  this.name = name || ''
  this.defaultArgsFormat = []
  this.logTypes = ['info', 'error', 'warn', 'debug']
  this.colorMap = {
    info: 'blue',
    error: 'red',
    warn: 'yellow',
    debug: 'cyan'
  }
  this.writer = {
    info: 'stdout',
    error: 'stderr',
    warn: 'stderr',
    debug: 'stderr'
  }
  this.basedir = path.dirname(basefile)
  this.debugEnv = process.env.DEBUG
  this.setup()
}

Logger.prototype.setup = function() {
  if (this.debugEnv && this.debugEnv != 'true') {
    this.debugEnv = this.debugEnv.split(',')
  }

  if (logDirectory) {
    logDirectory = path.resolve(this.basedir, logDirectory)

    mkdirp.sync(logDirectory)
    this._createRotateLogger()
  } else {
    this._createChalkLogger()
  }

}

Logger.prototype._createRotateLogger = function() {
  let logStream = require('file-stream-rotator').getStream({
    filename: path.join(logDirectory, 'log-%DATE%.log'),
    frequency:"daily",
    verbose: false
  })

  this.logTypes.forEach(msgType => {
    this[msgType] = function() {
      let msg = sprintf.apply(null, arguments)
        , fmtArgs = this._createFormatArgs(msgType, msg)

      if (this.debugEnv && msgType == 'debug') {
        if (Array.isArray(this.debugEnv) && this.debugEnv.indexOf(fmtArgs.args[2]) == -1) {
          return
        }
      }

      logStream.write(vsprintf(fmtArgs.format, fmtArgs.args))
    }.bind(this)
  })
}

Logger.prototype._createChalkLogger = function() {
  this.logTypes.forEach(msgType => {
    this[msgType] = function() {
      let msg = sprintf.apply(null, arguments)
        , fmtArgs = this._createFormatArgs(msgType, msg)
        , appName = fmtArgs.args[2]

      fmtArgs.args[0] = chalk.green(fmtArgs.args[0])
      fmtArgs.args[1] = chalk[this.colorMap[msgType]](fmtArgs.args[1])

      fmtArgs.args[2] = chalk.magenta(appName)

      if (this.debugEnv && msgType == 'debug') {
        if (Array.isArray(this.debugEnv) && this.debugEnv.indexOf(appName) == -1) {
          return
        }
      }

      process[this.writer[msgType]].write(vsprintf(fmtArgs.format, fmtArgs.args))
    }.bind(this)
  })
}

Logger.prototype._createFormatArgs = function(msgType, msg) {
  let logName = this.name

  if (!logName) {
    logName = caller(2)
    // Simplified path
    logName = ltrim(logName.replace(this.basedir, ''), path.sep)
  }

  msg = (msg + '') + '\r\n'

  return {
    format: '[%s:%s:%s] %s',
    args: [
      timestamp(timestampFormat),
      msgType.toUpperCase(),
      logName,
      msg
    ]
  }
}

function loggerFactory(name) {
  return new Logger(name, caller())
}

loggerFactory.setDirectory = function(logDir) {
  logDirectory = logDir
}

module.exports = loggerFactory
