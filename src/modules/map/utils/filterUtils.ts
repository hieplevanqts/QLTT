import { Category } from '../../utils/api/categoriesApi';
import { Department } from '../../utils/api/departmentsApi';

type CategoryFilter = { [key: string]: boolean };
type BusinessTypeFilter = { [key: string]: boolean };
type DepartmentFilter = { [key: string]: boolean };

/**
 * Map point_status codes to merchant status codes
 */
export function mapStatusCodesToMerchantStatus(activeFilterCodes: string[]): string[] {
  return activeFilterCodes.map(code => {
    switch (code) {
      case 'certified': return 'active';
      case 'scheduled': return 'pending';
      case 'hotspot': return 'suspended';
      case 'inspected': return 'rejected';
      default: return code;
    }
  });
}

/**
 * Get business type names from category IDs
 */
export function getBusinessTypeNames(
  activeBusinessTypes: string[],
  categories: Category[]
): string[] {
  return activeBusinessTypes
    .map(categoryId => {
      const category = categories.find(c => c.id === categoryId);
      return category?.name;
    })
    .filter((name): name is string => name !== undefined);
}

/**
 * Calculate business types filter
 */
export function calculateBusinessTypes(
  activeBusinessTypes: string[],
  categories: Category[]
): string[] | undefined {
  const totalCategories = categories.length;
  const allCategoriesSelected = activeBusinessTypes.length === totalCategories && totalCategories > 0;
  
  if (allCategoriesSelected) {
    return undefined; // All selected = no filter
  }
  
  const businessTypeNames = getBusinessTypeNames(activeBusinessTypes, categories);
  return businessTypeNames.length > 0 ? businessTypeNames : undefined;
}

/**
 * Calculate department IDs to filter
 */
export function calculateDepartmentIdsToFilter(
  departmentFilters: DepartmentFilter,
  departments: Department[],
  teamId: string | null | undefined,
  divisionId: string | null | undefined
): string[] | undefined {
  const enabledDepartmentIds = Object.keys(departmentFilters).filter(id => departmentFilters[id] === true);
  const totalDepartmentFilters = Object.keys(departmentFilters).length;
  
  // Priority 1: UI checkbox filters
  if (totalDepartmentFilters > 0) {
    if (enabledDepartmentIds.length === totalDepartmentFilters) {
      // All departments selected
      return departments.map((d: Department) => d.id);
    } else if (enabledDepartmentIds.length > 0) {
      // Some departments selected
      return enabledDepartmentIds;
    } else {
      // No departments selected
      return [];
    }
  }
  
  // Priority 2: teamId/divisionId from header
  if (teamId) {
    return [teamId];
  } else if (divisionId) {
    const teamsUnderDivision = departments.filter(
      (d: Department) => d.parent_id === divisionId || d.id === divisionId
    );
    return teamsUnderDivision.map((d: Department) => d.id);
  }
  
  // No filters
  return undefined;
}

/**
 * Calculate business type filters array for category_merchants join
 */
export function calculateBusinessTypeFiltersArray(
  businessTypeFilters: BusinessTypeFilter,
  categories: Category[]
): string[] | null {
  const totalCategories = categories.length;
  // 🔥 FIX: Filter out undefined, null, empty string, and "undefined" string
  const activeBusinessTypes = Object.keys(businessTypeFilters)
    .filter(key => {
      const isActive = businessTypeFilters[key] === true;
      const isValidKey = key && key !== 'undefined' && key !== 'null' && key.trim() !== '';
      return isActive && isValidKey;
    });
  
  const allCategoriesSelected = activeBusinessTypes.length === totalCategories && totalCategories > 0;
  
  if (allCategoriesSelected) {
    return null; // All selected = no filter
  }
  
  // 🔥 FIX: Filter out invalid values and ensure all IDs are valid category IDs
  const validCategoryIds = activeBusinessTypes
    .filter(key => {
      // Check if key is a valid category ID
      const isValidId = key && key !== 'undefined' && key !== 'null' && key.trim() !== '';
      if (!isValidId) return false;
      
      // Optional: Verify key exists in categories array
      const categoryExists = categories.some(cat => cat.id === key || (cat as any)._id === key);
      return categoryExists;
    });
  
  return validCategoryIds.length > 0 ? validCategoryIds : null;
}

/**
 * Filter restaurants by search query
 */
export function filterRestaurantsBySearch(
  restaurants: any[],
  searchQuery: string
): any[] {
  if (!restaurants || restaurants.length === 0) {
    return [];
  }
  
  if (searchQuery.trim() === '') {
    return restaurants;
  }
  
  const searchLower = searchQuery.toLowerCase();
  return restaurants.filter((restaurant) => {
    const nameLower = restaurant.name.toLowerCase();
    const addressLower = restaurant.address.toLowerCase();
    const typeLower = restaurant.type.toLowerCase();
    
    return nameLower.includes(searchLower) ||
      addressLower.includes(searchLower) ||
      typeLower.includes(searchLower);
  });
}

