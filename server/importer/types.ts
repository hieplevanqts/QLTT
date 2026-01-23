export type ImportStatus =
  | 'pending'
  | 'validating'
  | 'importing'
  | 'completed'
  | 'failed'
  | 'rolled_back';

export type ReleaseType = 'patch' | 'minor' | 'major';

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
  previousVersion?: string;
  backupVersion?: string;
  status: ImportStatus;
  createdAt: string;
  createdBy?: string;
  updatedBy?: string;
  updatedByName?: string;
  operation?: 'import' | 'update' | 'rollback';
  updateType?: ReleaseType;
  detectedType?: ReleaseType;
  releaseType?: ReleaseType;
  fileName: string;
  fileSize: number;
  storedZipPath?: string;
  storedZipName?: string;
  storedZipSize?: number;
  validationResults?: ValidationResult[];
  errorMessage?: string;
  timeline: ImportJobTimelineEntry[];
  backupPath?: string;
}

export interface ReleaseInfo {
  type: ReleaseType;
  notes?: string;
  breaking?: string[];
}

export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  basePath: string;
  entry: string;
  routes: string;
  permissions: string[];
  dependencies?: string[] | Record<string, string>;
  package?: {
    dependencies?: Record<string, string>;
  };
  ui: {
    menuLabel: string;
    menuPath: string;
    menus?: MenuItem[];
  };
  routeExport?: string;
  release?: ReleaseInfo;
}

export interface ModuleRegistryEntry extends ModuleManifest {
  installedAt: string;
  installedBy?: string;
  status?: 'active' | 'inactive';
  updatedAt?: string;
  updatedBy?: string;
  updatedByName?: string;
  lastUpdateType?: ReleaseType;
  lastDetectedType?: ReleaseType;
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
  requireReleaseType?: boolean;
  requireNewerVersion?: boolean;
}
