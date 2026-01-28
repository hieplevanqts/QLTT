import type { ModuleManifest } from "../_registry/types";
import { systemAdminDashboardRoute } from "./routes";

export const systemAdminDashboardManifest: ModuleManifest = {
  key: "system-admin.dashboard",
  name: "System Admin Dashboard",
  group: "SYSTEM",
  order: 0,
  routes: [systemAdminDashboardRoute],
};

