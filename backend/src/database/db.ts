import mongoose from 'mongoose'

export function connectDB() {
  mongoose.connect('mongodb://localhost:27017/goat-data')
  .then(function( db ){
    console.log('Data connection')
  })
}