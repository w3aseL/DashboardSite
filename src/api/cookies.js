import cookies from 'js-cookie'

/**
 * Cookie Handling
 * ----------------------
 * For the tokens only, we will store these in a HTTP only cookie (security)
 * Everything else will be stored in the redux state store
 */
const accessCookieName = "accessToken"          //We'll make this more secure later
const refreshCookieName = "refreshToken"        //We'll make this more secure later as well

export function getAccessToken() {
  return cookies.get(accessCookieName)
}

export function getRefreshToken() {
  return cookies.get(refreshCookieName)
}

export function updateTokens(tokens) {
  const { accessToken, refreshToken } = tokens

  cookies.set(accessCookieName, accessToken, { expires: 1/24 })
  if(refreshToken) cookies.set(refreshCookieName, refreshToken, { expires: 7 })
}

export function removeTokens() {
  cookies.remove(accessCookieName)
  cookies.remove(refreshCookieName)
}