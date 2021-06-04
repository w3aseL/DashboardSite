import constants from './constants'
import { getRefreshToken } from '../../api/cookies'

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  loggedIn: (getRefreshToken() ? true : false),
  user: (localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null)
}

export default (state=initialState, action) => {
  switch(action.type) {
    case constants.LOGIN_REQUEST: {
      return { ...state, loading: true, loaded: false }
    }
    case constants.LOGIN_SUCCESS: {
      return { ...state, loading: false, loaded: true, loggedIn: true, user: action.payload }
    }
    case constants.LOGIN_ERROR: {
      return { ...state, loading: false, error: action.payload }
    }
    case constants.LOGOUT_REQUEST: {
      return { ...state, loading: true, loaded: false }
    }
    case constants.LOGOUT_SUCCESS: {
      return { ...state, loading: false, loaded: true, loggedIn: false, user: null }
    }
    case constants.LOGOUT_ERROR: {
      return { ...state, loading: false, error: action.payload }
    }
  }

  return state
}