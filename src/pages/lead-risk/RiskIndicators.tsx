import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Save,
  AlertTriangle,
  TrendingUp,
  Target,
  Info,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './RiskIndicators.module.css';

interface RiskTag {
  id: string;
  name: string;
  color: string;
  description: string;
  category: 'violation' | 'risk' | 'location' | 'entity';
  isActive: boolean;
  usageCount: number;
}

interface RiskIndicator {
  id: string;
  name: string;
  description: string;
  type: 'threshold' | 'pattern' | 'anomaly';
  severity: 'critical' | 'high' | 'medium' | 'low';
  threshold?: number;
  unit?: string;
  isActive: boolean;
  triggerCount: number;
}

export default function RiskIndicators() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tags' | 'indicators'>('tags');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<RiskTag | RiskIndicator | null>(null);

  // Mock tags data
  const [tags, setTags] = useState<RiskTag[]>([
    {
      id: 'TAG-001',
      name: 'Hàng giả',
      color: '#ef4444',
      description: 'Sản phẩm giả mạo, nhái',
      category: 'violation',
      isActive: true,
      usageCount: 45,
    },
    {
      id: 'TAG-002',
      name: 'Không hóa đơn',
      color: '#f97316',
      description: 'Bán hàng không cung cấp hóa đơn',
      category: 'violation',
      isActive: true,
      usageCount: 32,
    },
    {
      id: 'TAG-003',
      name: 'Rủi ro cao',
      color: '#dc2626',
      description: 'Cơ sở có mức độ rủi ro cao',
      category: 'risk',
      isActive: true,
      usageCount: 18,
    },
    {
      id: 'TAG-004',
      name: 'Điểm nóng',
      color: '#fb923c',
      description: 'Khu vực tập trung vi phạm',
      category: 'location',
      isActive: true,
      usageCount: 12,
    },
    {
      id: 'TAG-005',
      name: 'Tái phạm',
      color: '#dc2626',
      description: 'Đã vi phạm nhiều lần',
      category: 'entity',
      isActive: true,
      usageCount: 28,
    },
  ]);

  // Mock indicators data
  const [indicators, setIndicators] = useState<RiskIndicator[]>([
    {
      id: 'IND-001',
      name: 'Vi phạm vượt ngưỡng',
      description: 'Cảnh báo khi số vi phạm trong 30 ngày vượt ngưỡng',
      type: 'threshold',
      severity: 'critical',
      threshold: 3,
      unit: 'vi phạm/30 ngày',
      isActive: true,
      triggerCount: 15,
    },
    {
      id: 'IND-002',
      name: 'Tăng đột biến khiếu nại',
      description: 'Phát hiện tăng đột ngột số lượng khiếu nại',
      type: 'anomaly',
      severity: 'high',
      threshold: 300,
      unit: '% so với tuần trước',
      isActive: true,
      triggerCount: 8,
    },
    {
      id: 'IND-003',
      name: 'Điểm rủi ro cao',
      description: 'Cảnh báo khi điểm rủi ro đạt mức cao',
      type: 'threshold',
      severity: 'high',
      threshold: 75,
      unit: 'điểm',
      isActive: true,
      triggerCount: 22,
    },
    {
      id: 'IND-004',
      name: 'Cụm vi phạm',
      description: 'Phát hiện nhiều vi phạm tập trung trong khu vực nhỏ',
      type: 'pattern',
      severity: 'medium',
      threshold: 5,
      unit: 'vi phạm/km²',
      isActive: true,
      triggerCount: 6,
    },
    {
      id: 'IND-005',
      name: 'Tái phạm liên tục',
      description: 'Cơ sở vi phạm lại trong thời gian ngắn',
      type: 'pattern',
      severity: 'critical',
      threshold: 2,
      unit: 'lần/60 ngày',
      isActive: true,
      triggerCount: 11,
    },
  ]);

  const categoryLabels = {
    violation: 'Vi phạm',
    risk: 'Rủi ro',
    location: 'Địa điểm',
    entity: 'Cơ sở',
  };

  const typeLabels = {
    threshold: 'Ngưỡng',
    pattern: 'Mẫu hình',
    anomaly: 'Bất thường',
  };

  const severityLabels = {
    critical: 'Nghiêm trọng',
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp',
  };

  const getSeverityClass = (severity: string) => {
    const classes = {
      critical: styles.severityCritical,
      high: styles.severityHigh,
      medium: styles.severityMedium,
      low: styles.severityLow,
    };
    return classes[severity as keyof typeof classes] || '';
  };

  const handleDeleteTag = (tagId: string) => {
    if (confirm('Bạn có chắc muốn xóa tag này?')) {
      setTags(tags.filter((t) => t.id !== tagId));
      toast.success('Đã xóa tag');
    }
  };

  const handleDeleteIndicator = (indicatorId: string) => {
    if (confirm('Bạn có chắc muốn xóa chỉ báo này?')) {
      setIndicators(indicators.filter((i) => i.id !== indicatorId));
      toast.success('Đã xóa chỉ báo');
    }
  };

  const handleToggleActive = (id: string, type: 'tag' | 'indicator') => {
    if (type === 'tag') {
      setTags(
        tags.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
      );
      toast.success('Đã cập nhật trạng thái tag');
    } else {
      setIndicators(
        indicators.map((i) => (i.id === id ? { ...i, isActive: !i.isActive } : i))
      );
      toast.success('Đã cập nhật trạng thái chỉ báo');
    }
  };

  const filteredTags = tags.filter((tag) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tag.name.toLowerCase().includes(query) ||
        tag.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const filteredIndicators = indicators.filter((indicator) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        indicator.name.toLowerCase().includes(query) ||
        indicator.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    totalTags: tags.length,
    activeTags: tags.filter((t) => t.isActive).length,
    totalIndicators: indicators.length,
    activeIndicators: indicators.filter((i) => i.isActive).length,
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Quản lý Tags & Chỉ báo Rủi ro</h1>
          <p className={styles.subtitle}>
            Cấu hình nhãn và ngưỡng cảnh báo cho hệ thống
          </p>
        </div>

        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Thêm mới
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Tags size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalTags}</div>
            <div className={styles.statLabel}>Tổng Tags</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.activeTags}</div>
            <div className={styles.statLabel}>Tags hoạt động</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Target size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalIndicators}</div>
            <div className={styles.statLabel}>Tổng Chỉ báo</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.activeIndicators}</div>
            <div className={styles.statLabel}>Chỉ báo hoạt động</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'tags' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('tags')}
          >
            <Tags size={16} />
            Tags ({tags.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'indicators' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('indicators')}
          >
            <Target size={16} />
            Chỉ báo ({indicators.length})
          </button>
        </div>

        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className={styles.clearButton}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Tags Tab */}
      {activeTab === 'tags' && (
        <div className={styles.content}>
          <div className={styles.infoBox}>
            <Info size={16} />
            <span>
              Tags được sử dụng để phân loại và gắn nhãn lead, cơ sở, khu vực rủi ro. Cấu hình sâu hơn ở module WEB-06.
            </span>
          </div>

          <div className={styles.grid}>
            {filteredTags.map((tag) => (
              <div key={tag.id} className={styles.tagCard}>
                <div className={styles.tagHeader}>
                  <div className={styles.tagInfo}>
                    <div
                      className={styles.tagColor}
                      style={{ backgroundColor: tag.color }}
                    ></div>
                    <div>
                      <div className={styles.tagName}>{tag.name}</div>
                      <div className={styles.tagCategory}>
                        {categoryLabels[tag.category]}
                      </div>
                    </div>
                  </div>

                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={tag.isActive}
                      onChange={() => handleToggleActive(tag.id, 'tag')}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <p className={styles.tagDescription}>{tag.description}</p>

                <div className={styles.tagFooter}>
                  <div className={styles.tagUsage}>
                    Sử dụng: <strong>{tag.usageCount}</strong> lần
                  </div>

                  <div className={styles.tagActions}>
                    <button
                      className={styles.iconButton}
                      onClick={() => setEditingItem(tag)}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className={styles.iconButtonDanger}
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTags.length === 0 && (
            <div className={styles.emptyState}>
              <Tags size={48} />
              <h3>Không tìm thấy tag</h3>
              <p>Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      )}

      {/* Indicators Tab */}
      {activeTab === 'indicators' && (
        <div className={styles.content}>
          <div className={styles.infoBox}>
            <Info size={16} />
            <span>
              Chỉ báo rủi ro tự động phát hiện và cảnh báo các tình huống bất thường, vượt ngưỡng. Cấu hình chi tiết ở WEB-06.
            </span>
          </div>

          <div className={styles.indicatorsList}>
            {filteredIndicators.map((indicator) => (
              <div key={indicator.id} className={styles.indicatorCard}>
                <div className={styles.indicatorHeader}>
                  <div className={styles.indicatorInfo}>
                    <div className={styles.indicatorName}>{indicator.name}</div>
                    <div className={styles.indicatorMeta}>
                      <span className={styles.indicatorType}>
                        {typeLabels[indicator.type]}
                      </span>
                      <span className={`${styles.severityBadge} ${getSeverityClass(indicator.severity)}`}>
                        {severityLabels[indicator.severity]}
                      </span>
                    </div>
                  </div>

                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={indicator.isActive}
                      onChange={() => handleToggleActive(indicator.id, 'indicator')}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <p className={styles.indicatorDescription}>{indicator.description}</p>

                {indicator.threshold && (
                  <div className={styles.indicatorThreshold}>
                    <AlertTriangle size={14} />
                    <span>
                      Ngưỡng: <strong>{indicator.threshold}</strong> {indicator.unit}
                    </span>
                  </div>
                )}

                <div className={styles.indicatorFooter}>
                  <div className={styles.indicatorTriggers}>
                    Đã kích hoạt: <strong>{indicator.triggerCount}</strong> lần
                  </div>

                  <div className={styles.indicatorActions}>
                    <button
                      className={styles.iconButton}
                      onClick={() => setEditingItem(indicator)}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className={styles.iconButtonDanger}
                      onClick={() => handleDeleteIndicator(indicator.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredIndicators.length === 0 && (
            <div className={styles.emptyState}>
              <Target size={48} />
              <h3>Không tìm thấy chỉ báo</h3>
              <p>Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
