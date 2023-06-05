export class GoatString {
  text: string
  
  constructor(text: string) {
    this.text = text
  }
}

export function goatString(text: string) {
  return new GoatString(text)
}