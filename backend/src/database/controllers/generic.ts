import { NextFunction } from "express";
import mongoose, { Model, Document } from "mongoose"
import { devLog } from "../../utils/logs";
import { ApiStatus, ExpressFunction, ReqType, ResType } from "../../types/apiObjects";
import { onApiFailure, onApiSuccess, useValidation } from "./utils";
import { CallbackIndex, StringIndex } from "../../types/generic";

export function init(req: ReqType, res: ResType, next: NextFunction) {
	devLog(`|--> New api request at ` + new Date().toLocaleTimeString() + ' on ' + new Date().toLocaleDateString())
	// create initial object for api response
	res.api! = {
		data: null,
		error: null,
		status: ApiStatus.tbd,
		code: 500,
		info: {
			endpoint: req.originalUrl,
			method: req.method,
			ip: req.ip
		}
	}
	// move req body into req object
	req.api = {
		body: { ...req.body },
		details: {
			started: new Date().getTime()
		}
	}
	devLog(req.api)
	// next controller
	next()
}

export function insert(model: Model<any>, validation: CallbackIndex | null = null): ExpressFunction {
	return function(req: ReqType, res: ResType, next: NextFunction): void {
		devLog(`Creating a new "${ model.modelName }"...`)
		// create new model instance
		const api = new model({
			_id: new mongoose.Types.ObjectId(),
			...req.api!.body
		})
		// run provided validation
		if (validation) useValidation(validation, { req, res, api })
		// try to save with error handling
		return api
			.save()
			.then(function() { onApiSuccess(201, api, { req, res }) })
			.catch(function(err: StringIndex) { onApiFailure(500, err, { req, res })})		
	}
}

export function all(model: Model<any>, populate?: string[]): ExpressFunction {
	return function(req: ReqType, res: ResType, next: NextFunction): void {
		devLog(`Getting all data from "${ model.modelName }"...`)
		// search and display with error handling
		model.find<Document>()
			.populate(populate || [])
			.then(function(results: Document[]) { onApiSuccess(200, results, {req, res}) })
			.catch(function(err: StringIndex) { onApiFailure(500, err, {req, res}) })
	}
}