import express from 'express'
import { validateEmail } from '../utils/validation'
import { EmailsModel } from '../database/models/emails'
import { collectAll, change, removeAll, insert, remove } from '../database/controllers/generic'
import { ReqType, ResType } from '../types/apiObjects'
import { saveAndExit } from '../database/controllers/utils'

const router = express.Router()
const primaryModel = EmailsModel

router.route('/test')
  .post(insert(primaryModel, { email: validateEmail }))  
  .get(collectAll(primaryModel))
  .patch(change(primaryModel))

router.route('/insert')
  .post(insert(primaryModel, { email: validateEmail }))

router.route('/unsubscribe')
  .patch(async function(req: ReqType, res: ResType) {
    const id = req.api?.body.id
    const data = await primaryModel.findById(id)
    data!.isActive = 'false'
    saveAndExit(data as any, { req, res })
  })

router.route('/subscribe')
  .patch()

router.route('/collect/all')
  .get(collectAll(primaryModel))

router.route('/remove')
  .get (remove(primaryModel))

router.route('/remove/all')
  .get(removeAll(primaryModel))

export { router as newsletterRouter }