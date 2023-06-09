import { ApiStatus, ReqType, ResType } from "../types/apiObjects"
import { devLog, log } from "../utils/logs"
import { NextFunction } from "express"

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
		log.log(`response: ${res.api!.status} with status ${res.api!.code}`)
		devLog(res.api!)
	})
	devLog(req.api)
	// next controller
	next()
}