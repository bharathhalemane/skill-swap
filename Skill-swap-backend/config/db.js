const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI

    if (!uri) {
      throw new Error('MONGO_URI is undefined')
    }

    await mongoose.connect(uri)
    console.log('MongoDB Connected')
    console.log('Connected DB:', mongoose.connection.name)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

module.exports = connectDB
