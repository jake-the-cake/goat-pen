import mongoose from 'mongoose'
import { log } from '../utils/logs'

const dbConnectionSuffix = 'connection established'

interface DatabaseInformation {
  uri: string
  name?: string
}

function dataConnectionString(dbInfo: DatabaseInformation, suffix: string = ' ' + dbConnectionSuffix): string {
  if (!dbInfo.name) return 'Database' + suffix
  return `'${dbInfo.name}' data` + suffix
}

export function connectDB(dbInfo: DatabaseInformation | string, serve: () => void): void {
  if (typeof dbInfo === 'string') dbInfo = { uri: dbInfo }
  mongoose.connect(dbInfo.uri, {
    retryWrites: true, w: 'majority'
  })

  // on success, log connection and start server
  .then(function( db ): void {
    dbInfo = dbInfo as DatabaseInformation
    log.info(dataConnectionString(dbInfo))
    serve()
  })

  // on failed connection, log error and try connection again
  .catch(function( err ): void {
    dbInfo = dbInfo as DatabaseInformation
    log.err(`Cannot connect to ${dbInfo.uri}`)
    log.info(err.message)
    connectDB({uri: dbInfo.uri, name: dbInfo.name || undefined }, serve)
  })
}