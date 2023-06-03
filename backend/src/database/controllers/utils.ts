import { Model } from "mongoose"
import { ApiStatus, ReqType, ResType } from "../../types/apiObjects"
import { devLog } from "../../utils/logs"
import { StringIndex } from "../../types/generic"

export function onApiSuccess(code: number, model: Model<any> | any[], objs: { req: ReqType, res: ResType}): void {
	objs.res.api!['status'] = ApiStatus.ok
	objs.res.api!['code'] = code
	objs.res.api!['data'] = model
	devLog(objs.res.api!)
	final(objs.res)
}

export function onApiFailure(code: number, error: StringIndex, objs: { req: ReqType, res: ResType}): void {
	objs.res.api!['status'] = ApiStatus.fail
	objs.res.api!['code'] = code
	objs.res.api!['error'] = error
	devLog(objs.res.api!)
	final(objs.res)
}

export function final(res: ResType): void {
	res.status(res.api!.code).json(res.api)
}