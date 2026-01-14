import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Users, MapPin, Calendar, FileText, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import styles from './InspectionRoundCreate.module.css';
import DateRangePicker, { DateRange } from '../../../ui-kit/DateRangePicker';
import { mockPlans } from '../../data/kehoach-mock-data';
import { FormDocumentChecklist } from '../../components/documents/FormDocumentChecklist';
import { SelectFromInsModal, type InsDocument } from '../../components/documents/SelectFromInsModal';
import { DocumentFormModal } from '../../components/documents/DocumentFormModal';
import { InsSyncLogDrawer } from '../../components/documents/InsSyncLogDrawer';
import { useDocumentChecklist } from '../../../hooks/useDocumentChecklist';
import type { DocumentCode } from '../../../types/ins-documents';

interface TeamMember {
  id: string;
  name: string;
  role: 'leader' | 'member' | 'expert';
}

export default function InspectionRoundCreate() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    planId: '',
    type: 'scheduled' as 'scheduled' | 'unannounced' | 'followup' | 'complaint',
    leadUnit: '',
    scopeArea: '',
    totalTargets: '',
    objectives: '',
    notes: '',
  });

  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState({ name: '', role: 'member' as 'leader' | 'member' | 'expert' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Document checklist state  
  const [hasM01Imported, setHasM01Imported] = useState(false);
  const [showSelectInsModal, setShowSelectInsModal] = useState(false);
  const [showSyncLogDrawer, setShowSyncLogDrawer] = useState(false);
  const [selectedDocumentCode, setSelectedDocumentCode] = useState<DocumentCode>('M01');

  // Get document checklist for round creation
  const { documents, validation } = useDocumentChecklist('round_create', {
    hasM01: hasM01Imported,
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    // Clear date errors
    if (errors.dateRange) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dateRange;
        return newErrors;
      });
    }
  };

  const handleAddTeamMember = () => {
    if (!newMember.name.trim()) {
      toast.error('Vui lòng nhập tên thành viên');
      return;
    }

    // Check if leader already exists
    if (newMember.role === 'leader' && teamMembers.some(m => m.role === 'leader')) {
      toast.error('Đã có trưởng đoàn. Vui lòng chọn vai trò khác.');
      return;
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      role: newMember.role,
    };

    setTeamMembers(prev => [...prev, member]);
    setNewMember({ name: '', role: 'member' });
    toast.success(`Đã thêm ${getRoleLabel(member.role)}: ${member.name}`);
  };

  const handleRemoveTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    toast.info('Đã xóa thành viên khỏi đội kiểm tra');
  };

  const getRoleLabel = (role: 'leader' | 'member' | 'expert'): string => {
    switch (role) {
      case 'leader': return 'Trưởng đoàn';
      case 'member': return 'Thành viên';
      case 'expert': return 'Chuyên gia';
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'scheduled': return 'Theo kế hoạch';
      case 'unannounced': return 'Đột xuất';
      case 'followup': return 'Tái kiểm tra';
      case 'complaint': return 'Theo khiếu nại';
      default: return type;
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên đợt kiểm tra';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Vui lòng nhập mã đợt kiểm tra';
    }

    if (formData.type === 'scheduled' && !formData.planId) {
      newErrors.planId = 'Vui lòng chọn kế hoạch liên quan';
    }

    if (!formData.leadUnit.trim()) {
      newErrors.leadUnit = 'Vui lòng nhập đơn vị chủ trì';
    }

    if (!formData.scopeArea.trim()) {
      newErrors.scopeArea = 'Vui lòng nhập phạm vi kiểm tra';
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      newErrors.dateRange = 'Vui lòng chọn thời gian thực hiện';
    }

    if (!formData.totalTargets || parseInt(formData.totalTargets) <= 0) {
      newErrors.totalTargets = 'Vui lòng nhập số lượng cơ sở cần kiểm tra';
    }

    if (teamMembers.length === 0) {
      newErrors.team = 'Vui lòng thêm ít nhất 1 thành viên vào đội kiểm tra';
    }

    if (!teamMembers.some(m => m.role === 'leader')) {
      newErrors.team = 'Đội kiểm tra phải có trưởng đoàn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    // Validate form
    if (!formData.code.trim()) {
      alert('Vui lòng nhập mã đợt kiểm tra');
      return;
    }
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên đợt kiểm tra');
      return;
    }
    // ... other validations

    toast.success('Đã tạo đợt kiểm tra thành công');
    navigate('/plans/inspection-rounds');
  };

  const handleSaveDraft = () => {
    toast.success('Đã lưu nháp đợt kiểm tra');
    navigate('/plans/inspection-rounds');
  };

  const approvedPlans = mockPlans.filter(p => p.status === 'approved' || p.status === 'active');

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/plans/inspection-rounds')}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Tạo đợt kiểm tra mới</h1>
          <p className={styles.subtitle}>
            Lập đợt kiểm tra theo kế hoạch hoặc đột xuất với đội kiểm tra chuyên nghiệp
          </p>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <form className={styles.form}>
            {/* Single Card Container - Gom tất cả vào 1 */}
            <div className={styles.section}>
              <div className={styles.formGrid}>
                {/* Tên đợt kiểm tra */}
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>
                    Tên đợt kiểm tra <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Ví dụ: Kiểm tra cơ sở kinh doanh thực phẩm Quận 1"
                  />
                  {errors.name && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                {/* Mã đợt kiểm tra */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Mã đợt kiểm tra <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} ${errors.code ? styles.inputError : ''}`}
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    placeholder="Ví dụ: DKT-2026-01-001"
                  />
                  {errors.code && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      <span>{errors.code}</span>
                    </div>
                  )}
                </div>

                {/* Loại kiểm tra */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Loại kiểm tra <span className={styles.required}>*</span>
                  </label>
                  <select
                    className={styles.select}
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                  >
                    <option value="scheduled">Theo kế hoạch</option>
                    <option value="unannounced">Đột xuất</option>
                    <option value="followup">Tái kiểm tra</option>
                    <option value="complaint">Theo khiếu nại</option>
                  </select>
                </div>

                {/* Kế hoạch liên quan */}
                {formData.type === 'scheduled' && (
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>
                      Kế hoạch liên quan <span className={styles.required}>*</span>
                    </label>
                    <select
                      className={`${styles.select} ${errors.planId ? styles.inputError : ''}`}
                      value={formData.planId}
                      onChange={(e) => handleChange('planId', e.target.value)}
                    >
                      <option value="">Chọn kế hoạch</option>
                      {approvedPlans.map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.id} - {plan.name}
                        </option>
                      ))}
                    </select>
                    {errors.planId && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        <span>{errors.planId}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Thời gian thực hiện */}
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>
                    Thời gian thực hiện <span className={styles.required}>*</span>
                  </label>
                  <DateRangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  />
                  {errors.dateRange && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      <span>{errors.dateRange}</span>
                    </div>
                  )}
                </div>

                {/* Đơn vị chủ trì */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Đơn vị chủ trì <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} ${errors.leadUnit ? styles.inputError : ''}`}
                    value={formData.leadUnit}
                    onChange={(e) => handleChange('leadUnit', e.target.value)}
                    placeholder="Ví dụ: Chi cục ATVSTP TP.HCM"
                  />
                  {errors.leadUnit && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      <span>{errors.leadUnit}</span>
                    </div>
                  )}
                </div>

                {/* Phạm vi kiểm tra */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Phạm vi kiểm tra <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} ${errors.scopeArea ? styles.inputError : ''}`}
                    value={formData.scopeArea}
                    onChange={(e) => handleChange('scopeArea', e.target.value)}
                    placeholder="Ví dụ: Quận 1, TP. Hồ Chí Minh"
                  />
                  {errors.scopeArea && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      <span>{errors.scopeArea}</span>
                    </div>
                  )}
                </div>

                {/* Số lượng cơ sở */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Số lượng cơ sở cần kiểm tra <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={`${styles.input} ${errors.totalTargets ? styles.inputError : ''}`}
                    value={formData.totalTargets}
                    onChange={(e) => handleChange('totalTargets', e.target.value)}
                    placeholder="Nhập số lượng"
                  />
                  {errors.totalTargets && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      <span>{errors.totalTargets}</span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className={styles.formGroupFull}>
                  <div className={styles.sectionDivider}>
                    <Users size={18} className={styles.dividerIcon} />
                    <span className={styles.dividerText}>Đội kiểm tra</span>
                    <span className={styles.required}>*</span>
                  </div>
                </div>

                {/* Add Team Member Form */}
                <div className={styles.formGroupFull}>
                  <div className={styles.teamAddForm}>
                    <input
                      type="text"
                      className={styles.teamInput}
                      value={newMember.name}
                      onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nhập tên thành viên"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTeamMember();
                        }
                      }}
                    />
                    <select
                      className={styles.teamRoleSelect}
                      value={newMember.role}
                      onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value as any }))}
                    >
                      <option value="leader">Trưởng đoàn</option>
                      <option value="member">Thành viên</option>
                      <option value="expert">Chuyên gia</option>
                    </select>
                    <button
                      type="button"
                      className={styles.addButton}
                      onClick={handleAddTeamMember}
                    >
                      <Plus size={18} />
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Team Members List */}
                {teamMembers.length > 0 && (
                  <div className={styles.formGroupFull}>
                    <div className={styles.teamList}>
                      {teamMembers.map(member => (
                        <div key={member.id} className={styles.teamMemberCard}>
                          <div className={styles.teamMemberInfo}>
                            <div className={styles.teamMemberName}>{member.name}</div>
                            <div className={styles.teamMemberRole}>
                              <span className={`${styles.roleBadge} ${styles[`role${member.role}`]}`}>
                                {getRoleLabel(member.role)}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => handleRemoveTeamMember(member.id)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {teamMembers.length === 0 && (
                  <div className={styles.formGroupFull}>
                    <div className={styles.emptyTeam}>
                      <Users size={32} className={styles.emptyIcon} />
                      <p className={styles.emptyText}>Chưa có thành viên nào trong đội kiểm tra</p>
                    </div>
                  </div>
                )}

                {errors.team && (
                  <div className={styles.formGroupFull}>
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      <span>{errors.team}</span>
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className={styles.formGroupFull}>
                  <div className={styles.sectionDivider}>
                    <MapPin size={18} className={styles.dividerIcon} />
                    <span className={styles.dividerText}>Mục tiêu và ghi chú</span>
                  </div>
                </div>

                {/* Mục tiêu kiểm tra */}
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Mục tiêu kiểm tra</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.objectives}
                    onChange={(e) => handleChange('objectives', e.target.value)}
                    placeholder="Nhập các mục tiêu cụ thể của đợt kiểm tra"
                    rows={4}
                  />
                </div>

                {/* Ghi chú */}
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Ghi chú</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Nhập các ghi chú bổ sung"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Summary Info */}
            <div className={styles.summaryBox}>
              <h3 className={styles.summaryTitle}>Tóm tắt thông tin</h3>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Loại kiểm tra:</span>
                  <span className={styles.summaryValue}>{getTypeLabel(formData.type)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Đội kiểm tra:</span>
                  <span className={styles.summaryValue}>{teamMembers.length} thành viên</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Thời gian:</span>
                  <span className={styles.summaryValue}>
                    {dateRange.startDate && dateRange.endDate
                      ? `${new Date(dateRange.startDate).toLocaleDateString('vi-VN')} - ${new Date(dateRange.endDate).toLocaleDateString('vi-VN')}`
                      : 'Chưa chọn'}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Số cơ sở:</span>
                  <span className={styles.summaryValue}>
                    {formData.totalTargets || '0'} cơ sở
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={styles.footer}>
        <button className={styles.cancelButton} onClick={() => navigate('/plans/inspection-rounds')}>
          Hủy
        </button>
        <div className={styles.footerActions}>
          <button className={styles.draftButton} onClick={handleSaveDraft}>
            Lưu nháp
          </button>
          <button className={styles.submitButton} onClick={handleSave}>
            Tạo đợt kiểm tra
          </button>
        </div>
      </div>
    </div>
  );
}