import { GoatString } from "../utils/strings"
import { AnyIndex } from "../types/generic"


class GoatTest {
	testName: string
	tasks?: AnyIndex

	constructor(name: string) {
		this.testName = name
	}

	public class<T>(ClassName: T, params: any[] = []): this {
		console.log(ClassName)
		console.log(params)
		if (params && params[0] === 'la') this.tasks = {
			...new (ClassName as any)(...params, true).tasks,
			classConstructor: { fn: ClassName }
		}
		return this
	}
}

export function populateTests(ClassName: any): AnyIndex {
  ClassName.tasks = {}
  Object.getOwnPropertyNames(GoatString.prototype)
    .forEach((key: string) => { if (key !== 'constructor') ClassName.tasks[key] = { fn: ClassName[key] }})
	console.log(ClassName)
  return ClassName.tasks
}

function quiggleTest(name: string): GoatTest {
	return new GoatTest(name)
}


// const x = new GoatString('')
// console.log(x)
console.log(GoatString)

// console.log(quiggleTest('test').class(GoatString, ['hi']))