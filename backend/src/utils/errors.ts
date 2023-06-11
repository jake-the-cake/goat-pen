import { AnyIndex } from "types/generic"
import { ApiErrType, ReqType, ResType } from "../types/apiObjects"
import { Model } from "mongoose"

export class QuiggleErr implements ApiErrType {

	location: string
	message?: string | undefined
	time = new Date()
	from = "QuiggleErrSys"
	code?: number
	locTitle: string

	constructor(location: string) {
		this.location = location.toLowerCase()
		this.locTitle = this.location[0].toUpperCase() + this.location.slice(1)
		return this
	}

	required(): this {
		return this.custom(400, `${this.locTitle} field is required.`)
	}

	format(): this {
		return this.custom(400, `${this.locTitle} format is invalid.`)
	}

	unique(value: string): this {
		return this.custom(400, `${this.locTitle} '${ value }' is already in use.`)
	}

	notfound(params: string): this {
		return this.custom(404, `${params} not found in '${this.location}.'`)
	}

	custom(code: number, message: string): this {
		this.message = message
		this.code = code
		return this
	}
	
	async isUnique(model: Model<any>, value: string, loc = this.location): Promise<boolean> {
		return await new Promise(async function(resolve) {
			if (Array.from(await model.find({[loc]: value})).length > 0) {
				resolve(false)
			} else resolve(true)
		})
	}

	saveTo(obj: ResType | ReqType): void {
		const location: string = this.location
		if (obj.api!.error === null) obj.api!.error = {}
		obj.api!.code = this.code || 500
		obj.api!.error![location] = {
			time: this.time,
			from: this.from,
			location,
			message: this.message,
		}
	}
}

export function quiggleErr(location: string): QuiggleErr {
	return new QuiggleErr(location)
}