import { all, put, fork, call } from 'redux-saga/effects';
import { watchAuthSaga } from './authSaga';
import { watchQLTTScopeSaga } from './qlttScopeSaga';
import { merchantSaga } from './merchantSaga';
import { setHasInitialized, loadScopeFromStorage } from '../slices/qlttScopeSlice';
import { restoreSessionRequest } from '../slices/authSlice';
import { reviewsSaga } from './reviewsSaga';

export default function* rootSaga() {
  // 🔥 FIXED: Initialize scope from localStorage on app startup with proper async/await
  function* initializeScope(): Generator<any, any, any> {
    try {
      yield put(loadScopeFromStorage());
      // 🔥 FIX: Add small delay to ensure state is updated
      yield call(() => new Promise(resolve => setTimeout(resolve, 100)));
      yield put(setHasInitialized(true));
    } catch (error) {
      // 🔥 FALLBACK: Set initialized even if loading fails to prevent infinite loading
      yield put(setHasInitialized(true));
    }
  }

  // 🔥 NEW: Restore auth session from storage on app startup
  function* initializeAuth(): Generator<any, any, any> {
    try {
      yield put(restoreSessionRequest());
    } catch (error) {
    }
  }

  // 🔥 FIX: Run initialization first, then start watchers
  yield fork(initializeScope);
  yield fork(initializeAuth);

  yield all([
    fork(watchAuthSaga),
    fork(watchQLTTScopeSaga),
    fork(merchantSaga),
    reviewsSaga(),
  ]);
}
