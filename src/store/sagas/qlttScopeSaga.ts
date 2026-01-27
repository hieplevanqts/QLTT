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
  _id: string;
  code: string;
  name: string;
  province_id: string;
}

interface ProvinceRow {
  _id: string;
  code: string;
  name: string;
}

interface AreaRow {
  _id: string;
  code: string;
  name: string;
  level: string;
  province_id?: string | null;
  ward_id?: string | null;
}

interface DepartmentRow {
  _id: string;
  parent_id: string | null;
  name: string;
  code: string;
  level: number;
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
          .select('_id, parent_id, name, code, level')
          .is('deleted_at', null)
          .order('path', { ascending: true }),
        supabase
          .from('department_areas')
          .select('department_id, area_id'),
        supabase
          .from('areas')
          .select('_id, code, name, level, province_id, ward_id'),
        supabase
          .from('wards')
          .select('_id, code, name, province_id'),
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
    const wardsById = new Map((wardsData || []).map((w: WardRow) => [w._id, w]));
    const provincesById = new Map((provincesData || []).map((p: ProvinceRow) => [p._id, p]));
    const areasById = new Map((areasData || []).map((a: AreaRow) => [a._id, a]));

    // Map departments with _id -> id conversion
    const departments: ScopeDepartment[] = (departmentsData || []).map((dept: DepartmentRow) => ({
      id: dept._id,
      parent_id: dept.parent_id,
      name: dept.name,
      code: dept.code,
      level: dept.level,
    }));

    const divisions = departments.filter((dept) => dept.level === 2);
    const teams = departments.filter((dept) => dept.level === 3);

    yield put(setAvailableDivisions(divisions));
    yield put(setAvailableTeams(teams));

    // Map areas with _id -> id conversion and resolved codes
    const areas: ScopeArea[] = (areasData || []).map((area: AreaRow) => {
      const provinceCode = area.province_id ? provincesById.get(area.province_id)?.code : null;
      const wardCode = area.ward_id ? wardsById.get(area.ward_id)?.code : null;
      return {
        id: area._id,
        name: area.name,
        code: area.code,
        provinceCode: provinceCode || null,
        wardCode: wardCode || null,
      };
    });

    yield put(setAvailableAreas(areas));

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
