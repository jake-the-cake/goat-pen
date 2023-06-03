import { StringIndex } from "types/generic"
import { ApiErrType, ResType } from "../types/apiObjects"
import { devLog } from "./logs"

class QuiggleErr implements ApiErrType {
	location: string
	message?: string | undefined
	time = new Date()
	from = "QuiggleErrSys"
	code?: number

	constructor(location: string) {
		this.location = location.toLowerCase()
		return this
	}

	required(): this {
		this.message = `${
			this.location[0].toUpperCase() +
			this.location.slice(1)
		} field is required.`
		this.code = 400
		return this
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