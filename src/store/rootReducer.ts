import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import qlttScopeReducer from './slices/qlttScopeSlice';
// import productReducer from './slices/productSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  qlttScope: qlttScopeReducer,
//   products: productReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;