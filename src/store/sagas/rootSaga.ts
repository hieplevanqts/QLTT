import { all, put } from 'redux-saga/effects';
import { watchAuthSaga } from './authSaga';
import { watchQLTTScopeSaga } from './qlttScopeSaga';
import { setHasInitialized, loadScopeFromStorage } from '../slices/qlttScopeSlice';
// import { watchProductSaga } from './productSaga';

export default function* rootSaga() {
  // Initialize scope from localStorage on app startup
  try {
    yield put(loadScopeFromStorage());
    yield put(setHasInitialized(true));
    console.log('✅ RootSaga: QLTT Scope initialized on app startup');
  } catch (error) {
    console.error('❌ RootSaga: Failed to initialize QLTT Scope:', error);
  }

  yield all([
    watchAuthSaga(),
    watchQLTTScopeSaga(),
    // watchProductSaga(),
  ]);
}