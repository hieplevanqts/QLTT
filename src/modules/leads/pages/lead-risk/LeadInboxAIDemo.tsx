import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Bot,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Activity,
  User,
  MapPin,
  Calendar,
  FileText,
  Zap,
  X,
  Image,
} from "lucide-react";
import { PlayCircleFilled, VideoCameraOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Tooltip, message } from "antd";
import { useNavigate } from "react-router-dom";
import RiskByWardMockChart from "@/components/lead-risk/RiskByWardMockChart";
import EvidenceViewer from "@/components/lead-risk/EvidenceViewer";
import CategoryLeadsWizardModal, { WizardAction } from "@/modules/lead-risk/components/CategoryLeadsWizardModal";
import AiQuickAssistPanel from "@/modules/lead-risk/components/AiQuickAssistPanel";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  leadInboxMock,
  LeadMock,
  EvidenceVideo,
  LeadStatus,
  pickReporterBySeed,
  pickLocationBySeed,
} from "@/modules/lead-risk/mocks/leadInboxMock";
import { EVIDENCE_FALLBACK_IMAGE, pickEvidence } from "@/modules/lead-risk/mocks/evidenceAssets";
import { useAssistant, ThreadContext } from "@/ai/assistantStore";
import styles from "./LeadInboxAIDemo.module.css";

export default function LeadInboxAIDemo() {
  const navigate = useNavigate();
  const [selectedLead, setSelectedLead] = useState<LeadMock | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'category' | 'location'>('overview');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardTag, setWizardTag] = useState<string | null>(null);
  const [wizardSelectedIds, setWizardSelectedIds] = useState<string[]>([]);
  const [wizardPresetAction, setWizardPresetAction] = useState<WizardAction | null>(null);
  const [wizardPresetSelectedIds, setWizardPresetSelectedIds] = useState<string[]>([]);
  const [wizardStartStep, setWizardStartStep] = useState<0 | 1>(0);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [focusLeadId, setFocusLeadId] = useState<string | null>(null);
  const [focusTag, setFocusTag] = useState<string | null>(null);
  const { setDrawerOpen, threads, createThread, setActiveThread, updateThreadContext } = useAssistant();

  // Mock AI Leads Data
  const [aiLeads, setAiLeads] = useState<LeadMock[]>(leadInboxMock);

  // Generators for random data
  const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const generateRandomLead = (): LeadMock => {
    const categories = ['Hàng giả', 'Gian lận giá', 'ATTP', 'Hàng không nguồn gốc', 'Quảng cáo'];
    const titles = [
      'Phát hiện kho hàng lậu lớn',
      'Nghi vấn bán hàng giả trên Facebook',
      'Cửa hàng thực phẩm bẩn',
      'Quảng cáo sai sự thật về thuốc',
      'Tăng giá bất hợp lý dịp Tết'
    ];
    const evidenceVideos: EvidenceVideo[] = [
      { kind: "youtube", url: "https://www.youtube.com/watch?v=x_oBxBxlYJQ" },
      { kind: "youtube", url: "https://www.youtube.com/watch?v=y93S5po5ZqU" },
      { kind: "youtube", url: "https://www.youtube.com/watch?v=-QT0fEdNv1w" },
    ];

    const category = getRandomElement(categories);
    const priority = getRandomElement(['high', 'medium', 'low'] as const);

    let verdict: LeadMock['ai']['verdict'] = 'review';
    let confidence = 50 + Math.floor(Math.random() * 40);

    if (priority === 'high') {
      verdict = 'worthy';
      confidence = 80 + Math.floor(Math.random() * 15);
    } else if (priority === 'low') {
      verdict = 'unworthy';
      confidence = 85 + Math.floor(Math.random() * 10);
    }

    const id = Math.random().toString(36).substr(2, 9);
    const locationInfo = pickLocationBySeed(id);
    const status: LeadStatus = verdict === "worthy"
      ? "dang_xu_ly"
      : verdict === "unworthy"
        ? "khong_dang"
        : "can_xem_xet";
    const hasEvidence = Math.random() > 0.3;
    const minEvidence = status === "can_xem_xet" || status === "dang_xu_ly" ? 2 : 0;
    const numEvidence = hasEvidence ? Math.max(minEvidence, Math.floor(Math.random() * 2) + 1) : 0;
    const images = numEvidence > 0 ? pickEvidence(category, numEvidence, id) : [];
    const hasVideo = Math.random() > 0.8;
    const evidence = hasEvidence || hasVideo
      ? {
          images: images.length > 0 ? images : undefined,
          videos: hasVideo ? [getRandomElement(evidenceVideos)] : undefined,
        }
      : undefined;

    return {
      id,
      code: `LD-2025-${Math.floor(Math.random() * 1000)}`,
      title: getRandomElement(titles),
      ...pickReporterBySeed(id),
      ...locationInfo,
      reportDate: new Date().toLocaleDateString('vi-VN'),
      category,
      categoryLabel: category,
      status,
      timestamp: new Date(),
      priority,
      isRead: false,
      evidence,
      ai: {
        verdict,
        confidence,
        summary: `AI phân tích tự động: ${category} tại ${locationInfo.wardLabel || locationInfo.locationText}.`,
        recommendation: "Cần xác minh thêm thông tin.",
        violations: [`Nghi vấn ${category}`],
        severity: priority === 'high' ? 'Cao' : (priority === 'medium' ? 'Trung bình' : 'Thấp'),
        evidenceQuality: "Trung bình",
        similarCases: Math.floor(Math.random() * 5),
      }
    };
  };

  useEffect(() => {
    if (wizardOpen) return;
    const interval = setInterval(() => {
      const newLead = generateRandomLead();
      setAiLeads(prev => [newLead, ...prev]);
    }, 3000); // Add new lead every 3 seconds

    return () => clearInterval(interval);
  }, [wizardOpen]);

  const getVerdictConfig = (lead: LeadMock) => {
    const status = lead.status;
    if (status === "dang_xu_ly") {
      return {
        icon: CheckCircle,
        text: "Đang xử lý",
        color: "rgba(37, 99, 235, 1)",
        bgColor: "rgba(37, 99, 235, 0.1)",
      };
    }
    if (status === "khong_dang") {
      return {
        icon: XCircle,
        text: "Không đáng",
        color: "rgba(107, 114, 128, 1)",
        bgColor: "rgba(107, 114, 128, 0.1)",
      };
    }
    return {
      icon: AlertTriangle,
      text: "Cần xem xét",
      color: "rgba(245, 158, 11, 1)",
      bgColor: "rgba(245, 158, 11, 0.1)",
    };
  };

  const getPriorityLabel = (priority: LeadMock['priority']) => {
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

  const getYouTubeId = (url: string) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/");
      const embedIdx = parts.findIndex((p) => p === "embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    } catch {
      return null;
    }
    return null;
  };

  const getYouTubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  const getLeadThumb = (lead: LeadMock): { url: string | null; kind: "video" | "image" | null } => {
    const video = lead?.evidence?.videos?.[0];
    if (video) {
      if (video.kind === "youtube") {
        const id = getYouTubeId(video.url);
        return { url: id ? getYouTubeThumb(id) : null, kind: "video" };
      }
      if (video.kind === "file") {
        return { url: video.poster || null, kind: "video" };
      }
    }
    const image = lead?.evidence?.images?.[0];
    if (image?.url) return { url: image.url, kind: "image" };
    return { url: null, kind: null };
  };

  const handleWizardApply = (action: WizardAction, selectedIds: string[], payload: any) => {
    const status: LeadStatus = action === "discard" ? "khong_dang" : "dang_xu_ly";
    const count = selectedIds.length;
    const departmentMap: Record<string, string> = {
      "dept-tt": "Phòng Thanh tra - Kiểm tra",
      "dept-nv": "Phòng Nghiệp vụ - Tổng hợp",
      "dept-at": "Tổ ATTP",
      "dept-cn": "Tổ Chống hàng giả",
    };

    setAiLeads((prev) =>
      prev.map((lead) =>
        selectedIds.includes(lead.id)
          ? {
              ...lead,
              status,
              ai: {
                ...lead.ai,
                verdict: action === "discard" ? "unworthy" : "worthy",
              },
              isRead: true,
            }
          : lead
      )
    );

    if (action === "discard") {
      message.success(`Đã loại bỏ ${count} tin và lưu đánh giá người tố giác`);
    } else {
      const deptName = departmentMap[payload.departmentId] || payload.departmentId;
      const teamName = payload.teamId || "";
      message.success(`Đã chuyển ${count} tin sang ${deptName}${teamName ? ` / ${teamName}` : ""}`);
    }

    setWizardOpen(false);
    setWizardTag(null);
    setWizardPresetAction(null);
    setWizardPresetSelectedIds([]);
    setWizardStartStep(0);
  };

  const getLeadRiskThreadId = useCallback(() => {
    const existing = threads.find(
      (thread) => thread.scope === "lead-risk" && thread.title === "Lead-risk: Inbox AI Demo"
    );
    if (existing?.id) {
      setActiveThread(existing.id);
      return existing.id;
    }
    const id = createThread("lead-risk", "Lead-risk: Inbox AI Demo", {
      page: "/lead-risk/inbox-ai-demo",
    });
    setActiveThread(id);
    return id;
  }, [threads, createThread, setActiveThread]);

  const toLeadMeta = useCallback(
    (lead: LeadMock) => ({
      id: lead.id,
      code: lead.code,
      title: lead.title,
      categoryLabel: lead.categoryLabel || lead.category,
      locationText: lead.locationText,
      wardLabel: lead.wardLabel,
      reliability: lead.ai.confidence,
      status: lead.status,
      hasVideo: (lead.evidence?.videos?.length ?? 0) > 0,
      hasImage: (lead.evidence?.images?.length ?? 0) > 0,
    }),
    []
  );

  const syncLeadRiskContext = useCallback(
    (context: ThreadContext) => {
      const threadId = getLeadRiskThreadId();
      updateThreadContext(threadId, context);
      setActiveThread(threadId);
    },
    [getLeadRiskThreadId, updateThreadContext, setActiveThread]
  );

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      const action = detail.action as WizardAction | undefined;
      const selectedIds: string[] = Array.isArray(detail.selectedIds) ? detail.selectedIds : [];
      let tag = detail.tag as string | undefined;

      if (!tag && selectedIds.length) {
        const lead = aiLeads.find((item) => item.id === selectedIds[0]);
        tag = lead?.categoryLabel || lead?.category;
      }

      if (tag) {
        setWizardTag(tag);
        setFocusTag(tag);
        setFocusLeadId(null);
      } else if (selectedIds.length === 1) {
        setFocusLeadId(selectedIds[0]);
        setFocusTag(null);
      }

      setWizardPresetAction(action ?? null);
      setWizardPresetSelectedIds(selectedIds);
      setWizardStartStep(selectedIds.length && action ? 1 : 0);
      setWizardOpen(true);

      if (selectedIds.length) {
        setWizardSelectedIds(selectedIds);
        const selectedLeads = aiLeads.filter((lead) => selectedIds.includes(lead.id));
        syncLeadRiskContext({
          page: "/lead-risk/inbox-ai-demo",
          focus: tag
            ? { kind: "tag", tag }
            : selectedIds.length === 1
            ? { kind: "lead", leadId: selectedIds[0] }
            : { kind: null },
          selectedTag: tag,
          selectedLeadIds: selectedIds,
          selectedLeads: selectedLeads.slice(0, 30).map(toLeadMeta),
        });
      }
    };

    window.addEventListener("mappa:open-lead-wizard", handler as EventListener);
    return () => window.removeEventListener("mappa:open-lead-wizard", handler as EventListener);
  }, [aiLeads, syncLeadRiskContext, toLeadMeta]);

  const handleWizardSelectionChange = useCallback(
    (ids: string[], leads: LeadMock[]) => {
      setWizardSelectedIds(ids);
      if (wizardTag) {
        setFocusTag(wizardTag);
        setFocusLeadId(null);
        syncLeadRiskContext({
          page: "/lead-risk/inbox-ai-demo",
          focus: { kind: "tag", tag: wizardTag },
          selectedTag: wizardTag,
          selectedLeadIds: ids,
          selectedLeads: leads.slice(0, 30).map(toLeadMeta),
        });
      } else if (ids.length === 1) {
        setFocusLeadId(ids[0]);
        setFocusTag(null);
        const lead = leads[0];
        if (lead) {
          syncLeadRiskContext({
            page: "/lead-risk/inbox-ai-demo",
            focus: { kind: "lead", leadId: lead.id },
            selectedLeadIds: [lead.id],
            selectedTag: lead.categoryLabel || lead.category,
            selectedLeads: [toLeadMeta(lead)],
          });
        }
      } else if (ids.length > 0) {
        setFocusLeadId(null);
        syncLeadRiskContext({
          page: "/lead-risk/inbox-ai-demo",
          focus: { kind: null },
          selectedLeadIds: ids,
          selectedLeads: leads.slice(0, 30).map(toLeadMeta),
        });
      }
    },
    [wizardTag, syncLeadRiskContext, toLeadMeta]
  );

  const handleLeadClick = (lead: LeadMock) => {
    setSelectedLead(lead);
    setFocusLeadId(lead.id);
    setFocusTag(null);
    const meta = toLeadMeta(lead);
    setWizardSelectedIds([lead.id]);
    syncLeadRiskContext({
      page: "/lead-risk/inbox-ai-demo",
      focus: { kind: "lead", leadId: lead.id },
      selectedLeadIds: [lead.id],
      selectedTag: meta.categoryLabel,
      selectedLeads: [meta],
    });
  };

  const selectedLeadsForContext = useMemo(() => {
    if (focusLeadId) {
      const lead = aiLeads.find((item) => item.id === focusLeadId);
      return lead ? [lead] : [];
    }
    if (wizardSelectedIds.length > 0) {
      return aiLeads.filter((lead) => wizardSelectedIds.includes(lead.id)).slice(0, 30);
    }
    if (focusTag) {
      return aiLeads.filter((lead) => (lead.categoryLabel || lead.category) === focusTag).slice(0, 30);
    }
    return [];
  }, [focusLeadId, wizardSelectedIds, focusTag, aiLeads]);

  const pageContext = useMemo(() => {
    const selectedLeadIds = selectedLeadsForContext.map((lead) => lead.id);
    const selectedLeads = selectedLeadsForContext.map(toLeadMeta);
    const focus = focusLeadId
      ? { kind: "lead" as const, leadId: focusLeadId }
      : focusTag
      ? { kind: "tag" as const, tag: focusTag }
      : { kind: null as const };

    return {
      page: "/lead-risk/inbox-ai-demo" as const,
      focus,
      selectedTag: focusTag ?? undefined,
      selectedLeadIds: selectedLeadIds.length ? selectedLeadIds : undefined,
      selectedLeads: selectedLeads.length ? selectedLeads : undefined,
    };
  }, [selectedLeadsForContext, focusLeadId, focusTag, toLeadMeta]);

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

      {/* News Ticker */}
      <div className={styles.tickerContainer}>
        <div className={styles.tickerLabel}>
          <Zap size={16} fill="white" />
          <span>Tin mới nhận ({aiLeads.length})</span>
        </div>
        <div className={styles.tickerTrackWrapper}>
          <div className={styles.tickerTrack}>
            {(() => {
              // Limit to latest 10 leads to prevent infinite speed increase
              const recentLeads = aiLeads.slice(0, 10);
              // Duplicate sufficiently to create seamless loop
              const tickerItems = [...recentLeads, ...recentLeads, ...recentLeads, ...recentLeads];

              return tickerItems.map((lead, index) => (
                <div key={`${lead.id}-${index}`} className={styles.tickerItem} onClick={() => handleLeadClick(lead)} style={{ cursor: 'pointer' }}>
                  <span className={styles.tickerTime}>{formatTimestamp(lead.timestamp)}</span>
                  <span className={styles.tickerIcon}>•</span>
                  <strong>{lead.categoryLabel || lead.category}:</strong>
                  <span>{lead.title}</span>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className={styles.threeColumnLayout}>

        {/* Left Column (3 parts) - List */}
        <div className={styles.leftColumn}>
          <div className={styles.columnHeader}>
            <h2 className={styles.columnTitle}>
              <Activity size={18} className={styles.columnTitleIcon} />
              <span className={styles.columnTitleText}>Nguồn tin</span>
              <span className={styles.liveIndicator}></span>
            </h2>
            <div className={styles.columnHeaderActions}>
              <span className={styles.badge} style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>{aiLeads.filter(l => l.isRead).length} đã xem</span>
              <span className={styles.badge}>{aiLeads.filter(l => !l.isRead).length} mới</span>
            </div>
          </div>

          <div className={styles.leadsList}>
            {aiLeads.map((lead) => {
              const config = getVerdictConfig(lead);
              const IconComponent = config.icon;
              const hasVideo = (lead.evidence?.videos?.length ?? 0) > 0;
              const thumb = getLeadThumb(lead);

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
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div className={styles.leadTimeGroup}>
                        <span className={styles.leadTime}>
                          <Clock size={12} />
                          {formatTimestamp(lead.timestamp)}
                        </span>
                        {hasVideo && (
                          <div className={styles.leadVideoIndicator}>
                            <VideoCameraOutlined />
                            <span>Có video đính kèm</span>
                          </div>
                        )}
                      </div>
                      {thumb.kind && (
                        <div
                          style={{
                            position: "relative",
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            overflow: "hidden",
                            border: "1px solid rgba(0,0,0,0.06)",
                            background: "#f5f5f5",
                            flex: "0 0 auto",
                          }}
                        >
                          {thumb.url ? (
                            <img
                              src={thumb.url}
                              alt=""
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={(event) => {
                                const target = event.currentTarget;
                                if (target.src !== EVIDENCE_FALLBACK_IMAGE) {
                                  target.src = EVIDENCE_FALLBACK_IMAGE;
                                }
                              }}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <VideoCameraOutlined style={{ color: "rgba(0,0,0,0.35)", fontSize: 18 }} />
                            </div>
                          )}
                          {hasVideo && (
                            <PlayCircleFilled
                              style={{
                                position: "absolute",
                                inset: 0,
                                margin: "auto",
                                width: 18,
                                height: 18,
                                fontSize: 18,
                                color: "rgba(255,255,255,0.95)",
                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.45))",
                                pointerEvents: "none",
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.leadCode}>{lead.code}</div>
                  <h3 className={styles.leadTitle}>{lead.title}</h3>

                  <div className={styles.leadMeta}>
                    <span className={styles.leadMetaItem}>
                      <User size={12} />
                      <span>
                        {lead.reporterName}
                        {lead.reporterPhone ? ` • ${lead.reporterPhone}` : ""}
                      </span>
                    </span>
                    <span className={styles.leadMetaItem} style={{ minWidth: 0, flex: 1 }}>
                      <MapPin size={12} />
                      <span className={styles.leadLocationText} title={lead.locationText}>
                        {lead.locationText}
                      </span>
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

        {/* Center Column (6 parts) - Dashboard (ALWAYS SHOW DASHBOARD) */}
        <div className={styles.centerColumn}>
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

                  <RiskByWardMockChart />
                </>
              )}

              {activeTab === 'category' && (
                <div className={styles.detailsSection}>
                  <h3 className={styles.detailsSectionTitle}>Phân bố theo danh mục</h3>
                  <div className={styles.metricsGrid}>
                    {Object.entries(
                      aiLeads.reduce((acc, lead) => {
                        const label = lead.categoryLabel || lead.category;
                        acc[label] = (acc[label] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([category, count]) => (
                      <div
                        key={category}
                        className={styles.metricCard}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setWizardTag(category);
                          setWizardOpen(true);
                          setWizardPresetAction(null);
                          setWizardPresetSelectedIds([]);
                          setWizardStartStep(0);
                          setFocusTag(category);
                          setFocusLeadId(null);

                          const leadsInTag = aiLeads.filter(
                            (lead) => (lead.categoryLabel || lead.category) === category
                          );
                          const selectedIds = leadsInTag.map((lead) => lead.id).slice(0, 100);
                          setWizardSelectedIds(selectedIds);
                          syncLeadRiskContext({
                            page: "/lead-risk/inbox-ai-demo",
                            focus: { kind: "tag", tag: category },
                            selectedTag: category,
                            selectedLeadIds: selectedIds,
                            selectedLeads: leadsInTag.slice(0, 30).map(toLeadMeta),
                          });
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setWizardTag(category);
                            setWizardOpen(true);
                            setWizardPresetAction(null);
                            setWizardPresetSelectedIds([]);
                            setWizardStartStep(0);
                            setFocusTag(category);
                            setFocusLeadId(null);

                            const leadsInTag = aiLeads.filter(
                              (lead) => (lead.categoryLabel || lead.category) === category
                            );
                            const selectedIds = leadsInTag.map((lead) => lead.id).slice(0, 100);
                            setWizardSelectedIds(selectedIds);
                            syncLeadRiskContext({
                              page: "/lead-risk/inbox-ai-demo",
                              focus: { kind: "tag", tag: category },
                              selectedTag: category,
                              selectedLeadIds: selectedIds,
                              selectedLeads: leadsInTag.slice(0, 30).map(toLeadMeta),
                            });
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                      >
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
                        const key = lead.wardLabel || lead.locationText;
                        acc[key] = (acc[key] || 0) + 1;
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
        </div>

        {/* Right Column (3 parts) - Bulk Actions & Summary */}
        <div className={`${styles.rightColumn} ${rightCollapsed ? styles.rightColumnCollapsed : ""}`}>
          <div className={styles.columnHeader}>
            <h2 className={`${styles.columnTitle} ${styles.rightPanelHeaderTitle}`}>
              <TrendingUp size={18} className={styles.columnTitleIcon} />
              <span className={styles.columnTitleText}>Xử lý hàng loạt</span>
            </h2>
            <Tooltip title={rightCollapsed ? "Mở xử lý hàng loạt" : "Thu gọn"}>
              <Button
                type="text"
                shape="circle"
                size="small"
                aria-label={rightCollapsed ? "Mở xử lý hàng loạt" : "Thu gọn"}
                onClick={() => setRightCollapsed((prev) => !prev)}
                className={styles.rightPanelToggle}
                icon={rightCollapsed ? <LeftOutlined /> : <RightOutlined />}
              />
            </Tooltip>
          </div>

          {rightCollapsed && (
            <div className={styles.rightRail}>
              <Tooltip title="Xử lý hàng loạt">
                <button
                  className={styles.rightRailButton}
                  onClick={() => setRightCollapsed(false)}
                  aria-label="Mở xử lý hàng loạt"
                >
                  <Zap size={16} />
                </button>
              </Tooltip>
              <Tooltip title="Mở trợ lý AI">
                <button
                  className={styles.rightRailButton}
                  onClick={() => setDrawerOpen(true)}
                  aria-label="Mở trợ lý AI"
                >
                  <Bot size={16} />
                </button>
              </Tooltip>
            </div>
          )}

          <div className={`p-4 space-y-4 ${styles.rightPanelContent}`}>
            <AiQuickAssistPanel pageContext={pageContext} collapsed={rightCollapsed} />

            {/* Global Auto-Process */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" />
                Tự động xử lý AI
              </h3>
              <p className="text-xs text-blue-700 mb-4">
                Chấp nhận tin đáng xử lý & từ chối tin không đáng (Độ tin cậy &gt; 90%)
              </p>
              <button
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  const worthyCount = aiLeads.filter(l => l.ai.verdict === 'worthy' && l.ai.confidence > 90 && !l.isRead).length;
                  const unworthyCount = aiLeads.filter(l => l.ai.verdict === 'unworthy' && l.ai.confidence > 90 && !l.isRead).length;
                  alert(`Đang tự động xử lý:\n- Chấp nhận ${worthyCount} tin đáng xử lý\n- Từ chối ${unworthyCount} tin không đáng`);
                }}
              >
                <Zap size={16} />
                Xử lý tất cả ({aiLeads.filter(l => (l.ai.verdict === 'worthy' || l.ai.verdict === 'unworthy') && l.ai.confidence > 90 && !l.isRead).length} tin)
              </button>
            </div>

            {/* Category 1: Worthy */}
            {(() => {
              const count = aiLeads.filter(l => l.ai.verdict === 'worthy' && !l.isRead).length;
              return (
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-green-100 text-green-600">
                        <CheckCircle size={16} />
                      </div>
                      <span className="font-semibold text-sm">Đáng xử lý</span>
                    </div>
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold">{count}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Độ tin cậy cao, có bằng chứng xác thực.
                  </p>
                  <button
                    className="w-full py-1.5 border border-green-600 text-green-700 hover:bg-green-50 rounded text-xs font-medium transition-colors"
                    onClick={() => alert(`Đang chấp nhận & phân công ${count} tin...`)}
                    disabled={count === 0}
                  >
                    Chấp nhận tất cả
                  </button>
                </div>
              );
            })()}

            {/* Category 2: Unworthy */}
            {(() => {
              const count = aiLeads.filter(l => l.ai.verdict === 'unworthy' && !l.isRead).length;
              return (
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-gray-100 text-gray-600">
                        <XCircle size={16} />
                      </div>
                      <span className="font-semibold text-sm">Không đáng</span>
                    </div>
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold">{count}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Tin rác, thiếu thông tin hoặc trùng lặp.
                  </p>
                  <button
                    className="w-full py-1.5 border border-gray-400 text-gray-600 hover:bg-gray-50 rounded text-xs font-medium transition-colors"
                    onClick={() => alert(`Đang bác bỏ ${count} tin...`)}
                    disabled={count === 0}
                  >
                    Từ chối tất cả
                  </button>
                </div>
              );
            })()}

            {/* Category 3: Needs Review */}
            {(() => {
              const count = aiLeads.filter(l => l.ai.verdict === 'review' && !l.isRead).length;
              return (
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-orange-100 text-orange-600">
                        <AlertTriangle size={16} />
                      </div>
                      <span className="font-semibold text-sm">Cần xem xét</span>
                    </div>
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold">{count}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Thông tin chưa rõ ràng, cần xác minh thêm.
                  </p>
                  <button
                    className="w-full py-1.5 border border-orange-400 text-orange-600 hover:bg-orange-50 rounded text-xs font-medium transition-colors"
                    onClick={() => alert(`Đang yêu cầu bổ sung thông tin cho ${count} tin...`)}
                    disabled={count === 0}
                  >
                    Yêu cầu bổ sung
                  </button>
                </div>
              );
            })()}

          </div>
        </div>
      </div>

      <CategoryLeadsWizardModal
        open={wizardOpen}
        tag={wizardTag}
        leads={aiLeads}
        presetAction={wizardPresetAction}
        presetSelectedIds={wizardPresetSelectedIds}
        startStep={wizardStartStep}
        onSelectionChange={handleWizardSelectionChange}
        onClose={() => {
          setWizardOpen(false);
          setWizardTag(null);
          setWizardPresetAction(null);
          setWizardPresetSelectedIds([]);
          setWizardStartStep(0);
        }}
        onApply={handleWizardApply}
      />

      {/* LEAD DETAIL POPUP MODAL */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-5xl h-[80vh] overflow-hidden flex flex-col p-0 gap-0">
          {selectedLead && (
            <>
              {/* Modal Header */}
              <div className="p-6 border-b flex items-center justify-between bg-card">
                <div className="flex items-center gap-4">
                  <div className={styles.detailsVerdictLarge} style={{
                    backgroundColor: getVerdictConfig(selectedLead).bgColor,
                    color: getVerdictConfig(selectedLead).color
                  }}>
                    {(() => {
                      const config = getVerdictConfig(selectedLead);
                      const IconComponent = config.icon;
                      return <IconComponent size={20} />;
                    })()}
                    <span>{getVerdictConfig(selectedLead).text}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold m-0">{selectedLead.title}</h2>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="font-mono text-primary font-bold">{selectedLead.code}</span>
                      <span>•</span>
                      <span>{formatTimestamp(selectedLead.timestamp)}</span>
                    </div>
                  </div>
                </div>
                {/* Close button is automatically added by DialogContent usually, but we can add secondary actions if needed */}
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 bg-background">
                <div className="grid grid-cols-3 gap-6 h-full">

                  {/* Left Side: Information & Analysis (2/3) */}
                  <div className="col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className={styles.detailsInfoGrid}>
                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>
                          <User size={14} />
                          Người phản ánh
                        </div>
                        <div className={styles.infoValue}>
                          {selectedLead.reporterName}
                          {selectedLead.reporterPhone ? ` • ${selectedLead.reporterPhone}` : ""}
                        </div>
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
                        <div className={styles.infoValue}>{selectedLead.locationText}</div>
                      </div>
                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>
                          <FileText size={14} />
                          Danh mục
                        </div>
                        <div className={styles.infoValue}>{selectedLead.categoryLabel || selectedLead.category}</div>
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

                    {/* Evidence Section */}
                    <div className={styles.detailsSection}>
                      <h3 className={styles.detailsSectionTitle}>
                        <Image size={18} />
                        Hình ảnh bằng chứng
                      </h3>
                      <EvidenceViewer evidence={selectedLead.evidence} />
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

                  {/* Right Side: Metrics (1/3) */}
                  <div className="col-span-1 border-l pl-6 space-y-8">
                    {/* Metrics */}
                    <div>
                      <div className={styles.actionPanelTitle}>
                        KẾT QUẢ PHÂN TÍCH
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
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
