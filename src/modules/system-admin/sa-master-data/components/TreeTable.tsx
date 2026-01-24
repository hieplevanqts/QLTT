/**
 * TreeTable Component
 * Displays hierarchical data in a tree structure with expand/collapse functionality
 */

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { CatalogItem } from '../types';
import styles from './TreeTable.module.css';

interface TreeNode extends CatalogItem {
  children?: TreeNode[];
  level?: number;
}

interface TreeTableProps {
  items: CatalogItem[];
  onEdit?: (item: CatalogItem) => void;
  onDelete?: (item: CatalogItem) => void;
  onToggleStatus?: (item: CatalogItem) => void;
  isLocked?: boolean;
}

export const TreeTable: React.FC<TreeTableProps> = ({
  items,
  onEdit,
  onDelete,
  onToggleStatus,
  isLocked = false
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Build tree structure
  const treeData = useMemo(() => {
    const itemMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // First pass: create all nodes
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [], level: 0 });
    });

    // Second pass: build tree structure
    items.forEach(item => {
      const node = itemMap.get(item.id)!;
      
      if (item.parentId) {
        const parent = itemMap.get(item.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
          node.level = (parent.level || 0) + 1;
        } else {
          // Parent not found, treat as root
          rootNodes.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    });

    // Sort children by order
    const sortChildren = (node: TreeNode) => {
      if (node.children && node.children.length > 0) {
        node.children.sort((a, b) => a.order - b.order);
        node.children.forEach(sortChildren);
      }
    };

    rootNodes.sort((a, b) => a.order - b.order);
    rootNodes.forEach(sortChildren);

    return rootNodes;
  }, [items]);

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          allIds.add(node.id);
          collectIds(node.children);
        }
      });
    };
    collectIds(treeData);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const renderNode = (node: TreeNode): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const indent = (node.level || 0) * 24;

    return (
      <React.Fragment key={node.id}>
        <tr className={styles.row}>
          <td className={styles.cell} style={{ paddingLeft: `${12 + indent}px` }}>
            <div className={styles.nameCell}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleExpand(node.id)}
                  className={styles.expandButton}
                  aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
                >
                  {isExpanded ? (
                    <ChevronDown className={styles.expandIcon} />
                  ) : (
                    <ChevronRight className={styles.expandIcon} />
                  )}
                </button>
              ) : (
                <span className={styles.expandPlaceholder} />
              )}
              <span className={styles.itemName}>{node.name}</span>
            </div>
          </td>
          <td className={styles.cell}>
            <code className={styles.code}>{node.code}</code>
          </td>
          <td className={styles.cell}>
            {node.value && <span className={styles.value}>{node.value}</span>}
          </td>
          <td className={styles.cell}>
            <span className={styles.order}>{node.order}</span>
          </td>
          <td className={styles.cell}>
            <button
              type="button"
              onClick={() => onToggleStatus?.(node)}
              className={`${styles.statusBadge} ${
                node.status === 'active' ? styles.statusActive : styles.statusInactive
              }`}
              disabled={isLocked}
            >
              {node.status === 'active' ? 'Hoạt động' : 'Ngừng'}
            </button>
          </td>
          <td className={styles.cell}>
            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => onEdit?.(node)}
                className={styles.actionButton}
                disabled={isLocked}
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(node)}
                className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                disabled={isLocked}
              >
                Xóa
              </button>
            </div>
          </td>
        </tr>
        {isExpanded && hasChildren && node.children!.map(child => renderNode(child))}
      </React.Fragment>
    );
  };

  if (treeData.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Không có dữ liệu</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button
          type="button"
          onClick={expandAll}
          className={styles.toolbarButton}
        >
          Mở rộng tất cả
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className={styles.toolbarButton}
        >
          Thu gọn tất cả
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Tên</th>
              <th className={styles.th}>Mã</th>
              <th className={styles.th}>Giá trị</th>
              <th className={styles.th}>Thứ tự</th>
              <th className={styles.th}>Trạng thái</th>
              <th className={styles.th}>Thao tác</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {treeData.map(node => renderNode(node))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
