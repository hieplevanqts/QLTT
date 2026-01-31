
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, FileText, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import styles from './PlanCreate.module.css';
import { cn } from '@/components/ui/utils';
import DateRangePicker, { DateRange } from '@/components/ui-kit/DateRangePicker';

import { usePlans } from '@/contexts/PlansContext';
import { type Plan, type PlanType, type Priority } from '@/utils/data/kehoach-mock-data';
import { SelectInsDecisionModal, type InsDecision } from '@/components/plans/SelectInsDecisionModal';
import { supabase } from '@/api/supabaseClient';
import { useQLTTScope } from '@/contexts/QLTTScopeContext';
import { useAppSelector } from '@/hooks/useAppStore';
import { RootState } from '@/store/rootReducer';
import { createPlanApi, fetchPlanByIdApi, updatePlanApi } from '@/utils/api/plansApi';
import { uploadMultipleFiles } from '@/utils/supabase/storage';

type PlanTypeTab = 'periodic' | 'thematic' | 'urgent';

export function PlanCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { planId } = useParams(); // Get planId from URL params
  const { addPlan, updatePlan: contextUpdatePlan, plans } = usePlans(); // Rename context updatePlan to avoid conflict if we use api directly
  const { scope } = useQLTTScope();
  // Get user from Redux instead of AuthContext
  const { user } = useAppSelector((state: RootState) => state.auth);
  
  // Check if in edit mode
  const isEditMode = !!planId;
  
  // State to hold the plan being edited, fetched from API
  const [fetchedPlan, setFetchedPlan] = useState<Plan | null>(null);

  // Use fetched plan if available, otherwise try finding in context (fallback)
  const editingPlan = fetchedPlan || (isEditMode ? plans.find(p => p.id === planId) : null);
  
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
  
  const generateDefaultCode = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timeStr = String(now.getHours()).padStart(2, '0') + 
                    String(now.getMinutes()).padStart(2, '0') + 
                    String(now.getSeconds()).padStart(2, '0');
    return `KHKT-${year}-${day}-${month}-${timeStr}`;
  };

  const [formData, setFormData] = useState({
    code: generateDefaultCode(),
    planCategory: 'Kiểm tra định kỳ',
    year: '2026',
    quarter: '',
    title: '',
    startDate: '',
    endDate: '',
    responsibleUnit: '',
    responsibleUnitId: '',
    cooperatingUnits: '',
    scopeArea: '',
    description: '',
    objectives: '',
    priority: 'medium' as Priority,
    provinceId: '', // For UI selection
    wardId: '',     // For UI selection
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [provinces, setProvinces] = useState<{_id: string, name: string}[]>([]);
  const [wards, setWards] = useState<{_id: string, name: string}[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  
  // M03 - Quyết định giao quyền
  const [selectedM03, setSelectedM03] = useState<InsDecision | null>(null);
  const [showM03Modal, setShowM03Modal] = useState(false);

  const [managingUnits, setManagingUnits] = useState<{id: string, name: string}[]>([]);

  // Helper functions
  const getPlanTypeLabel = (type: PlanTypeTab): string => {
    switch(type) {
      case 'periodic': return 'Kiểm tra định kỳ';
      case 'thematic': return 'Kiểm tra chuyên đề';
      case 'urgent': return 'Kiểm tra đột xuất';
      default: return 'Kiểm tra định kỳ';
    }
  };

  // Fetch departments based on scope
  useEffect(() => {
    async function fetchManagingUnits() {
      // Use scope.divisionId directly instead of localStorage
      const divisionId = scope.divisionId;
      if (!divisionId) {
          setManagingUnits([]); // Clear if no division selected
          return;
      }

      try {
        // 🔥 FIX: Validate UUID format and resolve department name to UUID if needed
        const isValidUUID = (str: string): boolean => {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          return uuidRegex.test(str);
        };
        
        let actualDivisionId = divisionId;
        
        // Check if divisionId is a valid UUID
        if (!isValidUUID(divisionId)) {
          console.log(`⚠️ PlanCreate: divisionId is not a UUID, searching by name:`, divisionId);
          
          // Try to find department by name
          const { data: deptByName, error: searchError } = await supabase
            .from('departments')
            .select('_id')
            .eq('name', divisionId)
            .is('deleted_at', null)
            .single();
          
          if (searchError || !deptByName) {
            console.error(`❌ PlanCreate: Department not found by name "${divisionId}":`, searchError);
            setManagingUnits([]);
            return;
          }
          
          actualDivisionId = deptByName._id;
          console.log(`✅ PlanCreate: Found department UUID:`, actualDivisionId);
        }
        
        const { data, error } = await supabase
          .from('departments')
          .select('_id, name')
          .eq('parent_id', actualDivisionId);

        if (error) {
          console.error('Error fetching managing units:', error);
          return;
        }

        if (data) {
          // Map _id to id for consistency
          setManagingUnits(data.map((u: any) => ({ id: u._id, name: u.name })));
        }
      } catch (err) {
        console.error('Error fetching managing units:', err);
      }
    }

    fetchManagingUnits();
  }, [scope.divisionId]); // Re-run when division changes

  // Fetch provinces
  useEffect(() => {
    async function fetchProvinces() {
      try {
        const { data, error } = await supabase
          .from('provinces')
          .select('_id, name')
          .order('name');
        
        if (error) {
          console.error('Error fetching provinces:', error);
          return;
        }

        if (data) {
          setProvinces(data);
        }
      } catch (err) {
        console.error('Error fetching provinces:', err);
      }
    }
    fetchProvinces();
  }, []);

  // Fetch wards when province changes
  useEffect(() => {
    async function fetchWards() {
      if (!formData.provinceId) {
        setWards([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('wards')
          .select('_id, name')
          .eq('province_id', formData.provinceId)
          .order('name');
        
        if (error) {
          console.error('Error fetching wards:', error);
          return;
        }

        if (data) {
          setWards(data);
        }
      } catch (err) {
        console.error('Error fetching wards:', err);
      }
    }
    fetchWards();
  }, [formData.provinceId]);

  // Fetch plan data from API when editing
  useEffect(() => {
    async function loadPlan() {
      if (isEditMode && planId) {
        try {
          const plan = await fetchPlanByIdApi(planId);
          if (plan) {
            setFetchedPlan(plan);
            
            // Populate form data immediately upon fetch
            const planYear = new Date(plan.startDate).getFullYear().toString();
            setFormData(prev => ({
              ...prev,
              planCategory: getPlanTypeLabel(plan.planType as PlanTypeTab),
              code: plan.code || prev.code,
              year: planYear,
              quarter: plan.quarter,
              title: plan.name,
              startDate: plan.startDate,
              endDate: plan.endDate,
              responsibleUnit: plan.responsibleUnit,
              responsibleUnitId: plan.leadUnit || '',
              cooperatingUnits: '', 
              scopeArea: plan.scopeLocation,
              description: plan.topic,
              objectives: plan.objectives,
              priority: plan.priority,
              provinceId: (plan as any).provinceId || '',
              wardId: (plan as any).wardId || '',
            }));

            setDateRange({
              startDate: plan.startDate,
              endDate: plan.endDate,
            });

            setActiveTab(plan.planType as PlanTypeTab);
          } else {
            toast.error('Không tìm thấy kế hoạch');
          }
        } catch (error) {
          console.error('Error fetching plan:', error);
          toast.error('Không thể tải thông tin kế hoạch');
        }
      }
    }
    loadPlan();
  }, [isEditMode, planId]);



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

    if (!formData.code.trim()) {
      newErrors.code = 'Vui lòng nhập mã kế hoạch';
    }

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

    if (!formData.provinceId) {
      newErrors.provinceId = 'Vui lòng chọn Tỉnh/Thành phố';
    }

    if (!formData.wardId) {
      newErrors.wardId = 'Vui lòng chọn Phường/Xã';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsSubmitting(true);
    let uploadedAttachments: any[] = [];
    
    try {
      if (attachments.length > 0) {
        uploadedAttachments = await uploadMultipleFiles('vhv_file', attachments, 'plans');
      }
    } catch (uploadError) {
      console.error('File upload failed:', uploadError);
      toast.error('Lỗi khi tải tài liệu lên. Vui lòng thử lại.');
      setIsSubmitting(false);
      return;
    }

    if (isEditMode && planId) {
      // Edit existing plan
      const updates: Partial<Plan> = {
        name: formData.title,
        code: formData.code,
        planType: activeTab as PlanType,
        quarter: formData.quarter || '-',
        topic: formData.description || 'N/A',
        scope: formData.scopeArea || 'Toàn quốc',
        scopeLocation: formData.scopeArea || 'Toàn quốc',
        responsibleUnit: formData.responsibleUnit,
        leadUnit: formData.responsibleUnitId,
        objectives: formData.objectives || 'N/A',
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        priority: formData.priority,
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
      };
      
      try {
        await updatePlanApi(planId, updates);
        contextUpdatePlan(planId, updates);
        toast.success(`Đã cập nhật kế hoạch "${formData.title}" thành công!`);
        navigate('/plans/list');
      } catch (error) {
        console.error('Failed to update plan:', error);
        toast.error('Lỗi khi cập nhật kế hoạch. Vui lòng thử lại.');
      }
    } else {
      // Create new plan
      // Note: ID will be generated by Backend, but we keep frontend ID for mock context if needed
      const newPlanId = `KH-${activeTab === 'periodic' ? 'DK' : activeTab === 'thematic' ? 'CD' : 'DX'}-${String(plans.length + 1).padStart(4, '0')}`;
      
      // Resolve Province/Ward IDs (required by DB schema)
      // Already selected in UI
      const provinceId = formData.provinceId;
      const wardId = formData.wardId;

      const newPlan: any = {
        id: newPlanId,
        code: formData.code,
        name: formData.title,
        planType: activeTab as PlanType,
        quarter: formData.quarter || '-',
        topic: formData.description || 'N/A',
        scope: formData.scopeArea || 'Toàn quốc',
        scopeLocation: formData.scopeArea || 'Toàn quốc',
        responsibleUnit: formData.responsibleUnit,
        leadUnit: formData.responsibleUnitId,
        objectives: formData.objectives || 'N/A',
        status: 'draft',
        priority: formData.priority,
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        // Pass resolved UUIDs
        provinceId: provinceId,
        wardId: wardId,
        createdBy: user?.fullName || 'Người tạo hiện tại',
        createdById: user?._id,
        createdAt: new Date().toISOString(),
        attachments: uploadedAttachments,
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
      
      try {
          await createPlanApi(newPlan);
          addPlan(newPlan); // Optional: Keep updating local context for immediate feedback if List page uses it
          toast.success(`Đã tạo kế hoạch "${formData.title}" thành công!`);
          navigate('/plans/list');
      } catch (error) {
          console.error('Failed to create plan:', error);
          toast.error('Lỗi khi tạo kế hoạch. Vui lòng thử lại.');
      } finally {
          setIsSubmitting(false);
      }
    }
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
        <div className={styles.headerContent}>
          <button onClick={handleCancel} className={styles.backButton} title="Quay lại">
            <ArrowLeft size={20} />
          </button>
          <div className={styles.headerIcon}>
            <FileText size={32} />
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.title}>
              {isEditMode 
                ? `Chỉnh sửa ${editingPlan?.name || 'kế hoạch'}`
                : 'Thiết lập kế hoạch kiểm tra mới'}
            </h1>
            <p className={styles.subtitle}>
              {isEditMode 
                ? 'Cập nhật thông tin chi tiết của kế hoạch kiểm tra' 
                : 'Vui lòng cung cấp đầy đủ thông tin để khởi tạo kế hoạch kiểm tra. Hệ thống sẽ tự động liên kết dữ liệu liên quan.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs - Hidden in Edit Mode */}
      {!isEditMode && (
        <div className={styles.tabs}>
          <button
            className={cn(styles.tab, activeTab === 'periodic' && styles.tabActive)}
            onClick={() => handleTabChange('periodic')}
          >
            Định kỳ
          </button>
          <button
            className={cn(styles.tab, activeTab === 'thematic' && styles.tabActive)}
            onClick={() => handleTabChange('thematic')}
          >
            Chuyên đề
          </button>
          <button
            className={cn(styles.tab, activeTab === 'urgent' && styles.tabActive)}
            onClick={() => handleTabChange('urgent')}
          >
            Đột xuất
          </button>
        </div>
      )}

      {/* Form Container */}
      <div className={styles.container}>
        <div className={styles.formContent}>
          <form id="plan-create-form" onSubmit={handleSubmit} className={styles.form}>
            
            {/* Section 1: Basic Info */}
            <div className={styles.section}>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.label}>
                    Mã kế hoạch <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={cn(styles.input, errors.code && styles.inputError)}
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    placeholder="Ví dụ: KHKT-2025-01..."
                  />
                  {errors.code && (
                    <span className={styles.errorText}>
                      <AlertCircle size={14} />
                      {errors.code}
                    </span>
                  )}
                </div>

                {activeTab === 'periodic' && (
                  <div className={styles.formField}>
                    <label className={styles.label}>
                      Năm kế hoạch <span className={styles.required}>*</span>
                    </label>
                    <select
                      className={cn(styles.select, errors.year && styles.inputError)}
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
                      <span className={styles.errorText}><AlertCircle size={14} />{errors.year}</span>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>
                  Tiêu đề kế hoạch <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={cn(styles.input, errors.title && styles.inputError)}
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Ví dụ: Kế hoạch kiểm tra định kỳ Quý I/2026"
                />
                {errors.title && (
                  <span className={styles.errorText}><AlertCircle size={14} />{errors.title}</span>
                )}
              </div>
            </div>

            {/* Section 2: Timing & Target */}
            <div className={styles.section}>
              <div className={styles.formRow}>
                {activeTab === 'periodic' && (
                  <div className={styles.formField}>
                    <label className={styles.label}>
                      Quý / Tháng <span className={styles.required}>*</span>
                    </label>
                    <select
                      className={cn(styles.select, errors.quarter && styles.inputError)}
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
                      <span className={styles.errorText}><AlertCircle size={14} />{errors.quarter}</span>
                    )}
                  </div>
                )}

                <div className={styles.formField}>
                  <label className={styles.label}>
                    Thời gian thực hiện <span className={styles.required}>*</span>
                  </label>
                  <DateRangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    placeholder="Chọn khoảng thời gian"
                  />
                  {(errors.startDate || errors.endDate) && (
                    <span className={styles.errorText}>
                      <AlertCircle size={14} />
                      {errors.startDate || errors.endDate}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>
                  Khu vực kiểm tra <span className={styles.required}>*</span>
                </label>
                <div className={styles.formRow}>
                  <select
                    className={cn(styles.select, errors.provinceId && styles.inputError)}
                    value={formData.provinceId}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange('provinceId', val);
                      handleChange('wardId', '');
                    }}
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                  
                  <select
                    className={cn(styles.select, errors.wardId && styles.inputError)}
                    value={formData.wardId}
                    onChange={(e) => handleChange('wardId', e.target.value)}
                    disabled={!formData.provinceId}
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards.map(w => (
                      <option key={w._id} value={w._id}>{w.name}</option>
                    ))}
                  </select>
                </div>
                {(errors.provinceId || errors.wardId) && (
                  <span className={styles.errorText}><AlertCircle size={14} />{errors.provinceId || errors.wardId}</span>
                )}
              </div>
            </div>

            {/* Section 3: Responsibilities */}
            <div className={styles.section}>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.label}>
                    Đơn vị chủ trì <span className={styles.required}>*</span>
                  </label>
                  <select
                    className={cn(styles.select, errors.responsibleUnit && styles.inputError)}
                    value={formData.responsibleUnitId || formData.responsibleUnit}
                    onChange={(e) => {
                      const unitId = e.target.value;
                      const unit = managingUnits.find(u => u.id === unitId);
                      setFormData(prev => ({
                        ...prev,
                        responsibleUnit: unit ? unit.name : unitId,
                        responsibleUnitId: unitId
                      }));
                      if (errors.responsibleUnit) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.responsibleUnit;
                          return newErrors;
                        });
                      }
                    }}
                  >
                    <option value="">Chọn đơn vị...</option>
                    {managingUnits.length > 0 ? (
                      managingUnits.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                      ))
                    ) : (
                      <>
                        <option value="Sở Công Thương">Sở Công Thương</option>
                        <option value="Thanh tra Sở">Thanh tra Sở</option>
                        <option value="Chi cục QLTT">Chi cục QLTT</option>
                      </>
                    )}
                  </select>
                  {errors.responsibleUnit && (
                    <span className={styles.errorText}><AlertCircle size={14} />{errors.responsibleUnit}</span>
                  )}
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Mức độ ưu tiên</label>
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
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>Đơn vị phối hợp</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.cooperatingUnits}
                  onChange={(e) => handleChange('cooperatingUnits', e.target.value)}
                  placeholder="Ví dụ: Sở Công Thương, Chi cục QLTT..."
                />
              </div>
            </div>

            {/* Section 4: External Documents (M03) */}
            <div className={styles.section}>
              <div className={styles.formField}>
                <label className={styles.label}>
                  Quyết định giao quyền (Mẫu số 03)
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
                      <X size={18} />
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
            </div>

            {/* Section 5: Description & Attachments */}
            <div className={styles.section}>
              <div className={styles.formField}>
                <label className={styles.label}>Mục tiêu kiểm tra</label>
                <textarea
                  className={styles.textarea}
                  value={formData.objectives}
                  onChange={(e) => handleChange('objectives', e.target.value)}
                  placeholder="Nhập các mục tiêu cụ thể của kế hoạch này..."
                  rows={4}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>Mô tả kế hoạch</label>
                <textarea
                  className={styles.textarea}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Mô tả tóm tắt nội dung, phạm vi hoặc các lưu ý đặc biệt..."
                  rows={4}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>Tài liệu đính kèm</label>
                <div className={styles.fileUploadContainer}>
                  <input
                    type="file"
                    id="plan-attachments"
                    multiple
                    className={styles.fileInput}
                    onChange={(e) => {
                      if (e.target.files) {
                        setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }}
                  />
                  <label htmlFor="plan-attachments" className={styles.fileLabel}>
                    <Upload size={24} />
                    <span>Kéo thả hoặc nhấn để tải lên tài liệu</span>
                    <span className={styles.helpTextSmall}>Hỗ trợ PDF, DOCX, XLSX (Tối đa 10MB)</span>
                  </label>

                  {attachments.length > 0 && (
                    <div className={styles.fileList}>
                      {attachments.map((file, index) => (
                        <div key={index} className={styles.fileItem}>
                          <div className={styles.fileInfo}>
                            <FileText size={16} className={styles.fileIcon} />
                            <span className={styles.fileName}>{file.name}</span>
                            <span className={styles.fileSize}>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            type="button"
                            className={styles.removeFileButton}
                            onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={styles.footer}>
        <div className={styles.footerButtons}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            form="plan-create-form" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinner} />
                Đang xử lý...
              </>
            ) : (
              <>
                <FileText size={20} />
                {isEditMode ? 'Cập nhật kế hoạch' : 'Khởi tạo kế hoạch'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showM03Modal && (
        <SelectInsDecisionModal
          open={showM03Modal}
          onOpenChange={setShowM03Modal}
          documentCode="M03"
          documentName="Quyết định giao quyền ban hành quyết định kiểm tra"
          onSelect={(decision) => {
            setSelectedM03(decision);
            toast.success(`Đã chọn ${decision.code}`);
            setShowM03Modal(false);
          }}
        />
      )}
    </div>
  );
}
