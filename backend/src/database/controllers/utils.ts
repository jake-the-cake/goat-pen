import { Model } from "mongoose"
import { ApiStatus, ReqType, ResType } from "../../types/apiObjects"
import { AnyIndex, CallbackIndex, StringIndex } from "../../types/generic"
import { QuiggleErr } from "../../utils/errors"
import { mask } from "../../utils/encrypt"

function saveAndExit(item: Model<any> & Document, objs: {req: ReqType, res: ResType}) {
	// mask(objs.res.api!.data as AnyIndex)
	return (item as any).save()
		.then(function() { onApiSuccess(201, item as any, { req: objs!.req, res: objs!.res }) })
			.catch(function(err: StringIndex) { onApiFailure(500, err, { req: objs.req, res: objs.res })})		
}

function onApiSuccess(code: number, model: Model<any> | any[], objs: { req: ReqType, res: ResType}): void {
	objs.res.api!['status'] = ApiStatus.ok
	objs.res.api!['code'] = code
	objs.res.api!['data'] = model
	final(objs.req, objs.res)
}

function onApiFailure(code: number, error: StringIndex | QuiggleErr | true, objs: { req: ReqType, res: ResType}): void {
	objs.res.api!['status'] = ApiStatus.fail
	objs.res.api!['code'] = code
	if (error !== true) objs.res.api!['error'] = error
	final(objs.req, objs.res)
}

function final(req: ReqType, res: ResType): void {
	res.api!.info['elapsed'] = stopWatch(req.api!.info.started)
	res.status(res.api!.code).json(res.api)
}

// maybe a regular util?
function stopWatch(start: number): string {
	return new Date().getTime() - start + 'ms'
}

function useValidation(
		tests: CallbackIndex, objs: {req: ReqType, res: ResType, api: StringIndex}
	): Promise<boolean> {	return new Promise(function(resolve) {
		let ok = true
		Array.from(Object.keys(tests)).forEach(
			async function(key: string, i: number, a: any[]): Promise<void> {
				if ((await tests[key](objs) as any[]).filter((r) => r === false).length > 0 && ok === true) ok = false
				if (i >= a.length - 1) resolve(ok)
			}
		)
	})
}

function isOk(equation: any): boolean[] {
  return [equation === true, false]
}

function validationPromise(
	check: boolean, onProp: any, atTest: string, inObj: ResType) {
 return new Promise(function(resolve) {
  let [is, ok] = isOk(check)
  if (!is) onProp[atTest]().saveTo(inObj)
  else ok = true
  resolve(ok)
 }) 
}

export { 
	// misc functions
	stopWatch,
	// validation functions
	useValidation,
	validationPromise,
	isOk,
	// end of route functions
	saveAndExit,
	onApiFailure,
	onApiSuccess,
	final,
}