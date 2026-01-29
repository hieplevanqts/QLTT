import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  X,
  AlertTriangle,
  FileText,
  User,
  Building2,
  Paperclip,
  Upload,
  Trash2,
  Info,
  CheckCircle,
  ArrowUp,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './EscalationForm.module.css';

interface EscalationData {
  leadId: string;
  currentLevel: 'team' | 'branch' | 'department';
  escalateTo: 'branch' | 'department' | 'headquarters';
  reason: string;
  urgency: 'critical' | 'high' | 'medium';
  recipient: string;
  recipientUnit: string;
  summary: string;
  recommendations: string;
  supportNeeded: string[];
  attachments: File[];
  cc: string[];
}

export default function EscalationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<EscalationData>({
    leadId: id || 'L-2024-1234',
    currentLevel: 'team',
    escalateTo: 'branch',
    reason: '',
    urgency: 'high',
    recipient: '',
    recipientUnit: '',
    summary: '',
    recommendations: '',
    supportNeeded: [],
    attachments: [],
    cc: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EscalationData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ccInput, setCcInput] = useState('');

  const escalationFlow = [
    { level: 'team', label: 'Đội', icon: User },
    { level: 'branch', label: 'Chi cục', icon: Building2 },
    { level: 'department', label: 'Cục', icon: Building2 },
    { level: 'headquarters', label: 'Bộ', icon: Building2 },
  ];

  const reasons = [
    'Vượt thẩm quyền xử lý',
    'Cần hỗ trợ chuyên môn',
    'Vụ việc phức tạp, liên quan nhiều đơn vị',
    'Vượt quy mô địa bàn',
    'Cần nguồn lực lớn',
    'Rủi ro pháp lý cao',
    'Yêu cầu từ lãnh đạo',
    'Khác',
  ];

  const supportTypes = [
    'Chuyên gia kỹ thuật',
    'Pháp chế',
    'Nguồn lực nhân sự',
    'Thiết bị chuyên dụng',
    'Kinh phí',
    'Phối hợp liên ngành',
  ];

  const recipients = {
    branch: [
      { id: 'u1', name: 'Nguyễn Văn A', position: 'Phó Chi cục trưởng', unit: 'Chi cục QLTT TP.HCM' },
      { id: 'u2', name: 'Trần Thị B', position: 'Trưởng phòng Thanh tra', unit: 'Chi cục QLTT TP.HCM' },
    ],
    department: [
      { id: 'u3', name: 'Lê Văn C', position: 'Phó Cục trưởng', unit: 'Cục QLTT TP.HCM' },
      { id: 'u4', name: 'Phạm Thị D', position: 'Vụ trưởng', unit: 'Cục QLTT TP.HCM' },
    ],
    headquarters: [
      { id: 'u5', name: 'Hoàng Văn E', position: 'Vụ trưởng', unit: 'Bộ Công Thương' },
    ],
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EscalationData, string>> = {};

    if (!formData.reason) {
      newErrors.reason = 'Vui lòng chọn lý do chuyển cấp';
    }

    if (!formData.recipient) {
      newErrors.recipient = 'Vui lòng chọn người nhận';
    }

    if (!formData.summary || formData.summary.trim().length < 50) {
      newErrors.summary = 'Tóm tắt phải có ít nhất 50 ký tự';
    }

    if (!formData.recommendations || formData.recommendations.trim().length < 20) {
      newErrors.recommendations = 'Đề xuất phải có ít nhất 20 ký tự';
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
      
      toast.success(`Đã chuyển lead ${formData.leadId} lên ${getLevelLabel(formData.escalateTo)}!`);
      navigate(`/lead-risk/lead/${formData.leadId}`);
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

  const addCC = () => {
    if (ccInput.trim() && !formData.cc.includes(ccInput.trim())) {
      setFormData({ ...formData, cc: [...formData.cc, ccInput.trim()] });
      setCcInput('');
    }
  };

  const removeCC = (email: string) => {
    setFormData({ ...formData, cc: formData.cc.filter((e) => e !== email) });
  };

  const toggleSupport = (support: string) => {
    if (formData.supportNeeded.includes(support)) {
      setFormData({
        ...formData,
        supportNeeded: formData.supportNeeded.filter((s) => s !== support),
      });
    } else {
      setFormData({ ...formData, supportNeeded: [...formData.supportNeeded, support] });
    }
  };

  const getLevelLabel = (level: string) => {
    const labels = {
      team: 'Đội',
      branch: 'Chi cục',
      department: 'Cục',
      headquarters: 'Bộ',
    };
    return labels[level as keyof typeof labels] || level;
  };

  const getCurrentLevelIndex = () => {
    return escalationFlow.findIndex((f) => f.level === formData.currentLevel);
  };

  const getEscalateToIndex = () => {
    return escalationFlow.findIndex((f) => f.level === formData.escalateTo);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </button>

        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Chuyển cấp / Bàn giao</h1>
          <p className={styles.subtitle}>Lead {formData.leadId}</p>
        </div>
      </div>

      {/* Escalation Flow Visualization */}
      <div className={styles.flowSection}>
        <div className={styles.flowContainer}>
          {escalationFlow.map((flow, index) => {
            const IconComponent = flow.icon;
            const isCurrent = index === getCurrentLevelIndex();
            const isTarget = index === getEscalateToIndex();
            const isPassed = index < getCurrentLevelIndex();
            const isActive = index >= getCurrentLevelIndex() && index <= getEscalateToIndex();

            return (
              <div key={flow.level} className={styles.flowItem}>
                <div
                  className={`${styles.flowNode} ${isCurrent ? styles.flowNodeCurrent : ''} ${
                    isTarget ? styles.flowNodeTarget : ''
                  } ${isPassed ? styles.flowNodePassed : ''}`}
                >
                  <IconComponent size={24} />
                  {isTarget && (
                    <div className={styles.targetIndicator}>
                      <ArrowUp size={16} />
                    </div>
                  )}
                </div>
                <div className={styles.flowLabel}>{flow.label}</div>
                {index < escalationFlow.length - 1 && (
                  <div
                    className={`${styles.flowConnector} ${
                      isActive ? styles.flowConnectorActive : ''
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formCard}>
          {/* Escalation Level */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Chọn cấp chuyển đến</h2>

            <div className={styles.levelGrid}>
              {['branch', 'department', 'headquarters'].map((level) => {
                const availableRecipients = recipients[level as keyof typeof recipients] || [];
                return (
                  <label key={level} className={styles.radioCard}>
                    <input
                      type="radio"
                      name="escalateTo"
                      value={level}
                      checked={formData.escalateTo === level}
                      onChange={(e) =>
                        setFormData({ ...formData, escalateTo: e.target.value as any, recipient: '' })
                      }
                    />
                    <div className={styles.radioCardContent}>
                      <Building2 size={24} />
                      <div className={styles.radioCardLabel}>{getLevelLabel(level)}</div>
                      <div className={styles.radioCardHint}>
                        {availableRecipients.length} người có thể nhận
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Recipient */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              2. Chọn người nhận <span className={styles.required}>*</span>
            </h2>

            <div className={styles.recipientList}>
              {(recipients[formData.escalateTo as keyof typeof recipients] || []).map((person) => (
                <label key={person.id} className={styles.recipientCard}>
                  <input
                    type="radio"
                    name="recipient"
                    value={person.id}
                    checked={formData.recipient === person.id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recipient: e.target.value,
                        recipientUnit: person.unit,
                      })
                    }
                  />
                  <div className={styles.recipientInfo}>
                    <div className={styles.recipientName}>{person.name}</div>
                    <div className={styles.recipientPosition}>{person.position}</div>
                    <div className={styles.recipientUnit}>{person.unit}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.recipient && (
              <div className={styles.error}>
                <AlertTriangle size={14} />
                {errors.recipient}
              </div>
            )}
          </div>

          {/* Reason */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              3. Lý do chuyển cấp <span className={styles.required}>*</span>
            </h2>

            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className={`${styles.select} ${errors.reason ? styles.inputError : ''}`}
            >
              <option value="">Chọn lý do</option>
              {reasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            {errors.reason && (
              <div className={styles.error}>
                <AlertTriangle size={14} />
                {errors.reason}
              </div>
            )}
          </div>

          {/* Urgency */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Mức độ khẩn cấp</h2>

            <div className={styles.urgencyGrid}>
              {[
                { value: 'critical', label: 'Khẩn cấp', color: 'rgba(239, 68, 68, 1)' },
                { value: 'high', label: 'Cao', color: 'rgba(251, 146, 60, 1)' },
                { value: 'medium', label: 'Trung bình', color: 'rgba(234, 179, 8, 1)' },
              ].map((level) => (
                <label key={level.value} className={styles.urgencyCard}>
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

          {/* Summary */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              5. Tóm tắt vụ việc <span className={styles.required}>*</span>
            </h2>

            <textarea
              rows={6}
              placeholder="Tóm tắt ngắn gọn tình hình vụ việc, diễn biến hiện tại, các hành động đã thực hiện..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className={`${styles.textarea} ${errors.summary ? styles.inputError : ''}`}
            />
            <div className={styles.charCount}>{formData.summary.length} / 2000 ký tự</div>
            {errors.summary && (
              <div className={styles.error}>
                <AlertTriangle size={14} />
                {errors.summary}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              6. Đề xuất xử lý <span className={styles.required}>*</span>
            </h2>

            <textarea
              rows={4}
              placeholder="Đề xuất biện pháp, hướng xử lý, các nguồn lực cần thiết..."
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
              className={`${styles.textarea} ${errors.recommendations ? styles.inputError : ''}`}
            />
            <div className={styles.charCount}>{formData.recommendations.length} / 1000 ký tự</div>
            {errors.recommendations && (
              <div className={styles.error}>
                <AlertTriangle size={14} />
                {errors.recommendations}
              </div>
            )}
          </div>

          {/* Support Needed */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Hỗ trợ cần thiết</h2>

            <div className={styles.supportGrid}>
              {supportTypes.map((support) => (
                <label key={support} className={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={formData.supportNeeded.includes(support)}
                    onChange={() => toggleSupport(support)}
                  />
                  <span>{support}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Tài liệu đính kèm</h2>

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

          {/* CC */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Gửi bản sao (CC)</h2>

            <div className={styles.ccInput}>
              <input
                type="email"
                placeholder="Nhập email và nhấn Enter"
                value={ccInput}
                onChange={(e) => setCcInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCC();
                  }
                }}
                className={styles.input}
              />
            </div>

            {formData.cc.length > 0 && (
              <div className={styles.ccList}>
                {formData.cc.map((email, index) => (
                  <span key={index} className={styles.ccTag}>
                    {email}
                    <button type="button" onClick={() => removeCC(email)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
                Đang gửi...
              </>
            ) : (
              <>
                <Send size={16} />
                Chuyển cấp
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
