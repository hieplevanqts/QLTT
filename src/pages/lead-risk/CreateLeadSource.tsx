import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  X,
  Phone,
  Mail,
  User,
  AlertCircle,
  Upload,
  Building,
  Calendar,
  Paperclip,
  Trash2,
  FileText,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './CreateLeadSource.module.css';

interface FormData {
  source: string;
  urgency: string;
  storeId: string;
  issueType: string;
  description: string;
  occurredAt: string;
  evidenceFiles: File[];
  providerName: string;
  providerPhone: string;
  providerEmail: string;
}

export default function CreateLeadSource() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    source: '',
    urgency: 'Trung bình',
    storeId: '',
    issueType: '',
    description: '',
    occurredAt: '',
    evidenceFiles: [],
    providerName: 'Nguyễn Văn A', // Default from logged-in user
    providerPhone: '',
    providerEmail: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data sources
  const sourceTypes = [
    { value: 'hotline', label: 'Hotline 1800' },
    { value: 'website', label: 'Website/Portal' },
    { value: 'email', label: 'Email' },
    { value: 'social', label: 'Mạng xã hội' },
    { value: 'inspection', label: 'Kiểm tra trực tiếp' },
    { value: 'authority', label: 'Công an/Chính quyền' },
    { value: 'other', label: 'Nguồn khác' },
  ];

  const urgencyLevels = [
    { value: 'Thấp', color: 'rgba(148, 163, 184, 1)' },
    { value: 'Trung bình', color: 'rgba(234, 179, 8, 1)' },
    { value: 'Cao', color: 'rgba(251, 146, 60, 1)' },
    { value: 'Khẩn cấp', color: 'rgba(239, 68, 68, 1)' },
  ];

  // Mock stores - in production, this would filter by user's jurisdiction
  const stores = [
    { id: 'S001', name: 'Cửa hàng Bách Hóa Xanh - Nguyễn Văn Cừ' },
    { id: 'S002', name: 'Siêu thị Co.opMart - Quận 1' },
    { id: 'S003', name: 'Nhà hàng Phở 24 - Lê Lợi' },
    { id: 'S004', name: 'Cửa hàng Điện Máy Xanh - Phạm Ngũ Lão' },
  ];

  const issueTypes = [
    'Niêm yết giá không đúng',
    'Vi phạm VSATTP',
    'Hàng giả, hàng nhái',
    'Hàng không rõ nguồn gốc',
    'Hàng hết hạn',
    'Gian lận thương mại',
    'Vi phạm quy định kinh doanh',
    'Khác',
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // BR-01: Required fields validation
    if (!formData.source) {
      newErrors.source = 'Vui lòng chọn nguồn tin';
    }

    if (!formData.storeId) {
      newErrors.storeId = 'Vui lòng chọn cửa hàng';
    }

    if (!formData.issueType) {
      newErrors.issueType = 'Vui lòng chọn loại vấn đề';
    }

    // BR-02: Description max 2000 characters
    if (!formData.description || formData.description.trim().length === 0) {
      newErrors.description = 'Vui lòng nhập mô tả chi tiết';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Mô tả không được vượt quá 2000 ký tự';
    }

    // BR-03: Occurrence time must not be in the future
    if (!formData.occurredAt) {
      newErrors.occurredAt = 'Vui lòng chọn thời gian xảy ra';
    } else {
      const selectedDate = new Date(formData.occurredAt);
      const now = new Date();
      if (selectedDate > now) {
        newErrors.occurredAt = 'Thời gian xảy ra không được lớn hơn thời điểm hiện tại';
      }
    }

    if (!formData.providerName || formData.providerName.trim().length === 0) {
      newErrors.providerName = 'Vui lòng nhập tên người cung cấp';
    }

    // Phone validation (10 digits)
    if (!formData.providerPhone) {
      newErrors.providerPhone = 'Vui lòng nhập số điện thoại';
    } else if (!/^\d{10}$/.test(formData.providerPhone)) {
      newErrors.providerPhone = 'Số điện thoại phải có 10 chữ số';
    }

    // Email validation (optional, but if provided must be valid)
    if (formData.providerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.providerEmail)) {
      newErrors.providerEmail = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // BR-04: Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'video/quicktime', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Một số tệp có định dạng không được hỗ trợ');
      return;
    }

    // Check file size (max 10MB per file)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Một số tệp vượt quá kích thước 10MB');
      return;
    }

    setFormData({ ...formData, evidenceFiles: [...formData.evidenceFiles, ...files] });
    toast.success(`Đã thêm ${files.length} tệp minh chứng`);
  };

  const removeFile = (index: number) => {
    const newFiles = formData.evidenceFiles.filter((_, i) => i !== index);
    setFormData({ ...formData, evidenceFiles: newFiles });
    toast.success('Đã xóa tệp');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // BR-06: Create lead with status "Mới"
      const newLeadId = `NT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      toast.success(`Đã tạo nguồn tin ${newLeadId} thành công! Trạng thái: Mới`);
      
      // Navigate to lead inbox or detail page
      navigate('/lead-risk/inbox');
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Thêm mới nguồn tin phản ánh</h1>
          <p className={styles.subtitle}>
            Tạo mới nguồn tin phản ánh từ người dân về hoạt động kinh doanh
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <div className={styles.formCard}>
            {/* Source Information */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <FileText size={18} />
                Thông tin nguồn tin
              </h2>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
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
                  <label className={styles.label}>
                    Mức độ khẩn cấp <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.urgencyGrid}>
                    {urgencyLevels.map((level) => (
                      <label key={level.value} className={styles.radioCard}>
                        <input
                          type="radio"
                          name="urgency"
                          value={level.value}
                          checked={formData.urgency === level.value}
                          onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                          className={styles.radioInput}
                        />
                        <div className={styles.radioContent}>
                          <div
                            className={styles.urgencyDot}
                            style={{ backgroundColor: level.color }}
                          ></div>
                          <span className={styles.radioLabel}>{level.value}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Cửa hàng <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.storeId}
                  onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                  className={`${styles.select} ${errors.storeId ? styles.inputError : ''}`}
                >
                  <option value="">Chọn cửa hàng</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
                <div className={styles.hint}>
                  Danh sách cửa hàng được lọc theo địa bàn QLTT phụ trách
                </div>
                {errors.storeId && (
                  <div className={styles.error}>
                    <AlertCircle size={14} />
                    {errors.storeId}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Loại vấn đề <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.issueType}
                  onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                  className={`${styles.select} ${errors.issueType ? styles.inputError : ''}`}
                >
                  <option value="">Chọn loại vấn đề</option>
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className={styles.hint}>
                  Phân loại nội dung vi phạm/phản ánh. Giá trị lấy từ danh mục vi phạm
                </div>
                {errors.issueType && (
                  <div className={styles.error}>
                    <AlertCircle size={14} />
                    {errors.issueType}
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Clock size={18} />
                Chi tiết sự việc
              </h2>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Mô tả chi tiết <span className={styles.required}>*</span>
                </label>
                <textarea
                  rows={6}
                  placeholder="Nội dung phản ánh/tố cáo chi tiết do người cung cấp nhập..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                  maxLength={2000}
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
                <label className={styles.label}>
                  Thời gian xảy ra <span className={styles.required}>*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.occurredAt}
                  onChange={(e) => setFormData({ ...formData, occurredAt: e.target.value })}
                  max={new Date().toISOString().slice(0, 16)}
                  className={`${styles.input} ${errors.occurredAt ? styles.inputError : ''}`}
                />
                <div className={styles.hint}>
                  Thời điểm xảy ra sự việc (theo khai báo của người cung cấp)
                </div>
                {errors.occurredAt && (
                  <div className={styles.error}>
                    <AlertCircle size={14} />
                    {errors.occurredAt}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Minh chứng</label>
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,video/mp4,video/quicktime,application/pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className={styles.fileInput}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className={styles.uploadLabel}>
                    <Upload size={32} className={styles.uploadIcon} />
                    <span className={styles.uploadText}>
                      Click để chọn tệp hoặc kéo thả vào đây
                    </span>
                    <span className={styles.uploadHint}>
                      Hỗ trợ: JPG, PNG, MP4, PDF, DOC, DOCX (tối đa 10MB/tệp)
                    </span>
                  </label>
                </div>

                {formData.evidenceFiles.length > 0 && (
                  <div className={styles.fileList}>
                    {formData.evidenceFiles.map((file, index) => (
                      <div key={index} className={styles.fileItem}>
                        <Paperclip size={16} className={styles.fileIcon} />
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeFile(index)}
                          title="Xóa tệp"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Provider Information */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <User size={18} />
                Thông tin người cung cấp
              </h2>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Người cung cấp <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Tên người cung cấp nguồn tin"
                  value={formData.providerName}
                  onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                  className={`${styles.input} ${errors.providerName ? styles.inputError : ''}`}
                />
                <div className={styles.hint}>
                  Mặc định lấy từ thông tin tài khoản đăng nhập, cho phép chỉnh sửa
                </div>
                {errors.providerName && (
                  <div className={styles.error}>
                    <AlertCircle size={14} />
                    {errors.providerName}
                  </div>
                )}
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Số điện thoại <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWithIcon}>
                    <Phone size={16} className={styles.inputIcon} />
                    <input
                      type="tel"
                      placeholder="0123456789"
                      value={formData.providerPhone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, providerPhone: value });
                      }}
                      maxLength={10}
                      className={`${styles.input} ${styles.inputWithPadding} ${
                        errors.providerPhone ? styles.inputError : ''
                      }`}
                    />
                  </div>
                  {errors.providerPhone && (
                    <div className={styles.error}>
                      <AlertCircle size={14} />
                      {errors.providerPhone}
                    </div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email</label>
                  <div className={styles.inputWithIcon}>
                    <Mail size={16} className={styles.inputIcon} />
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.providerEmail}
                      onChange={(e) => setFormData({ ...formData, providerEmail: e.target.value })}
                      className={`${styles.input} ${styles.inputWithPadding} ${
                        errors.providerEmail ? styles.inputError : ''
                      }`}
                    />
                  </div>
                  {errors.providerEmail && (
                    <div className={styles.error}>
                      <AlertCircle size={14} />
                      {errors.providerEmail}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X size={16} />
              Hủy
            </button>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Lưu nguồn tin
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
