import { randomHex, startWatch, stopWatch } from "../utils/misc"

const testConfig = {
	runTests: true,
	counter: {
		going: 'in progress',
		waiting: 'not started',
		start: () => startWatch(),
		stop: (start: number) => stopWatch(start),
	},
	testName: 'test',
	testNameSeparator: '_',
  version: '0.2.0',
	testId: randomHex(16)
}

export default testConfig