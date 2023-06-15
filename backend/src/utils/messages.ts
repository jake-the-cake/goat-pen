import chalk from "chalk"
import { AnyIndex } from "../types/generic"

const Chalk = chalk as AnyIndex

function objectTag(text: string, type: string, color?: {bg?: string, label?: string, arrow?: string, name?: string}): string {
	return Chalk[color?.bg ?? 'bgCyan'](
		Chalk[color?.arrow ?? 'black']('<')
		+ Chalk[color?.label ?? 'magenta'](type) 
		+ Chalk[color?.arrow ?? 'black']('>')
		+ Chalk[color?.name ?? 'white']('\'' + text + '\''))
}

function modelTag(text: string): string {
	return objectTag(text, 'MODEL')
}

function fieldTag(text: string): string {
	return objectTag(text, 'FIELD', {bg: 'bgGreen'})
}

export { modelTag, fieldTag, objectTag }