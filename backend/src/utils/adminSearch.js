const normalizeSearch = value => String(value || '').trim().slice(0, 100)

const searchPattern = value => new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')

const idContains = value => ({
  $expr: {
    $regexMatch: {
      input: { $toString: '$_id' },
      regex: searchPattern(value).source,
      options: 'i'
    }
  }
})

module.exports = { normalizeSearch, searchPattern, idContains }
