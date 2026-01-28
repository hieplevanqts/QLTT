import type { ModuleManifest } from "../../_registry/types";
import { saMasterDataRoutes } from "./routes";

export const saMasterDataManifest: ModuleManifest = {
  key: "system-admin.master-data",
  name: "System Admin Master Data",
  group: "SYSTEM",
  order: 20,
  routes: [saMasterDataRoutes],
};

