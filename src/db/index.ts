import mongoose from 'mongoose'
import { config } from "../config"
import { Logger } from '../utils/logger';
mongoose.Promise = global.Promise
export class Db {

    constructor(private log: Logger) { }

    async init() {
        const db = await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true
        })
        this.log.info(`Connected to mongo on url ${config.mongoUri}`)
        db.connection.on('error', () => {
            this.log.error('Unable to connect to the database.')
        })
    }
}
