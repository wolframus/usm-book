import * as effects from 'redux-saga/effects'

import { AlertActions} from '../reducers/alert'

function* setAlertText() {
 try {
  yield effects.delay(4_000)
  yield effects.put(AlertActions.hideAlertText())
  yield effects.delay(1_000)
  yield effects.put(AlertActions.clearAlertText())
} catch (err) {
  console.log("error: ",  err)
 }
}
export default function* root() {
  yield effects.all([
    effects.takeLatest(AlertActions.setAlertText.type, setAlertText),
  ])
}
