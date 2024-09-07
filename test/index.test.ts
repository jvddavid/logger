import { describe, expect, it } from 'vitest'

import { Logger } from '../src/index'

describe(
  'Logger',
  () => {
    it(
      'should create a new logger',
      async () => {
        const logger = new Logger({
          name: 'test',
          level: 'info',
          standard: {
            enabled: true,
            pretty: true
          },
          files: [
            {
              path: 'logs/test.log',
              level: 'info'
            }
          ],
          folders: [
            {
              folder: 'logs',
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
        await new Promise((resolve) => setTimeout(
          resolve,
          1000
        ))
        expect(logger).toBeDefined()
      }
    )

    it(
      'should update the logger options',
      () => {
        const logger = new Logger({ name: 'test' })
        logger.updateOptions({ name: 'test2' })
        expect(logger).toBeDefined()
      }
    )
  }
)
