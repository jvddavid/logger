import type { LoggerOptions, LoggerTargets, LoggerType } from '@/interfaces'

import pino from 'pino'

export class Logger implements LoggerType {
  private pino: pino.Logger

  constructor(options?: LoggerOptions) {
    this.pino = this.createPinoLogger(options || {})
  }

  private createPinoLogger(options: LoggerOptions): pino.Logger {
    const defaultLevel = options.level || 'info'
    const targets: LoggerTargets = []

    if (options.standard?.enabled !== false) {
      targets.push(...this.standardTargets(options))
    }

    if (options.files) {
      targets.push(...this.fileTargets(options))
    }

    return pino({
      name: options.name || 'app',
      level: defaultLevel,
      transport: {
        targets
      }
    })
  }

  private standardTargets(options: LoggerOptions): LoggerTargets {
    const defaultLevel = options.level || 'info'
    const targets: LoggerTargets = []
    const stdOptions = options.standard || {
      enabled: true,
      level: defaultLevel,
      pretty: true
    }

    let prettyOption: {
      enabled?: boolean
      colorize?: boolean
    }
    if (typeof stdOptions.pretty === 'boolean') {
      prettyOption = {
        enabled: stdOptions.pretty,
        colorize: true
      }
    } else {
      prettyOption = stdOptions.pretty || {
        enabled: true,
        colorize: true
      }
    }

    if (prettyOption.enabled) {
      targets.push({
        target: 'pino-pretty',
        level: stdOptions.level || defaultLevel,
        options: {
          sync: false,
          colorize: prettyOption.colorize ?? true,
          translateTime: 'yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname',
          destination: 1
        }
      })
    } else {
      targets.push({
        target: 'pino/file',
        level: stdOptions.level || defaultLevel,
        options: {
          sync: false,
          destination: 1
        }
      })
    }
    return targets
  }

  private fileTargets(options: LoggerOptions): LoggerTargets {
    const defaultLevel = options.level || 'info'
    const targets: LoggerTargets = []
    for (const file of options.files || []) {
      let prettyOption: {
        enabled?: boolean
        colorize?: boolean
      }
      if (typeof file.pretty === 'boolean') {
        prettyOption = {
          enabled: file.pretty,
          colorize: true
        }
      } else {
        prettyOption = file.pretty || {
          enabled: false
        }
      }

      if (prettyOption.enabled) {
        targets.push({
          target: 'pino-pretty',
          level: file.level || defaultLevel,
          options: {
            sync: false,
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
            destination: file.path,
            mkdir: true
          }
        })
      } else {
        targets.push({
          target: 'pino/file',
          level: file.level || defaultLevel,
          options: {
            mkdir: true,
            sync: false,
            destination: file.path
          }
        })
      }
    }
    return targets
  }

  public updateOptions(options: LoggerOptions): void {
    this.pino = this.createPinoLogger(options)
  }

  get log() {
    return this.pino.info.bind(this.pino)
  }
}
