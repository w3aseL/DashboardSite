import cookies from 'js-cookie'

/**
 * Cookie Handling
 * ----------------------
 * For the tokens only, we will store these in a HTTP only cookie (security)
 * Everything else will be stored in the redux state store
 */
const accessCookieName = "access_token"          //We'll make this more secure later
const refreshCookieName = "refresh_token"        //We'll make this more secure later as well

export function getAccessToken() {
  return cookies.get(accessCookieName)
}

export function getRefreshToken() {
  return cookies.get(refreshCookieName)
}

export function updateTokens(tokens) {
  const { access_token, refresh_token } = tokens

  cookies.set(accessCookieName, access_token, { expires: 1/24 })
  if(refresh_token) cookies.set(refreshCookieName, refresh_token, { expires: 7 })
}

export function removeTokens() {
  cookies.remove(accessCookieName)
  cookies.remove(refreshCookieName)
}