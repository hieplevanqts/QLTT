import React, { useState, useEffect } from 'react';
import { X, AlertCircle, FileText } from 'lucide-react';
import { cn } from '../ui/utils';
import styles from './CreateTaskModal.module.css';
import { TaskPriority, TaskStatus } from '@/utils/data/inspection-tasks-mock-data';
import DateRangePicker from '@/components/ui-kit/DateRangePicker';
import { fetchPlansApi } from '@/utils/api/plansApi';
import { fetchInspectionRoundsApi } from '@/utils/api/inspectionRoundsApi';
import type { Plan } from '@/types/plans';
import type { InspectionRound } from '@/types/inspections';
import { fetchMerchants } from '@/utils/api/merchantsApi';
import { fetchDepartmentUsers } from '@/utils/api/departmentUsersApi';
import { Restaurant } from '@/utils/data/restaurantData';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: CreateTaskFormData, taskId?: string) => void;
  task?: any | null; // Data of the task to edit
  taskId?: string; // ID of the task to edit
  defaultRoundId?: string;
  defaultPlanId?: string;
}

export interface CreateTaskFormData {
  title: string;
  description: string;
  targetName: string; // Tên cửa hàng
  merchantId: string;
  roundId: string;
  planId?: string;
  assigneeId: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  startDate?: string;
}

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Thấp', color: '#64748b' },
  { value: 'medium', label: 'Trung bình', color: '#f59e0b' },
  { value: 'high', label: 'Cao', color: '#f97316' },
  { value: 'urgent', label: 'Khẩn cấp', color: '#ef4444' },
];

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Chưa bắt đầu', emoji: '⚪' },
  { value: 'in_progress', label: 'Đang thực hiện', emoji: '🔵' },
  { value: 'completed', label: 'Hoàn thành', emoji: '🟢' },
  { value: 'closed', label: 'Đã đóng', emoji: '⚫' },
];

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function CreateTaskModal({ isOpen, onClose, onSubmit, task, taskId, defaultRoundId, defaultPlanId }: CreateTaskModalProps) {
  // Set giá trị mặc định ngay từ đầu
  const [formData, setFormData] = useState<CreateTaskFormData>({
    title: '',
    description: '',
    targetName: '',
    merchantId: '',
    roundId: defaultRoundId || '',
    planId: defaultPlanId || '',
    assigneeId: '',
    priority: 'medium', // Mặc định Trung bình
    status: 'not_started', // Mặc định Chưa bắt đầu
    dueDate: '',
    startDate: getTodayDate(), // Mặc định ngày hiện tại
  });

  const isEditMode = !!task;

  const [errors, setErrors] = useState<Partial<Record<keyof CreateTaskFormData, string>>>({});
  
  // API data states
  const [plans, setPlans] = useState<Plan[]>([]);
  const [rounds, setRounds] = useState<InspectionRound[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingRounds, setLoadingRounds] = useState(false);
  const [merchants, setMerchants] = useState<Restaurant[]>([]);
  const [loadingMerchants, setLoadingMerchants] = useState(false);
  const [assignees, setAssignees] = useState<{ value: string; label: string }[]>([]);
  const [loadingAssignees, setLoadingAssignees] = useState(false);

  // Fetch approved plans when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchApprovedPlans();
    }
  }, [isOpen]);

  // Fetch rounds when plan selection changes
  useEffect(() => {
    if (isOpen) {
      fetchRoundsByPlan(formData.planId);
    }
  }, [isOpen, formData.planId]);

  // Fetch merchants and assignees when round selection changes
  useEffect(() => {
    if (isOpen && formData.roundId) {
      const selectedRound = rounds.find(r => r.id === formData.roundId);
      if (selectedRound) {
        fetchMerchantsByLocation(selectedRound.provinceId, selectedRound.wardId);
        fetchAssignees(selectedRound.leadUnitId);
      }
    } else if (isOpen && !formData.roundId) {
      setMerchants([]);
      setAssignees([]);
    }
  }, [isOpen, formData.roundId, rounds]);

  // Sync defaults when opening in Create Mode
  useEffect(() => {
    if (isOpen && !task) {
      setFormData(prev => ({
        ...prev,
        roundId: defaultRoundId || '',
        planId: defaultPlanId || ''
      }));
    }
  }, [isOpen, task, defaultRoundId, defaultPlanId]);

  // Populate data when in edit mode
  useEffect(() => {
    if (isOpen && task) {
      setFormData({
        title: task.title || '',
        description: task.description || task.note || '', // Prioritize description
        targetName: task.targetName || task.merchantName || '',
        merchantId: task.merchantId || task.merchant_id || '',
        roundId: task.roundId || '',
        planId: task.planId || '',
        assigneeId: task.userId || task.assignee?.id || '',
        priority: task.priority || 'medium',
        status: task.status || 'not_started',
        dueDate: task.dueDate || task.deadlineTime || '',
        startDate: task.startDate || task.startTime || getTodayDate(),
      });
      setErrors({});
    }
  }, [isOpen, task]);

  const fetchAssignees = async (departmentId?: string) => {
    if (!departmentId) return;
    try {
      setLoadingAssignees(true);
      const data = await fetchDepartmentUsers(departmentId);
      const mapped = data.map(item => ({
        value: item.user_id,
        label: item.users?.full_name || 'Không xác định'
      }));
      setAssignees(mapped);
    } catch (error) {
      console.error('Error fetching assignees:', error);
    } finally {
      setLoadingAssignees(false);
    }
  };

  const fetchMerchantsByLocation = async (provinceId?: string, wardId?: string) => {
    try {
      setLoadingMerchants(true);
      const data = await fetchMerchants(undefined, undefined, undefined, provinceId, wardId);
      setMerchants(data);
    } catch (error) {
      console.error('Error fetching merchants:', error);
      setMerchants([]);
    } finally {
      setLoadingMerchants(false);
    }
  };

  const fetchApprovedPlans = async () => {
    try {
      setLoadingPlans(true);
      const allPlans = await fetchPlansApi();
      // Filter applicable plans (approved, active)
      const validStatuses = ['approved', 'active', 'in_progress'];
      const applicablePlans = allPlans.filter(plan => validStatuses.includes(plan.status));
      setPlans(applicablePlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchRoundsByPlan = async (planId?: string) => {
    try {
      setLoadingRounds(true);
      let allRounds: InspectionRound[];
      
      if (planId) {
        // Fetch rounds for specific plan
        allRounds = await fetchInspectionRoundsApi(planId);
      } else {
        // Fetch all rounds
        allRounds = await fetchInspectionRoundsApi();
      }
      
      // Filter applicable rounds
      // Allow draft, approved, active, in_progress, paused
      const validStatuses = ['draft', 'approved', 'active', 'in_progress', 'paused'];
      const applicableRounds = allRounds.filter(round => validStatuses.includes(round.status));
      setRounds(applicableRounds);
      
      // Reset roundId if current selection is not in the new list
      // But preserve if it matches defaultRoundId (to support pre-filling even if status is weird)
      const found = applicableRounds.find(r => r.id === formData.roundId);
      if (formData.roundId && !found) {
        // If default is set but not found in list, we might want to fetch that specific round and add it?
        // For now, just clear if not found, unless it matches default (which might imply we need to trust the caller)
        // However, if it's not in the list, the Select won't show it properly anyway.
        if (formData.roundId !== defaultRoundId) {
             setFormData(prev => ({ ...prev, roundId: '' }));
        }
      }
    } catch (error) {
      console.error('Error fetching rounds:', error);
      setRounds([]);
    } finally {
      setLoadingRounds(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (field: keyof CreateTaskFormData, value: string) => {
    if (field === 'merchantId') {
      const selectedMerchant = merchants.find(m => m.id === value);
      setFormData(prev => ({ 
        ...prev, 
        merchantId: value,
        targetName: selectedMerchant ? selectedMerchant.name : '' 
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    // Clear error when field is changed
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTaskFormData, string>> = {};

    // Tên phiên làm việc - bắt buộc, ≤ 255 ký tự
    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tên phiên làm việc';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Tên phiên làm việc không được vượt quá 255 ký tự';
    }

    // Tên cửa hàng - bắt buộc
    if (!formData.merchantId) {
      newErrors.merchantId = 'Vui lòng chọn cơ sở/đối tượng kiểm tra';
    }

    // Kế hoạch kiểm tra - KHÔNG bắt buộc (removed validation)

    // Đợt kiểm tra - bắt buộc
    if (!formData.roundId) {
      newErrors.roundId = 'Vui lòng chọn đợt kiểm tra';
    }

    // Người thực hiện - KHÔNG bắt buộc

    // Hạn hoàn thành - bắt buộc
    if (!formData.dueDate) {
      newErrors.dueDate = 'Vui lòng chọn hạn hoàn thành';
    }

    // Validate dates: Hạn hoàn thành ≥ ngày bắt đầu
    if (formData.startDate && formData.dueDate) {
      const start = new Date(formData.startDate);
      const due = new Date(formData.dueDate);
      if (start > due) {
        newErrors.dueDate = 'Hạn hoàn thành phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData, taskId);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      targetName: '',
      merchantId: '',
      roundId: defaultRoundId || '', // Reset to default
      planId: defaultPlanId || '', // Reset to default
      assigneeId: '',
      priority: 'medium', // Reset về mặc định
      status: 'not_started', // Reset về mặc định
      dueDate: '',
      startDate: getTodayDate(), // Reset về ngày hiện tại
    });
    setErrors({});
    onClose();
  };
  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <FileText size={24} className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>{isEditMode ? 'Chỉnh sửa phiên làm việc' : 'Thiết lập phiên làm việc mới'}</h2>
              <p className={styles.subtitle}>
                Vui lòng cung cấp đầy đủ thông tin để khởi tạo phiên làm việc. Hệ thống sẽ tự động liên kết dữ liệu với kế hoạch và đợt kiểm tra tương ứng.
              </p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={handleClose} title="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className={styles.content}>
          <form id="create-task-form" onSubmit={handleSubmit}>
            {/* Section 1: Basic Info */}
            <div className={styles.section}>
              
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="title">
                  Tên phiên làm việc <span className={styles.required}>*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Ví dụ: Kiểm tra ATTP tại Cửa hàng X..."
                  className={cn(styles.input, errors.title && styles.inputError)}
                />
                {errors.title && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} /> {errors.title}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="description">
                  Nội dung chi tiết
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Mô tả cụ thể mục tiêu, phạm vi hoặc các lưu ý đặc biệt..."
                  className={styles.textarea}
                />
              </div>
            </div>

            {/* Section 2: Structure */}
            <div className={styles.section}>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="planId">
                    Kế hoạch kiểm tra
                  </label>
                  <select
                    id="planId"
                    value={formData.planId || ''}
                    onChange={(e) => handleChange('planId', e.target.value)}
                    className={styles.select}
                    disabled={loadingPlans}
                  >
                    <option value="">-- Chọn kế hoạch (tùy chọn) --</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} ({plan.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="roundId">
                    Đợt kiểm tra <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="roundId"
                    value={formData.roundId}
                    onChange={(e) => handleChange('roundId', e.target.value)}
                    className={cn(styles.select, errors.roundId && styles.inputError)}
                    disabled={loadingRounds}
                  >
                    <option value="">-- Chọn đợt kiểm tra --</option>
                    {rounds.map((round) => (
                      <option key={round.id} value={round.id}>
                        {round.name} ({round.code})
                      </option>
                    ))}
                  </select>
                  {errors.roundId && (
                    <span className={styles.errorText}>
                      <AlertCircle size={14} /> {errors.roundId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Target & Assignee */}
            <div className={styles.section}>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="merchantId">
                    Cơ sở / Đối tượng kiểm tra <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="merchantId"
                    value={formData.merchantId}
                    onChange={(e) => handleChange('merchantId', e.target.value)}
                    className={cn(styles.select, errors.merchantId && styles.inputError)}
                    disabled={loadingMerchants || !formData.roundId}
                  >
                    <option value="">
                      {loadingMerchants 
                        ? 'Đang tải danh sách...' 
                        : !formData.roundId 
                          ? '-- Chọn đợt trước --' 
                          : '-- Chọn cơ sở / đối tượng --'}
                    </option>
                    {merchants.map(store => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                  {errors.merchantId && (
                    <span className={styles.errorText}>
                      <AlertCircle size={14} /> {errors.merchantId}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="assigneeId">
                    Người chủ trì
                  </label>
                  <select
                    id="assigneeId"
                    value={formData.assigneeId}
                    onChange={(e) => handleChange('assigneeId', e.target.value)}
                    className={styles.select}
                    disabled={loadingAssignees || !formData.roundId}
                  >
                    <option value="">
                      {loadingAssignees 
                        ? 'Đang tải...' 
                        : !formData.roundId 
                          ? '-- Chọn đợt trước --' 
                          : '-- Chọn người chủ trì --'}
                    </option>
                    {assignees.map(assignee => (
                      <option key={assignee.value} value={assignee.value}>
                        {assignee.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Configuration */}
            <div className={styles.section}>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Ngày bắt đầu</label>
                  <DateRangePicker
                    mode="single"
                    placeholder="Chọn ngày"
                    value={{
                      startDate: formData.startDate || null,
                      endDate: formData.startDate || null
                    }}
                    onChange={(range) => handleChange('startDate', range.startDate || '')}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Hạn hoàn thành <span className={styles.required}>*</span></label>
                  <DateRangePicker
                    mode="single"
                    placeholder="Chọn hạn"
                    value={{
                      startDate: formData.dueDate || null,
                      endDate: formData.dueDate || null
                    }}
                    onChange={(range) => handleChange('dueDate', range.startDate || '')}
                    className={errors.dueDate ? styles.inputError : ''}
                  />
                  {errors.dueDate && (
                    <span className={styles.errorText}>
                      <AlertCircle size={14} /> {errors.dueDate}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.formRow} style={{ marginTop: '16px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Mức độ ưu tiên</label>
                  <div className={styles.priorityGrid}>
                    {PRIORITY_OPTIONS.map(priority => (
                      <button
                        key={priority.value}
                        type="button"
                        className={cn(
                          styles.priorityButton,
                          formData.priority === priority.value && styles.priorityActive
                        )}
                        onClick={() => handleChange('priority', priority.value as any)}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as any)}
                    className={styles.select}
                    disabled
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleClose}
          >
            Hủy
          </button>
          <button 
            type="submit" 
            form="create-task-form" 
            className={styles.submitButton}
          >
            {isEditMode ? 'Cập nhật phiên làm việc' : 'Khởi tạo phiên làm việc'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTaskModal;

