import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertCircle, 
  ChevronRight,
  ChevronLeft,
  FileText,
  Store,
  CheckCircle2,
  X,
  Search,
  Upload,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './InspectionRoundCreate.module.css';
import { cn } from '@/components/ui/utils';
import DateRangePicker, { DateRange } from '@/components/ui-kit/DateRangePicker';
import { useSupabaseInspectionRounds } from '@/hooks/useSupabaseInspectionRounds';
import type { InspectionRound } from '@/types/inspections';
import type { Plan } from '@/types/plans';
import { fetchPlansApi } from '@/utils/api/plansApi';
import { fetchMerchants } from '@/utils/api/merchantsApi';
import type { Restaurant } from '@/utils/data/restaurantData';
import { supabase } from '@/api/supabaseClient';
import { uploadMultipleFiles } from '@/utils/supabase/storage';
import {
  InspectionDecisionModal,
  AssignmentDecisionModal,
  type InsDecision,
} from '@/components/inspections/InspectionRoundDecisionModals';


type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

interface FormData {
  code: string;
  name: string;
  relatedPlanId: string;
  startDate: string | null;
  endDate: string | null;
  leadUnit: string;
  leadUnitId?: string; // Add leadUnitId
  provinceId: string;
  wardId: string;
  priority: PriorityLevel;
  selectedForms: string[];
  selectedStores: string[];
  attachments: File[];
}

const mockForms = [
  { 
    id: 'M01', 
    name: 'Mẫu 01 - An toàn thực phẩm',
    criteria: [
      'Giấy chứng nhận đủ điều kiện an toàn thực phẩm',
      'Nguồn gốc xuất xứ nguyên liệu',
      'Điều kiện bảo quản thực phẩm',
      'Vệ sinh cơ sở sản xuất',
      'Sức khỏe người trực tiếp sản xuất, chế biến',
      'Quy trình sản xuất, chế biến',
      'Nhãn mác sản phẩm',
      'Hồ sơ lưu trữ về nguồn gốc, xuất xứ',
      'Kiểm nghiệm định kỳ sản phẩm',
      'Công bố chất lượng sản phẩm'
    ]
  },
  { 
    id: 'M02', 
    name: 'Mẫu 02 - Phòng cháy chữa cháy',
    criteria: [
      'Phương án phòng cháy chữa cháy',
      'Hệ thống báo cháy tự động',
      'Bình chữa cháy và thiết bị PCCC',
      'Lối thoát hiểm và biển chỉ dẫn',
      'Hệ thống điện an toàn',
      'Đào tạo nghiệp vụ PCCC cho nhân viên',
      'Kế hoạch diễn tập PCCC',
      'Kiểm tra, bảo dưỡng thiết bị PCCC định kỳ'
    ]
  },
  { 
    id: 'M03', 
    name: 'Mẫu 03 - Môi trường',
    criteria: [
      'Giấy phép môi trường',
      'Hệ thống xử lý nước thải',
      'Quản lý chất thải rắn',
      'Kiểm soát khí thải, bụi',
      'Phân loại rác tại nguồn',
      'Báo cáo giám sát môi trường định kỳ',
      'Kế hoạch ứng phó sự cố môi trường',
      'Cam kết bảo vệ môi trường'
    ]
  },
  { 
    id: 'M04', 
    name: 'Mẫu 04 - Vệ sinh môi trường kinh doanh',
    criteria: [
      'Vệ sinh khu vực bán hàng',
      'Vệ sinh kho bãi, nơi chứa hàng',
      'Thu gom và xử lý rác thải',
      'Vệ sinh nhà vệ sinh công cộng',
      'Không lấn chiếm vỉa hè',
      'Biển hiệu, bảng quảng cáo đúng quy định',
      'Không gây ô nhiễm tiếng ồn'
    ]
  },
  { 
    id: 'M05', 
    name: 'Mẫu 05 - Thuế và kế toán',
    criteria: [
      'Giấy chứng nhận đăng ký kinh doanh',
      'Mã số thuế',
      'Hóa đơn chứng từ hợp pháp',
      'Kê khai thuế đầy đủ, đúng hạn',
      'Sổ sách kế toán theo quy định',
      'Nộp thuế đầy đủ, đúng hạn',
      'Báo cáo tài chính định kỳ'
    ]
  },
  { 
    id: 'M06', 
    name: 'Mẫu 06 - Biên bản làm việc (BB-KT)',
    criteria: [
      'Ghi nhận vi phạm tại hiện trường',
      'Chụp ảnh chứng cứ vi phạm',
      'Thu thập mẫu vật vi phạm',
      'Lập biên bản vi phạm hành chính',
      'Chữ ký xác nhận của chủ cơ sở',
      'Biện pháp xử lý vi phạm',
      'Thời hạn khắc phục',
      'Cam kết không tái phạm'
    ]
  },
  { 
    id: 'M07', 
    name: 'Mẫu 07 - Quản lý giá cả',
    criteria: [
      'Niêm yết giá rõ ràng',
      'Không bán hàng cao hơn giá niêm yết',
      'Không tăng giá đột biến',
      'Bán đúng giá quy định với hàng bình ổn giá',
      'Hóa đơn ghi đầy đủ giá bán',
      'Không gian lận về giá cả'
    ]
  },
];

export default function InspectionRoundCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planIdFromUrl = searchParams.get('planId');
  const editMode = searchParams.get('mode') === 'edit';
  const editId = searchParams.get('id');
  
  const { createRound, updateRound, getRoundById } = useSupabaseInspectionRounds(undefined, false);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [realPlans, setRealPlans] = useState<Plan[]>([]);
  const [provinces, setProvinces] = useState<{_id: string, name: string}[]>([]);
  const [wards, setWards] = useState<{_id: string, name: string}[]>([]);
  const [realMerchants, setRealMerchants] = useState<Restaurant[]>([]);
  const [loadingMerchants, setLoadingMerchants] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    code: '',
    name: '',
    relatedPlanId: planIdFromUrl || '',
    startDate: null,
    endDate: null,
    leadUnit: '',
    leadUnitId: '', // Initialize leadUnitId
    priority: 'medium',
    provinceId: '',
    wardId: '',
    selectedForms: [],
    selectedStores: [],
    attachments: [],
  });

  useEffect(() => {
    if (!editMode) {
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
      const generatedCode = `DKT-${year}-${month}-${random}`;
      setFormData(prev => ({
        ...prev,
        code: generatedCode,
        name: `Đợt kiểm tra ${generatedCode}`
      }));
    }
  }, [editMode]);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchPlansApi();
        setRealPlans(data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };
    loadPlans();
  }, []);

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const { data } = await supabase.from('provinces').select('_id, name').order('name');
        if (data) setProvinces(data);
      } catch (err) {
        console.error('Error fetching provinces:', err);
      }
    }
    fetchProvinces();
  }, []);

  useEffect(() => {
    async function fetchWards() {
      if (!formData.provinceId) {
        setWards([]);
        return;
      }
      try {
        const { data } = await supabase.from('wards').select('_id, name').eq('province_id', formData.provinceId).order('name');
        if (data) setWards(data);
      } catch (err) {
        console.error('Error fetching wards:', err);
      }
    }
    fetchWards();
  }, [formData.provinceId]);

  useEffect(() => {
    async function loadMerchants() {
      try {
        setLoadingMerchants(true);
        const merchants = await fetchMerchants(undefined, undefined, undefined, formData.provinceId || undefined, formData.wardId || undefined);
        setRealMerchants(merchants || []);
      } catch (err) {
        console.error('Error fetching merchants:', err);
      } finally {
        setLoadingMerchants(false);
      }
    }
    loadMerchants();
  }, [formData.provinceId, formData.wardId]);

  useEffect(() => {
    async function loadData() {
      if (editMode && editId) {
        const existingRound = await getRoundById(editId);
        if (existingRound) {
          setFormData({
            code: existingRound.code || existingRound.id,
            name: existingRound.name,
            relatedPlanId: existingRound.planId || '',
            startDate: existingRound.startDate,
            endDate: existingRound.endDate,
            leadUnit: existingRound.leadUnit,
            priority: (existingRound.priority as PriorityLevel) || 'medium',
            provinceId: (existingRound as any).provinceId || '',
            wardId: (existingRound as any).wardId || '',
            selectedForms: [], 
            selectedStores: [],
            attachments: [],
          });
        }
      }
    }
    loadData();
  }, [editMode, editId, getRoundById]);

  const [userRole] = useState<'district' | 'ward'>('district');
  const userWard = 'Phường Bến Nghé';

  const [storeFilters] = useState({ highRisk: false });
  const [storeSearchQuery, setStoreSearchQuery] = useState('');

  const [inspectionDecisionModalOpen, setInspectionDecisionModalOpen] = useState(false);
  const [assignmentDecisionModalOpen, setAssignmentDecisionModalOpen] = useState(false);

  const [inspectionDecision, setInspectionDecision] = useState<InsDecision | null>(null);
  const [assignmentDecision, setAssignmentDecision] = useState<InsDecision | null>(null);

  const filteredStores = realMerchants.filter(store => {
    if (storeSearchQuery.trim()) {
      const query = storeSearchQuery.toLowerCase();
      return store.name.toLowerCase().includes(query) || store.address.toLowerCase().includes(query) || store.type.toLowerCase().includes(query);
    }
    return true;
  });

  const handleChange = (field: keyof FormData, value: any) => {
    if (field === 'relatedPlanId') {
      const selectedPlan = realPlans.find(p => p.id === value);
      setFormData(prev => ({
        ...prev,
        relatedPlanId: value,
        provinceId: selectedPlan?.provinceId || '',
        wardId: selectedPlan?.wardId || '',
        leadUnitId: selectedPlan?.leadUnit || '', // Set leadUnitId from selected plan
        leadUnit: selectedPlan?.responsibleUnit || prev.leadUnit, // Optional: auto-fill leadUnit name
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleDateRangeChange = (range: DateRange) => {
    setFormData(prev => ({ ...prev, startDate: range.startDate, endDate: range.endDate }));
    if (errors.dateRange) setErrors(prev => { const n = { ...prev }; delete n.dateRange; return n; });
  };

  const validateStep1 = (show = true) => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Vui lòng nhập tên đợt kiểm tra';
    if (!formData.startDate || !formData.endDate) errs.dateRange = 'Vui lòng chọn thời gian thực hiện';
    if (!formData.relatedPlanId) errs.relatedPlanId = 'Vui lòng chọn kế hoạch liên quan';
    if (userRole !== 'ward' && !formData.leadUnit) errs.leadUnit = 'Vui lòng chọn người chủ trì';
    if (show) setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (currentStep < 3 && validateStep1()) setCurrentStep(currentStep + 1); };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let uploaded: any[] = [];
      if (formData.attachments.length > 0) {
        uploaded = await uploadMultipleFiles('vhv_file', formData.attachments, 'inspection-rounds');
      }

      if (editMode && editId) {
        await updateRound(editId, {
          name: formData.name,
          planId: formData.relatedPlanId,
          startDate: formData.startDate!,
          endDate: formData.endDate!,
          leadUnit: formData.leadUnit || userWard,
          leadUnitId: formData.leadUnitId, // Pass department_id from plan
          totalTargets: formData.selectedStores.length,
          provinceId: formData.provinceId,
          wardId: formData.wardId,
          priority: formData.priority,
          attachments: uploaded.length > 0 ? uploaded : undefined,
        });
        toast.success('Cập nhật thành công');
      } else {
        await createRound({
          code: formData.code,
          name: formData.name,
          planId: formData.relatedPlanId,
          status: 'draft',
          startDate: formData.startDate!,
          endDate: formData.endDate!,
          leadUnit: formData.leadUnit || userWard,
          leadUnitId: formData.leadUnitId, // Pass department_id from plan
          totalTargets: formData.selectedStores.length,
          inspectedTargets: 0,
          provinceId: formData.provinceId,
          wardId: formData.wardId,
          priority: formData.priority,
          createdAt: new Date().toISOString().split('T')[0],
          attachments: uploaded,
        });
        toast.success('Khởi tạo thành công');
      }
      navigate('/plans/inspection-rounds');
    } catch (err) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const approvedPlans = realPlans.filter(p => p.status === 'approved' || p.status === 'active');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.backButton} onClick={() => navigate('/plans/inspection-rounds')}>
            <ArrowLeft size={20} />
          </button>
          <div className={styles.headerIcon}><Store size={32} /></div>
          <div className={styles.headerText}>
            <h1 className={styles.title}>{editMode ? 'Chỉnh sửa đợt kiểm tra' : 'Khởi tạo đợt kiểm tra'}</h1>
            <p className={styles.subtitle}>Bước {currentStep}/3: {currentStep === 1 ? 'Thông tin chung' : currentStep === 2 ? 'Tiêu chí kiểm tra' : 'Đối tượng kiểm tra'}</p>
          </div>
        </div>
      </div>

      <div className={styles.stepsContainer}>
        <div className={styles.steps}>
          {[1, 2, 3].map(step => (
            <div key={step} className={cn(styles.step, currentStep >= step && styles.stepActive, step > 1 && !validateStep1(false) && styles.stepDisabled)} onClick={() => (step === 1 || validateStep1()) && setCurrentStep(step)}>
              <div className={styles.stepNumber}>{currentStep > step ? <CheckCircle2 size={18} /> : step}</div>
              <div className={styles.stepLabel}>{step === 1 ? 'Thông tin chung' : step === 2 ? 'Tiêu chí' : 'Cửa hàng'}</div>
              {step < 3 && <div className={styles.stepDivider} />}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.form}>
            {currentStep === 1 && (
              <div className={styles.section}>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label className={styles.label}>Mã đợt kiểm tra</label>
                    <input className={styles.input} value={formData.code} readOnly disabled />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.label}>Độ ưu tiên</label>
                    <select className={styles.select} value={formData.priority} onChange={e => handleChange('priority', e.target.value)}>
                      <option value="low">Thấp</option>
                      <option value="medium">Trung bình</option>
                      <option value="high">Cao</option>
                      <option value="urgent">Khẩn cấp</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Tên đợt kiểm tra <span className={styles.required}>*</span></label>
                  <input className={cn(styles.input, errors.name && styles.inputError)} value={formData.name} onChange={e => handleChange('name', e.target.value)} placeholder="Nhập tên đợt kiểm tra..." />
                  {errors.name && <div className={styles.errorMessage}><AlertCircle size={14} />{errors.name}</div>}
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Kế hoạch liên quan <span className={styles.required}>*</span></label>
                  <select className={cn(styles.select, errors.relatedPlanId && styles.inputError)} value={formData.relatedPlanId} onChange={e => handleChange('relatedPlanId', e.target.value)} disabled={!!planIdFromUrl}>
                    <option value="">Chọn kế hoạch...</option>
                    {approvedPlans.map(p => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}
                  </select>
                  {errors.relatedPlanId && <div className={styles.errorMessage}><AlertCircle size={14} />{errors.relatedPlanId}</div>}
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Thời gian thực hiện <span className={styles.required}>*</span></label>
                  <DateRangePicker value={{ startDate: formData.startDate, endDate: formData.endDate }} onChange={handleDateRangeChange} />
                  {errors.dateRange && <div className={styles.errorMessage}><AlertCircle size={14} />{errors.dateRange}</div>}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label className={styles.label}>Người chủ trì</label>
                    {userRole === 'ward' ? <div className={styles.readOnlyField}>{userWard}</div> : (
                      <select className={cn(styles.select, errors.leadUnit && styles.inputError)} value={formData.leadUnit} onChange={e => handleChange('leadUnit', e.target.value)}>
                        <option value="">Chọn người chủ trì...</option>
                        <option value="Nguyễn Minh Tuấn">Nguyễn Minh Tuấn</option>
                        <option value="Phạm Thị Hương">Phạm Thị Hương</option>
                        <option value="Lê Văn Hùng">Lê Văn Hùng</option>
                        <option value="Trần Thu Hà">Trần Thu Hà</option>
                        <option value="Hoàng Văn Nam">Hoàng Văn Nam</option>
                      </select>
                    )}
                    {errors.leadUnit && <div className={styles.errorMessage}><AlertCircle size={14} />{errors.leadUnit}</div>}
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.label}>Khu vực</label>
                    <div className={styles.readOnlyField}>{provinces.find(p => p._id === formData.provinceId)?.name || 'N/A'} - {wards.find(w => w._id === formData.wardId)?.name || 'N/A'}</div>
                  </div>
                </div>

                <div className={styles.formField}>
                   <label className={styles.label}>Quyết định kiểm tra</label>
                   {inspectionDecision ? (
                     <div className={styles.selectedDecisionBox}>
                        <div className={styles.headerText}>
                          <div className={styles.selectedDecisionCode}>{inspectionDecision.code}</div>
                          <div className={styles.selectedDecisionTitle}>{inspectionDecision.title}</div>
                        </div>
                        <button onClick={() => setInspectionDecision(null)} className={styles.removeButton}><X size={16} /></button>
                     </div>
                   ) : (
                     <button className={styles.importButton} onClick={() => setInspectionDecisionModalOpen(true)}><FileText size={18} /> Chọn từ hệ thống INS</button>
                   )}
                </div>

                <div className={styles.formField}>
                   <label className={styles.label}>Quyết định phân công</label>
                   {assignmentDecision ? (
                     <div className={styles.selectedDecisionBox}>
                        <div className={styles.headerText}>
                          <div className={styles.selectedDecisionCode}>{assignmentDecision.code}</div>
                          <div className={styles.selectedDecisionTitle}>{assignmentDecision.title}</div>
                        </div>
                        <button onClick={() => setAssignmentDecision(null)} className={styles.removeButton}><X size={16} /></button>
                     </div>
                   ) : (
                     <button className={styles.importButton} onClick={() => setAssignmentDecisionModalOpen(true)}><FileText size={18} /> Chọn từ hệ thống INS</button>
                   )}
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Tài liệu đính kèm</label>
                  <div className={styles.fileUploadContainer}>
                    <input type="file" id="round-attachments" multiple className={styles.fileInput} onChange={(e) => { if (e.target.files) setFormData(p => ({ ...p, attachments: [...p.attachments, ...Array.from(e.target.files!)] })); }} />
                    <label htmlFor="round-attachments" className={styles.fileLabel}>
                      <Upload size={24} />
                      <span>Nhấn để chọn hoặc kéo thả tài liệu</span>
                      <span className={styles.helpText}>PDF, JPG, PNG...</span>
                    </label>
                    {formData.attachments.length > 0 && (
                      <div className={styles.fileList}>
                        {formData.attachments.map((file, i) => (
                          <div key={i} className={styles.fileItem}>
                            <span className={styles.fileName}>{file.name}</span>
                            <button onClick={() => setFormData(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) }))} className={styles.removeFileButton}><X size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className={styles.section}>
                <div className={styles.sectionTitleRow}>
                  <h3 className={styles.sectionTitle}><FileText size={20} /> Tiêu chí kiểm tra</h3>
                  <span className={styles.selectedCount}>{formData.selectedForms.length} biểu mẫu</span>
                </div>
                <div className={styles.formsGrid}>
                  {mockForms.map(f => (
                    <div key={f.id} className={cn(styles.formCard, formData.selectedForms.includes(f.id) && styles.formCardSelected)} onClick={() => setFormData(prev => ({ ...prev, selectedForms: prev.selectedForms.includes(f.id) ? prev.selectedForms.filter(id => id !== f.id) : [...prev.selectedForms, f.id] }))}>
                      <div className={styles.formCardIcon}><FileText size={20} /></div>
                      <div className={styles.headerText}>
                        <div className={styles.formId}>{f.id}</div>
                        <div className={styles.formName}>{f.name}</div>
                      </div>
                      <CheckCircle2 size={24} color={formData.selectedForms.includes(f.id) ? "var(--primary)" : "#e2e8f0"} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className={styles.section}>
                <div className={styles.sectionTitleRow}>
                  <h3 className={styles.sectionTitle}><Store size={20} /> Danh sách cửa hàng</h3>
                  <span className={styles.selectedCount}>{formData.selectedStores.length} đơn vị</span>
                </div>
                <div className={styles.searchBox}><Search size={18} /><input className={cn(styles.input, styles.searchInput)} placeholder="Tìm kiếm..." value={storeSearchQuery} onChange={e => setStoreSearchQuery(e.target.value)} /></div>
                {loadingMerchants ? <div className={styles.spinner} /> : (
                  <div className={styles.storesGridContainer}>
                    {filteredStores.map(s => (
                      <div key={s.id} className={cn(styles.storeCard, formData.selectedStores.includes(s.id) && styles.storeCardSelected)} onClick={() => setFormData(p => ({ ...p, selectedStores: p.selectedStores.includes(s.id) ? p.selectedStores.filter(id => id !== s.id) : [...p.selectedStores, s.id] }))}>
                        <div className={styles.storeCardIcon}><Store size={20} /></div>
                        <div className={styles.headerText}><div className={styles.storeCardName}>{s.name}</div><div className={styles.storeCardMeta}>{s.type} • {s.address}</div></div>
                        <CheckCircle2 size={24} color={formData.selectedStores.includes(s.id) ? "var(--primary)" : "#e2e8f0"} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerActions}>
          <button className={styles.cancelButton} onClick={() => (currentStep > 1 ? handleBack() : navigate('/plans/inspection-rounds'))}>{currentStep > 1 ? 'Quay lại' : 'Hủy bỏ'}</button>
          {currentStep < 3 ? <button className={styles.nextButton} onClick={handleNext}>Tiếp theo <ChevronRight size={20} /></button> : (
            <button className={styles.submitButton} onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <div className={styles.spinner} /> : <CheckCircle2 size={20} />}
              {editMode ? 'Cập nhật đợt' : 'Khởi tạo đợt'}
            </button>
          )}
        </div>
      </div>

      {inspectionDecisionModalOpen && <InspectionDecisionModal open={inspectionDecisionModalOpen} onOpenChange={setInspectionDecisionModalOpen} onSelect={d => { setInspectionDecision(d); setInspectionDecisionModalOpen(false); }} />}
      {assignmentDecisionModalOpen && <AssignmentDecisionModal open={assignmentDecisionModalOpen} onOpenChange={setAssignmentDecisionModalOpen} onSelect={d => { setAssignmentDecision(d); setAssignmentDecisionModalOpen(false); }} />}
    </div>
  );
}
