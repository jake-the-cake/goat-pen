import { GoatString } from "../utils/strings"
import { AnyIndex } from "../types/generic"


class GoatTest {
	testName: string
	tasks?: AnyIndex

	constructor(name: string) {
		this.testName = name
	}

	public class<T>(ClassName: T, params: any[] = []): this {
		this.tasks = {
			...new (ClassName as any)(...params, true).tests,
			classConstructor: ClassName
		}
		return this
	}
}

export function populateTests(ClassName: any): AnyIndex {
  ClassName.tasks = {}
  Object.getOwnPropertyNames(GoatString.prototype)
    .forEach((key: string) => { if (key !== 'constructor') ClassName.tasks[key].fun = ClassName[key]	})
  return ClassName.tasks
}

function quiggleTest(name: string): GoatTest {
	return new GoatTest(name)
}

console.log(quiggleTest('test').class(GoatString, ['hi']))