import dotenv from 'dotenv'
import { AnyIndex } from "../types/generic"
import { randomHex, startWatch, stopWatch } from "../utils/misc"

dotenv.config()

const testConfig: AnyIndex = {
	// main shutoff
	runTests: true,
	// testing config settings
	testingPort: process.env.TESTING_PORT_NUMBER,
	testingDbUri: process.env.TESTING_DB_URI_DEV,
	counter: {
		going: 'in progress',
		waiting: 'not started',
		start: () => startWatch(),
		stop: (start: number) => stopWatch(start),
	},
	idLength: 12,
	testId: (len: number = testConfig.idLength) => randomHex(len),
	// formatting
	testObjectVariableName: 'test',
	testObjectVariableSeparator: '_',
	// information
  version: '0.2.1',
	author: 'Quiet Goat Labs',
	contributors: [
		'Jason Thompson'
	]
}

export default testConfig