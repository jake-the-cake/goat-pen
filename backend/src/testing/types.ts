type PassOrFail = 'pass' | 'fail'

interface Variant {
  title: string
  params: any[]
  pre?: string | string[]
  preParams?: any | any[]
  checkProp?: string
  expect: any,
	actual?: any
	result?: PassOrFail
}

interface TaskParams {
  [key: string]: Variant[]
}

enum TestValues {
  value = 'test value',
  updated = 'updated value',
  blank = ''
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

export {
	PassOrFail,
	Variant,
	TaskParams,
	TestValues,
	TestCounter
}