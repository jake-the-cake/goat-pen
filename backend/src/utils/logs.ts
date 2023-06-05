import config from '../config'

class ServerLog {
	text: string
	timestamp: Date
	time?: string
	date?: string
	mode?: 'INFO' | 'ERROR' | 'WARN' | undefined

	constructor(text: string = '') {
		this.text = text
		this.timestamp = new Date()
		return this
	}

	private init() {
		// this.date =
	}

	private decorate() {

	}

	getDate(): this {
		const dateArray = this.timestamp.toLocaleDateString().split('/')

		dateArray.forEach(function(item: string | number, i: number) {
			if (String(item).split('').length === 1 && i !== 2) dateArray[i] = '0' + item
		})

		const [month, day, year] = dateArray
		this.date = year + '.' + month + '.' + day
		console.log(this.date)
		return this
	}

	info(text: string = this.text) {

	}

	createLog(): void {
		console.log(this.text)
	}
}

class DevLog extends ServerLog {
	isDev?: booleana

	constructor(text: any) {
		super(text)
		this.checkMode(text)
	}

	checkMode(text: any): this | void {
		if (config.mode !== 'DEV') return
		this.text = text
		this.isDev = true
		return this
	}
}

export function serverLog(): void {

}

export function devLog(text: any, mode?: string): void {
	const log = new DevLog(text)
	if (log.isDev) log.createLog()
}

new ServerLog().getDate()