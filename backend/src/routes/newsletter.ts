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
    let error = newUser.validateSync()
    if (!error) newUser.save()
    else {
      const errMessage: string = reformatValidationMessage(error.message, 'email')
      newUser = returnError(errMessage)
      throw Error(errMessage)
    }
  } catch (err: any) {
    console.log(err.message)
  }
  res.json(newUser)
})

export { router as newsletterRouter }