export type ImportStatus =
  | "pending"
  | "validating"
  | "importing"
  | "completed"
  | "failed"
  | "rolled_back";

export type ReleaseType = "patch" | "minor" | "major";

export type ValidationResultType = "success" | "warning" | "error";

export type ValidationResult = {
  type: ValidationResultType;
  message: string;
  details?: string;
};

export type ImportJobTimelineEntry = {
  timestamp: string;
  status: ImportStatus;
  message: string;
  details?: string;
};

export type ImportJob = {
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
  operation?: "import" | "update" | "rollback";
  updateType?: ReleaseType;
  detectedType?: ReleaseType;
  releaseType?: ReleaseType;
  fileName?: string;
  fileSize?: number;
  storedZipPath?: string;
  storedZipName?: string;
  storedZipSize?: number;
  validationResults?: ValidationResult[];
  errorMessage?: string;
  timeline?: ImportJobTimelineEntry[];
  backupPath?: string;
  updatedAt?: string;
};

export type ModuleReleaseInfo = {
  type: ReleaseType;
  notes?: string;
  breaking?: string[];
};

export type ModuleInfo = {
  id: string;
  name?: string;
  version: string;
  basePath: string;
  entry: string;
  routes: string;
  routeExport?: string;
  permissions?: string[];
  ui?: { menuLabel?: string; menuPath?: string; menus?: MenuItem[] };
  release?: ModuleReleaseInfo;
  installedAt?: string;
  installedBy?: string;
  status?: "active" | "inactive";
  updatedAt?: string;
  updatedBy?: string;
  updatedByName?: string;
  lastUpdateType?: ReleaseType;
  lastDetectedType?: ReleaseType;
};

export type ModuleDetail = ModuleInfo & {
  files?: string[];
};

export type ModuleManifestOverrides = {
  name?: string;
  version?: string;
  basePath?: string;
  entry?: string;
  routes?: string;
  routeExport?: string;
  permissions?: string[];
  ui?: { menuLabel?: string; menuPath?: string };
};

export type ModuleUpdateAnalysis = {
  manifest: ModuleInfo;
  detectedType: ReleaseType;
  releaseType?: ReleaseType;
  newMenus: MenuItem[];
  menuConflicts?: string[];
  validationResults?: ValidationResult[];
};

export type MenuItem = {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  order?: number;
  parentId?: string | null;
  permissionsAny?: string[];
  rolesAny?: string[];
  moduleId?: string;
  isEnabled?: boolean;
};
