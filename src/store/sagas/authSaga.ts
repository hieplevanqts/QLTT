import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { loginRequest, loginSuccess, loginFailure } from '../slices/authSlice';

// Giả lập hàm API
const loginApi = (credentials: any) => 
  fetch('https://api.example.com/login', { method: 'POST', body: JSON.stringify(credentials) })
    .then(res => res.json());

function* handleLogin(action: PayloadAction<any>): Generator<any, any, any> {
  try {
    const user = yield call(loginApi, action.payload);
    yield put(loginSuccess(user));
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}

export function* watchAuthSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}