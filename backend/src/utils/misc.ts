// import testConfig from "../testing/config"
import { AnyIndex } from "../types/generic"

function setDuplicateValues(value: any, keys: string[], outputObj: AnyIndex = {}): AnyIndex {
  keys.forEach((key: string) => outputObj[key] = value)
  return outputObj
}

function startWatch() {
	return new Date().getTime()
}

function stopWatch(started: number, ended: number = startWatch()): string {
	return ended - started + 'ms'
}

interface ITimer {
	started: number
	ended: number
	elapsed: string
}

function startTimer(timer: AnyIndex): void {
	timer.started = startWatch()
	timer.ended = 'in progress'
	timer.elapsed = 'in progress'
}

function stopTimer(timer: ITimer & AnyIndex): void {
	timer.ended = startWatch()
	timer.elapsed = stopWatch(timer.started, timer.ended)
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
	startTimer, stopTimer,
	randomHex
}
export default GoatUtils