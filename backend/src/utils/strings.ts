import { AnyIndex } from "../types/generic"
import { populateTests } from "../testing/utils"
import { TaskParams, TestValues } from "../testing/types"

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
    if (isTest === true) return this.runTests()
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

  private runTests(): this {
    this.tasks = populateTests(GoatString, this)
    return this
  } 
}

/*
 * Inits, variables, and functions
 *
 */
const goatString = new GoatString('')
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
 *
 */

export const goatStringTasks: TaskParams = {
  classConstructor: [
    {
      params: [TestValues.value],
      checkProp: 'value',
      expect: TestValues.value,
      title: 'Make sure class initialiazes value'

    }
  ],
  setValue: [
    {
      params: [TestValues.value],
      checkProp: 'value',
      expect: TestValues.value,
      title: 'Set value to supplied string'
    },
    {
      params: [6047],
      checkProp: 'value',
      expect: '6047',
      title: 'Set value of a number to a string'
    },
    {
      params: [{object: 'with data'}],
      checkProp: 'value',
      expect: null,
      title: 'Set value of an object to a string'
    },
    {
      params: [[1, '2']],
      checkProp: 'value',
      expect: null,
      title: 'Set value of an array to a string'
    },
  ],
  updateValue: [
    {
      params: [TestValues.updated],
      checkProp: 'value',
      expect: TestValues.updated,
      title: 'Update value to supplied string'
    },
    {
      params: [TestValues.blank],
      checkProp: 'value',
      expect: TestValues.updated,
      title: 'Use previous text on blank string'
    }
  ]
}