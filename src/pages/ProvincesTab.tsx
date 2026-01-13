/**
 * Provinces Tab - MAPPA Portal  
 * Quản lý Tỉnh/Thành phố với CRUD operations
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import {
  Building2,
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
import styles from './AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Pagination, usePagination } from '../components/Pagination';
import { ProvinceModal } from '../components/ProvinceModal';
import * as XLSX from 'xlsx';

interface Province {
  id: string;
  code: string;
  name: string;
  created_at: string;
}

export const ProvincesTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);

  const itemsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching provinces from Supabase...');

      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .order('code', { ascending: true });

      if (error) {
        console.error('❌ Error fetching provinces:', error);
        toast.error(`Lỗi tải tỉnh/thành phố: ${error.message}`);
        setProvinces([]);
      } else {
        console.log(`✅ Loaded ${data?.length || 0} provinces from Supabase`);
        setProvinces(data || []);
      }
    } catch (error) {
      console.error('❌ Error in fetchData:', error);
      toast.error('Lỗi kết nối Supabase');
      setProvinces([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProvinces = provinces.filter((province) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        province.name?.toLowerCase().includes(query) ||
        province.code?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const {
    currentPage,
    totalPages,
    currentItems: paginatedData,
    setCurrentPage,
  } = usePagination(filteredProvinces || [], itemsPerPage);

  const handleAdd = () => {
    setModalMode('add');
    setSelectedProvince(null);
    setShowModal(true);
  };

  const handleEdit = (province: Province) => {
    setModalMode('edit');
    setSelectedProvince(province);
    setShowModal(true);
  };

  const handleView = (province: Province) => {
    setModalMode('view');
    setSelectedProvince(province);
    setShowModal(true);
  };

  const handleDelete = async (province: Province) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tỉnh/thành phố "${province.name}"?`)) {
      return;
    }

    try {
      // Check if province has wards
      const { count, error: countError } = await supabase
        .from('wards')
        .select('*', { count: 'exact', head: true })
        .eq('provinceid', province.id);

      if (countError) {
        console.error('❌ Error checking wards count:', countError);
        toast.error(`Lỗi kiểm tra phường/xã: ${countError.message}`);
        return;
      }

      if (count && count > 0) {
        toast.error(`Không thể xóa tỉnh/thành phố đang có ${count} phường/xã. Vui lòng xóa phường/xã trước.`);
        return;
      }

      const { error } = await supabase
        .from('provinces')
        .delete()
        .eq('id', province.id);

      if (error) {
        console.error('❌ Error deleting province:', error);
        toast.error(`Lỗi xóa tỉnh/thành phố: ${error.message}`);
      } else {
        console.log('✅ Province deleted successfully');
        toast.success('Đã xóa tỉnh/thành phố thành công');
        fetchData();
      }
    } catch (error) {
      console.error('❌ Error in handleDelete:', error);
      toast.error('Lỗi xóa tỉnh/thành phố');
    }
  };

  const handleExportExcel = () => {
    try {
      console.log('📊 Exporting provinces to Excel...');

      const excelData = filteredProvinces.map((province, index) => ({
        'STT': index + 1,
        'Mã tỉnh/TP': province.code,
        'Tên tỉnh/thành phố': province.name,
        'Ngày tạo': new Date(province.created_at).toLocaleString('vi-VN'),
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      const colWidths = [
        { wch: 5 },  // STT
        { wch: 15 }, // Mã
        { wch: 40 }, // Tên
        { wch: 20 }, // Ngày tạo
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Tỉnh-Thành phố');

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `MAPPA_Tinh_ThanhPho_${timestamp}.xlsx`;

      XLSX.writeFile(wb, filename);

      console.log(`✅ Exported ${filteredProvinces.length} provinces to ${filename}`);
      toast.success(`Đã xuất ${filteredProvinces.length} tỉnh/thành phố ra Excel`);
    } catch (error) {
      console.error('❌ Error exporting to Excel:', error);
      toast.error('Lỗi xuất Excel');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={48} />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.filterGroup}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.actionGroup}>
          <button className={styles.btnSecondary} onClick={fetchData}>
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button className={styles.btnPrimary} onClick={handleAdd}>
            <Plus size={16} />
            Thêm tỉnh/TP
          </button>
          <button className={styles.btnPrimary} onClick={handleExportExcel}>
            <FileDown size={16} />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>STT</th>
              <th style={{ width: '150px' }}>Mã tỉnh/TP</th>
              <th style={{ width: 'auto', minWidth: '300px' }}>Tên tỉnh/thành phố</th>
              <th style={{ width: '180px' }}>Ngày tạo</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  <AlertCircle size={48} />
                  <p>Không tìm thấy tỉnh/thành phố nào</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((province, index) => (
                <tr key={province.id}>
                  <td style={{ textAlign: 'center' }}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>
                    {province.code ? (
                      <code className={styles.codeText}>{province.code}</code>
                    ) : (
                      <span style={{ color: 'var(--muted-foreground, #6c757d)', fontStyle: 'italic' }}>
                        Chưa có mã
                      </span>
                    )}
                  </td>
                  <td>
                    <div className={styles.cellMain}>
                      <div className={styles.cellWithIcon}>
                        <Building2 size={16} style={{ color: 'var(--primary, #005cb6)' }} />
                        <span className={styles.cellTitle}>{province.name}</span>
                      </div>
                    </div>
                  </td>
                  <td>{new Date(province.created_at).toLocaleString('vi-VN')}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleView(province)}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleEdit(province)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={styles.btnIconDanger}
                        onClick={() => handleDelete(province)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      {filteredProvinces.length > 0 && totalPages > 1 && (
        <div className={styles.tableFooter}>
          <div className={styles.footerInfo}>
            Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> đến{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredProvinces.length)}</strong> trong tổng số{' '}
            <strong>{filteredProvinces.length}</strong> tỉnh/thành phố
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProvinces.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProvinceModal
          mode={modalMode}
          province={selectedProvince}
          onClose={() => setShowModal(false)}
          onSave={fetchData}
        />
      )}
    </div>
  );
};

export default ProvincesTab;