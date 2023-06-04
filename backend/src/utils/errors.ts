import { ApiErrType, ResType } from "../types/apiObjects"
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
		this.message = `${this.locTitle} field is required.`
		this.code = 400
		return this
	}

	format(): this {
		this.message = `${this.locTitle} format is invalid.`
		this.code = 400
		return this
	}

	unique(value: string): this {
		this.message = `${this.locTitle} '${ value }' is already in use.`
		this.code = 400
		return this
	}
	
	async isUnique(model: Model<any>, value: string, loc = this.location): Promise<boolean> {
		return await new Promise(async function(resolve) {
			if (Array.from(await model.find({[loc]: value})).length > 0) {
				resolve(false)
			} else resolve(true)
		})
	}

	saveTo(obj: ResType): void {
		const location: string = this.location
		if (obj.api!.error === null) obj.api!.error = {}
		obj.api!.error![location] = {
			time: this.time,
			from: this.from,
			location,
			message: this.message,
		}
		obj.api!.code = this.code || 500
	}
}

export function quiggleErr(location: string): QuiggleErr {
	return new QuiggleErr(location)
}