const { Contact } = require('../models')

const normalize = value => String(value || '').trim()

const createContact = async (payload = {}, userId) => {
  const data = {
    receiverName: normalize(payload.receiverName),
    phone: normalize(payload.phone),
    email: normalize(payload.email).toLowerCase(),
    topic: normalize(payload.topic),
    message: normalize(payload.message)
  }

  const missing = Object.entries(data).filter(([, value]) => !value).map(([field]) => field)
  if (missing.length) throw new Error(`${missing.join(', ')} are required`)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error('A valid email is required')

  if (userId) data.userId = userId
  const contact = await Contact.create(data)
  return { message: 'Contact sent successfully', contact }
}

module.exports = { createContact }
