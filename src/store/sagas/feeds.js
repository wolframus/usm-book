import * as effects from 'redux-saga/effects'

import API from '../../api'
import { FeedsActions, FeedsSelectors } from '../reducers/feeds'

function* intentFetchPosts() {
 try {
  const oldLastVisible = yield effects.select(FeedsSelectors.selectFeedPostsLastVisible)
  const oldAllowFetchMore = yield effects.select(FeedsSelectors.selectAllowFetchMore)

   if (!oldAllowFetchMore) {
      yield effects.put(FeedsActions.setIsLoading(false))
      return 
   }
   
  const {posts, lastVisible, allowFetchMore} = yield effects.call(API.Firebase.Posts.getPosts, oldLastVisible?.createdAt)
  
  yield effects.put(FeedsActions.handlePushPosts(posts, lastVisible, allowFetchMore))
 } catch (err) {
  console.log("error: ",  err)
 }
}
export default function* root() {
  yield effects.all([
    effects.takeLatest(FeedsActions.intentFetchPosts.type, intentFetchPosts),
  ])
}
