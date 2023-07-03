import http from 'http'
import express from 'express'
import cors from 'cors'
import config from './config'
import { connectDB } from './database/db'
import { init } from './middleware/init'
import { apiRouter } from './routes/router'
import { log } from './utils/logs'

import './auth/server'
import './utils/parse'

/** get constants from config file */
const serverPort = config.constants.conn.port
const databaseUri = config.constants.mongo.dev

/** connect db & connect server */
connectDB({
	uri: databaseUri,
	name: 'Goat Pen'
}, startServer)

/** function to start server */
function startServer(): void {
	// init server
	const app = express()
	
	// third party middleware config
	app.use(express.urlencoded({extended: true}))
	app.use(express.json())
	app.use(cors())
	app.use(express.static('build'))
	
	// custom middleware
	app.use(init)
	
	// api router
	app.use('/api', apiRouter)

	http.createServer(app).listen(serverPort, function(){
		log.info(`Goat Pen server running on port ${serverPort}`)
	})
}