import mongoose from 'mongoose'
import { goatUri } from '../utils/strings/uri'
import config from '../config'
import { log } from '../utils/logs'

const connectionUri: string = config.mongo.dev

export function connectDB(uri: string, serve: () => void): void {
  mongoose.connect(uri, {
    retryWrites: true, w: 'majority'
  }) // connect database at DB_URI_[mode]
    .then(function( db ): void {
      // on success, log connection and start server
      log.info('Database connection established...')
      serve()
    })
    .catch(function( err ): void {
      // on failed connection, log error and try connection again
      log.err(`Cannot connect to ${goatUri(uri).displayUri()}`)
      connectDB(connectionUri, serve)
    })
}