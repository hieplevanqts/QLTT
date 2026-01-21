export type ImportStatus =
  | "pending"
  | "validating"
  | "importing"
  | "completed"
  | "failed"
  | "rolled_back";

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
  status: ImportStatus;
  createdAt: string;
  createdBy?: string;
  fileName?: string;
  fileSize?: number;
  validationResults?: ValidationResult[];
  errorMessage?: string;
  timeline?: ImportJobTimelineEntry[];
  backupPath?: string;
  updatedAt?: string;
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
  ui?: { menuLabel?: string; menuPath?: string };
  installedAt?: string;
  installedBy?: string;
  status?: "active" | "inactive";
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
