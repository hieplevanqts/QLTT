import { useState } from "react";
import {
  Bot,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  Bell,
  Activity,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Eye,
  User,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import styles from "./LeadInboxAIDemo.module.css";

interface AILead {
  id: string;
  code: string;
  title: string;
  reporter: string;
  reportDate: string;
  location: string;
  category: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  ai: {
    verdict: "worthy" | "unworthy" | "review";
    confidence: number;
    summary: string;
    recommendation: string;
    violations: string[];
    severity: string;
    evidenceQuality: string;
    similarCases: number;
  };
}

export default function LeadInboxAIDemo() {
  const navigate = useNavigate();
  const [selectedLead, setSelectedLead] = useState<AILead | null>(null);

  // Mock AI Leads Data
  const [aiLeads] = useState<AILead[]>([
    {
      id: "1",
      code: "LD-2025-001",
      title: "Cửa hàng mỹ phẩm Hoàn Kiếm bán hàng giả",
      reporter: "Nguyễn Văn A",
      reportDate: "15/01/2025",
      location: "Quận Hoàn Kiếm, Hà Nội",
      category: "Hàng giả",
      timestamp: new Date(Date.now() - 5 * 60000), // 5 phút trước
      priority: 'high',
      isRead: false,
      ai: {
        verdict: "worthy",
        confidence: 95,
        summary: "Cửa hàng bán mỹ phẩm giả thương hiệu nổi tiếng, có hình ảnh bằng chứng rõ ràng",
        recommendation: "Phân công ngay cho đội Hoàn Kiếm. Cần thanh tra trong vòng 24 giờ do có bằng chứng video và nhiều người phản ánh.",
        violations: [
          "Hàng giả, hàng nhái",
          "Không tem nhãn phụ",
          "Gian lận thương mại",
        ],
        severity: "Cao",
        evidenceQuality: "Tốt",
        similarCases: 3,
      },
    },
    {
      id: "2",
      code: "LD-2025-002",
      title: "Siêu thị ABC gian lận giá cả",
      reporter: "Trần Thị B",
      reportDate: "16/01/2025",
      location: "Quận Đống Đa, Hà Nội",
      category: "Gian lận giá",
      timestamp: new Date(Date.now() - 15 * 60000), // 15 phút trước
      priority: 'medium',
      isRead: false,
      ai: {
        verdict: "review",
        confidence: 68,
        summary: "Nghi ngờ gian lận giá nhưng thiếu bằng chứng cụ thể, cần xác minh thêm",
        recommendation: "Yêu cầu bổ sung ảnh hóa đơn. Liên hệ người phản ánh để thu thập thêm bằng chứng trước khi phân công thanh tra.",
        violations: ["Nghi ngờ gian lận giá"],
        severity: "Trung bình",
        evidenceQuality: "Yếu",
        similarCases: 1,
      },
    },
    {
      id: "3",
      code: "LD-2025-003",
      title: "Quảng cáo sản phẩm giảm cân",
      reporter: "Lê Văn C",
      reportDate: "17/01/2025",
      location: "Online",
      category: "Quảng cáo",
      timestamp: new Date(Date.now() - 30 * 60000), // 30 phút trước
      priority: 'low',
      isRead: true,
      ai: {
        verdict: "unworthy",
        confidence: 92,
        summary: "Chỉ là quảng cáo, không có hành vi vi phạm, trùng với 3 tin đã từ chối",
        recommendation: "Từ chối và đánh dấu spam. Đã có 3 trường hợp tương tự được AI phát hiện và xử lý tự động.",
        violations: [],
        severity: "Thấp",
        evidenceQuality: "Không có",
        similarCases: 3,
      },
    },
    {
      id: "4",
      code: "LD-2025-004",
      title: "Nhà hàng không đảm bảo VSATTP",
      reporter: "Phạm Thị D",
      reportDate: "18/01/2025",
      location: "Quận Cầu Giấy, Hà Nội",
      category: "ATTP",
      timestamp: new Date(Date.now() - 60 * 60000), // 1 giờ trước
      priority: 'high',
      isRead: false,
      ai: {
        verdict: "worthy",
        confidence: 88,
        summary: "Phản ánh về vệ sinh thực phẩm, có video hiện trường, nhiều người phản ánh",
        recommendation: "Phân công cho thanh tra ATTP. Ưu tiên cao do liên quan đến sức khỏe cộng đồng và có nhiều bằng chứng video.",
        violations: [
          "Không đảm bảo vệ sinh",
          "Nghi ngờ thực phẩm bẩn",
        ],
        severity: "Cao",
        evidenceQuality: "Tốt",
        similarCases: 2,
      },
    },
    {
      id: "5",
      code: "LD-2025-005",
      title: "Cửa hàng điện thoại bán hàng xách tay không rõ nguồn gốc",
      reporter: "Hoàng Văn E",
      reportDate: "19/01/2025",
      location: "Quận Hai Bà Trưng, Hà Nội",
      category: "Hàng không nguồn gốc",
      timestamp: new Date(Date.now() - 120 * 60000), // 2 giờ trước
      priority: 'medium',
      isRead: true,
      ai: {
        verdict: "review",
        confidence: 72,
        summary: "Có dấu hiệu bán hàng xách tay không hóa đơn, cần xác minh nguồn gốc hàng hóa",
        recommendation: "Cần kiểm tra hồ sơ nhập khẩu. Yêu cầu thanh tra viên xác minh nguồn gốc và giấy tờ hợp pháp của sản phẩm.",
        violations: [
          "Hàng xách tay không rõ nguồn gốc",
          "Không có hóa đơn chứng từ",
        ],
        severity: "Trung bình",
        evidenceQuality: "Trung bình",
        similarCases: 4,
      },
    },
  ]);

  const getVerdictConfig = (verdict: AILead['ai']['verdict']) => {
    const configs = {
      worthy: {
        icon: CheckCircle,
        text: "Đáng xử lý",
        color: "rgba(34, 197, 94, 1)",
        bgColor: "rgba(34, 197, 94, 0.1)",
      },
      unworthy: {
        icon: XCircle,
        text: "Không đáng",
        color: "rgba(107, 114, 128, 1)",
        bgColor: "rgba(107, 114, 128, 0.1)",
      },
      review: {
        icon: AlertTriangle,
        text: "Cần xem xét",
        color: "rgba(245, 158, 11, 1)",
        bgColor: "rgba(245, 158, 11, 0.1)",
      },
    };
    return configs[verdict];
  };

  const getPriorityLabel = (priority: AILead['priority']) => {
    switch (priority) {
      case 'high':
        return 'Ưu tiên cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return '';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000); // phút

    if (diff < 1) return 'Vừa xong';
    if (diff < 60) return `${diff} phút trước`;
    if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const handleLeadClick = (lead: AILead) => {
    setSelectedLead(lead);
  };

  const handleApproveAI = () => {
    if (selectedLead) {
      alert(`✅ Chấp nhận đề xuất AI cho lead ${selectedLead.code}`);
    }
  };

  const handleRejectLead = () => {
    if (selectedLead) {
      alert(`❌ Từ chối lead ${selectedLead.code}`);
    }
  };

  const handleRequestMore = () => {
    if (selectedLead) {
      alert(`⚠️ Yêu cầu bổ sung thông tin cho lead ${selectedLead.code}`);
    }
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: "Nguồn tin, Rủi ro",
            path: "/lead-risk/inbox",
          },
          { label: "Trợ lý ảo của bạn" },
        ]}
      />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleWithIcon}>
            <Bot size={28} style={{ color: 'var(--primary)' }} />
            <h1 className={styles.title}>Trợ lý ảo của bạn</h1>
            <Sparkles size={20} style={{ color: 'rgba(251, 146, 60, 1)' }} />
          </div>
          <p className={styles.subtitle}>
            AI phân tích và đề xuất xử lý nguồn tin thông minh
          </p>
        </div>

        <button
          onClick={() => navigate("/lead-risk/inbox")}
          className={styles.backButton}
        >
          ← Quay lại
        </button>
      </div>

      {/* Two Column Layout */}
      <div className={styles.twoColumnLayout}>
        {/* Left Column - AI Leads Feed */}
        <div className={styles.leftColumn}>
          <div className={styles.columnHeader}>
            <h2 className={styles.columnTitle}>
              <Activity size={18} />
              Nguồn tin đã phân tích
            </h2>
            <span className={styles.badge}>{aiLeads.filter(l => !l.isRead).length} mới</span>
          </div>

          <div className={styles.leadsList}>
            {aiLeads.map((lead) => {
              const config = getVerdictConfig(lead.ai.verdict);
              const IconComponent = config.icon;

              return (
                <div
                  key={lead.id}
                  className={`${styles.leadCard} ${selectedLead?.id === lead.id ? styles.leadCardActive : ''} ${!lead.isRead ? styles.leadCardUnread : ''}`}
                  onClick={() => handleLeadClick(lead)}
                >
                  <div className={styles.leadCardHeader}>
                    <div className={styles.leadVerdict} style={{ color: config.color, backgroundColor: config.bgColor }}>
                      <IconComponent size={14} />
                      <span>{config.text}</span>
                    </div>
                    <span className={styles.leadTime}>
                      <Clock size={12} />
                      {formatTimestamp(lead.timestamp)}
                    </span>
                  </div>

                  <div className={styles.leadCode}>{lead.code}</div>
                  <h3 className={styles.leadTitle}>{lead.title}</h3>

                  <div className={styles.leadMeta}>
                    <span className={styles.leadMetaItem}>
                      <User size={12} />
                      {lead.reporter}
                    </span>
                    <span className={styles.leadMetaItem}>
                      <MapPin size={12} />
                      {lead.location}
                    </span>
                  </div>

                  <div className={styles.leadAISummary}>
                    <Sparkles size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span>{lead.ai.summary}</span>
                  </div>

                  <div className={styles.leadFooter}>
                    <span className={`${styles.leadPriority} ${styles[`priority${lead.priority}`]}`}>
                      {getPriorityLabel(lead.priority)}
                    </span>
                    <span className={styles.leadConfidence}>{lead.ai.confidence}% tin cậy</span>
                    <ChevronRight size={16} className={styles.leadArrow} />
                  </div>

                  {!lead.isRead && <div className={styles.unreadDot}></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Lead Details */}
        <div className={styles.rightColumn}>
          {selectedLead ? (
            <div className={styles.detailsContainer}>
              {/* Header */}
              <div className={styles.detailsHeader}>
                <div className={styles.detailsVerdictLarge} style={{
                  backgroundColor: getVerdictConfig(selectedLead.ai.verdict).bgColor,
                  color: getVerdictConfig(selectedLead.ai.verdict).color
                }}>
                  {(() => {
                    const config = getVerdictConfig(selectedLead.ai.verdict);
                    const IconComponent = config.icon;
                    return <IconComponent size={20} />;
                  })()}
                  <span>{getVerdictConfig(selectedLead.ai.verdict).text}</span>
                </div>
                <span className={styles.detailsTime}>{formatTimestamp(selectedLead.timestamp)}</span>
              </div>

              <div className={styles.detailsCode}>{selectedLead.code}</div>
              <h2 className={styles.detailsTitle}>{selectedLead.title}</h2>

              {/* Basic Info */}
              <div className={styles.detailsInfoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <User size={14} />
                    Người phản ánh
                  </div>
                  <div className={styles.infoValue}>{selectedLead.reporter}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <Calendar size={14} />
                    Ngày tiếp nhận
                  </div>
                  <div className={styles.infoValue}>{selectedLead.reportDate}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <MapPin size={14} />
                    Địa điểm
                  </div>
                  <div className={styles.infoValue}>{selectedLead.location}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FileText size={14} />
                    Danh mục
                  </div>
                  <div className={styles.infoValue}>{selectedLead.category}</div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className={styles.detailsSection}>
                <h3 className={styles.detailsSectionTitle}>
                  <Sparkles size={18} />
                  Phân tích AI
                </h3>
                <p className={styles.detailsText}>{selectedLead.ai.summary}</p>
              </div>

              {/* AI Metrics */}
              <div className={styles.detailsSection}>
                <h3 className={styles.detailsSectionTitle}>Số liệu đánh giá</h3>
                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Độ tin cậy AI</div>
                    <div className={styles.metricValue}>{selectedLead.ai.confidence}%</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Mức độ nghiêm trọng</div>
                    <div className={styles.metricValue}>{selectedLead.ai.severity}</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Chất lượng bằng chứng</div>
                    <div className={styles.metricValue}>{selectedLead.ai.evidenceQuality}</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Trường hợp tương tự</div>
                    <div className={styles.metricValue}>{selectedLead.ai.similarCases} cases</div>
                  </div>
                </div>
              </div>

              {/* Violations */}
              {selectedLead.ai.violations.length > 0 && (
                <div className={styles.detailsSection}>
                  <h3 className={styles.detailsSectionTitle}>Hành vi vi phạm phát hiện</h3>
                  <ul className={styles.violationsList}>
                    {selectedLead.ai.violations.map((violation, idx) => (
                      <li key={idx}>{violation}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Recommendation */}
              <div className={styles.detailsSection}>
                <h3 className={styles.detailsSectionTitle}>Đề xuất của AI</h3>
                <div className={styles.recommendation}>
                  <Bell size={16} />
                  <p className={styles.detailsText}>{selectedLead.ai.recommendation}</p>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.detailsActions}>
                {selectedLead.ai.verdict === "worthy" && (
                  <>
                    <button className={styles.btnApprove} onClick={handleApproveAI}>
                      <ThumbsUp size={16} />
                      Chấp nhận đề xuất AI
                    </button>
                    <button className={styles.btnSecondary} onClick={() => navigate("/lead-risk/lead-detail-ai-demo")}>
                      <Eye size={16} />
                      Xem chi tiết
                    </button>
                  </>
                )}

                {selectedLead.ai.verdict === "unworthy" && (
                  <>
                    <button className={styles.btnReject} onClick={handleRejectLead}>
                      <ThumbsDown size={16} />
                      Đồng ý từ chối
                    </button>
                    <button className={styles.btnSecondary} onClick={() => navigate("/lead-risk/lead-detail-ai-demo")}>
                      <Eye size={16} />
                      Xem lại
                    </button>
                  </>
                )}

                {selectedLead.ai.verdict === "review" && (
                  <>
                    <button className={styles.btnReview} onClick={handleRequestMore}>
                      <AlertTriangle size={16} />
                      Yêu cầu bổ sung
                    </button>
                    <button className={styles.btnSecondary} onClick={() => navigate("/lead-risk/lead-detail-ai-demo")}>
                      <Eye size={16} />
                      Xem chi tiết
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetails}>
              <Bot size={64} style={{ color: 'var(--muted-foreground)', opacity: 0.3 }} />
              <h3>Chọn một nguồn tin để xem chi tiết</h3>
              <p>Click vào các nguồn tin bên trái để xem phân tích AI và đề xuất xử lý</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
