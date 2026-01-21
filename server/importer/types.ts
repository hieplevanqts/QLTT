export type ImportStatus =
  | 'pending'
  | 'validating'
  | 'importing'
  | 'completed'
  | 'failed'
  | 'rolled_back';

export type ValidationResultType = 'success' | 'warning' | 'error';

export interface ValidationResult {
  type: ValidationResultType;
  message: string;
  details?: string;
}

export interface ImportJobTimelineEntry {
  timestamp: string;
  status: ImportStatus;
  message: string;
}

export interface ImportJob {
  id: string;
  moduleId?: string;
  moduleName?: string;
  version?: string;
  status: ImportStatus;
  createdAt: string;
  createdBy?: string;
  fileName: string;
  fileSize: number;
  validationResults?: ValidationResult[];
  errorMessage?: string;
  timeline: ImportJobTimelineEntry[];
  backupPath?: string;
}

export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  basePath: string;
  entry: string;
  routes: string;
  permissions: string[];
  ui: {
    menuLabel: string;
    menuPath: string;
  };
  routeExport?: string;
}

export interface ModuleRegistryEntry extends ModuleManifest {
  installedAt: string;
  installedBy?: string;
  status?: 'active' | 'inactive';
}

export interface MenuItem {
  id: string;
  label: string;
  path?: string | null;
  icon?: string | null;
  order?: number;
  parentId?: string | null;
  permissionsAny?: string[];
  rolesAny?: string[];
  moduleId?: string | null;
  isEnabled?: boolean;
}

export interface ValidationContext {
  existingModules: ModuleRegistryEntry[];
  maxZipBytes: number;
  maxFileCount: number;
  allowExtensions: string[];
  bannedPaths: string[];
  originalFileName?: string;
  manifestOverrides?: Partial<ModuleManifest>;
}
