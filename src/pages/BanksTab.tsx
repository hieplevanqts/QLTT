/**
 * Banks Tab - MAPPA Portal
 * Quản lý Ngân hàng (Banks) với CRUD operations
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
  CheckCircle,
  XCircle,
} from 'lucide-react';
import styles from './CategoriesTab.module.css'; // Reuse styles
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Pagination, usePagination } from '../components/Pagination';
import { BankModal } from '../components/BankModal';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';
import * as XLSX from 'xlsx';

interface Bank {
  id: string;
  code: string;
  name: string;
  short_name: string;
  bin: string;
  logo_url: string;
  is_active: boolean;
  created_at: string;
}

export const BanksTab: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  // Pagination
  const itemsPerPage = 10;
  const pagination = usePagination(filteredBanks, itemsPerPage);
  const { currentPage, setCurrentPage, totalPages, currentItems } = pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch banks from database
  const fetchBanks = async () => {
    try {
      setLoading(true);
      console.log('🏦 Fetching banks from database...');

      const { data, error } = await supabase
        .from('banks')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching banks:', error);
        toast.error(`Lỗi tải dữ liệu: ${error.message}`);
        return;
      }

      console.log(`✅ Loaded ${data?.length || 0} banks`);
      setBanks(data || []);
      setFilteredBanks(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Lỗi kết nối cơ sở dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  // Filter banks
  useEffect(() => {
    let filtered = [...banks];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (bank) =>
          bank.name.toLowerCase().includes(term) ||
          bank.short_name.toLowerCase().includes(term) ||
          bank.code.toLowerCase().includes(term) ||
          bank.bin.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((bank) =>
        statusFilter === 'active' ? bank.is_active : !bank.is_active
      );
    }

    setFilteredBanks(filtered);
  }, [searchTerm, statusFilter, banks]);

  // Modal handlers
  const handleOpenModal = (mode: 'add' | 'edit' | 'view', bank?: Bank) => {
    setModalMode(mode);
    setSelectedBank(bank || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBank(null);
  };

  const handleSaveBank = async () => {
    await fetchBanks();
    handleCloseModal();
  };

  // Delete bank
  const handleDeleteBank = async (bank: Bank) => {
    if (!confirm(`Bạn có chắc muốn xóa ngân hàng "${bank.name}"?`)) {
      return;
    }

    try {
      console.log('🗑️ Deleting bank:', bank.id);

      const { error } = await supabase
        .from('banks')
        .delete()
        .eq('id', bank.id);

      if (error) {
        console.error('❌ Error deleting bank:', error);
        toast.error(`Lỗi xóa ngân hàng: ${error.message}`);
        return;
      }

      console.log('✅ Bank deleted');
      toast.success('Đã xóa ngân hàng thành công');
      await fetchBanks();
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Lỗi khi xóa ngân hàng');
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const exportData = filteredBanks.map((bank, index) => ({
        'STT': index + 1,
        'Mã ngân hàng': bank.code,
        'Tên ngân hàng': bank.name,
        'Tên viết tắt': bank.short_name,
        'BIN': bank.bin,
        'Trạng thái': bank.is_active ? 'Hoạt động' : 'Không hoạt động',
        'Ngày tạo': new Date(bank.created_at).toLocaleDateString('vi-VN'),
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Ngân hàng');

      // Auto-size columns
      const wscols = [
        { wch: 5 },  // STT
        { wch: 15 }, // Mã
        { wch: 40 }, // Tên
        { wch: 20 }, // Tên viết tắt
        { wch: 15 }, // BIN
        { wch: 15 }, // Trạng thái
        { wch: 12 }, // Ngày tạo
      ];
      ws['!cols'] = wscols;

      XLSX.writeFile(wb, `Ngan_hang_${new Date().toISOString().split('T')[0]}.xlsx`);
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
              placeholder="Tìm kiếm theo tên, mã, BIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className={styles.searchInput}
            style={{ width: '180px', minWidth: 'unset' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>

          {/* Actions */}
          <div className={styles.actionsGroup}>
            <button onClick={fetchBanks} className={styles.btnSecondary}>
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
      {filteredBanks.length === 0 ? (
        <div className={styles.emptyState}>
          <AlertCircle size={48} style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }} />
          <p>Không tìm thấy ngân hàng nào</p>
        </div>
      ) : (
        <>
          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>STT</th>
                    <th style={{ width: '70px' }}>Logo</th>
                    <th style={{ width: '100px' }}>Mã NH</th>
                    <th>Tên ngân hàng</th>
                    <th style={{ width: '160px' }}>Tên viết tắt</th>
                    <th style={{ width: '100px' }}>BIN</th>
                    <th style={{ width: '130px' }}>Trạng thái</th>
                    <th style={{ width: '140px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((bank, index) => (
                    <tr key={bank.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'var(--muted)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {bank.logo_url ? (
                            <ImageWithFallback
                              src={bank.logo_url}
                              alt={bank.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          ) : (
                            <Building2 size={20} style={{ color: 'var(--muted-foreground)' }} />
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={styles.iconBadge}>{bank.code}</span>
                      </td>
                      <td>
                        <div className={styles.nameCell}>
                          <span className={styles.nameText}>{bank.name}</span>
                        </div>
                      </td>
                      <td>{bank.short_name}</td>
                      <td>
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, Courier New, monospace',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--muted-foreground)',
                          }}
                        >
                          {bank.bin}
                        </span>
                      </td>
                      <td>
                        {bank.is_active ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: '#16a34a',
                              backgroundColor: '#dcfce7',
                            }}
                          >
                            <CheckCircle size={14} />
                            Hoạt động
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: '#dc2626',
                              backgroundColor: '#fee2e2',
                            }}
                          >
                            <XCircle size={14} />
                            Ngừng hoạt động
                          </span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleOpenModal('view', bank)}
                            className={styles.btnIcon}
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenModal('edit', bank)}
                            className={styles.btnIcon}
                            title="Chỉnh sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteBank(bank)}
                            className={styles.btnIcon}
                            style={{ color: 'var(--destructive)' }}
                            title="Xóa"
                          >
                            <Trash2 size={16} />
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
            totalItems={filteredBanks.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Modal */}
      {showModal && (
        <BankModal
          mode={modalMode}
          bank={selectedBank}
          onClose={handleCloseModal}
          onSave={handleSaveBank}
        />
      )}
    </div>
  );
};

export default BanksTab;