import type { RouteObject } from "react-router-dom";

import type { ModuleManifest, ModuleGroup } from "./types";
import { systemAdminDashboardManifest } from "../system-admin/manifest";
import { saIamManifest } from "../system-admin/sa-iam/manifest";
import { saMasterDataManifest } from "../system-admin/sa-master-data/manifest";
import { saSystemConfigManifest } from "../system-admin/sa-system-config/manifest";
import { installedRoutes } from "@/imports/installedModules";

const guessGroupFromPath = (path?: string | null): ModuleGroup => {
  if (!path) return "OPS";
  if (path.startsWith("system")) return "SYSTEM";
  if (path.startsWith("iam")) return "IAM";
  if (path.startsWith("dms")) return "DMS";
  return "OPS";
};

const installedManifests: ModuleManifest[] = installedRoutes.map((route, index) => {
  const path = route.path ?? `installed-${index}`;
  return {
    key: `installed:${path}`,
    name: `Installed: ${path}`,
    group: guessGroupFromPath(route.path),
    order: 1000 + index,
    routes: [route as RouteObject],
  };
});

export const modules: ModuleManifest[] = [
  systemAdminDashboardManifest,
  saIamManifest,
  saMasterDataManifest,
  saSystemConfigManifest,
  ...installedManifests,
];

export const moduleRoutes: RouteObject[] = modules.flatMap((mod) => mod.routes);
