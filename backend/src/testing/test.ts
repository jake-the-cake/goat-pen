import { GoatString, goatStringTasks } from "../utils/strings"
import { AnyIndex } from "../types/generic"
import testConfig from "./config"
import { TaskParams } from "./types"

interface IGoatTest {
	testName: string
	tasks: AnyIndex
}


export class GoatTest implements IGoatTest {
	testName: string
	tasks: AnyIndex = {}

	constructor(testName: string) {
		this.testName = testName
	}

	public class(ClassName: any, params: any[] = []): this {
		this.tasks = {
			...new ClassName(...params, true).tasks,
			classConstructor: { fn: ClassName }
		}
		return this 
	}

	public run(taskList: TaskParams) {
		// console.log(taskList)
		console.log(this)
	}
}

function quiggleTest(name: string): GoatTest {
	return new GoatTest(name)
}

const ClassTests = [
	{ class: GoatString, params: ['hi'], test: goatStringTasks, title: 'Goat String' }
]

if (testConfig.runTests === true) {
	ClassTests.forEach((test: any) => {
		quiggleTest(test.title).class(test.class, test.params || []).run(test.test)
	})
}



// classTest({Class: GoatString}, 'GoatString by Quiggle')
//   .then((T: AnyIndex) => {
//     console.log(T)
//     const counter: AnyIndex = testCounter(testParams, T.name)
//       log.test(chalk.bgWhite(chalk.black('Class test: \'' + T.name + '\'')))
//       Object.keys(testParams).forEach((key: string): void => {
//       log.test('Starting test(s) on \'' + key + '\'')
//       counter.tests[key].started = new Date().getTime()
//       testParams[key].forEach((test: AnyIndex) => {
//         counter.tasks[key].total++
//         let actual: any
//         console.log(T)
//         if (key === 'classInit') { actual = new T.tasks[key](...test.params)}
//         else actual = T.tasks[key](...test.params)
//         if (!['object'].includes(typeof actual)) actual = { value: actual }
//         if (actual && actual[test.expected[0]] === test.expected[1]) {
//           counter.tasks[key].pass++
//           testPass('(' + counter.tasks[key].total + ') ' + test.test)
//         }
//         else if (actual === null && test.expected[1] === null) {
//           counter.tasks[key].pass++
//           testPass('(' + counter.tasks[key].total + ') ' + test.test)
//         }
//         else {
//           counter.tasks[key].fail++
//           testFail('(' + counter.tasks[key].total + ') ' + test.test)
//         }
//         counter.tasks[key].ended = new Date().getTime()
//         counter.tasks[key].elapsed = counter.tasks[key].ended - counter.tasks[key].started + 'ms'
//       })
//       log.info('Testing on \'' + key + '\' completed in ' + counter.tasks[key].elapsed)
//     }, {what:'the heck'})
//     counter.ended = new Date().getTime()
//     counter.elapsed = counter.ended - counter.started + 'ms'
//     log.info('\'' + counter.name + '\'  completed in ' + counter.elapsed)
//     let totals = {
//       fail: 0,
//       pass: 0,
//       total: 0
//     }
//     Object.keys(counter.tasks).forEach((key: string): void => {
//       totals.fail += counter.tasks[key].fail
//       totals.pass += counter.tasks[key].pass
//       totals.total += counter.tasks[key].total
//     })
//     log.info(totals.total + ' Tests run... > ' + chalk.green(totals.pass + ' Passed') + ' > ' + chalk.red(totals.fail + ' Failed'))
//   })
//   .catch((err: any) => devLog(err.message, 'err'))