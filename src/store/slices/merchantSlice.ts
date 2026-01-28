import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MerchantState {
  currentMerchant: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MerchantState = {
  currentMerchant: null,
  isLoading: false,
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
    clearCurrentMerchant: (state) => {
      state.currentMerchant = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  fetchMerchantDetailRequest,
  fetchMerchantDetailSuccess,
  fetchMerchantDetailFailure,
  clearCurrentMerchant,
} = merchantSlice.actions;

export default merchantSlice.reducer;
