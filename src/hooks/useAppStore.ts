import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';

// Dùng cái này thay cho useDispatch và useSelector mặc định
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks cho QLTT Scope
export const useQLTTScope = () => useAppSelector((state) => state.qlttScope);
export const useQLTTScopeDivisions = () => useAppSelector((state) => state.qlttScope.availableDivisions);
export const useQLTTScopeTeams = () => useAppSelector((state) => state.qlttScope.availableTeams);
export const useQLTTScopeAreas = () => useAppSelector((state) => state.qlttScope.availableAreas);
