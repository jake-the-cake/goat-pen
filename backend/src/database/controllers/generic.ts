import { NextFunction } from "express"
import mongoose, { Model, Document } from "mongoose"
import { devLog, log } from "../../utils/logs"
import { ApiStatus, ExpressFunction, ReqType, ResType } from "../../types/apiObjects"
import { final, onApiFailure, onApiSuccess, saveAndExit, useValidation } from "./utils"
import { CallbackIndex, StringIndex } from "../../types/generic"
import { quiggleErr } from "../../utils/errors"

export function init(req: ReqType, res: ResType, next: NextFunction) {
	log.log(`${req.method} request @ ${req.path}`)
	// create initial object for api response
	res.api! = {
		data: null,
		error: null,
		status: ApiStatus.tbd,
		code: 500,
		info: {
			endpoint: req.originalUrl,
			method: req.method,
			ip: req.socket.remoteAddress || '0.0.0.0'
		}
	}
	// move req body into req object
	req.api = {
		body: { ...req.body },
		details: {
			started: new Date().getTime()
		}
	}
	res.on('finish', function() {
		// final(req, res)
		log.log(`response: ${res.api!.status} with status ${res.api!.code}`)
		devLog(res.api!)
	})
	devLog(req.api)
	// next controller
	next()
}

export function insert(model: Model<any>, validation: CallbackIndex | null = null): ExpressFunction {
	return function(req: ReqType, res: ResType): void {
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