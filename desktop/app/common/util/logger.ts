import {logFolder} from "../config/const";
import * as path from "path";
import * as fs from "fs"
import {transport} from "winston";

const winston = require('winston');


const dateFormat = () => {
    const date = new Date();
    const addZero = (number: string, count: number = 2) => {
        for (let i = 0; i < count - number.length; i++) {
            number = '0' + number;
        }
        return number;
    }
    const day = addZero(date.getDate().toString());
    const month = addZero(date.getMonth().toString())
    const year = addZero(date.getFullYear().toString());
    const h = addZero(date.getHours().toString())
    const mn = addZero(date.getMinutes().toString());
    const s = addZero(date.getSeconds().toString())

    return `${day}/${month}/${year} -- ${h}:${mn}:${s}`
}

const getLogFile = (...node: string[]) => path.join(logFolder, ...node)

const getFormat = (colorize: boolean) => {
    const formats = [
        winston.format.timestamp({
            format: dateFormat
        }),
        winston.format.prettyPrint(),
    ]

    if (colorize) {
        formats.push(winston.format.colorize({
            all: true, colors: {
                info: "cyan",
                request: "green",
                debug: "yellow",
                warning: "orange",
                error: "red",
            }
        }));
    }

    return winston.format.combine(...formats);
};

function getTransports(service: string): transport[] {
    const transports: transport[] = [];
    const colorFormat = getFormat(true);
    const noColorFormat = getFormat(false);
    let logPath = path.join(logFolder, service);

    console.log(`ensure ${logPath}`)
    if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, {recursive: true});
    }
    console.log("exist", fs.existsSync(logPath));
    transports.push(
        new winston.transports.File({
            filename: getLogFile(service, 'error.color.log'), level: 'error',
            format: colorFormat
        }),
        new winston.transports.File({
            filename: getLogFile(service, 'combined.color.log'),
            format: colorFormat
        }),
        new winston.transports.File({
            filename: getLogFile(service, 'error.log'), level: 'error',
            format: noColorFormat
        }),
        new winston.transports.File({
            filename: getLogFile(service, 'combined.log'),
            format: noColorFormat
        }),
    )

    transports.push(
        new winston.transports.Console({})
    )

    return transports;
}


export function initLogger(service: string) {


    return winston.createLogger({
        defaultMeta: {service: `@android-windows-link/desktop-${service}`},
        levels: {
            info: 3,
            request: 4,
            debug: 2,
            warning: 1,
            error: 0,
        },
        transports: getTransports(service),
        level: "request"
    });

}

