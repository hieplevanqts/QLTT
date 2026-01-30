import { OfficerDepartment } from '../../../../utils/api/officerFilterApi';

/**
 * Filter departments based on search query
 */
export function filterDepartmentsByQuery(
  departments: OfficerDepartment[],
  searchQuery: string
): OfficerDepartment[] {
  if (!searchQuery.trim()) return departments;
  const query = searchQuery.toLowerCase();
  return departments.filter(dept => 
    dept.name?.toLowerCase().includes(query)
  );
}

/**
 * Get target ID (teamId or divisionId) with priority
 */
export function getTargetDepartmentId(teamId?: string | null, divisionId?: string | null): string | null {
  return teamId || divisionId || null;
}

/**
 * Validate and sanitize department ID
 */
export function validateDepartmentId(id: string | null | undefined): string | null {
  if (!id) return null;
  if (typeof id !== 'string' || id.trim() === '') return null;
  return id;
}
