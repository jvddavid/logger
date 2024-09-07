import type { LoggerLevel, LoggerOptions, LoggerTargets, LoggerType, PrettyLoggerOptions } from '@/interfaces'
import pino from 'pino'

export class Logger implements LoggerType {
  private pino: pino.Logger
  private options: LoggerOptions
  private _level: LoggerLevel = 'info'

  get level() {
    return this._level
  }

  constructor(options?: LoggerOptions) {
    this.options = {
      ...options,
      pino: undefined
    }
    if (!options) {
      this.pino = this.createPinoLogger({})
      return
    }
    if (options.level) {
      this._level = options.level
    }
    if (options.pino) {
      this.pino = options.pino
      return
    }
    this.pino = this.createPinoLogger(options)
  }

  private createPinoLogger(options: LoggerOptions): pino.Logger {
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
      level: this.level,
      transport: {
        targets
      }
    })
  }

  private standardTargets(options: LoggerOptions): LoggerTargets {
    const targets: LoggerTargets = []
    const stdOptions = options.standard || {
      enabled: true,
      level: this.level,
      pretty: true
    }

    let prettyOption: PrettyLoggerOptions
    if (typeof stdOptions.pretty === 'boolean') {
      prettyOption = {
        enabled: stdOptions.pretty,
        colorize: true,
        ignore: 'pid,hostname'
      }
    }
    else {
      prettyOption = stdOptions.pretty || {
        enabled: true,
        colorize: true,
        ignore: 'pid,hostname'
      }
    }

    if (prettyOption.enabled) {
      targets.push({
        target: 'pino-pretty',
        level: stdOptions.level || this.level,
        options: {
          sync: false,
          colorize: prettyOption.colorize ?? true,
          translateTime: 'yyyy-mm-dd HH:MM:ss.l',
          ignore: prettyOption.ignore,
          destination: 1
        }
      })
    }
    else {
      targets.push({
        target: 'pino/file',
        level: stdOptions.level || this.level,
        options: {
          sync: false,
          destination: 1
        }
      })
    }
    return targets
  }

  private fileTargets(options: LoggerOptions): LoggerTargets {
    const targets: LoggerTargets = []
    for (const file of options.files || []) {
      let prettyOption: PrettyLoggerOptions
      if (typeof file.pretty === 'boolean') {
        prettyOption = {
          enabled: file.pretty,
          colorize: true,
          ignore: 'pid,hostname'
        }
      }
      else {
        prettyOption = file.pretty || {
          enabled: false
        }
      }

      if (prettyOption.enabled) {
        targets.push({
          target: 'pino-pretty',
          level: file.level || this.level,
          options: {
            sync: false,
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss.l',
            ignore: prettyOption.ignore ?? 'pid,hostname',
            destination: file.path,
            mkdir: true
          }
        })
      }
      else {
        targets.push({
          target: 'pino/file',
          level: file.level || this.level,
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
    const targets: LoggerTargets = []

    for (const folder of options.folders || []) {
      if (folder.enabled === false) {
        continue
      }
      targets.push({
        target: '@jvddavid/pino-rotating-file',
        level: folder.level || this.level,
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

  get silent() {
    return this.pino.silent.bind(this.pino)
  }
}
