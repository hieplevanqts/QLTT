/**
 * Department Tree Select - MAPPA Portal
 * Hierarchical tree view for department selection
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Building2 } from 'lucide-react';
import styles from './DepartmentTreeSelect.module.css';

interface Department {
  id: string;
  parent_id: string | null;
  name: string;
  code: string;
  level: number;
  path: string | null;
}

interface DepartmentTreeNode extends Department {
  children: DepartmentTreeNode[];
}

interface DepartmentTreeSelectProps {
  departments: Department[];
  value: string; // "all" or department.id
  onChange: (value: string) => void;
  userCounts?: Map<string, number>; // department.id -> user count
  totalUsers?: number;
  disabled?: boolean;
}

export const DepartmentTreeSelect: React.FC<DepartmentTreeSelectProps> = ({
  departments,
  value,
  onChange,
  userCounts = new Map(),
  totalUsers = 0,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Build tree structure
  const buildTree = (): DepartmentTreeNode[] => {
    const map = new Map<string, DepartmentTreeNode>();
    const roots: DepartmentTreeNode[] = [];

    // Initialize all nodes
    departments.forEach((dept) => {
      map.set(dept.id, { ...dept, children: [] });
    });

    // Build parent-child relationships
    departments.forEach((dept) => {
      const node = map.get(dept.id)!;
      if (dept.parent_id) {
        const parent = map.get(dept.parent_id);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node); // Parent không tồn tại → thêm vào root
        }
      } else {
        roots.push(node);
      }
    });

    // Sort children by name
    const sortChildren = (node: DepartmentTreeNode) => {
      node.children.sort((a, b) => a.name.localeCompare(b.name));
      node.children.forEach(sortChildren);
    };
    roots.forEach(sortChildren);

    return roots;
  };

  const tree = buildTree();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Toggle node expand/collapse
  const toggleNode = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Select node
  const selectNode = (nodeId: string) => {
    onChange(nodeId);
    setIsOpen(false);
  };

  // Get selected department name
  const getSelectedName = (): string => {
    if (value === 'all') {
      return `Tất cả phòng ban (${totalUsers})`;
    }
    const dept = departments.find((d) => d.id === value);
    if (dept) {
      const count = userCounts.get(dept.id) || 0;
      return `${dept.name} (${count})`;
    }
    return 'Chọn phòng ban';
  };

  // Render tree node
  const renderNode = (node: DepartmentTreeNode, level: number = 0) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = value === node.id;
    const userCount = userCounts.get(node.id) || 0;

    return (
      <div key={node.id}>
        <div
          className={`${styles.treeNode} ${isSelected ? styles.selected : ''}`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          {/* Collapse/Expand button */}
          {hasChildren ? (
            <button
              type="button"
              className={styles.expandButton}
              onClick={(e) => toggleNode(node.id, e)}
              aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          ) : (
            <span className={styles.expandPlaceholder}></span>
          )}

          {/* Node content */}
          <div className={styles.nodeContent} onClick={() => selectNode(node.id)}>
            <span className={styles.nodeDot}>●</span>
            <span className={styles.nodeName}>{node.name}</span>
            <span className={styles.nodeCount}>({userCount})</span>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className={styles.nodeChildren}>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.open : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Building2 size={16} className={styles.triggerIcon} />
        <span className={styles.triggerText}>{getSelectedName()}</span>
        <ChevronDown size={16} className={styles.triggerArrow} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={styles.dropdown}>
          {/* "Tất cả" option */}
          <div
            className={`${styles.treeNode} ${value === 'all' ? styles.selected : ''}`}
            style={{ paddingLeft: '12px' }}
            onClick={() => selectNode('all')}
          >
            <span className={styles.expandPlaceholder}></span>
            <div className={styles.nodeContent}>
              <span className={styles.nodeDot}>●</span>
              <span className={styles.nodeName}>Tất cả phòng ban</span>
              <span className={styles.nodeCount}>({totalUsers})</span>
            </div>
          </div>

          {/* Tree */}
          {tree.map((node) => renderNode(node, 0))}
        </div>
      )}
    </div>
  );
};

export default DepartmentTreeSelect;
