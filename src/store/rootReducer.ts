import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import qlttScopeReducer from './slices/qlttScopeSlice';
import mapFiltersReducer from './slices/mapFiltersSlice';
// import productReducer from './slices/productSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  qlttScope: qlttScopeReducer,
  mapFilters: mapFiltersReducer,
//   products: productReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;