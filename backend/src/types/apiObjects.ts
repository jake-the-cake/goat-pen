import { NextFunction, Request, Response } from "express"
import { AnyIndex, StringIndex } from "./generic"
import { Model } from "mongoose"

export enum ApiStatus {
	ok = 'ok',
	fail = 'fail',
	tbd = 'tbd'
}

interface ApiInfo {
	endpoint: string
	method: string
	ip: string
	elapsed?: string
}

interface ApiError {
	type?: string
	from: string
	message?: string
	tip?: string
	code?: number
	time: Date
}

export type ApiErrType = ApiError & { obj?: ResType } & AnyIndex

interface ApiRes {
	data?: {} | null
	error?: (ApiError & AnyIndex) | StringIndex | null
	status: ApiStatus
	code: number
	info: ApiInfo
}

export type ReqType = {
	api?: {
		body: StringIndex 
		data?: StringIndex | null
		error?: StringIndex | null
		code?: number
		status?: ApiStatus
		callback?: () => void
		details: {
			started: number
			model?: Model<any>
			garbage?: StringIndex
		}
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