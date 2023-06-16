import { StringIndex } from "../types/generic"
import { UriBitsType } from "../types/stringObjects"

interface IGoatString {
  value: string
  cap: (value?: string) => string
  upper: (value?: string) => string
  lower: (value?: string) => string
}

export class GoatString implements IGoatString {
  value: string = ''
  
  constructor(value: string = "") {
    this.setValue(value)
  }

  private setValue(value: string): void {
    this.value = value
  }

  private updateValue(value?: string): string {
    if (value) this.setValue(value)
    return this.value
  }

  private returnString(value: string | undefined, method: string): string {
    value = this.updateValue(value)
    return value !== '' ? (value[method as any] as any)() : ""
  }

  /**
   * cap returns a string with the first letter upper() and the
   * remaining string as lower()
   */
  public cap(value?: string): string {
    value = this.updateValue(value)
    return this.upper(value[0]) + this.lower(value.slice(1))
  }

  /**
   * upper returns an all upper case string
   */
  public upper(value?: string): string {
    return this.returnString(value, 'toUpperCase')
  }

  /**
   * lower returns an all lower case string
   */
  public lower(value?: string) {
    return this.returnString(value, 'toLowerCase')    
  }
}

////////////////////////////////
////////////////////////////////

/**
 * Inits, variables, and functions
 */
const goatString = new GoatString()
const { cap, upper, lower } = goatString
export const printObjectNeat = (obj: any): string => JSON.stringify(obj, null, 2)

/**
 * Exports
 */
export default goatString
export {
  cap,
  upper,
  lower
}