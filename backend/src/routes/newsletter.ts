import express from 'express'
import { isEmail } from '../utils/validation'
import { EmailsModel } from '../database/models/emails'
import { all, insert } from '../database/controllers/generic'

export function reformatValidationMessage(message: string, key: string): string {
  return message.split(key + ':')[1]!.trim()
}

export function returnError(error: string) {
  return {
    error,
    status: 'fail'
  }
}

const router = express.Router()

router.route('/test')
  .post(insert(EmailsModel))
  .get(all(EmailsModel))

router.post('/join', async function(req, res){
  let newUser: any = {}
  const { email } = req.body
  if (await EmailsModel.findOne({ email })){
    newUser = returnError('That email has already signed up.')
  }
  else {
    try {
      newUser = new EmailsModel({ email })
      let error: any = newUser.validateSync()
      if (error) {
        const errMessage: string = reformatValidationMessage(error.message, 'email')
        newUser = returnError(errMessage)
        throw Error(errMessage)
      }
      if (isEmail(newUser.email)) newUser.save()
      else {
        console.log(newUser.email)
        newUser = returnError('Bad email.')
      }
    } catch (err: any) {
      console.log(err.message)
    }
  }
  res.json(newUser)
})

router.get('/contacts', async function(req, res){
  const userList = await EmailsModel.find()
  res.json(userList)
})

export { router as newsletterRouter }