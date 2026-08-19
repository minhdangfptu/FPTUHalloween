const buildError = (statusCode, message) => Object.assign(new Error(message), { statusCode })

const normalizeEmail = email => String(email || '').trim().toLowerCase()

const parseGoogleResponse = async response => {
  if (!response.ok) throw buildError(401, 'Invalid Google credential')
  return response.json()
}

const verifyGoogleCredential = async ({ credential, accessToken } = {}) => {
  if (!credential && !accessToken) throw buildError(401, 'Google credential is required')

  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) throw buildError(500, 'Google login is not configured')

  let googleUser
  if (credential) {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
    googleUser = await parseGoogleResponse(response)
    if (googleUser.aud !== clientId) throw buildError(401, 'Invalid Google credential')
  } else {
    const tokenInfoResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`)
    const tokenInfo = await parseGoogleResponse(tokenInfoResponse)
    if (tokenInfo.aud !== clientId) throw buildError(401, 'Invalid Google credential')

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    googleUser = await parseGoogleResponse(userInfoResponse)
  }

  if (googleUser.email_verified !== true && googleUser.email_verified !== 'true') {
    throw buildError(401, 'Google email is not verified')
  }

  const email = normalizeEmail(googleUser.email)
  if (!googleUser.sub || !email || !email.includes('@')) throw buildError(401, 'Invalid Google profile')

  return {
    sub: String(googleUser.sub),
    email,
    name: String(googleUser.name || email.split('@')[0]).trim()
  }
}

module.exports = { verifyGoogleCredential }
