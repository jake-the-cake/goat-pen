import { NextFunction, Request, Response } from "express"
import { StringIndex } from "./generic"

export enum ApiStatus {
	ok = 'ok',
	fail = 'fail',
	tbd = 'tbd'
}

interface ApiInfo {
	endpoint: string
	method: string
	ip: string
}

interface ApiRes {
	data?: {} | null
	error?: {} | null
	status: ApiStatus
	code: number
	info: ApiInfo
}

export type ReqType = {
	api?: {
		body: StringIndex
	}
} & Request

export type ResType = {
	api?: ApiRes
} & Response

export type ExpressFunction = (
	req: ReqType,
	res: ResType,
	next: NextFunction
) => void