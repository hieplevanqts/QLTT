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
  getStoredToken,
} from '../../utils/api/authApi';
import { supabase } from '@/api/supabaseClient';
import { tokenStorage } from '@/utils/storage/tokenStorage';
import { getIamIdentity } from '@/shared/iam/iam.service';

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
        console.warn('⚠️ AuthSaga: Failed to set Supabase session', error);
      }
    }

    // Fetch full user info after login
    let userInfo = response.user || null;
    if (response.access_token && !userInfo) {
      userInfo = yield call(fetchUserInfoApi, response.access_token);
    }

    // Fetch IAM identity (roles + permissions) after login
    let permissions: string[] = [];
    let roleCodes: string[] | undefined;
    let primaryRoleCode: string | undefined;
    let resolvedUserId: string | undefined;
    let authUid: string | undefined;
    if (response.access_token) {
      try {
        const identity = yield call(getIamIdentity, { force: true });
        if (identity) {
          permissions = identity.permissionCodes;
          roleCodes = identity.roleCodes;
          primaryRoleCode = identity.primaryRoleCode;
          resolvedUserId = identity.userId;
          authUid = identity.authUid;
        }
      } catch (error) {
        console.error('Error fetching IAM identity:', error);
      }
    }

    // Dispatch success action with full response including permissions
    const userWithPermissions = userInfo
      ? {
          ...userInfo,
          permissions,
          roleCodes,
          roleCode: primaryRoleCode,
          _id: resolvedUserId ?? (userInfo as any)?._id,
          auth_uid: authUid,
        }
      : (response.user || undefined);
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
          console.warn('⚠️ AuthSaga: Failed to set Supabase session', error);
        }
      }

      // Fetch IAM identity (roles + permissions)
      let permissions: string[] = [];
      let roleCodes: string[] | undefined;
      let primaryRoleCode: string | undefined;
      let resolvedUserId: string | undefined;
      let authUid: string | undefined;
      try {
        console.log('🔄 AuthSaga: Fetching IAM identity for user');
        const identity = yield call(getIamIdentity, { force: true });
        if (identity) {
          permissions = identity.permissionCodes;
          roleCodes = identity.roleCodes;
          primaryRoleCode = identity.primaryRoleCode;
          resolvedUserId = identity.userId;
          authUid = identity.authUid;
          console.log('✅ AuthSaga: IAM identity loaded', identity.userId);
        }
      } catch (error) {
        console.warn('⚠️ AuthSaga: Error fetching IAM identity:', error);
      }

      // Update user with permissions
      const userWithPermissions = session.user 
        ? {
            ...session.user,
            permissions,
            roleCodes,
            roleCode: primaryRoleCode,
            _id: resolvedUserId ?? (session.user as any)?._id,
            auth_uid: authUid,
          }
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
          // Sync Supabase session so IAM queries can use auth.uid()
          try {
            const refreshToken = yield call([tokenStorage, tokenStorage.getRefreshToken]);
            if (refreshToken) {
              yield call([supabase.auth, supabase.auth.setSession], {
                access_token: storedToken,
                refresh_token: refreshToken,
              });
            }
          } catch (error) {
            console.warn('⚠️ AuthSaga: Failed to set Supabase session (fallback)', error);
          }

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
      // Fetch IAM identity to update roles + permissions
      let permissions: string[] = [];
      let roleCodes: string[] | undefined;
      let primaryRoleCode: string | undefined;
      let resolvedUserId: string | undefined;
      let authUid: string | undefined;
      try {
        const identity = yield call(getIamIdentity, { force: true });
        if (identity) {
          permissions = identity.permissionCodes;
          roleCodes = identity.roleCodes;
          primaryRoleCode = identity.primaryRoleCode;
          resolvedUserId = identity.userId;
          authUid = identity.authUid;
        }
      } catch (error) {
        console.error('Error fetching IAM identity:', error);
      }

      yield put(fetchUserInfoSuccess({
        ...userInfo,
        permissions,
        roleCodes,
        roleCode: primaryRoleCode,
        _id: resolvedUserId ?? (userInfo as any)?._id,
        auth_uid: authUid,
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
