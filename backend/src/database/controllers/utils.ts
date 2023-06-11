import { Model } from "mongoose"
import { ApiStatus, ReqType, ResType } from "../../types/apiObjects"
import { AnyIndex, CallbackIndex, StringIndex } from "../../types/generic"
import { QuiggleErr } from "../../utils/errors"

export function saveAndExit(item: Model<any> & Document, objs: {req: ReqType, res: ResType}) {
	return (item as any).save()
		.then(function() { onApiSuccess(201, item as any, { req: objs!.req, res: objs!.res }) })
			.catch(function(err: StringIndex) { onApiFailure(500, err, { req: objs.req, res: objs.res })})		
}

export function onApiSuccess(code: number, model: Model<any> | any[], objs: { req: ReqType, res: ResType}): void {
	objs.res.api!['status'] = ApiStatus.ok
	objs.res.api!['code'] = code
	objs.res.api!['data'] = model
	final(objs.req, objs.res)
}

export function onApiFailure(code: number, error: StringIndex | QuiggleErr | true, objs: { req: ReqType, res: ResType}): void {
	objs.res.api!['status'] = ApiStatus.fail
	objs.res.api!['code'] = code
	if (error !== true) objs.res.api!['error'] = error
	final(objs.req, objs.res)
}

export function final(req: ReqType, res: ResType): void {
	res.api!.info['elapsed'] = stopWatch(req.api!.details.started)
	res.status(res.api!.code).json(res.api)
}

// maybe a regular util?
export function stopWatch(start: number): string {
	return new Date().getTime() - start + 'ms'
}

export function useValidation(
		tests: CallbackIndex, 
		objs: {req: ReqType, res: ResType, api: StringIndex}
	): Promise<boolean> {
	return new Promise(function(resolve) {
		let ok = true
		Array.from(Object.keys(tests)).forEach(
			async function(key: string, i: number, a: any[]) {
				const results = await tests[key](objs)
				const analysis = (results as any[]).filter
					(function(r) { return r === false }
				)
				if (analysis.length > 0 && ok === true) ok = false
				if (i >= a.length - 1) resolve(ok)
			}
		)
	})
}

export function isOk(equation: any): boolean[] {
  return [equation === true, false]
}

export function validationPromise(
	check: boolean, onProp: any, atTest: string, inObj: ResType) {
 return new Promise(function(resolve) {
  let [is, ok] = isOk(check)
  if (!is) onProp[atTest]().saveTo(inObj)
  else ok = true
  resolve(ok)
 }) 
}