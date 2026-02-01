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
import { supabase } from '@/api/supabaseClient';
import { tokenStorage } from '@/utils/storage/tokenStorage';

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
    }

    // Sync Supabase client session for DB views that rely on auth.uid()
    if (response.access_token) {
      try {
        const refreshToken = response.refresh_token || (yield call([tokenStorage, tokenStorage.getRefreshToken]));
        if (refreshToken) {
          yield call([supabase.auth, supabase.auth.setSession], {
            access_token: response.access_token,
            refresh_token: refreshToken,
          });
        }
      } catch (error) {
      }
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
    const session = yield call(restoreSession);
    
    if (session) {
      // If we have token but no user, fetch user info first
      if (session.token && !session.user) {
        try {
          const userInfo = yield call(fetchUserInfoApi, session.token);
          if (userInfo) {
            session.user = userInfo;
          }
        } catch (error) {
        }
      }

      // Fetch user permissions if we have user ID
      let permissions: string[] = [];
      if (session.user?.id && session.token) {
        try {
          permissions = yield call(fetchUserPermissions, session.user.id, session.token);
        } catch (error) {
          // Don't block restore if permissions fetch fails
        }
      }

      // Update user with permissions
      const userWithPermissions = session.user 
        ? { ...session.user, permissions }
        : null;

      // Sync Supabase client session for DB views that rely on auth.uid()
      if (session.token) {
        try {
          const refreshToken = yield call([tokenStorage, tokenStorage.getRefreshToken]);
          if (refreshToken) {
            yield call([supabase.auth, supabase.auth.setSession], {
              access_token: session.token,
              refresh_token: refreshToken,
            });
          }
        } catch (error) {
        }
      }

      yield put(restoreSessionSuccess({
        token: session.token,
        user: userWithPermissions,
      }));
      
      // Fetch user info in background to refresh (even if we already have it)
      if (session.token && session.user?.id) {
        yield put(fetchUserInfoRequest(session.token));
      }
    } else {
      // Even if restoreSession returned null, check if token exists in storage
      // This handles edge cases where restoreSession fails but token is still valid
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
        yield put(restoreSessionFailure());
      }
    }
  } catch (error: any) {
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
    yield put(fetchUserInfoFailure());
  }
}

export function* watchAuthSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(restoreSessionRequest.type, handleRestoreSession);
  yield takeEvery(fetchUserInfoRequest.type, handleFetchUserInfo);
}
