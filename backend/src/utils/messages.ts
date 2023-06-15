import chalk from "chalk"

function modelTag(text: string): string {
	return chalk.bgCyan(chalk.magenta('MODEL') + chalk.black('>') + chalk.white('\'' + text + '\''))
}

export { modelTag }