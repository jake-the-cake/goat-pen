import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 6047
const DB_URI_DEV = process.env.DB_URI_DEV || ''
const DB_URI_ERR = process.env.DB_URI_ERR || ''
const DB_URI_PROD = process.env.DB_URI_PROD || ''

const constants = {
  mongo: {
    dev: DB_URI_DEV,
    err: DB_URI_ERR,
    uri: DB_URI_PROD
  },
  conn: {
    port: PORT
  }
}

export default constants