import { ApiStatus, ReqType, ResType } from "../types/apiObjects"
import { devLog, log } from "../utils/logs"
import { NextFunction } from "express"

export function init(req: ReqType, res: ResType, next: NextFunction) {
	log.log(`${req.method} request @ ${req.path}`)
	// create initial object for api request
	req.api = {
		body: {},
		error: null,
		data: null,
		info: {
			started: new Date().getTime()
		}
	}
	// create initial object for api response
	res.api! = {
		data: null,
		error: null,
		status: ApiStatus.tbd,
		code: 500,
		info: {
			endpoint: req.originalUrl,
			method: req.method,
			ip: req.socket.remoteAddress || '0.0.0.0',
			date: new Date(req.api.info.started).toDateString(),
			time: new Date(req.api.info.started).toTimeString()
		}
	}
	res.on('finish', function() {
		log.log(`response: ${res.api!.status} with status ${res.api!.code}`)
		devLog(req.api!.error || 'No Request API Errors', 'err')
		devLog(res.api!.data || 'No Response Data', 'info')
		devLog(res.api!.error || 'No Response API Errors', 'err')
	})
	next()
}