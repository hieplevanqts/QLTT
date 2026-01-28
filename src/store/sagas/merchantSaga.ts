import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { fetchMerchantDetail, fetchMerchantInspectionResults, fetchMerchantLicenses } from '../../utils/api/merchantsApi';
import {
  fetchMerchantDetailRequest,
  fetchMerchantDetailSuccess,
  fetchMerchantDetailFailure,
  fetchInspectionHistoryRequest,
  fetchInspectionHistorySuccess,
  fetchInspectionHistoryFailure,
  fetchMerchantLicensesRequest,
  fetchMerchantLicensesSuccess,
  fetchMerchantLicensesFailure,
} from '../slices/merchantSlice';

function* handleFetchMerchantDetail(action: PayloadAction<{ merchantId: string; licenseType?: string }>) {
  try {
    const { merchantId, licenseType } = action.payload;
    // @ts-ignore
    const data: any = yield call(fetchMerchantDetail, merchantId, licenseType);
    yield put(fetchMerchantDetailSuccess(data));
  } catch (error: any) {
    yield put(fetchMerchantDetailFailure(error.message || 'Failed to fetch merchant detail'));
  }
}

function* handleFetchInspectionHistory(action: PayloadAction<string>) {
  try {
    const data: any[] = yield call(fetchMerchantInspectionResults, action.payload);
    
    // Sắp xếp dữ liệu mới nhất (dựa trên inspection_date)
    const sortedData = [...data].sort((a, b) => {
      const dateA = a.inspection_date ? new Date(a.inspection_date).getTime() : 0;
      const dateB = b.inspection_date ? new Date(b.inspection_date).getTime() : 0;
      return dateB - dateA;
    });

    yield put(fetchInspectionHistorySuccess(sortedData));
  } catch (error: any) {
    yield put(fetchInspectionHistoryFailure(error.message || 'Failed to fetch inspection history'));
  }
}

function* handleFetchMerchantLicenses(action: PayloadAction<string>) {
  try {
    const data: any[] = yield call(fetchMerchantLicenses, action.payload);
    yield put(fetchMerchantLicensesSuccess(data));
  } catch (error: any) {
    yield put(fetchMerchantLicensesFailure(error.message || 'Failed to fetch merchant licenses'));
  }
}

export function* merchantSaga() {
  yield takeLatest(fetchMerchantDetailRequest.type, handleFetchMerchantDetail);
  yield takeLatest(fetchInspectionHistoryRequest.type, handleFetchInspectionHistory);
  yield takeLatest(fetchMerchantLicensesRequest.type, handleFetchMerchantLicenses);
}
