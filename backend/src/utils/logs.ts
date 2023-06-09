import config from '../config'
import chalk from 'chalk'
import { AnyIndex, StringIndexIndex } from '../types/generic'
import { StringIndex } from '../types/generic'

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
	timestamp: Date = new Date()
	time?: string
	date?: string
	label?: string
	mode: LoggerMode = LoggerMode.log

	constructor(text: any = '') {
		this.text = text
		return this
	}

	private colors: StringIndexIndex = {
		DATETIME: 'white',
		SEPARATOR: 'black',
		LABELBG: 'bgGreen',
		LABELTEXT: 'white',
		[LoggerMode.info]: {
			BG: 'bgBlue',
			LABEL: 'white',
			STRING: 'blue',
			NONSTRING: 'blueBright'
		},
		[LoggerMode.err]: {
			BG: 'bgRed',
			LABEL: 'white',
			STRING: 'red',
			NONSTRING: 'redBright'
		},
		[LoggerMode.warn]: {
			BG: 'bgYellow',
			LABEL: 'black',
			STRING: 'yellow',
			NONSTRING: 'yellowBright'
		},
		[LoggerMode.log]: {
			BG: 'reset',
			LABEL: 'reset',
			STRING: 'reset',
			NONSTRING: 'reset'
		}
	}

	private init(): void {
		this.timestamp = new Date()
		this.date = this.getDate()
		this.time = this.getTime()
	}

	private setLabel(): void {
		const { LABELBG, LABELTEXT, SEPARATOR } = this.colors as StringIndex
		const { BG, LABEL } = this.colors[this.mode] as StringIndex

		const tag = () => {
			if (this.mode !== LoggerMode.log) return (
			(chalk as AnyIndex)[BG](
				' ' + (chalk as AnyIndex)[LABEL](this.mode) + ' ')
			)
			else return ' > '
		}
		this.label = (chalk as AnyIndex)[LABELBG](
			(chalk as AnyIndex)[LABELTEXT](
				this.date
				+ (chalk as AnyIndex)[SEPARATOR]('@')
				+ this.time
				+ tag()
			)
		) + ' '

		return this.createLog()
	}

	private getDate(): string {
		const dateArray = backToFrontArray(this.timestamp.toLocaleDateString().split('/'))
		const {DATETIME, SEPARATOR} = this.colors as StringIndex

		dateArray.forEach(function(item: string | number, i: number) {
			dateArray[i] = (chalk as AnyIndex)[DATETIME]((function(): string {
				if (String(item).split('').length === 1 && i !== 0) item = '0' + item
				return String(item)
			})())
		})

		return dateArray.join((chalk as AnyIndex)[SEPARATOR]('-'))
	}

	private getTime(): string {
		const {DATETIME, SEPARATOR} = this.colors as StringIndex
		const [time, m] = this.timestamp.toLocaleTimeString().split(' ')
		const timeArray = time.split(':')
		timeArray.forEach(function(item: string | number, i: number) {
			timeArray[i] = (chalk as AnyIndex)[DATETIME]((function(): string {
				if (String(item).split('').length === 1) item = '0' + item
				return String(item)
			})())
		})
		return	timeArray.join((chalk as AnyIndex)[SEPARATOR](':')) + 
			(chalk as AnyIndex)[SEPARATOR](m) + ' '
	}

	private checkTextValue(text: string): void {
		if (this.text === '' && text === '') this.text = '** blank log **'
		else if (this.text !== '' && text !== '') {
			new ServerLog().info(`** overwritten log value **`)
			this.text = text
		}
		else {
			this.text = this.text || text
		}
	} 

	protected doTheRest(text: any, mode: LoggerMode): void {
		this.init()
		this.mode = mode
		let color: string
		this.checkTextValue(text)
		if (typeof this.text === 'string') color = (this.colors[mode] as StringIndex).STRING
		else {
			this.text = (chalk as AnyIndex)[(this.colors[mode] as StringIndex).STRING]('[DATA OBJECT] See below...\n' + JSON.stringify(this.text, null, 2))
			color = (this.colors[mode] as StringIndex).NONSTRING
		}
		this.text = (chalk as AnyIndex)[color](this.text)
		this.setLabel()
	}

	public info(text: any = ''): this {
		this.doTheRest(text, LoggerMode.info)
		return this
	}

	public err(text: any = ''): this {
		this.doTheRest(text, LoggerMode.err)
		return this
	}

	public warn(text: any = ''): this {
		this.doTheRest(text, LoggerMode.warn)
		return this
	}

	public log(text: any = ''): this {
		this.doTheRest(text, LoggerMode.log)
		return this
	}

	public createLog(): void {
		console.log((this.label || '') + this.text)
		this.text = ''
	}
}

class DevLog extends ServerLog {

	constructor(text: any) {
		super(text)
		this.checkMode(text)
	}

	checkMode(text: any): void {
		if (config.mode !== 'DEV') return
		this.text = text
		this.log()
	}
}

export const log = new ServerLog()

export function devLog(text: any): void {
	new DevLog(text)
}