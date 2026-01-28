import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { fetchMerchantDetail } from '../../utils/api/merchantsApi';
import {
  fetchMerchantDetailRequest,
  fetchMerchantDetailSuccess,
  fetchMerchantDetailFailure,
} from '../slices/merchantSlice';

function* handleFetchMerchantDetail(action: PayloadAction<{ merchantId: string; licenseType?: string }>) {
  try {
    const { merchantId, licenseType } = action.payload;
    const data: any = yield call(fetchMerchantDetail, merchantId, licenseType);
    yield put(fetchMerchantDetailSuccess(data));
  } catch (error: any) {
    yield put(fetchMerchantDetailFailure(error.message || 'Failed to fetch merchant detail'));
  }
}

export function* merchantSaga() {
  yield takeLatest(fetchMerchantDetailRequest.type, handleFetchMerchantDetail);
}
