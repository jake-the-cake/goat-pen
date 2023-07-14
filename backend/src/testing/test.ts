import { GoatString, goatStringTasks } from "../utils/strings"
import { AnyIndex } from "../types/generic"
import testConfig from "./config"
import { PassOrFail, TaskParams, TestValues, Variant } from "./types"
import { setDuplicateValues, startTimer, startWatch, stopTimer } from "../utils/misc"
import { log, testFail, testPass } from "../utils/logs"
import chalk from "chalk"

// import fs from 'fs'

// const fileExt = ['js', 'ts']
// const foundTests: AnyIndex = {}

// const defaults = {
// 	dir: './src',
// 	testVariableName: 'goatStringTasks',
// 	testingFolder: 'testing'
// }

// function parseInvalidJSON(obj: string): AnyIndex {
// 	let newObj = {}
// 	obj.replace(/'/gm, '"').replace(/{/gm, '{ ').split(':').forEach((word: string, i: number, arr: any[]) => {
// 		let splitWord: string | string[] = word.split(' ')
// 		// console.log(word)
// 		// console.log(arr)
// 		if (word.split('')[word.length-1] !== '"' && word.split('')[word.length-1] !== '}') {
// 			// console.log(splitWord)
// 			splitWord[splitWord.length - 1] = '"' + word.split(' ').at(-1) + '"'
// 			arr[i] = splitWord.join(' ')
// 		}
// 		// console.log(word.trim())
// 		if (word.trim().split('')[0] !== '"' && word.trim().split('')[0] !== '{' ) {
// 			const arrWord = word.split('[')[1] && word.split('[')[1].split(']')[0]
// 			console.log(arrWord)
// 			console.log(splitWord)
// 			if (word.split('[')[1]) splitWord[0] = word.replace('[' + arrWord + ']', '["' + arrWord + '"]')
// 			console.log(splitWord[0])
// 			// splitWord[0] = ' "' + word.trim().split(' ')[0].split(',')[0] + '",'
// 			// console.log(splitWord)
// 			arr[i] = splitWord.join(' ')
// 		}
// 		// console.log(arr.join(':'))
// 		if (i === obj.replace(/'/gm, '"').replace(/{/gm, '{ ').split(':').length - 1) newObj = JSON.parse(arr.join(':'))
// 		// return arr.join(':')
// 	})
// 	return newObj
// }

// function findTests(path: string) {
// 	const files = fs.readdirSync(path)
// 	files.filter((dir: string) => dir !== defaults.testingFolder).forEach((file: any) => {
// 		if (file.split('.').length > 1 && fileExt.includes(file.split('.')[1])) {
// 		const sourceCode = Buffer.from(fs.readFileSync(path + '/' + file)).toString()
// 			if (sourceCode.split(defaults.testVariableName).length > 1) {
// 				const counts: any = {
// 					open: 0,
// 					close: 0,
// 					start: null,
// 					end: null
// 				}
// 				sourceCode.split(defaults.testVariableName)[1].replace(/[\t\n]/gm, '').split('').forEach((char: string, i: number) => {
// 					if (char === '{') {
// 						if (counts.open === 0) counts.start = i
// 						counts.open++
// 					}
// 					if (char === '}') counts.close++
// 					if (counts.start && !counts.end && counts.open === counts.close) {
// 						counts.end = i + 1
// 						foundTests['test_' + String(Object.keys(foundTests).length)] = sourceCode.split(defaults.testVariableName)[1].replace(/[\t\n]/gm, '').slice(counts.start, counts.end)
// 					}
// 				})
// 			}
// 		}
// 		else findTests(path + '/' + file)
// 	})
// 	return foundTests
// }

// const testAgenda = findTests('./src')
// console.log(testAgenda)
// console.log(parseInvalidJSON('{data: \'is here\'}'))

interface PassFailLog {
	pass: Partial<Variant>[]
	fail: Partial<Variant>[]
}

interface IGoatTest {
	agenda: AnyIndex
	results: PassFailLog
}

export class GoatTest implements IGoatTest, AnyIndex {
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
			title: info.title,
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
			title: info.title,
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
				this.results.pass.push(variant)
				break
			case 'fail':
				testFail(variant.title || 'untitled task variant')
				this.results.fail.push(variant)
				break
			default:
				log.err('Did not pass or fail?')
		}
	}

	public test(test: AnyIndex): this {
		if (test.class) return this.class(test)
		return this.func(test)
	}

	private compare(variant: Variant & AnyIndex, task: AnyIndex): void {
		if (variant.actual === variant.expect) this.variantResult('pass', variant, task)
		else this.variantResult('fail', variant, task)
	}

	private testClassTasks(currentTest: AnyIndex, task: AnyIndex, variant: Variant, taskName: string) {
		if (taskName !== 'classConstructor')	{
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
	}

	private testFunction(task: AnyIndex, variant: Variant): void {
		variant.actual = task.fn(...variant.params)
		if (variant.checkProp) variant.actual = variant.actual[variant.checkProp]
	}

	public run(): this {
		this.testKeys!.forEach((key: string, index: number) => {
			const currentTest = this.agenda[key]
					startTimer(currentTest)
			log.test(chalk.bgWhite(chalk.cyan(' Test #' + (index + 1) + ' ') + chalk.black(currentTest.title + ' ')))
			try {
				Object.keys(currentTest.tasks).forEach((k: string) => {
					const task = currentTest.tasks[k]
					startTimer(task)
					log.test('Starting task \'' + k + '\' ' + (task.variants.length > 1 ? 'variants' : ''))
					task.variants.forEach((variant: Variant) => {
						startTimer(variant)
            if (Object.keys(currentTest.tasks).includes('classConstructor')) {
							this.testClassTasks( currentTest, task, variant, k)

						}
						else this.testFunction(task, variant)
						this.compare(variant, currentTest)
						stopTimer(variant as any)
					})
					stopTimer(task)
					log.info('Task \'' + k + '\' completed in ' + task.elapsed)
				})
			} catch (err: any) {
				log.err(err.message)
				log.warn(err.stack)
			}
			this.agenda.pass += currentTest.pass
			this.agenda.fail += currentTest.fail
			stopTimer(currentTest)
			log.info('Test \'' + currentTest.title + '\' completed in ' + currentTest.elapsed)
		})
		log.test(chalk.bgWhite(chalk.black(' TESTING ENDED > FINALIZING RESULTS ')))
		const { pass, fail } = this.agenda
		stopTimer(this.agenda as any)
		log.info(chalk.white(pass + fail) + ' Total Tasks > ' + chalk.green(pass + ' Passed') + ' > ' + chalk.red(fail + ' Failed ') + 'in ' + this.agenda.elapsed)
		// console.log(this.agenda)
		delete this.count
		delete this.testKeys
		// console.log(this)
		return this
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
	
	public static ignore: string[] = ['elapsed', 'started', 'ended', 'id', 'agenda', 'title', 'pass', 'fail'
	]
	private testKeys?: string[] = []

	private initTimer(): AnyIndex {
		return {
			id: testConfig.testId(testConfig.idLength),
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
		title: 'Init counter to 1',
		checkProp: 'count',
		expect: 1
	}
]}

const Tests: any[] = [
	{ class: GoatString, params: [TestValues.value], tasks: goatStringTasks, title: 'Goat String' },
	{ func: quiggleTest, tasks: goatTestTasks, title: 'Quiggle Test'},
]

interface SortedStrings {
	[key: string]: string[] | []
}

interface SortingOptions {
	lookFor: string | string[]
	exactMatch?: boolean
	valueName?: string
}

function sortKeysThatContain(valueArr: string[], options: SortingOptions | string | string[]): SortedStrings {
	if (typeof options === 'string') options = { lookFor: options }
	options = options as SortingOptions
	if (typeof options.lookFor === 'string') options.lookFor = [options.lookFor]
	let varNames = ['isValue', 'notIsValue']
	if (options.valueName) varNames.forEach((name: string, i: number): void => {
		varNames[i] = name.replace('Value', (options as SortingOptions).valueName!)}
	)
	const obj: AnyIndex = {[varNames[0]]: [], [varNames[1]]: []}
	valueArr.forEach((key: string) => {
		((options as SortingOptions).lookFor as string[]).forEach((k: string) => {
			if (key.includes(k)) obj[varNames[0]].push(key)
			else obj[varNames[1]].push(key)
		})
	})
	return obj
}

// function sortKeysThatIgnore(valueArr: string[], options: SortingOptions | string | string[]): SortedStrings {
// 	console.log(valueArr)
// 	if (typeof options === 'string') options = { lookFor: [...options] }
// 	options = options as SortingOptions
// 	// options.lookFor = [...options.lookFor]
// 	let varNames = ['isValue', 'notIsValue']
// 	if (options.valueName) varNames.forEach((name: string, i: number): void => {
// 		varNames[i] = name.replace('Value', (options as SortingOptions).valueName!)}
// 	)
// 	const obj: AnyIndex = {[varNames[0]]: [], [varNames[1]]: []}
// 	valueArr.forEach((key: string) => {
// 		((options as SortingOptions).lookFor as string[]).forEach((k: string) => {
// 			if (key.includes(k)) obj[varNames[0]].push(key)
// 			else obj[varNames[1]].push(key)
// 		})
// 	})
// 	// console.log(options)
// 	return obj
// }

export function runQuiggleTest() {
	if (testConfig.runTests === true) {
		const t = quiggleTest()
		Tests.forEach((test: AnyIndex) => {
			t.test(test)
		})
		const agenda = t.run().agenda
		// const { isTest, notIsTest } = sortKeysThatContain(
		// 	Object.keys(agenda),
		// 	{
		// 		lookFor: testConfig.testObjectVariableName + testConfig.testObjectVariableSeparator,
		// 		valueName: 'Test'
		// 	}
		// )
		// function mainBodyInfo(obj: AnyIndex = {}): AnyIndex {
		// 	notIsTest.forEach((key: string) => obj[key] = agenda[key])
		// 	return obj
		// }

		interface ResultInformation {
			pass: number
      fail: number
      started: number | string
      ended: number | string
      elapsed: string
		}

		interface Agenda {
			agendaInfo: {
				id: string
			} & ResultInformation
			testInfo: (ResultInformation & AnyIndex)[]
			taskInfo: (ResultInformation & AnyIndex)[]
			variantInfo: (ResultInformation & AnyIndex)[]
		}

		function fillResultObject(sourceObj: AnyIndex, obj: Partial<ResultInformation> & AnyIndex = {}): ResultInformation {
			testConfig.ignoreResultProps.forEach((objKey: string) => {
				if (sourceObj[objKey] !== undefined) obj[objKey] = sourceObj[objKey]
			})
			return obj as ResultInformation
		}

		async function apiCall(endpoint: string, options?: AnyIndex): Promise<AnyIndex> {
			return await fetch(testConfig.testingDevHost() + endpoint, { ...options }).then((d: AnyIndex) => d.json())
		}

		function divideAgenda(sourceObj: AnyIndex, obj: Agenda | AnyIndex = {}): AnyIndex {
			obj.agendaInfo = {
				id: sourceObj.id,
				tests: [],
				...fillResultObject(sourceObj)
			}
			obj.testInfo = []
			obj.taskInfo = []
			obj.variantInfo = []

			const apiAgenda = apiCall('/insert/agenda', {
				method: 'POST', 
				body: new URLSearchParams(obj.agendaInfo)
			})
			// console.log(apiAgenda)

			Object.keys(sourceObj).filter((k: string) => k.slice(0, testConfig.prefixInfo.len()) === testConfig.prefixInfo.prefix()).forEach((testKey: string, testIdx: number) => {
				obj.testInfo.push({
					id: sourceObj.id,
					testKey,
					title: sourceObj[testKey].title,
					...fillResultObject(sourceObj[testKey])
				})

				apiCall('/insert/test', {
					method: 'POST',
					body: new URLSearchParams({
						...obj.testInfo[testIdx],
						id: sourceObj.id
					})
				})
				.then((data: AnyIndex) => {
					Object.keys(sourceObj[testKey].tasks).forEach((taskKey: string, taskIdx: number) => {
						obj.taskInfo.push({
							id: sourceObj.id,
							parentTestKey: testKey,
							taskKey,
							...fillResultObject(sourceObj[testKey].tasks[taskKey])
						})
						apiCall('/insert/task', {
							method: 'POST',
							body: new URLSearchParams({
								...obj.taskInfo[taskIdx],
								id: sourceObj.id
							})
						})
						.then((data: AnyIndex) => {
							console.log(data)
						})
						sourceObj[testKey].tasks[taskKey].variants.forEach((variant: Variant) => {
							obj.variantInfo.push({
								id: sourceObj.id,
								parentTestKey: testKey,
								parentTaskKey: taskKey,
								...variant,
								params: JSON.stringify(variant.params)
							})
						})
					})
				})
				
			})



			// console.log(obj)

			return obj
		}
		const divAgenda = divideAgenda(agenda)
		// fetch('http://localhost:21716/insert/new', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded',
		// 	},
		// 	// body: new URLSearchParams(mainBodyInfo())
		// 	body: new URLSearchParams(divAgenda.agendaInfo)
		// })
		// .then((data: AnyIndex) => {
		// 	console.log(data.json())
		// })
		// .then((data: AnyIndex) => {
		// 	console.log(data)
		// 	isTest.forEach((key: string): void => {
		// 		const { notIsTask } = sortKeysThatContain(Object.keys(agenda[key]), {
		// 			lookFor: 'tasks',
		// 			valueName: 'Task'
		// 		})
		// 		function addTestData(obj: AnyIndex = {}): AnyIndex {
		// 			notIsTask.forEach((k: string) => obj[k] = agenda[key][k])
		// 			return obj
		// 		}
		// 		fetch('http://localhost:21716/insert/tests', {
		// 			method: 'POST',
		// 			headers: {
		// 				'Content-Type': 'application/x-www-form-urlencoded',
		// 			},
		// 			body: new URLSearchParams({...addTestData(), id: data.id})
		// 		}).then((data: any) => data.json()).then((data: any) => console.log(data))
		// 		// console.log(addTestData())
		// 	})
		// 	// console.log(data)
		// })

		// console.log(t.agenda)
	}
}