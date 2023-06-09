import { EmailsModel } from "../database/models/emails";
import { AnyIndex } from "../types/generic";
import { ReqType, ResType } from "../types/apiObjects";
import { NextFunction } from "express";
import { devLog, log } from "../utils/logs";

const modelRouter: AnyIndex = {
  api: {
    newsletter: {
      join: EmailsModel
    }
  }
}

export function cleanData(req: ReqType, res: ResType, next: NextFunction): void {
  log.err(modelRouter)

  next()
}