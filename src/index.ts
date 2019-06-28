import '@babel/polyfill'

import { WebServer } from './web-server'
import { Logger } from './utils/logger';

const log = new Logger()

async function init() {
    const webServer = new WebServer(log)
    await webServer.init()
}

init()
    .then(() => log.info('App started.'))
    .catch(err => log.error(err))



