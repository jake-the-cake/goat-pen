import Cryptr from 'cryptr'
import { AnyIndex } from "../types/generic"
import constants from '../config'
import { printObjectNeat } from './strings'

// console.log(new Cryptr(constants.secret.crypto))
const cryptr = new Cryptr(constants.secret.crypto)

class GoatMask {
  obj: AnyIndex
  keys?: string[]

  constructor(obj: AnyIndex) {
    this.obj = obj
  }

  encode() {
    const x = cryptr.encrypt(this.obj.email ?? 'string')
    return {
      c_: cryptr,
      email: x
    }
  }

  decode() {

  }

  // getIv(): string {
  //   return "iv"
  // }

  ignore(): this {
    this.keys = Object.keys(this.obj).filter(function(key: string): boolean {
      if (key.split('').slice(0,2).includes('_')) return false
      return true
    })
    return this
  }


}

/** Exports and functions */
const mask = (obj: AnyIndex) => {
  const cleanObj = new GoatMask(obj).ignore()
  const { email } = cleanObj.encode()
  console.log(cryptr.decrypt(email))
}

const unmask = (obj: AnyIndex) => {
  
  console.log(new GoatMask(obj).ignore().keys)
}

export { mask, unmask }