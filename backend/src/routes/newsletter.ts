import { isEmail } from '../utils/validation'
import { EmailsModel } from '../database/models/emails'
import express from 'express'

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

router.post('/join', function(req, res){
  let newUser: any = {}
  try {
    newUser = new EmailsModel(req.body)
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
  res.json(newUser)
})

router.get('/contacts', async function(req, res){
  const userList = await EmailsModel.find()
  res.json(userList)
})

export { router as newsletterRouter }