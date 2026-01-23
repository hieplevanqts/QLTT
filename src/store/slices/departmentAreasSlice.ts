import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DepartmentAreasResponse } from '../../utils/api/departmentAreasApi';

interface DepartmentAreasState {
  data: DepartmentAreasResponse | null;
  isLoading: boolean;
  error: string | null;
  currentDepartmentId: string | null;
}

const initialState: DepartmentAreasState = {
  data: null,
  isLoading: false,
  error: null,
  currentDepartmentId: null,
};

const departmentAreasSlice = createSlice({
  name: 'departmentAreas',
  initialState,
  reducers: {
    setDepartmentAreas: (state, action: PayloadAction<DepartmentAreasResponse | null>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setCurrentDepartmentId: (state, action: PayloadAction<string | null>) => {
      state.currentDepartmentId = action.payload;
    },
    clearDepartmentAreas: (state) => {
      state.data = null;
      state.error = null;
      state.currentDepartmentId = null;
    },
    resetDepartmentAreas: (state) => {
      state.data = null;
      state.isLoading = false;
      state.error = null;
      state.currentDepartmentId = null;
    },
  },
});

export const {
  setDepartmentAreas,
  setLoading,
  setError,
  setCurrentDepartmentId,
  clearDepartmentAreas,
  resetDepartmentAreas,
} = departmentAreasSlice.actions;

export default departmentAreasSlice.reducer;
