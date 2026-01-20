import { call, put, takeLatest, select } from 'redux-saga/effects';
import { supabase } from '../../lib/supabase';
import {
  setAvailableDivisions,
  setAvailableTeams,
  setAvailableAreas,
  setIsLoading,
  setError,
  setHasInitialized,
  loadScopeFromStorage,
  setLocks,
  setCanChangeScope,
} from '../slices/qlttScopeSlice';
import type { RootState, AppDispatch } from '../store';
import type { ScopeDepartment, ScopeArea } from '../slices/qlttScopeSlice';

// Interfaces
interface WardRow {
  id: string;
  code: string;
  name: string;
  province_id: string;
}

interface ProvinceRow {
  id: string;
  code: string;
  name: string;
}

interface AreaRow {
  id: string;
  code: string;
  name: string;
  level: string;
  provinceId?: string | null;
  wardId?: string | null;
}

interface DepartmentAreaRow {
  department_id: string;
  area_id: string;
}

// Fetch scope data from Supabase
function* fetchScopeData(): Generator<any, any, any> {
  try {
    yield put(setIsLoading(true));

    const [
      { data: departmentsData, error: departmentsError },
      { data: departmentAreasData, error: departmentAreasError },
      { data: areasData, error: areasError },
      { data: wardsData, error: wardsError },
      { data: provincesData, error: provincesError },
    ] = yield call(() =>
      Promise.all([
        supabase
          .from('departments')
          .select('id, parent_id, name, code, level')
          .is('deleted_at', null)
          .order('path', { ascending: true }),
        supabase
          .from('department_areas')
          .select('department_id, area_id'),
        supabase
          .from('areas')
          .select('id, code, name, level, "provinceId", "wardId"'),
        supabase
          .from('wards')
          .select('id, code, name, province_id'),
        supabase
          .from('provinces')
          .select('id, code, name'),
      ])
    );

    if (departmentsError) {
      console.error('❌ QLTTScopeSaga: Failed to load departments:', departmentsError);
      yield put(setError('Failed to load departments'));
      return;
    }

    if (areasError) {
      console.error('❌ QLTTScopeSaga: Failed to load areas:', areasError);
      yield put(setError('Failed to load areas'));
      return;
    }

    // Build maps for lookups
    const wardsById = new Map((wardsData || []).map((w: WardRow) => [w.id, w]));
    const provincesById = new Map((provincesData || []).map((p: ProvinceRow) => [p.id, p]));
    const areasById = new Map((areasData || []).map((a: AreaRow) => [a.id, a]));

    // Filter departments by level
    const departments: ScopeDepartment[] = departmentsData || [];
    const divisions = departments.filter((dept) => dept.level === 2);
    const teams = departments.filter((dept) => dept.level === 3);

    yield put(setAvailableDivisions(divisions));
    yield put(setAvailableTeams(teams));

    // Process areas
    const departmentAreasByDepartment = new Map<string, string[]>();
    (departmentAreasData || []).forEach((item: DepartmentAreaRow) => {
      if (!departmentAreasByDepartment.has(item.department_id)) {
        departmentAreasByDepartment.set(item.department_id, []);
      }
      departmentAreasByDepartment.get(item.department_id)!.push(item.area_id);
    });

    // Store this for later use if needed
    console.log('✅ QLTTScopeSaga: Scope data loaded successfully');
    yield put(setIsLoading(false));
    yield put(setError(null));
  } catch (error: any) {
    console.error('❌ QLTTScopeSaga: Failed to fetch scope data:', error);
    yield put(setError(error.message || 'Failed to load scope data'));
    yield put(setIsLoading(false));
  }
}

// Initialize scope from localStorage on app start
function* initializeScopeFromStorage(): Generator<any, any, any> {
  try {
    yield put(loadScopeFromStorage());
    yield put(setHasInitialized(true));
  } catch (error: any) {
    console.error('❌ QLTTScopeSaga: Failed to initialize scope from storage:', error);
    yield put(setError('Failed to initialize scope'));
  }
}

// Watch saga
export function* watchQLTTScopeSaga() {
  yield takeLatest('qlttScope/FETCH_SCOPE_DATA', fetchScopeData);
}
