import { createLogger, transports, format } from "winston";
import Transport from "winston-transport";
import { Logger } from "winston";
import path from "path";
import fs from "fs";

export class Logging {
    private logger: Logger;
    private serviceName: string;

    constructor(serviceName: string) {
        this.serviceName = serviceName;
        
        // Always create the file transport
        const transporters = [this.createFileTransport()];
        
        // Add console transport in development mode
        if (process.env.NODE_ENV === "development") {
            transporters.push(this.createConsoleTransport());
        }
        
        this.logger = createLogger({
            transports: transporters,
            format: format.combine(
                format.timestamp({ format: this.timezonedFormatedTimestamp }),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${this.serviceName} ${level}: ${message}`;
                })
            ),
            defaultMeta: {
                service: serviceName,
            },
        });
    }

    public error(message: string | Error, ...args: any[]) {

        // If message is an Error object, log its stack trace
        if (message instanceof Error) {
            this.logger.error(message.stack || message.message);
            return;
        }

        // Handle the case where message is a string and args exist
        if (args.length > 0) {
            const errorArgs = args.map(arg => {
                if (arg instanceof Error) {
                    return arg.stack || arg.message;
                }
                return arg;
            });

            this.logger.error(`${message}${errorArgs.join(' ')}`);
        } else {
            this.logger.error(message);
        }
    }

    public info(message: string | Error, ...args: any[]) {
        // If message is an Error object, log its stack trace
        if (message instanceof Error) {
            this.logger.error(message.stack || message.message);
            return;
        }

        // Handle the case where message is a string and args exist
        if (args.length > 0) {
            const errorArgs = args.map(arg => {
                if (arg instanceof Error) {
                    return arg.stack || arg.message;
                }
                return arg;
            });

            this.logger.info(`${message}${errorArgs.join(' ')}`);
        } else {
            this.logger.info(message);
        }
    }

    private timezonedFormatedTimestamp() {
        return new Date().toLocaleString("de-DE", {
            timeZone: "Europe/Berlin",
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    private createFileTransport(): Transport {
        const today = this.setToday();
        const logDir = path.resolve(__dirname, '../logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        const logFilePath = path.join(logDir, `${today}.log`);
        
        return new transports.File({
            filename: logFilePath,
            format: format.combine(
                format.timestamp({ format: this.timezonedFormatedTimestamp }),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${this.serviceName} ${level}: ${message}`;
                })
            )
        });
    }

    private createConsoleTransport(): Transport {
        return new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp({ format: this.timezonedFormatedTimestamp }),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${this.serviceName} ${level}: ${message}`;
                })
            )
        });
    }

    private setToday() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        return `${dd}-${mm}-${yyyy}`; //
    }
}