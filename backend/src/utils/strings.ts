import { AnyIndex } from "../types/generic"
import { devLog, log, testFail, testPass } from "./logs"
import config from "../config"
import { classTest } from "../testing/test"
import chalk from "chalk"
import { populateTests } from "../testing/newtest"

/* Non-universal defaults */
config.defaults.value = ''

/**
 * @type IOString
 * @param {string|undefined} value - A string value to be edited
 */
type IOString = (value: string | undefined) => string

/**
 * @type {IGoatString}
 * @property {string} [value=""] - The string that is being edited
 * @property {IOString} proper - Return i.e. 'Abcde...'
 * @property {IOString} upper - Return i.e. 'AAAAA...'
 * @property {IOString} lower - Return i.e. 'aaaaa...'
 */
interface IGoatString {
  value: string
  proper: IOString
  upper: IOString
  lower: IOString
  tasks?: AnyIndex
}

// For Running Tests
// function populateTests(t: any): AnyIndex {
//   t.tests = {}
//   Object.getOwnPropertyNames(GoatString.prototype)
//     .forEach((key: string) => { if (key !== 'constructor') t.tests[key] = t[key] })
//   return t.tests
// }

/**
 * Creates an object with a string value to be edited
 * @type {IGoatString}
 * @param {string} [value=""] - The supplied string
 * @property {string} [value=""] - The string that is being edited
 * @property {IOString} proper - Return i.e. 'Abcde...'
 * @property {IOString} upper - Return i.e. 'AAAAA...'
 * @property {IOString} lower - Return i.e. 'aaaaa...'
 * @returns {string} Edited string value
*/
class GoatString implements IGoatString {
  value: string = ''
  static proper: (value?: string) => string
  static upper: (value?: string) => string
  static lower: (value?: string) => string
  tasks?: AnyIndex
  
  constructor(value: string = "", isTest: boolean = false) {
    if (isTest) populateTests(this)
    this.setValue(value)
    return this
  }

  /**
   * Returns a string with the first letter upper() and the
   * remaining string as lower()
   * @param {string|undefined} value - The string that is being edited
   * @type {IOString} String in, string out function
   * @returns {string} Edited string value
   * 
   */
  public proper(value?: string): string {
    value = this.updateValue(value)
    return this.upper(value[0]) + this.lower(value.slice(1))
  }

  /**
   * Returns an all upper case string
   * @param {string|undefined} value - The string that is being edited
   * @type {IOString} String in, string out function
   * @returns {string} Edited string value
   */
  public upper(value?: string): string {
    return this.returnString(value, 'toUpperCase')
  }

  /**
   * Returns an all lower case string
   * @param {string|undefined} value - The string that is being edited
   * @type {IOString} String in, string out function
   * @returns {string} Edited string value
   */
  public lower(value?: string): string {
    return this.returnString(value, 'toLowerCase')    
  }

  private setValue(value: string): string | null {
    if (typeof value === 'object') return null
    this.value = String(value)
    return this.value
  }

  private updateValue(value: string = ''): string {
    if (value) this.setValue(value)
    return this.value
  }

  private returnString(value: string | undefined, method: string): string {
    value = this.updateValue(value)
    return value !== '' ? (value[method as any] as any)() : ""
  }

  // protected runTests(callback: () => AnyIndex, key: string): AnyIndex {
  //   if (key === 'key') this.tests = callback()
  //   return this.tests!
  // } 
}

/*
 * Inits, variables, and functions
 */
const goatString = new GoatString(config.defaults.value, config.defaults.isTest)
const { proper, upper, lower }: IGoatString = goatString
export const printObjectNeat = (obj: any): string => JSON.stringify(obj, null, 2)

/*
 * Exports
 */
export default goatString
export {
  proper,
  upper,
  lower,
  GoatString
}

/* 
 * Testing
 */

interface TestParams {
  [key: string]: {
    params: any[]
    expected: [string, any]
    test: string
  }[]
}

enum testValues {
  value = 'test value',
  updated = 'updated value',
  blank = ''
}

const testParams: TestParams & Partial<GoatString> = {
  classInit: [
    {
      params: [testValues.value],
      expected: ['value', testValues.value],
      test: 'Make sure class initialiazes value'

    }
  ],
  setValue: [
    {
      params: [testValues.value],
      expected: ['value', testValues.value],
      test: 'Set value to supplied string'
    },
    {
      params: [6047],
      expected: ['value', '6047'],
      test: 'Set value of a number to a string'
    },
    {
      params: [{object: 'with data'}],
      expected: ['value', null],
      test: 'Set value of an object to a string'
    },
    {
      params: [[1, '2']],
      expected: ['value', null],
      test: 'Set value of an array to a string'
    },
  ],
  updateValue: [
    {
      params: [testValues.updated],
      expected: ['value', testValues.updated],
      test: 'Update value to supplied string'
    },
    {
      params: [testValues.blank],
      expected: ['value', testValues.updated],
      test: 'Use previous text on blank string'
    }
  ]
}

interface TestCounter {
  name: string
  started: number
  ended: number | null
  elapsed: string | null
  tests?: {
    [key: string]: {
      total: number
      pass: number
      fail: number
      started: number | null
      ended: number | null
      elapsed: string | null
    }
  }
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
    (testsObj as AnyIndex).tests[key]= {
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



classTest({Class: GoatString}, 'GoatString by Quiggle')
  .then((T: AnyIndex) => {
    const counter: AnyIndex = testCounter(testParams, T.name)
      log.test(chalk.bgWhite(chalk.black('Class test: \'' + T.name + '\'')))
      Object.keys(testParams).forEach((key: string): void => {
      log.test('Starting test(s) on \'' + key + '\'')
      counter.tests[key].started = new Date().getTime()
      testParams[key].forEach((test: AnyIndex) => {
        counter.tests[key].total++
        let actual: any
        console.log(T)
        if (key === 'classInit') { actual = new T.tests[key](...test.params)}
        else actual = T.tasks[key](...test.params)
        if (!['object'].includes(typeof actual)) actual = { value: actual }
        if (actual && actual[test.expected[0]] === test.expected[1]) {
          counter.tests[key].pass++
          testPass('(' + counter.tests[key].total + ') ' + test.test)
        }
        else if (actual === null && test.expected[1] === null) {
          counter.tests[key].pass++
          testPass('(' + counter.tests[key].total + ') ' + test.test)
        }
        else {
          counter.tests[key].fail++
          testFail('(' + counter.tests[key].total + ') ' + test.test)
        }
        counter.tests[key].ended = new Date().getTime()
        counter.tests[key].elapsed = counter.tests[key].ended - counter.tests[key].started + 'ms'
      })
      log.info('Testing on \'' + key + '\' completed in ' + counter.tests[key].elapsed)
    }, {what:'the heck'})
    counter.ended = new Date().getTime()
    counter.elapsed = counter.ended - counter.started + 'ms'
    log.info('\'' + counter.name + '\'  completed in ' + counter.elapsed)
    let totals = {
      fail: 0,
      pass: 0,
      total: 0
    }
    Object.keys(counter.tests).forEach((key: string): void => {
      totals.fail += counter.tests[key].fail
      totals.pass += counter.tests[key].pass
      totals.total += counter.tests[key].total
    })
    log.info(totals.total + ' Tests run... > ' + chalk.green(totals.pass + ' Passed') + ' > ' + chalk.red(totals.fail + ' Failed'))
  })
  .catch((err: any) => devLog(err.message, 'err'))