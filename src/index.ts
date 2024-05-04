import type { LoggerOptions, LoggerTargets, LoggerType } from '@/interfaces'
import pino from 'pino'

export class Logger implements LoggerType {
  private pino: pino.Logger
  private options: LoggerOptions

  constructor(options?: LoggerOptions) {
    this.options = {
      ...options,
      pino: undefined
    }
    if (!options) {
      this.pino = this.createPinoLogger({})
      return
    }
    if (options.pino) {
      this.pino = options.pino
      return
    }
    this.pino = this.createPinoLogger(options)
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

    if (options.folders) {
      targets.push(...this.folderTargets(options))
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

  private folderTargets(options: LoggerOptions): LoggerTargets {
    const defaultLevel = options.level || 'info'
    const targets: LoggerTargets = []

    for (const folder of options.folders || []) {
      if (folder.enabled === false) {
        continue
      }
      targets.push({
        target: '@jvddavid/pino-rotating-file',
        level: folder.level || defaultLevel,
        options: {
          path: folder.folder,
          pattern: folder.pattern || 'log-%Y-%M-%d-%N.log',
          maxSize: folder.maxSize || 10 * 1024 * 1024
        }
      })
    }
    return targets
  }

  public updateOptions(options: LoggerOptions): void {
    this.pino = this.createPinoLogger(options)
  }

  child(bindings: Record<string, unknown>) {
    return new Logger({
      ...this.options,
      name: this.options.name || this.options.name || 'app',
      pino: this.pino.child(bindings)
    })
  }

  get log() {
    return this.pino.info.bind(this.pino)
  }
  get info() {
    return this.pino.info.bind(this.pino)
  }

  get trace() {
    return this.pino.trace.bind(this.pino)
  }

  get debug() {
    return this.pino.debug.bind(this.pino)
  }

  get warn() {
    return this.pino.warn.bind(this.pino)
  }

  get error() {
    return this.pino.error.bind(this.pino)
  }

  get fatal() {
    return this.pino.fatal.bind(this.pino)
  }
}

export default Logger
