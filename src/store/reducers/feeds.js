import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer'

const initialState = {
  data: [],
  isLoading: false,
  lastVisible: undefined,
  allowFetchMore: true,
}

class Feeds extends ImmerReducer {
  intentFetchPosts() {
    this.draftState.isLoading = true
  }

  handlePushPosts(posts, lastVisible, allowFetchMore) {
    this.draftState.data.push(...posts)
    this.draftState.isLoading = false
    this.draftState.lastVisible = lastVisible
    this.draftState.allowFetchMore = allowFetchMore
  }

  setIsLoading(isLoading) {
    this.draftState.isLoading = isLoading
  }

  pushCreated(post) {
    this.draftState.data.unshift(post)
  }

  removePost(id) {
    const index = this.draftState.data.findIndex(item => item.id === id)
    if (index > -1) {
      this.draftState.data.splice(index, 1)
    }
  }
}

export const FeedsActions = createActionCreators(Feeds)
export default createReducerFunction(Feeds, initialState)
export const FeedsSelectors = {
  selectFeedPosts: (store) => store.feeds.data,
  selectFeedPostsIsLoading: (store) => store.feeds.isLoading,
  selectAllowFetchMore: (store) => store.feeds.allowFetchMore,
  selectFeedPostsLastVisible: (store) => store.feeds.lastVisible,
}
