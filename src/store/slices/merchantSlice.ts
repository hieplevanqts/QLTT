import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MerchantState {
  currentMerchant: any | null;
  inspectionHistory: any[];
  isLoading: boolean;
  isHistoryLoading: boolean;
  error: string | null;
}

const initialState: MerchantState = {
  currentMerchant: null,
  inspectionHistory: [],
  isLoading: false,
  isHistoryLoading: false,
  error: null,
};

const merchantSlice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    fetchMerchantDetailRequest: (state, _action: PayloadAction<{ merchantId: string; licenseType?: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMerchantDetailSuccess: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.currentMerchant = action.payload;
      state.error = null;
    },
    fetchMerchantDetailFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchInspectionHistoryRequest: (state, _action: PayloadAction<string>) => {
      state.isHistoryLoading = true;
      state.error = null;
    },
    fetchInspectionHistorySuccess: (state, action: PayloadAction<any[]>) => {
      state.isHistoryLoading = false;
      state.inspectionHistory = action.payload;
      state.error = null;
    },
    fetchInspectionHistoryFailure: (state, action: PayloadAction<string>) => {
      state.isHistoryLoading = false;
      state.error = action.payload;
    },
    clearCurrentMerchant: (state) => {
      state.currentMerchant = null;
      state.inspectionHistory = [];
      state.isLoading = false;
      state.isHistoryLoading = false;
      state.error = null;
    },
  },
});

export const {
  fetchMerchantDetailRequest,
  fetchMerchantDetailSuccess,
  fetchMerchantDetailFailure,
  fetchInspectionHistoryRequest,
  fetchInspectionHistorySuccess,
  fetchInspectionHistoryFailure,
  clearCurrentMerchant,
} = merchantSlice.actions;

export default merchantSlice.reducer;
