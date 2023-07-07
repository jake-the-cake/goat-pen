import dotenv from 'dotenv'
import { AnyIndex } from "../types/generic"
import { randomHex, startWatch, stopWatch } from "../utils/misc"

dotenv.config()

const testConfig: AnyIndex = {
	// main shutoff
	runTests: true,
	// formatting
	testObjectVariableName: 'test',
	testObjectVariableSeparator: '_',
	// testing config settings
	testingPort: process.env.TESTING_PORT_NUMBER || 9999,
	testingDbUri: process.env.TESTING_DB_URI_DEV || '',
	testingDevHost: () => 'http://localhost:' + testConfig.testingPort,
	prefixInfo: {
		len: () => testConfig.testObjectVariableName.length + testConfig.testObjectVariableSeparator.length,
		prefix: () => testConfig.testObjectVariableName + testConfig.testObjectVariableSeparator
	},
	counter: {
		going: 'in progress',
		waiting: 'not started',
		start: () => startWatch(),
		stop: (start: number) => stopWatch(start),
	},
	idLength: 12,
	testId: (len: number = testConfig.idLength) => randomHex(len),
	// ignore
	ignoreResultProps: [
		'pass', 'fail', 'elapsed', 'started', 'ended'
	],
	// information
  version: '0.2.2',
	author: 'Quiet Goat Labs',
	contributors: [
		'Jason Thompson'
	]
}

export default testConfig