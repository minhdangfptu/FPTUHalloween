const mongoose = require('mongoose')
const { config } = require('./environment')

let cached = global._mongooseCached
if (!cached) cached = (global._mongooseCached = { conn: null, promise: null })

async function connectDB () {
  if (!config.MONGODB_URI) {
    console.warn('MONGODB_URI is not set. Skipping DB connection.')
    return null
  }
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const opts = { maxPoolSize: 10, serverSelectionTimeoutMS: 10_000 }
    console.log('🔌 Connecting to MongoDB...')
    cached.promise = mongoose.connect(config.MONGODB_URI, opts)

    mongoose.connection.on('connected', () => console.log('✅ MongoDB connected'))
    mongoose.connection.on('error', (err) => console.error('❌ MongoDB error:', err))
    mongoose.connection.on('disconnected', () => console.warn('⚠️ MongoDB disconnected'))
  }

  cached.conn = await cached.promise
  return cached.conn
}

async function disconnectDB () {
  if (cached.conn) {
    await mongoose.connection.close(false)
    cached.conn = null
    cached.promise = null
  }
}

module.exports = { connectDB, disconnectDB }
