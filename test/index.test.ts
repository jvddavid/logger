import { describe, expect, it } from 'bun:test'

import { Logger } from '@/index'

describe('Logger', () => {
  it('should create a new logger', async () => {
    const logger = new Logger({
      name: 'test',
      folders: [
        {
          folder: 'logs',
          level: 'info'
        }
      ]
    })
    logger.log('info', 'test')
    await new Promise(resolve => setTimeout(resolve, 1000))
    expect(logger).toBeDefined()
  })

  it('should update the logger options', () => {
    const logger = new Logger({ name: 'test' })
    logger.updateOptions({ name: 'test2' })
    expect(logger).toBeDefined()
  })
})
