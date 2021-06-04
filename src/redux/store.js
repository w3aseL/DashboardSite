import { applyMiddleware, combineReducers, createStore } from "redux"
import { createLogger } from "redux-logger"
import thunk from 'redux-thunk';

import authReducer from "./auth/reducer"

const logger = createLogger()

const rootReducer = combineReducers({
  auth: authReducer
})

export const store = createStore(rootReducer, applyMiddleware(logger, thunk))