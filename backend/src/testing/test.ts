import { GoatString, goatStringTasks } from "../utils/strings"
import { AnyIndex } from "../types/generic"
import testConfig from "./config"
import { TaskParams, Variant } from "./types"
import { setDuplicateValues } from "../utils/misc"
import { log } from "../utils/logs"
import chalk from "chalk"

interface PassFailLog {
	pass: string[]
	fail: string[]
}

interface IGoatTest {
	agenda: AnyIndex
	results: PassFailLog
}

export class GoatTest implements IGoatTest {
	private static info?: AnyIndex
	private count?: number = 1
	agenda: AnyIndex
	results: PassFailLog = { pass: [], fail: [] }
	
	constructor() {
		this.agenda = this.initTimer()
		log.test(chalk.bgCyan(chalk.white(' QuiggleTest[v' + testConfig.version + '] ') + chalk.black('id: ' + this.agenda.id + ' ')))
	}

	public class(info: AnyIndex): this {
    GoatTest.info = info
		this.agenda['test_' + this.count] = {
			testName: info.title,
			tasks: {
				...this.filterTasks(new info.class( ...info.params, true).tasks, info.tasks),
				classConstructor: { fn: info.class }
			}
		}
		return this.initTask()
	}

	public func(info: AnyIndex): this {
		GoatTest.info = info
		this.agenda['test_' + this.count] = {
			testName: info.title,
			tasks: { main: { fn: info.func }}
		}
		return this.initTask()
	}
	
	private initTask(): this {
		this.addTimers()
		delete GoatTest.info
		this.count!++
		return this
	}

	public run() {
		this.testKeys!.forEach((key: string, i: number) => {
			log.test(chalk.bgWhite(chalk.cyan(' Test #' + (i + 1) + ' ') + chalk.black(this.agenda[key].testName + ' ')))
			try {
				Object.keys(this.agenda[key].tasks).forEach((k: string) => {
					this.agenda[key].tasks[k].variants.forEach((variant: Variant) => {
            if (Object.keys(this.agenda[key].tasks).includes('classConstructor')) {
              if (k !== 'classConstructor')	{
                const Obj = new this.agenda[key].tasks.classConstructor.fn(
                  ...this.agenda[key].tasks.classConstructor.variants[0].params || []
                )
                Obj.test = this.agenda[key].tasks[k].fn
                if (Obj.test(...variant.params) === variant.expect) { console.log('pass') }
              }
              else {
                console.log(k)
              }
            }
					})
				})
			} catch (err: any) {
				log.err(err.message)
			}
		})
		delete this.count
		delete this.testKeys
		// console.log(this)
	}

	private filterTasks(proto: AnyIndex, tasks: AnyIndex): AnyIndex {
		Object.keys(proto).forEach((key: string): void => {
			if (!Object.keys(tasks).includes(key)) delete proto[key]
		})
		return proto
	}

	private getTestKeys(): string[] {
		return Object.keys(this.agenda).filter((key: string) => !GoatTest.ignore.includes(key) && !this.testKeys!.includes(key))
	}

  private static unsetTimer = {
    ...setDuplicateValues(testConfig.counter.waiting, ['ended', 'elapsed', 'started'])
  }

	private static ignore: string[] = ['elapsed', 'started', 'ended', 'id', 'agenda', 'testNam']
	private testKeys?: string[] = []

	private initTimer(): AnyIndex {
		return {
			id: testConfig.testId,
			started: testConfig.counter.start(),
			...setDuplicateValues(testConfig.counter.going, ['ended', 'elapsed']),
		}
	}

	private addTimers(obj: AnyIndex = {}): void {
    this.getTestKeys().forEach((key: string) => {
      this.agenda[key] = {
				...this.agenda[key],
        ...GoatTest.unsetTimer,
      }
      Object.keys(GoatTest.info!.tasks).forEach((k: string) => {
				this.agenda[key].tasks[k] = {
					...this.agenda[key].tasks[k],
          ...GoatTest.unsetTimer,
          variants: []
        }
        for (let i = 0; i < GoatTest.info!.tasks[k].length; i++) {
          this.agenda[key].tasks[k].variants.push({
            ...GoatTest.info!.tasks[k][i],
            ...GoatTest.unsetTimer
          })
        }
      })
			this.testKeys!.push(key)
    })
	}
}













function quiggleTest(): GoatTest {
	return new GoatTest()
}

const goatTestTasks: TaskParams = { main: [
	{
		params: [],
		title: 'test this thing',
		checkProp: 'count',
		expect: 1
	}
]}

const ClassTests: any[] = [
	{ class: GoatString, params: ['hi'], tasks: goatStringTasks, title: 'Goat String' },
	// { class: GoatString, params: ['hi'], tasks: goatStringTasks, title: 'Goat String' }
]

const FunctionTests: any[] = [
	{ func: quiggleTest, tasks: goatTestTasks, title: 'Goat Test' },
	// { func: quiggleTest, tasks: goatTestTasks, title: 'Goat Test' },
]


if (testConfig.runTests === true) {
	const t = quiggleTest()
	ClassTests.forEach((test: AnyIndex) => {
		t.class(test)
	})
	FunctionTests.forEach((test: AnyIndex) => {
		t.func(test)
	})
	t.run()

}



// classTest({Class: GoatString}, 'GoatString by Quiggle')
//   .then((T: AnyIndex) => {
//     console.log(T)
//     const counter: AnyIndex = testCounter(testParams, T.name)
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