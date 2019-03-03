import path from 'path'
import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import { config } from "./config"
import { Logger } from './utils/logger';
import midiRoutes from "./routes/midi.routes"

export class WebServer {

    constructor(private log: Logger) { }
    async init() {
        const app = express()

        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(cookieParser())
        app.use(compress())
        // secure apps by setting various HTTP headers
        app.use(helmet())
        // enable CORS - Cross Origin Resource Sharing
        app.use(cors())
        app.use("/", this.reqLogger.bind(this))
        app.use("/", midiRoutes)
        const CURRENT_WORKING_DIR = process.cwd()
        app.use(express.static(path.join(CURRENT_WORKING_DIR, 'client/build')));

        app.get('*', (req, res) => {
            res.sendFile(path.join(CURRENT_WORKING_DIR, 'client/build', 'index.html'));
        });
        app.listen(config.PORT, () => {
            this.log.info(`Web server started on port ${config.PORT}.`)
        })
    }
    reqLogger(req: Request, res: Response, next: NextFunction) {
        this.log.info(`Url: ${req.path}, body:`, JSON.stringify(req.body))
        next()
    }
}


