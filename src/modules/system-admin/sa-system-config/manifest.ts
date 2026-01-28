import type { ModuleManifest } from "../../_registry/types";
import { saSystemConfigRoutes } from "./routes";

export const saSystemConfigManifest: ModuleManifest = {
  key: "system-admin.system-config",
  name: "System Admin Configuration",
  group: "SYSTEM",
  order: 30,
  routes: [saSystemConfigRoutes],
};

