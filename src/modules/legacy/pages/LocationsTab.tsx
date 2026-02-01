/**
 * Locations Tab - MAPPA Portal
 * Master-Detail view: Tỉnh/TP (Master) → Xã/Phường (Detail)
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  Loader2,
  FileDown,
  ChevronRight,
  Map,
} from 'lucide-react';
import styles from './LocationsTab.module.css';
import { toast } from 'sonner';
import { supabase } from '@/api/supabaseClient';
import { Pagination, usePagination } from '../components/Pagination';
import { ProvinceModal } from '../components/ProvinceModal';
import { WardModal } from '../components/WardModal';

interface Province {
  id: string;
  code: string;
  name: string;
  created_at: string;
}

interface Ward {
  id: string;
  code: string;
  name: string;
  provinceId: string;
  created_at: string;
  province?: {
    id: string;
    code: string;
    name: string;
  };
}

export const LocationsTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  
  // Search states
  const [provinceSearchQuery, setProvinceSearchQuery] = useState('');
  const [wardSearchQuery, setWardSearchQuery] = useState('');

  // Modal states for provinces
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [provinceModalMode, setProvinceModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedProvinceForModal, setSelectedProvinceForModal] = useState<Province | null>(null);

  // Modal states for wards
  const [showWardModal, setShowWardModal] = useState(false);
  const [wardModalMode, setWardModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  const itemsPerPage = 15;

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchWardsByProvince(selectedProvince.id);
    }
  }, [selectedProvince]);

  const fetchProvinces = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('provinces')
        .select('*, id:_id')
        .order('code', { ascending: true });

      if (error) {
        console.error('❌ Error fetching provinces:', error);
        toast.error(`Lỗi tải tỉnh/thành phố: ${error.message}`);
        setProvinces([]);
      } else {
        setProvinces(data || []);
        
        // Auto-select first province if none selected
        if (data && data.length > 0 && !selectedProvince) {
          setSelectedProvince(data[0]);
        }
      }
    } catch (error) {
      console.error('❌ Error in fetchProvinces:', error);
      toast.error('Lỗi kết nối Supabase');
      setProvinces([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWardsByProvince = async (provinceId: string) => {
    try {

      // Fetch wards with pagination for large datasets
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
          .eq('provinceId', provinceId)
          .order('code', { ascending: true })
          .range(start, end);

        if (wardsError) {
          console.error('❌ Error fetching wards:', wardsError);
          toast.error('Không thể tải dữ liệu phường/xã');
          setWards([]);
          return;
        }

        if (!wardsData || wardsData.length === 0) {
          hasMore = false;
        } else {
          allWards = [...allWards, ...wardsData];
          if (wardsData.length < pageSize) {
            hasMore = false;
          } else {
            page++;
          }
        }
      }


      // Map data
      const mappedWards = allWards.map((ward: any) => ({
        ...ward,
        provinceId: ward.provinceId || ward.provinceid,
        province: ward.provinces,
      }));

      setWards(mappedWards);
    } catch (error) {
      console.error('❌ Error in fetchWardsByProvince:', error);
      toast.error('Lỗi kết nối Supabase');
      setWards([]);
    }
  };

  // Province handlers
  const handleAddProvince = () => {
    setProvinceModalMode('add');
    setSelectedProvinceForModal(null);
    setShowProvinceModal(true);
  };

  const handleEditProvince = (province: Province) => {
    setProvinceModalMode('edit');
    setSelectedProvinceForModal(province);
    setShowProvinceModal(true);
  };

  const handleViewProvince = (province: Province) => {
    setProvinceModalMode('view');
    setSelectedProvinceForModal(province);
    setShowProvinceModal(true);
  };

  const handleDeleteProvince = async (province: Province) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tỉnh/thành phố "${province.name}"?`)) {
      return;
    }

    try {
      // Check if province has wards
      const { count, error: countError } = await supabase
        .from('wards')
        .select('*, id:_id', { count: 'exact', head: true })
        .eq('provinceId', province.id);

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
        .eq('_id', province.id);

      if (error) {
        console.error('❌ Error deleting province:', error);
        toast.error(`Lỗi xóa tỉnh/thành phố: ${error.message}`);
      } else {
        toast.success('Đã xóa tỉnh/thành phố thành công');
        
        // Clear selection if deleted province was selected
        if (selectedProvince?.id === province.id) {
          setSelectedProvince(null);
          setWards([]);
        }
        
        fetchProvinces();
      }
    } catch (error) {
      console.error('❌ Error in handleDeleteProvince:', error);
      toast.error('Lỗi xóa tỉnh/thành phố');
    }
  };

  // Ward handlers
  const handleAddWard = () => {
    if (!selectedProvince) {
      toast.error('Vui lòng chọn tỉnh/thành phố trước');
      return;
    }
    setWardModalMode('add');
    setSelectedWard(null);
    setShowWardModal(true);
  };

  const handleEditWard = (ward: Ward) => {
    setWardModalMode('edit');
    setSelectedWard(ward);
    setShowWardModal(true);
  };

  const handleViewWard = (ward: Ward) => {
    setWardModalMode('view');
    setSelectedWard(ward);
    setShowWardModal(true);
  };

  const handleDeleteWard = async (ward: Ward) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa phường/xã "${ward.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('wards')
        .delete()
        .eq('_id', ward.id);

      if (error) {
        console.error('❌ Error deleting ward:', error);
        toast.error(`Lỗi xóa phường/xã: ${error.message}`);
      } else {
        toast.success('Đã xóa phường/xã thành công');
        if (selectedProvince) {
          fetchWardsByProvince(selectedProvince.id);
        }
      }
    } catch (error) {
      console.error('❌ Error in handleDeleteWard:', error);
      toast.error('Lỗi xóa phường/xã');
    }
  };

  const handleExportProvincesExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const excelData = filteredProvinces.map((province, index) => ({
        'STT': index + 1,
        'Mã tỉnh/TP': province.code,
        'Tên tỉnh/thành phố': province.name,
        'Ngày tạo': new Date(province.created_at).toLocaleString('vi-VN'),
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      ws['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 40 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, ws, 'Tỉnh-Thành phố');

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      XLSX.writeFile(wb, `MAPPA_Tinh_ThanhPho_${timestamp}.xlsx`);

      toast.success(`Đã xuất ${filteredProvinces.length} tỉnh/thành phố ra Excel`);
    } catch (error) {
      console.error('❌ Error exporting provinces:', error);
      toast.error('Lỗi xuất Excel');
    }
  };

  const handleExportWardsExcel = async () => {
    if (!selectedProvince) {
      toast.error('Vui lòng chọn tỉnh/thành phố');
      return;
    }

    try {
      const XLSX = await import('xlsx');
      const excelData = filteredWards.map((ward, index) => ({
        'STT': index + 1,
        'Mã phường/xã': ward.code,
        'Tên phường/xã': ward.name,
        'Tỉnh/TP': selectedProvince.name,
        'Ngày tạo': new Date(ward.created_at).toLocaleString('vi-VN'),
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      ws['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 40 }, { wch: 30 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, ws, 'Phường-Xã');

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      XLSX.writeFile(wb, `MAPPA_Phuong_Xa_${selectedProvince.name}_${timestamp}.xlsx`);

      toast.success(`Đã xuất ${filteredWards.length} phường/xã ra Excel`);
    } catch (error) {
      console.error('❌ Error exporting wards:', error);
      toast.error('Lỗi xuất Excel');
    }
  };

  // Filtering
  const filteredProvinces = provinces.filter((province) => {
    if (provinceSearchQuery) {
      const query = provinceSearchQuery.toLowerCase();
      return (
        province.name?.toLowerCase().includes(query) ||
        province.code?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const filteredWards = wards.filter((ward) => {
    if (wardSearchQuery) {
      const query = wardSearchQuery.toLowerCase();
      return (
        ward.name?.toLowerCase().includes(query) ||
        ward.code?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Pagination
  const {
    currentPage: provincePage,
    totalPages: provinceTotalPages,
    currentItems: paginatedProvinces,
    setCurrentPage: setProvincePage,
  } = usePagination(filteredProvinces || [], itemsPerPage);

  const {
    currentPage: wardPage,
    totalPages: wardTotalPages,
    currentItems: paginatedWards,
    setCurrentPage: setWardPage,
  } = usePagination(filteredWards || [], itemsPerPage);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={48} />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className={styles.masterDetailContainer}>
      {/* LEFT PANEL: PROVINCES (MASTER) */}
      <div className={styles.masterPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            <Building2 size={20} />
            <h3>Tỉnh/Thành phố</h3>
            <span className={styles.badge}>{provinces.length}</span>
          </div>
        </div>

        {/* Province Actions */}
        <div className={styles.panelActions}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm tỉnh/TP..."
              value={provinceSearchQuery}
              onChange={(e) => setProvinceSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.btnIconSmall} onClick={fetchProvinces} title="Làm mới">
              <RefreshCw size={16} />
            </button>
            <button className={styles.btnIconSmall} onClick={handleExportProvincesExcel} title="Xuất Excel">
              <FileDown size={16} />
            </button>
            <button className={styles.btnPrimarySmall} onClick={handleAddProvince}>
              <Plus size={16} />
              Thêm
            </button>
          </div>
        </div>

        {/* Provinces List */}
        <div className={styles.listContainer}>
          {paginatedProvinces.length === 0 ? (
            <div className={styles.emptyState}>
              <AlertCircle size={32} />
              <p>Không tìm thấy tỉnh/thành phố</p>
            </div>
          ) : (
            paginatedProvinces.map((province) => (
              <div
                key={province.id}
                className={`${styles.listItem} ${selectedProvince?.id === province.id ? styles.listItemActive : ''}`}
                onClick={() => setSelectedProvince(province)}
              >
                <div className={styles.listItemContent}>
                  <div className={styles.listItemHeader}>
                    <Building2 size={16} />
                    <span className={styles.listItemTitle}>{province.name}</span>
                  </div>
                  <div className={styles.listItemMeta}>
                    <code className={styles.codeSmall}>{province.code}</code>
                    <span className={styles.listItemCount}>
                      {wards.filter(w => w.provinceId === province.id).length} phường/xã
                    </span>
                  </div>
                </div>
                <div className={styles.listItemActions}>
                  <button
                    className={styles.btnIconTiny}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProvince(province);
                    }}
                    title="Xem"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    className={styles.btnIconTiny}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProvince(province);
                    }}
                    title="Sửa"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    className={styles.btnIconTinyDanger}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProvince(province);
                    }}
                    title="Xóa"
                  >
                    <Trash2 size={14} className="text-destructive" />
                  </button>
                </div>
                {selectedProvince?.id === province.id && (
                  <ChevronRight size={16} className={styles.activeIndicator} />
                )}
              </div>
            ))
          )}
        </div>

        {/* Province Pagination */}
        {filteredProvinces.length > itemsPerPage && (
          <div className={styles.panelFooter}>
            <Pagination
              currentPage={provincePage}
              totalPages={provinceTotalPages}
              totalItems={filteredProvinces.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setProvincePage}
            />
          </div>
        )}
      </div>

      {/* RIGHT PANEL: WARDS (DETAIL) */}
      <div className={styles.detailPanel}>
        {selectedProvince ? (
          <>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <MapPin size={20} />
                <h3>Phường/Xã</h3>
                <ChevronRight size={16} style={{ color: 'var(--muted-foreground)' }} />
                <span className={styles.selectedProvinceName}>{selectedProvince.name}</span>
                <span className={styles.badge}>{wards.length}</span>
              </div>
            </div>

            {/* Ward Actions */}
            <div className={styles.panelActions}>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Tìm phường/xã..."
                  value={wardSearchQuery}
                  onChange={(e) => setWardSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.actionButtons}>
                <button
                  className={styles.btnIconSmall}
                  onClick={() => fetchWardsByProvince(selectedProvince.id)}
                  title="Làm mới"
                >
                  <RefreshCw size={16} />
                </button>
                <button className={styles.btnIconSmall} onClick={handleExportWardsExcel} title="Xuất Excel">
                  <FileDown size={16} />
                </button>
                <button className={styles.btnPrimarySmall} onClick={handleAddWard}>
                  <Plus size={16} />
                  Thêm phường/xã
                </button>
              </div>
            </div>

            {/* Wards Table */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>STT</th>
                    <th style={{ width: '120px' }}>Mã</th>
                    <th style={{ width: 'auto', minWidth: '200px' }}>Tên phường/xã</th>
                    <th style={{ width: '180px' }}>Ngày tạo</th>
                    <th style={{ width: '150px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedWards.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyState}>
                        <AlertCircle size={48} />
                        <p>Không có phường/xã nào</p>
                        <button className={styles.btnPrimary} onClick={handleAddWard}>
                          <Plus size={16} />
                          Thêm phường/xã đầu tiên
                        </button>
                      </td>
                    </tr>
                  ) : (
                    paginatedWards.map((ward, index) => (
                      <tr key={ward.id}>
                        <td style={{ textAlign: 'center' }}>
                          {(wardPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td>
                          {ward.code ? (
                            <code className={styles.codeText}>{ward.code}</code>
                          ) : (
                            <span style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>
                              Chưa có mã
                            </span>
                          )}
                        </td>
                        <td>
                          <div className={styles.cellMain}>
                            <div className={styles.cellWithIcon}>
                              <MapPin size={16} style={{ color: 'var(--primary)' }} />
                              <span className={styles.cellTitle}>{ward.name}</span>
                            </div>
                          </div>
                        </td>
                        <td>{new Date(ward.created_at).toLocaleString('vi-VN')}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.btnIcon}
                              onClick={() => handleViewWard(ward)}
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className={styles.btnIcon}
                              onClick={() => handleEditWard(ward)}
                              title="Chỉnh sửa"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className={styles.btnIconDanger}
                              onClick={() => handleDeleteWard(ward)}
                              title="Xóa"
                            >
                              <Trash2 size={16} className="text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Ward Pagination */}
            {filteredWards.length > 0 && wardTotalPages > 1 && (
              <div className={styles.tableFooter}>
                <div className={styles.footerInfo}>
                  Hiển thị <strong>{(wardPage - 1) * itemsPerPage + 1}</strong> đến{' '}
                  <strong>{Math.min(wardPage * itemsPerPage, filteredWards.length)}</strong> trong tổng số{' '}
                  <strong>{filteredWards.length}</strong> phường/xã
                </div>
                <Pagination
                  currentPage={wardPage}
                  totalPages={wardTotalPages}
                  totalItems={filteredWards.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setWardPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyDetailPanel}>
            <Map size={64} style={{ opacity: 0.3 }} />
            <h3>Chọn tỉnh/thành phố</h3>
            <p>Vui lòng chọn một tỉnh/thành phố bên trái để xem danh sách phường/xã</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showProvinceModal && (
        <ProvinceModal
          mode={provinceModalMode}
          province={selectedProvinceForModal}
          onClose={() => setShowProvinceModal(false)}
          onSave={fetchProvinces}
        />
      )}

      {showWardModal && (
        <WardModal
          mode={wardModalMode}
          ward={selectedWard}
          provinceId={selectedProvince?.id}
          onClose={() => setShowWardModal(false)}
          onSave={() => {
            if (selectedProvince) {
              fetchWardsByProvince(selectedProvince.id);
            }
          }}
        />
      )}
    </div>
  );
};

export default LocationsTab;
