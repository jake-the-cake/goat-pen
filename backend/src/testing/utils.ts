import { AnyIndex } from "../types/generic"
import { TestCounter, TestParams } from "./types"

function populateTests(ClassName: any, ClassObject: AnyIndex, tasks: AnyIndex = {}): AnyIndex {
  Object.getOwnPropertyNames(ClassName.prototype)
    .forEach((key: string) => { if (key !== 'constructor') tasks[key] = { fn: ClassObject[key] }})
  return tasks
}

function testCounter(tests: TestParams, name: string): TestCounter {
  const testsObj: TestCounter = {
    name,
    started: new Date().getTime(),
    ended: null,
    elapsed: null,
    tests: {}
  }
  Object.keys(tests).forEach((key: string): void => {
    (testsObj as AnyIndex).tasks[key]= {
      total: 0,
      pass: 0,
      fail: 0,
      started: null,
      ended: null,
      elapsed: null
    }
  })
  return testsObj
}

export {
	populateTests,
	testCounter
}