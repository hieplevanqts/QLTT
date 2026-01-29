import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MerchantState {
  currentMerchant: any | null;
  inspectionHistory: any[];
  licenses: any[];
  isLoading: boolean;
  isHistoryLoading: boolean;
  isLicensesLoading: boolean;
  error: string | null;
  businessTypes: string[];
  isTypesLoading: boolean;
}

const initialState: MerchantState = {
  currentMerchant: null,
  inspectionHistory: [],
  licenses: [],
  isLoading: false,
  isHistoryLoading: false,
  isLicensesLoading: false,
  error: null,
  businessTypes: [],
  isTypesLoading: false,
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
    fetchMerchantLicensesRequest: (state, _action: PayloadAction<string>) => {
      state.isLicensesLoading = true;
      state.error = null;
    },
    fetchMerchantLicensesSuccess: (state, action: PayloadAction<any[]>) => {
      state.isLicensesLoading = false;
      state.licenses = action.payload;
      state.error = null;
    },
    fetchMerchantLicensesFailure: (state, action: PayloadAction<string>) => {
      state.isLicensesLoading = false;
      state.error = action.payload;
    },
    clearCurrentMerchant: (state) => {
      state.currentMerchant = null;
      state.inspectionHistory = [];
      state.licenses = [];
      state.isLoading = false;
      state.isHistoryLoading = false;
      state.isLicensesLoading = false;
      state.error = null;
    },
    fetchBusinessTypesRequest: (state) => {
      state.isTypesLoading = true;
    },
    fetchBusinessTypesSuccess: (state, action) => {
      state.businessTypes = action.payload;
      state.isTypesLoading = false;
    },
    fetchBusinessTypesFailure: (state) => {
      state.isTypesLoading = false;
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
  fetchMerchantLicensesRequest,
  fetchMerchantLicensesSuccess,
  fetchMerchantLicensesFailure,
  clearCurrentMerchant,
  fetchBusinessTypesRequest,
  fetchBusinessTypesSuccess,
  fetchBusinessTypesFailure
} = merchantSlice.actions;

export default merchantSlice.reducer;
