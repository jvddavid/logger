import type { LogFn, TransportTargetOptions } from 'pino'

export type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

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

interface StreamLoggerOptions {
  enabled?: boolean // default: true
  stream: NodeJS.WritableStream // default: process.stdout
  level?: LoggerLevel // default: 'info'
  pretty?: PrettyOption // default: false
}

interface FolderLoggerOptions {
  enabled?: boolean // default: true
  folder: string // default: 'logs'
  pattern?: string // default: '%Y-%M-%d.log'
  maxSize?: number // default: 10485760 (10MB)
  level?: LoggerLevel
  pretty?: PrettyOption // default: false
}

export interface LoggerOptions {
  name?: string
  level?: LoggerLevel
  standard?: StandardLoggerOptions
  files?: FileLoggerOptions[]
  streams?: StreamLoggerOptions[]
  folders?: FolderLoggerOptions[]
}

export interface LoggerType {
  log: LogFn
}
