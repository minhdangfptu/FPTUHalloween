const test = require('node:test')
const assert = require('node:assert/strict')
const { isSuccessfulPayOSWebhook, getWebhookAmount } = require('../src/utils/payOSWebhook')

test('accepts only a successful PayOS webhook', () => {
  assert.equal(isSuccessfulPayOSWebhook({ code: '00', success: true, data: { code: '00', amount: 120000 } }), true)
  assert.equal(isSuccessfulPayOSWebhook({ code: '00', success: false, data: { code: '00', amount: 120000 } }), false)
  assert.equal(isSuccessfulPayOSWebhook({ code: '01', success: true, data: { code: '01', amount: 120000 } }), false)
  assert.equal(isSuccessfulPayOSWebhook({ code: '00', success: true, data: { code: '01', amount: 120000 } }), false)
})

test('reads the paid amount from webhook data', () => {
  assert.equal(getWebhookAmount({ data: { amount: '120000' } }), 120000)
  assert.equal(Number.isNaN(getWebhookAmount({ data: {} })), true)
})