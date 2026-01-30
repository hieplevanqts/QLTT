/**
 * Departments Tab - MAPPA Portal
 * Quản lý cây phòng ban với materialized path
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 * Updated theo Figma design
 */

import React, { useState, useEffect } from 'react';
import {
  Building2,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  FileDown,
  Network,
  Loader2,
  AlertCircle,
  Copy,
  BarChart3,
  Minus,
} from 'lucide-react';
import styles from './CategoriesTab.module.css'; // Using shared styles
import treeStyles from './DepartmentsTab.module.css';
import { toast } from 'sonner';
import { supabase } from '@/api/supabaseClient';
import * as XLSX from 'xlsx';
import { DatabaseErrorAlert } from '../components/DatabaseErrorAlert';
import { DepartmentModal } from './DepartmentModal';

interface Department {
  id: string;
  parent_id: string | null;
  name: string;
  code: string | null;
  level: number;
  path: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  children?: Department[];
  isExpanded?: boolean;
}

// Helper function to get level name
const getLevelName = (level: number): string => {
  const levelNames: { [key: number]: string } = {
    1: 'Cục',
    2: 'Chi cục',
    3: 'Đội',
  };
  return levelNames[level] || `Cấp ${level}`;
};

export const DepartmentsTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [treeData, setTreeData] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [databaseError, setDatabaseError] = useState<any>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view' | 'add-child'>('add');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(undefined);
  const [parentDepartment, setParentDepartment] = useState<Department | undefined>(undefined);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setDatabaseError(null);

      const { data, error } = await supabase
        .from('departments')
        .select('*, id:_id')
        .is('deleted_at', null)
        .order('path', { ascending: true });

      if (error) {
        console.error('❌ Error fetching departments:', error);
        setDatabaseError(error);
        toast.error(`Lỗi tải dữ liệu: ${error.message}`);
        return;
      }

      const mappedData = (data || []).map((dept: any) => ({
        ...dept,
        id: dept._id || dept.id,
      }));

      setDepartments(mappedData);

      // Build tree structure
      const tree = buildTree(mappedData);
      setTreeData(tree);
    } catch (error) {
      console.error('❌ Error in fetchDepartments:', error);
      toast.error('Lỗi kết nối Supabase');
      setDatabaseError(error);
    } finally {
      setLoading(false);
    }
  };

  // Build tree structure from flat array using materialized path
  const buildTree = (departments: Department[]): Department[] => {
    const map = new Map<string, Department>();
    const roots: Department[] = [];

    // Create map of all departments
    departments.forEach((dept) => {
      map.set(dept.id, { ...dept, children: [] });
    });

    // Build tree by linking parents and children
    departments.forEach((dept) => {
      const node = map.get(dept.id)!;
      if (dept.parent_id) {
        const parent = map.get(dept.parent_id);
        if (parent) {
          parent.children!.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Expand all nodes
  const expandAll = () => {
    const allIds = new Set(departments.map((d) => d.id));
    setExpandedIds(allIds);
    toast.success('Đã mở rộng tất cả');
  };

  // Collapse all nodes
  const collapseAll = () => {
    setExpandedIds(new Set());
    toast.success('Đã thu gọn tất cả');
  };

  // Filter tree by search query
  const filterTree = (nodes: Department[], query: string): Department[] => {
    if (!query) return nodes;

    const filtered: Department[] = [];
    
    nodes.forEach((node) => {
      const matchesSearch = 
        node.name.toLowerCase().includes(query.toLowerCase()) ||
        node.code?.toLowerCase().includes(query.toLowerCase());

      const filteredChildren = node.children ? filterTree(node.children, query) : [];

      if (matchesSearch || filteredChildren.length > 0) {
        filtered.push({
          ...node,
          children: filteredChildren,
        });
        // Auto expand nodes that match
        if (matchesSearch) {
          setExpandedIds((prev) => new Set(prev).add(node.id));
        }
      }
    });

    return filtered;
  };

  const displayTree = searchQuery ? filterTree(treeData, searchQuery) : treeData;

  // Render tree node recursively
  const renderTreeNode = (node: Department, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const indent = level * 32; // Increased indent for clearer hierarchy

    return (
      <div key={node.id}>
        {/* Node Row */}
        <div
          className={treeStyles.treeNode}
          style={{
            paddingLeft: `${indent + 20}px`,
          }}
        >
          {/* Expand/Collapse Button - Square style */}
          <button
            className={treeStyles.treeExpandButton}
            onClick={() => toggleExpand(node.id)}
            type="button"
            style={{
              visibility: hasChildren ? 'visible' : 'hidden',
              opacity: hasChildren ? 1 : 0,
            }}
          >
            {isExpanded ? '-' : '+'}
          </button>

          {/* Green Status Dot */}
          <div className={treeStyles.statusDot} />

          {/* Department Name and Code */}
          <div className={treeStyles.treeNodeInfo}>
            <span className={treeStyles.treeNodeName}>{node.name}</span>
          </div>

          {/* Spacer to push actions to right */}
          <div style={{ flex: 1 }} />

          {/* Actions */}
          <div className={treeStyles.treeNodeActions}>
            <button
              className={styles.iconButton}
              onClick={() => handleClone(node)}
              title="Sao chép (bao gồm đơn vị con)"
              type="button"
            >
              <Copy size={16} />
            </button>
            <button
              className={styles.iconButton}
              onClick={() => {
                setModalMode('edit');
                setSelectedDepartment(node);
                setShowModal(true);
              }}
              title="Chỉnh sửa"
              type="button"
            >
              <Edit size={16} />
            </button>
            <button
              className={styles.iconButton}
              onClick={() => {
                toast.info('Tính năng thống kê đang phát triển');
              }}
              title="Xem thống kê"
              type="button"
            >
              <BarChart3 size={16} />
            </button>
            <button
              className={styles.iconButton}
              onClick={() => {
                setModalMode('add-child');
                setParentDepartment(node);
                setShowModal(true);
              }}
              title="Thêm đơn vị con"
              type="button"
            >
              <Plus size={16} />
            </button>
            <button
              className={styles.iconButtonDanger}
              onClick={() => handleDelete(node)}
              title="Xóa"
              type="button"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Children (if expanded) */}
        {hasChildren && isExpanded && (
          <div className={treeStyles.treeChildren}>
            {node.children!.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Export to Excel
  const handleExport = () => {
    try {

      const exportData = departments.map((dept) => ({
        'ID': dept.id,
        'Mã đơn vị': dept.code || '',
        'Tên đơn vị': dept.name,
        'Cấp': dept.level,
        'Đơn vị cha': dept.parent_id || '',
        'Đường dẫn': dept.path || '',
        'Ngày tạo': new Date(dept.created_at).toLocaleString('vi-VN'),
        'Ngày cập nhật': new Date(dept.updated_at).toLocaleString('vi-VN'),
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Đơn vị');

      const fileName = `Don_vi_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success('Đã xuất dữ liệu thành công');
    } catch (error) {
      console.error('❌ Export error:', error);
      toast.error('Lỗi xuất dữ liệu');
    }
  };

  // Delete department
  const handleDelete = async (dept: Department) => {
    // Check if has children
    if (dept.children && dept.children.length > 0) {
      toast.error('Không thể xóa đơn vị đang có đơn vị con. Vui lòng xóa các đơn vị con trước.');
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa đơn vị "${dept.name}" (${dept.code})?\n\nHành động này không thể hoàn tác.`
    );

    if (!confirmed) return;

    try {

      // Soft delete by setting deleted_at
      const { error } = await supabase
        .from('departments')
        .update({ deleted_at: new Date().toISOString() })
        .eq('_id', dept.id);

      if (error) throw error;

      toast.success('Đã xóa đơn vị thành công');

      // Refresh data
      fetchDepartments();
    } catch (error: any) {
      console.error('❌ Error deleting department:', error);
      toast.error(`Lỗi xóa đơn vị: ${error.message}`);
    }
  };

  // Clone department
  const handleClone = async (dept: Department) => {
    const hasChildren = dept.children && dept.children.length > 0;
    const childCount = hasChildren ? dept.children!.length : 0;
    
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn sao chép đơn vị \"${dept.name}\" (${dept.code})?\\n\\n` +
      `Hành động này sẽ tạo ra một bản sao mới của đơn vị này` +
      (hasChildren ? `, bao gồm ${childCount} đơn vị con.` : '.')
    );

    if (!confirmed) return;

    try {
      toast('Đang sao chép...', { icon: '⏳' });

      // Helper: Generate new unique code
      const generateNewCode = (originalCode: string, existingCodes: string[]): string => {
        let suffix = 1;
        let newCode = `${originalCode}_COPY`;
        
        while (existingCodes.includes(newCode)) {
          suffix++;
          newCode = `${originalCode}_COPY${suffix}`;
        }
        
        return newCode;
      };

      // Collect all existing codes
      const allCodes = departments.map(d => d.code || '').filter(Boolean);

      // Recursive clone function
      const cloneDepartmentRecursive = async (
        source: Department, 
        newParentId: string | null,
        usedCodes: string[]
      ): Promise<void> => {
        // Generate new unique code
        const newCode = generateNewCode(source.code || 'DV', usedCodes);
        usedCodes.push(newCode);

        // Calculate new path
        let newPath = newCode;
        if (newParentId) {
          const parent = departments.find(d => d.id === newParentId);
          if (parent && parent.path) {
            newPath = `${parent.path}.${newCode}`;
          }
        }

        // Insert cloned department
        const { data: clonedDept, error } = await supabase
          .from('departments')
          .insert({
            parent_id: newParentId,
            name: `${source.name} (Bản sao)`,
            code: newCode,
            level: source.level,
            path: newPath,
          })
          .select('*, id:_id')
          .single();

        if (error) throw error;


        // Recursively clone children
        if (source.children && source.children.length > 0) {
          for (const child of source.children) {
            await cloneDepartmentRecursive(child, (clonedDept as any)._id, usedCodes);
          }
        }
      };

      // Start cloning
      await cloneDepartmentRecursive(dept, dept.parent_id, [...allCodes]);

      toast.success(
        `Đã sao chép đơn vị thành công` +
        (hasChildren ? ` (bao gồm ${childCount} đơn vị con)` : '')
      );

      // Refresh data
      await fetchDepartments();
      
      // Auto expand to show cloned department
      setExpandedIds(prev => new Set([...prev, dept.parent_id || ''].filter(Boolean)));
    } catch (error: any) {
      console.error('❌ Error cloning department:', error);
      toast.error(`Lỗi sao chép đơn vị: ${error.message}`);
    }
  };

  // Show database error alert
  if (databaseError) {
    return <DatabaseErrorAlert error={databaseError} onRetry={fetchDepartments} />;
  }

  return (
    <div className={styles.container}>
      {/* Filters Card */}
      <div className={styles.filtersCard}>
        <div className={styles.filtersRow}>
          {/* Search */}
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Actions */}
          <div className={styles.actionsGroup}>
            <button
              className={styles.btnSecondary}
              onClick={expandAll}
              type="button"
              title="Mở rộng tất cả"
            >
              <Network size={18} />
              Mở rộng tất cả
            </button>
            <button
              className={styles.btnSecondary}
              onClick={collapseAll}
              type="button"
              title="Thu gọn tất cả"
            >
              <Network size={18} />
              Thu gọn
            </button>
            <button
              className={styles.btnSecondary}
              onClick={fetchDepartments}
              type="button"
            >
              <RefreshCw size={18} />
              Làm mới
            </button>
            <button
              className={styles.btnSecondary}
              onClick={handleExport}
              type="button"
            >
              <FileDown size={18} />
              Xuất Excel
            </button>
            <button
              className={styles.btnPrimary}
              onClick={() => {
                setModalMode('add');
                setSelectedDepartment(undefined);
                setParentDepartment(undefined);
                setShowModal(true);
              }}
              type="button"
            >
              <Plus size={18} />
              Thêm mới
            </button>
          </div>
        </div>
      </div>

      {/* Tree View */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loading}>
            <Loader2 size={32} className={styles.spinner} />
          </div>
        ) : displayTree.length === 0 ? (
          <div className={styles.emptyState}>
            <AlertCircle size={48} style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }} />
            <h3>
              {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có đơn vị nào'}
            </h3>
            <p>
              {searchQuery
                ? 'Thử thay đổi từ khóa tìm kiếm'
                : 'Bắt đầu bằng cách thêm đơn vị gốc'}
            </p>
          </div>
        ) : (
          <div className={treeStyles.treeContainer}>
            {displayTree.map((node) => renderTreeNode(node, 0))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && displayTree.length > 0 && (
        <div className={styles.tableFooter}>
          <div className={styles.footerInfo}>
            <Building2 size={16} />
            <span>
              Tổng số: <strong>{departments.length}</strong> đơn vị
              {searchQuery && ` • Tìm thấy: ${displayTree.length}`}
            </span>
          </div>
        </div>
      )}
      
      {/* Department Modal */}
      {showModal && (
        <DepartmentModal
          key={`${modalMode}-${selectedDepartment?.id || 'new'}-${Date.now()}`} // ✅ Force re-mount on every open
          mode={modalMode}
          department={selectedDepartment}
          parentDepartment={parentDepartment}
          onClose={() => {
            setShowModal(false);
            setSelectedDepartment(undefined);
            setParentDepartment(undefined);
          }}
          onRefresh={fetchDepartments}
        />
      )}
    </div>
  );
};

export default DepartmentsTab;
