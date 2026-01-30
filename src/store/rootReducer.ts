import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import qlttScopeReducer from './slices/qlttScopeSlice';
import mapFiltersReducer from './slices/mapFiltersSlice';
import officerFilterReducer from './slices/officerFilterSlice';
import departmentAreasReducer from './slices/departmentAreasSlice';
import merchantReducer from './slices/merchantSlice';
import reviewReducer from './slices/reviewSlice';
// import productReducer from './slices/productSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  qlttScope: qlttScopeReducer,
  mapFilters: mapFiltersReducer,
  officerFilter: officerFilterReducer,
  departmentAreas: departmentAreasReducer,
  merchant: merchantReducer,
  reviews: reviewReducer,
//   products: productReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;