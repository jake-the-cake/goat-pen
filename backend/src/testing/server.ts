import http from 'http'
import express from 'express'
import cors from 'cors'
import testConfig from './config'
import { connectDB } from '../database/db'
import { log } from '../utils/logs'
// import { ReqType, ResType } from '../types/apiObjects'
// import { Schema, model } from 'mongoose'
import { runQuiggleTest } from './test'
import readline from 'readline'
import router from './routes'

/** get constants from config file */
const serverPort = testConfig.testingPort
const databaseUri = testConfig.testingDbUri

/** connect db & connect server */
connectDB({
	uri: databaseUri,
	name: 'Quiggle Test'
}, startServer)

/** function to start server */
function startServer(): void {

	// init server
	const app = express()
	
	// third party middleware config
	app.use(express.urlencoded({extended: true}))
	app.use(express.json())
	app.use(cors())

	// for testing control panel
	// app.use(express.static('build'))
	/** TODO */
	
	// custom middleware
	/** TODO */

	// api router
	app.use('/', router)

	// create the server
	http.createServer(app).listen(serverPort, function(){
		log.info(`Quiggle Test server running on port ${serverPort}`);
		(function runPrompt() {
			readline.createInterface({
				input: process.stdin,
				output: process.stdout
			}).question('Would you like to run all tests? [Y/n] ', (answer: string): void => {
				if (answer.toUpperCase() === 'Y') runQuiggleTest()
				else if ( answer.toUpperCase() !== 'N') {
					log.err('You have entered an invalid response.')
					runPrompt()
				}
				else log.warn('Tests will not be run.')
			})
		})()
	})
}