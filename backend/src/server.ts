import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { packagesRouter } from './routes/packages'
import { requestsRouter } from './routes/requests'
import { newsletterRouter } from './routes/newsletter'
import { connectDB } from './database/db'
import { init } from './database/controllers/generic'

dotenv.config()
const app = express()
connectDB()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(init)

app.use('/api/packages', packagesRouter)
app.use('/api/requests', requestsRouter)
app.use('/api/newsletter', newsletterRouter)

const port = setPort()
app.listen(port, function(){
	console.log(`Server running on port ${port}`)
})

function setPort(port: number = 6047): string {
	return process.env.PORT || String(port)
}