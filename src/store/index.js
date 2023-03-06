import createSagaMiddleware from 'redux-saga'
import { createStore, combineReducers, applyMiddleware } from 'redux'

import sagas from './sagas'
import reducers from './reducers'

const context = {
  dispatch: () => {},
}

const sagaMiddleware = createSagaMiddleware({ context })

const rootStore = combineReducers(reducers)
const store = createStore(rootStore, applyMiddleware(sagaMiddleware))

context.dispatch = store.dispatch

sagaMiddleware.run(sagas)

export const { dispatch } = store

export default store
