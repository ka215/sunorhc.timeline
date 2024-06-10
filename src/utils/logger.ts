//import pino, { Logger } from 'pino'

interface LoggerOptions {
    debug: boolean;
    logFilePath?: string;
}

// Stub for external logger module not provided.
class LoggerStub {
    trace(...args: any[]): void { console.trace(...args) }
    debug(...args: any[]): void { console.debug(...args) }
    info(...args:  any[]): void { console.info(...args) }
    error(...args: any[]): void { console.error(...args) }
}

export class LoggerService {
    private logger: any // for switching pino.Logger or LoggerStub
    private debug: boolean

    constructor(options: LoggerOptions) {
        this.debug = options.debug
        const transports = []

        if (options.debug) {
            transports.push({
                target: 'pino-pretty',
                options: {
                    colorize: true,
                },
                level: 'debug',
            })
        }

        if (!!options.logFilePath) {
            transports.push({
                target: 'pino/file',
                options: {
                    destination: `@/../logs/${options.logFilePath}`,
                    mkdir: true,
                },
                level: this.debug ? 'trace' : 'info',
            })
        }

        try {
            const pino = require('pino')
            this.logger = pino({
                level: this.debug ? 'trace' : 'info',
                transport: {
                    targets: transports,
                },
            })
        } catch (error) {
            //console.error('Failed to load pino:', error)
            this.logger = new LoggerStub()
        }
    }

    log(...message: unknown[]): void {
        if (this.debug) {
            this.logger.trace(...message as [unknown[]])
        } else {
            this.logger.debug(...message as [unknown[]])
        }
    }

    info(...message: unknown[]): void {
        this.logger.info(...message as [unknown[]])
    }

    error(...message: unknown[]): void {
        this.logger.error(...message as [unknown[]])
    }

}

export const devLogger = (): LoggerService => {
    return new LoggerService({
        debug: process.env.NODE_ENV === 'development',
        logFilePath: 'dev-log.log',       
    })
}
