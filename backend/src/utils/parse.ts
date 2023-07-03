import { type } from "os"
import { AnyIndex } from "../types/generic"
import { log } from "./logs"

console.log('parser')

function parseInvalidJSON(obj: string): AnyIndex {
	let newObj = {}
	obj.replace(/'/gm, '"').replace(/{/gm, '{ ').split(':').forEach((word: string, i: number, arr: any[]) => {
		let splitWord: string | string[] = word.split(' ')
		// console.log(word)
		// console.log(arr)
		if (word.split('')[word.length-1] !== '"' && word.split('')[word.length-1] !== '}') {
			// console.log(splitWord)
			splitWord[splitWord.length - 1] = '"' + word.split(' ').at(-1) + '"'
			arr[i] = splitWord.join(' ')
		}
		// console.log(word.trim())
		if (word.trim().split('')[0] !== '"' && word.trim().split('')[0] !== '{' ) {
			const arrWord = word.split('[')[1] && word.split('[')[1].split(']')[0]
			console.log(arrWord)
			console.log(splitWord)
			if (word.split('[')[1]) splitWord[0] = word.replace('[' + arrWord + ']', '["' + arrWord + '"]')
			console.log(splitWord[0])
			// splitWord[0] = ' "' + word.trim().split(' ')[0].split(',')[0] + '",'
			// console.log(splitWord)
			arr[i] = splitWord.join(' ')
		}
		// console.log(arr.join(':'))
		if (i === obj.replace(/'/gm, '"').replace(/{/gm, '{ ').split(':').length - 1) newObj = JSON.parse(arr.join(':'))
		// return arr.join(':')
	})
	return newObj
}

interface IGoatParse {
  input: any
  output: any

  inputByLine?: string[]
  parseRange?: [number, number]
  currentRange?: [number, number]
}

class GoatParse implements IGoatParse, AnyIndex {
  input: any
  output: any

  inputByLine?: string[]
  parseRange?: [number, number]
  currentRange?: [number, number]

  constructor(input: any) {
    this.input = input
    this.output = null
    if (typeof input !== 'string') console.log(this.parseError('This package can only work with strings at the moment.'))
    
    // this.input = input.trim()
    // if (this.input[0] !== '{') {
    //   // throw log.err('Invalid')
    // }
    // this.inputByLine = input.split('\n')
    // console.log(this.input.split('').length)
    // this.parseRange = [0, this.input.length - 1]
    // this.parse()
    // console.log(this)
  }

  public toObject() {

  }

  private parse(): AnyIndex {

    return this.output
  }

  private parseError(message: string = 'A parsing error has occurred.') {
    return new Error('<ParseError> ' + message)
  }
}

new GoatParse(`s{
  this: 'thing',
  is: [
    'this',
    false
  ]
}`)