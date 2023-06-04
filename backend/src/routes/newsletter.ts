import express from 'express'
import { validateEmail } from '../utils/validation'
import { EmailsModel } from '../database/models/emails'
import { all, insert } from '../database/controllers/generic'

const router = express.Router()

router.route('/test')
  .post(insert(EmailsModel, { email: validateEmail }))  
  .get(all(EmailsModel))

router.route('/join')
  .post(insert(EmailsModel, { email: validateEmail }))

router.route('/unsubscribe/:id' || '/unsubscibe')
  .patch(() => console.log('patch'))

router.route('/contacts')
  .get(all(EmailsModel))

export { router as newsletterRouter }