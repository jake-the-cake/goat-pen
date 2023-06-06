import express from 'express'
import { newsletterRouter } from './newsletter'
import { packagesRouter } from './packages'
import { requestsRouter } from './requests'

const router = express.Router()

router.use('/newsletter', newsletterRouter)
router.use('/packages', packagesRouter)
router.use('/requests', requestsRouter)

export { router as apiRouter }