import { GoatString, goatStringTasks } from "../utils/strings"
import { AnyIndex } from "../types/generic"
import testConfig from "./config"
import { TaskParams } from "./types"
import { setDuplicateValues } from "../utils/misc"


interface IGoatTest {
	// testName: string
	agenda: AnyIndex
	timer: AnyIndex
}

export class GoatTest implements IGoatTest {
	// testName: string
	agenda: AnyIndex
	timer: AnyIndex

	constructor(/*testName: string*/) {
		// this.testName = testName
		this.agenda = {}
		this.timer = this.initTimer()
	}

	// public class(ClassName: any, params: any[] = []): this {
	public class(test: any): this {
		const index: string = 'test_' + (Object.keys(this.agenda).length + 1)
		this.agenda[index] = {
			testName: test.title,
			tasks: {
				...this.filterTasks(new test.class( ...test.params, true).tasks, test.test),
				classConstructor: { fn: test.class }
			}
		}
		this.timer.agenda = this.addTestCounter()
		console.log(this.agenda)
		return this 
	}

	public run(taskList: TaskParams) {
		// console.log(taskList)
		console.log(this)
	}

	private filterTasks(proto: AnyIndex, tasks: AnyIndex): AnyIndex {
		Object.keys(proto).forEach((key: string): void => {
			if (!Object.keys(tasks).includes(key)) delete proto[key]
		})
		return proto
	}

	private initTimer(): AnyIndex {
		return {
			id: 'testID',
			started: testConfig.counter.start(),
			...setDuplicateValues(testConfig.counter.going, ['ended', 'elapsed']),
			agenda: {}
		}
	}
	private addTestCounter() {
		console.log(this.agenda)
	}
}













function quiggleTest(): GoatTest {
	return new GoatTest()
}

// const 

function initCounter(tests: any[]): AnyIndex {
  return {
		id: 'testID',
    started: testConfig.counter.start(),
    ...setDuplicateValues(testConfig.counter.going, ['ended', 'elapsed']),
    agenda: {}
  }
}


function addTaskCounter() {

}

function addVariantCounter() {

}



const ClassTests: any[] = [
	{ class: GoatString, params: ['hi'], test: goatStringTasks, title: 'Goat String' }
]

const FunctionTests: any[] = [

]

if (testConfig.runTests === true) {
  ClassTests.forEach((test: any) => {
		quiggleTest().class(test).run(test.test)
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