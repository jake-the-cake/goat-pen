import mongoose from 'mongoose'

interface UriBitsType {
  original: string
  scheme?: string
  host?: string
  subdomain?: string
  domain?: string
  topleveldomain?: string
  port?: string
  path?: string
  query?: string
  fragment?: string
}
interface StringIndex {
  [key: string]: string
}

class GoatString {
  text: string
  
  constructor(text: string) {
    this.text = text
  }
}

class GoatUri extends GoatString {
  uriBits: UriBitsType & StringIndex
  uriBitList: string[]
  
  constructor(text: string) {
    super(text)
    this.uriBitList = [
      'scheme', 'host', 'subdomain', 'domain', 'topleveldomain',
      'port', 'path', 'query', 'fragment'
    ]
    this.uriBits = {
      original: text
    }
  }

  getScheme(separator: string = '://') {
    this.uriBits.scheme = this.uriBits.original.split(separator)[0] + separator
    return this
  }

  // has todo
  getDomains(start: string = '://', end: string = '/') {
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
    // display URL in correct order
    return (
      (uriBits.scheme && uriBits.scheme + '://') +
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

    return this
  }
}

console.log(new GoatUri('http://fake.website.co.uk:420/this/is/a/path?search="something"#gobirds').getScheme().getDomains().obscure('port').displayUri())

export function connectDB(uri: string = process.env.DB_URI_DEV as string) {
  // connect database at DB_URI_[mode]
  mongoose.connect(uri)

  // on success, log connection 
  .then(function( db ){
    console.log('Data connection')
    // new GoatUri(uri).getScheme().getDomains().obscure().displayUri()
  })

  // on failed connection, log error and try connection again
  .catch(function( err ){
    console.log(`Cannot connect to ${new GoatUri(uri).getScheme().getDomains().obscure('scheme').displayUri()}`)
    connectDB(process.env.DB_URI_DEV)
  })
}