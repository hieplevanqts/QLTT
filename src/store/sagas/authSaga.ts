import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { 
  loginRequest, 
  loginSuccess, 
  loginFailure,
  restoreSessionRequest,
  restoreSessionSuccess,
  restoreSessionFailure,
  fetchUserInfoRequest,
  fetchUserInfoSuccess,
  fetchUserInfoFailure,
} from '../slices/authSlice';
import { 
  login as loginApi, 
  storeToken, 
  LoginResponse,
  restoreSession,
  fetchUserInfo as fetchUserInfoApi,
  fetchUserPermissions,
  getStoredToken,
} from '../../utils/api/authApi';

function* handleLogin(action: PayloadAction<{ email: string; password: string }>): Generator<any, any, any> {
  try {
    const response: LoginResponse = yield call(loginApi, {
      email: action.payload.email,
      password: action.payload.password,
    });

    // Store token and refresh token using professional storage (encrypted, secure)
    if (response.access_token) {
      yield call(storeToken, response.access_token, response.expires_in, response.refresh_token);
    } else {
      console.warn('⚠️ AuthSaga: No access_token in login response');
    }

    // Fetch full user info after login
    let userInfo = response.user || null;
    if (response.access_token && !userInfo) {
      userInfo = yield call(fetchUserInfoApi, response.access_token);
    }

    // Fetch user permissions if we have user ID
    let permissions: string[] = [];
    if (response.access_token && userInfo?.id) {
      try {
        permissions = yield call(fetchUserPermissions, userInfo.id, response.access_token);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        // Don't block login if permissions fetch fails
      }
    }

    // Dispatch success action with full response including permissions
    const userWithPermissions = userInfo ? { ...userInfo, permissions } : (response.user || undefined);
    yield put(loginSuccess({
      ...response,
      user: userWithPermissions,
    }));

    // Fetch user info in background to refresh permissions/roles
    if (response.access_token && userInfo?.id) {
      yield put(fetchUserInfoRequest());
    }
  } catch (error: any) {
    // Extract error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Đăng nhập thất bại. Vui lòng thử lại.';
    
    yield put(loginFailure(errorMessage));
  }
}

function* handleRestoreSession(): Generator<any, any, any> {
  try {
    console.log('🔄 AuthSaga: handleRestoreSession started');
    const session = yield call(restoreSession);
    
    if (session) {
      // If we have token but no user, fetch user info first
      if (session.token && !session.user) {
        try {
          const userInfo = yield call(fetchUserInfoApi, session.token);
          if (userInfo) {
            session.user = userInfo;
            console.log('✅ AuthSaga: User info fetched:', userInfo.id);
          }
        } catch (error) {
          console.warn('⚠️ AuthSaga: Failed to fetch user info during restore:', error);
        }
      }

      // Fetch user permissions if we have user ID
      let permissions: string[] = [];
      if (session.user?.id && session.token) {
        try {
          console.log('🔄 AuthSaga: Fetching permissions for user:', session.user.id);
          permissions = yield call(fetchUserPermissions, session.user.id, session.token);
          console.log('✅ AuthSaga: Permissions fetched:', permissions.length, 'permissions');
        } catch (error) {
          console.warn('⚠️ AuthSaga: Error fetching permissions:', error);
          // Don't block restore if permissions fetch fails
        }
      }

      // Update user with permissions
      const userWithPermissions = session.user 
        ? { ...session.user, permissions }
        : null;

      console.log('✅ AuthSaga: Dispatching restoreSessionSuccess');
      yield put(restoreSessionSuccess({
        token: session.token,
        user: userWithPermissions,
      }));
      
      // Fetch user info in background to refresh (even if we already have it)
      if (session.token && session.user?.id) {
        console.log('🔄 AuthSaga: Triggering background user info refresh');
        yield put(fetchUserInfoRequest(session.token));
      }
    } else {
      // Even if restoreSession returned null, check if token exists in storage
      // This handles edge cases where restoreSession fails but token is still valid
      console.log('⚠️ AuthSaga: restoreSession returned null, checking storage...');
      try {
        const storedToken = yield call(getStoredToken);
        if (storedToken) {
          // Restore with token only, user will be fetched later
          yield put(restoreSessionSuccess({
            token: storedToken,
            user: null,
          }));
          
          // Try to fetch user info in background
          yield put(fetchUserInfoRequest(storedToken));
        } else {
          yield put(restoreSessionFailure());
        }
      } catch (error) {
        console.error('❌ AuthSaga: Error checking storage:', error);
        yield put(restoreSessionFailure());
      }
    }
  } catch (error: any) {
    console.error('❌ AuthSaga: Error in handleRestoreSession:', error);
    yield put(restoreSessionFailure());
  }
}

function* handleFetchUserInfo(action: PayloadAction<string | undefined>): Generator<any, any, any> {
  try {
    // Get token from action payload or from storage
    let token = action.payload;
    
    if (!token) {
      // Try to get from storage
      token = yield call(getStoredToken);
    }
    
    if (!token) {
      yield put(fetchUserInfoFailure());
      return;
    }
    
    const userInfo = yield call(fetchUserInfoApi, token);
    if (userInfo) {
      // Fetch permissions
      let permissions: string[] = [];
      if (userInfo.id) {
        try {
          permissions = yield call(fetchUserPermissions, userInfo.id, token);
        } catch (error) {
          console.error('Error fetching permissions:', error);
        }
      }

      // Update user with permissions
      yield put(fetchUserInfoSuccess({
        ...userInfo,
        permissions,
      }));
    } else {
      yield put(fetchUserInfoFailure());
    }
  } catch (error: any) {
    console.error('Error fetching user info:', error);
    yield put(fetchUserInfoFailure());
  }
}

export function* watchAuthSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(restoreSessionRequest.type, handleRestoreSession);
  yield takeEvery(fetchUserInfoRequest.type, handleFetchUserInfo);
}