import constants from './constants'
import { request } from '../../api'
import { updateTokens, removeTokens } from '../../api/cookies'
import { history } from '../../helpers/history'

function findElem(arr, key, value) {
  for(let i = 0; i < arr.length; i++)
    if (arr[i][key] == value) return arr[i]
}

export function loginUser(data) {
  return async (dispatch) => {
    dispatch({ type: constants.LOGIN_REQUEST })

    request("/user/login", data, "POST", false)
      .then(res => {
        updateTokens(res.data)

        localStorage.setItem("user", JSON.stringify(res.data.user))

        history.push("/dashboard")
        dispatch({ type: constants.LOGIN_SUCCESS, payload: res.data.user })
      })
      .catch(err => {
        dispatch({ type: constants.LOGIN_ERROR, payload: err })
      })
  }
}

export function logoutUser() {
  return dispatch => {
    dispatch({ type: constants.LOGOUT_REQUEST })

    // TODO: Rewrite logout setup
    localStorage.removeItem("user")

    removeTokens()
    history.push("/")
    dispatch({ type: constants.LOGOUT_SUCCESS })
  }
}