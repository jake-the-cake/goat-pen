import { GoatString, goatStringTasks } from "../utils/strings"
import { AnyIndex } from "../types/generic"
import testConfig from "./config"
import { TaskParams } from "./types"
import { setDuplicateValues } from "../utils/misc"


interface IGoatTest {
  info?: AnyIndex
	agenda: AnyIndex
	count: number
}

export class GoatTest implements IGoatTest {
  info?: AnyIndex
	agenda: AnyIndex
	count: number = 1

	constructor() {
		this.agenda = this.initTimer()
	}

	public class(info: any): this {
    this.info = info
		this.agenda['test_' + this.count] = {
			testName: info.title,
			tasks: {
				...this.filterTasks(new info.class( ...info.params, true).tasks, info.test),
				classConstructor: { fn: info.class }
			}
		}
		this.addTimers()
		this.count++
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

  private static unsetTimer = {
    ...setDuplicateValues(testConfig.counter.waiting, ['ended', 'elapsed', 'started'])
  }

	private static ignore = ['elapsed', 'started', 'ended', 'id', 'agenda']

	private initTimer(): AnyIndex {
		return {
			id: 'testID',
			started: testConfig.counter.start(),
			...setDuplicateValues(testConfig.counter.going, ['ended', 'elapsed']),
		}
	}

	private addTimers(obj: AnyIndex = {}): void {
    Object.keys(this.agenda).filter((key: string) => !GoatTest.ignore.includes(key)).forEach((key: string) => {
      this.agenda[key] = {
				...this.agenda[key],
        ...GoatTest.unsetTimer,
      }
      Object.keys(this.info!.test).forEach((k: string) => {
        this.agenda[key].tasks[k] = {
					...this.agenda[key].tasks[k],
          ...GoatTest.unsetTimer,
          variants: []
        }
        for(let i = 0; i < this.info!.test[k].length; i++) {
          console.log(this.info!.test[k][i].title || 'no')
          this.agenda[key].tasks[k].variants.push({
            title: this.info!.test[k][i].title,
            ...GoatTest.unsetTimer
          })
        }
      })
    })
	}
}













function quiggleTest(): GoatTest {
	return new GoatTest()
}

const ClassTests: any[] = [
	{ class: GoatString, params: ['hi'], test: goatStringTasks, title: 'Goat String' }
]

// const FunctionTests: any[] = [

// ]

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