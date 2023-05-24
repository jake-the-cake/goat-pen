import { EmailsModel } from '../database/models/emails'
import express from 'express'

function isEmail(addr: string) {
    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(addr);
}

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
    // const hasValue = newUser.validateSync()

    if (isEmail(newUser.email)) newUser.save()
    else {
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