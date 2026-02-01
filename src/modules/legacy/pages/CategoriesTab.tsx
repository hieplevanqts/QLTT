/**
 * Categories Tab - MAPPA Portal
 * Quản lý Danh mục (Categories) với CRUD operations
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import {
  Tag,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  Loader2,
  FileDown,
} from 'lucide-react';
import styles from './CategoriesTab.module.css';
import { toast } from 'sonner';
import { supabase } from '@/api/supabaseClient';
import { Pagination, usePagination } from '../components/Pagination';
import { CategoryModal } from '../components/CategoryModal';
import * as XLSX from 'xlsx';

interface Category {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

export const CategoriesTab: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Pagination
  const itemsPerPage = 10;
  const pagination = usePagination(filteredCategories, itemsPerPage);
  const { currentPage, setCurrentPage, totalPages, currentItems } = pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('categories')
        .select('*, id:_id')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching categories:', error);
        toast.error(`Lỗi tải dữ liệu: ${error.message}`);
        return;
      }

      setCategories(data || []);
      setFilteredCategories(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Lỗi kết nối cơ sở dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories
  useEffect(() => {
    let filtered = [...categories];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(term) ||
          cat.icon.toLowerCase().includes(term)
      );
    }

    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  // Modal handlers
  const handleOpenModal = (mode: 'add' | 'edit' | 'view', category?: Category) => {
    setModalMode(mode);
    setSelectedCategory(category || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = async () => {
    await fetchCategories();
    handleCloseModal();
  };

  // Delete category
  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${category.name}"?`)) {
      return;
    }

    try {

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('_id', category.id);

      if (error) {
        console.error('❌ Error deleting category:', error);
        toast.error(`Lỗi xóa danh mục: ${error.message}`);
        return;
      }

      toast.success('Đã xóa danh mục thành công');
      await fetchCategories();
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Lỗi khi xóa danh mục');
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const exportData = filteredCategories.map((cat, index) => ({
        'STT': index + 1,
        'Tên danh mục': cat.name,
        'Icon': cat.icon,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Danh mục');

      // Auto-size columns
      const wscols = [
        { wch: 5 },  // STT
        { wch: 35 }, // Tên
        { wch: 20 }, // Icon
      ];
      ws['!cols'] = wscols;

      XLSX.writeFile(wb, `Danh_muc_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Đã xuất file Excel thành công');
    } catch (error) {
      console.error('❌ Error exporting Excel:', error);
      toast.error('Lỗi xuất file Excel');
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 size={32} className={styles.spinner} />
      </div>
    );
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
              placeholder="Tìm kiếm theo tên, icon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Actions */}
          <div className={styles.actionsGroup}>
            <button onClick={fetchCategories} className={styles.btnSecondary}>
              <RefreshCw size={18} />
              Làm mới
            </button>
            <button onClick={handleExportExcel} className={styles.btnSecondary}>
              <FileDown size={18} />
              Xuất Excel
            </button>
            <button onClick={() => handleOpenModal('add')} className={styles.btnPrimary}>
              <Plus size={18} />
              Thêm mới
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredCategories.length === 0 ? (
        <div className={styles.emptyState}>
          <AlertCircle size={48} style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }} />
          <p>Không tìm thấy danh mục nào</p>
        </div>
      ) : (
        <>
          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>STT</th>
                    <th style={{ width: '100px' }}>Icon</th>
                    <th>Tên danh mục</th>
                    <th style={{ width: '150px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((cat, index) => (
                    <tr key={cat.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <span className={styles.iconBadge}>{cat.icon}</span>
                      </td>
                      <td>
                        <div className={styles.nameCell}>
                          <Tag size={16} style={{ color: 'var(--primary)' }} />
                          <span className={styles.nameText}>{cat.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleOpenModal('view', cat)}
                            className={styles.btnIcon}
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenModal('edit', cat)}
                            className={styles.btnIcon}
                            title="Chỉnh sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className={styles.btnIcon}
                            style={{ color: 'var(--destructive)' }}
                            title="Xóa"
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCategories.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Modal */}
      {showModal && (
        <CategoryModal
          mode={modalMode}
          category={selectedCategory}
          onClose={handleCloseModal}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
};

export default CategoriesTab;
