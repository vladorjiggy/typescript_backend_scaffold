import { createLogger, transports, format } from "winston";
import Transport from "winston-transport";
import { Logger } from "winston";

export class Logging {
    private logger: Logger;
    constructor(serviceName: string, transporter: string, type: string) {
        this.logger = createLogger({
            transports: [this.setTransporter(transporter, type)],
            format: format.combine(
                format.colorize(),
                format.timestamp({ format: this.timezonedFormatedTimestamp }),
                format.printf(({ timestamp, level, message, service }) => {
                    return `[${timestamp}] ${service} ${level}: ${message}`;
                })
            ),
            defaultMeta: {
                service: serviceName,
            },
        });
    }

    public info(message: string, ...args: any[]) {
        this.logger.info(message);
        if (args.length > 0) {
            args.forEach(arg => {
                this.logger.info(arg);
            });
        }
    }

    public error(message: string, ...args: any[]) {
        this.logger.error(message);
        if (args.length > 0) {
            args.forEach(arg => {
                this.logger.error(arg);
            });
        }
    }

    public warn(message: string, ...args: any[]) {
        this.logger.warn(message);
        if (args.length > 0) {
            args.forEach(arg => {
                this.logger.warn(arg);
            });
        }
    }

    public debug(message: string, ...args: any[]) {
        this.logger.debug(message);
        if (args.length > 0) {
            args.forEach(arg => {
                this.logger.debug(arg);
            });
        }
    }

    public verbose(message: string, ...args: any[]) {
        this.logger.verbose(message);
        if (args.length > 0) {
            args.forEach(arg => {
                this.logger.verbose(arg);
            });
        }
    }

    public silly(message: string, ...args: any[]) {
        this.logger.silly(message);
        if (args.length > 0) {
            args.forEach(arg => {
                this.logger.silly(arg);
            });
        }
    }

    private timezonedFormatedTimestamp() {
        return new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
    }

    private setTransporter(transporter: string, type: string) {
        const today = this.setToday();
        let t: Transport;
        if (transporter == "file") {
            t = new transports.File({ filename: `../logs/${type}-${today}.log` });
        }
        else {
            t = new transports.Console();
        }
        return t;
    }

    private setToday() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    }
}
