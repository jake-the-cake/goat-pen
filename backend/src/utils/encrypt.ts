// import Cryptr from 'cryptr'
import { StringIndexIndex } from "../types/generic"
import constants from '../config'
import CryptoJS from 'crypto-js'

class GoatMask {
  keys?: string[]
  in?: StringIndexIndex
  out?: StringIndexIndex
  secret: string = constants.secret.crypto

  constructor(obj: string | StringIndexIndex) {
    if (typeof obj === 'string') this.in = { result: obj }
    else this.in = obj
  }
}

export function mask(value: string | StringIndexIndex): StringIndexIndex {
  const x = new GoatMask('hi').in!
  console.log(x)
  return x
}


// const cryptr = new Cryptr(constants.secret.crypto)

// class GoatMask {
//   obj: AnyIndex
//   keys?: string[]
//   resultObj?: AnyIndex

//   constructor(obj: AnyIndex) {
//     this.obj = obj
//   }

//   encode(): this {
//     // const x = cryptr.encrypt(this.obj.email ?? 'string')
//     this.resultObj = {
//       c_dec: cryptr,
//       email: x
//     }
//     return this
//   }

//   decode() {

//   }

//   ignore(): this {
//     this.keys = Object.keys(this.obj).filter(function(key: string): boolean {
//       if (key.split('').slice(0,2).includes('_')) return false
//       return true
//     })
//     return this
//   }
// }

// /** Exports and functions */
// const mask = (obj: AnyIndex) => {
//   const cleanObj = new GoatMask(obj).ignore()
//   const { email } = cleanObj.encode().resultObj as StringIndex
//   console.log(cryptr.decrypt(email))
// }

// const unmask = (obj: AnyIndex) => {
  
//   console.log(new GoatMask(obj).ignore().keys)
// }

// export { mask, unmask }