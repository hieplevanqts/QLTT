import { all, put, fork, call } from 'redux-saga/effects';
import { watchAuthSaga } from './authSaga';
import { watchQLTTScopeSaga } from './qlttScopeSaga';
import { setHasInitialized, loadScopeFromStorage } from '../slices/qlttScopeSlice';
// import { watchProductSaga } from './productSaga';

export default function* rootSaga() {
  // 🔥 FIXED: Initialize scope from localStorage on app startup with proper async/await
  function* initializeScope(): Generator<any, any, any> {
    try {
      yield put(loadScopeFromStorage());
      // 🔥 FIX: Add small delay to ensure state is updated
      yield call(() => new Promise(resolve => setTimeout(resolve, 100)));
      yield put(setHasInitialized(true));
      console.log('✅ RootSaga: QLTT Scope initialized on app startup');
    } catch (error) {
      console.error('❌ RootSaga: Failed to initialize QLTT Scope:', error);
      // 🔥 FALLBACK: Set initialized even if loading fails to prevent infinite loading
      yield put(setHasInitialized(true));
    }
  }

  // 🔥 FIX: Run initialization first, then start watchers
  yield fork(initializeScope);

  yield all([
    fork(watchAuthSaga),
    fork(watchQLTTScopeSaga),
    // watchProductSaga(),
  ]);
}