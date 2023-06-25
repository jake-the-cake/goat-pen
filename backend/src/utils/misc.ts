import { AnyIndex } from "../types/generic"

function setDuplicateValues(value: any, keys: string[], outputObj: AnyIndex = {}): AnyIndex {
  keys.forEach((key: string) => outputObj[key] = value)
  return outputObj
}

function startWatch() {
	return new Date().getTime()
}

function stopWatch(start: number): string {
	return new Date().getTime() - start + 'ms'
}

function randomHex(length: number, value: string = '') {
	const hexDigits = '0123456789ABCDEFabcdef'
	for (let i = 0; i < length; i++) {
		value += String(hexDigits[Math.floor(Math.random() * 21)])
	}
	return value
}

const GoatUtils = {
	setDuplicateValues,
	startWatch, stopWatch,
	randomHex
}

export {
	setDuplicateValues,
	startWatch, stopWatch,
	randomHex
}
export default GoatUtils