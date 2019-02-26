import '@babel/polyfill'

import { WebServer } from './web-server'
import { Logger } from './utils/logger';
import { Db } from './db';



const log = new Logger()

async function init() {
    const webServer = new WebServer(log)
    const mongoDb = new Db(log)

    await webServer.init()
    await mongoDb.init()
}

init()
    .then(() => log.info('App started.'))
    .catch(err => log.error(err))



