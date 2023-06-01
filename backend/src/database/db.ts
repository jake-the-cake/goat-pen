import mongoose from 'mongoose'
import { GoatUri } from '../utils/strings/uri'


/*
  FOR CLASS TESTING PURPOSES
*/
console.log(new GoatUri('http://git@fake.website.co.uk:420/this/is/a/path?search="something"#gobirds').getScheme().getCreds().getDomains().obscure().displayUri())
// ----------------- END TEST



/*
  CONNECT TO MONGODB DATABASE
*/
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