import { Model } from "mongoose"
import { ApiStatus, ReqType, ResType } from "../../types/apiObjects"
import { devLog } from "../../utils/logs"
import { CallbackIndex, StringIndex } from "../../types/generic"

export function onApiSuccess(code: number, model: Model<any> | any[], objs: { req: ReqType, res: ResType}): void {
	objs.res.api!['status'] = ApiStatus.ok
	objs.res.api!['code'] = code
	objs.res.api!['data'] = model
	final(objs.req, objs.res)
}

export function onApiFailure(code: number, error: StringIndex | true, objs: { req: ReqType, res: ResType}): void {
	objs.res.api!['status'] = ApiStatus.fail
	objs.res.api!['code'] = code
	if (error !== true) objs.res.api!['error'] = error
	final(objs.req, objs.res)
}

export function final(req: ReqType, res: ResType): void {
	res.api!.info['elapsed'] = stopWatch(req.api!.details.started)
	res.status(res.api!.code).json(res.api)
	devLog(res.api!)
}

export function stopWatch(start: number): string {
	return new Date().getTime() - start + 'ms'
}

export function useValidation(tests: CallbackIndex, objs: {req: ReqType, res: ResType, api: StringIndex}): void {
	// run provided validation
	Array.from(Object.keys(tests)).forEach(
		function(key: string) {
			tests[key](objs)
		}
	)
	// abort if validation errors exist
	if (objs.res.api!.error) throw onApiFailure(objs.res.api!.code, true, { req: objs.req, res: objs.res })
}