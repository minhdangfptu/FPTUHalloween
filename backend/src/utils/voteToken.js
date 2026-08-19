const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const VOTE_SESSION_TTL_SECONDS = 15 * 60

const getVoteSecret = () => {
  const secret = process.env.VOTE_SESSION_SECRET || process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET
  if (!secret) throw Object.assign(new Error('Vote session secret is not configured'), { statusCode: 500 })
  return secret
}

const hashGoogleSubject = subject => {
  const secret = process.env.VOTE_IDENTITY_HASH_SECRET || getVoteSecret()
  return crypto.createHmac('sha256', secret).update(String(subject)).digest('hex')
}

const createVoteSessionToken = ({ googleSubHash, email, name }) => jwt.sign(
  { scope: 'dday-vote', googleSubHash, email, name },
  getVoteSecret(),
  { expiresIn: VOTE_SESSION_TTL_SECONDS }
)

const verifyVoteSessionToken = token => jwt.verify(token, getVoteSecret())

module.exports = {
  VOTE_SESSION_TTL_SECONDS,
  hashGoogleSubject,
  createVoteSessionToken,
  verifyVoteSessionToken
}
