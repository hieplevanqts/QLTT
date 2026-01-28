import type { MenuRecord, MenuStatusValue, MenuTreeNode } from "./menu.types";

const ACTIVE_STATUS = new Set(["ACTIVE", "active", "1", "true"]);

export const isMenuActive = (status: MenuStatusValue) => {
  if (status === null || status === undefined) return true;
  if (typeof status === "boolean") return status;
  return ACTIVE_STATUS.has(String(status));
};

export const sortMenuNodes = <T extends { sort_order?: number | null; label?: string | null }>(
  left: T,
  right: T,
) => {
  const order = (left.sort_order ?? 0) - (right.sort_order ?? 0);
  if (order !== 0) return order;
  return (left.label ?? "").localeCompare(right.label ?? "");
};

export const buildMenuTree = (items: MenuRecord[]): MenuTreeNode[] => {
  const map = new Map<string, MenuTreeNode>();
  const roots: MenuTreeNode[] = [];

  items.forEach((item) => {
    map.set(item._id, { ...item, children: [] });
  });

  map.forEach((node) => {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortTree = (nodes: MenuTreeNode[]) => {
    nodes.sort(sortMenuNodes);
    nodes.forEach((child) => sortTree(child.children));
  };

  sortTree(roots);
  return roots;
};

export const flattenMenuTree = (nodes: MenuTreeNode[]): MenuRecord[] => {
  const results: MenuRecord[] = [];
  const visit = (node: MenuTreeNode) => {
    const { children, ...rest } = node;
    results.push(rest);
    children.forEach(visit);
  };
  nodes.forEach(visit);
  return results;
};

const hasAnyPermission = (node: MenuRecord, permissionCodes: Set<string>) => {
  if (!node.permission_codes || node.permission_codes.length === 0) return true;
  return node.permission_codes.some((code) => permissionCodes.has(code));
};

export const filterMenuTreeByPermissions = (
  nodes: MenuTreeNode[],
  permissionCodes: Set<string>,
): MenuTreeNode[] => {
  const filterNode = (node: MenuTreeNode): MenuTreeNode | null => {
    const allowedSelf = isMenuActive(node.status) && node.is_visible && hasAnyPermission(node, permissionCodes);
    const filteredChildren = node.children
      .map(filterNode)
      .filter((child): child is MenuTreeNode => Boolean(child));

    if (allowedSelf || filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }
    return null;
  };

  return nodes.map(filterNode).filter((node): node is MenuTreeNode => Boolean(node));
};

export const toPermissionCodeSet = (codes: string[] | null | undefined) =>
  new Set((codes ?? []).filter(Boolean));
