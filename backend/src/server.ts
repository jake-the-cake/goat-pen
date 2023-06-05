import express from 'express'
import cors from 'cors'
import config from './config'
import { connectDB } from './database/db'
import { init } from './database/controllers/generic'
import { apiRouter } from './routes/router'

// get constants from config file
const serverPort = config.conn.port
const databaseUri = config.mongo.dev

// init server, connect db, & connect server
const app = express()
connectDB(databaseUri, startServer)

// third party middleware config
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// custom middleware
app.use(init)

// api router
app.use('/api', apiRouter)

// function to start server
function startServer(): void {
	app.listen(serverPort, function(){
		console.log(`Server running on port ${serverPort}`)
	})
}