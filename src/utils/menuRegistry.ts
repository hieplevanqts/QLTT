import { MenuItem } from "../modules/system-admin/types";

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
  if (!node.permissionsAny || node.permissionsAny.length === 0) return true;
  return node.permissionsAny.some((perm) => permissions.includes(perm));
};

const hasRole = (node: MenuItem, roleCode?: string) => {
  if (!node.rolesAny || node.rolesAny.length === 0) return true;
  if (!roleCode) return true;
  return node.rolesAny.includes(roleCode);
};

export const filterMenuTree = (nodes: MenuNode[], permissions: string[], roleCode?: string): MenuNode[] => {
  const filterNode = (node: MenuNode): MenuNode | null => {
    const allowed = node.isEnabled !== false && hasPermission(node, permissions) && hasRole(node, roleCode);
    const filteredChildren = node.children
      .map(filterNode)
      .filter((child): child is MenuNode => Boolean(child));

    if (allowed || filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }
    return null;
  };

  return nodes.map(filterNode).filter((node): node is MenuNode => Boolean(node));
};
