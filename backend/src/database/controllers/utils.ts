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

export function useValidation(tests: CallbackIndex, objs: {req: ReqType, res: ResType, api: StringIndex}): Promise<boolean> {
	return new Promise(function(resolve, reject) {
		let ok = true
		Array.from(Object.keys(tests)).forEach(
			async function(key: string, i: number, a: any[]) {
				const results = await tests[key](objs)
				const analysis = (results as any[]).filter(function(r) { return r === false })
				if (analysis.length > 0 && ok === true) ok = false
				if (i >= a.length - 1) resolve(ok)
			}
		)
	})
}