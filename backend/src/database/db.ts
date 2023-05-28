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
  
  constructor(text: string) {
    // console.log(text)
    super(text)
    this.uriBits = {
      original: text
    }
  }

  getScheme(separator: string = '://') {
    this.uriBits.scheme = this.uriBits.original.split(separator)[0] + separator
    return this
  }

  getDomains(start: string = '://', end: string = '/') {
    const domains: string[] = this.uriBits.original.split(start)[1].split(end)[0].split('.')
    const len = domains.length
    const checkPort = domains[len-1].split(':')
    if (checkPort[1]) {
      domains[len - 1] = checkPort[0]
      this.uriBits.port = ':' + checkPort[1] 
    }
    switch (len) {
      case 1:
        [this.uriBits.host] = domains
        break
      case 2:
        [
          this.uriBits.domain,
          this.uriBits.topleveldomain
        ] = domains
        break
      default:
        //throw error
    }
    return this
  }

  displayUri() {
    const {
      scheme,
      host,
      subdomain,
      domain,
      port,
      path,
      query,
      fragment
    } = this.uriBits
    return ((scheme || '') +
      (host || '') +
      (subdomain || '') +
      (domain || '') +
      (port || '') +
      (path || '') +
      (query || '') +
      (fragment || ''))
  }

  obscure(section: string = 'domain') {
    if (section === 'domain' && this.uriBits.domain === undefined) section = 'host'
    this.uriBits[section] = this.uriBits[section].split('').map(char => char = '*').join('')
    return this
  }
}

export function connectDB(uri: string = process.env.DB_URI_ERR as string) {
  mongoose.connect(uri)
  .then(function( db ){
    console.log('Data connection')
    // new GoatUri(uri).getScheme().getDomains().obscure().displayUri()
  })
  .catch(function( err ){
    console.log(`Cannot connect to ${new GoatUri(uri).getScheme().getDomains().obscure().displayUri()}`)
    connectDB(process.env.DB_URI_DEV)
  })
}