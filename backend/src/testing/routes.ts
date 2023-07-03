import express from 'express'
import { ReqType, ResType } from '../types/apiObjects'
import { log } from '../utils/logs'
import TestingModels from './models'

const router = express.Router()

router
	.post('/insert/new', function(req: ReqType, res: ResType): void {
		log.log('Creating test agenda data entry')
		const newAgenda = new TestingModels.data({
			id: req.body.id, info: req.body
		})
		try {
			newAgenda.save()
			res.status(201).json(newAgenda)
		} catch (err: any) {
			log.err(err.message)
			log.warn(err.stack)
			res.status(400).json(err)
		}
	})

router
	.post('/insert/tests', async function(req: ReqType, res: ResType): Promise<void> {
		log.log(`** Adding test '${req.body.title}' to agenda`)
		const foundAgenda = await TestingModels.data.find({id: req.body.id})
		const newTest = new TestingModels.tests({
			title: req.body.title, info: req.body
		})
		try {
			foundAgenda[0].tests.push(newTest._id)
			foundAgenda[0].save()
			res.status(201).json(foundAgenda[0])
		} catch (err: any) {
			log.err(err.message)
			log.warn(err.stack)
			res.status(400).json(err)
		}
	})

router
	.get('/all', async function(req: ReqType, res: ResType): Promise<void> {
		log.log('Getting all test data from database')
		res.status(200).json(await TestingModels.data.find())
	})

export default router