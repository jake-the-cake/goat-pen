import mongoose, { Model, Document } from "mongoose"
import { cleanData } from "../../middleware/clean"
import { ExpressFunction, ReqType, ResType } from "../../types/apiObjects"
import { CallbackIndex, StringIndex, StringIndexIndex } from "../../types/generic"
import { onApiFailure, onApiSuccess, saveAndExit, useValidation } from "./utils"
import { quiggleErr } from "../../utils/errors"
import { mask, unmask } from "../../utils/encrypt"
import { log } from "../../utils/logs"
import { modelTag } from "../../utils/messages"

function encodeSchema({req, res}: {req: ReqType, res: ResType}, api: Model<any> & Document & any ): void {
	return saveAndExit(api.overwrite(mask(api)), { req, res })
}

function insert(model: Model<any>, validation: CallbackIndex | null = null): ExpressFunction {
	return function(req: ReqType, res: ResType): void {
		if (Object.keys(req.body).length) cleanData(model, req)
		log.info(`Creating new ${ modelTag(model.modelName) }`)
		// create new model instance
		const api = new model({
			_id: new mongoose.Types.ObjectId(),
			t_added: req.api!.info.started,
			c_: 'x',
			...req.api!.body
		})
		// run provided validation
		if (validation) {
			useValidation(validation, { req, res, api })
			.then(function(result) {
				if (req.api!.error) {
					res.api!.error = { ...res.api!.error, ...req.api!.error	}
					res.api!.code = req.api!.code!
					result = false
				}
				if (result === false) throw onApiFailure(res.api!.code, true, { req, res })
				else return encodeSchema({ req, res }, api)
			}).catch(function(): void { return })	// to catch the caught THROW error from then()
		} else return encodeSchema({ req, res }, api)
	}
}

function collectAll(model: Model<any>, populate?: string[]): ExpressFunction {
	return function(req: ReqType, res: ResType): void {
		log.info(`Getting ALL from ${ modelTag(model.modelName) }`)
		// search and display with error handling
		model.find<Document>()
			.then(function(results: Document[] & any) {
				results.forEach((item: Document & any, i: number) => results[i] = unmask(item))
				onApiSuccess(200, results, {req, res}) }
			)
			.catch(function(err: StringIndex) { onApiFailure(500, err, {req, res}) })
	}
}

function change(model: Model<any>, populate?: string[]): ExpressFunction {
	return function(req: ReqType, res: ResType): void {
		const _id = req.api!.body.id
		model.find<Document>({_id})
			.then(function(result: Document[]) { 
				if (result)	onApiSuccess(200, (result as any[])[0], {req, res})
				else onApiFailure(404, quiggleErr(model.modelName).notfound(_id), {req, res})
			})
			.catch(function(err: StringIndex) { onApiFailure(500, err, {req, res}) })
	}
}

function remove(model: Model<any>, search: StringIndexIndex = {}): ExpressFunction {
	return function(req: ReqType, res: ResType) {
		if (Object.keys(req.body).length) cleanData(model, req)
		log.info(`Removing document from ${ modelTag(model.modelName) }`)
		model.find({_id: req.body.id})
			.then((result: Document & any) => {
				model.deleteOne({_id: (req.body.id)})
					.then(() => {
						onApiSuccess(200, {deleted: `Deleted document from [MODEL||'${model.modelName}']`} as any, {req, res})
					})
			})
	}
}

function removeAll(model: Model<any>): ExpressFunction {
	return function(req: ReqType, res: ResType): void {
		log.info(`Removing ALL from ${modelTag(model.modelName)}`)
		model.deleteMany()
			.then(() => {
				onApiSuccess(200, {deleted: `Contents of [MODEL||'${model.modelName}'] have been removed`} as any, {req, res})
			})
	}
}

export {
	insert,
	collectAll,
	change,
	remove,
	removeAll
}