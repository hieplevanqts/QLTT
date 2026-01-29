/**
 * MAPPA Portal - Assign Lead Modal Component
 * Center modal for assigning leads with merchant selection
 */

import { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Calendar,
  FileText,
  Send,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';
import DatePicker from '@/components/DatePicker';
import styles from './AssignLeadModal.module.css';
import type { Lead } from '@/utils/data/lead-risk/types';
import { getSupabaseClient } from '@/utils/supabaseClient';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Merchant {
  id: string;
  business_name: string;
}

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onAssign: (data: {
    merchantId: string;
    deadline: string;
    description: string;
  }) => void;
}

export default function AssignLeadModal({
  isOpen,
  onClose,
  lead,
  onAssign,
}: AssignLeadModalProps) {
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  // Reset form when closed
  const handleClose = () => {
    setSelectedMerchantId('');
    setDeadline('');
    setDescription('');
    onClose();
  };

  // Handle submit
  const handleSubmit = () => {
    if (!selectedMerchantId) {
      toast.error('Vui lòng chọn người xử lý');
      return;
    }

    if (!deadline) {
      toast.error('Vui lòng chọn hạn xử lý');
      return;
    }

    if (!lead) {
      toast.error('Không tìm thấy thông tin nguồn tin');
      return;
    }

    // Call parent handler
    onAssign({
      merchantId: selectedMerchantId,
      deadline,
      description,
    });

    // Show success toast
    const merchant = merchants.find(i => i.id === selectedMerchantId);
    toast.success(`Đã giao việc cho ${merchant?.business_name}`, {
      description: `Hạn xử lý: ${new Date(deadline).toLocaleDateString('vi-VN')}`,
    });

    // Close modal
    handleClose();
  };

  // Fetch merchants from Supabase
  useEffect(() => {
    const fetchMerchants = async () => {
      const supabase = getSupabaseClient(projectId, publicAnonKey);
      const { data, error } = await supabase
        .from('merchants')
        .select('id, business_name');

      if (error) {
        toast.error('Không thể tải danh sách người xử lý');
        console.error(error);
      } else {
        setMerchants(data || []);
      }
    };

    fetchMerchants();
  }, []);

  if (!isOpen || !lead) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={handleClose} />

      {/* Modal */}
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <UserPlus className={styles.headerIcon} />
            <h2 className={styles.headerTitle}>Giao xử lý cho người khác</h2>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Lead info banner */}
          <div className={styles.leadBanner}>
            <p className={styles.leadCode}>{lead.code}</p>
            <p className={styles.leadTitle}>{lead.title}</p>
          </div>

          {/* Two column layout */}
          <div className={styles.twoColumn}>
            {/* Left column - Merchant selection */}
            <div className={styles.leftColumn}>
              <h3 className={styles.sectionTitle}>
                Chọn người xử lý <span className={styles.required}>*</span>
              </h3>

              {/* Merchant List */}
              <div className={styles.inspectorList}>
                {merchants.length === 0 ? (
                  <div className={styles.emptyState}>
                    <Building2 className={styles.emptyIcon} />
                    <p className={styles.emptyText}>Không có người xử lý nào</p>
                  </div>
                ) : (
                  merchants.map((merchant) => {
                    const isSelected = selectedMerchantId === merchant.id;

                    return (
                      <div
                        key={merchant.id}
                        className={`${styles.inspectorCard} ${isSelected ? styles.selected : ''}`}
                        onClick={() => setSelectedMerchantId(merchant.id)}
                      >
                        <input
                          type="radio"
                          className={styles.inspectorRadio}
                          checked={isSelected}
                          onChange={() => setSelectedMerchantId(merchant.id)}
                        />
                        <div className={styles.inspectorInfo}>
                          <div className={styles.inspectorHeader}>
                            <p className={styles.inspectorName}>{merchant.business_name}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right column - Assignment details */}
            <div className={styles.rightColumn}>
              <h3 className={styles.sectionTitle}>Chi tiết giao việc</h3>

              {/* Deadline */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Calendar size={16} />
                  Hạn xử lý <span className={styles.required}>*</span>
                </label>
                <DatePicker
                  value={deadline}
                  onChange={setDeadline}
                  minDate={new Date().toISOString().split('T')[0]}
                  placeholder="Chọn ngày hết hạn..."
                />
              </div>

              {/* Description */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <FileText size={16} />
                  Mô tả
                </label>
                <textarea
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả chi tiết về công việc..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={`${styles.button} ${styles.buttonCancel}`} onClick={handleClose}>
            Hủy
          </button>
          <button
            className={`${styles.button} ${styles.buttonSubmit}`}
            onClick={handleSubmit}
            disabled={!selectedMerchantId || !deadline}
          >
            <Send size={16} />
            Giao việc
          </button>
        </div>
      </div>
    </>
  );
}
