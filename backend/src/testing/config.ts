import { startWatch, stopWatch } from "../utils/misc"

const testConfig = {
	runTests: true,
	counter: {
		going: 'in progress',
		waiting: 'not started',
		start: () => startWatch(),
		stop: (start: number) => stopWatch(start),
	}
}

export default testConfig