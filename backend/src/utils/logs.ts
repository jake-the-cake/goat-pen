import { CallbackIndex, StringIndex } from '../types/generic'
import config from '../config'

class ServerLog {
	text: string

	constructor(text: string) {
		return this
	}
}

class DevLog extends ServerLog {
	devText?: string

	constructor(text: any) {
		super(text)
		this.checkMode(text)
	}

	checkMode(text: any): this | void {
		if (config.mode !== 'DEV') return
		this.text = this.devText = text
		return this
	}

	createDevLog(): void {
		console.log(this.text)
	}
}

export function serverLog(): void {

}

export function devLog(text: any, mode?: string): void {
	const log = new DevLog(text)
	if (log.text) {
		if (mode) (log)[mode]()
		log.createDevLog()
	}
}