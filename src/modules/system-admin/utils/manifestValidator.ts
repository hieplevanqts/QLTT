/**
 * Module Manifest Validator
 * Utility functions để validate module.json files
 * Mock implementation - sẽ được thay thế bằng server-side validation thực
 */

import type { ModuleManifest } from '../mocks/moduleRegistry.mock';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

/**
 * Validate một module manifest
 */
export function validateManifest(manifest: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  const requiredFields = [
    'id',
    'name',
    'version',
    'basePath',
    'entry',
    'routes',
    'permissions',
    'ui',
    'routeExport',
    'release',
    'compat'
  ];

  for (const field of requiredFields) {
    if (!manifest[field]) {
      errors.push({
        field,
        message: `Required field '${field}' is missing`,
        code: 'REQUIRED_FIELD_MISSING'
      });
    }
  }

  // Validate ID format (kebab-case)
  if (manifest.id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(manifest.id)) {
    errors.push({
      field: 'id',
      message: 'Module ID must be in kebab-case format (e.g., "system-admin")',
      code: 'INVALID_ID_FORMAT'
    });
  }

  // Validate version format (semver)
  if (manifest.version && !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    errors.push({
      field: 'version',
      message: 'Version must follow semantic versioning (e.g., "0.2.0")',
      code: 'INVALID_VERSION_FORMAT'
    });
  }

  // Validate basePath format
  if (manifest.basePath && !manifest.basePath.startsWith('/')) {
    errors.push({
      field: 'basePath',
      message: 'Base path must start with "/"',
      code: 'INVALID_BASE_PATH'
    });
  }

  // Validate permissions format
  if (manifest.permissions && Array.isArray(manifest.permissions)) {
    manifest.permissions.forEach((perm: string, idx: number) => {
      if (!perm.includes(':')) {
        warnings.push({
          field: `permissions[${idx}]`,
          message: `Permission "${perm}" should follow format "resource:action"`,
          code: 'PERMISSION_FORMAT_WARNING'
        });
      }
    });
  }

  // Validate UI config
  if (manifest.ui) {
    if (!manifest.ui.menuLabel) {
      errors.push({
        field: 'ui.menuLabel',
        message: 'Menu label is required',
        code: 'REQUIRED_FIELD_MISSING'
      });
    }
    if (!manifest.ui.menuPath) {
      errors.push({
        field: 'ui.menuPath',
        message: 'Menu path is required',
        code: 'REQUIRED_FIELD_MISSING'
      });
    }
  }

  // Validate release type
  if (manifest.release && manifest.release.type) {
    const validTypes = ['major', 'minor', 'patch'];
    if (!validTypes.includes(manifest.release.type)) {
      errors.push({
        field: 'release.type',
        message: `Release type must be one of: ${validTypes.join(', ')}`,
        code: 'INVALID_RELEASE_TYPE'
      });
    }
  }

  // Validate compatibility
  if (manifest.compat) {
    if (
      manifest.compat.minAppVersion &&
      manifest.compat.maxAppVersion &&
      compareVersions(manifest.compat.minAppVersion, manifest.compat.maxAppVersion) > 0
    ) {
      errors.push({
        field: 'compat',
        message: 'minAppVersion cannot be greater than maxAppVersion',
        code: 'INVALID_COMPAT_RANGE'
      });
    }
  }

  // Warnings for breaking changes
  if (
    manifest.release &&
    manifest.release.type === 'major' &&
    (!manifest.release.breaking || manifest.release.breaking.length === 0)
  ) {
    warnings.push({
      field: 'release.breaking',
      message: 'Major release should document breaking changes',
      code: 'MISSING_BREAKING_CHANGES'
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate manifest có conflict với module khác không
 */
export function validateNoConflicts(
  manifest: ModuleManifest,
  existingModules: ModuleManifest[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check ID conflict
  const idConflict = existingModules.find(m => m.id === manifest.id);
  if (idConflict) {
    errors.push({
      field: 'id',
      message: `Module ID "${manifest.id}" already exists`,
      code: 'DUPLICATE_MODULE_ID'
    });
  }

  // Check basePath conflict
  const pathConflict = existingModules.find(m => m.basePath === manifest.basePath);
  if (pathConflict && pathConflict.id !== manifest.id) {
    errors.push({
      field: 'basePath',
      message: `Base path "${manifest.basePath}" is already used by module "${pathConflict.id}"`,
      code: 'DUPLICATE_BASE_PATH'
    });
  }

  // Check routeExport conflict
  const routeConflict = existingModules.find(m => m.routeExport === manifest.routeExport);
  if (routeConflict && routeConflict.id !== manifest.id) {
    warnings.push({
      field: 'routeExport',
      message: `Route export name "${manifest.routeExport}" is already used by module "${routeConflict.id}"`,
      code: 'DUPLICATE_ROUTE_EXPORT'
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate route export tồn tại trong routes file
 * (Mock - trong thực tế sẽ check file thực)
 */
export function validateRouteExport(manifest: ModuleManifest): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Mock validation - giả định routes file tồn tại
  // Trong thực tế sẽ parse file và check export

  if (!manifest.routeExport) {
    errors.push({
      field: 'routeExport',
      message: 'Route export name is required',
      code: 'REQUIRED_FIELD_MISSING'
    });
  }

  // Check naming convention
  if (manifest.routeExport && !manifest.routeExport.match(/^[a-z][a-zA-Z0-9]*Route[s]?$/)) {
    warnings.push({
      field: 'routeExport',
      message: 'Route export should follow naming convention: camelCase + "Route" or "Routes" suffix',
      code: 'ROUTE_EXPORT_NAMING'
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate full manifest với tất cả checks
 */
export function validateModuleFull(
  manifest: ModuleManifest,
  existingModules: ModuleManifest[]
): ValidationResult {
  const schemaResult = validateManifest(manifest);
  const conflictResult = validateNoConflicts(manifest, existingModules);
  const routeResult = validateRouteExport(manifest);

  return {
    valid: schemaResult.valid && conflictResult.valid && routeResult.valid,
    errors: [...schemaResult.errors, ...conflictResult.errors, ...routeResult.errors],
    warnings: [...schemaResult.warnings, ...conflictResult.warnings, ...routeResult.warnings]
  };
}

/**
 * Helper: Compare semver versions
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }

  return 0;
}

/**
 * Helper: Format validation result cho display
 */
export function formatValidationResult(result: ValidationResult): string {
  let output = '';

  if (result.valid) {
    output += '✅ Validation passed\n';
  } else {
    output += '❌ Validation failed\n';
  }

  if (result.errors.length > 0) {
    output += '\n❌ Errors:\n';
    result.errors.forEach(err => {
      output += `  - [${err.code}] ${err.field}: ${err.message}\n`;
    });
  }

  if (result.warnings.length > 0) {
    output += '\n⚠️ Warnings:\n';
    result.warnings.forEach(warn => {
      output += `  - [${warn.code}] ${warn.field}: ${warn.message}\n`;
    });
  }

  return output;
}
