import React, { useState } from 'react';
import { 
  LayoutGrid,
  List,
  MapPin,
  Upload,
  Search,
  Home,
  Filter,
  SortAsc,
  Eye,
  Download,
  MoreVertical,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  Calendar,
  User,
  Tag,
  CheckSquare,
  Square,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  FileUp,
  Activity,
  RefreshCw,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DataTable from './DataTable';
import EvidenceMapView from './EvidenceMapView';
import { mockEvidenceData, Evidence, evidenceStatusLabels, fileTypeLabels } from '../data/evidenceData';
import { toast } from 'sonner';
import styles from './EvidenceIntakeLibrary.module.css';

interface EvidenceIntakeLibraryProps {
  onEvidenceSelect?: (evidence: Evidence) => void;
}

export default function EvidenceIntakeLibrary({ onEvidenceSelect }: EvidenceIntakeLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleUpload = () => {
    toast.success('Chức năng upload sẽ được triển khai');
  };

  const filteredEvidences = mockEvidenceData.filter(evidence => {
    const matchesSearch = 
      searchQuery === '' ||
      evidence.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evidence.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || evidence.fileType === selectedType;
    const matchesStatus = selectedStatus === 'all' || evidence.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const typeStats = {
    all: mockEvidenceData.length,
    image: mockEvidenceData.filter(e => e.fileType === 'image').length,
    video: mockEvidenceData.filter(e => e.fileType === 'video').length,
    document: mockEvidenceData.filter(e => e.fileType === 'document').length,
  };

  const statusStats = {
    all: mockEvidenceData.length,
    new: mockEvidenceData.filter(e => e.status === 'new').length,
    pending: mockEvidenceData.filter(e => e.status === 'pending').length,
    approved: mockEvidenceData.filter(e => e.status === 'approved').length,
    flagged: mockEvidenceData.filter(e => e.status === 'flagged').length,
  };

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredEvidences.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEvidences.map(e => e.id)));
    }
  };

  // Upload logs mock data
  const uploadLogs = [
    { id: 1, time: '10:30:15', file: 'evidence_001.jpg', user: 'Nguyễn Văn A', status: 'success', size: '2.3 MB' },
    { id: 2, time: '10:28:42', file: 'document_report.pdf', user: 'Trần Thị B', status: 'success', size: '1.5 MB' },
    { id: 3, time: '10:25:18', file: 'video_inspection.mp4', user: 'Lê Văn C', status: 'processing', size: '45.2 MB' },
    { id: 4, time: '10:20:05', file: 'photo_evidence.png', user: 'Nguyễn Văn A', status: 'failed', size: '3.8 MB' },
    { id: 5, time: '10:15:33', file: 'contract_scan.pdf', user: 'Phạm Thị D', status: 'success', size: '890 KB' },
  ];

  return (
    <div className={styles.container}>
      {/* Sub-tabs Navigation */}
      <Tabs defaultValue="dashboard" className={styles.subTabs}>
        <TabsList className={styles.subTabsList}>
          <TabsTrigger value="dashboard" className={styles.subTabsTrigger}>
            <Home className={styles.subTabIcon} />
            <span>Tổng quan</span>
          </TabsTrigger>
          <TabsTrigger value="library" className={styles.subTabsTrigger}>
            <LayoutGrid className={styles.subTabIcon} />
            <span>Thư viện</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className={styles.subTabsTrigger}>
            <FileUp className={styles.subTabIcon} />
            <span>Nhật ký Tải lên</span>
          </TabsTrigger>
          <TabsTrigger value="search" className={styles.subTabsTrigger}>
            <Search className={styles.subTabIcon} />
            <span>Tìm kiếm Nâng cao</span>
          </TabsTrigger>
          <TabsTrigger value="map" className={styles.subTabsTrigger}>
            <MapPin className={styles.subTabIcon} />
            <span>Xem Bản đồ</span>
          </TabsTrigger>
        </TabsList>

        {/* WEB-05-00: Evidence Home (Dashboard) */}
        <TabsContent value="dashboard" className={styles.subTabContent}>
          <div className={styles.dashboardContainer}>
            {/* KPI Stats */}
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <div className={styles.kpiIcon} style={{ background: '#3b82f6' }}>
                  <FileText />
                </div>
                <div className={styles.kpiContent}>
                  <div className={styles.kpiValue}>{mockEvidenceData.length}</div>
                  <div className={styles.kpiLabel}>Tổng minh chứng</div>
                  <div className={styles.kpiTrend}>
                    <TrendingUp className={styles.trendIcon} />
                    <span>+12% so với tháng trước</span>
                  </div>
                </div>
              </div>

              <div className={styles.kpiCard}>
                <div className={styles.kpiIcon} style={{ background: '#22c55e' }}>
                  <CheckCircle />
                </div>
                <div className={styles.kpiContent}>
                  <div className={styles.kpiValue}>{statusStats.approved}</div>
                  <div className={styles.kpiLabel}>Đã duyệt</div>
                  <div className={styles.kpiTrend}>
                    <TrendingUp className={styles.trendIcon} />
                    <span>+8% tuần này</span>
                  </div>
                </div>
              </div>

              <div className={styles.kpiCard}>
                <div className={styles.kpiIcon} style={{ background: '#f59e0b' }}>
                  <Clock />
                </div>
                <div className={styles.kpiContent}>
                  <div className={styles.kpiValue}>{statusStats.pending}</div>
                  <div className={styles.kpiLabel}>Đang chờ</div>
                  <div className={styles.kpiTrend}>
                    <Activity className={styles.trendIcon} />
                    <span>Cần xử lý</span>
                  </div>
                </div>
              </div>

              <div className={styles.kpiCard}>
                <div className={styles.kpiIcon} style={{ background: '#ef4444' }}>
                  <AlertCircle />
                </div>
                <div className={styles.kpiContent}>
                  <div className={styles.kpiValue}>{statusStats.flagged}</div>
                  <div className={styles.kpiLabel}>Cần chú ý</div>
                  <div className={styles.kpiTrend}>
                    <AlertCircle className={styles.trendIcon} />
                    <span>Cần review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActionsSection}>
              <h3 className={styles.sectionTitle}>Thao tác nhanh</h3>
              <div className={styles.quickActionsGrid}>
                <button className={styles.quickActionCard} onClick={handleUpload}>
                  <Upload className={styles.quickActionIcon} />
                  <span className={styles.quickActionTitle}>Tải lên minh chứng</span>
                  <span className={styles.quickActionDesc}>Upload file mới</span>
                </button>

                <button className={styles.quickActionCard} onClick={() => {}}>
                  <Search className={styles.quickActionIcon} />
                  <span className={styles.quickActionTitle}>Tìm kiếm nâng cao</span>
                  <span className={styles.quickActionDesc}>Tìm theo metadata</span>
                </button>

                <button className={styles.quickActionCard} onClick={() => {}}>
                  <MapPin className={styles.quickActionIcon} />
                  <span className={styles.quickActionTitle}>Xem bản đồ</span>
                  <span className={styles.quickActionDesc}>Theo vị trí địa lý</span>
                </button>

                <button className={styles.quickActionCard} onClick={() => {}}>
                  <Download className={styles.quickActionIcon} />
                  <span className={styles.quickActionTitle}>Xuất báo cáo</span>
                  <span className={styles.quickActionDesc}>Export dữ liệu</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.recentSection}>
              <h3 className={styles.sectionTitle}>Hoạt động gần đây</h3>
              <div className={styles.recentList}>
                {mockEvidenceData.slice(0, 5).map((evidence) => (
                  <div key={evidence.id} className={styles.recentItem}>
                    <div className={styles.recentIcon}>
                      {evidence.fileType === 'image' && <ImageIcon />}
                      {evidence.fileType === 'video' && <Video />}
                      {evidence.fileType === 'document' && <FileText />}
                    </div>
                    <div className={styles.recentContent}>
                      <div className={styles.recentTitle}>{evidence.fileName}</div>
                      <div className={styles.recentMeta}>
                        {evidence.uploadedBy} • {evidence.uploadedDate} {evidence.uploadedTime}
                      </div>
                    </div>
                    <Badge variant={evidence.status === 'approved' ? 'default' : 'secondary'}>
                      {evidenceStatusLabels[evidence.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* WEB-05-01: Evidence Library */}
        <TabsContent value="library" className={styles.subTabContent}>
          <div className={styles.libraryContainer}>
            {/* Professional KPI Cards */}
            <div className={styles.professionalKpiGrid}>
              <div className={styles.professionalKpiCard}>
                <div className={styles.kpiIconWrapper} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                  <FileText className={styles.kpiIconSvg} />
                </div>
                <div className={styles.kpiDetails}>
                  <div className={styles.kpiLabel}>Tổng minh chứng</div>
                  <div className={styles.kpiMetrics}>
                    <span className={styles.kpiNumber}>{mockEvidenceData.length}</span>
                    <span className={styles.kpiUnit}>items</span>
                  </div>
                </div>
              </div>

              <div className={styles.professionalKpiCard}>
                <div className={styles.kpiIconWrapper} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <CheckCircle className={styles.kpiIconSvg} />
                </div>
                <div className={styles.kpiDetails}>
                  <div className={styles.kpiLabel}>Đã duyệt</div>
                  <div className={styles.kpiMetrics}>
                    <span className={styles.kpiNumber}>{statusStats.approved}</span>
                    <span className={styles.kpiUnit}>approved</span>
                  </div>
                </div>
              </div>

              <div className={styles.professionalKpiCard}>
                <div className={styles.kpiIconWrapper} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <Clock className={styles.kpiIconSvg} />
                </div>
                <div className={styles.kpiDetails}>
                  <div className={styles.kpiLabel}>Đang chờ</div>
                  <div className={styles.kpiMetrics}>
                    <span className={styles.kpiNumber}>{statusStats.pending}</span>
                    <span className={styles.kpiUnit}>pending</span>
                  </div>
                </div>
              </div>

              <div className={styles.professionalKpiCard}>
                <div className={styles.kpiIconWrapper} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                  <AlertCircle className={styles.kpiIconSvg} />
                </div>
                <div className={styles.kpiDetails}>
                  <div className={styles.kpiLabel}>Cần chú ý</div>
                  <div className={styles.kpiMetrics}>
                    <span className={styles.kpiNumber}>{statusStats.flagged}</span>
                    <span className={styles.kpiUnit}>flagged</span>
                  </div>
                </div>
              </div>

              <div className={styles.professionalKpiCard}>
                <div className={styles.kpiIconWrapper} style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                  <ImageIcon className={styles.kpiIconSvg} />
                </div>
                <div className={styles.kpiDetails}>
                  <div className={styles.kpiLabel}>Hình ảnh</div>
                  <div className={styles.kpiMetrics}>
                    <span className={styles.kpiNumber}>{typeStats.image}</span>
                    <span className={styles.kpiUnit}>images</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs and Search */}
            <div className={styles.filterSection}>
              <div className={styles.filterTabs}>
                <button
                  className={`${styles.filterTab} ${selectedType === 'all' ? styles.filterTabActive : ''}`}
                  onClick={() => setSelectedType('all')}
                >
                  Tất cả ({typeStats.all})
                </button>
                <button
                  className={`${styles.filterTab} ${selectedType === 'image' ? styles.filterTabActive : ''}`}
                  onClick={() => setSelectedType('image')}
                >
                  <ImageIcon className={styles.filterTabIcon} />
                  Hình ảnh ({typeStats.image})
                </button>
                <button
                  className={`${styles.filterTab} ${selectedType === 'video' ? styles.filterTabActive : ''}`}
                  onClick={() => setSelectedType('video')}
                >
                  <Video className={styles.filterTabIcon} />
                  Video ({typeStats.video})
                </button>
                <button
                  className={`${styles.filterTab} ${selectedType === 'document' ? styles.filterTabActive : ''}`}
                  onClick={() => setSelectedType('document')}
                >
                  <FileText className={styles.filterTabIcon} />
                  Tài liệu ({typeStats.document})
                </button>
              </div>

              <div className={styles.filterSearchBox}>
                <Search className={styles.filterSearchIcon} />
                <Input
                  placeholder="Tìm kiếm theo ID, tên file..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.filterSearchInput}
                />
              </div>
            </div>

            {/* Evidence Table with Full Data */}
            <div className={styles.tableContainer}>
              <div className={styles.tableWrapper}>
                <table className={styles.evidenceTable}>
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th className={styles.tableHeaderCell}>
                        <Checkbox 
                          checked={selectedIds.size === filteredEvidences.length && filteredEvidences.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className={styles.tableHeaderCell}>ID</th>
                      <th className={styles.tableHeaderCell}>Tên file</th>
                      <th className={styles.tableHeaderCell}>Loại</th>
                      <th className={styles.tableHeaderCell}>Kích thước</th>
                      <th className={styles.tableHeaderCell}>Người tải lên</th>
                      <th className={styles.tableHeaderCell}>Ngày tải lên</th>
                      <th className={styles.tableHeaderCell}>Vị trí</th>
                      <th className={styles.tableHeaderCell}>Tags</th>
                      <th className={styles.tableHeaderCell}>Trạng thái</th>
                      <th className={styles.tableHeaderCell}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {filteredEvidences.length === 0 ? (
                      <tr>
                        <td colSpan={11} className={styles.emptyCell}>
                          <div className={styles.emptyState}>
                            <FileText className={styles.emptyIcon} />
                            <p className={styles.emptyText}>Không tìm thấy minh chứng</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredEvidences.map((evidence) => (
                        <tr 
                          key={evidence.id} 
                          className={styles.tableRow}
                          onClick={() => onEvidenceSelect?.(evidence)}
                        >
                          <td className={styles.tableCell} onClick={(e) => e.stopPropagation()}>
                            <Checkbox 
                              checked={selectedIds.has(evidence.id)}
                              onCheckedChange={() => handleToggleSelect(evidence.id)}
                            />
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.evidenceId}>{evidence.id}</span>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.fileNameCell}>
                              {evidence.fileType === 'image' && <ImageIcon className={styles.fileIcon} />}
                              {evidence.fileType === 'video' && <Video className={styles.fileIcon} />}
                              {evidence.fileType === 'document' && <FileText className={styles.fileIcon} />}
                              <span className={styles.fileName}>{evidence.fileName}</span>
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <Badge variant="outline" className={styles.typeBadge}>
                              {evidence.fileType}
                            </Badge>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.fileSize}>{evidence.fileSize}</span>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.uploaderCell}>
                              <User className={styles.userIcon} />
                              <span>{evidence.uploadedBy}</span>
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.dateCell}>
                              <Calendar className={styles.dateIcon} />
                              <span>{evidence.uploadedDate}</span>
                              <span className={styles.timeText}>{evidence.uploadedTime}</span>
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.locationCell}>
                              <MapPin className={styles.locationIcon} />
                              <span>{evidence.location || 'Chưa xác định'}</span>
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.tagsCell}>
                              {evidence.tags && evidence.tags.length > 0 ? (
                                <>
                                  {evidence.tags.slice(0, 2).map((tag, idx) => (
                                    <Badge key={idx} variant="secondary" className={styles.tagBadge}>
                                      {tag}
                                    </Badge>
                                  ))}
                                  {evidence.tags.length > 2 && (
                                    <span className={styles.moreTags}>+{evidence.tags.length - 2}</span>
                                  )}
                                </>
                              ) : (
                                <span className={styles.noTags}>-</span>
                              )}
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <Badge 
                              variant={
                                evidence.status === 'approved' ? 'default' :
                                evidence.status === 'pending' ? 'secondary' :
                                evidence.status === 'flagged' ? 'destructive' : 'outline'
                              }
                              className={styles.statusBadge}
                            >
                              {evidence.status === 'new' && <Clock className={styles.statusIcon} />}
                              {evidence.status === 'pending' && <Clock className={styles.statusIcon} />}
                              {evidence.status === 'approved' && <CheckCircle className={styles.statusIcon} />}
                              {evidence.status === 'flagged' && <AlertCircle className={styles.statusIcon} />}
                              {evidenceStatusLabels[evidence.status]}
                            </Badge>
                          </td>
                          <td className={styles.tableCell} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.actionButtons}>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => onEvidenceSelect?.(evidence)}
                              >
                                <Eye className={styles.actionIcon} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toast.success('Đang tải xuống...')}
                              >
                                <Download className={styles.actionIcon} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className={styles.actionIcon} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer with Pagination */}
              <div className={styles.tableFooter}>
                <div className={styles.footerLeft}>
                  <span className={styles.footerText}>
                    Hiển thị {filteredEvidences.length} / {mockEvidenceData.length} minh chứng
                  </span>
                </div>
                <div className={styles.footerRight}>
                  <Button variant="outline" size="sm" disabled>
                    Trước
                  </Button>
                  <span className={styles.pageIndicator}>Trang 1 / 1</span>
                  <Button variant="outline" size="sm" disabled>
                    Sau
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* WEB-05-05: Evidence Upload / Ingest Log */}
        <TabsContent value="upload" className={styles.subTabContent}>
          <div className={styles.uploadLogContainer}>
            {/* Upload Section */}
            <div className={styles.uploadSection}>
              <div className={styles.uploadCard}>
                <div className={styles.uploadIcon}>
                  <Upload />
                </div>
                <div className={styles.uploadContent}>
                  <h3 className={styles.uploadTitle}>Tải lên minh chứng mới</h3>
                  <p className={styles.uploadDescription}>
                    Hỗ trợ: JPG, PNG, MP4, PDF, DOCX. Tối đa 100MB mỗi file.
                  </p>
                </div>
                <Button onClick={handleUpload} className={styles.uploadButton}>
                  <Upload className={styles.buttonIcon} />
                  Chọn file
                </Button>
              </div>
            </div>

            {/* Upload Log Table */}
            <div className={styles.logSection}>
              <div className={styles.logHeader}>
                <h3 className={styles.sectionTitle}>Lịch sử tải lên</h3>
                <Badge variant="secondary">{uploadLogs.length} uploads hôm nay</Badge>
              </div>

              <div className={styles.logTable}>
                <div className={styles.logTableHeader}>
                  <div className={styles.logCol1}>Thời gian</div>
                  <div className={styles.logCol2}>File</div>
                  <div className={styles.logCol3}>Người tải</div>
                  <div className={styles.logCol4}>Kích thước</div>
                  <div className={styles.logCol5}>Trạng thái</div>
                </div>
                <div className={styles.logTableBody}>
                  {uploadLogs.map((log) => (
                    <div key={log.id} className={styles.logRow}>
                      <div className={styles.logCol1}>
                        <Clock className={styles.logIcon} />
                        {log.time}
                      </div>
                      <div className={styles.logCol2}>
                        <FileText className={styles.logIcon} />
                        {log.file}
                      </div>
                      <div className={styles.logCol3}>
                        <User className={styles.logIcon} />
                        {log.user}
                      </div>
                      <div className={styles.logCol4}>{log.size}</div>
                      <div className={styles.logCol5}>
                        {log.status === 'success' && (
                          <Badge variant="default" className={styles.successBadge}>
                            <CheckCircle className={styles.badgeIcon} />
                            Thành công
                          </Badge>
                        )}
                        {log.status === 'processing' && (
                          <Badge variant="secondary" className={styles.processingBadge}>
                            <Activity className={styles.badgeIcon} />
                            Đang xử lý
                          </Badge>
                        )}
                        {log.status === 'failed' && (
                          <Badge variant="destructive" className={styles.errorBadge}>
                            <AlertCircle className={styles.badgeIcon} />
                            Thất bại
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* WEB-05-03: Evidence Search */}
        <TabsContent value="search" className={styles.subTabContent}>
          <div className={styles.searchContainer}>
            <div className={styles.searchHeader}>
              <h3 className={styles.sectionTitle}>Tìm kiếm nâng cao</h3>
              <p className={styles.sectionDesc}>Tìm kiếm theo metadata và các tiêu chí chi tiết</p>
            </div>

            <div className={styles.searchForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>ID minh chứng</label>
                  <Input placeholder="VD: EV-2026-001" />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tên file</label>
                  <Input placeholder="Nhập tên file..." />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Loại file</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="image">Hình ảnh</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Tài liệu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Trạng thái</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="new">Mới</SelectItem>
                      <SelectItem value="pending">Chờ duyệt</SelectItem>
                      <SelectItem value="approved">Đã duyệt</SelectItem>
                      <SelectItem value="flagged">Cần chú ý</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Người tải lên</label>
                  <Input placeholder="Nhập tên..." />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ngày tải lên</label>
                  <Input type="date" />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tags</label>
                  <Input placeholder="Nhập tag..." />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Vị trí</label>
                  <Input placeholder="Địa điểm..." />
                </div>
              </div>

              <div className={styles.formActions}>
                <Button variant="outline">
                  Xóa bộ lọc
                </Button>
                <Button>
                  <Search className={styles.buttonIcon} />
                  Tìm kiếm
                </Button>
              </div>
            </div>

            {/* Search Results */}
            <div className={styles.searchResults}>
              <div className={styles.resultsHeader}>
                <h4 className={styles.resultsTitle}>Kết quả tìm kiếm</h4>
                <Badge variant="secondary">{filteredEvidences.length} kết quả</Badge>
              </div>
              <DataTable
                data={filteredEvidences}
                onRowClick={(evidence) => onEvidenceSelect?.(evidence)}
              />
            </div>
          </div>
        </TabsContent>

        {/* WEB-05-04: Evidence Map View */}
        <TabsContent value="map" className={styles.subTabContent}>
          <div className={styles.mapContainer}>
            <EvidenceMapView
              evidences={filteredEvidences}
              onEvidenceClick={onEvidenceSelect}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
