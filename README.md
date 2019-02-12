# logger
Simple logging utility for Node

## Usage
* Using Console
```js
const logger = require('@varnxy/logger')

let log = logger('my_app')
log.info('Some Information')
// Output: [2019:02:12:INFO:my_app] Some Information
log.warn('Some Information')
// Output: [2019:02:13:WARN:my_app] Some Information
log.error('Some Information')
// Output: [2019:02:14:ERROR:my_app] Some Information
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
