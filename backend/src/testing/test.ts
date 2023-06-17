import { AnyIndex } from "../types/generic"

interface IGoatTest<T> {
  name?: string
  expected?: T | null
  actual?: T | null
  tests?: AnyIndex
}

/**
 * Create tests that pass or fail based on result comparisons
 * @class GoatTest
 */
class GoatTest<T> implements IGoatTest<T> {
  name?: string
  expected?: T | null
  actual?: T | null
  tests?: AnyIndex


  constructor(name: string) {
    return this.init(name)
  }

  async populateClassTests({Class, params}: IClassTestProps): Promise<this> {
    Promise.all(params || [])
      .then((args: any) => {
        this.tests = {
          ...new Class(...args, true).tests,
          ['classInit']: Class
        }
      })
    return this
  }

  /**
   * Initialize the object
   * @returns {this} - Return constructed object
   */
  private init(name?: string): this {
    if (name) this.name = name
    this.expected = null
    this.actual = null
    return this
  }
}

interface IClassTestProps {
  Class: any
  params?: any[]
}

async function classTest<T>({Class, params=['defaultText']}: IClassTestProps, name: string): Promise<AnyIndex> {
  return await new GoatTest(name).populateClassTests({Class, params})
}

export {
	classTest
}