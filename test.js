const logger = require('.')
    , test = require('ava')
    , isDir = require('is-dir')
    , ansiStyles = require('ansi-styles')
    , execSync = require('child_process').execSync

test('Test directory exists when using logger directory', t => {
  logger.setDirectory('./logs')

  let log = logger()

  t.is(isDir('./logs'), true)
  execSync('rm -r logs')
  logger.setDirectory(null)
})
