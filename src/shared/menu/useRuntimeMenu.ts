import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSelector } from "@/hooks/useAppStore";
import type { RootState } from "@/store/rootReducer";
import { buildMenuTree, type MenuNode } from "@/utils/menuRegistry";
import { menuService, type RuntimeMenuItem } from "./menuService";
import {
  buildCacheKey,
  getCachedMenu,
  setCachedMenu,
  clearMenuCacheForUser,
  MENU_UPDATED_EVENT,
  getMenuFallbackEnabled,
} from "./menuCache";
import { useIamIdentity } from "@/shared/iam/useIamIdentity";

type RuntimeMenuState = {
  loading: boolean;
  tree: MenuNode[];
  flatMenus: RuntimeMenuItem[];
  menuVersion: string | null;
  hasRoles: boolean;
  refresh: (opts?: { force?: boolean }) => Promise<void>;
};

const hashRoleCodes = (roleCodes: string[]) => roleCodes.filter(Boolean).sort().join("|");

export const useRuntimeMenu = (): RuntimeMenuState => {
  const { user: authUser } = useAuth();
  const reduxUser = useAppSelector((state: RootState) => state.auth.user);
  const { identity } = useIamIdentity();
  const user = reduxUser ?? authUser;
  const userId = identity?.userId ?? (user as any)?._id ?? (user as any)?.id ?? null;
  const [loading, setLoading] = React.useState(false);
  const [tree, setTree] = React.useState<MenuNode[]>([]);
  const [flatMenus, setFlatMenus] = React.useState<RuntimeMenuItem[]>([]);
  const [menuVersion, setMenuVersion] = React.useState<string | null>(null);
  const [hasRoles, setHasRoles] = React.useState(false);

  const permissionHash = React.useMemo(
    () =>
      identity?.permissionCodes
        ? [...identity.permissionCodes].sort().join("|")
        : user?.permissions
          ? [...user.permissions].sort().join("|")
          : "",
    [identity?.permissionCodes, user?.permissions],
  );

  const refresh = React.useCallback(
    async (opts?: { force?: boolean }) => {
      if (!userId) {
        setTree([]);
        setFlatMenus([]);
        setMenuVersion(null);
        setHasRoles(false);
        return;
      }

      setLoading(true);
      try {
        const roleCodes =
          identity?.roleCodes && identity.roleCodes.length > 0
            ? identity.roleCodes
            : user?.roleCodes && user.roleCodes.length > 0
              ? user.roleCodes
              : user?.roleCode
                ? [user.roleCode]
                : [];
        const roleHash = hashRoleCodes(roleCodes);
        const hasRole = roleCodes.length > 0;
        setHasRoles(hasRole);

        const latestVersion = await menuService.getMenuVersion();
        setMenuVersion(latestVersion);

        const cacheKey = buildCacheKey(userId, roleHash, latestVersion);
        const shouldUseCache = !opts?.force;
        if (shouldUseCache) {
          const cached = getCachedMenu<RuntimeMenuItem[]>(cacheKey);
          if (cached) {
            setFlatMenus(cached);
            setTree(buildMenuTree(cached));
            if (import.meta.env.DEV) {
              console.debug("[menu] userId", userId, "roles", roleCodes, "menuVersion", latestVersion, "fromCache", true);
            }
            return;
          }
        }

        const items = await menuService.getMyMenu();

        setFlatMenus(items);
        setTree(buildMenuTree(items));
        setCachedMenu(cacheKey, items);

        if (import.meta.env.DEV) {
          console.debug("[menu] userId", userId, "roles", roleCodes, "menuVersion", latestVersion, "fromCache", false);
        }
      } finally {
        setLoading(false);
      }
    },
    [identity?.roleCodes, userId, user?.roleCode, user?.roleCodes],
  );

  React.useEffect(() => {
    void refresh();
  }, [refresh, permissionHash]);

  React.useEffect(() => {
    const handleUpdated = () => {
      if (userId) {
        clearMenuCacheForUser(userId);
      }
      void refresh({ force: true });
    };
    window.addEventListener(MENU_UPDATED_EVENT, handleUpdated);
    return () => {
      window.removeEventListener(MENU_UPDATED_EVENT, handleUpdated);
    };
  }, [refresh, userId]);

  return {
    loading,
    tree,
    flatMenus,
    menuVersion,
    hasRoles,
    refresh,
  };
};
