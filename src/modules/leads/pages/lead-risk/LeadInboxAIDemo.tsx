import { useState, useEffect } from "react";
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
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AIBulkActionBar } from "@/components/lead-risk/AIBulkActionBar";
import { Breadcrumb } from "@/components/Breadcrumb";
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
  const [activeTab, setActiveTab] = useState<'overview' | 'category' | 'location'>('overview');

  // Mock AI Leads Data
  const [aiLeads, setAiLeads] = useState<AILead[]>([
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

  // Generators for random data
  const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const generateRandomLead = (): AILead => {
    const categories = ['Hàng giả', 'Gian lận giá', 'ATTP', 'Hàng không nguồn gốc', 'Quảng cáo'];
    const locations = ['Quận Cầu Giấy, Hà Nội', 'Quận Hoàn Kiếm, Hà Nội', 'Quận Đống Đa, Hà Nội', 'Quận Ba Đình, Hà Nội', 'Online'];
    const reporters = ['Nguyễn Văn F', 'Lê Thị G', 'Phạm Văn H', 'Tran Thi K', 'Anonymous'];
    const titles = [
      'Phát hiện kho hàng lậu lớn',
      'Nghi vấn bán hàng giả trên Facebook',
      'Cửa hàng thực phẩm bẩn',
      'Quảng cáo sai sự thật về thuốc',
      'Tăng giá bất hợp lý dịp Tết'
    ];

    const category = getRandomElement(categories);
    const location = getRandomElement(locations);
    const priority = getRandomElement(['high', 'medium', 'low'] as const);

    let verdict: AILead['ai']['verdict'] = 'review';
    let confidence = 50 + Math.floor(Math.random() * 40);

    if (priority === 'high') {
      verdict = 'worthy';
      confidence = 80 + Math.floor(Math.random() * 15);
    } else if (priority === 'low') {
      verdict = 'unworthy';
      confidence = 85 + Math.floor(Math.random() * 10);
    }

    const id = Math.random().toString(36).substr(2, 9);

    return {
      id,
      code: `LD-2025-${Math.floor(Math.random() * 1000)}`,
      title: getRandomElement(titles),
      reporter: getRandomElement(reporters),
      reportDate: new Date().toLocaleDateString('vi-VN'),
      location,
      category,
      timestamp: new Date(),
      priority,
      isRead: false,
      ai: {
        verdict,
        confidence,
        summary: `AI phân tích tự động: ${category} tại ${location}.`,
        recommendation: "Cần xác minh thêm thông tin.",
        violations: [`Nghi vấn ${category}`],
        severity: priority === 'high' ? 'Cao' : (priority === 'medium' ? 'Trung bình' : 'Thấp'),
        evidenceQuality: "Trung bình",
        similarCases: Math.floor(Math.random() * 5),
      }
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newLead = generateRandomLead();
      setAiLeads(prev => [newLead, ...prev]);
    }, 3000); // Add new lead every 3 seconds

    return () => clearInterval(interval);
  }, []);

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
            <h1 className={styles.title}>Trợ lý ảo của bạn 123</h1>
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

      {/* News Ticker */}
      <div className={styles.tickerContainer}>
        <div className={styles.tickerLabel}>
          <Zap size={16} fill="white" />
          <span>Tin mới nhận ({aiLeads.length})</span>
        </div>
        <div className={styles.tickerTrackWrapper}>
          <div className={styles.tickerTrack}>
            {[...aiLeads, ...aiLeads, ...aiLeads, ...aiLeads].map((lead, index) => (
              <div key={`${lead.id}-${index}`} className={styles.tickerItem} onClick={() => handleLeadClick(lead)} style={{ cursor: 'pointer' }}>
                <span className={styles.tickerTime}>{formatTimestamp(lead.timestamp)}</span>
                <span className={styles.tickerIcon}>•</span>
                <strong>{lead.category}:</strong>
                <span>{lead.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className={styles.threeColumnLayout}>

        {/* Left Column (3 parts) - List */}
        <div className={styles.leftColumn}>
          <div className={styles.columnHeader}>
            <h2 className={styles.columnTitle}>
              <Activity size={18} />
              <Activity size={18} />
              Live Feed
              <span className={styles.liveIndicator}></span>
            </h2>
            <div style={{ display: 'flex', gap: 4 }}>
              <span className={styles.badge} style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>{aiLeads.filter(l => l.isRead).length} đã xem</span>
              <span className={styles.badge}>{aiLeads.filter(l => !l.isRead).length} mới</span>
            </div>
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

                  <div className={styles.leadFooter}>
                    <span className={`${styles.leadPriority} ${styles[`priority${lead.priority}`]}`}>
                      {getPriorityLabel(lead.priority)}
                    </span>
                    <span className={styles.leadConfidence}>{lead.ai.confidence}% tin cậy</span>
                  </div>

                  {!lead.isRead && <div className={styles.unreadDot}></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column (6 parts) - Dashboard or Detail */}
        <div className={styles.centerColumn}>
          {selectedLead ? (
            // Lead Detail View
            <div className={styles.detailViewContainer}>
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

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span className={styles.detailsTime}>{formatTimestamp(selectedLead.timestamp)}</span>
                  <button onClick={() => setSelectedLead(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                    <XCircle size={20} />
                  </button>
                </div>
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
                <div className={styles.leadAISummary} style={{ fontSize: 'var(--text-md)', padding: 'var(--spacing-4)' }}>
                  <Sparkles size={16} style={{ color: 'var(--primary)', marginTop: 4 }} />
                  <p style={{ margin: 0 }}>{selectedLead.ai.summary}</p>
                </div>
              </div>

              {/* Violations */}
              {selectedLead.ai.violations.length > 0 && (
                <div className={styles.detailsSection}>
                  <h3 className={styles.detailsSectionTitle}>Hành vi vi phạm phát hiện</h3>
                  <ul className={styles.violationsList}>
                    {selectedLead.ai.violations.map((violation, idx) => (
                      <li key={idx}>• {violation}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Recommendation */}
              <div className={styles.detailsSection}>
                <h3 className={styles.detailsSectionTitle}>Đề xuất của AI</h3>
                <div className={styles.recommendation}>
                  <Bell size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                  <p className={styles.detailsText}>{selectedLead.ai.recommendation}</p>
                </div>
              </div>
            </div>
          ) : (
            // Default Dashboard View
            <div className={styles.dashboardContainer}>
              <div className={styles.dashboardHeader}>
                <h2 className={styles.dashboardTitle}>Tổng quan rủi ro</h2>
                <p className={styles.dashboardSubtitle}>Cập nhật thời gian thực từ các nguồn tin</p>
              </div>

              {/* Tabs Header */}
              <div className={styles.tabHeader}>
                <button
                  className={`${styles.tabButton} ${activeTab === 'overview' ? styles.tabButtonActive : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Tổng quan
                </button>
                <button
                  className={`${styles.tabButton} ${activeTab === 'category' ? styles.tabButtonActive : ''}`}
                  onClick={() => setActiveTab('category')}
                >
                  Phân loại nguồn tin
                </button>
                <button
                  className={`${styles.tabButton} ${activeTab === 'location' ? styles.tabButtonActive : ''}`}
                  onClick={() => setActiveTab('location')}
                >
                  Địa bàn
                </button>
              </div>

              <div className={styles.tabContent}>
                {activeTab === 'overview' && (
                  <>
                    <div className={styles.statsGrid}>
                      <div className={styles.statCard}>
                        <span className={styles.statLabel}>Tổng tin hôm nay</span>
                        <span className={styles.statValue}>{aiLeads.length}</span>
                        <TrendingUp size={16} className="text-green-500" />
                      </div>
                      <div className={styles.statCard}>
                        <span className={styles.statLabel}>Rủi ro cao</span>
                        <span className={styles.statValue} style={{ color: 'rgb(239, 68, 68)' }}>{aiLeads.filter(l => l.priority === 'high').length}</span>
                        <AlertTriangle size={16} className="text-red-500" />
                      </div>
                      <div className={styles.statCard}>
                        <span className={styles.statLabel}>Đã xử lý</span>
                        <span className={styles.statValue} style={{ color: 'rgb(34, 197, 94)' }}>{aiLeads.filter(l => l.isRead).length}</span>
                        <CheckCircle size={16} className="text-blue-500" />
                      </div>
                    </div>

                    <div className={styles.filterSection}>
                      <div className={styles.filterTitle}>
                        <Activity size={16} />
                        Lọc theo ngành hàng / Danh mục
                      </div>
                      <div className={styles.filterTags}>
                        {["Tất cả", "ATTP", "Hàng giả", "Gian lận giá", "Quảng cáo", "Dược phẩm", "Mỹ phẩm", "Điện tử"].map(tag => (
                          <button key={tag} className={styles.filterTag}>
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Placeholder for a chart or map */}
                    <div style={{ height: 200, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
                      [Biểu đồ xu hướng vi phạm theo khu vực]
                    </div>
                  </>
                )}

                {activeTab === 'category' && (
                  <div className={styles.detailsSection}>
                    <h3 className={styles.detailsSectionTitle}>Phân bố theo danh mục</h3>
                    <div className={styles.metricsGrid}>
                      {Object.entries(
                        aiLeads.reduce((acc, lead) => {
                          acc[lead.category] = (acc[lead.category] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([category, count]) => (
                        <div key={category} className={styles.metricCard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div className={styles.metricLabel}>{category}</div>
                            <div className={styles.metricValue} style={{ fontSize: 'var(--text-base)' }}>{count} tin</div>
                          </div>
                          <div style={{ width: '100px', height: '8px', background: 'var(--secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${(count / aiLeads.length) * 100}%`, height: '100%', background: 'var(--primary)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className={styles.detailsSection}>
                    <h3 className={styles.detailsSectionTitle}>Phân bố theo địa bàn</h3>
                    <div className={styles.metricsGrid}>
                      {Object.entries(
                        aiLeads.reduce((acc, lead) => {
                          acc[lead.location] = (acc[lead.location] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([location, count]) => (
                        <div key={location} className={styles.metricCard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={16} className="text-muted-foreground" />
                            <div>
                              <div className={styles.metricLabel} style={{ marginBottom: 0 }}>{location}</div>
                            </div>
                          </div>
                          <div className={styles.metricValue} style={{ fontSize: 'var(--text-base)' }}>{count}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '20px', height: 200, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
                      [Bản đồ nhiệt cảnh báo rủi ro]
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (3 parts) - Actions */}
        <div className={styles.rightColumn}>
          {selectedLead ? (
            <>
              <div className={styles.actionPanelTitle}>
                Hành động xử lý
              </div>

              <div className={styles.actionButtonStack}>
                {selectedLead.ai.verdict === "worthy" && (
                  <>
                    <button className={`${styles.actionButton} ${styles.btnApprove}`} onClick={handleApproveAI}>
                      <ThumbsUp size={18} />
                      Chấp nhận đề xuất
                    </button>
                    <button className={`${styles.actionButton} ${styles.btnSecondary}`} onClick={() => navigate("/lead-risk/lead-detail-ai-demo")}>
                      <Eye size={18} />
                      Xem chi tiết
                    </button>
                  </>
                )}

                {selectedLead.ai.verdict === "unworthy" && (
                  <>
                    <button className={`${styles.actionButton} ${styles.btnReject}`} onClick={handleRejectLead}>
                      <ThumbsDown size={18} />
                      Từ chối tin
                    </button>
                    <button className={`${styles.actionButton} ${styles.btnSecondary}`} onClick={() => navigate("/lead-risk/lead-detail-ai-demo")}>
                      <Eye size={18} />
                      Xem chi tiết
                    </button>
                  </>
                )}

                {selectedLead.ai.verdict === "review" && (
                  <>
                    <button className={`${styles.actionButton} ${styles.btnReview}`} onClick={handleRequestMore}>
                      <AlertTriangle size={18} />
                      Yêu cầu bổ sung
                    </button>
                    <button className={`${styles.actionButton} ${styles.btnSecondary}`} onClick={() => navigate("/lead-risk/lead-detail-ai-demo")}>
                      <Eye size={18} />
                      Xem chi tiết
                    </button>
                  </>
                )}
              </div>

              <div className={styles.actionPanelTitle} style={{ marginTop: 'var(--spacing-8)' }}>
                Số liệu phân tích
              </div>
              <div className={styles.metricsGrid} style={{ gridTemplateColumns: '1fr', gap: 'var(--spacing-3)' }}>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Độ tin cậy AI</div>
                  <div className={styles.metricValue}>{selectedLead.ai.confidence}%</div>
                  <div style={{ height: 4, background: '#eee', marginTop: 8, borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${selectedLead.ai.confidence}%`, background: 'var(--primary)', borderRadius: 2 }}></div>
                  </div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Độ nghiêm trọng</div>
                  <div className={styles.metricValue}>{selectedLead.ai.severity}</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Tương tự</div>
                  <div className={styles.metricValue}>{selectedLead.ai.similarCases} cases</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--muted-foreground)', textAlign: 'center', marginTop: 'var(--spacing-12)' }}>
              <Info size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
              <p style={{ fontSize: 'var(--text-sm)' }}>Chọn một nguồn tin để xem các hành động khả dụng.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
