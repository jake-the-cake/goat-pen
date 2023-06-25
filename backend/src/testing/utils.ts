import { AnyIndex } from "../types/generic"

function populateTests(ClassName: any, ClassObject: AnyIndex, tasks: AnyIndex = {}): AnyIndex {
  Object.getOwnPropertyNames(ClassName.prototype)
    .forEach((key: string) => { if (key !== 'constructor') tasks[key] = { fn: ClassObject[key] }})
  return tasks
}

export {
	populateTests
}