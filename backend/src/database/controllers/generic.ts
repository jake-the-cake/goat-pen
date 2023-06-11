import mongoose, { Model, Document } from "mongoose"
import { log } from "../../utils/logs"
import { ExpressFunction, ReqType, ResType } from "../../types/apiObjects"
import { onApiFailure, onApiSuccess, saveAndExit, useValidation } from "./utils"
import { CallbackIndex, StringIndex } from "../../types/generic"
import { quiggleErr } from "../../utils/errors"
import { cleanData } from "../../middleware/clean"

export function insert(model: Model<any>, validation: CallbackIndex | null = null): ExpressFunction {
	return function(req: ReqType, res: ResType): void {
		if (Object.keys(req.body).length) cleanData(model, req)
		log.info(`Creating a new "${ model.modelName }"...`)
		// create new model instance
		const api = new model({
			_id: new mongoose.Types.ObjectId(),
			...req.api!.body
		})
		// run provided validation
		if (validation) {
			useValidation(validation, { req, res, api })
			.then(function(result) {
				if (result === false) throw onApiFailure(res.api!.code, true, { req, res })
				else return saveAndExit(api, { req, res })
			}).catch(function(): void { return })	// to catch the caught THROW error from then()
		} else return saveAndExit(api, { req, res })
	}
}

export function all(model: Model<any>, populate?: string[]): ExpressFunction {
	return function(req: ReqType, res: ResType): void {
		log.info(`Getting all data from "${ model.modelName }"...`)
		// search and display with error handling
		model.find<Document>()
			.then(function(results: Document[]) { onApiSuccess(200, results, {req, res}) })
			.catch(function(err: StringIndex) { onApiFailure(500, err, {req, res}) })
	}
}

export function change(model: Model<any>, populate?: string[]): ExpressFunction {
	return function(req: ReqType, res: ResType) {
		const _id = req.api!.body.id
		model.find<Document>({_id})
			.then(function(result: Document[]) { 
				if (result)	onApiSuccess(200, (result as any[])[0], {req, res})
				else onApiFailure(404, quiggleErr(model.modelName).notfound(_id), {req, res})
			})
			.catch(function(err: StringIndex) { onApiFailure(500, err, {req, res}) })
	}
}