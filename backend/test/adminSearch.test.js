const test = require('node:test')
const assert = require('node:assert/strict')
const { normalizeSearch, searchPattern, idContains } = require('../src/utils/adminSearch')

test('normalizes admin search input and caps its length', () => {
  assert.equal(normalizeSearch('  TTOFF21  '), 'TTOFF21')
  assert.equal(normalizeSearch('a'.repeat(120)).length, 100)
})

test('treats regex special characters as literal search text', () => {
  const pattern = searchPattern('buyer.name+1')
  assert.equal(pattern.test('Buyer.Name+1@example.com'), true)
  assert.equal(pattern.test('buyerXname11@example.com'), false)
})

test('matches a partial MongoDB id in the database query', () => {
  const match = idContains('A.1')
  assert.deepEqual(match, {
    $expr: { $regexMatch: { input: { $toString: '$_id' }, regex: 'A\\.1', options: 'i' } }
  })
})
