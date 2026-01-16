import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import styles from './PlanCreate.module.css';
import DateRangePicker, { DateRange } from '../../../ui-kit/DateRangePicker';
import { RichTextEditor } from '../../../ui-kit/RichTextEditor';
import { usePlans } from '../../contexts/PlansContext';
import { type Plan, type PlanType, type Priority } from '../../data/kehoach-mock-data';
import { SelectInsDecisionModal, type InsDecision } from '../../components/plans/SelectInsDecisionModal';

type PlanTypeTab = 'periodic' | 'thematic' | 'urgent';

export function PlanCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { planId } = useParams(); // Get planId from URL params
  const { addPlan, updatePlan, plans } = usePlans();
  
  // Check if in edit mode
  const isEditMode = !!planId;
  const editingPlan = isEditMode ? plans.find(p => p.id === planId) : null;
  
  // Read URL parameter to set initial tab
  const searchParams = new URLSearchParams(location.search);
  const initialType = searchParams.get('type') as PlanTypeTab || (editingPlan?.planType as PlanTypeTab) || 'periodic';
  
  const [activeTab, setActiveTab] = useState<PlanTypeTab>(initialType);
  
  // Update activeTab when URL parameter changes
  useEffect(() => {
    const type = searchParams.get('type') as PlanTypeTab;
    if (type && (type === 'periodic' || type === 'thematic' || type === 'urgent')) {
      setActiveTab(type);
    }
  }, [location.search]);
  
  const [formData, setFormData] = useState({
    planCategory: 'Kiểm tra định kỳ',
    year: '2026',
    quarter: '',
    title: '',
    startDate: '',
    endDate: '',
    responsibleUnit: '',
    cooperatingUnits: '',
    scopeArea: '',
    description: '',
    objectives: '',
    priority: 'medium' as Priority,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  
  // M03 - Quyết định giao quyền
  const [selectedM03, setSelectedM03] = useState<InsDecision | null>(null);
  const [showM03Modal, setShowM03Modal] = useState(false);

  // Helper functions - must be defined before useEffect
  const getPlanTypeLabel = (type: PlanTypeTab): string => {
    switch(type) {
      case 'periodic': return 'Kiểm tra định kỳ';
      case 'thematic': return 'Kiểm tra chuyên đề';
      case 'urgent': return 'Kiểm tra đột xuất';
    }
  };

  // Load existing plan data in edit mode
  useEffect(() => {
    if (isEditMode && editingPlan) {
      // Parse year from startDate
      const planYear = new Date(editingPlan.startDate).getFullYear().toString();
      
      setFormData({
        planCategory: getPlanTypeLabel(editingPlan.planType as PlanTypeTab),
        year: planYear,
        quarter: editingPlan.quarter,
        title: editingPlan.name,
        startDate: editingPlan.startDate,
        endDate: editingPlan.endDate,
        responsibleUnit: editingPlan.responsibleUnit,
        cooperatingUnits: '', // Not in Plan interface, keep empty
        scopeArea: editingPlan.scopeLocation,
        description: editingPlan.topic,
        objectives: editingPlan.objectives,
        priority: editingPlan.priority,
      });
      
      setDateRange({
        startDate: editingPlan.startDate,
        endDate: editingPlan.endDate,
      });
      
      setActiveTab(editingPlan.planType as PlanTypeTab);
    }
  }, [isEditMode, editingPlan]);

  const getTabTitle = (type: PlanTypeTab): string => {
    switch(type) {
      case 'periodic': return 'Kế hoạch kiểm tra định kỳ';
      case 'thematic': return 'Kế hoạch kiểm tra chuyên đề';
      case 'urgent': return 'Kế hoạch kiểm tra đột xuất';
    }
  };

  const getTabDescription = (type: PlanTypeTab): string => {
    switch(type) {
      case 'periodic': return 'Điền thông tin tạo chi tiết về kế hoạch kiểm tra định kỳ';
      case 'thematic': return 'Điền thông tin tạo chi tiết về kế hoạch kiểm tra chuyên đề';
      case 'urgent': return 'Điền thông tin tạo chi tiết về kế hoạch kiểm tra đột xuất';
    }
  };

  const handleTabChange = (type: PlanTypeTab) => {
    setActiveTab(type);
    // Update planCategory when tab changes
    setFormData(prev => ({
      ...prev,
      planCategory: getPlanTypeLabel(type)
    }));
    // Update URL
    navigate(`/plans/create-new?type=${type}`, { replace: true });
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setFormData(prev => ({
      ...prev,
      startDate: range.startDate || '',
      endDate: range.endDate || '',
    }));
    // Clear errors
    if (errors.startDate || errors.endDate) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.startDate;
        delete newErrors.endDate;
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.planCategory.trim()) {
      newErrors.planCategory = 'Vui lòng chọn loại kế hoạch';
    }
    
    if (!formData.year) {
      newErrors.year = 'Vui lòng chọn năm';
    }
    
    if (activeTab === 'periodic' && !formData.quarter) {
      newErrors.quarter = 'Vui lòng chọn quý hoặc tháng';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề kế hoạch';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn thời gian thực hiện';
    }

    if (!formData.responsibleUnit.trim()) {
      newErrors.responsibleUnit = 'Vui lòng chọn đơn vị chủ trì';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    if (isEditMode && planId) {
      // Edit existing plan
      const updates: Partial<Plan> = {
        name: formData.title,
        planType: activeTab as PlanType,
        quarter: formData.quarter || '-',
        topic: formData.description || 'N/A',
        scope: formData.scopeArea || 'Toàn quốc',
        scopeLocation: formData.scopeArea || 'Toàn quốc',
        responsibleUnit: formData.responsibleUnit,
        objectives: formData.objectives || 'N/A',
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        priority: formData.priority,
      };
      
      updatePlan(planId, updates);
      toast.success(`Đã cập nhật kế hoạch "${formData.title}" thành công!`);
    } else {
      // Create new plan
      const newPlanId = `KH-${activeTab === 'periodic' ? 'DK' : activeTab === 'thematic' ? 'CD' : 'DX'}-${String(plans.length + 1).padStart(4, '0')}`;
      
      const newPlan: Plan = {
        id: newPlanId,
        name: formData.title,
        planType: activeTab as PlanType,
        quarter: formData.quarter || '-',
        topic: formData.description || 'N/A',
        scope: formData.scopeArea || 'Toàn quốc',
        scopeLocation: formData.scopeArea || 'Toàn quốc',
        responsibleUnit: formData.responsibleUnit,
        objectives: formData.objectives || 'N/A',
        status: 'draft',
        priority: formData.priority,
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        createdBy: 'Người tạo hiện tại',
        createdAt: new Date().toISOString(),
        // Save M03 if selected
        insDecisionM03: selectedM03 ? {
          id: selectedM03.id,
          code: selectedM03.code,
          title: selectedM03.title,
          issueDate: selectedM03.issueDate,
          signer: selectedM03.signer,
        } : undefined,
        stats: {
          totalTargets: 0,
          totalTasks: 0,
          completedTasks: 0,
          progress: 0,
        },
      };
      
      addPlan(newPlan);
      toast.success(`Đã tạo kế hoạch "${formData.title}" thành công!`);
    }
    
    navigate('/plans/list');
  };

  const handleCancel = () => {
    navigate('/plans/list');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={handleCancel} className={styles.backButton}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            {isEditMode 
              ? `Chỉnh sửa ${editingPlan?.name || 'kế hoạch'} (${getPlanTypeLabel(activeTab)})`
              : 'Tạo kế hoạch kiểm tra'}
          </h1>
          <p className={styles.subtitle}>
            {isEditMode 
              ? 'Cập nhật thông tin kế hoạch kiểm tra' 
              : 'Lập kế hoạch kiểm tra định kỳ, chuyên đề hoặc đột xuất'}
          </p>
        </div>
      </div>

      {/* Tabs - Hidden in Edit Mode */}
      {!isEditMode && (
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'periodic' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('periodic')}
          >
            Định kỳ
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'thematic' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('thematic')}
          >
            Chuyên đề
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'urgent' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('urgent')}
          >
            Đột xuất
          </button>
        </div>
      )}

      {/* Form */}
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Năm kế hoạch */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Năm kế hoạch <span className={styles.required}>*</span>
            </label>
            <select
              className={`${styles.select} ${errors.year ? styles.inputError : ''}`}
              value={formData.year}
              onChange={(e) => handleChange('year', e.target.value)}
            >
              <option value="">Chọn năm</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
            {errors.year && (
              <span className={styles.errorText}>
                <AlertCircle size={14} />
                {errors.year}
              </span>
            )}
          </div>

          {/* Quý/Tháng (only for periodic) */}
          {activeTab === 'periodic' && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Quý/Tháng <span className={styles.required}>*</span>
              </label>
              <select
                className={`${styles.select} ${errors.quarter ? styles.inputError : ''}`}
                value={formData.quarter}
                onChange={(e) => handleChange('quarter', e.target.value)}
              >
                <option value="">Chọn quý hoặc tháng...</option>
                <option value="Q1">Quý I (Tháng 1-3)</option>
                <option value="Q2">Quý II (Tháng 4-6)</option>
                <option value="Q3">Quý III (Tháng 7-9)</option>
                <option value="Q4">Quý IV (Tháng 10-12)</option>
              </select>
              {errors.quarter && (
                <span className={styles.errorText}>
                  <AlertCircle size={14} />
                  {errors.quarter}
                </span>
              )}
            </div>
          )}

          {/* Tiêu đề kế hoạch */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Tiêu đề kế hoạch <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ví dụ: Kế hoạch kiểm tra định kỳ Quý I/2025"
            />
            {errors.title && (
              <span className={styles.errorText}>
                <AlertCircle size={14} />
                {errors.title}
              </span>
            )}
          </div>

          {/* Thời gian thực hiện */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Thời gian thực hiện <span className={styles.required}>*</span>
            </label>
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder="Chọn ngày bắt đầu - ngày kết thúc"
            />
            {(errors.startDate || errors.endDate) && (
              <span className={styles.errorText}>
                <AlertCircle size={14} />
                {errors.startDate || errors.endDate}
              </span>
            )}
          </div>

          {/* Đơn vị chủ trì */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Đơn vị chủ trì <span className={styles.required}>*</span>
            </label>
            <select
              className={`${styles.select} ${errors.responsibleUnit ? styles.inputError : ''}`}
              value={formData.responsibleUnit}
              onChange={(e) => handleChange('responsibleUnit', e.target.value)}
            >
              <option value="">Chọn đơn vị...</option>
              <option value="Sở Công Thương">Sở Công Thương</option>
              <option value="Thanh tra Sở">Thanh tra Sở</option>
              <option value="Chi cục QLTT">Chi cục QLTT</option>
              <option value="Phòng Quản lý thị trường">Phòng Quản lý thị trường</option>
            </select>
            {errors.responsibleUnit && (
              <span className={styles.errorText}>
                <AlertCircle size={14} />
                {errors.responsibleUnit}
              </span>
            )}
          </div>

          {/* Đơn vị phối hợp */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Đơn vị phối hợp
            </label>
            <input
              type="text"
              className={styles.input}
              value={formData.cooperatingUnits}
              onChange={(e) => handleChange('cooperatingUnits', e.target.value)}
              placeholder="Ví dụ: Sở Công Thương, Chi cục QLTT"
            />
          </div>

          {/* M03 - Quyết định giao quyền */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Quyết định giao quyền (M03)
              <span className={styles.helpText}> - Tùy chọn</span>
            </label>
            {selectedM03 ? (
              <div className={styles.selectedDecision}>
                <div className={styles.selectedDecisionContent}>
                  <FileText size={20} className={styles.selectedDecisionIcon} />
                  <div className={styles.selectedDecisionInfo}>
                    <div className={styles.selectedDecisionCode}>{selectedM03.code}</div>
                    <div className={styles.selectedDecisionTitle}>{selectedM03.title}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedM03(null)}
                  className={styles.removeButton}
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowM03Modal(true)}
                className={styles.selectButton}
              >
                <FileText size={16} />
                Chọn từ hệ thống INS
              </button>
            )}
          </div>

          {/* Mức độ ưu tiên */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Mức độ ưu tiên
            </label>
            <select
              className={styles.select}
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value as Priority)}
            >
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
              <option value="critical">Khẩn cấp</option>
            </select>
          </div>

          {/* Khu vực kiểm tra */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Khu vực kiểm tra
            </label>
            <input
              type="text"
              className={styles.input}
              value={formData.scopeArea}
              onChange={(e) => handleChange('scopeArea', e.target.value)}
              placeholder="Ví dụ: Thành phố Hồ Chí Minh, Tỉnh Đồng Nai"
            />
          </div>

          {/* Mô tả kế hoạch */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Mô tả kế hoạch
            </label>
            <textarea
              className={styles.textarea}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Nhập mô tả chi tiết về kế hoạch kiểm tra"
              rows={4}
            />
          </div>

          {/* Mục tiêu kiểm tra */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Mục tiêu kiểm tra
            </label>
            <textarea
              className={styles.textarea}
              value={formData.objectives}
              onChange={(e) => handleChange('objectives', e.target.value)}
              placeholder="Nhập các mục tiêu cụ thể của kế hoạch kiểm tra"
              rows={4}
            />
          </div>

          {/* Form Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.submitButton}
            >
              {isEditMode ? 'Cập nhật kế hoạch' : 'Tạo kế hoạch'}
            </button>
          </div>
        </form>
      </div>

      {/* M03 Modal */}
      <SelectInsDecisionModal
        open={showM03Modal}
        onOpenChange={setShowM03Modal}
        documentCode="M03"
        documentName="Quyết định giao quyền ban hành quyết định kiểm tra"
        onSelect={(decision) => {
          setSelectedM03(decision);
          toast.success(`Đã chọn ${decision.code}`);
        }}
      />
    </div>
  );
}