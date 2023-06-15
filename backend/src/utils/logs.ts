import config from '../config'
import chalk from 'chalk'
import { AnyIndex, StringIndex,StringIndexIndex } from '../types/generic'
import { printObjectNeat } from './strings'

/** Use chalk more easily with Typescript and custom methods */
const Chalk = chalk as AnyIndex

function backToFrontArray(array: any[]): any[] {
	array.unshift(array[array.length - 1])
	array.pop()
	return array
}

enum LoggerMode {
	info = 'INFO',
	err = 'ERROR',
	warn = 'WARNING',
	log = 'LOG'
}

class ServerLog {
	text: string
	time?: string
	date?: string
	label?: string
	timestamp: Date = new Date()
	mode: LoggerMode = LoggerMode.log
	DATA_PREFIX: string = '[DATA OBJECT] See below...\n'

	constructor(text: any = '') {	this.text = text }

	private colors: StringIndexIndex = {
		DATETIME: 'white',
		SEPARATOR: 'black',
		LABELBG: 'bgGreen',
		LABELTEXT: 'white',
		[LoggerMode.info]: { COLOR: 'Blue',	LABEL: 'white' },
		[LoggerMode.err]: {	COLOR: 'Red',	LABEL: 'white' },
		[LoggerMode.warn]: { COLOR: 'Yellow',	LABEL: 'black' },
		[LoggerMode.log]: 'reset'
	}

	private init(mode: LoggerMode | null = null): void {
		if (mode) this.mode = mode
		this.timestamp = new Date()
		this.date = this.getDate()
		this.time = this.getTime()
	}

	private setLabel(): void {
		const { LABELBG, LABELTEXT, SEPARATOR } = this.colors as StringIndex
		const { COLOR, LABEL } = this.colors[this.mode] as StringIndex

		const tag = () => {
			if (this.mode !== LoggerMode.log) return (
				Chalk['bg' + COLOR](' ' + Chalk[LABEL](this.mode) + ' ')
			)
			else return ' > '
		}
		this.label = Chalk[LABELBG](
			Chalk[LABELTEXT](this.date	+ Chalk[SEPARATOR]('@')	+ this.time	+ tag())
		) + ' '
	}

	private addLeadingZero(arr: {item: string | number, i: number}): string {
		return ((): string => {
			if (String(arr.item).split('').length === 1 && arr.i !== 0) arr.item = '0' + arr.item
			return String(arr.item)
		})()
	}

	private getDate(): string {
		const {DATETIME, SEPARATOR} = this.colors as StringIndex

		const dateArray = backToFrontArray(this.timestamp.toLocaleDateString().split('/'))

		dateArray.forEach((item: string | number, i: number) => {
			dateArray[i] = Chalk[DATETIME](this.addLeadingZero({item, i}))
		})

		return dateArray.join(Chalk[SEPARATOR]('-'))
	}

	private getTime(): string {
		const {DATETIME, SEPARATOR} = this.colors as StringIndex

		const [time, m] = this.timestamp.toLocaleTimeString().split(' ')
		const timeArray = time.split(':')

		timeArray.forEach((item: string | number, i: number) => {
			timeArray[i] = Chalk[DATETIME](this.addLeadingZero({item, i}))
		})

		return	timeArray.join(Chalk[SEPARATOR](':')) +  Chalk[SEPARATOR](m) + ' '
	}

	private checkTextValue(text: string): void {
		if (this.text === '' && text === '') this.text = '** blank log **'
		else if (this.text !== '' && text !== '') {
			new ServerLog().info(`** overwritten log value **`)
			this.text = text
		}
		else this.text = this.text || text
	}

	private setThemeOrReset(theme: StringIndex): { STRING: string, NONSTRING: string } {
		if (typeof theme === 'string')  return { // normal log
			STRING: 'reset', NONSTRING: 'reset'
		}
		return { // themed log
			STRING: theme.COLOR.toLowerCase(), NONSTRING: theme.COLOR.toLowerCase() + 'Bright'
		}
	}

	private setDataPrefix({STRING, NONSTRING}: { STRING: string, NONSTRING: string }): void {
		this.text = Chalk[((t: any = this.text): string => {
			switch (typeof this.text) {
				case 'string': return STRING
				default:
					this.text = printObjectNeat(this.text)
					if (this.text !== 'null') this.text = Chalk[STRING]( this.DATA_PREFIX ) + this.text
					return NONSTRING
			}
		})()](this.text)
	}

	protected doTheRest(text: any, mode: LoggerMode): void {
		this.init(mode)
		this.checkTextValue(text)
		this.setDataPrefix(this.setThemeOrReset(this.colors[this.mode] as StringIndex))
		this.setLabel()
		return this.createLog()
	}

	public info(text: any = ''): void {this.doTheRest(text, LoggerMode.info)}

	public err(text: any = ''): void {this.doTheRest(text, LoggerMode.err)}

	public warn(text: any = ''): void {this.doTheRest(text, LoggerMode.warn)}

	public log(text: any = ''): void {this.doTheRest(text, LoggerMode.log)}

	public createLog(): void {
		console.log((this.label || '') + this.text)
		this.text = ''
	}
}

/** DevLog class for dev-only logging */
class DevLog extends ServerLog {
	constructor(text: any, type: string) {
		super()
		if (config.mode !== 'DEV') return
		(this as AnyIndex)[type](text)
	}
}

/** Exports and Functions */
const log: ServerLog = new ServerLog()

function devLog(text: any, type: string = 'log'): void {
	if (config.mode !== 'DEV') return
	(new ServerLog(text) as AnyIndex)[type]()
}

export { log, devLog }