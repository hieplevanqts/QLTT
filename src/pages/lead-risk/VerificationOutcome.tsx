import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  X,
  XCircle,
  AlertTriangle,
  FileCheck,
  CalendarPlus,
  ListChecks,
  Plus,
  Trash2,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './VerificationOutcome.module.css';

interface OutcomeData {
  leadId: string;
  outcomeType: 'verified' | 'unverified' | 'partial' | 'duplicate';
  closureReason: string;
  findings: string;
  violations: string[];
  actionsTaken: string;
  followUpActions: FollowUpAction[];
  createInspectionPlan: boolean;
  createEnforcementCase: boolean;
  recommendationForRisk: string;
  inspectorNotes: string;
}

interface FollowUpAction {
  id: string;
  action: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export default function VerificationOutcome() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OutcomeData>({
    leadId: id || 'L-2024-1234',
    outcomeType: 'verified',
    closureReason: '',
    findings: '',
    violations: [],
    actionsTaken: '',
    followUpActions: [],
    createInspectionPlan: false,
    createEnforcementCase: false,
    recommendationForRisk: '',
    inspectorNotes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OutcomeData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddAction, setShowAddAction] = useState(false);
  const [newAction, setNewAction] = useState<Partial<FollowUpAction>>({
    action: '',
    assignee: '',
    dueDate: '',
    priority: 'medium',
  });

  const outcomeTypes = [
    {
      value: 'verified',
      label: 'Xác minh đúng',
      description: 'Lead chính xác, có vi phạm thực tế',
      icon: CheckCircle,
      color: 'rgba(34, 197, 94, 1)',
    },
    {
      value: 'unverified',
      label: 'Không xác minh được',
      description: 'Không đủ bằng chứng hoặc sai thông tin',
      icon: XCircle,
      color: 'rgba(239, 68, 68, 1)',
    },
    {
      value: 'partial',
      label: 'Xác minh một phần',
      description: 'Một số thông tin chính xác',
      icon: AlertTriangle,
      color: 'rgba(251, 146, 60, 1)',
    },
    {
      value: 'duplicate',
      label: 'Trùng lặp',
      description: 'Đã xử lý ở lead khác',
      icon: FileCheck,
      color: 'rgba(148, 163, 184, 1)',
    },
  ];

  const closureReasons = {
    verified: [
      'Vi phạm đã xác minh và xử lý',
      'Chuyển cơ quan chức năng',
      'Đã lập biên bản và xử phạt',
      'Cơ sở đã khắc phục vi phạm',
    ],
    unverified: [
      'Không tìm thấy cơ sở tại địa chỉ',
      'Thông tin báo cáo không chính xác',
      'Không đủ bằng chứng vi phạm',
      'Cơ sở đã ngừng hoạt động',
    ],
    partial: [
      'Một phần thông tin chính xác',
      'Vi phạm nhỏ đã khắc phục tại chỗ',
      'Cần thanh tra bổ sung',
    ],
    duplicate: [
      'Đã xử lý trong lead khác',
      'Trùng với vụ việc đang theo dõi',
    ],
  };

  const violationTypes = [
    'Hàng giả, hàng nhái',
    'Không có hóa đơn chứng từ',
    'Vi phạm niêm yết giá',
    'Hàng không rõ nguồn gốc',
    'Vi phạm an toàn thực phẩm',
    'Kinh doanh không phép',
    'Vi phạm quy định về bảo hành',
    'Gian lận thương mại',
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OutcomeData, string>> = {};

    if (!formData.closureReason) {
      newErrors.closureReason = 'Vui lòng chọn lý do đóng lead';
    }

    if (!formData.findings || formData.findings.trim().length < 20) {
      newErrors.findings = 'Kết quả xác minh phải có ít nhất 20 ký tự';
    }

    if (formData.outcomeType === 'verified' && formData.violations.length === 0) {
      newErrors.violations = 'Vui lòng chọn ít nhất 1 loại vi phạm' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const tasks = [];
      if (formData.createInspectionPlan) tasks.push('Kế hoạch thanh tra');
      if (formData.createEnforcementCase) tasks.push('Hồ sơ xử phạt');

      toast.success(
        `Đã đóng lead ${formData.leadId}!${tasks.length > 0 ? `\nĐã tạo: ${tasks.join(', ')}` : ''}`
      );
      navigate(`/lead-risk/lead/${formData.leadId}`);
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleViolation = (violation: string) => {
    if (formData.violations.includes(violation)) {
      setFormData({
        ...formData,
        violations: formData.violations.filter((v) => v !== violation),
      });
    } else {
      setFormData({ ...formData, violations: [...formData.violations, violation] });
    }
  };

  const addFollowUpAction = () => {
    if (!newAction.action || !newAction.assignee || !newAction.dueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin hành động');
      return;
    }

    const action: FollowUpAction = {
      id: Date.now().toString(),
      action: newAction.action!,
      assignee: newAction.assignee!,
      dueDate: newAction.dueDate!,
      priority: newAction.priority || 'medium',
    };

    setFormData({ ...formData, followUpActions: [...formData.followUpActions, action] });
    setNewAction({ action: '', assignee: '', dueDate: '', priority: 'medium' });
    setShowAddAction(false);
    toast.success('Đã thêm hành động theo dõi');
  };

  const removeFollowUpAction = (actionId: string) => {
    setFormData({
      ...formData,
      followUpActions: formData.followUpActions.filter((a) => a.id !== actionId),
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </button>

        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Kết luận xác minh Lead</h1>
          <p className={styles.subtitle}>Lead {formData.leadId}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formCard}>
          {/* Outcome Type */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              1. Kết quả xác minh <span className={styles.required}>*</span>
            </h2>

            <div className={styles.outcomeGrid}>
              {outcomeTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`${styles.outcomeCard} ${
                      formData.outcomeType === type.value ? styles.outcomeCardActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="outcomeType"
                      value={type.value}
                      checked={formData.outcomeType === type.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          outcomeType: e.target.value as any,
                          closureReason: '',
                          violations: [],
                        })
                      }
                    />
                    <div
                      className={styles.outcomeIcon}
                      style={{ backgroundColor: type.color }}
                    >
                      <IconComponent size={24} />
                    </div>
                    <div className={styles.outcomeContent}>
                      <div className={styles.outcomeLabel}>{type.label}</div>
                      <div className={styles.outcomeDescription}>{type.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Closure Reason */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              2. Lý do đóng lead <span className={styles.required}>*</span>
            </h2>

            <select
              value={formData.closureReason}
              onChange={(e) => setFormData({ ...formData, closureReason: e.target.value })}
              className={`${styles.select} ${errors.closureReason ? styles.inputError : ''}`}
            >
              <option value="">Chọn lý do</option>
              {(closureReasons[formData.outcomeType as keyof typeof closureReasons] || []).map(
                (reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                )
              )}
            </select>
            {errors.closureReason && (
              <div className={styles.error}>
                <AlertTriangle size={14} />
                {errors.closureReason}
              </div>
            )}
          </div>

          {/* Findings */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              3. Kết quả xác minh chi tiết <span className={styles.required}>*</span>
            </h2>

            <textarea
              rows={6}
              placeholder="Mô tả chi tiết kết quả xác minh, tình trạng thực tế, bằng chứng thu thập được..."
              value={formData.findings}
              onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
              className={`${styles.textarea} ${errors.findings ? styles.inputError : ''}`}
            />
            <div className={styles.charCount}>{formData.findings.length} / 2000 ký tự</div>
            {errors.findings && (
              <div className={styles.error}>
                <AlertTriangle size={14} />
                {errors.findings}
              </div>
            )}
          </div>

          {/* Violations (only for verified) */}
          {formData.outcomeType === 'verified' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                4. Loại vi phạm <span className={styles.required}>*</span>
              </h2>

              <div className={styles.violationsGrid}>
                {violationTypes.map((violation) => (
                  <label key={violation} className={styles.checkboxCard}>
                    <input
                      type="checkbox"
                      checked={formData.violations.includes(violation)}
                      onChange={() => toggleViolation(violation)}
                    />
                    <span>{violation}</span>
                  </label>
                ))}
              </div>
              {errors.violations && (
                <div className={styles.error}>
                  <AlertTriangle size={14} />
                  {errors.violations}
                </div>
              )}
            </div>
          )}

          {/* Actions Taken */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Hành động đã thực hiện</h2>

            <textarea
              rows={4}
              placeholder="Mô tả các hành động, biện pháp đã thực hiện tại hiện trường..."
              value={formData.actionsTaken}
              onChange={(e) => setFormData({ ...formData, actionsTaken: e.target.value })}
              className={styles.textarea}
            />
          </div>

          {/* Follow-up Actions */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Hành động theo dõi</h2>

            {formData.followUpActions.length > 0 && (
              <div className={styles.actionsList}>
                {formData.followUpActions.map((action) => (
                  <div key={action.id} className={styles.actionItem}>
                    <div className={styles.actionContent}>
                      <div className={styles.actionHeader}>
                        <span className={styles.actionText}>{action.action}</span>
                        <span className={`${styles.priorityBadge} ${styles[`priority${action.priority}`]}`}>
                          {action.priority === 'high' && 'Cao'}
                          {action.priority === 'medium' && 'Trung bình'}
                          {action.priority === 'low' && 'Thấp'}
                        </span>
                      </div>
                      <div className={styles.actionMeta}>
                        <span>Phân công: {action.assignee}</span>
                        <span>Hạn: {new Date(action.dueDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeActionButton}
                      onClick={() => removeFollowUpAction(action.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!showAddAction ? (
              <button
                type="button"
                className={styles.addActionButton}
                onClick={() => setShowAddAction(true)}
              >
                <Plus size={16} />
                Thêm hành động
              </button>
            ) : (
              <div className={styles.addActionForm}>
                <div className={styles.inputGroup}>
                  <label>Hành động</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Theo dõi cơ sở sau 15 ngày"
                    value={newAction.action}
                    onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Phân công cho</label>
                    <input
                      type="text"
                      placeholder="Tên người thực hiện"
                      value={newAction.assignee}
                      onChange={(e) => setNewAction({ ...newAction, assignee: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Hạn thực hiện</label>
                    <input
                      type="date"
                      value={newAction.dueDate}
                      onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Ưu tiên</label>
                    <select
                      value={newAction.priority}
                      onChange={(e) =>
                        setNewAction({ ...newAction, priority: e.target.value as any })
                      }
                      className={styles.select}
                    >
                      <option value="high">Cao</option>
                      <option value="medium">Trung bình</option>
                      <option value="low">Thấp</option>
                    </select>
                  </div>
                </div>

                <div className={styles.addActionButtons}>
                  <button
                    type="button"
                    className={styles.cancelAddButton}
                    onClick={() => {
                      setShowAddAction(false);
                      setNewAction({ action: '', assignee: '', dueDate: '', priority: 'medium' });
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className={styles.confirmAddButton}
                    onClick={addFollowUpAction}
                  >
                    Thêm
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Create Tasks */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Tạo công việc tiếp theo</h2>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.createInspectionPlan}
                  onChange={(e) =>
                    setFormData({ ...formData, createInspectionPlan: e.target.checked })
                  }
                />
                <CalendarPlus size={18} />
                <div>
                  <div className={styles.checkboxTitle}>Tạo kế hoạch thanh tra</div>
                  <div className={styles.checkboxHint}>
                    Lập kế hoạch thanh tra định kỳ cho cơ sở này
                  </div>
                </div>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.createEnforcementCase}
                  onChange={(e) =>
                    setFormData({ ...formData, createEnforcementCase: e.target.checked })
                  }
                />
                <ListChecks size={18} />
                <div>
                  <div className={styles.checkboxTitle}>Tạo hồ sơ xử phạt vi phạm</div>
                  <div className={styles.checkboxHint}>
                    Khởi tạo hồ sơ xử phạt hành chính
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Risk Recommendation */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Đề xuất về quản lý rủi ro</h2>

            <textarea
              rows={4}
              placeholder="Đề xuất về mức độ rủi ro, hành động phòng ngừa, cập nhật watchlist..."
              value={formData.recommendationForRisk}
              onChange={(e) =>
                setFormData({ ...formData, recommendationForRisk: e.target.value })
              }
              className={styles.textarea}
            />
          </div>

          {/* Inspector Notes */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Ghi chú thanh tra viên</h2>

            <textarea
              rows={3}
              placeholder="Ghi chú nội bộ, kinh nghiệm rút ra, thông tin bổ sung..."
              value={formData.inspectorNotes}
              onChange={(e) => setFormData({ ...formData, inspectorNotes: e.target.value })}
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            <X size={16} />
            Hủy
          </button>

          <div className={styles.actionsSpacer}></div>

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className={styles.spinner}></div>
                Đang lưu...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Đóng Lead
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
