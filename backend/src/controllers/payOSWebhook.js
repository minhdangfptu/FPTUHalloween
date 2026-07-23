const payOSService = require('../services/payOS')

const handleWebhook = async (req, res) => {
  try {
    const result = await payOSService.handleWebhook(req.body)
    return res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.error('PayOS webhook error:', error.message)
    return res.status(400).json({ success: false, message: 'Invalid PayOS webhook' })
  }
}

module.exports = { handleWebhook }
