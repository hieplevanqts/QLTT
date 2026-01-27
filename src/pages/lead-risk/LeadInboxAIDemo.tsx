import { useState } from "react";
import {
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  TrendingUp,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AIBulkActionBar } from "@/app/components/lead-risk/AIBulkActionBar";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import styles from "./LeadInboxAIDemo.module.css";

// AI Verdict Badge Component
function AIVerdictBadge({
  verdict,
}: {
  verdict: "worthy" | "unworthy" | "review";
}) {
  const config = {
    worthy: {
      icon: CheckCircle2,
      text: "Đáng xử lý",
      bgColor: "rgba(34, 197, 94, 0.1)",
      borderColor: "rgba(34, 197, 94, 0.3)",
      textColor: "rgb(21, 128, 61)",
    },
    unworthy: {
      icon: XCircle,
      text: "Không đáng",
      bgColor: "rgba(107, 114, 128, 0.1)",
      borderColor: "rgba(107, 114, 128, 0.3)",
      textColor: "rgb(75, 85, 99)",
    },
    review: {
      icon: AlertTriangle,
      text: "Cần xem xét",
      bgColor: "rgba(245, 158, 11, 0.1)",
      borderColor: "rgba(245, 158, 11, 0.3)",
      textColor: "rgb(161, 98, 7)",
    },
  };

  const c = config[verdict];
  const IconComponent = c.icon;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--spacing-2)",
        height: "28px",
        padding: "0 var(--spacing-3)",
        backgroundColor: c.bgColor,
        border: `1px solid ${c.borderColor}`,
        borderRadius: "var(--radius)",
        fontFamily: "Inter, sans-serif",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-weight-semibold)",
        color: c.textColor,
      }}
    >
      <IconComponent size={16} />
      <span>{c.text}</span>
    </div>
  );
}

// Mock Data
const mockLeads = [
  {
    id: "1",
    code: "LD-2025-001",
    title: "Cửa hàng mỹ phẩm Hoàn Kiếm bán hàng giả",
    reporter: "Nguyễn Văn A",
    reportDate: "15/01/2025",
    location: "Quận Hoàn Kiếm, Hà Nội",
    category: "Hàng giả",
    ai: {
      verdict: "worthy" as const,
      confidence: 95,
      summary:
        "Cửa hàng bán mỹ phẩm giả thương hiệu nổi tiếng, có hình ảnh bằng chứng rõ ràng",
      recommendation: "Phân công ngay cho đội Hoàn Kiếm",
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
    ai: {
      verdict: "review" as const,
      confidence: 68,
      summary:
        "Nghi ngờ gian lận giá nhưng thiếu bằng chứng cụ thể, cần xác minh thêm",
      recommendation: "Yêu cầu bổ sung ảnh hóa đơn",
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
    ai: {
      verdict: "unworthy" as const,
      confidence: 92,
      summary:
        "Chỉ là quảng cáo, không có hành vi vi phạm, trùng với 3 tin đã từ chối",
      recommendation: "Từ chối và đánh dấu spam",
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
    ai: {
      verdict: "worthy" as const,
      confidence: 88,
      summary:
        "Phản ánh về vệ sinh thực phẩm, có video hiện trường, nhiều người phản ánh",
      recommendation: "Phân công cho thanh tra ATTP",
      violations: [
        "Không đảm bảo vệ sinh",
        "Nghi ngờ thực phẩm bẩn",
      ],
      severity: "Cao",
      evidenceQuality: "Tốt",
      similarCases: 2,
    },
  },
];

export default function LeadInboxAIDemo() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(
    null,
  );

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: "Nguồn tin, Rủi ro",
            path: "/lead-risk/inbox",
          },
          { label: "Trợ lý ảo của bn" },
        ]}
      />

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Trợ lý ảo của bạn</h1>
        </div>
        <div
          style={{ display: "flex", gap: "var(--spacing-3)" }}
        >
          <button
            onClick={() => navigate("/lead-risk/inbox")}
            style={{
              height: "44px",
              padding: "0 var(--spacing-4)",
              background: "var(--secondary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--foreground)",
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* AI Bulk Action Bar */}
      <AIBulkActionBar
        totalLeads={50}
        analyzedCount={50}
        highConfidenceCount={25}
        spamCount={10}
        needsReviewCount={8}
        isProcessing={false}
        onApproveHighConfidence={() =>
          alert("✅ Duyệt 25 tin đáng xử lý")
        }
        onRejectSpam={() => alert("❌ Loại 10 tin spam")}
        onShowNeedsReview={() =>
          alert("⚠️ Xem 8 tin cần review")
        }
      />

      {/* Leads List with AI Info Layer */}
      <div className={styles.leadsContainer}>
        {mockLeads.map((lead) => (
          <div key={lead.id} className={styles.leadCard}>
            {/* Row 1: Basic Info + AI Verdict */}
            <div className={styles.leadHeader}>
              <div className={styles.leadBasicInfo}>
                <span className={styles.leadCode}>
                  {lead.code}
                </span>
                <span className={styles.leadTitle}>
                  {lead.title}
                </span>
                <span className={styles.leadReporter}>
                  <User
                    size={14}
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginRight: "4px",
                    }}
                  />
                  {lead.reporter}
                </span>
              </div>
              <AIVerdictBadge verdict={lead.ai.verdict} />
            </div>

            {/* Row 2: AI Summary (Always Visible) */}
            <div className={styles.aiSummary}>
              <div className={styles.aiSummaryIcon}>
                <Sparkles
                  size={18}
                  style={{ color: "var(--primary)" }}
                />
              </div>
              <div className={styles.aiSummaryText}>
                <strong>Phân tích AI:</strong> {lead.ai.summary}
              </div>
              <div className={styles.aiConfidence}>
                {lead.ai.confidence}%
              </div>
            </div>

            {/* Row 3: AI Recommendation */}
            <div className={styles.aiRecommendation}>
              <div className={styles.aiRecommendationIcon}>
                <Lightbulb
                  size={18}
                  style={{ color: "var(--muted-foreground)" }}
                />
              </div>
              <div className={styles.aiRecommendationText}>
                <strong>Đề xuất:</strong>{" "}
                {lead.ai.recommendation}
              </div>
            </div>

            {/* Row 4: Quick Actions */}
            <div className={styles.quickActions}>
              {lead.ai.verdict === "worthy" && (
                <>
                  <button className={styles.actionBtnApprove}>
                    <ThumbsUp size={16} />
                    Chấp nhận đề xuất AI
                  </button>
                  <button
                    className={styles.actionBtnView}
                    onClick={() =>
                      navigate("/lead-risk/lead-detail-ai-demo")
                    }
                  >
                    <Eye size={16} />
                    Xem chi tiết
                  </button>
                </>
              )}

              {lead.ai.verdict === "unworthy" && (
                <>
                  <button className={styles.actionBtnReject}>
                    <ThumbsDown size={16} />
                    Đồng ý từ chối
                  </button>
                  <button
                    className={styles.actionBtnView}
                    onClick={() =>
                      navigate("/lead-risk/lead-detail-ai-demo")
                    }
                  >
                    <Eye size={16} />
                    Xem lại
                  </button>
                </>
              )}

              {lead.ai.verdict === "review" && (
                <>
                  <button className={styles.actionBtnReview}>
                    <AlertCircle size={16} />
                    Xác minh thêm
                  </button>
                  <button
                    className={styles.actionBtnView}
                    onClick={() =>
                      navigate("/lead-risk/lead-detail-ai-demo")
                    }
                  >
                    <Eye size={16} />
                    Xem chi tiết
                  </button>
                </>
              )}

              <button
                className={styles.actionBtnExpand}
                onClick={() =>
                  setExpandedId(
                    expandedId === lead.id ? null : lead.id,
                  )
                }
              >
                {expandedId === lead.id
                  ? "Thu gọn"
                  : "Xem thêm"}
                <ChevronRight
                  size={16}
                  style={{
                    transform:
                      expandedId === lead.id
                        ? "rotate(90deg)"
                        : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
            </div>

            {/* Expanded Details (Hidden by default) */}
            {expandedId === lead.id && (
              <div className={styles.expandedDetails}>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>
                      <Calendar size={14} />
                      Ngày tiếp nhận
                    </div>
                    <div className={styles.detailValue}>
                      {lead.reportDate}
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>
                      <MapPin size={14} />
                      Địa điểm
                    </div>
                    <div className={styles.detailValue}>
                      {lead.location}
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>
                      <FileText size={14} />
                      Danh mục
                    </div>
                    <div className={styles.detailValue}>
                      {lead.category}
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>
                      <TrendingUp size={14} />
                      Mức độ nghiêm trọng
                    </div>
                    <div className={styles.detailValue}>
                      {lead.ai.severity}
                    </div>
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <div className={styles.detailSectionTitle}>
                    Phân tích chi tiết
                  </div>
                  <div className={styles.detailMetrics}>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>
                        Chất lượng bằng chứng:
                      </span>
                      <span className={styles.metricValue}>
                        {lead.ai.evidenceQuality}
                      </span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>
                        Độ tin cậy AI:
                      </span>
                      <span className={styles.metricValue}>
                        {lead.ai.confidence}%
                      </span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>
                        Trường hợp tương tự:
                      </span>
                      <span className={styles.metricValue}>
                        {lead.ai.similarCases} trường hợp
                      </span>
                    </div>
                  </div>
                </div>

                {lead.ai.violations.length > 0 && (
                  <div className={styles.detailSection}>
                    <div className={styles.detailSectionTitle}>
                      Hành vi vi phạm
                    </div>
                    <ul className={styles.violationList}>
                      {lead.ai.violations.map(
                        (violation, idx) => (
                          <li key={idx}>{violation}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}