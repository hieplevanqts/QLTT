import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  FileDown,
  Upload,
  Check,
  XCircle,
  RefreshCw,
  Loader2,
  AlertCircle,
  Building2,
  User,
  Download,
  ChevronDown,
} from 'lucide-react';
import styles from './TerritoryTab.module.css';
import { Pagination } from '../components/Pagination';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner';
import { supabase } from '@/api/supabaseClient';
import * as XLSX from 'xlsx';

// ==================== INTERFACES ====================
interface Area {
  id: string;
  code: string;
  name: string;
  level?: string; // Can be null
  provinceId?: string;
  wardId?: string;
  managerId?: string;
  description?: string;
  status: number; // 1: Active, 0: Inactive
  provinceName?: string; // Joined from provinces table
  provinceCode?: string;
  wardName?: string; // Joined from wards table
  wardCode?: string;
  managerName?: string; // Joined from users table (full_name)
  managerEmail?: string;
  userCount?: number;
  createdat?: string;
  updatedat?: string;
}

interface TerritoryTabProps {
  territories?: Area[];
  onOpenModal: (type: any, item?: any) => void;
}

export const TerritoryTabNew: React.FC<TerritoryTabProps> = ({ 
  onOpenModal 
}) => {
  const [territories, setTerritories] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // 🎯 NEW: Dynamic filters for province and ward
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');

  // 🎯 NEW: Province and Ward data from Supabase
  const [provinces, setProvinces] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  // Dropdown state for Import menu
  const [isImportDropdownOpen, setIsImportDropdownOpen] = useState(false);

  const filteredWards = wards.filter(ward => ward.provinceId === selectedProvince);

  // Fetch areas from API
  const fetchAreas = async () => {
    try {
      setLoading(true);
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e994bb5d`;
      
      const response = await fetch(`${baseUrl}/areas`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch areas');
      }

      const result = await response.json();
      setTerritories(result.data || []);
    } catch (error: any) {
      console.error('Error fetching areas:', error);
      toast.error(`Lỗi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 NEW: Fetch provinces from Supabase
  const fetchProvinces = async () => {
    try {
      const { data, error } = await supabase
        .from('provinces')
        .select('*, id:_id')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching provinces:', error);
        throw error;
      }
      setProvinces(data || []);
    } catch (error) {
      console.error('❌ Error in fetchProvinces:', error);
      toast.error('Lỗi tải danh sách Tỉnh/TP');
    }
  };

  // 🎯 NEW: Fetch wards from Supabase
  const fetchWards = async () => {
    try {
      const { data, error } = await supabase
        .from('wards')
        .select('*, id:_id')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching wards:', error);
        throw error;
      }
      setWards(data || []);
    } catch (error) {
      console.error('❌ Error in fetchWards:', error);
      toast.error('Lỗi tải danh sách Phường/Xã');
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchAreas();
    fetchProvinces();
    fetchWards();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.importDropdown}`)) {
        setIsImportDropdownOpen(false);
      }
    };

    if (isImportDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isImportDropdownOpen]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = territories.length;
    const withProvince = territories.filter(t => t.provinceId).length;
    const withWard = territories.filter(t => t.wardId).length;
    const active = territories.filter(t => t.status === 1).length;

    return {
      total,
      withProvince,
      withWard,
      active,
      inactive: total - active,
    };
  }, [territories]);

  // Filter and search
  const filteredTerritories = useMemo(() => {
    return territories.filter(territory => {
      const matchesSearch = 
        territory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        territory.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (territory.provinceName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (territory.wardName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (territory.managerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      const matchesLevel = 
        levelFilter === 'all' || 
        (levelFilter === 'PROVINCE' && territory.provinceId && !territory.wardId) ||
        (levelFilter === 'WARD' && territory.wardId);
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && territory.status === 1) ||
        (statusFilter === 'inactive' && territory.status === 0);
      
      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [territories, searchTerm, levelFilter, statusFilter]);

  // Pagination
  const paginatedTerritories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTerritories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTerritories, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTerritories.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getLevelLabel = (area: Area) => {
    if (area.wardId) {
      return 'Xã/Phường';
    } else if (area.provinceId) {
      return 'Tỉnh/TP';
    }
    return 'Chưa xác định';
  };

  const getLevelBadgeClass = (area: Area) => {
    if (area.wardId) {
      return styles.levelWard;
    } else if (area.provinceId) {
      return styles.levelProvince;
    }
    return '';
  };

  const handleRefresh = () => {
    fetchAreas();
    toast.success('Đã làm mới dữ liệu');
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTerritories);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Territories');
    XLSX.writeFile(workbook, 'territories.xlsx');
    toast.success('Đã xuất dữ liệu thành công');
  };

  // Download Excel Template
  const handleDownloadTemplate = () => {
    setIsImportDropdownOpen(false); // Close dropdown
    
    try {
      
      // Create template data with sample rows
      const templateData = [
        {
          'Mã': 'DB001',
          'Tên địa bàn': 'Địa bàn mẫu 1',
          'Cấp': 'PROVINCE',
          'Mô tả': 'Mô tả về địa bàn',
          'Trạng thái': 'Hoạt động',
        },
        {
          'Mã': 'DB002',
          'Tên địa bàn': 'Địa bàn mẫu 2',
          'Cấp': 'WARD',
          'Mô tả': 'Mô tả về địa bàn',
          'Trạng thái': 'Không hoạt động',
        },
      ];

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(templateData);

      // Set column widths
      const wscols = [
        { wch: 15 },  // Mã
        { wch: 30 },  // Tên địa bàn
        { wch: 15 },  // Cấp
        { wch: 40 },  // Mô tả
        { wch: 20 },  // Trạng thái
      ];
      ws['!cols'] = wscols;

      // Create workbook and add worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Mẫu Địa bàn');

      // Add instructions sheet
      const instructions = [
        { 'CỘT': 'Mã', 'BẮT BUỘC': 'Có', 'ĐỊNH DẠNG': 'Text', 'GHI CHÚ': 'Mã địa bàn duy nhất, ví dụ: DB001' },
        { 'CỘT': 'Tên địa bàn', 'BẮT BUỘC': 'Có', 'ĐỊNH DẠNG': 'Text', 'GHI CHÚ': 'Tên đầy đủ của địa bàn' },
        { 'CỘT': 'Cấp', 'BẮT BUỘC': 'Có', 'ĐỊNH DẠNG': 'Text', 'GHI CHÚ': 'Ghi "PROVINCE" (Tỉnh/TP) hoặc "WARD" (Xã/Phường) hoặc "DISTRICT" (Quận/Huyện)' },
        { 'CỘT': 'Mô tả', 'BẮT BUỘC': 'Không', 'ĐỊNH DẠNG': 'Text', 'GHI CHÚ': 'Mô tả chi tiết về địa bàn' },
        { 'CỘT': 'Trạng thái', 'BẮT BUỘC': 'Không', 'ĐỊNH DẠNG': 'Text', 'GHI CHÚ': 'Ghi "Hoạt động" hoặc để trống/khác = Không hoạt động' },
      ];

      const wsInstructions = XLSX.utils.json_to_sheet(instructions);
      const wsInstructionsCols = [
        { wch: 20 },  // Cột
        { wch: 15 },  // Bắt buộc
        { wch: 15 },  // Định dạng
        { wch: 70 },  // Ghi chú
      ];
      wsInstructions['!cols'] = wsInstructionsCols;
      XLSX.utils.book_append_sheet(wb, wsInstructions, 'Hướng dẫn');

      // Download file
      const fileName = `Mau_Dia_ban_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('Đã tải file mẫu thành công');
    } catch (error) {
      console.error('❌ Error generating template:', error);
      toast.error('Lỗi tải file mẫu');
    }
  };

  // Import Excel
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImportDropdownOpen(false); // Close dropdown
    
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);


          if (jsonData.length === 0) {
            toast.error('File Excel không có dữ liệu');
            return;
          }

          // Validate and transform data
          const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e994bb5d`;
          let successCount = 0;
          let errorCount = 0;

          for (const row of jsonData as any[]) {
            try {
              // Transform Excel row to API format
              const areaData = {
                code: row['Mã'] || row['code'] || '',
                name: row['Tên địa bàn'] || row['name'] || '',
                level: row['Cấp'] || row['level'] || 'PROVINCE', // Default to PROVINCE if not provided
                description: row['Mô tả'] || row['description'] || '',
                status: row['Trạng thái'] === 'Hoạt động' ? 1 : 0,
              };

              // Validate required fields
              if (!areaData.code || !areaData.name || !areaData.level) {
                errorCount++;
                continue;
              }

              // Send to API
              const response = await fetch(`${baseUrl}/areas`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${publicAnonKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(areaData),
              });

              if (response.ok) {
                successCount++;
              } else {
                errorCount++;
                const errorData = await response.json();
                console.error('❌ Error importing row:', errorData);
              }
            } catch (rowError) {
              console.error('❌ Error processing row:', rowError);
              errorCount++;
            }
          }

          // Show results
          if (successCount > 0) {
            toast.success(`Đã import thành công ${successCount} địa bàn`);
            await fetchAreas(); // Refresh the list
          }
          
          if (errorCount > 0) {
            toast.warning(`${errorCount} bản ghi không import được`);
          }

        } catch (parseError) {
          console.error('❌ Error parsing Excel:', parseError);
          toast.error('Lỗi đọc file Excel. Vui lòng kiểm tra định dạng file.');
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('❌ Error importing Excel:', error);
      toast.error('Lỗi import file Excel');
    }

    // Reset input
    e.target.value = '';
  };

  return (
    <div className={styles.territoryContainer}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.headerInfo}>
          <h2 className={styles.sectionTitle}>Địa bàn & phạm vi</h2>
          <p className={styles.sectionDesc}>
            Quản lý danh sách địa bàn hành chính và phạm vi quản lý toàn hệ thống
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn} onClick={handleRefresh} disabled={loading}>
            <RefreshCw size={16} className={loading ? styles.spinning : ''} />
            Làm mới
          </button>
          <button className={styles.secondaryBtn} onClick={handleExport}>
            <FileDown size={16} />
            Xuất dữ liệu
          </button>
          <button className={styles.primaryBtn} onClick={() => onOpenModal('add')}>
            <Plus size={16} />
            Thêm địa bàn
          </button>
          <div className={styles.importDropdown}>
            <button
              className={styles.secondaryBtn}
              onClick={() => setIsImportDropdownOpen(!isImportDropdownOpen)}
            >
              <Upload size={16} />
              Nhập dữ liệu
            </button>
            {isImportDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <label className={styles.dropdownItem} htmlFor="importExcel">
                  <Upload size={16} />
                  Từ file Excel
                </label>
                <input
                  type="file"
                  id="importExcel"
                  className={styles.hiddenInput}
                  accept=".xlsx, .xls"
                  onChange={handleImportExcel}
                />
                <button className={styles.dropdownItem} onClick={handleDownloadTemplate}>
                  <Download size={16} />
                  Tải mẫu nhập liệu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <MapPin size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Tổng địa bàn</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Building2 size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.withProvince}</div>
            <div className={styles.statLabel}>Cấp Tỉnh/TP</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Building2 size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.withWard}</div>
            <div className={styles.statLabel}>Cấp Xã/Phường</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Check size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statLabel}>Đang hoạt động</div>
          </div>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className={styles.filterActionBar}>
        <div className={styles.filterGroup}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã hoặc người phụ trách..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className={styles.select}
            value={levelFilter}
            onChange={(e) => {
              const newLevel = e.target.value;
              setLevelFilter(newLevel);
              setCurrentPage(1);
              // Reset province and ward when level changes
              setSelectedProvince('');
              setSelectedWard('');
            }}
          >
            <option value="all">Tất cả cấp</option>
            <option value="PROVINCE">Cấp Tỉnh</option>
            <option value="WARD">Cấp Xã</option>
          </select>

          {/* 🎯 Show Province select when level is "PROVINCE" or "WARD" */}
          {(levelFilter === 'PROVINCE' || levelFilter === 'WARD') && (
            <select
              className={styles.select}
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedWard(''); // Reset ward when province changes
                setCurrentPage(1);
              }}
            >
              <option value="">Chọn Tỉnh/TP</option>
              {provinces.map(province => (
                <option key={province.id} value={province.id}>{province.name}</option>
              ))}
            </select>
          )}

          {/* 🎯 Show Ward select ONLY when level is "WARD" AND province is selected */}
          {levelFilter === 'WARD' && selectedProvince && (
            <select
              className={styles.select}
              value={selectedWard}
              onChange={(e) => {
                setSelectedWard(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Chọn Phường/Xã</option>
              {filteredWards.map(ward => (
                <option key={ward.id} value={ward.id}>{ward.name}</option>
              ))}
            </select>
          )}

          <select
            className={styles.select}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        <div className={styles.actionGroup}>
          <button className={styles.secondaryBtn} title="Bộ lọc nâng cao">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.emptyState}>
            <RefreshCw size={64} className={`${styles.emptyIcon} ${styles.spinning}`} />
            <h3 className={styles.emptyTitle}>Đang tải dữ liệu...</h3>
          </div>
        ) : paginatedTerritories.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên địa bàn</th>
                  <th>Cấp</th>
                  <th>Tỉnh/TP</th>
                  <th>Xã/Phường</th>
                  <th>Người phụ trách</th>
                  <th className={styles.alignCenter}>Số người dùng</th>
                  <th className={styles.alignCenter}>Trng thái</th>
                  <th className={styles.alignRight}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTerritories.map((territory) => (
                  <tr key={territory.id}>
                    <td>
                      <span className={styles.codeCell}>{territory.code}</span>
                    </td>
                    <td>
                      <span className={styles.nameCell}>{territory.name}</span>
                    </td>
                    <td>
                      <span className={`${styles.levelBadge} ${getLevelBadgeClass(territory)}`}>
                        {getLevelLabel(territory)}
                      </span>
                    </td>
                    <td>
                      {territory.provinceName ? (
                        <span className={styles.provinceCell}>{territory.provinceName}</span>
                      ) : (
                        <span className={styles.emptyCell}>—</span>
                      )}
                    </td>
                    <td>
                      {territory.wardName ? (
                        <span className={styles.provinceCell}>{territory.wardName}</span>
                      ) : (
                        <span className={styles.emptyCell}>—</span>
                      )}
                    </td>
                    <td>
                      {territory.managerName ? (
                        <div className={styles.managerCell}>
                          <User size={14} className={styles.managerIcon} />
                          <span>{territory.managerName}</span>
                        </div>
                      ) : (
                        <span className={styles.emptyCell}>Chưa phân công</span>
                      )}
                    </td>
                    <td className={styles.alignCenter}>
                      <span style={{ fontWeight: 500 }}>{territory.userCount || 0}</span>
                    </td>
                    <td className={styles.alignCenter}>
                      {territory.status === 1 ? (
                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                          <Check size={12} />
                          Hoạt động
                        </span>
                      ) : (
                        <span className={`${styles.statusBadge} ${styles.statusInactive}`}>
                          <XCircle size={12} />
                          Không hoạt động
                        </span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.iconBtn}
                          title="Xem chi tiết"
                          onClick={() => onOpenModal('view', territory)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={styles.iconBtn}
                          title="Chỉnh sửa"
                          onClick={() => onOpenModal('edit', territory)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className={styles.iconBtn}
                          title="Xóa"
                          onClick={() => onOpenModal('delete', territory)}
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
        ) : (
          <div className={styles.emptyState}>
            <MapPin size={64} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>Không tìm thấy địa bàn nào</h3>
            <p className={styles.emptyDesc}>
              {searchTerm || levelFilter !== 'all' || statusFilter !== 'all'
                ? 'Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác'
                : 'Bắt đầu bằng cách thêm địa bàn đầu tiên'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredTerritories.length > 0 && !loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTerritories.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

// Export as TerritoryTab to replace the old one
export default TerritoryTabNew;
