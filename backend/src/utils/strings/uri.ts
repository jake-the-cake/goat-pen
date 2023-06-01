import { GoatString } from "./string"
import { StringIndex } from "../../types/generic"
import { UriBitsType } from "../../types/stringObjects"

export class GoatUri extends GoatString {
  uriBits: UriBitsType & StringIndex
  uriBitList: string[]
  
  constructor(text: string) {
    super(text)
    this.uriBitList = [
      'scheme', 'creds', 'host', 'subdomain', 'domain', 'topleveldomain',
      'port', 'path', 'query', 'fragment'
    ]
    this.uriBits = {
      original: text
    }
  }

  getScheme(separator: string = '://') {
    this.uriBits.scheme = this.uriBits.original.split(separator)[0]
    return this
  }

  getCreds(separator: string = "@") {
    this.uriBits.creds = this.uriBits.original.split('://')[1].split(separator)[0]
    return this
  }

  // has todo
  getDomains(start: string = '://', end: string = '/') {
    if (this.uriBits.original.split('@').length > 1) start = '@'
    const domains: string[] = this.uriBits.original.split(start)[1].split(end)[0].split('.')
    const len = domains.length
    const checkPort = domains[len-1].split(':')
    if (checkPort[1]) {
      domains[len - 1] = checkPort[0]
      this.uriBits.port = checkPort[1] 
    }
    switch (len) {
      case 0:
        //throw err
        break
      case 1:
        [this.uriBits.host] = domains
        break
      case 2:
        [
          this.uriBits.domain,
          this.uriBits.topleveldomain
        ] = domains
        break
      case 3:
        [
          this.uriBits.subdomain,
          this.uriBits.domain,
          this.uriBits.topleveldomain
        ] = domains
        break
      default:
        domains[2] = domains.slice(2).join('.');
        [
          this.uriBits.subdomain,
          this.uriBits.domain,
          this.uriBits.topleveldomain
        ] = domains
        break
    }
    return this
  }

  displayUri() {
    // copy object to manipulate for output
    const uriBits: StringIndex = {...this.uriBits}
    // set all undefined bits to empty string
    this.uriBitList.forEach(function(key: string, i: number) {
      if (!uriBits[key]) uriBits[key] = ''
    })
    uriBits.creds && this.obscure('creds')
    // obscure credintials
    if (this.uriBits.creds) {
      this.obscure('creds')
      uriBits.creds = this.uriBits.creds
      this.getCreds()
    }

    // display URL in correct order
    return (
      (uriBits.scheme && uriBits.scheme + '://') +
      (uriBits.creds && uriBits.creds + '@') +
      uriBits.host +
      (uriBits.subdomain && uriBits.subdomain + '.') +
      uriBits.domain +
      (uriBits.topleveldomain && '.' + uriBits.topleveldomain) +
      (uriBits.port && ':' + uriBits.port) +
      uriBits.path +
      uriBits.query +
      uriBits.fragment
    )
  }

  obscure(sections: string | string[] = 'domain', char: string = '*') {
    // if string, make it an array
    if (typeof sections === 'string') sections = [sections]
    // copy object to manipulate
    const uriBits = this.uriBits

    sections.forEach(function(section: string) {
      // determine if host or domain
      if (section === 'domain' && uriBits.domain === undefined) section = 'host'
      // change chars to supplied char or default
      uriBits[section] = uriBits[section].split('').map(c => c = char).join('')
    })
    console.log(this.uriBits)

    return this
  }
}