const { config } = require('./environment')
const { connectDB, disconnectDB } = require('./mongodb')
const { corsConfig } = require('./cors')

module.exports = { config, connectDB, disconnectDB, corsConfig }
