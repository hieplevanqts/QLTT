import React from "react";
import type { IamIdentity } from "./iamIdentity.service";

const EMPTY_ARRAY: string[] = [];
const EMPTY_SET = new Set<string>();

export type IamIdentityState = {
  identity: IamIdentity | null;
  loading: boolean;
  error: string | null;
  refresh: (opts?: { force?: boolean }) => Promise<void>;
};

export type IamIdentityView = {
  userId: string | null;
  email: string | null;
  roleCodes: string[];
  permissionCodes: string[];
  permissionCodesSet: Set<string>;
  permissionMetaMap?: IamIdentity["permissionMetaMap"];
  hasPerm: (code: string) => boolean;
  primaryRoleCode: string | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  departmentId: string | null;
  departmentPath: string | null;
  departmentLevel: number | null;
  loading: boolean;
  error: string | null;
  refresh: (opts?: { force?: boolean }) => Promise<void>;
};

export const IamIdentityContext = React.createContext<
  IamIdentityState | undefined
>(undefined);

export const useIamIdentity = (): IamIdentityView => {
  const ctx = React.useContext(IamIdentityContext);
  const identity = ctx?.identity ?? null;
  if (!ctx && import.meta.env.DEV) {
    console.warn("[iam] useIamIdentity used outside provider");
  }

  const roleCodes = identity?.roleCodes ?? EMPTY_ARRAY;
  const primaryRoleCode =
    identity?.primaryRoleCode ?? (roleCodes[0] ?? null);
  const permissionCodes = identity?.permissionCodes ?? EMPTY_ARRAY;
  const permissionCodesSet = React.useMemo(() => {
    if (!permissionCodes || permissionCodes.length === 0) return EMPTY_SET;
    return new Set(permissionCodes.map((code) => String(code).toLowerCase()));
  }, [permissionCodes]);
  const hasPerm = React.useCallback(
    (code: string) => {
      if (identity?.isSuperAdmin) return true;
      if (!code) return false;
      return permissionCodesSet.has(String(code).toLowerCase());
    },
    [identity?.isSuperAdmin, permissionCodesSet],
  );

  return {
    userId: identity?.userId ?? null,
    email: identity?.email ?? null,
    roleCodes,
    permissionCodes,
    permissionCodesSet,
    permissionMetaMap: identity?.permissionMetaMap,
    hasPerm,
    primaryRoleCode,
    isSuperAdmin: identity?.isSuperAdmin ?? false,
    isAdmin: identity?.isAdmin ?? false,
    departmentId: identity?.departmentId ?? null,
    departmentPath: identity?.departmentPath ?? null,
    departmentLevel:
      identity?.departmentLevel != null ? identity.departmentLevel : null,
    loading: ctx?.loading ?? false,
    error: ctx?.error ?? null,
    refresh: ctx?.refresh ?? (async () => undefined),
  };
};
