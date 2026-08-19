const { verifyVoteSessionToken } = require('../utils/voteToken')

const requireVoteSession = (req, res, next) => {
  const header = String(req.headers.authorization || '')
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token) return res.status(401).json({ success: false, message: 'Missing vote session token', data: null })

  try {
    const decoded = verifyVoteSessionToken(token)
    if (decoded.scope !== 'dday-vote' || !decoded.googleSubHash) {
      return res.status(401).json({ success: false, message: 'Invalid vote session token', data: null })
    }
    req.voteUser = {
      googleSubHash: decoded.googleSubHash,
      email: decoded.email,
      name: decoded.name
    }
    return next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired vote session', data: null })
  }
}

module.exports = { requireVoteSession }
