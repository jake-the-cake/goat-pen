import { ReqType } from "types/apiObjects";
import { log } from "../utils/logs";
import { model, Model } from "mongoose";
import { AnyIndex } from "../types/generic";
import { quiggleErr } from "../utils/errors";

export function cleanData(m: Model<any>, req: ReqType): void {
  const modelSchema: AnyIndex = model(m.modelName).schema.paths

  Object.keys(req.body).forEach(function(key: string): void | AnyIndex {
    if (!Object.keys(modelSchema).includes(key)) return log.warn(`Ignored invalid field '${key}'`)
    const characterArray = req.body[key].split('')
    characterArray.forEach(function(char: string, i: number): void | false | AnyIndex {
      if (char === ' ') return false
      if (i === 0 && !/^[0-9A-Za-z\-\_]$/.test(char)) return quiggleErr(key).custom(406, `Value for field '${key}' cannot start with '${char}'`).saveTo(req)
      if (/^[<>{}]$/.test(char)) {
        characterArray[i] = 'invalid'
        log.warn(`Removed potentionally dangerous character '${char}' from request.`)
        return false
      }
    })
    req.api!.body[key] = String(characterArray.filter(function(char: string): boolean { return char !== 'invalid' }).join('').trim())
  })
}