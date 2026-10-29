const test = require('node:test')
const assert = require('node:assert/strict')
const { getWheelPath } = require('../src/utils/wheel-path')

test('ignores the Wheel of Names 404 sentinel and uses a valid wheel path', () => {
  const result = getWheelPath({
    data: {
      path: '404',
      wheels: [{ path: 'asg-mep' }]
    }
  })

  assert.equal(result, 'asg-mep')
})

test('returns null when the sync response has no usable wheel path', () => {
  assert.equal(getWheelPath({ data: { path: '404' } }), null)
})
