/**
 * Wards Tab - MAPPA Portal
 * Quản lý Phường/Xã với CRUD operations và filter theo tỉnh/thành phố
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  Loader2,
  Filter,
  FileDown,
} from 'lucide-react';
import styles from './AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Pagination, usePagination } from '../components/Pagination';
import { WardModal } from '../components/WardModal';
import * as XLSX from 'xlsx';

interface Ward {
  id: string;
  code: string;
  name: string;
  provinceId: string; // ← Changed to camelCase
  created_at: string;
  province?: {
    id: string;
    code: string;
    name: string;
  };
}

interface Province {
  id: string;
  code: string;
  name: string;
}

export const WardsTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [wards, setWards] = useState<Ward[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  const itemsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch provinces first
      const { data: provincesData, error: provincesError } = await supabase
        .from('provinces')
        .select('*')
        .order('code', { ascending: true });

      if (provincesError) {
        console.error('❌ Error fetching provinces:', provincesError);
        toast.error(`Lỗi tải tỉnh/thành phố: ${provincesError.message}`);
      } else {
        setProvinces(provincesData || []);
      }

      // Fetch ALL wards with pagination (Supabase has 1000 record limit per query)
      let allWards: any[] = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const start = page * pageSize;
        const end = start + pageSize - 1;
        
        
        const { data: wardsData, error: wardsError } = await supabase
          .from('wards')
          .select(`
            *,
            provinces (
              id,
              code,
              name
            )
          `)
          .order('code', { ascending: true })
          .range(start, end);

        if (wardsError) {
          console.error('❌ Error fetching wards:', wardsError);
          toast.error('Không thể tải dữ liệu phường/xã');
          setLoading(false);
          return;
        }

        if (!wardsData || wardsData.length === 0) {
          hasMore = false;
        } else {
          allWards = [...allWards, ...wardsData];
          
          // If we got less than pageSize, we've reached the end
          if (wardsData.length < pageSize) {
            hasMore = false;
          } else {
            page++;
          }
        }
      }

      
      // Debug: Log raw data structure - CHECK ALL KEYS
      if (allWards.length > 0) {
      }
      
      // Map data: Try both field names
      const mappedWards = allWards.map((ward: any) => {
        // Check which field exists
        const provinceIdValue = ward.provinceId || ward.provinceid;
        
        return {
          ...ward,
          provinceId: provinceIdValue, // Use whichever exists
          province: ward.provinces, // Rename provinces (plural) to province (singular)
        };
      });
      
      // Debug: Log mapped data structure
      if (mappedWards.length > 0) {
      }
      
      setWards(mappedWards);
    } catch (error) {
      console.error('❌ Error in fetchData:', error);
      toast.error('Lỗi kết nối Supabase');
      setWards([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredWards = wards.filter((ward) => {
    // Province filter (check first for better performance)
    if (selectedProvinceId !== 'all') {
      // Debug log - MORE DETAILED
      if (wards.indexOf(ward) === 0) {
          selectedProvinceId,
          wardProvinceId: ward.provinceId,
          wardProvinceIdLowercase: (ward as any).provinceid,
          wardKeys: Object.keys(ward),
          match: ward.provinceId === selectedProvinceId,
          fullWard: ward
        });
      }
      
      if (ward.provinceId !== selectedProvinceId) {
        return false;
      }
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        ward.name?.toLowerCase().includes(query) ||
        ward.code?.toLowerCase().includes(query) ||
        ward.province?.name?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    return true;
  });

  const {
    currentPage,
    totalPages,
    currentItems: paginatedData,
    setCurrentPage,
  } = usePagination(filteredWards || [], itemsPerPage);

  const handleAdd = () => {
    setModalMode('add');
    setSelectedWard(null);
    setShowModal(true);
  };

  const handleEdit = (ward: Ward) => {
    setModalMode('edit');
    setSelectedWard(ward);
    setShowModal(true);
  };

  const handleView = (ward: Ward) => {
    setModalMode('view');
    setSelectedWard(ward);
    setShowModal(true);
  };

  const handleDelete = async (ward: Ward) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa phường/xã "${ward.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('wards')
        .delete()
        .eq('id', ward.id);

      if (error) {
        console.error('❌ Error deleting ward:', error);
        toast.error(`Lỗi xóa phường/xã: ${error.message}`);
      } else {
        toast.success('Đã xóa phường/xã thành công');
        fetchData();
      }
    } catch (error) {
      console.error('❌ Error in handleDelete:', error);
      toast.error('Lỗi xóa phường/xã');
    }
  };

  const handleExportExcel = () => {
    try {

      const excelData = filteredWards.map((ward, index) => ({
        'STT': index + 1,
        'Mã phường/xã': ward.code,
        'Tên phường/xã': ward.name,
        'Tỉnh/Thành phố': ward.province?.name || '',
        'Ngày tạo': new Date(ward.created_at).toLocaleString('vi-VN'),
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      const colWidths = [
        { wch: 5 },  // STT
        { wch: 15 }, // Mã
        { wch: 30 }, // Tên
        { wch: 25 }, // Tỉnh/TP
        { wch: 20 }, // Ngày tạo
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Phường-Xã');

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `MAPPA_Phuong_Xa_${timestamp}.xlsx`;

      XLSX.writeFile(wb, filename);

      toast.success(`Đã xuất ${filteredWards.length} phường/xã ra Excel`);
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

          <button
            className={showFilters ? styles.btnPrimary : styles.btnSecondary}
            onClick={() => setShowFilters(!showFilters)}
            title={showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          >
            <Filter size={16} />
            Bộ lọc
          </button>
        </div>

        <div className={styles.actionGroup}>
          <button className={styles.btnSecondary} onClick={fetchData}>
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button className={styles.btnPrimary} onClick={handleAdd}>
            <Plus size={16} />
            Thêm phường/xã
          </button>
          <button className={styles.btnPrimary} onClick={handleExportExcel}>
            <FileDown size={16} />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className={styles.filterPanel}>
          <div className={styles.filterRow}>
            {/* Province Filter */}
            <div className={styles.filterItem}>
              <label>Tỉnh/Thành phố</label>
              <select
                value={selectedProvinceId}
                onChange={(e) => {
                  const newValue = e.target.value;
                    from: selectedProvinceId,
                    to: newValue,
                    totalWards: wards.length,
                    wardsWithProvince: wards.filter(w => w.provinceId === newValue).length
                  });
                  setSelectedProvinceId(newValue);
                }}
                className={styles.select}
              >
                <option value="all">Tất cả tỉnh/thành phố ({wards.length})</option>
                {provinces.map((province) => {
                  const count = wards.filter(w => w.provinceId === province.id).length;
                  return (
                    <option key={province.id} value={province.id}>
                      {province.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedProvinceId !== 'all' || searchQuery) && (
              <div className={styles.filterItem}>
                <label>&nbsp;</label>
                <button
                  className={styles.btnSecondary}
                  onClick={() => {
                    setSelectedProvinceId('all');
                    setSearchQuery('');
                  }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Filter Status & Debug Info */}
          <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary, #6c757d)' }}>
            {selectedProvinceId !== 'all' ? (
              <div>
                🔍 Đang lọc: <strong>{provinces.find(p => p.id === selectedProvinceId)?.name}</strong>
                {' '}({filteredWards.length} kết quả)
              </div>
            ) : (
              <div>
                📊 Tổng: <strong>{wards.length}</strong> phường/xã
                {wards.length > 0 && wards.some(w => !w.provinceId) && (
                  <span style={{ marginLeft: '16px', color: 'var(--danger, #dc3545)' }}>
                    ⚠️ Có {wards.filter(w => !w.provinceId).length} phường/xã chưa gán tỉnh
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>STT</th>
              <th style={{ width: '120px' }}>Mã</th>
              <th style={{ width: 'auto', minWidth: '200px' }}>Tên phường/xã</th>
              <th style={{ width: '200px' }}>Tỉnh/Thành phố</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  <AlertCircle size={48} />
                  <p>Không tìm thấy phường/xã nào</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((ward, index) => (
                <tr key={ward.id}>
                  <td style={{ textAlign: 'center' }}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>
                    {ward.code ? (
                      <code className={styles.codeText}>{ward.code}</code>
                    ) : (
                      <span style={{ color: 'var(--muted-foreground, #6c757d)', fontStyle: 'italic' }}>
                        Chưa có mã
                      </span>
                    )}
                  </td>
                  <td>
                    <div className={styles.cellMain}>
                      <div className={styles.cellWithIcon}>
                        <MapPin size={16} style={{ color: 'var(--primary, #005cb6)' }} />
                        <span className={styles.cellTitle}>{ward.name}</span>
                      </div>
                    </div>
                  </td>
                  <td>{ward.province?.name || '-'}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleView(ward)}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleEdit(ward)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={styles.btnIconDanger}
                        onClick={() => handleDelete(ward)}
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
      {filteredWards.length > 0 && totalPages > 1 && (
        <div className={styles.tableFooter}>
          <div className={styles.footerInfo}>
            Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> đến{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredWards.length)}</strong> trong tổng số{' '}
            <strong>{filteredWards.length}</strong> phường/xã
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredWards.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <WardModal
          mode={modalMode}
          ward={selectedWard}
          provinces={provinces}
          onClose={() => setShowModal(false)}
          onSave={fetchData}
        />
      )}
    </div>
  );
};

export default WardsTab;