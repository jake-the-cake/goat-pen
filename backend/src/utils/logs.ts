class DevLog {
	text?: string

	constructor(text: any) {
		this.checkMode(text)
	}

	checkMode(text: any) {
		if (process.env.APP_MODE as string !== 'DEV') return { error: 'Not in dev mode.' }
		this.text = text
		return this
	}

	createLog() {
		console.log(this.text)
	}
}

export function devLog(text: any) {
	const log = new DevLog(text)
	if (log.text) log.createLog()
}