const normalizeWheelPath = path => {
  const value = String(path || '').trim()
  return value && value !== '404' ? value : null
}

const getWheelPath = result => [
  result?.data?.path,
  result?.data?.wheel?.path,
  result?.data?.wheels?.[0]?.path
].map(normalizeWheelPath).find(Boolean) || null

const buildWheelLink = path => {
  const normalizedPath = normalizeWheelPath(path)
  if (!normalizedPath) return null
  return { path: normalizedPath, url: `https://wheelofnames.com/${normalizedPath}` }
}

module.exports = { normalizeWheelPath, getWheelPath, buildWheelLink }
