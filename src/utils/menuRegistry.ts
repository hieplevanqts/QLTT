import type { MenuItem } from "../modules/system-admin/types";

export type MenuNode = MenuItem & { children: MenuNode[] };

export const buildMenuTree = (items: MenuItem[]): MenuNode[] => {
  const map = new Map<string, MenuNode>();
  const roots: MenuNode[] = [];

  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortTree = (nodes: MenuNode[]) => {
    nodes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    nodes.forEach((child) => sortTree(child.children));
  };

  sortTree(roots);
  return roots;
};

const hasPermission = (node: MenuItem, permissions: string[]) => {
  // If no permissions required, always allow
  if (!node.permissionsAny || node.permissionsAny.length === 0) {
    return true;
  }
  // Allow fallback show-all only in DEV with explicit flag.
  if (permissions.length === 0) {
    const fallbackEnabled =
      import.meta.env.DEV && import.meta.env.VITE_ENABLE_MENU_FALLBACK === "true";
    if (fallbackEnabled) {
      console.warn('⚠️ User has no permissions - showing all menu items (fallback mode)');
      return true;
    }
    return false;
  }
  return node.permissionsAny.some((perm) => permissions.includes(perm));
};

const hasRole = (node: MenuItem, roleCode?: string) => {
  if (!node.rolesAny || node.rolesAny.length === 0) return true;
  if (!roleCode) return true;
  return node.rolesAny.includes(roleCode);
};

export const filterMenuTree = (nodes: MenuNode[], permissions: string[], roleCode?: string): MenuNode[] => {
  // 🔥 Helper: Check if node is "Quản trị" menu
  const isAdminMenu = (node: MenuNode): boolean => {
    return node.path === '/admin' || 
           node.label === 'Quản trị' || 
           node.label?.toLowerCase().includes('quản trị');
  };
  
  const filterNode = (node: MenuNode, isChildOfAdmin: boolean = false): MenuNode | null => {
    if (node.isEnabled === false) {
      return null;
    }
    // 🔥 FIX: Skip permission check for children of "Quản trị" menu
    const isAdminChild = isChildOfAdmin || isAdminMenu(node);
    const skipPermissionCheck = isChildOfAdmin; // Children of admin menu don't need permission check
    
    const permissionCheck = skipPermissionCheck ? true : hasPermission(node, permissions);
    const roleCheck = hasRole(node, roleCode);
    const enabledCheck = node.isEnabled !== false;
    const allowed = enabledCheck && permissionCheck && roleCheck;
    
    // 🔥 DEBUG: Log filtering decision for each node
    if (node.path && !allowed && !skipPermissionCheck) {
      console.log('🚫 Menu item filtered out:', {
        path: node.path,
        label: node.label,
        isEnabled: node.isEnabled,
        permissionCheck,
        roleCheck,
        permissionsRequired: node.permissionsAny,
        userPermissions: permissions,
        rolesRequired: node.rolesAny,
        userRoleCode: roleCode,
        isAdminChild,
        skipPermissionCheck,
      });
    }
    
    const filteredChildren = node.children
      .map((child) => filterNode(child, isAdminChild)) // Pass isAdminChild flag to children
      .filter((child): child is MenuNode => Boolean(child));

    // Show node if it's allowed OR if it has allowed children
    if (allowed || filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }
    return null;
  };

  return nodes.map((node) => filterNode(node, false)).filter((node): node is MenuNode => Boolean(node));
};
