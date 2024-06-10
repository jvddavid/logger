import type { Logger as PinoLogger } from 'pino'

export type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent'

interface TransportTargetOptions<TransportOptions = Record<string, unknown>> {
  target: string
  options?: TransportOptions
  level?: LoggerLevel
}

export type LoggerTargets = TransportTargetOptions[]

interface PrettyLoggerOptions {
  enabled?: boolean // default: true
  colorize?: boolean // default: true
}

type PrettyOption = boolean | PrettyLoggerOptions

interface StandardLoggerOptions {
  enabled?: boolean // default: true
  level?: LoggerLevel // default: 'info'
  pretty?: PrettyOption // default: true
}

interface FileLoggerOptions {
  enabled?: boolean // default: true
  path: string // default: 'logs/app.log'
  level?: LoggerLevel // default: 'info'
  pretty?: PrettyOption // default: false
}

interface FolderLoggerOptions {
  enabled?: boolean // default: true
  folder: string // default: 'logs'
  pattern?: string // default: '%Y-%M-%d.log'
  maxSize?: number // default: 10485760 (10MB)
  level?: LoggerLevel
}

export interface LoggerOptions {
  name?: string
  level?: LoggerLevel
  standard?: StandardLoggerOptions
  files?: FileLoggerOptions[]
  folders?: FolderLoggerOptions[]
  pino?: PinoLogger
}

interface LogFn {
  <T extends object>(obj: T, msg?: string, ...args: unknown[]): void
  (obj: unknown, msg?: string, ...args: unknown[]): void
  (msg: string, ...args: unknown[]): void
}

export interface LoggerType {
  log: LogFn
  trace: LogFn
  debug: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
  fatal: LogFn
}
