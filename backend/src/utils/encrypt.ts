import { StringIndex } from "../types/generic"

class GoatMask {
  iv?: string
  obj: StringIndex
  keys?: string[]

  constructor(obj: StringIndex) {
    this.obj = obj
    return this
  }

  ignore(): this {
    this.keys = Object.keys(this.obj).filter(function(key: string): boolean {
      return key.split('')[0]! !== '_'
    })
    return this
  }
}

export const mask = (obj: StringIndex) => {
  console.log(new GoatMask(obj).ignore())
}