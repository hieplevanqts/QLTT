import { useState, useEffect } from 'react';
import {
  Save,
  X,
  Phone,
  Mail,
  User,
  AlertCircle,
  Upload,
  FileText,
  Clock,
  Paperclip,
  Trash2,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/components/ui/utils";
import { toast } from 'sonner';
import { getSupabaseClient } from '@/utils/supabaseClient';
import { projectId, publicAnonKey } from '@/utils/supabase/info';
import styles from './CreateLeadSourceModal.module.css';

interface CreateLeadSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (leadId: string) => void;
}

interface FormData {
  source: string;
  urgency: string;
  storeId: string;
  storeName: string | null;
  issueType: string;
  description: string;
  occurredAt: string;
  evidenceFiles: File[];
  providerName: string;
  providerPhone: string;
  providerEmail: string;
}

export default function CreateLeadSourceModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateLeadSourceModalProps) {
  const [formData, setFormData] = useState<FormData>({
    source: '',
    urgency: 'Trung bình',
    storeId: '',
    storeName: null,
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

  // Merchants state
  const [merchants, setMerchants] = useState<{ id: string; name: string; address?: string }[]>([]);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Fetch merchants from Supabase
  const fetchMerchantsList = async (search: string = '') => {
    try {
      const supabase = getSupabaseClient();
      let query = supabase
        .from('merchants')
        .select('_id, business_name, address')
        .limit(50); // Limit to top 50 matches

      if (search) {
        query = query.ilike('business_name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching merchants:', error);
        return;
      }

      const mappedMerchants = (data || []).map((m: any) => ({
        id: m._id,
        name: m.business_name || 'Không tên',
        address: m.address
      }));

      setMerchants(mappedMerchants);
    } catch (err) {
      console.error('Exception fetching merchants:', err);
    }
  };

  // Effect to handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMerchantsList(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);


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
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'video/mp4',
      'video/quicktime',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const invalidFiles = files.filter((file) => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      toast.error('Một số tệp có định dạng không được hỗ trợ');
      return;
    }

    // Check file size (max 10MB per file)
    const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
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
      // Convert severity mapping: Thấp->low, Trung bình->medium, Cao->high, Khẩn cấp->critical
      const severityMap: { [key: string]: string } = {
        'Thấp': 'low',
        'Trung bình': 'medium',
        'Cao': 'high',
        'Khẩn cấp': 'critical'
      };

      // Prepare evidences array with file upload
      const evidences = [];
      const supabase = getSupabaseClient();

      if (formData.evidenceFiles.length > 0) {
        toast.info('Đang tải lên minh chứng...');

        for (const file of formData.evidenceFiles) {
          try {
            // Sanitize filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

            // Upload to Supabase Storage 'vhv_file' bucket
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('vhv_file')
              .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) {
              console.error('Error uploading file:', file.name, uploadError);
              toast.error(`Không thể tải lên ${file.name}`);
              continue;
            }

            // Get Public URL
            const { data: publicUrlData } = supabase.storage
              .from('vhv_file')
              .getPublicUrl(fileName);

            evidences.push({
              name: file.name,
              size: file.size,
              type: file.type,
              url: publicUrlData.publicUrl,
              path: uploadData.path
            });
          } catch (err) {
            console.error('Exception uploading file:', file.name, err);
          }
        }
      }

      // Prepare API payload with mapping
      const payload = {
        title: formData.source, // Nguồn tin -> title
        description: formData.description, // Mô tả chi tiết -> description
        severity: severityMap[formData.urgency] || 'medium', // Mức độ khẩn cấp -> severity
        store_id: formData.storeId, // Cửa hàng bị phản ánh -> store_id
        store_name: formData.storeName || null, // Tên cửa hàng -> store_name
        category: formData.issueType, // Loại vấn đề -> category
        occurred_at: formData.occurredAt, // Thời gian xảy ra -> occurred_at
        reporter_name: formData.providerName, // Người cung cấp -> reporter_name
        reporter_phone: formData.providerPhone, // Số điện thoại -> reporter_phone
        reporter_email: formData.providerEmail || null, // Email -> reporter_email
        evidences: evidences, // Minh chứng đính kèm -> evidences
        created_by: 'admin', // TODO: Lấy từ user session
        assignee_name: null, // Chưa phân công
        location: null, // TODO: Thêm location picker nếu cần
        sla: {
          response_hours: 24,
          resolution_hours: 72,
        },
      };

      // Call API to create lead
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb2eb709/leads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Không thể tạo nguồn tin');
      }

      const newLeadCode = result.leadCode || result.data?.code;

      toast.success(`Đã tạo nguồn tin ${newLeadCode} thành công! Trạng thái: Mới`);

      // Reset form
      setFormData({
        source: '',
        urgency: 'Trung bình',
        storeId: '',
        storeName: null,
        issueType: '',
        description: '',
        occurredAt: '',
        evidenceFiles: [],
        providerName: 'Nguyễn Văn A',
        providerPhone: '',
        providerEmail: '',
      });
      setErrors({});

      if (onSuccess) {
        onSuccess(newLeadCode);
      }

      onClose();
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : 'Vui lòng thử lại'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <FileText size={24} className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>Thêm mới nguồn tin phản ánh</h2>
              <p className={styles.subtitle}>Tạo mới nguồn tin phản ánh từ người dân</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.scrollArea}>
            {/* Source Information */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Thông tin nguồn tin</h3>

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
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className={styles.select}
                  >
                    {urgencyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Cửa hàng bị phản ánh <span className={styles.required}>*</span>
                </label>

                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCombobox}
                      className={cn(
                        "w-full justify-between font-normal",
                        !formData.storeId && "text-muted-foreground",
                        styles.select // Keep existing style class if needed, or override
                      )}
                      style={{ height: '40px', borderColor: errors.storeId ? 'var(--destructive)' : undefined }}
                    >
                      {formData.storeId
                        ? merchants.find((merchant) => merchant.id === formData.storeId)?.name
                        : "Chọn cửa hàng..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0 z-[10000]" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Tìm kiếm tên cửa hàng..."
                        value={searchValue}
                        onValueChange={(val) => {
                          setSearchValue(val);
                          fetchMerchantsList(val);
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy cửa hàng nào.</CommandEmpty>
                        <CommandGroup>
                          {merchants.map((merchant) => (
                            <CommandItem
                              key={merchant.id}
                              value={merchant.name} // Use name for value to help with default sorting/filtering if enabled, but we disabled it
                              onSelect={() => {
                                setFormData({
                                  ...formData,
                                  storeId: merchant.id,
                                  storeName: merchant.name
                                });
                                setOpenCombobox(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.storeId === merchant.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{merchant.name}</span>
                                {merchant.address && <span className="text-xs text-muted-foreground">{merchant.address}</span>}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <div className={styles.hint}>
                  Nhập tên để tìm kiếm trong danh sách doanh nghiệp/cửa hàng
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
              <h3 className={styles.sectionTitle}>Chi tiết sự việc</h3>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Mô tả chi tiết <span className={styles.required}>*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Nội dung phản ánh/tố cáo chi tiết..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                  maxLength={2000}
                />
                <div className={styles.charCount}>{formData.description.length} / 2000 ký tự</div>
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
                {errors.occurredAt && (
                  <div className={styles.error}>
                    <AlertCircle size={14} />
                    {errors.occurredAt}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Minh chứng đính kèm</label>
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,video/mp4,video/quicktime,application/pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className={styles.fileInput}
                    id="file-upload-modal"
                  />
                  <label htmlFor="file-upload-modal" className={styles.uploadLabel}>
                    <Upload size={24} className={styles.uploadIcon} />
                    <span className={styles.uploadText}>Chọn tệp hoặc kéo thả</span>
                    <span className={styles.uploadHint}>JPG, PNG, MP4, PDF, DOC (tối đa 10MB)</span>
                  </label>
                </div>

                {formData.evidenceFiles.length > 0 && (
                  <div className={styles.fileList}>
                    {formData.evidenceFiles.map((file, index) => (
                      <div key={index} className={styles.fileItem}>
                        <Paperclip size={14} className={styles.fileIcon} />
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
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Provider Information */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Thông tin người cung cấp</h3>

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
                <div className={styles.hint}>Mặc định lấy từ tài khoản đăng nhập</div>
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
                  <input
                    type="tel"
                    placeholder="0123456789"
                    value={formData.providerPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, providerPhone: value });
                    }}
                    maxLength={10}
                    className={`${styles.input} ${errors.providerPhone ? styles.inputError : ''}`}
                  />
                  {errors.providerPhone && (
                    <div className={styles.error}>
                      <AlertCircle size={14} />
                      {errors.providerPhone}
                    </div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.providerEmail}
                    onChange={(e) => setFormData({ ...formData, providerEmail: e.target.value })}
                    className={`${styles.input} ${errors.providerEmail ? styles.inputError : ''}`}
                  />
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

          {/* Footer Actions */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  Lưu nguồn tin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
