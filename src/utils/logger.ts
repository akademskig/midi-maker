
import chalk from 'chalk'
export class Logger {
    constructor() { }

    info(...msg: string[]) {
        console.log(chalk.cyan(Date.now().toString(), ...msg))
    }
    warn(...msg: string[]) {
        console.log(chalk.rgb(255, 153, 102)(Date.now().toString(), ...msg))
    }
    error(...msg: string[]) {
        console.log(chalk.red(Date.now().toString(), ...msg))
        console.error(msg)
    }
}