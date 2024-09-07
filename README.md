# Logger

A abstraction of the pino logger to support standard output, file output and rotating file output by the options object.

## Install

```bash
npm i @jvddavid/logger
```

## Use

```javascript
const logger = new Logger({
  name: 'demo',
  level: 'info',
  standard: {
    enabled: true,
    pretty: true
  },
  files: [
    {
      path: 'logs/demo.log',
      pretty: {
        enabled: true,
        colorize: true
      },
      level: 'info'
    }
  ],
  folders: [
    {
      folder: 'logs',
      pattern: 'log-%Y-%M-%d-%N.log',
      maxSize: 10 * 1024 * 1024,
      level: 'info'
    }
  ]
})
logger.log(
  {
    message: 'Hello, world!'
  },
  'Hello, world!'
)
```
