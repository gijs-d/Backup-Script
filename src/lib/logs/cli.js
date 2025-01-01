const fs = require('fs');
const logFile = 'logs.txt';
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m',
};

class Cli {
    prefix = [];
    saveToFile = false;

    constructor() {
        this.prefix = [...arguments];
    }

    formatText(text, type, save = true) {
        const timestamp = new Date().toISOString().split('.')[0];
        const pref = this.prefix.join('/');
        const log = `${timestamp}${pref && ` | ${pref}`}${type && ` | ${type}`} : ${text} ;`;
        if (save && this.saveToFile) {
            this.logToFile(log);
        }
        return log;
    }

    logToFile(log) {
        try {
            fs.promises.appendFile(logFile, `${log} \n`);
        } catch (e) {
            const text = `${
                new Date().toISOString().split('.')[0]
            } | logs/cli.js | error : Save log failed ${e} ;`;
            this.print('error', 'red', text);
        }
    }

    print(type, color, text) {
        console.log(colors[color]+ this.formatText(text, type), colors.reset);
    }

    async custom(type, color, text) {
        this.print(type, color, text);
    }

    async log(text) {
        this.print('log', 'reset', text);
    }

    async info(text) {
        this.print('info', 'cyan', text);
    }

    async http(text) {
        this.print('http', 'cyan', text);
    }

    async succes(text) {
        this.print('succes', 'green', text);
    }

    async warn(text) {
        this.print('warn', 'yellow', text);
    }

    async error(text) {
        this.print('error', 'red', text);
    }

    async tempLog(text) {
        process.stdout.write(`${colors.reset} ${this.formatText(text, 'tempLog', false)}  \r`);
    }
}

module.exports = Cli;
