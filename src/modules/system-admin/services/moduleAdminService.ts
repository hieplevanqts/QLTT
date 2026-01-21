import type { ImportJob, MenuItem, ModuleDetail, ModuleInfo, ModuleManifestOverrides } from "../types";

const API_BASE = import.meta.env.VITE_SYSTEM_ADMIN_API ?? "http://localhost:8889";

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload?.message || `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return (await response.json()) as T;
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
  rollbackModule: (id: string) => request<ImportJob>(`/system-admin/modules/${id}/rollback`, { method: "POST" }),
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
};
