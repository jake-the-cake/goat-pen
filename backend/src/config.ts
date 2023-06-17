import dotenv from 'dotenv'
import { AnyIndex } from 'types/generic'
dotenv.config()

const PORT: string | number = process.env.PORT || 6047

const CRYPTO_CODE: string = process.env.CRYPTO_CODE || ''

const APP_MODE: string = process.env.APP_MODE || ''

const DB_URI_DEV: string = process.env.DB_URI_DEV || ''
const DB_URI_ERR: string = process.env.DB_URI_ERR || ''
const DB_URI_PROD: string = process.env.DB_URI_PROD || ''

const constants: AnyIndex = {
  mongo: {
    dev: DB_URI_DEV,
    err: DB_URI_ERR,
    uri: DB_URI_PROD
  },
  conn: {
    port: PORT
  },
  secret: {
    crypto: CRYPTO_CODE
  },
  mode: APP_MODE
}

const defaults: AnyIndex = {
  isTest: false
}

export default { constants, defaults }