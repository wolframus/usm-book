import * as effects from 'redux-saga/effects'

import feeds from './feeds'
import alert from './alert'

export default function* rootSaga() {
  yield effects.all([
    feeds(),
    alert()
  ])
}
