# logger
Simple logging utility for Node

## Introduction
Log format is `[TIMESTAMP:MSG_TYPE:APP_NAME] MESSAGE`
* `TIMESTAMP`

  timestamp format is `HH:mm:ss`.

* `MSG_TYPE`

  Type of log like `INFO`, `WARN`, `ERROR` and `DEBUG`.

* `APP_NAME`

  Application name is mean what application you want to inform with.

* `MESSAGE`

  Your log message.

## API
* constructor
  Constructor is have argument for `APP_NAME`, but this is optional. The default
  is base on file call the instance.

* setDirectory
  When we set the log directory it will never show on the console.

### Logger API
* info
* warn
* error
* debug

  Debug will show when using `DEBUG` environment.

Logger API is using `sprintf` from [sprintf-js](https://www.npmjs.com/package/sprintf-js).

## DEBUG Environment
To show all `log.debug` you must set `DEBUG=true`, but if you want partially debug
your application you can set `DEBUG` environment to `APP_NAME` into separated with comma.

For Example:
* `DEBUG=index.js`
* `DEBUG=callcenter_inbound,callcenter_outbound`
* `DEBUG=app.js,controller/home.js`

## Usage
* Using Console
```js
const logger = require('@varnxy/logger')

let log = logger('my_app')
log.info('Some Information')
// Output: [2019:02:12:INFO:my_app] Some Information
log.info('The data is: %s', JSON.stringify({foo: 'bar'}))
// Output: [2019:02:12:INFO:my_app] The data is: {"foo": "bar"}
log.warn('Some Information')
// Output: [2019:02:13:WARN:my_app] Some Information
log.warn('Disk Usage: %d', myDisk)
// Output: [2019:02:13:WARN:my_app] Disk Usage: 1050624
log.error('Some Information')
// Output: [2019:02:14:ERROR:my_app] Some Information
log.error('Error Application: %s', err)
// Output: [2019:02:14:ERROR:my_app] Error: Error message
```

* Using Log Directory
```js
const logger = require('@varnxy/logger')
logger.setDirectory('./logs')
let log = logger('my_app')
log.info('Some Information')
// Output:
// [2019:02:12:INFO:my_app] Some Information
log.warn('Some Information')
// Output:
// [2019:02:12:INFO:my_app] Some Information
// [2019:02:13:WARN:my_app] Some Information
log.error('Some Information')
// Output:
// [2019:02:12:INFO:my_app] Some Information
// [2019:02:13:WARN:my_app] Some Information
// [2019:02:14:ERROR:my_app] Some Information
```
