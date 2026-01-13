import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  Link2,
  Copy,
  Merge,
  X,
  Check,
  ExternalLink,
  MapPin,
  Calendar,
  User,
  FileText,
  Eye,
  ChevronRight,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './DuplicateDetector.module.css';

interface Lead {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'triaged' | 'in_progress' | 'resolved';
  priority: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  location: {
    address: string;
    district: string;
  };
  reportedAt: string;
  assignee: string;
  similarity: number; // 0-100
}

interface ComparisonField {
  field: string;
  label: string;
  current: string;
  duplicate: string;
  match: boolean;
}

export default function DuplicateDetector() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [selectedDuplicates, setSelectedDuplicates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'compare'>('list');
  const [compareWith, setCompareWith] = useState<Lead | null>(null);

  // Mock current lead
  const currentLead: Lead = {
    id: id || 'L-2024-1234',
    title: 'Phát hiện cửa hàng kinh doanh hàng giả',
    description: 'Tại địa chỉ 123 Nguyễn Huệ, Quận 1. Cửa hàng bán điện thoại di động nghi vấn là hàng giả, không tem phiếu đầy đủ. Khách hàng phản ánh đã mua sản phẩm và phát hiện dấu hiệu giả mạo.',
    status: 'new',
    priority: 'high',
    source: 'Hotline 1800',
    location: {
      address: '123 Nguyễn Huệ',
      district: 'Quận 1',
    },
    reportedAt: '2025-01-09T08:30:00',
    assignee: 'Chưa phân công',
    similarity: 100,
  };

  // Mock similar leads
  const similarLeads: Lead[] = [
    {
      id: 'L-2024-1201',
      title: 'Khiếu nại về cửa hàng bán điện thoại giả',
      description: 'Cửa hàng tại 123 Nguyễn Huệ bán điện thoại không rõ nguồn gốc, nghi vấn hàng nhái. Nhiều khách hàng phản ánh chất lượng kém.',
      status: 'in_progress',
      priority: 'high',
      source: 'Website',
      location: {
        address: '123 Nguyễn Huệ',
        district: 'Quận 1',
      },
      reportedAt: '2025-01-07T14:20:00',
      assignee: 'Nguyễn Văn A',
      similarity: 95,
    },
    {
      id: 'L-2024-1189',
      title: 'Cửa hàng điện thoại vi phạm',
      description: 'Địa chỉ 125 Nguyễn Huệ, Quận 1. Phát hiện cửa hàng bán điện thoại không tem, không hóa đơn chứng từ.',
      status: 'triaged',
      priority: 'medium',
      source: 'Thanh tra viên',
      location: {
        address: '125 Nguyễn Huệ',
        district: 'Quận 1',
      },
      reportedAt: '2025-01-05T10:15:00',
      assignee: 'Trần Thị B',
      similarity: 88,
    },
    {
      id: 'L-2024-1156',
      title: 'Vi phạm niêm yết giá tại cửa hàng điện thoại',
      description: 'Cửa hàng 123 Nguyễn Huệ không niêm yết giá, báo giá không đúng với giá bán thực tế.',
      status: 'resolved',
      priority: 'low',
      source: 'Mobile App',
      location: {
        address: '123 Nguyễn Huệ',
        district: 'Quận 1',
      },
      reportedAt: '2025-01-01T16:45:00',
      assignee: 'Lê Văn C',
      similarity: 75,
    },
  ];

  const handleMarkDuplicate = (duplicateId: string) => {
    toast.success(`Đã đánh dấu ${duplicateId} là trùng lặp với ${currentLead.id}`);
    // In real app: API call to mark as duplicate
  };

  const handleCrossLink = (duplicateId: string) => {
    toast.success(`Đã liên kết ${currentLead.id} với ${duplicateId}`);
    // In real app: API call to create cross-reference
  };

  const handleMerge = () => {
    if (selectedDuplicates.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 lead để gộp');
      return;
    }
    
    const confirmMsg = `Bạn có chắc muốn gộp ${selectedDuplicates.length} lead vào ${currentLead.id}?`;
    if (confirm(confirmMsg)) {
      toast.success(`Đã gộp thành công ${selectedDuplicates.length} lead`);
      navigate(`/lead-risk/lead/${currentLead.id}`);
    }
  };

  const toggleSelect = (leadId: string) => {
    if (selectedDuplicates.includes(leadId)) {
      setSelectedDuplicates(selectedDuplicates.filter((id) => id !== leadId));
    } else {
      setSelectedDuplicates([...selectedDuplicates, leadId]);
    }
  };

  const getComparisonFields = (lead1: Lead, lead2: Lead): ComparisonField[] => {
    return [
      {
        field: 'title',
        label: 'Tiêu đề',
        current: lead1.title,
        duplicate: lead2.title,
        match: lead1.title.toLowerCase() === lead2.title.toLowerCase(),
      },
      {
        field: 'address',
        label: 'Địa chỉ',
        current: lead1.location.address,
        duplicate: lead2.location.address,
        match: lead1.location.address === lead2.location.address,
      },
      {
        field: 'district',
        label: 'Quận/Huyện',
        current: lead1.location.district,
        duplicate: lead2.location.district,
        match: lead1.location.district === lead2.location.district,
      },
      {
        field: 'source',
        label: 'Nguồn tin',
        current: lead1.source,
        duplicate: lead2.source,
        match: lead1.source === lead2.source,
      },
      {
        field: 'status',
        label: 'Trạng thái',
        current: getStatusLabel(lead1.status),
        duplicate: getStatusLabel(lead2.status),
        match: lead1.status === lead2.status,
      },
      {
        field: 'assignee',
        label: 'Người xử lý',
        current: lead1.assignee,
        duplicate: lead2.assignee,
        match: lead1.assignee === lead2.assignee,
      },
      {
        field: 'description',
        label: 'Mô tả',
        current: lead1.description,
        duplicate: lead2.description,
        match: lead1.description === lead2.description,
      },
    ];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      new: 'Mới',
      triaged: 'Đã phân loại',
      in_progress: 'Đang xử lý',
      resolved: 'Đã xử lý',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityClass = (priority: string) => {
    const classes = {
      critical: styles.priorityCritical,
      high: styles.priorityHigh,
      medium: styles.priorityMedium,
      low: styles.priorityLow,
    };
    return classes[priority as keyof typeof classes] || '';
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return 'rgba(239, 68, 68, 1)'; // Critical
    if (similarity >= 75) return 'rgba(251, 146, 60, 1)'; // High
    if (similarity >= 60) return 'rgba(234, 179, 8, 1)'; // Medium
    return 'rgba(148, 163, 184, 1)'; // Low
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </button>

        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Phát hiện Lead trùng lặp</h1>
          <p className={styles.subtitle}>
            Đã tìm thấy {similarLeads.length} lead tương tự với {currentLead.id}
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.viewButtonActive : ''}`}
            onClick={() => setViewMode('list')}
          >
            Danh sách
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'compare' ? styles.viewButtonActive : ''}`}
            onClick={() => {
              if (selectedDuplicates.length === 0) {
                toast.error('Vui lòng chọn 1 lead để so sánh');
                return;
              }
              const leadToCompare = similarLeads.find((l) => l.id === selectedDuplicates[0]);
              if (leadToCompare) {
                setCompareWith(leadToCompare);
                setViewMode('compare');
              }
            }}
          >
            So sánh
          </button>
        </div>
      </div>

      {/* Alert */}
      <div className={styles.alert}>
        <AlertTriangle size={20} />
        <div className={styles.alertContent}>
          <div className={styles.alertTitle}>Cảnh báo Lead trùng lặp</div>
          <div className={styles.alertText}>
            Hệ thống phát hiện có lead tương tự đã tồn tại. Vui lòng kiểm tra và xử lý để tránh
            trùng lặp công việc.
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* Current Lead Card */}
          <div className={styles.currentLeadSection}>
            <h2 className={styles.sectionTitle}>Lead hiện tại</h2>
            <div className={styles.currentLeadCard}>
              <div className={styles.leadHeader}>
                <div className={styles.leadId}>{currentLead.id}</div>
                <span className={`${styles.priorityBadge} ${getPriorityClass(currentLead.priority)}`}>
                  Ưu tiên: {currentLead.priority.toUpperCase()}
                </span>
              </div>
              <h3 className={styles.leadTitle}>{currentLead.title}</h3>
              <p className={styles.leadDescription}>{currentLead.description}</p>
              <div className={styles.leadMeta}>
                <div className={styles.metaItem}>
                  <MapPin size={14} />
                  <span>
                    {currentLead.location.address}, {currentLead.location.district}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <Calendar size={14} />
                  <span>{new Date(currentLead.reportedAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className={styles.metaItem}>
                  <User size={14} />
                  <span>{currentLead.assignee}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Leads List */}
          <div className={styles.similarLeadsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Lead tương tự ({similarLeads.length})</h2>
              {selectedDuplicates.length > 0 && (
                <div className={styles.bulkActions}>
                  <span className={styles.selectedCount}>
                    Đã chọn {selectedDuplicates.length} lead
                  </span>
                  <button className={styles.mergeButton} onClick={handleMerge}>
                    <Merge size={16} />
                    Gộp lead
                  </button>
                </div>
              )}
            </div>

            <div className={styles.similarLeadsList}>
              {similarLeads.map((lead) => (
                <div
                  key={lead.id}
                  className={`${styles.similarLeadCard} ${
                    selectedDuplicates.includes(lead.id) ? styles.similarLeadCardSelected : ''
                  }`}
                >
                  <div className={styles.selectCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedDuplicates.includes(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                    />
                  </div>

                  <div className={styles.similarityIndicator}>
                    <div
                      className={styles.similarityBar}
                      style={{
                        width: `${lead.similarity}%`,
                        backgroundColor: getSimilarityColor(lead.similarity),
                      }}
                    ></div>
                    <span className={styles.similarityPercent}>{lead.similarity}%</span>
                  </div>

                  <div className={styles.leadContent}>
                    <div className={styles.leadHeader}>
                      <div className={styles.leadId}>{lead.id}</div>
                      <span className={`${styles.statusBadge} ${styles[`status${lead.status}`]}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </div>

                    <h3 className={styles.leadTitle}>{lead.title}</h3>
                    <p className={styles.leadDescription}>{lead.description}</p>

                    <div className={styles.leadMeta}>
                      <div className={styles.metaItem}>
                        <MapPin size={14} />
                        <span>
                          {lead.location.address}, {lead.location.district}
                        </span>
                      </div>
                      <div className={styles.metaItem}>
                        <Calendar size={14} />
                        <span>{new Date(lead.reportedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <User size={14} />
                        <span>{lead.assignee}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => navigate(`/lead-risk/lead/${lead.id}`)}
                    >
                      <Eye size={16} />
                      Xem
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleCrossLink(lead.id)}
                    >
                      <Link2 size={16} />
                      Liên kết
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleMarkDuplicate(lead.id)}
                    >
                      <Copy size={16} />
                      Đánh dấu trùng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Compare View */
        <div className={styles.compareView}>
          {compareWith && (
            <>
              <div className={styles.compareHeader}>
                <h2 className={styles.sectionTitle}>So sánh chi tiết</h2>
                <button
                  className={styles.closeCompareButton}
                  onClick={() => {
                    setViewMode('list');
                    setCompareWith(null);
                  }}
                >
                  <X size={16} />
                  Đóng so sánh
                </button>
              </div>

              <div className={styles.compareGrid}>
                <div className={styles.compareColumn}>
                  <div className={styles.compareColumnHeader}>
                    <h3>Lead hiện tại</h3>
                    <span className={styles.leadIdBadge}>{currentLead.id}</span>
                  </div>
                </div>
                <div className={styles.compareColumn}>
                  <div className={styles.compareColumnHeader}>
                    <h3>Lead tương tự</h3>
                    <span className={styles.leadIdBadge}>{compareWith.id}</span>
                    <span className={styles.similarityBadge}>
                      {compareWith.similarity}% giống
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.comparisonTable}>
                {getComparisonFields(currentLead, compareWith).map((field) => (
                  <div key={field.field} className={styles.comparisonRow}>
                    <div className={styles.comparisonLabel}>
                      <span>{field.label}</span>
                      {field.match && (
                        <Check size={16} className={styles.matchIcon} />
                      )}
                    </div>
                    <div className={styles.comparisonGrid}>
                      <div
                        className={`${styles.comparisonValue} ${
                          field.match ? styles.comparisonValueMatch : ''
                        }`}
                      >
                        {field.current}
                      </div>
                      <div
                        className={`${styles.comparisonValue} ${
                          field.match ? styles.comparisonValueMatch : ''
                        }`}
                      >
                        {field.duplicate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.compareActions}>
                <button
                  className={styles.compareActionButton}
                  onClick={() => navigate(`/lead-risk/lead/${compareWith.id}`)}
                >
                  <ExternalLink size={16} />
                  Xem chi tiết {compareWith.id}
                </button>
                <button
                  className={styles.compareActionButton}
                  onClick={() => handleCrossLink(compareWith.id)}
                >
                  <Link2 size={16} />
                  Liên kết 2 lead
                </button>
                <button
                  className={styles.compareActionButtonPrimary}
                  onClick={() => {
                    setSelectedDuplicates([compareWith.id]);
                    handleMerge();
                  }}
                >
                  <Merge size={16} />
                  Gộp vào {currentLead.id}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
