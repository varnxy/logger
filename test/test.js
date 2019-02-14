const logger = require('..')
    , isDir = require('is-dir')
    , isFile = require('is-file')
    , expect = require('expect')
    , execSync = require('child_process').execSync
    , stripAnsi = require('strip-ansi')
    , pad = require('../lib/pad')


let stdoutSpy = expect.spyOn(process.stdout, 'write').andCallThrough()
  , stderrSpy = expect.spyOn(process.stderr, 'write').andCallThrough()

function getDate() {
  let dt = new Date()

  return [
    dt.getFullYear(),
    pad(dt.getMonth() + 1, 2),
    pad(dt.getDate(), 2)
  ].join('-')
}

describe('Test @varnxy/logger', () => {

  beforeEach(done => {
    stdoutSpy.reset()
    stderrSpy.reset()
    done()
  })

  afterEach(() => {
    logger.setDirectory(null)

    if (isDir.sync('test/logs')) {
      execSync('rm -r test/logs')
    }
  })

  describe('Test Constructor and directory', () => {

    it('Should have `APP_NAME` into output', (done) => {
      let log = logger('test')

      log.info('Foo Bar Baz')

      let uncolored = stripAnsi(stdoutSpy.calls[0].arguments[0])

      expect(/Foo Bar Baz\r\n$/gm.test(uncolored)).toBe(true)
      expect(/INFO:test\]/gm.test(uncolored)).toBe(true)

      done()
    })

    it('Should have basefile into output', (done) => {
      let log = logger()

      log.info('Foo Bar Baz')

      let uncolored = stripAnsi(stdoutSpy.calls[0].arguments[0])

      expect(/Foo Bar Baz\r\n$/gm.test(uncolored)).toBe(true)
      expect(/INFO:test.js\]/gm.test(uncolored)).toBe(true)

      done()
    })

    it('Should create directory when directory is set', done => {
      logger.setDirectory('./logs')
      let log = logger()
      log.info('Hello Man')
      setTimeout(function() {
        expect(isDir.sync('./test/logs')).toBe(true)
        expect(isFile('./test/logs/log-'+getDate()+'.log')).toBe(true)
        done()
      }, 1000)
    })

  })

  describe('Test Debug', () => {
    afterEach(done => {
      process.env.DEBUG = undefined
      done()
    })

    it('Should debug everything', done => {
      process.env.DEBUG = 'true'

      let log1 = logger()
        , log2 = logger('test')

      log1.debug('Foo Bar Baz')
      log2.debug('Foo Bar Baz')

      let uncolored1 = stripAnsi(stderrSpy.calls[0].arguments[0])
        , uncolored2 = stripAnsi(stderrSpy.calls[1].arguments[0])

      expect(/Foo Bar Baz\r\n$/gm.test(uncolored1)).toBe(true)
      expect(/DEBUG:test.js\]/gm.test(uncolored1)).toBe(true)

      expect(/Foo Bar Baz\r\n$/gm.test(uncolored2)).toBe(true)
      expect(/DEBUG:test\]/gm.test(uncolored2)).toBe(true)

      done()
    })

    it('Should debug only test.js', done => {
      process.env.DEBUG = 'test.js'

      let log1 = logger()
        , log2 = logger('test')

      log1.debug('Foo Bar Baz')
      log2.debug('Foo Bar Baz')

      let uncolored = stripAnsi(stderrSpy.calls[0].arguments[0])

      expect(/Foo Bar Baz\r\n$/gm.test(uncolored)).toBe(true)
      expect(/DEBUG:test.js\]/gm.test(uncolored)).toBe(true)

      expect(stderrSpy.calls.length).toEqual(1)

      done()
    })

    it('Should debug in the directory', done => {
      process.env.DEBUG = 'true'
      logger.setDirectory('./logs')

      let log = logger()

      log.debug('Foo Bar Baz')
      setTimeout(function() {
        expect(isDir.sync('./test/logs')).toBe(true)
        expect(isFile('./test/logs/log-'+getDate()+'.log')).toBe(true)
        done()
      }, 1000)
    })

    it('Should debug only test.js in the directory', done => {
      process.env.DEBUG = 'test.js'
      logger.setDirectory('./logs')

      let log1 = logger()
        , log2 = logger('test')

      log1.debug('Foo Bar Baz')
      log2.debug('Foo Bar Baz')

      setTimeout(function() {
        expect(isDir.sync('./test/logs')).toBe(true)
        expect(isFile('./test/logs/log-'+getDate()+'.log')).toBe(true)
        done()
      }, 1000)
    })

  })

})
