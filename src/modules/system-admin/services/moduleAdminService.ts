import type {
  ImportJob,
  MenuItem,
  ModuleDetail,
  ModuleInfo,
  ModuleManifestOverrides,
  ModuleUpdateAnalysis,
  ReleaseType,
} from "../types";

const API_BASE =
  import.meta.env.VITE_SYSTEM_ADMIN_API ??
  import.meta.env.VITE_PUBLIC_URL ??
  "http://localhost:7788";
const REQUEST_TIMEOUT_MS = 12000;

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const url = `${API_BASE}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const message =
        payload?.message ||
        payload?.error ||
        `Request failed: ${response.status}`;
      console.error("[modules] request failed", {
        url,
        status: response.status,
        payload,
      });
      throw new Error(message);
    }
    return (await response.json()) as T;
  } catch (error: any) {
    const isAbort = error?.name === "AbortError";
    const message = isAbort
      ? `Timeout sau ${REQUEST_TIMEOUT_MS / 1000}s khi gọi ${url}`
      : error?.message || "Không thể kết nối đến server quản trị module.";
    console.error("[modules] request error", { url, error });
    throw new Error(message);
  } finally {
    clearTimeout(timeoutId);
  }
};

export const moduleAdminService = {
  getModules: () => request<ModuleInfo[]>("/system-admin/modules"),
  getModule: (id: string) => request<ModuleDetail>(`/system-admin/modules/${id}`),
  importModule: async (file: File, overrides?: ModuleManifestOverrides) => {
    const data = new FormData();
    data.append("file", file);
    if (overrides && Object.keys(overrides).length > 0) {
      data.append("manifestOverrides", JSON.stringify(overrides));
    }
    return request<ImportJob>("/system-admin/modules/import", { method: "POST", body: data });
  },
  getImportJobs: () => request<ImportJob[]>("/system-admin/modules/import-jobs"),
  getImportJob: (jobId: string) => request<ImportJob>(`/system-admin/modules/import-jobs/${jobId}`),
  rollbackModule: async (id: string, payload?: {
    jobId?: string;
    file?: File;
    requestedBy?: string;
    requestedByName?: string;
  }) => {
    if (payload?.file) {
      const data = new FormData();
      data.append("file", payload.file);
      if (payload.requestedBy) data.append("requestedBy", payload.requestedBy);
      if (payload.requestedByName) data.append("requestedByName", payload.requestedByName);
      return request<ImportJob>(`/system-admin/modules/${id}/rollback/upload`, { method: "POST", body: data });
    }

    const body = payload && (payload.jobId || payload.requestedBy || payload.requestedByName)
      ? JSON.stringify({
          jobId: payload.jobId,
          requestedBy: payload.requestedBy,
          requestedByName: payload.requestedByName,
        })
      : undefined;
    return request<ImportJob>(`/system-admin/modules/${id}/rollback`, {
      method: "POST",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body,
    });
  },
  inspectUpdate: async (id: string, file: File) => {
    const data = new FormData();
    data.append("file", file);
    return request<ModuleUpdateAnalysis>(`/system-admin/modules/${id}/update/inspect`, {
      method: "POST",
      body: data,
    });
  },
  updateModule: async (id: string, payload: {
    file: File;
    updateType: ReleaseType;
    selectedMenuIds?: string[];
    updatedBy?: string;
    updatedByName?: string;
  }) => {
    const data = new FormData();
    data.append("file", payload.file);
    data.append("updateType", payload.updateType);
    if (payload.selectedMenuIds) {
      data.append("selectedMenuIds", JSON.stringify(payload.selectedMenuIds));
    }
    if (payload.updatedBy) {
      data.append("updatedBy", payload.updatedBy);
    }
    if (payload.updatedByName) {
      data.append("updatedByName", payload.updatedByName);
    }
    return request<ImportJob>(`/system-admin/modules/${id}/update`, { method: "POST", body: data });
  },
  getMenus: () => request<MenuItem[]>("/system-admin/menus"),
  createMenu: (payload: MenuItem) =>
    request<MenuItem>("/system-admin/menus", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
  updateMenu: (id: string, payload: Partial<MenuItem>) =>
    request<MenuItem>(`/system-admin/menus/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  deleteMenu: (id: string) => request<{ ok: boolean }>(`/system-admin/menus/${id}`, { method: "DELETE" }),
  deleteJobZip: (jobId: string) =>
    request<ImportJob>(`/system-admin/modules/import-jobs/${jobId}/zip`, { method: "DELETE" }),
};
