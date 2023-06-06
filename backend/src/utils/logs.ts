import config from '../config'
import chalk from 'chalk'
import { AnyIndex } from '../types/generic'
import { StringIndex } from '../types/generic'

function backToFrontArray(array: any[]): any[] {
	array.unshift(array[array.length - 1])
	array.pop()
	return array
}

class ServerLog {
	text: string
	timestamp: Date
	time?: string
	date?: string
	mode?: 'INFO' | 'ERROR' | 'WARN' | undefined

	constructor(text: string = '') {
		this.text = text
		this.timestamp = new Date()
		this.init()
		console.log(this.date)
		return this
	}

	private colors: StringIndex = {
		dateTime: 'greenBright',
		separator: 'green'
	}

	private init(): this {
		this.date = this.getDate()
		return this
	}

	private decorate() {

	}




	getDate(): string {
		const dateArray = backToFrontArray(this.timestamp.toLocaleDateString().split('/'))
		const {dateTime, separator} = this.colors

		dateArray.forEach(function(item: string | number, i: number) {
			dateArray[i] = (chalk as AnyIndex)[dateTime]((function(): string {
				if (String(item).split('').length === 1 && i !== 0) item = '0' + item
				return String(item)
			})())
		})

		return dateArray.join((chalk as AnyIndex)[separator]('.'))
	}






	info(text: string = this.text) {

	}

	createLog(): void {
		console.log(this.text)
	}
}

class DevLog extends ServerLog {
	isDev?: boolean

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