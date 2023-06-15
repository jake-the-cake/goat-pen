// import Cryptr from 'cryptr'
import { Document } from "mongoose"
import CryptoJS from 'crypto-js'
import constants from '../config'
import { AnyIndex, StringIndexIndex } from "../types/generic"

enum EncodeMode {
  e = 'encrypt',
  d = 'decrypt'
}

interface GoatMaskOptions {
  ignore?: string | string[] | []
  booleanPrefix?: string
}

class GoatMask {
  options?: GoatMaskOptions
  private mode: EncodeMode
  private keys?: {
    ignore: string[]
    convert: string[]
    boolean: string[]
  }
  private in?: Document | AnyIndex | any
  private out?: AnyIndex | string
  public static data: () => StringIndexIndex

  constructor(obj: Document & string & any, mode: EncodeMode, options?: GoatMaskOptions) {
    this.mode = mode
    if (typeof obj === 'string') return this.handleString(obj)
    if (obj._doc) { this.in = obj._doc}
    else this.in = obj
    this.out = {}
    this.options = {
      ignore: [],
      booleanPrefix: 'is',
      ...options
    }
    this.keys = {
      ignore: [...this.options.ignore!],
      convert: [],
      boolean: []
    }
    return this.split()
  }

  handleString(value: string): this {
    this.out = this.convert(value).toString(this.utf())
    return this
  }

  /** Conversion Method */
  private convert(value: string): CryptoJS.lib.CipherParams | CryptoJS.lib.WordArray {
    return (CryptoJS.AES as AnyIndex)[this.mode](value, constants.secret.crypto)
  }

  /** Return boolean to original form */
  private toBoolean(): void {
    this.keys!.boolean.forEach((key: string) => {
      (this.out as AnyIndex)[key] = (() => {
        switch ((this.out as AnyIndex)[key]) {
          case 'true': return true
          default: return false
        }
      })()
    })
  }

  /** Check if UTF encoding is needed */
  private utf(): any | undefined {
    if (this.mode === EncodeMode.d) return CryptoJS.enc.Utf8
  }
  
  /** Return Data */
  public data(): StringIndexIndex {
    if (this.mode === EncodeMode.d && typeof this.out !== 'string') this.toBoolean()
    return this.out as StringIndexIndex
  }

  /** Private Algorithm Methods */
  private split(): this {
    Object.keys(this.in).forEach((key: string) => {
      if (key.slice(0,2).includes('_')) this.keys?.ignore.push(key)
      else this.keys?.convert.push(key)
      if (key.slice(0,2) === this.options!.booleanPrefix) this.keys!.boolean.push(key)
    })
    return this.cycle()
  }

  private cycle(): this {
    this.keys!.convert.forEach((key: string) => {
      (this.out as AnyIndex)[key] = this.convert(String((this.in as AnyIndex)[key])).toString(this.utf())
    })
    return this.unignore()
  }

  private unignore(): this {
    this.keys!.ignore.forEach((key: string) => {
      (this.out as AnyIndex)[key] = (this.in as AnyIndex)[key]
    })
    return this
  }
}

/** Exports and Functions */
function doMagic(value: any, options: any, mode: any): StringIndexIndex {
  if (options?.ignore && typeof options.ignore === 'string') options.ignore = [options.ignore]
  return new GoatMask(value, mode, options).data()
}

function mask(value: string | Document, options?: GoatMaskOptions): StringIndexIndex {
  return doMagic(value, options, EncodeMode.e)
}

function unmask(value: string | Document, options?: GoatMaskOptions): StringIndexIndex {
  return doMagic(value, options, EncodeMode.d)
}

export { mask, unmask }