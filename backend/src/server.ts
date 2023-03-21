import express from 'express'
import dotenv from 'dotenv'
import { packagesRouter } from './routes/packages'
import { requestsRouter } from './routes/requests'

dotenv.config()
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('build'))

app.use('/api/packages', packagesRouter)
app.use('/api/requests', requestsRouter)

const port = setPort()
app.listen(port, function(){
	console.log(`Server running on port ${port}`)
})

function setPort(port: number = 6047): string {
	return process.env.PORT || String(port)
}