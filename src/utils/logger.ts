import pino, { Logger } from 'pino'
//import winston, { Logger } from 'winston'
/*
export class LoggerService {
    private logger: Logger
    private debug: boolean

    constructor(debug: boolean = false) {
        this.debug = debug
        
        const transports = []
        
        if (process.env.NODE_ENV === 'development') {
            transports.push(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                ),
            }))
        }
        
        transports.push(new winston.transports.File({ filename: 'app.log' }))
        
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports
        })
    }

    log(...message: any[]) {
        if (this.debug) {
            this.logger.info(message.join(', '))
        }
    }

    error(...message: any[]) {
        if (this.debug) {
            this.logger.error(message.join(', '))
        }
    }

    info(...message: any[]) {
        if (this.debug) {
            this.logger.info(message.join(', '))
        }
    }

    // other log level...
}
*/
interface LoggerOptions {
    debug: boolean;
    logFilePath?: string;
}

export class LoggerService {
    private logger: Logger
    private debug: boolean

    constructor(options: LoggerOptions) {
        this.debug = options.debug

        const transports = []

        if (this.debug) {
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

        this.logger = pino({
            level: this.debug ? 'trace' : 'info',
            transport: {
                targets: transports,
            },
        })
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
