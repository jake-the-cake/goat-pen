class DevLog {
	text?: string

	constructor(text: any) {
		this.checkMode(text)
	}

	checkMode(text: any): this | void {
		if (process.env.APP_MODE as string !== 'DEV') return
		this.text = text
		return this
	}

	createLog(): void {
		console.log(this.text)
	}
}

export function devLog(text: any) {
	const log = new DevLog(text)
	if (log.text) log.createLog()
}