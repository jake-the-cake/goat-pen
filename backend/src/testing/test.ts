import goatString, { GoatString } from "../utils/strings"
import { AnyIndex, CallbackIndex } from "../types/generic"
import config from "../config"

interface IGoatTest<T> {
  name?: string
  methods?: CallbackIndex



  expected?: T | null
  actual?: T | null
  tests?: AnyIndex
}

interface IClassTestProps {
  Class: any
  params?: any[]
}




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
  ended: number | string
  elapsed: string
  tests?: {
    [key: string]: {
      total: number
      pass: number
      fail: number
      started: number | string
      ended: number | string
      elapsed: string
    }
  }
}


function duplicateValues(value: any, keys: string | string[]): AnyIndex {
  if (typeof keys === 'string') keys = [keys]
  const obj: AnyIndex = {}
  keys.forEach((key: string): void => obj[key] = value)
  console.log(obj)
  return obj
}


function testCounter(tests: TestParams, name: string): TestCounter {
  const testsObj: TestCounter & any = {
    name,
    started: new Date().getTime(),
    tests: {},
    ...duplicateValues('test in progress', ['ended', 'elapsed'])
  }
  Object.keys(tests).forEach((key: string): void => {
    (testsObj as AnyIndex).tests[key]= {
      ...duplicateValues(0, ['total', 'pass', 'fail']),
    ...duplicateValues('test in progress', ['started', 'ended', 'elapsed'])
    }
  })
  return testsObj
}





/**
 * Create tests that pass or fail based on result comparisons
 * @class GoatTest
 */
class GoatTest<T> implements IGoatTest<T> {
  name?: string
  methods?: CallbackIndex


  expected?: T | null
  actual?: T | null
  tests?: AnyIndex


  constructor(name: string) {
    return this.init(name)
  }

  public class(ClassToTest: any): this {
    // get list of tests to run from variable
		// const x = new
		console.log(ClassToTest)
    this.populateTests(ClassToTest)
    // create new
    console.log(this)
    return this
  }

  // For Running Tests
  private populateTests(ClassToTest: any): void {
    this.tests = {}
		console.log(ClassToTest)
		// const x = new classToTest()
    // Object.getOwnPropertyNames(ClassToTest)
    //   .forEach((key: string) => { if (key !== 'constructor') this.tests![key] = (this as AnyIndex)[key] })
  }



  /************** OLD CODE */





  async populateClassTests({Class, params}: IClassTestProps): Promise<this> {
    Promise.all(params || [])
      .then((args: any) => {
        this.tests = {
          ...new Class(...args, true).tests,
          classInit: Class
        }
      })
    return this
  }

  /**
   * Initialize the object or return it back to initial state
   * @returns {this} - Return constructed object
   */
  private init(name?: string): this {
    if (name) this.name = name
    this.expected = null
    this.actual = null
    return this
  }
}


async function classTest({Class, params=['defaultText']}: IClassTestProps, name: string): Promise<AnyIndex> {
  return await new GoatTest(name).populateClassTests({Class, params})
}

export {
	classTest
}

// const counter: AnyIndex = testCounter(testParams, T.name)
//       log.test(chalk.bgWhite(chalk.black('Class test: \'' + T.name + '\'')))
//       Object.keys(testParams).forEach((key: string): void => {
//       log.test('Starting test(s) on \'' + key + '\'')
//       counter.tests[key].started = new Date().getTime()
//       testParams[key].forEach((test: AnyIndex) => {
//         counter.tests[key].total++
//         let actual: any
//         if (key === 'classInit') { actual = new T.tests[key](...test.params)}
//         else actual = T.tests[key](...test.params)
//         if (!['object'].includes(typeof actual)) actual = { value: actual }
//         if (actual && actual[test.expected[0]] === test.expected[1]) {
//           counter.tests[key].pass++
//           testPass('(' + counter.tests[key].total + ') ' + test.test)
//         }
//         else if (actual === null && test.expected[1] === null) {
//           counter.tests[key].pass++
//           testPass('(' + counter.tests[key].total + ') ' + test.test)
//         }
//         else {
//           counter.tests[key].fail++
//           testFail('(' + counter.tests[key].total + ') ' + test.test)
//         }
//         counter.tests[key].ended = new Date().getTime()
//         counter.tests[key].elapsed = counter.tests[key].ended - counter.tests[key].started + 'ms'
//       })
//       log.info('Testing on \'' + key + '\'' + ' completed in ' + counter.tests[key].elapsed)
//     }, {what:'the heck'})
//     counter.ended = new Date().getTime()
//     counter.elapsed = counter.ended - counter.started + 'ms'
//     log.info('\'' + counter.name + '\'' + ' completed in ' + counter.elapsed)
//     let totals = {
//       fail: 0,
//       pass: 0,
//       total: 0
//     }
//     Object.keys(counter.tests).forEach((key: string): void => {
//       totals.fail += counter.tests[key].fail
//       totals.pass += counter.tests[key].pass
//       totals.total += counter.tests[key].total
//     })
//     log.info(totals.total + ' Tests run... > ' + chalk.green(totals.pass + ' Passed') + ' > ' + chalk.red(totals.fail + ' Failed'))
//   })
//   .catch((err: any) => devLog(err.message, 'err'))

// new GoatTest('test').class(new GoatString(config.defaults.value, config.defaults.isTest))