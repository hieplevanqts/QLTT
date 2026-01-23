import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OfficerDepartment } from '../../utils/api/officerFilterApi';

interface OfficerFilterState {
  departments: OfficerDepartment[];
  isLoading: boolean;
  error: string | null;
  selectedDepartmentId: string;
}

const initialState: OfficerFilterState = {
  departments: [],
  isLoading: false,
  error: null,
  selectedDepartmentId: '',
};

const officerFilterSlice = createSlice({
  name: 'officerFilter',
  initialState,
  reducers: {
    setSelectedDepartmentId: (state, action: PayloadAction<string>) => {
      state.selectedDepartmentId = action.payload;
    },
    setDepartments: (state, action: PayloadAction<OfficerDepartment[]>) => {
      state.departments = action.payload;
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
    clearDepartments: (state) => {
      state.departments = [];
      state.error = null;
    },
    resetOfficerFilter: (state) => {
      state.departments = [];
      state.isLoading = false;
      state.error = null;
      state.selectedDepartmentId = '';
    },
  },
});

export const {
  setSelectedDepartmentId,
  setDepartments,
  setLoading,
  setError,
  clearDepartments,
  resetOfficerFilter,
} = officerFilterSlice.actions;

export default officerFilterSlice.reducer;
