import type { RouteObject } from "react-router-dom";

export type ModuleGroup = "IAM" | "DMS" | "OPS" | "SYSTEM";

export type MenuItemDef = {
  key: string;
  label: string;
  to?: string;
  icon?: string;
  order?: number;
  children?: MenuItemDef[];
};

export type ModuleManifest = {
  key: string;
  name: string;
  group: ModuleGroup;
  order?: number;
  icon?: string;
  routes: RouteObject[];
  menu?: MenuItemDef[];
};

