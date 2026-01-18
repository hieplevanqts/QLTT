import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Eye,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Activity,
  Shield,
  BarChart3,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  UserPlus,
  AlertOctagon,
  Play,
  Pause,
  FileCheck,
  Flag,
  Search,
  Upload,
  Send,
  CheckSquare,
} from 'lucide-react';
import { mockRiskProfiles, mockLeads } from '../../data/lead-risk/mockLeads';
import { StatusBadge } from '../../app/components/lead-risk/StatusBadge';
import { UrgencyBadge } from '../../app/components/lead-risk/UrgencyBadge';
import { Breadcrumb } from '../../app/components/Breadcrumb';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { RiskProfile } from '../../data/lead-risk/types';
import styles from './RiskDetail.module.css';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-bb2eb709`;

export default function RiskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'leads' | 'history' | 'analysis'>('leads');
  const [profile, setProfile] = useState<RiskProfile | null>(null);
  const [relatedCases, setRelatedCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch risk profile and related cases
  useEffect(() => {
    const fetchRiskDetail = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all profiles to find the one matching this ID
        const profilesResponse = await fetch(`${API_BASE_URL}/risk-profiles`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!profilesResponse.ok) {
          throw new Error(`HTTP error! status: ${profilesResponse.status}`);
        }

        const profilesData = await profilesResponse.json();

        if (!profilesData.success) {
          throw new Error(profilesData.error || 'Failed to fetch risk profiles');
        }

        // Find matching profile
        const matchedProfile = profilesData.data.find((p: any) => p.entityId === id);

        if (!matchedProfile) {
          throw new Error('Risk profile not found');
        }

        // Transform to RiskProfile format
        const transformedProfile: RiskProfile = {
          entityId: matchedProfile.entityId,
          entityType: matchedProfile.entityType,
          entityName: matchedProfile.entityName,
          riskScore: matchedProfile.riskScore,
          riskLevel: matchedProfile.riskLevel,
          totalLeads: matchedProfile.totalLeads || 0,
          activeLeads: matchedProfile.activeLeads || 0,
          resolvedLeads: matchedProfile.resolvedLeads || 0,
          rejectedLeads: matchedProfile.rejectedLeads || 0,
          lastLeadDate: matchedProfile.lastLeadDate ? new Date(matchedProfile.lastLeadDate) : new Date(),
          recentCategories: matchedProfile.recentCategories || [],
          trendDirection: matchedProfile.trendDirection || 'stable',
          monthOverMonthChange: matchedProfile.monthOverMonthChange || 0,
          isWatchlisted: matchedProfile.isWatchlisted || false,
          hasActiveAlert: matchedProfile.hasActiveAlert || false,
        };

        setProfile(transformedProfile);

        // Fetch related cases for this store
        const casesResponse = await fetch(`${API_BASE_URL}/risk-cases`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (casesResponse.ok) {
          const casesData = await casesResponse.json();
          if (casesData.success) {
            // Filter cases for this store and transform to display format
            const filtered = casesData.data
              .filter((c: any) => c.store_name === matchedProfile.entityName)
              .map((c: any) => ({
                id: c.id,
                code: `CASE-${String(c.id).padStart(4, '0')}`,
                title: `${getCategoryLabel(c.category)} - ${c.severity}`,
                description: c.description || `Trường hợp ${c.category} với mức độ ${c.severity}`,
                status: c.status || 'new',
                urgency: c.severity === 'critical' ? 'high' : 
                        c.severity === 'major' ? 'medium' : 'low',
                reportedAt: c.created_at ? new Date(c.created_at) : new Date(),
                source: c.source || 'Hệ thống',
                category: c.category,
                severity: c.severity,
              }));
            setRelatedCases(filtered);
          }
        }

      } catch (err) {
        console.error('❌ Error fetching risk detail:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Fallback to mock data
        const mockProfile = mockRiskProfiles.find(p => p.entityId === id);
        if (mockProfile) {
          setProfile(mockProfile);
          const mockRelated = mockLeads.filter(l => 
            l.storeId === id || l.location.address.includes(mockProfile.entityName)
          );
          setRelatedCases(mockRelated.map(l => ({
            ...l,
            reportedAt: l.reportedAt || new Date(),
          })));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiskDetail();
  }, [id]);

  // Helper function for category labels (moved outside useEffect)
  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      counterfeit: 'Hàng giả',
      smuggling: 'Buôn lậu',
      illegal_trading: 'Kinh doanh bất hợp pháp',
      food_safety: 'An toàn thực phẩm',
      price_fraud: 'Gian lận giá cả',
      unlicensed: 'Không giấy phép',
      product_quality: 'Chất lượng sản phẩm',
      labeling: 'Nhãn mác',
      advertising: 'Quảng cáo',
      other: 'Khác',
    };
    return labels[category] || category;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Breadcrumb
          items={[
            { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
            { label: 'Tổng quan rủi ro', path: '/lead-risk/dashboard' },
            { label: 'Chi tiết rủi ro' },
          ]}
        />
        <div className={styles.loadingState}>
          <Loader2 size={48} className={styles.spinner} />
          <p>Đang tải thông tin rủi ro...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!profile) {
    return (
      <div className={styles.container}>
        <Breadcrumb
          items={[
            { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
            { label: 'Tổng quan rủi ro', path: '/lead-risk/dashboard' },
            { label: 'Chi tiết rủi ro' },
          ]}
        />
        <div className={styles.notFound}>
          <AlertTriangle size={48} />
          <h2>Không tìm thấy thông tin rủi ro</h2>
          <p>Cơ sở với ID "{id}" không tồn tại trong hệ thống</p>
          <button onClick={() => navigate('/lead-risk/dashboard')} className={styles.backButton}>
            <ArrowLeft size={16} />
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getTrendIcon = () => {
    if (profile.trendDirection === 'increasing') return <TrendingUp size={20} />;
    if (profile.trendDirection === 'decreasing') return <TrendingDown size={20} />;
    return <Minus size={20} />;
  };

  const getTrendColor = () => {
    if (profile.trendDirection === 'increasing') return 'var(--destructive)';
    if (profile.trendDirection === 'decreasing') return 'rgba(34, 197, 94, 1)';
    return 'var(--muted-foreground)';
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
          { label: 'Tổng quan rủi ro', path: '/lead-risk/dashboard' },
          { label: profile.entityName },
        ]}
      />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button onClick={() => navigate('/lead-risk/dashboard')} className={styles.backBtn}>
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <div className={styles.headerActions}>
            <button className={styles.actionBtn}>
              <Eye size={16} />
              {profile.isWatchlisted ? 'Đang theo dõi' : 'Theo dõi'}
            </button>
            <button className={styles.actionBtn}>
              <BarChart3 size={16} />
              Báo cáo
            </button>
          </div>
        </div>

        <div className={styles.headerContent}>
          <div className={styles.titleRow}>
            <div className={styles.entityIcon}>
              {profile.entityType === 'store' ? <Building2 size={32} /> : <MapPin size={32} />}
            </div>
            <div>
              <div className={styles.entityType}>
                {profile.entityType === 'store' ? 'Cửa hàng' : 'Khu vực'}
              </div>
              <h1 className={styles.title}>{profile.entityName}</h1>
            </div>
          </div>

          <div className={styles.riskScoreCard}>
            <div className={styles.scoreLabel}>Risk Score</div>
            <div className={styles.scoreValue} data-level={profile.riskLevel}>
              {profile.riskScore}
            </div>
            <div className={styles.scoreLevel} data-level={profile.riskLevel}>
              {profile.riskLevel === 'critical' && 'Nghiêm trọng'}
              {profile.riskLevel === 'high' && 'Cao'}
              {profile.riskLevel === 'medium' && 'Trung bình'}
              {profile.riskLevel === 'low' && 'Thấp'}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className={styles.overviewGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(239, 246, 255, 1)' }}>
            <FileText size={20} style={{ color: 'rgba(37, 99, 235, 1)' }} />
          </div>
          <div className={styles.metricLabel}>Tổng số Leads</div>
          <div className={styles.metricValue}>{profile.totalLeads}</div>
          <div className={styles.metricBreakdown}>
            <span>Đang xử lý: {profile.activeLeads}</span>
            <span>•</span>
            <span>Đã xử lý: {profile.resolvedLeads}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(254, 243, 199, 1)' }}>
            <AlertTriangle size={20} style={{ color: 'rgba(180, 83, 9, 1)' }} />
          </div>
          <div className={styles.metricLabel}>Leads đang xử lý</div>
          <div className={styles.metricValue}>{profile.activeLeads}</div>
          <div className={styles.metricBreakdown}>
            <span>Chờ phân công</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(220, 252, 231, 1)' }}>
            <Shield size={20} style={{ color: 'rgba(34, 197, 94, 1)' }} />
          </div>
          <div className={styles.metricLabel}>Leads đã xử lý</div>
          <div className={styles.metricValue}>{profile.resolvedLeads}</div>
          <div className={styles.metricBreakdown}>
            <span>Từ chối: {profile.rejectedLeads}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div 
            className={styles.metricIcon} 
            style={{ 
              backgroundColor: profile.trendDirection === 'increasing' 
                ? 'rgba(254, 226, 226, 1)' 
                : 'rgba(220, 252, 231, 1)' 
            }}
          >
            {getTrendIcon()}
          </div>
          <div className={styles.metricLabel}>Xu hướng</div>
          <div className={styles.metricValue} style={{ color: getTrendColor() }}>
            {profile.monthOverMonthChange > 0 ? '+' : ''}
            {profile.monthOverMonthChange.toFixed(1)}%
          </div>
          <div className={styles.metricBreakdown}>
            <span>So với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className={styles.content}>
        <div className={styles.sidebar}>
          {/* Info Card */}
          <div className={styles.infoCard}>
            <h3 className={styles.cardTitle}>Thông tin chi tiết</h3>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>
                  <Calendar size={16} />
                  Cập nhật cuối
                </div>
                <div className={styles.infoValue}>
                  {profile.lastLeadDate.toLocaleDateString('vi-VN')}
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>
                  <Activity size={16} />
                  Danh mục vi phạm
                </div>
                <div className={styles.infoValue}>
                  {profile.recentCategories.map(cat => getCategoryLabel(cat)).join(', ')}
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>
                  <Eye size={16} />
                  Trạng thái
                </div>
                <div className={styles.statusBadges}>
                  {profile.isWatchlisted && (
                    <span className={styles.watchBadge}>Theo dõi</span>
                  )}
                  {profile.hasActiveAlert && (
                    <span className={styles.alertBadge}>Cảnh báo</span>
                  )}
                  {!profile.isWatchlisted && !profile.hasActiveAlert && (
                    <span className={styles.normalBadge}>Bình thường</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Risk Breakdown */}
          <div className={styles.infoCard}>
            <h3 className={styles.cardTitle}>Phân tích rủi ro</h3>
            <div className={styles.riskBreakdown}>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Tỷ lệ xử lý thành công</div>
                <div className={styles.breakdownBar}>
                  <div 
                    className={styles.breakdownFill}
                    style={{ 
                      width: `${(profile.resolvedLeads / profile.totalLeads) * 100}%`,
                      backgroundColor: 'rgba(34, 197, 94, 1)'
                    }}
                  />
                </div>
                <div className={styles.breakdownPercent}>
                  {((profile.resolvedLeads / profile.totalLeads) * 100).toFixed(0)}%
                </div>
              </div>

              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Tỷ lệ từ chối</div>
                <div className={styles.breakdownBar}>
                  <div 
                    className={styles.breakdownFill}
                    style={{ 
                      width: `${(profile.rejectedLeads / profile.totalLeads) * 100}%`,
                      backgroundColor: 'var(--destructive)'
                    }}
                  />
                </div>
                <div className={styles.breakdownPercent}>
                  {((profile.rejectedLeads / profile.totalLeads) * 100).toFixed(0)}%
                </div>
              </div>

              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Đang xử lý</div>
                <div className={styles.breakdownBar}>
                  <div 
                    className={styles.breakdownFill}
                    style={{ 
                      width: `${(profile.activeLeads / profile.totalLeads) * 100}%`,
                      backgroundColor: 'rgba(251, 146, 60, 1)'
                    }}
                  />
                </div>
                <div className={styles.breakdownPercent}>
                  {((profile.activeLeads / profile.totalLeads) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.main}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button 
              className={activeTab === 'leads' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('leads')}
            >
              <FileText size={16} />
              Leads liên quan ({relatedCases.length})
            </button>
            <button 
              className={activeTab === 'history' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('history')}
            >
              <Activity size={16} />
              Lịch sử
            </button>
            <button 
              className={activeTab === 'analysis' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('analysis')}
            >
              <BarChart3 size={16} />
              Phân tích
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === 'leads' && (
              <div className={styles.leadsTab}>
                {relatedCases.length > 0 ? (
                  <div className={styles.leadsList}>
                    {relatedCases.map((lead) => (
                      <div 
                        key={lead.id} 
                        className={styles.leadCard}
                        onClick={() => navigate(`/lead-risk/case/${lead.id}`)}
                      >
                        <div className={styles.leadHeader}>
                          <div className={styles.leadCode}>{lead.code}</div>
                          <div className={styles.leadBadges}>
                            <StatusBadge status={lead.status} size="sm" />
                            <UrgencyBadge urgency={lead.urgency} size="sm" />
                          </div>
                        </div>
                        <h4 className={styles.leadTitle}>{lead.title}</h4>
                        <p className={styles.leadDescription}>{lead.description}</p>
                        <div className={styles.leadFooter}>
                          <span className={styles.leadDate}>
                            {lead.reportedAt.toLocaleDateString('vi-VN')}
                          </span>
                          <span className={styles.leadSource}>{lead.source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <FileText size={48} />
                    <p>Chưa có leads liên quan</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className={styles.historyTab}>
                <div className={styles.emptyState}>
                  <Activity size={48} />
                  <p>Lịch sử hoạt động đang được phát triển</p>
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className={styles.analysisTab}>
                <div className={styles.emptyState}>
                  <BarChart3 size={48} />
                  <p>Phân tích chi tiết đang được phát triển</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}