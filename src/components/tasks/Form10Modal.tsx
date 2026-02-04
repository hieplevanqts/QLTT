import React, { useState } from 'react';
import { FileText, Upload, Eye, X, Download, Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import type { InspectionTask } from '@/utils/data/inspection-tasks-mock-data';
import { generateForm10Document } from '@/utils/docx-generator';
import styles from './Form10Modal.module.css';

interface Form10ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: InspectionTask | null;
}

interface InventoryItem {
  id: string;
  name: string; // Tên tang vật/phương tiện/giấy tờ
  specifications: string; // Chủng loại, nhãn hiệu, xuất xứ, số đăng ký
  unit: string; // Đơn vị tính
  quantity: string; // Số lượng
  condition: string; // Tình trạng, đặc điểm
}

export function Form10Modal({ open, onOpenChange, task }: Form10ModalProps) {
  if (!open || !task) return null;

  const [formNumber, setFormNumber] = useState(`${task.code}/BK`);
  const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString('vi-VN'));
  const [issuePlace, setIssuePlace] = useState('TP. Hồ Chí Minh');
  const [relatedForm06, setRelatedForm06] = useState(`${task.code}/BB-KT`);
  const [organization, setOrganization] = useState('Sở Công Thương TP. Hà Nội');
  const [teamLeader, setTeamLeader] = useState(task.assignee.name);
  const [facilityName, setFacilityName] = useState(task.targetName);
  const [facilityAddress, setFacilityAddress] = useState(task.targetAddress);
  
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Mẫu sản phẩm vi phạm nhãn hàng hóa',
      specifications: 'Chủng loại: A, Nhãn hiệu: BrandX, Xuất xứ: Việt Nam, Số đăng ký: 123456',
      unit: 'Hộp',
      quantity: '10',
      condition: 'Còn nguyên vẹn, đóng gói kín',
    },
    {
      id: '2',
      name: 'Hóa đơn bán hàng số 0001234',
      specifications: 'Ngày 10/01/2026',
      unit: 'Bản',
      quantity: '1',
      condition: 'Bản gốc',
    },
  ]);

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for editing/adding
  const [itemName, setItemName] = useState('');
  const [itemSpecifications, setItemSpecifications] = useState('');
  const [itemUnit, setItemUnit] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemCondition, setItemCondition] = useState('');

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingItem(null);
    setItemName('');
    setItemSpecifications('');
    setItemUnit('');
    setItemQuantity('');
    setItemCondition('');
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setItemName(item.name);
    setItemSpecifications(item.specifications);
    setItemUnit(item.unit);
    setItemQuantity(item.quantity);
    setItemCondition(item.condition);
  };

  const handleSaveItem = () => {
    if (!itemName.trim() || !itemQuantity.trim() || !itemUnit.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (editingItem) {
      // Update existing item
      setItems(items.map(item => 
        item.id === editingItem.id
          ? { ...item, name: itemName, specifications: itemSpecifications, unit: itemUnit, quantity: itemQuantity, condition: itemCondition }
          : item
      ));
      toast.success('Đã cập nhật dòng');
    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: itemName,
        specifications: itemSpecifications,
        unit: itemUnit,
        quantity: itemQuantity,
        condition: itemCondition,
      };
      setItems([...items, newItem]);
      toast.success('Đã thêm dòng mới');
    }

    // Reset form
    setIsAddingNew(false);
    setEditingItem(null);
    setItemName('');
    setItemSpecifications('');
    setItemUnit('');
    setItemQuantity('');
    setItemCondition('');
  };

  const handleCancelEdit = () => {
    setIsAddingNew(false);
    setEditingItem(null);
    setItemName('');
    setItemSpecifications('');
    setItemUnit('');
    setItemQuantity('');
    setItemCondition('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Đã xóa dòng');
  };

  const handlePreview = () => {
    if (!facilityName.trim() || items.length === 0) {
      toast.error('Vui lòng điền thông tin cơ sở và thêm ít nhất 1 dòng bảng kê');
      return;
    }
    setShowPreview(true);
  };

  const handleDownload = async () => {
    if (!facilityName.trim() || items.length === 0) {
      toast.error('Vui lòng điền thông tin cơ sở và thêm ít nhất 1 dòng bảng kê');
      return;
    }

    try {
      await generateForm10Document({
        formNumber,
        issueDate,
        issuePlace,
        relatedForm06,
        organization,
        teamLeader,
        facilityName,
        facilityAddress,
        items: items.map((item, index) => ({
          stt: (index + 1).toString(),
          name: item.name,
          specifications: item.specifications,
          unit: item.unit,
          quantity: item.quantity,
          condition: item.condition,
        })),
      });
      
      toast.success('Đã tải xuống bảng kê');
    } catch (error) {
      toast.error('Không thể tải xuống bảng kê');
      console.error('Error generating DOCX:', error);
    }
  };

  const handleSubmitToINS = async () => {
    if (!facilityName.trim() || items.length === 0) {
      toast.error('Vui lòng điền thông tin cơ sở và thêm ít nhất 1 dòng bảng kê');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Đã đẩy bảng kê lên hệ thống INS thành công');
      onOpenChange(false);
    }, 1500);
  };

  const getTypeLabel = (name: string) => {
    if (name.includes('Hóa đơn')) return 'Giấy tờ';
    if (name.includes('Mẫu sản phẩm')) return 'Tang vật';
    return 'Khác';
  };

  // Preview mode
  if (showPreview) {
    return (
      <div className={styles.overlay} onClick={() => setShowPreview(false)}>
        <div className={styles.previewModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.previewHeader}>
            <div className={styles.previewHeaderContent}>
              <FileText size={24} />
              <div>
                <h2 className={styles.previewTitle}>Xem trước - Bảng kê</h2>
                <p className={styles.previewSubtitle}>Mẫu số 10</p>
              </div>
            </div>
            <button onClick={() => setShowPreview(false)} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.previewContent}>
            <div className={styles.docPreview}>
              {/* Header */}
              <div className={styles.docHeader}>
                <div className={styles.docHeaderLeft}>
                  <p className={styles.docHeaderTitle}>{organization}</p>
                  <p className={styles.docHeaderUnderline}>_______________</p>
                  <p className={styles.docHeaderNumber}>Số: {formNumber}</p>
                </div>
                <div className={styles.docHeaderRight}>
                  <p className={styles.docHeaderTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                  <p className={styles.docHeaderSubtitle}>Độc lập - Tự do - Hạnh phúc</p>
                  <p className={styles.docHeaderUnderline}>_______________</p>
                  <p className={styles.docHeaderDate}>{issuePlace}, {issueDate}</p>
                </div>
              </div>

              {/* Title */}
              <h1 className={styles.docTitle}>BẢNG KÊ</h1>
              <p className={styles.docSubtitle}>Tang vật, phương tiện, hàng hóa, giấy tờ</p>
              <p className={styles.docSubtitle}>(Kèm theo Biên bản kiểm tra số: {relatedForm06})</p>

              {/* Content */}
              <div className={styles.docContent}>
                {/* Table */}
                <table className={styles.previewTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>STT</th>
                      <th style={{ width: '200px' }}>Tên tang vật/ phương tiện/giấy tờ</th>
                      <th>Chủng loại, nhãn hiệu, xuất xứ, số đăng ký của tang vật/ phương tiện/giấy tờ</th>
                      <th style={{ width: '80px' }}>Đơn vị tính</th>
                      <th style={{ width: '80px' }}>Số lượng</th>
                      <th style={{ width: '150px' }}>Tình trạng, đặc điểm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.specifications}</td>
                        <td style={{ textAlign: 'center' }}>{item.unit}</td>
                        <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                        <td>{item.condition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <p className={styles.docNote}>(NGỊ KÝ TÊN CỦA CÁC BÊN LIÊN QUAN)</p>
              </div>

              {/* Signature */}
              <div className={styles.docFooter}>
                <div className={styles.docFooterLeft}>
                  <p className={styles.docFooterTitle}>NGƯỜI LẬT BẢNG</p>
                  <p className={styles.docFooterSubtitle}>(Ký và ghi rõ họ tên)</p>
                  <p className={styles.docFooterName}>{teamLeader}</p>
                </div>
                <div className={styles.docFooterRight}>
                  <p className={styles.docFooterTitle}>TRƯỞNG ĐOÀN KIỂM TRA</p>
                  <p className={styles.docFooterSubtitle}>(Ký và ghi rõ họ tên)</p>
                  <p className={styles.docFooterName}>{teamLeader}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.previewFooter}>
            <button onClick={() => setShowPreview(false)} className={styles.cancelButton}>
              Đóng
            </button>
            <button onClick={handleDownload} className={styles.downloadButton}>
              <Download size={16} />
              Tải về
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <FileText size={24} className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>Mẫu số 10. Bảng kê (BK)</h2>
              <p className={styles.subtitle}>Lập bảng kê tang vật, phương tiện, hàng hóa, giấy tờ liên quan</p>
            </div>
          </div>
          <button onClick={handleClose} className={styles.closeButton} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Section 1: Header Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin đầu trang</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Số bảng kê <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  placeholder="VD: NV-2025/001/BK"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Ngày lập</label>
                <input
                  type="text"
                  className={styles.input}
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  placeholder="VD: 15/01/2025"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Địa danh</label>
                <input
                  type="text"
                  className={styles.input}
                  value={issuePlace}
                  onChange={(e) => setIssuePlace(e.target.value)}
                  placeholder="VD: TP. Hồ Chí Minh"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Cơ quan</label>
                <input
                  type="text"
                  className={styles.input}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="VD: Sở Công Thương TP. Hà Nội"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Số Biên bản kiểm tra liên quan (Mẫu 06)
              </label>
              <input
                type="text"
                className={styles.input}
                value={relatedForm06}
                onChange={(e) => setRelatedForm06(e.target.value)}
                placeholder="VD: NV-2025/001/BB-KT"
              />
            </div>
          </div>

          {/* Section 2: Facility Info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin cơ sở</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tên cơ sở <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="Tên cơ sở kiểm tra"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Địa chỉ</label>
              <input
                type="text"
                className={styles.input}
                value={facilityAddress}
                onChange={(e) => setFacilityAddress(e.target.value)}
                placeholder="Địa chỉ cơ sở"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Trưởng đoàn kiểm tra <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={teamLeader}
                onChange={(e) => setTeamLeader(e.target.value)}
                placeholder="Họ và tên trưởng đoàn"
              />
            </div>
          </div>

          {/* Section 3: Inventory Items */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Bảng kê chi tiết</h3>
              <button 
                type="button" 
                onClick={handleAddNew} 
                className={styles.addButton}
                disabled={isAddingNew || editingItem !== null}
              >
                <Plus size={16} />
                Thêm dòng
              </button>
            </div>

            {/* Add/Edit Form */}
            {(isAddingNew || editingItem) && (
              <div className={styles.editForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Tên/Mô tả <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="Tên hoặc mô tả chi tiết"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Chủng loại, nhãn hiệu, xuất xứ, số đăng ký <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={itemSpecifications}
                      onChange={(e) => setItemSpecifications(e.target.value)}
                      placeholder="VD: Chủng loại: A, Nhãn hiệu: BrandX, Xuất xứ: Việt Nam, Số đăng ký: 123456"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Số lượng <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(e.target.value)}
                      placeholder="VD: 10"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Đơn vị <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={itemUnit}
                      onChange={(e) => setItemUnit(e.target.value)}
                      placeholder="VD: Hộp, Cái, Bản"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Tình trạng</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={itemCondition}
                    onChange={(e) => setItemCondition(e.target.value)}
                    placeholder="Mô tả tình trạng hiện tại"
                  />
                </div>

                <div className={styles.editFormActions}>
                  <button type="button" onClick={handleCancelEdit} className={styles.cancelButton}>
                    Hủy
                  </button>
                  <button type="button" onClick={handleSaveItem} className={styles.saveButton}>
                    {editingItem ? 'Cập nhật' : 'Lưu'}
                  </button>
                </div>
              </div>
            )}

            {/* Items Table */}
            {items.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>STT</th>
                      <th style={{ width: '100px' }}>Loại</th>
                      <th>Tên/Mô tả</th>
                      <th style={{ width: '80px' }}>Số lượng</th>
                      <th style={{ width: '80px' }}>Đơn vị</th>
                      <th>Tình trạng</th>
                      <th>Ghi chú</th>
                      <th style={{ width: '100px' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td>{getTypeLabel(item.name)}</td>
                        <td>{item.name}</td>
                        <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                        <td>{item.unit}</td>
                        <td>{item.condition || '-'}</td>
                        <td>{item.specifications || '-'}</td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className={styles.editButton}
                              disabled={isAddingNew || editingItem !== null}
                              title="Sửa"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className={styles.deleteButton}
                              disabled={isAddingNew || editingItem !== null}
                              title="Xóa"
                            >
                              <Trash2 size={14} />
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
                <FileText size={48} className={styles.emptyIcon} />
                <p className={styles.emptyText}>Chưa có dòng nào trong bảng kê</p>
                <p className={styles.emptySubtext}>Nhấn nút "Thêm dòng" để bắt đầu</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button type="button" onClick={handleClose} className={styles.cancelButton}>
            Hủy
          </button>
          <button type="button" onClick={handlePreview} className={styles.previewButton}>
            <Eye size={16} />
            Xem trước
          </button>
          <button type="button" onClick={handleDownload} className={styles.downloadButton}>
            <Download size={16} />
            Tải về
          </button>
          <button
            type="button"
            onClick={handleSubmitToINS}
            disabled={isSubmitting || !facilityName.trim() || items.length === 0}
            className={styles.submitButton}
          >
            <Upload size={16} />
            {isSubmitting ? 'Đang gửi...' : 'Đẩy sang INS'}
          </button>
        </div>
      </div>
    </div>
  );
}
