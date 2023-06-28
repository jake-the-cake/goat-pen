import { GoatString, goatStringTasks } from "../utils/strings"
import { AnyIndex } from "../types/generic"
import testConfig from "./config"
import { PassOrFail, TaskParams, TestValues, Variant } from "./types"
import { setDuplicateValues, startTimer, startWatch, stopTimer } from "../utils/misc"
import { log, testFail, testPass } from "../utils/logs"
import chalk from "chalk"

import fs from 'fs'

const fileExt = ['js', 'ts']
const foundTests: AnyIndex = {}

const defaults = {
	dir: './src',
	testVariableName: 'goatStringTasks',
	testingFolder: 'testing'
}

function parseInvalidJSON(obj: string): AnyIndex {
	let newObj = {}
	obj.replace(/'/gm, '"').replace(/{/gm, '{ ').split(':').forEach((word: string, i: number, arr: any[]) => {
		let splitWord: string | string[] = word.split(' ')
		// console.log(word)
		// console.log(arr)
		if (word.split('')[word.length-1] !== '"' && word.split('')[word.length-1] !== '}') {
			// console.log(splitWord)
			splitWord[splitWord.length - 1] = '"' + word.split(' ').at(-1) + '"'
			arr[i] = splitWord.join(' ')
		}
		// console.log(word.trim())
		if (word.trim().split('')[0] !== '"' && word.trim().split('')[0] !== '{' ) {
			const arrWord = word.split('[')[1] && word.split('[')[1].split(']')[0]
			console.log(arrWord)
			console.log(splitWord)
			if (word.split('[')[1]) splitWord[0] = word.replace('[' + arrWord + ']', '["' + arrWord + '"]')
			console.log(splitWord[0])
			// splitWord[0] = ' "' + word.trim().split(' ')[0].split(',')[0] + '",'
			// console.log(splitWord)
			arr[i] = splitWord.join(' ')
		}
		// console.log(arr.join(':'))
		if (i === obj.replace(/'/gm, '"').replace(/{/gm, '{ ').split(':').length - 1) newObj = JSON.parse(arr.join(':'))
		// return arr.join(':')
	})
	return newObj
}



function findTests(path: string) {
	const files = fs.readdirSync(path)
	files.filter((dir: string) => dir !== defaults.testingFolder).forEach((file: any) => {
		if (file.split('.').length > 1 && fileExt.includes(file.split('.')[1])) {
		const sourceCode = Buffer.from(fs.readFileSync(path + '/' + file)).toString()
			if (sourceCode.split(defaults.testVariableName).length > 1) {
				const counts: any = {
					open: 0,
					close: 0,
					start: null,
					end: null
				}
				sourceCode.split(defaults.testVariableName)[1].replace(/[\t\n]/gm, '').split('').forEach((char: string, i: number) => {
					if (char === '{') {
						if (counts.open === 0) counts.start = i
						counts.open++
					}
					if (char === '}') counts.close++
					if (counts.start && !counts.end && counts.open === counts.close) {
						counts.end = i + 1
						foundTests['test_' + String(Object.keys(foundTests).length)] = sourceCode.split(defaults.testVariableName)[1].replace(/[\t\n]/gm, '').slice(counts.start, counts.end)
					}
				})
			}
		}
		else findTests(path + '/' + file)
	})
	return foundTests
}

// const testAgenda = findTests('./src')
// console.log(testAgenda)
// console.log(parseInvalidJSON('{data: \'is here\'}'))

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
			params: info.params,
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
	
	private variantResult(result: PassOrFail & string, variant: Partial<Variant>, task: AnyIndex): void {
		variant.result = result
		task[result]++
		switch (result) {
			case 'pass':
				testPass(variant.title || 'untitled task variant')
				break
			case 'fail':
				testFail(variant.title || 'untitled task variant')
				break
			default:
				log.err('Did not pass or fail?')
		}
	}

	private compare(variant: Variant & AnyIndex, task: AnyIndex): void {
		if (variant.actual === variant.expect) this.variantResult('pass', variant, task)
		else this.variantResult('fail', variant, task)
	}

	public run() {
		this.testKeys!.forEach((key: string, i: number) => {
			const currentTest = this.agenda[key]
					startTimer(currentTest)
			log.test(chalk.bgWhite(chalk.cyan(' Test #' + (i + 1) + ' ') + chalk.black(currentTest.testName + ' ')))
			try {
				Object.keys(currentTest.tasks).forEach((k: string) => {
					const task = currentTest.tasks[k]
					startTimer(task)
					log.test('Starting task \'' + k + '\' variants')
					task.variants.forEach((variant: Variant, i: number) => {
						startTimer(variant)
            if (Object.keys(currentTest.tasks).includes('classConstructor')) {
							if (k !== 'classConstructor')	{
								const Obj = new currentTest.tasks.classConstructor.fn(
									...currentTest.params || []
								)
								Obj.test = task.fn
								variant.actual = Obj.test(...variant.params)
							}
							else {
								variant.actual = new task.fn(...variant.params)
								if (variant.checkProp) variant.actual = variant.actual[variant.checkProp]
							}
							this.compare(variant, currentTest)
						}
						stopTimer(variant as any)
					})
					stopTimer(task)
					log.info('Task \'' + k + '\' completed in ' + task.elapsed)
				})
			} catch (err: any) {
				log.err(err.message)
				log.warn(err.stack)
			}
			const { pass, fail } = currentTest
			this.agenda.pass += pass
			this.agenda.fail += fail
			stopTimer(currentTest)
			log.info('Test \'' + currentTest.testName + '\' completed in ' + currentTest.elapsed)
		})
		const { pass, fail } = this.agenda
		stopTimer(this.agenda as any)
		log.info((pass + fail) + ' Total Tasks > ' + chalk.green(pass + ' Passed') + ' > ' + chalk.red(fail + ' Failed ') + 'in ' + this.agenda.elapsed)
		// console.log(this.agenda)
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
    ...setDuplicateValues(testConfig.counter.waiting, ['started', 'ended', 'elapsed'])
  }
	
	private static ignore: string[] = ['elapsed', 'started', 'ended', 'id', 'agenda', 'testName', 'pass', 'fail'
	]
	private testKeys?: string[] = []

	private initTimer(): AnyIndex {
		return {
			id: testConfig.testId,
			started: startWatch(),
			...setDuplicateValues(testConfig.counter.going, ['ended', 'elapsed']),
			pass: 0,
			fail: 0
		}
	}

	private addTimers(obj: AnyIndex = {}): void {
    this.getTestKeys().forEach((key: string) => {
      this.agenda[key] = {
				...this.agenda[key],
        ...GoatTest.unsetTimer,
				pass: 0,
				fail: 0
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

const Tests: any[] = [
	// { class: GoatString, params: [TestValues.value], tasks: goatStringTasks, title: 'Goat String' },
	{ class: GoatString, params: ['hi'], tasks: goatStringTasks, title: 'Goat String' }
]


if (testConfig.runTests === true) {
	const t = quiggleTest()
	Tests.forEach((test: AnyIndex) => {
		t.class(test)
	})
	t.run()
}