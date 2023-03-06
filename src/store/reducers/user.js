import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer'

const initialState = {
 data: {}
}

class User extends ImmerReducer {
  setUser(data) {
    if (!data) {
      this.draftState.data = {}
      return
    }
    
   if(data?.email) this.draftState.data.email = data.email
   if(data?.uid) this.draftState.data.uid = data.uid
   if(data?.displayName) this.draftState.data.displayName = data.displayName
   if(data?.photoURL) this.draftState.data.photoURL = data.photoURL
  }
}

export const UserActions = createActionCreators(User)
export default createReducerFunction(User, initialState)
export const UserSelectors = {
 selectCurrentUser: (store) => Object.keys(store.user.data).length ? store.user.data : undefined
}
