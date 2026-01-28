import type { ModuleManifest } from "../../_registry/types";
import { saIamRoutes } from "./routes";

export const saIamManifest: ModuleManifest = {
  key: "system-admin.iam",
  name: "Identity & Access Management",
  group: "IAM",
  order: 10,
  routes: [saIamRoutes],
};

