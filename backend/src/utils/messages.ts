import chalk from "chalk"
import { AnyIndex, StringIndex } from "../types/generic"
import { goatString } from "./strings"

const Chalk = chalk as AnyIndex

function objectTag(text: string, type: string, color?: {bg?: string, label?: string, arrow?: string, name?: string} & StringIndex): string {
	if (color) Object.keys(color).forEach((key: string) => color[key] = goatString.lower(color[key]))
	return Chalk[color?.bg ? 'bg' + goatString.cap(color.bg): 'bgCyan'](
		Chalk[color?.arrow ??'black']('<')
		+ Chalk[color?.label ?? 'magenta'](type) 
		+ Chalk[color?.arrow ?? 'black']('>')
		+ Chalk[color?.name ?? 'white']('\'' + text + '\''))
}

function modelTag(text: string): string {
	return objectTag(text, 'MODEL')
}

function fieldTag(text: string): string {
	return objectTag(text, 'FIELD', {bg: 'green'})
}

export { modelTag, fieldTag, objectTag }