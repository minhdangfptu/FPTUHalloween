const isSuccessfulPayOSWebhook = webhook => webhook?.code === '00'
  && webhook?.success === true
  && webhook?.data?.code === '00'

const getWebhookAmount = webhook => Number(webhook?.data?.amount)

module.exports = { isSuccessfulPayOSWebhook, getWebhookAmount }