import express from 'express'
import { validateEmail } from '../utils/validation'
import { EmailsModel } from '../database/models/emails'
import { all, change, deleteAll, insert } from '../database/controllers/generic'
import { ReqType, ResType } from '../types/apiObjects'
import { saveAndExit } from '../database/controllers/utils'

const router = express.Router()

router.route('/test')
  .post(insert(EmailsModel, { email: validateEmail }))  
  .get(all(EmailsModel))
  .patch(change(EmailsModel))

router.route('/join')
  .post(insert(EmailsModel, { email: validateEmail }))

router.route('/unsubscribe')
  .patch(async function(req: ReqType, res: ResType) {
    const id = req.api?.body.id
    const data = await EmailsModel.findById(id)
    data!.isActive = 'false'
    saveAndExit(data as any, { req, res })
  })

router.route('/subscribe')
  .patch()

router.route('/contacts')
  .get(all(EmailsModel))

router.route('/delete/all')
  .get(deleteAll(EmailsModel))

export { router as newsletterRouter }