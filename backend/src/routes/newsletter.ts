import express from 'express'
import { isEmail } from '../utils/validation'
import { EmailsModel } from '../database/models/emails'
import { all, insert } from '../database/controllers/generic'
import { quiggleErr } from '../utils/errors'
import { ResType } from '../types/apiObjects'

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

function isOk(eq: any): boolean[] {
  return [eq === true, false]
}

function validationPromise(check: boolean, onProp: any, atTest: string, inObj: ResType) {
 return new Promise(function(resolve) {
  let [is, ok] = isOk(check)
  if (!is) onProp[atTest]().saveTo(inObj)
  else ok = true
  resolve(ok)
 }) 
}

router.route('/test')
  .post(insert(EmailsModel, {
    email: function(props, error = quiggleErr('email')): Promise<unknown[]> {
      const EMAIL: string = props!.req.api.body.email
      const promises = [
        new Promise(async function(resolve) {
          let [is, ok] = isOk(await error.isUnique(EmailsModel, EMAIL))
          if (!is) error.unique(EMAIL).saveTo(props!.res)
          else ok = true
          resolve(is)
        }),
        validationPromise(isEmail(EMAIL), error, 'format', props!.res),
        validationPromise(EMAIL !== '', error, 'required', props!.res),
      ]
      return Promise.all(promises)
    }
  }))  
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

router.route('/contacts')
  .get(all(EmailsModel))

export { router as newsletterRouter }