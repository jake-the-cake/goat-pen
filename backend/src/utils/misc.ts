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

const GoatUtils = {
	setDuplicateValues,
	startWatch, stopWatch
}

export {
	setDuplicateValues,
	startWatch, stopWatch
}
export default GoatUtils