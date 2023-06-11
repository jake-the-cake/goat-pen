import { ReqType } from "types/apiObjects";
import { StringIndex } from "../types/generic";
import { devLog, log } from "../utils/logs";
import { model, Model } from "mongoose";

// const modelRouter: AnyIndex = {
//   api: {
//     newsletter: {
//       join: EmailsModel
//     }
//   }
// }

export function cleanData(m: Model<any>, req: ReqType): void {
  const modelKeys = Object.keys(model(m.modelName).schema.paths)
  const reqKeys = Object.keys(req.body)
  log.log(modelKeys)
  log.log(reqKeys)

  console.log(req.body)
  console.log(req.api)

  reqKeys.forEach(function(key: string): void {
    if (modelKeys.includes(key)) req.api!.body[key] = req.body[key]
    log.warn(`Ignored invalid field '${key}'`)
  })

  log.info('Uncleaned body')
  console.log(req.body)
  log.info('Cleaned body')
  console.log(req.api)

}