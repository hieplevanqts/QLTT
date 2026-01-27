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
  Eye,
  X,
  Search,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './InspectionRoundCreate.module.css';
import DateRangePicker, { DateRange } from '@/ui-kit/DateRangePicker';
import { mockStores } from '@/data/mockStores';
import { useSupabaseInspectionRounds } from '@/hooks/useSupabaseInspectionRounds';
import type { InspectionRound } from '@/app/data/inspection-rounds-mock-data';
import type { Plan } from '@/app/types/plans';
import { fetchPlansApi } from '@/utils/api/plansApi';
import {
  InspectionDecisionModal,
  AssignmentDecisionModal,
  AmendmentDecisionModal,
  ExtensionDecisionModal,
  type InsDecision,
} from '@/app/components/inspections/InspectionRoundDecisionModals';


type PriorityLevel = 'low' | 'medium' | 'high';

interface FormData {
  // Step 1: Thông tin chung
  code: string; // Auto-generated
  name: string;
  relatedPlanId: string;
  startDate: string | null;
  endDate: string | null;
  leadUnit: string;
  scopeArea: string;
  priority: PriorityLevel;
  
  // Step 2: Tiêu chí kiểm tra
  selectedForms: string[];
  
  // Step 3: Cửa hàng
  selectedStores: number[];
}

// Mock biểu mẫu data
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
  
  // Use real API hook
  const { createRound, updateRound, getRoundById } = useSupabaseInspectionRounds(undefined, false); // false = don't fetch list automatically
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [realPlans, setRealPlans] = useState<Plan[]>([]);

  // Fetch plans on mount
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
  
  // Generate code first
  const generatedCode = `DKT-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
  
  const [formData, setFormData] = useState<FormData>({
    code: generatedCode,
    name: `Đợt kiểm tra ${generatedCode}`,
    relatedPlanId: planIdFromUrl || '',
    startDate: null,
    endDate: null,
    leadUnit: '',
    scopeArea: '',
    priority: 'medium',
    selectedForms: [],
    selectedStores: [],
  });

  // Check if round is approved (for edit mode) - now handled via state since fetch is async
  const [isApproved, setIsApproved] = useState(false);

  // Load data if in edit mode
  useEffect(() => {
    async function loadData() {
        if (editMode && editId) {
        const existingRound = await getRoundById(editId);
        if (existingRound) {
            setIsApproved(existingRound.status === 'approved');
            // Map existing round data to form data
            setFormData({
            code: existingRound.code || existingRound.id, // Fallback to ID if code missing
            name: existingRound.name,
            relatedPlanId: existingRound.planId || '',
            startDate: existingRound.startDate,
            endDate: existingRound.endDate,
            leadUnit: existingRound.leadUnit, // owner_dept
            scopeArea: existingRound.leadUnit, // Using leadUnit as scopeArea for now
            priority: 'medium', // Default since we don't have this in InspectionRound type yet perfectly mapped
            selectedForms: [], // Would need to be stored in InspectionRound type in backend
            selectedStores: [], // Would need to map from targets/stats
            });
        } else {
            toast.error('Không tìm thấy đợt kiểm tra');
            navigate('/plans/inspection-rounds');
        }
        }
    }
    loadData();
  }, [editMode, editId, navigate, getRoundById]);

  // Mock user role - Change this to test different scenarios
  const [userRole] = useState<'district' | 'ward'>('district');
  const userWard = 'Phường Bến Nghé'; // For ward users

  // Filter stores based on selection
  const [storeFilters, setStoreFilters] = useState({
    highRisk: false,
    manyComplaints: false,
  });

  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const [showFormDetailModal, setShowFormDetailModal] = useState<string | null>(null);

  // INS Decision modals state
  const [inspectionDecisionModalOpen, setInspectionDecisionModalOpen] = useState(false);
  const [assignmentDecisionModalOpen, setAssignmentDecisionModalOpen] = useState(false);
  const [amendmentDecisionModalOpen, setAmendmentDecisionModalOpen] = useState(false);
  const [extensionDecisionModalOpen, setExtensionDecisionModalOpen] = useState(false);

  // Selected decisions
  const [inspectionDecision, setInspectionDecision] = useState<InsDecision | null>(null);
  const [assignmentDecision, setAssignmentDecision] = useState<InsDecision | null>(null);
  const [amendmentDecision, setAmendmentDecision] = useState<InsDecision | null>(null);
  const [extensionDecision, setExtensionDecision] = useState<InsDecision | null>(null);

  // Filter stores
  const filteredStores = mockStores.filter(store => {
    // Apply filter conditions
    if (storeFilters.highRisk && store.riskLevel !== 'high') return false;
    if (storeFilters.manyComplaints && !store.hasComplaints) return false;
    
    // Apply search query
    if (storeSearchQuery.trim()) {
      const query = storeSearchQuery.toLowerCase();
      return store.name.toLowerCase().includes(query) || 
             store.address.toLowerCase().includes(query) ||
             store.type.toLowerCase().includes(query);
    }
    
    return true;
  });

  const handleChange = (field: keyof FormData, value: any) => {
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
    setFormData(prev => ({
      ...prev,
      startDate: range.startDate,
      endDate: range.endDate,
    }));
    if (errors.dateRange) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dateRange;
        return newErrors;
      });
    }
  };

  const validateStep1 = (shouldUpdateErrors: boolean = true): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên đợt kiểm tra';
    } else if (formData.name.length > 255) {
      newErrors.name = 'Tên đợt kiểm tra không được vượt quá 255 ký tự';
    }

    if (!formData.startDate || !formData.endDate) {
      newErrors.dateRange = 'Vui lòng chọn thời gian bắt đầu và kết thúc';
    } else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.dateRange = 'Thời gian kết thúc phải sau thời gian bắt đầu';
    }

    if (userRole !== 'ward' && !formData.leadUnit.trim()) {
      newErrors.leadUnit = 'Vui lòng chọn đơn vị chủ trì';
    }

    if (userRole !== 'ward' && !formData.scopeArea.trim()) {
      newErrors.scopeArea = 'Vui lòng chọn phạm vi kiểm tra';
    }

    if (shouldUpdateErrors) {
      setErrors(newErrors);
    }
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.selectedStores.length === 0) {
      newErrors.selectedStores = 'Vui lòng chọn ít nhất một cửa hàng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      return;
    }

    try {
        if (editMode && editId) {
            // Update existing round
            await updateRound(editId, {
                name: formData.name,
                planId: formData.relatedPlanId || undefined,
                planName: formData.relatedPlanId ? approvedPlans.find(p => p.id === formData.relatedPlanId)?.name : undefined,
                startDate: formData.startDate!,
                endDate: formData.endDate!,
                leadUnit: formData.leadUnit || userWard,
                totalTargets: formData.selectedStores.length,
            });
            toast.success('Đã cập nhật đợt kiểm tra thành công');
        } else {
            // Create new round
            const currentDate = new Date();
            const newRound: Partial<InspectionRound> = {
                code: formData.code,
                name: formData.name,
                planId: formData.relatedPlanId || undefined,
                planName: formData.relatedPlanId ? approvedPlans.find(p => p.id === formData.relatedPlanId)?.name : undefined,
                type: 'routine',
                status: 'draft', // Trạng thái mặc định là Nháp
                startDate: formData.startDate!,
                endDate: formData.endDate!,
                leadUnit: formData.leadUnit || userWard,
                team: [],
                teamSize: 0,
                totalTargets: formData.selectedStores.length,
                inspectedTargets: 0,
                createdBy: 'Người dùng hiện tại',
                createdAt: currentDate.toISOString().split('T')[0],
            };
            await createRound(newRound);
            toast.success('Đã tạo đợt kiểm tra thành công');
        }
        
        navigate('/plans/inspection-rounds');
    } catch (error) {
        console.error("Submit Error", error);
        toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleSaveDraft = () => {
    toast.success('Đã lưu nháp đợt kiểm tra');
    navigate('/plans/inspection-rounds');
  };

  const toggleStore = (storeId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedStores: prev.selectedStores.includes(storeId)
        ? prev.selectedStores.filter(id => id !== storeId)
        : [...prev.selectedStores, storeId],
    }));
    
    // Clear error when user selects
    if (errors.selectedStores) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.selectedStores;
        return newErrors;
      });
    }
  };

  const toggleForm = (formId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedForms: prev.selectedForms.includes(formId)
        ? prev.selectedForms.filter(id => id !== formId)
        : [...prev.selectedForms, formId],
    }));
  };

  const approvedPlans = realPlans.filter(p => p.status === 'approved' || p.status === 'active');
  
  const selectedForm = mockForms.find(f => f.id === showFormDetailModal);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/plans/inspection-rounds')}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{editMode ? 'Chỉnh sửa đợt kiểm tra' : 'Tạo đợt kiểm tra mới'}</h1>
          <p className={styles.subtitle}>
            Hoàn tất {currentStep}/3 bước để {editMode ? 'cập nhật' : 'tạo'} đợt kiểm tra
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className={styles.stepsContainer}>
        <div className={styles.steps}>
          <div 
            className={`${styles.step} ${currentStep >= 1 ? styles.stepActive : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <div className={styles.stepNumber}>
              {currentStep > 1 ? <CheckCircle2 size={20} /> : '1'}
            </div>
            <div className={styles.stepLabel}>Thông tin chung</div>
          </div>
          <div className={styles.stepDivider}></div>
          <div 
            className={`${styles.step} ${currentStep >= 2 ? styles.stepActive : ''} ${validateStep1(false) ? '' : styles.stepDisabled}`}
            onClick={() => validateStep1() && setCurrentStep(2)}
          >
            <div className={styles.stepNumber}>
              {currentStep > 2 ? <CheckCircle2 size={20} /> : '2'}
            </div>
            <div className={styles.stepLabel}>Tiêu chí kiểm tra</div>
          </div>
          <div className={styles.stepDivider}></div>
          <div 
            className={`${styles.step} ${currentStep >= 3 ? styles.stepActive : ''} ${validateStep1(false) ? '' : styles.stepDisabled}`}
            onClick={() => validateStep1() && setCurrentStep(3)}
          >
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepLabel}>Cửa hàng</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.form}>
          {/* Step 1: Thông tin chung */}
          {currentStep === 1 && (
            <div className={styles.section}>
              <div className={styles.formGrid}>
                {/* Mã đợt kiểm tra */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Mã đợt kiểm tra <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                  />
                </div>

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
                    placeholder="Nhập tên đợt kiểm tra (tối đa 255 ký tự)"
                    maxLength={255}
                  />
                  {errors.name && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                {/* Độ ưu tiên */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Độ ưu tiên <span className={styles.required}>*</span>
                  </label>
                  <select
                    className={styles.select}
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                  </select>
                </div>

                {/* Kế hoạch liên quan - Optional */}
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Kế hoạch liên quan</label>
                  <select
                    className={styles.select}
                    value={formData.relatedPlanId}
                    onChange={(e) => handleChange('relatedPlanId', e.target.value)}
                    disabled={!!planIdFromUrl}
                  >
                    <option value="">Không liên kết với kế hoạch</option>
                    {approvedPlans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.id} - {plan.name}
                      </option>
                    ))}
                  </select>
                  {planIdFromUrl && (
                    <span className={styles.helpText}>Tự động liên kết từ kế hoạch</span>
                  )}
                </div>

                {/* Thời gian */}
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>
                    Thời gian thực hiện <span className={styles.required}>*</span>
                  </label>
                  <DateRangePicker
                    value={{
                      startDate: formData.startDate,
                      endDate: formData.endDate,
                    }}
                    onChange={handleDateRangeChange}
                  />
                  {errors.dateRange && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      <span>{errors.dateRange}</span>
                    </div>
                  )}
                </div>

                {/* Người chủ trì - Conditional based on user role */}
                {userRole !== 'ward' && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Người chủ trì <span className={styles.required}>*</span>
                    </label>
                    <select
                      className={`${styles.select} ${errors.leadUnit ? styles.inputError : ''}`}
                      value={formData.leadUnit}
                      onChange={(e) => handleChange('leadUnit', e.target.value)}
                    >
                      <option value="">Chọn người chủ trì</option>
                      <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                      <option value="Phường Bến Thành">Phường Bến Thành</option>
                      <option value="Phường Cô Giang">Phường Cô Giang</option>
                      <option value="Phường Nguyễn Cư Trinh">Phường Nguyễn Cư Trinh</option>
                      <option value="Phường Cầu Kho">Phường Cầu Kho</option>
                      <option value="Phường Đa Kao">Phường Đa Kao</option>
                      <option value="Phường Nguyễn Thái Bình">Phường Nguyễn Thái Bình</option>
                      <option value="Phường Phạm Ngũ Lão">Phường Phạm Ngũ Lão</option>
                      <option value="Phường Cầu Ông Lãnh">Phường Cầu Ông Lãnh</option>
                      <option value="Phường Tân Định">Phường Tân Định</option>
                    </select>
                    {errors.leadUnit && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        <span>{errors.leadUnit}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Phạm vi kiểm tra - Conditional based on user role */}
                {userRole !== 'ward' && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Phạm vi kiểm tra <span className={styles.required}>*</span>
                    </label>
                    <select
                      className={`${styles.select} ${errors.scopeArea ? styles.inputError : ''}`}
                      value={formData.scopeArea}
                      onChange={(e) => handleChange('scopeArea', e.target.value)}
                    >
                      <option value="">Chọn xã/phường</option>
                      <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                      <option value="Phường Bến Thành">Phường Bến Thành</option>
                      <option value="Phường Cô Giang">Phường Cô Giang</option>
                      <option value="Phường Nguyễn Cư Trinh">Phường Nguyễn Cư Trinh</option>
                      <option value="Phường Cầu Kho">Phường Cầu Kho</option>
                      <option value="Phường Đa Kao">Phường Đa Kao</option>
                      <option value="Phường Nguyễn Thái Bình">Phường Nguyễn Thái Bình</option>
                      <option value="Phường Phạm Ngũ Lão">Phường Phạm Ngũ Lão</option>
                      <option value="Phường Cầu Ông Lãnh">Phường Cầu Ông Lãnh</option>
                      <option value="Phường Tân Định">Phường Tân Định</option>
                    </select>
                    {errors.scopeArea && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        <span>{errors.scopeArea}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Display values for ward users */}
                {userRole === 'ward' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Người chủ trì</label>
                      <div className={styles.readOnlyField}>{userWard}</div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Phạm vi kiểm tra</label>
                      <div className={styles.readOnlyField}>{userWard}</div>
                    </div>
                  </>
                )}

                {/* SECTION: Quyết định từ INS - Khi TẠO MỚI */}
                {!isApproved && (
                  <>
                    {/* Quyết định kiểm tra việc chấp hành pháp luật */}
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>
                        Quyết định kiểm tra việc chấp hành pháp luật trong sản xuất, kinh doanh hàng hóa, dịch vụ
                      </label>
                      <div className={styles.decisionContainer}>
                        {inspectionDecision ? (
                          <>
                            <div className={styles.selectedDecisionBox}>
                              <CheckCircle2 size={16} color="var(--primary)" />
                              <div>
                                <div className={styles.selectedDecisionCode}>{inspectionDecision.code}</div>
                                <div className={styles.selectedDecisionTitle}>{inspectionDecision.title}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className={styles.changeButton}
                              onClick={() => setInspectionDecisionModalOpen(true)}
                            >
                              Đổi
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className={styles.importButton}
                            onClick={() => setInspectionDecisionModalOpen(true)}
                          >
                            <Upload size={16} />
                            Import từ INS
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quyết định phân công công chức */}
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>
                        Quyết định phân công công chức thực hiện biện pháp nghiệp vụ
                      </label>
                      <div className={styles.decisionContainer}>
                        {assignmentDecision ? (
                          <>
                            <div className={styles.selectedDecisionBox}>
                              <CheckCircle2 size={16} color="var(--primary)" />
                              <div>
                                <div className={styles.selectedDecisionCode}>{assignmentDecision.code}</div>
                                <div className={styles.selectedDecisionTitle}>{assignmentDecision.title}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className={styles.changeButton}
                              onClick={() => setAssignmentDecisionModalOpen(true)}
                            >
                              Đổi
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className={styles.importButton}
                            onClick={() => setAssignmentDecisionModalOpen(true)}
                          >
                            <Upload size={16} />
                            Import từ INS
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* SECTION: Quyết định từ INS - Khi CHỈNH SỬA ĐÃ PHÊ DUYỆT */}
                {isApproved && (
                  <>
                    {/* Quyết định sửa đổi, bổ sung */}
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>
                        Quyết định sửa đổi, bổ sung Quyết định kiểm tra việc chấp hành pháp luật
                      </label>
                      <div className={styles.decisionContainer}>
                        {amendmentDecision ? (
                          <>
                            <div className={styles.selectedDecisionBox}>
                              <CheckCircle2 size={16} color="var(--primary)" />
                              <div>
                                <div className={styles.selectedDecisionCode}>{amendmentDecision.code}</div>
                                <div className={styles.selectedDecisionTitle}>{amendmentDecision.title}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className={styles.changeButton}
                              onClick={() => setAmendmentDecisionModalOpen(true)}
                            >
                              Đổi
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className={styles.importButton}
                            onClick={() => setAmendmentDecisionModalOpen(true)}
                          >
                            <Upload size={16} />
                            Import từ INS
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quyết định kéo dài/gia hạn */}
                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>
                        Quyết định kéo dài/Gia hạn thời hạn thẩm tra, xác minh
                      </label>
                      <div className={styles.decisionContainer}>
                        {extensionDecision ? (
                          <>
                            <div className={styles.selectedDecisionBox}>
                              <CheckCircle2 size={16} color="var(--primary)" />
                              <div>
                                <div className={styles.selectedDecisionCode}>{extensionDecision.code}</div>
                                <div className={styles.selectedDecisionTitle}>{extensionDecision.title}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className={styles.changeButton}
                              onClick={() => setExtensionDecisionModalOpen(true)}
                            >
                              Đổi
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className={styles.importButton}
                            onClick={() => setExtensionDecisionModalOpen(true)}
                          >
                            <Upload size={16} />
                            Import từ INS
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Tiêu chí kiểm tra */}
          {currentStep === 2 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <FileText size={20} />
                Chọn biểu mẫu kiểm tra
              </h3>
              <p className={styles.sectionDesc}>
                Chọn các biểu mẫu sẽ sử dụng trong đợt kiểm tra (không bắt buộc)
              </p>

              <div className={styles.formsGrid}>
                {mockForms.map(form => (
                  <div 
                    key={form.id} 
                    className={`${styles.formCard} ${formData.selectedForms.includes(form.id) ? styles.formCardSelected : ''}`}
                    onClick={() => toggleForm(form.id)}
                  >
                    <div className={styles.formCardMain}>
                      <div className={styles.formCardHeader}>
                        <div className={styles.formCheckboxContainer}>
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={formData.selectedForms.includes(form.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleForm(form.id);
                            }}
                          />
                        </div>
                        <div className={styles.formCardIcon}>
                          <FileText size={24} />
                        </div>
                        <div className={styles.formCardTitle}>
                          <span className={styles.formId}>{form.id}</span>
                          <span className={styles.formName}>{form.name}</span>
                        </div>
                      </div>
                      <div className={styles.formCardDescription}>
                        {form.criteria.length} tiêu chí kiểm tra trong biểu mẫu này
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.viewButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFormDetailModal(form.id);
                      }}
                    >
                      <Eye size={18} />
                      Chi tiết
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Cửa hàng */}
          {currentStep === 3 && (
            <div className={styles.section}>
              <div className={styles.sectionTitleRow}>
                <h3 className={styles.sectionTitle}>
                  <Store size={20} />
                  Chọn cửa hàng kiểm tra <span className={styles.required}>*</span>
                </h3>
                {formData.selectedStores.length > 0 && (
                  <div className={styles.selectedCount}>
                    {formData.selectedStores.length} được chọn
                  </div>
                )}
              </div>

              {/* Filters and Search */}
              <div className={styles.storeFiltersRow}>
                <div className={styles.searchBox}>
                  <Search size={16} />
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Tìm kiếm cửa hàng..."
                    value={storeSearchQuery}
                    onChange={(e) => setStoreSearchQuery(e.target.value)}
                  />
                </div>
                <div className={styles.filterOptions}>
                  <label className={styles.filterOption}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={storeFilters.highRisk}
                      onChange={(e) => setStoreFilters(prev => ({ ...prev, highRisk: e.target.checked }))}
                    />
                    <span>Rủi ro cao</span>
                  </label>
                  <label className={styles.filterOption}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={storeFilters.manyComplaints}
                      onChange={(e) => setStoreFilters(prev => ({ ...prev, manyComplaints: e.target.checked }))}
                    />
                    <span>Nhiều khiếu nại</span>
                  </label>
                </div>
              </div>

              {/* Store Multi-Select */}
              <div className={styles.storesGridContainer}>
                {filteredStores.slice(0, 100).map(store => (
                  <div
                    key={store.id}
                    className={`${styles.storeCard} ${formData.selectedStores.includes(store.id) ? styles.storeCardSelected : ''}`}
                    onClick={() => toggleStore(store.id)}
                  >
                    <div className={styles.storeCardCheckbox}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={formData.selectedStores.includes(store.id)}
                        onChange={() => {}} // Controlled by parent div
                      />
                    </div>
                    <div className={styles.storeCardIcon}>
                      <Store size={22} />
                    </div>
                    <div className={styles.storeCardContent}>
                      <div className={styles.storeCardHeader}>
                        <div className={styles.storeCardName}>{store.name}</div>
                        <div className={styles.storeCardBadges}>
                          {store.riskLevel === 'high' && (
                            <span className={`${styles.badge} ${styles.badgeHigh}`}>Rủi ro cao</span>
                          )}
                          {store.hasComplaints && (
                            <span className={`${styles.badge} ${styles.badgeWarning}`}>Nhiều khiếu nại</span>
                          )}
                        </div>
                      </div>
                      <div className={styles.storeCardMeta}>
                        <span className={styles.storeCardType}>{store.type}</span>
                        <span className={styles.metaDivider}>•</span>
                        <span className={styles.storeCardAddress}>{store.address}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.selectedStores && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  <span>{errors.selectedStores}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className={styles.footer}>
        <button className={styles.cancelButton} onClick={() => navigate('/plans/inspection-rounds')}>
          Hủy
        </button>
        <div className={styles.footerActions}>
          {currentStep > 1 && (
            <button className={styles.backStepButton} onClick={handleBack}>
              <ChevronLeft size={18} />
              Quay lại
            </button>
          )}
          <button className={styles.draftButton} onClick={handleSaveDraft}>
            Lưu nháp
          </button>
          {currentStep < 3 ? (
            <button className={styles.nextButton} onClick={handleNext}>
              Tiếp theo
              <ChevronRight size={18} />
            </button>
          ) : (
            <button className={styles.submitButton} onClick={handleSubmit}>
              <CheckCircle2 size={18} />
              {editMode ? 'Cập nhật đợt kiểm tra' : 'Tạo đợt kiểm tra'}
            </button>
          )}
        </div>
      </div>

      {/* Modal for Form Detail */}
      {showFormDetailModal && selectedForm && (
        <div className={styles.modalOverlay} onClick={() => setShowFormDetailModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {selectedForm.id} - {selectedForm.name}
              </h3>
              <button className={styles.modalClose} onClick={() => setShowFormDetailModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <h4 className={styles.criteriaTitle}>Tiêu chí kiểm tra:</h4>
              <ul className={styles.criteriaList}>
                {selectedForm.criteria.map((criterion, idx) => (
                  <li key={idx}>{criterion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* INS Decision Modals */}
      <InspectionDecisionModal
        open={inspectionDecisionModalOpen}
        onOpenChange={setInspectionDecisionModalOpen}
        onSelect={(decision) => setInspectionDecision(decision)}
        selectedDecisionCode={inspectionDecision?.code}
      />
      
      <AssignmentDecisionModal
        open={assignmentDecisionModalOpen}
        onOpenChange={setAssignmentDecisionModalOpen}
        onSelect={(decision) => setAssignmentDecision(decision)}
        selectedDecisionCode={assignmentDecision?.code}
      />
      
      <AmendmentDecisionModal
        open={amendmentDecisionModalOpen}
        onOpenChange={setAmendmentDecisionModalOpen}
        onSelect={(decision) => setAmendmentDecision(decision)}
        selectedDecisionCode={amendmentDecision?.code}
      />
      
      <ExtensionDecisionModal
        open={extensionDecisionModalOpen}
        onOpenChange={setExtensionDecisionModalOpen}
        onSelect={(decision) => setExtensionDecision(decision)}
        selectedDecisionCode={extensionDecision?.code}
      />
    </div>
  );
}