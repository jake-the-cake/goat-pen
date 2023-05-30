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
    // put url bits into variables
    const { scheme, host, subdomain, domain, topleveldomain,
      port, path, query, fragment } = this.uriBits
    const uriBits = { scheme, host, subdomain, domain, topleveldomain,
      port, path, query, fragment } 

    console.log( uriBits) 
    // set all undefined bits to empty string
    Array.from(Object.entries(this.uriBits)).forEach(function(prop: string[], i: number, arr: any[] & StringIndex) {
      // console.log(arr[prop[0]])
      console.log(arr)
      if (!arr[prop[0]]) {

      }
    })




    // display URL in correct order
    // return (
    //   this.uriBits.scheme +
    //   this.uriBits.host +
    //   this.uriBits.subdomain +
    //   this.uriBits.domain +
    //   this.uriBits.port +
    //   this.uriBits.path +
    //   this.uriBits.query +
    //   this.uriBits.fragment
    // )
  }

  obscure(section: string = 'domain') {
    if (section === 'domain' && this.uriBits.domain === undefined) section = 'host'
    this.uriBits[section] = this.uriBits[section].split('').map(char => char = '*').join('')
    return this
  }
}

console.log(new GoatUri('http://fake.website.co.uk:420/this/is/a/path?search="something"#gobirds').getScheme().getDomains().obscure('scheme').displayUri())

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