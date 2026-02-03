import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AIImageAnalysis } from '@/components/lead-risk/AIImageAnalysis';
import { AIVoiceAnalysis } from '@/components/lead-risk/AIVoiceAnalysis';
import styles from './LeadDetailAIDemo.module.css';

// Risk Level Badge
function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const config = {
    low: {
      icon: CheckCircle2,
      text: 'Thấp',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      borderColor: 'rgba(34, 197, 94, 0.3)',
      textColor: 'rgb(21, 128, 61)',
    },
    medium: {
      icon: AlertTriangle,
      text: 'Trung bình',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      textColor: 'rgb(161, 98, 7)',
    },
    high: {
      icon: XCircle,
      text: 'Cao',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      textColor: 'rgb(185, 28, 28)',
    },
  };

  const c = config[level];
  const Icon = c.icon;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-1)',
        height: '32px',
        padding: '0 var(--spacing-3)',
        backgroundColor: c.bgColor,
        border: `1px solid ${c.borderColor}`,
        borderRadius: 'var(--radius)',
        fontFamily: 'Inter, sans-serif',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-semibold)',
        color: c.textColor,
      }}
    >
      <Icon size={16} />
      <span>Mức độ rủi ro: {c.text}</span>
    </div>
  );
}

// Confidence Badge
function ConfidenceBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: 'rgb(21, 128, 61)' };
    if (score >= 60) return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: 'rgb(161, 98, 7)' };
    return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: 'rgb(185, 28, 28)' };
  };

  const color = getColor();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-1)',
        height: '32px',
        padding: '0 var(--spacing-3)',
        backgroundColor: color.bg,
        border: `1px solid ${color.border}`,
        borderRadius: 'var(--radius)',
        fontFamily: 'Inter, sans-serif',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-semibold)',
        color: color.text,
      }}
    >
      <span>Độ tin cậy: {score}%</span>
    </div>
  );
}

export default function LeadDetailAIDemo() {
  const navigate = useNavigate();
  const [showOriginalContent, setShowOriginalContent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock AI Image Analysis Data
  const imageAnalysisData = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      fileName: 'IMG_001_packaging.jpg',
      detectedObjects: ['Bao bì mỹ phẩm', 'Nhãn mác', 'Tem chống giả'],
      suggestedTags: [
        {
          type: 'counterfeit',
          label: 'Hàng giả',
          confidence: 94,
          color: 'rgb(239, 68, 68)',
          bgColor: 'rgba(239, 68, 68, 0.1)',
        },
        {
          type: 'label_violation',
          label: 'Vi phạm nhãn mác',
          confidence: 87,
          color: 'rgb(245, 158, 11)',
          bgColor: 'rgba(245, 158, 11, 0.1)',
        },
      ],
      keyFindings: [
        'Nhãn mác in mờ, chữ không sắc nét',
        'Tem chống giả không có mã QR chuẩn',
        'Thiếu thông tin xuất xứ bắt buộc',
        'Màu sắc logo khác với sản phẩm chính hãng',
      ],
      overallConfidence: 91,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
      fileName: 'IMG_002_receipt.jpg',
      detectedObjects: ['Hóa đơn', 'Chữ viết tay', 'Dấu mộc'],
      suggestedTags: [
        {
          type: 'unclear_origin',
          label: 'Không rõ nguồn gốc',
          confidence: 78,
          color: 'rgb(161, 98, 7)',
          bgColor: 'rgba(245, 158, 11, 0.1)',
        },
      ],
      keyFindings: [
        'Hóa đơn không có mã số thuế',
        'Thiếu thông tin doanh nghiệp đầy đủ',
        'Chỉ có dấu mộc đơn giản, không rõ ràng',
      ],
      overallConfidence: 75,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
      fileName: 'IMG_003_store_front.jpg',
      detectedObjects: ['Biển hiệu', 'Cửa hàng', 'Sản phẩmjin열'],
      suggestedTags: [
        {
          type: 'counterfeit',
          label: 'Hàng giả',
          confidence: 82,
          color: 'rgb(239, 68, 68)',
          bgColor: 'rgba(239, 68, 68, 0.1)',
        },
      ],
      keyFindings: [
        'Nhiều sản phẩm mỹ phẩm không rõ nguồn gốc',
        'Biển hiệu sử dụng logo thương hiệu nổi tiếng nhưng không có giấy phép',
        'Giá bán thấp bất thường so với thị trường',
      ],
      overallConfidence: 80,
    },
  ];

  // Mock AI Voice Analysis Data
  const voiceAnalysisData = [
    {
      voiceUrl: '#', // In production, this would be actual audio file URL
      fileName: 'voice_recording_001.m4a',
      duration: '2:34',
      summary:
        'Người dân phản ánh mua mỹ phẩm tại cửa hàng số 45 Phố Hàng Gai, Hoàn Kiếm. Sản phẩm nghi ngờ hàng giả do tem chống giả không quét được, bao bì in mờ, và giá rẻ bất thường so với thị trường.',
      extractedInfo: {
        behavior: 'Bán hàng giả, hàng nhái thương hiệu',
        subject: 'Mỹ phẩm các nhãn hiệu L\'Oreal, MAC, Innisfree',
        location: '45 Phố Hàng Gai, Phường Hoàn Kiếm, Hà Nội',
        time: 'Mua hàng vào ngày 20/01/2025',
      },
      suggestedTags: [
        {
          type: 'counterfeit',
          label: 'Hàng giả',
          confidence: 92,
          color: 'rgb(239, 68, 68)',
          bgColor: 'rgba(239, 68, 68, 0.1)',
        },
        {
          type: 'trademark_violation',
          label: 'Xâm phạm thương hiệu',
          confidence: 88,
          color: 'rgb(245, 158, 11)',
          bgColor: 'rgba(245, 158, 11, 0.1)',
        },
      ],
      confidence: 89,
      status: 'violation',
    },
  ];

  // Mock AI Analysis Data
  const aiAnalysis = {
    summary: 'Phản ánh cửa hàng mỹ phẩm tại 45 Hoàn Kiếm bán sản phẩm giả mạo thương hiệu L\'Oreal, MAC, Innisfree. Người dân cung cấp hình ảnh bao bì, hóa đơn và tem chống giả nghi vấn.',
    violationTypes: ['Hàng giả', 'Xâm phạm thương hiệu', 'Gian lận thương mại'],
    confidence: 92,
    riskLevel: 'high' as const,
    
    keyIndicators: [
      { icon: '📸', text: 'Có 5 ảnh bao bì sản phẩm rõ nét, xuất xứ không rõ ràng' },
      { icon: '🧾', text: 'Hóa đơn không có đầy đủ thông tin doanh nghiệp' },
      { icon: '🔍', text: 'Tem chống giả không phản hồi khi quét mã QR' },
      { icon: '📍', text: 'Địa chỉ cửa hàng đã từng có 2 lần phản ánh tương tự (2024)' },
    ],

    advancedAnalysis: {
      duplicateDetection: 'Phát hiện 2 nguồn tin tương tự cùng địa điểm trong vòng 6 tháng (LD-2024-089, LD-2024-156)',
      relatedEntities: [
        { type: 'Cơ sở', name: 'Cửa hàng Mỹ phẩm Hàn Quốc - 45 Hoàn Kiếm', code: 'CS-HK-2024-012' },
        { type: 'Khu vực', name: 'Phố Hàng Gai, Hoàn Kiếm (hotspot vi phạm mỹ phẩm)', code: null },
      ],
      pattern: 'Vi phạm có tính hệ thống - Cửa hàng tái phạm, có mạng lưới cung ứng hàng giả',
      severity: 'Cần thanh tra đột xuất trong vòng 48h để thu giữ bằng chứng',
    },

    recommendations: [
      {
        action: 'verify',
        title: 'Chuyển xác minh ngay (Khuyến nghị)',
        description: 'Phân công đội thanh tra Hoàn Kiếm kiểm tra trong vòng 48h',
        confidence: 95,
        isPrimary: true,
      },
      {
        action: 'request_info',
        title: 'Yêu cầu bổ sung thông tin',
        description: 'AI gợi ý hỏi thêm: "Anh/chị có lưu biên lai mua hàng và hộp đựng sản phẩm không? Có nhớ thời gian mua hàng cụ thể không?"',
        confidence: 40,
        isPrimary: false,
      },
    ],
  };

  // Mock Lead Data
  const lead = {
    code: 'LD-2025-001',
    title: 'Cửa hàng mỹ phẩm Hoàn Kiếm bán hàng giả',
    status: 'new',
    createdAt: '2025-01-22 09:30',
    reporter: {
      name: 'Nguyễn Thị Lan Anh',
      phone: '0912345678',
      address: 'Phường Hoàn Kiếm, Hà Nội',
    },
    content: {
      text: 'Em mua mỹ phẩm ở cửa hàng 45 Hoàn Kiếm, nghi ngờ hàng giả vì giá rẻ hơn nhiều so với cửa hàng chính hãng. Em đã quét mã QR trên tem chống giả nhưng không có phản hồi. Nhân viên cửa hàng nói là hàng xách tay Hàn Quốc nên giá rẻ, nhưng em thấy bao bì in không sắc nét, màu sắc khác với hàng thật. Em có chụp ảnh và giữ hóa đơn.',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
        'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
      ],
    },
    store: {
      name: 'Cửa hàng Mỹ phẩm Hàn Quốc',
      address: '45 Phố Hàng Gai, Hoàn Kiếm, Hà Nội',
    },
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
          { label: 'Chi tiết nguồn tin' },
        ]}
      />

      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate('/lead-risk/inbox-ai-demo')}
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{lead.code}: {lead.title}</h1>
          <div className={styles.metadata}>
            <span className={styles.metaItem}>
              <Calendar size={14} />
              {lead.createdAt}
            </span>
            <span className={styles.metaItem}>
              <User size={14} />
              {lead.reporter.name}
            </span>
            <span className={styles.metaItem}>
              <Phone size={14} />
              {lead.reporter.phone}
            </span>
          </div>
        </div>
      </div>

      {/* AI Analysis Section - DISPLAYED FIRST */}
      <div className={styles.aiSection}>
        <div className={styles.aiSectionHeader}>
          <div className={styles.aiSectionTitle}>
            <span className={styles.aiIcon}>🤖</span>
            <h2>AI Phân tích & Nhận định</h2>
            <span className={styles.aiSubtitle}>
              (AI đã phân tích nguồn tin này trước khi bạn mở)
            </span>
          </div>
          {!isEditing && (
            <button className={styles.editButton} onClick={() => setIsEditing(true)}>
              <Edit3 size={16} />
              Chỉnh sửa nhận định
            </button>
          )}
        </div>

        {/* Summary */}
        <div className={styles.aiBlock}>
          <div className={styles.blockHeader}>
            <FileText size={18} className={styles.blockIcon} />
            <h3>Tóm tắt nội dung</h3>
          </div>
          <p className={styles.summary}>{aiAnalysis.summary}</p>
        </div>

        {/* Key Metrics */}
        <div className={styles.metricsRow}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Loại vi phạm</div>
            <div className={styles.metricValue}>
              {aiAnalysis.violationTypes.map((type, idx) => (
                <span key={idx} className={styles.violationTag}>
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Đánh giá chung</div>
            <div className={styles.metricValue}>
              <ConfidenceBadge score={aiAnalysis.confidence} />
              <RiskBadge level={aiAnalysis.riskLevel} />
            </div>
          </div>
        </div>

        {/* Key Indicators */}
        <div className={styles.aiBlock}>
          <div className={styles.blockHeader}>
            <AlertTriangle size={18} className={styles.blockIcon} />
            <h3>Các dấu hiệu chính</h3>
          </div>
          <div className={styles.indicatorsList}>
            {aiAnalysis.keyIndicators.map((indicator, idx) => (
              <div key={idx} className={styles.indicator}>
                <span className={styles.indicatorIcon}>{indicator.icon}</span>
                <span className={styles.indicatorText}>{indicator.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Analysis */}
        <div className={styles.aiBlock}>
          <div className={styles.blockHeader}>
            <AlertTriangle size={18} className={styles.blockIcon} />
            <h3>Phân tích nâng cao</h3>
          </div>

          <div className={styles.advancedItem}>
            <strong>Phát hiện trùng lặp:</strong>
            <p>{aiAnalysis.advancedAnalysis.duplicateDetection}</p>
          </div>

          <div className={styles.advancedItem}>
            <strong>Liên quan đến:</strong>
            <ul className={styles.relatedList}>
              {aiAnalysis.advancedAnalysis.relatedEntities.map((entity, idx) => (
                <li key={idx}>
                  <span className={styles.entityType}>[{entity.type}]</span>{' '}
                  {entity.name}
                  {entity.code && (
                    <span className={styles.entityCode}> ({entity.code})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.advancedItem}>
            <strong>Nhận định:</strong>
            <p className={styles.patternText}>{aiAnalysis.advancedAnalysis.pattern}</p>
          </div>

          <div className={styles.severityBox}>
            <AlertTriangle size={20} />
            <span>{aiAnalysis.advancedAnalysis.severity}</span>
          </div>
        </div>

        {/* Recommendations */}
        <div className={styles.aiBlock}>
          <div className={styles.blockHeader}>
            <Send size={18} className={styles.blockIcon} />
            <h3>Đề xuất xử lý của AI</h3>
          </div>

          <div className={styles.recommendationsList}>
            {aiAnalysis.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`${styles.recommendation} ${
                  rec.isPrimary ? styles.recommendationPrimary : ''
                }`}
              >
                <div className={styles.recommendationHeader}>
                  <div className={styles.recommendationTitle}>
                    {rec.isPrimary && (
                      <span className={styles.primaryBadge}>Khuyến nghị</span>
                    )}
                    <strong>{rec.title}</strong>
                  </div>
                  <span className={styles.recommendationConfidence}>
                    {rec.confidence}% tin cậy
                  </span>
                </div>
                <p className={styles.recommendationDesc}>{rec.description}</p>
                {rec.isPrimary && !isEditing && (
                  <button className={styles.acceptButton}>
                    <ThumbsUp size={16} />
                    Chấp nhận đề xuất này
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Edit Mode Actions */}
        {isEditing && (
          <div className={styles.editActions}>
            <button className={styles.saveButton}>
              <CheckCircle2 size={16} />
              Lưu thay đổi
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </button>
          </div>
        )}
      </div>

      {/* AI Image Analysis Section */}
      <AIImageAnalysis
        images={imageAnalysisData}
        onUpdateTags={(imageIndex, tags) => {
          console.log(`Updated tags for image ${imageIndex}:`, tags);
        }}
      />

      {/* AI Voice Analysis Section */}
      <AIVoiceAnalysis
        voices={voiceAnalysisData}
        onUpdateTags={(voiceIndex, tags) => {
          console.log(`Updated tags for voice ${voiceIndex}:`, tags);
        }}
      />

      {/* Original Content Section - COLLAPSED BY DEFAULT */}
      <div className={styles.originalSection}>
        <button
          className={styles.toggleButton}
          onClick={() => setShowOriginalContent(!showOriginalContent)}
        >
          <div className={styles.toggleButtonContent}>
            <FileText size={18} />
            <span>Nội dung gốc từ người dân</span>
            <span className={styles.toggleHint}>
              (Chỉ xem khi cần đối chiếu)
            </span>
          </div>
          {showOriginalContent ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showOriginalContent && (
          <div className={styles.originalContent}>
            {/* Store Info */}
            <div className={styles.infoBlock}>
              <h3 className={styles.infoBlockTitle}>Thông tin cửa hàng</h3>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Tên cửa hàng:</span>
                <span className={styles.infoValue}>{lead.store.name}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>
                  <MapPin size={14} />
                  Địa chỉ:
                </span>
                <span className={styles.infoValue}>{lead.store.address}</span>
              </div>
            </div>

            {/* Reporter Info */}
            <div className={styles.infoBlock}>
              <h3 className={styles.infoBlockTitle}>Thông tin người báo</h3>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Họ tên:</span>
                <span className={styles.infoValue}>{lead.reporter.name}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Số điện thoại:</span>
                <span className={styles.infoValue}>{lead.reporter.phone}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Địa chỉ:</span>
                <span className={styles.infoValue}>{lead.reporter.address}</span>
              </div>
            </div>

            {/* Content */}
            <div className={styles.infoBlock}>
              <h3 className={styles.infoBlockTitle}>Nội dung phản ánh</h3>
              <p className={styles.contentText}>{lead.content.text}</p>
            </div>

            {/* Images */}
            <div className={styles.infoBlock}>
              <h3 className={styles.infoBlockTitle}>
                <ImageIcon size={18} />
                Hình ảnh đính kèm ({lead.content.images.length})
              </h3>
              <div className={styles.imagesGrid}>
                {lead.content.images.map((img, idx) => (
                  <div key={idx} className={styles.imageWrapper}>
                    <img src={img} alt={`Evidence ${idx + 1}`} className={styles.image} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Design Notes */}
      <div className={styles.designNotes}>
        <h3>✨ Nguyên tắc thiết kế AI Deep Analysis</h3>
        <ul>
          <li>
            <strong>🎯 AI-first:</strong> Khối AI hiển thị ĐẦU TIÊN, user không cần đọc
            nội dung gốc để hiểu nguồn tin
          </li>
          <li>
            <strong>📊 Báo cáo nghiệp vụ:</strong> Không phải chatbot, không có hội thoại.
            AI trình bày như một báo cáo phân tích ngắn gọn
          </li>
          <li>
            <strong>⚡ Quét-Hiểu-Quyết định:</strong> User quét nhanh → Hiểu ngay → Ra
            quyết định trong vài giây
          </li>
          <li>
            <strong>🔍 Nội dung gốc ẩn:</strong> Thu gọn mặc định, chỉ mở khi cần đối
            chiếu. 90% trường hợp user không cần mở
          </li>
          <li>
            <strong>✏️ Có thể chỉnh sửa:</strong> User có thể edit nhận định AI trước khi
            xác nhận
          </li>
          <li>
            <strong>💡 Đề xuất rõ ràng:</strong> AI gợi ý hành động cụ thể, kèm độ tin cậy,
            user quyết định cuối cùng
          </li>
        </ul>
      </div>
    </div>
  );
}
