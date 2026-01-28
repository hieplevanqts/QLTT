import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Category filter type (status filters)
export type CategoryFilter = {
  [key: string]: boolean;
};

// Map filters state interface
interface MapFiltersState {
  // Active filters (applied)
  filters: CategoryFilter;
  businessTypeFilters: { [key: string]: boolean };
  departmentFilters: { [key: string]: boolean };
  
  // Pending filters (UI state, not yet applied)
  pendingFilters: CategoryFilter;
  pendingBusinessTypeFilters: { [key: string]: boolean };
  pendingDepartmentFilters: { [key: string]: boolean };
  
  // Location filters
  selectedProvince: string;
  selectedDistrict: string;
  selectedWard: string;
  
  // UI state
  isFilterPanelOpen: boolean;
  isInitializing: boolean;
  
  // Pagination
  limit: number;
}

const initialState: MapFiltersState = {
  filters: {},
  businessTypeFilters: {},
  departmentFilters: {},
  pendingFilters: {},
  pendingBusinessTypeFilters: {},
  pendingDepartmentFilters: {},
  selectedProvince: '',
  selectedDistrict: '',
  selectedWard: '',
  isFilterPanelOpen: false,
  isInitializing: false,
  limit: 10000, // Default limit value
};

const mapFiltersSlice = createSlice({
  name: 'mapFilters',
  initialState,
  reducers: {
    // Set active filters (applied)
    setFilters: (state, action: PayloadAction<CategoryFilter>) => {
      state.filters = action.payload;
      state.pendingFilters = action.payload;
    },
    
    setBusinessTypeFilters: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.businessTypeFilters = action.payload;
      state.pendingBusinessTypeFilters = action.payload;
    },
    
    setDepartmentFilters: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.departmentFilters = action.payload;
      state.pendingDepartmentFilters = action.payload;
    },
    
    // Set pending filters (UI state)
    setPendingFilters: (state, action: PayloadAction<CategoryFilter>) => {
      state.pendingFilters = action.payload;
    },
    
    setPendingBusinessTypeFilters: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.pendingBusinessTypeFilters = action.payload;
    },
    
    setPendingDepartmentFilters: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.pendingDepartmentFilters = action.payload;
    },
    
    // Apply pending filters (when user clicks "Apply")
    applyPendingFilters: (state) => {
      state.filters = state.pendingFilters;
      state.businessTypeFilters = state.pendingBusinessTypeFilters;
      state.departmentFilters = state.pendingDepartmentFilters;
    },
    
    // Reset filters
    resetFilters: (state) => {
      state.filters = {};
      state.businessTypeFilters = {};
      state.departmentFilters = {};
      state.pendingFilters = {};
      state.pendingBusinessTypeFilters = {};
      state.pendingDepartmentFilters = {};
    },
    
    // Location filters
    setSelectedProvince: (state, action: PayloadAction<string>) => {
      const oldProvince = state.selectedProvince;
      state.selectedProvince = action.payload;
      // Clear ward when province changes
      if (oldProvince !== action.payload) {
        state.selectedWard = '';
      }
    },
    
    setSelectedDistrict: (state, action: PayloadAction<string>) => {
      state.selectedDistrict = action.payload;
    },
    
    setSelectedWard: (state, action: PayloadAction<string>) => {
      state.selectedWard = action.payload;
    },
    
    // UI state
    setFilterPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterPanelOpen = action.payload;
    },
    
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.isInitializing = action.payload;
    },
    
    // Pagination
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
  },
});

export const {
  setFilters,
  setBusinessTypeFilters,
  setDepartmentFilters,
  setPendingFilters,
  setPendingBusinessTypeFilters,
  setPendingDepartmentFilters,
  applyPendingFilters,
  resetFilters,
  setSelectedProvince,
  setSelectedDistrict,
  setSelectedWard,
  setFilterPanelOpen,
  setInitializing,
  setLimit,
} = mapFiltersSlice.actions;

export default mapFiltersSlice.reducer;
