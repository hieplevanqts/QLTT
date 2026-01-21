import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Interfaces - match với QLTTScopeContext
export interface QLTTScope {
  divisionId: string | null; // Chi cục (departments level 2)
  teamId: string | null;     // Đội (departments level 3)
  areaId: string | null;     // areas.id
  province: string | null;   // province code (for downstream filters)
  ward: string | null;       // ward code (for downstream filters)
}

export interface ScopeDepartment {
  id: string;
  parent_id: string | null;
  name: string;
  code?: string | null;
  level?: number | null;
}

export interface ScopeArea {
  id: string;
  name: string;
  code?: string;
  wardCode?: string | null;
  provinceCode?: string | null;
}

export interface ScopeLocks {
  division: boolean;
  team: boolean;
}

interface QLTTScopeState {
  scope: QLTTScope;
  locks: ScopeLocks;
  availableDivisions: ScopeDepartment[];
  availableTeams: ScopeDepartment[];
  availableAreas: ScopeArea[];
  canChangeScope: boolean;
  isLoading: boolean;
  hasInitialized: boolean;
  error: string | null;
}

const initialState: QLTTScopeState = {
  scope: {
    divisionId: null,
    teamId: null,
    areaId: null,
    province: null,
    ward: null,
  },
  locks: {
    division: false,
    team: false,
  },
  availableDivisions: [],
  availableTeams: [],
  availableAreas: [],
  canChangeScope: false,
  isLoading: false,
  hasInitialized: false,
  error: null,
};

const qlttScopeSlice = createSlice({
  name: 'qlttScope',
  initialState,
  reducers: {
    // Set the entire scope
    setScope: (state, action: PayloadAction<QLTTScope>) => {
      state.scope = action.payload;
      // Save to localStorage
      try {
        localStorage.setItem('mappa-scope', JSON.stringify(action.payload));
        console.log('✅ QLTTScopeSlice: Scope saved to localStorage:', action.payload);
      } catch (error) {
        console.error('❌ QLTTScopeSlice: Failed to save scope to localStorage:', error);
      }
    },

    // Update part of scope
    updateScope: (state, action: PayloadAction<Partial<QLTTScope>>) => {
      state.scope = { ...state.scope, ...action.payload };
      try {
        localStorage.setItem('mappa-scope', JSON.stringify(state.scope));
        console.log('✅ QLTTScopeSlice: Scope updated and saved:', state.scope);
      } catch (error) {
        console.error('❌ QLTTScopeSlice: Failed to save scope:', error);
      }
    },

    // Reset scope to initial state
    resetScope: (state) => {
      state.scope = initialState.scope;
      try {
        localStorage.removeItem('mappa-scope');
        console.log('✅ QLTTScopeSlice: Scope reset and localStorage cleared');
      } catch (error) {
        console.error('❌ QLTTScopeSlice: Failed to clear localStorage:', error);
      }
    },

    // Set divisions
    setAvailableDivisions: (state, action: PayloadAction<ScopeDepartment[]>) => {
      state.availableDivisions = action.payload;
    },

    // Set teams
    setAvailableTeams: (state, action: PayloadAction<ScopeDepartment[]>) => {
      state.availableTeams = action.payload;
    },

    // Set areas
    setAvailableAreas: (state, action: PayloadAction<ScopeArea[]>) => {
      state.availableAreas = action.payload;
    },

    // Set locks
    setLocks: (state, action: PayloadAction<ScopeLocks>) => {
      state.locks = action.payload;
    },

    // Set canChangeScope
    setCanChangeScope: (state, action: PayloadAction<boolean>) => {
      state.canChangeScope = action.payload;
    },

    // Set loading state
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set initialized state
    setHasInitialized: (state, action: PayloadAction<boolean>) => {
      state.hasInitialized = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Load scope from localStorage
    loadScopeFromStorage: (state) => {
      try {
        const savedScopeStr = localStorage.getItem('mappa-scope');
        if (savedScopeStr) {
          const savedScope = JSON.parse(savedScopeStr) as QLTTScope;
          if (savedScope && typeof savedScope === 'object') {
            state.scope = savedScope;
            console.log('🔄 QLTTScopeSlice: Scope loaded from localStorage:', savedScope);
          }
        }
      } catch (error) {
        console.error('❌ QLTTScopeSlice: Failed to load scope from localStorage:', error);
        state.error = 'Failed to load scope from storage';
      }
    },
  },
});

export const {
  setScope,
  updateScope,
  resetScope,
  setAvailableDivisions,
  setAvailableTeams,
  setAvailableAreas,
  setLocks,
  setCanChangeScope,
  setIsLoading,
  setHasInitialized,
  setError,
  loadScopeFromStorage,
} = qlttScopeSlice.actions;

export default qlttScopeSlice.reducer;
