import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  X,
  MapPin,
  Phone,
  Globe,
  User,
  FileText,
  AlertCircle,
  Upload,
  Tag,
  Building,
  Calendar,
  CheckCircle,
  Paperclip,
  Trash2,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './CreateLeadFull.module.css';

interface FormData {
  // Basic Info
  source: string;
  sourceDetail: string;
  title: string;
  description: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  
  // Classification
  category: string;
  topic: string[];
  tags: string[];
  
  // Location
  district: string;
  ward: string;
  address: string;
  coordinates: string;
  
  // Entity
  storeId: string;
  storeName: string;
  businessType: string;
  
  // Contact
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  
  // Proposed Action
  proposedAction: string;
  expectedOutcome: string;
  dueDate: string;
  
  // Attachments
  attachments: File[];
}

export default function CreateLeadFull() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    source: '',
    sourceDetail: '',
    title: '',
    description: '',
    urgency: 'medium',
    category: '',
    topic: [],
    tags: [],
    district: '',
    ward: '',
    address: '',
    coordinates: '',
    storeId: '',
    storeName: '',
    businessType: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    proposedAction: '',
    expectedOutcome: '',
    dueDate: '',
    attachments: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchStoreQuery, setSearchStoreQuery] = useState('');

  const steps = [
    { number: 1, title: 'Thông tin cơ bản', icon: FileText },
    { number: 2, title: 'Phân loại', icon: Tag },
    { number: 3, title: 'Địa điểm & Đối tượng', icon: MapPin },
    { number: 4, title: 'Hành động đề xuất', icon: CheckCircle },
  ];

  const sourceTypes = [
    { value: 'hotline', label: 'Hotline 1800' },
    { value: 'inspector', label: 'Thanh tra viên' },
    { value: 'website', label: 'Website' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'email', label: 'Email' },
    { value: 'social', label: 'Mạng xã hội' },
  ];

  const categories = [
    'Hàng giả',
    'Chất lượng sản phẩm',
    'Vi phạm giá',
    'An toàn thực phẩm',
    'Gian lận thương mại',
    'Khác',
  ];

  const topics = [
    'Hàng không rõ nguồn gốc',
    'Hàng giả mạo nhãn hiệu',
    'Không có hóa đơn',
    'Niêm yết giá sai',
    'Hàng hết hạn',
    'Vệ sinh an toàn thực phẩm',
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.source) newErrors.source = 'Vui lòng chọn nguồn tin';
      if (!formData.title || formData.title.trim().length < 5)
        newErrors.title = 'Tiêu đề phải có ít nhất 5 ký tự';
      if (!formData.description || formData.description.trim().length < 10)
        newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
    }

    if (step === 2) {
      if (!formData.category) newErrors.category = 'Vui lòng chọn danh mục';
      if (formData.topic.length === 0) newErrors.topic = 'Vui lòng chọn ít nhất 1 chủ đề' as any;
    }

    if (step === 3) {
      if (!formData.district) newErrors.district = 'Vui lòng chọn Phường/Xã';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const newLeadId = `L-2024-${Math.floor(1000 + Math.random() * 9000)}`;
      
      toast.success(`Đã tạo lead ${newLeadId} thành công!`);
      navigate(`/lead-risk/lead/${newLeadId}`);
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, attachments: [...formData.attachments, ...files] });
    toast.success(`Đã thêm ${files.length} tệp đính kèm`);
  };

  const removeAttachment = (index: number) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    setFormData({ ...formData, attachments: newAttachments });
  };

  const toggleTopic = (topic: string) => {
    if (formData.topic.includes(topic)) {
      setFormData({ ...formData, topic: formData.topic.filter((t) => t !== topic) });
    } else {
      setFormData({ ...formData, topic: [...formData.topic, topic] });
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Tạo Lead (Form đầy đủ)</h1>
          <p className={styles.subtitle}>Nhập đầy đủ thông tin cho lead</p>
        </div>
      </div>

      {/* Steps */}
      <div className={styles.steps}>
        {steps.map((step) => {
          const IconComponent = step.icon;
          return (
            <div
              key={step.number}
              className={`${styles.step} ${
                currentStep === step.number ? styles.stepActive : ''
              } ${currentStep > step.number ? styles.stepCompleted : ''}`}
            >
              <div className={styles.stepNumber}>
                {currentStep > step.number ? (
                  <CheckCircle size={20} />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>{step.title}</div>
              </div>
              {step.number < steps.length && <div className={styles.stepConnector}></div>}
            </div>
          );
        })}
      </div>

      {/* Form */}
      <div className={styles.formContainer}>
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Thông tin cơ bản</h2>

            <div className={styles.inputGroup}>
              <label>
                Nguồn tin <span className={styles.required}>*</span>
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className={`${styles.select} ${errors.source ? styles.inputError : ''}`}
              >
                <option value="">Chọn nguồn tin</option>
                {sourceTypes.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
              {errors.source && (
                <div className={styles.error}>
                  <AlertCircle size={14} />
                  {errors.source}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Chi tiết nguồn</label>
              <input
                type="text"
                placeholder="Ví dụ: Thanh tra viên Nguyễn Văn A"
                value={formData.sourceDetail}
                onChange={(e) => setFormData({ ...formData, sourceDetail: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>
                Tiêu đề <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                placeholder="Tiêu đề ngắn gọn về sự việc"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              />
              {errors.title && (
                <div className={styles.error}>
                  <AlertCircle size={14} />
                  {errors.title}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>
                Mô tả chi tiết <span className={styles.required}>*</span>
              </label>
              <textarea
                rows={6}
                placeholder="Mô tả chi tiết về sự việc, vi phạm, khiếu nại..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              />
              <div className={styles.charCount}>
                {formData.description.length} / 2000 ký tự
              </div>
              {errors.description && (
                <div className={styles.error}>
                  <AlertCircle size={14} />
                  {errors.description}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>
                Mức độ khẩn cấp <span className={styles.required}>*</span>
              </label>
              <div className={styles.urgencyGrid}>
                {[
                  { value: 'critical', label: 'Khẩn cấp', color: 'rgba(239, 68, 68, 1)' },
                  { value: 'high', label: 'Cao', color: 'rgba(251, 146, 60, 1)' },
                  { value: 'medium', label: 'Trung bình', color: 'rgba(234, 179, 8, 1)' },
                  { value: 'low', label: 'Thấp', color: 'rgba(148, 163, 184, 1)' },
                ].map((level) => (
                  <label key={level.value} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="urgency"
                      value={level.value}
                      checked={formData.urgency === level.value}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    />
                    <div
                      className={styles.urgencyDot}
                      style={{ backgroundColor: level.color }}
                    ></div>
                    <span>{level.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Classification */}
        {currentStep === 2 && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Phân loại</h2>

            <div className={styles.inputGroup}>
              <label>
                Danh mục <span className={styles.required}>*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className={styles.error}>
                  <AlertCircle size={14} />
                  {errors.category}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>
                Chủ đề <span className={styles.required}>*</span>
              </label>
              <div className={styles.topicGrid}>
                {topics.map((topic) => (
                  <label key={topic} className={styles.checkboxCard}>
                    <input
                      type="checkbox"
                      checked={formData.topic.includes(topic)}
                      onChange={() => toggleTopic(topic)}
                    />
                    <span>{topic}</span>
                  </label>
                ))}
              </div>
              {errors.topic && (
                <div className={styles.error}>
                  <AlertCircle size={14} />
                  {errors.topic}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Tags (tùy chọn)</label>
              <input
                type="text"
                placeholder="Nhập tag và nhấn Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    setFormData({
                      ...formData,
                      tags: [...formData.tags, e.currentTarget.value.trim()],
                    });
                    e.currentTarget.value = '';
                  }
                }}
                className={styles.input}
              />
              {formData.tags.length > 0 && (
                <div className={styles.tagList}>
                  {formData.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) })
                        }
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Location & Entity */}
        {currentStep === 3 && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Địa điểm & Đối tượng</h2>

            <div className={styles.sectionTitle}>Địa điểm</div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>
                  Phường/Xã <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className={`${styles.select} ${errors.district ? styles.inputError : ''}`}
                >
                  <option value="">Chọn Phường/Xã</option>
                  {['Phường 1', 'Phường 2', 'Phường 3', 'Phường 7'].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <div className={styles.error}>
                    <AlertCircle size={14} />
                    {errors.district}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label>Phường/Xã</label>
                <input
                  type="text"
                  placeholder="Nhập phường/xã"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Địa chỉ cụ thể</label>
              <input
                type="text"
                placeholder="Số nhà, tên đường..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.sectionTitle}>Cơ sở kinh doanh (nếu có)</div>

            <div className={styles.inputGroup}>
              <label>Tìm kiếm cơ sở</label>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc mã số..."
                  value={searchStoreQuery}
                  onChange={(e) => setSearchStoreQuery(e.target.value)}
                  className={styles.input}
                />
              </div>
                <div className={styles.hint}>
                Tìm kiếm từ cơ sở dữ liệu "Cơ sở quản lý"
                </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Tên cơ sở</label>
                <input
                  type="text"
                  placeholder="Nhập thủ công nếu chưa có trong CSDL"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Loại hình kinh doanh</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className={styles.select}
                >
                  <option value="">Chọn loại hình</option>
                  <option value="retail">Bán lẻ</option>
                  <option value="wholesale">Bán buôn</option>
                  <option value="restaurant">Nhà hàng</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div className={styles.sectionTitle}>Thông tin liên hệ</div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Tên người liên hệ</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>
        )}

        {/* Step 4: Proposed Action */}
        {currentStep === 4 && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Hành động đề xuất & Tệp đính kèm</h2>

            <div className={styles.inputGroup}>
              <label>Hành động đề xuất</label>
              <textarea
                rows={4}
                placeholder="Đề xuất biện pháp xử lý hoặc hướng điều tra..."
                value={formData.proposedAction}
                onChange={(e) => setFormData({ ...formData, proposedAction: e.target.value })}
                className={styles.textarea}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Kết quả mong đợi</label>
              <textarea
                rows={3}
                placeholder="Mô tả kết quả mong muốn sau khi xử lý..."
                value={formData.expectedOutcome}
                onChange={(e) => setFormData({ ...formData, expectedOutcome: e.target.value })}
                className={styles.textarea}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Hạn xử lý dự kiến</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Tệp đính kèm</label>
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className={styles.fileInput}
                  id="file-upload"
                />
                <label htmlFor="file-upload" className={styles.uploadLabel}>
                  <Upload size={32} />
                  <span>Click để chọn tệp hoặc kéo thả vào đây</span>
                  <span className={styles.uploadHint}>
                    Hỗ trợ: PDF, DOC, JPG, PNG (tối đa 10MB/tệp)
                  </span>
                </label>
              </div>

              {formData.attachments.length > 0 && (
                <div className={styles.attachmentList}>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className={styles.attachmentItem}>
                      <Paperclip size={16} />
                      <span className={styles.attachmentName}>{file.name}</span>
                      <span className={styles.attachmentSize}>
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                      <button
                        type="button"
                        className={styles.removeAttachment}
                        onClick={() => removeAttachment(index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className={styles.formActions}>
          {currentStep > 1 && (
            <button type="button" className={styles.backButton} onClick={handleBack}>
              Quay lại
            </button>
          )}

          <div className={styles.actionsSpacer}></div>

          {currentStep < steps.length ? (
            <button type="button" className={styles.nextButton} onClick={handleNext}>
              Tiếp theo
            </button>
          ) : (
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Tạo Lead
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
