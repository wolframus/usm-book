import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer'

const initialState = {
  show: false,
  type: undefined, 
  data: undefined,
}

class Alert extends ImmerReducer {
  setAlertText(data, type) {
    this.draftState.data = data
    this.draftState.type = type || 'success'
    this.draftState.show = true
  }

  hideAlertText() {
    this.draftState.show = false
  }

  clearAlertText() {
    this.draftState.text = undefined
  }
}

export const AlertActions = createActionCreators(Alert)
export default createReducerFunction(Alert, initialState)
export const AlertSelectors = {
  selectAlertData: (store) => store.alert,
}
