const logger = {
  error: (message, metadata = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, metadata)
  }
}

module.exports = logger
