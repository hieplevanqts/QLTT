import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Share2,
  Maximize2,
  Eye,
  FileText,
  Link2,
  MessageSquare,
  Clock,
  User,
  Tag,
  MapPin,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  ShieldCheck,
  GitBranch,
  Fingerprint,
  Map,
  Camera,
  Hash,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Evidence } from '../data/evidenceData';
import { toast } from 'sonner';
import styles from './EvidenceAnalysisViewer.module.css';

interface EvidenceAnalysisViewerProps {
  evidence: Evidence;
}

export default function EvidenceAnalysisViewer({ evidence }: EvidenceAnalysisViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Ref for horizontal scroll
  const tabsListRef = useRef<HTMLDivElement>(null);

  // Handle horizontal scroll with mouse wheel
  useEffect(() => {
    const tabsList = tabsListRef.current;
    if (!tabsList) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent default vertical scroll
      e.preventDefault();
      // Scroll horizontally based on wheel delta
      tabsList.scrollLeft += e.deltaY;
    };

    tabsList.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      tabsList.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleDownload = () => toast.success('Đang tải xuống...');
  const handleShare = () => toast.success('Đã sao chép liên kết chia sẻ');
  const handleFullscreen = () => toast.success('Chế độ toàn màn hình');

  // Mock metadata
  const metadata = {
    technical: {
      fileName: evidence.fileName,
      fileSize: evidence.fileSize,
      fileType: evidence.fileType,
      mimeType: 'image/jpeg',
      dimensions: '1920 x 1080',
      colorSpace: 'sRGB',
      bitDepth: '24-bit'
    },
    exif: {
      camera: 'Canon EOS 5D Mark IV',
      lens: 'EF 24-70mm f/2.8L II USM',
      iso: '400',
      aperture: 'f/5.6',
      shutterSpeed: '1/125s',
      focalLength: '50mm',
      captureDate: '07/01/2026 09:28:15'
    },
    location: {
      gps: evidence.location || 'Không có dữ liệu GPS',
      coordinates: '10.7769° N, 106.7009° E',
      altitude: '5m',
      direction: '315° (NW)'
    },
    integrity: {
      md5Hash: 'a3f5c8d9e1b2c4f6a7e8d9c0b1a2f3e4',
      sha256Hash: 'b4e6d8f0a2c4e6f8a0b2d4e6f8a0c2e4f6a8b0d2e4f6a8c0e2f4a6b8d0e2',
      verified: true,
      timestamp: '07/01/2026 09:30:00'
    }
  };

  // Chain of Custody timeline
  const custodyTimeline = [
    { 
      id: 1,
      date: '07/01/2026',
      time: '09:30',
      event: 'Thu thập chứng cứ',
      user: 'Nguyễn Văn A',
      role: 'Thanh tra viên',
      action: 'collected',
      notes: 'Thu thập tại hiện trường vụ việc'
    },
    {
      id: 2,
      date: '07/01/2026',
      time: '10:15',
      event: 'Niêm phong & tải lên hệ thống',
      user: 'Nguyễn Văn A',
      role: 'Thanh tra viên',
      action: 'sealed',
      notes: 'Đã niêm phong và tải lên kho chứng cứ số'
    },
    {
      id: 3,
      date: '07/01/2026',
      time: '11:00',
      event: 'Xác minh tính toàn vẹn',
      user: 'System',
      role: 'Hệ thống',
      action: 'verified',
      notes: 'Hash verification successful'
    },
    {
      id: 4,
      date: '07/01/2026',
      time: '14:30',
      event: 'Gán cho chuyên viên phân tích',
      user: 'Trần Thị B',
      role: 'Quản lý',
      action: 'assigned',
      notes: 'Chuyển cho chuyên viên Lê Văn C phân tích'
    },
    {
      id: 5,
      date: '08/01/2026',
      time: '09:00',
      event: 'Bắt đầu phân tích',
      user: 'Lê Văn C',
      role: 'Chuyên viên',
      action: 'in_progress',
      notes: 'Đang tiến hành phân tích nội dung'
    }
  ];

  // Linked cases
  const linkedCases = [
    {
      id: 'CASE-2026-045',
      title: 'Vi phạm ATTP tại cơ sở ăn uống Quận 1',
      type: 'case',
      status: 'active',
      assignee: 'Nguyễn Văn A',
      linkedDate: '07/01/2026'
    },
    {
      id: 'LEAD-2026-128',
      title: 'Điều tra nguồn gốc nguyên liệu',
      type: 'lead',
      status: 'investigating',
      assignee: 'Trần Thị B',
      linkedDate: '07/01/2026'
    }
  ];

  // Version history
  const versions = [
    {
      version: 'v1.0',
      date: '07/01/2026',
      time: '09:30',
      user: 'Nguyễn Văn A',
      changes: 'Phiên bản gốc - Tải lên lần đầu',
      size: evidence.fileSize,
      current: true
    }
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'collected': return <Camera size={16} />;
      case 'sealed': return <ShieldCheck size={16} />;
      case 'verified': return <CheckCircle2 size={16} />;
      case 'assigned': return <ArrowRight size={16} />;
      case 'in_progress': return <Settings size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'collected': return '#3b82f6';
      case 'sealed': return '#8b5cf6';
      case 'verified': return '#22c55e';
      case 'assigned': return '#f59e0b';
      case 'in_progress': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Main Viewer */}
        <div className={styles.viewerSection}>
          {/* Viewer Header */}
          <div className={styles.viewerHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.evidenceTitle}>
                <h2 className={styles.evidenceId}>{evidence.id}</h2>
                <Badge variant="outline" className={styles.typeBadge}>
                  {evidence.fileType === 'image' ? 'Hình ảnh' : 
                   evidence.fileType === 'video' ? 'Video' : 'Tài liệu'}
                </Badge>
                <Badge 
                  className={styles.statusBadge}
                  style={{
                    backgroundColor: evidence.status === 'approved' ? '#22c55e20' : 
                                   evidence.status === 'pending' ? '#f59e0b20' :
                                   evidence.status === 'flagged' ? '#ef444420' : '#3b82f620',
                    color: evidence.status === 'approved' ? '#22c55e' :
                          evidence.status === 'pending' ? '#f59e0b' :
                          evidence.status === 'flagged' ? '#ef4444' : '#3b82f6'
                  }}
                >
                  {evidence.status === 'new' ? 'Mới' :
                   evidence.status === 'pending' ? 'Chờ duyệt' :
                   evidence.status === 'approved' ? 'Đã duyệt' : 'Cần chú ý'}
                </Badge>
              </div>
              <p className={styles.fileName}>{evidence.fileName}</p>
            </div>

            <div className={styles.headerActions}>
              <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
                <ZoomOut size={16} />
              </Button>
              <span className={styles.zoomLevel}>{zoom}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
                <ZoomIn size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleRotate}>
                <RotateCw size={16} />
              </Button>
              <div className={styles.divider} />
              <Button variant="outline" size="sm" onClick={handleFullscreen}>
                <Maximize2 size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 size={16} />
              </Button>
            </div>
          </div>

          {/* Viewer Canvas */}
          <div className={styles.viewerCanvas}>
            <div 
              className={styles.imageWrapper}
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
            >
              {evidence.fileType === 'image' ? (
                <img
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200"
                  alt={evidence.fileName}
                  className={styles.viewerImage}
                />
              ) : evidence.fileType === 'video' ? (
                <div className={styles.videoPlayer}>
                  <div className={styles.videoPlaceholder}>
                    <Play size={64} className={styles.playIcon} />
                  </div>
                  <div className={styles.videoControls}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </Button>
                    <div className={styles.progressBar}>
                      <div className={styles.progress} style={{ width: '30%' }} />
                    </div>
                    <span className={styles.timeDisplay}>0:30 / 1:45</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={styles.documentViewer}>
                  <FileText size={64} className={styles.docIcon} />
                  <p className={styles.docText}>PDF Document Viewer</p>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download size={16} />
                    Tải xuống để xem
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className={styles.quickInfoBar}>
            <div className={styles.infoItem}>
              <User size={16} className={styles.infoIcon} />
              <span className={styles.infoLabel}>Người tải:</span>
              <span className={styles.infoValue}>{evidence.uploadedBy}</span>
            </div>
            <div className={styles.infoItem}>
              <Clock size={16} className={styles.infoIcon} />
              <span className={styles.infoLabel}>Thời gian:</span>
              <span className={styles.infoValue}>{evidence.uploadedDate} {evidence.uploadedTime}</span>
            </div>
            <div className={styles.infoItem}>
              <FileText size={16} className={styles.infoIcon} />
              <span className={styles.infoLabel}>Kích thước:</span>
              <span className={styles.infoValue}>{evidence.fileSize}</span>
            </div>
            {evidence.location && (
              <div className={styles.infoItem}>
                <MapPin size={16} className={styles.infoIcon} />
                <span className={styles.infoLabel}>Vị trí:</span>
                <span className={styles.infoValue}>{evidence.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className={styles.sidePanel}>
          {/* Sidebar Header - Standalone Section */}
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarHeaderContent}>
              <div className={styles.sidebarTitle}>
                <Info size={20} />
                <h3>Thông tin chi tiết</h3>
              </div>
              <p className={styles.sidebarSubtitle}>
                Metadata, lịch sử & liên kết
              </p>
            </div>
          </div>

          {/* Tabs Section - Separate from Header */}
          <div className={styles.tabsWrapper}>
            <Tabs defaultValue="metadata" className={styles.sideTabs}>
              <div className={styles.tabsScrollContainer} ref={tabsListRef}>
                <TabsList className={styles.sideTabsList}>
                  <TabsTrigger value="metadata" className={styles.sideTabsTrigger}>
                    <Settings size={16} />
                    <div className={styles.tabLabel}>
                      <span className={styles.tabTitle}>Thông tin kỹ thuật</span>
                      <span className={styles.tabSubtitle}>Thuộc tính & đặc tả</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="custody" className={styles.sideTabsTrigger}>
                    <ShieldCheck size={16} />
                    <div className={styles.tabLabel}>
                      <span className={styles.tabTitle}>Chuỗi bảo quản</span>
                      <span className={styles.tabSubtitle}>Lịch sử niêm phong</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="cases" className={styles.sideTabsTrigger}>
                    <Link2 size={16} />
                    <div className={styles.tabLabel}>
                      <span className={styles.tabTitle}>Liên kết vụ việc</span>
                      <span className={styles.tabSubtitle}>Các vụ việc liên quan</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="versions" className={styles.sideTabsTrigger}>
                    <GitBranch size={16} />
                    <div className={styles.tabLabel}>
                      <span className={styles.tabTitle}>Phiên bản</span>
                      <span className={styles.tabSubtitle}>Lịch sử phiên bản</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Metadata Tab */}
              <TabsContent value="metadata" className={styles.tabContent}>
                <div className={styles.metadataPanel}>
                  {/* Technical Info Card */}
                  <div className={styles.metadataCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardHeaderLeft}>
                        <div className={styles.cardIcon} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                          <Settings size={20} />
                        </div>
                        <div>
                          <h3 className={styles.cardTitle}>Thông tin kỹ thuật</h3>
                          <p className={styles.cardSubtitle}>Thuộc tính tệp & thông số kỹ thuật</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.metadataRow}>
                        <span className={styles.metaLabel}>Tên file</span>
                        <span className={styles.metaValue}>{metadata.technical.fileName}</span>
                      </div>
                      <div className={styles.metadataRow}>
                        <span className={styles.metaLabel}>Kích thước</span>
                        <span className={styles.metaValue}>{metadata.technical.fileSize}</span>
                      </div>
                      <div className={styles.metadataRow}>
                        <span className={styles.metaLabel}>MIME Type</span>
                        <code className={styles.metaCode}>{metadata.technical.mimeType}</code>
                      </div>
                      <div className={styles.metadataRow}>
                        <span className={styles.metaLabel}>Dimensions</span>
                        <span className={styles.metaValue}>{metadata.technical.dimensions}</span>
                      </div>
                      <div className={styles.metadataRow}>
                        <span className={styles.metaLabel}>Color Space</span>
                        <span className={styles.metaValue}>{metadata.technical.colorSpace}</span>
                      </div>
                      <div className={styles.metadataRow}>
                        <span className={styles.metaLabel}>Bit Depth</span>
                        <span className={styles.metaValue}>{metadata.technical.bitDepth}</span>
                      </div>
                    </div>
                  </div>

                  {/* EXIF Data Card */}
                  {evidence.fileType === 'image' && (
                    <div className={styles.metadataCard}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardHeaderLeft}>
                          <div className={styles.cardIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                            <Camera size={20} />
                          </div>
                          <div>
                            <h3 className={styles.cardTitle}>Dữ liệu EXIF Camera</h3>
                            <p className={styles.cardSubtitle}>Cài đặt máy ảnh & thông tin chụp</p>
                          </div>
                        </div>
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.metadataRow}>
                          <span className={styles.metaLabel}>Camera</span>
                          <span className={styles.metaValue}>{metadata.exif.camera}</span>
                        </div>
                        <div className={styles.metadataRow}>
                          <span className={styles.metaLabel}>Lens</span>
                          <span className={styles.metaValue}>{metadata.exif.lens}</span>
                        </div>
                        <div className={styles.metadataGrid}>
                          <div className={styles.metadataGridItem}>
                            <span className={styles.metaLabel}>ISO</span>
                            <span className={styles.metaValueLarge}>{metadata.exif.iso}</span>
                          </div>
                          <div className={styles.metadataGridItem}>
                            <span className={styles.metaLabel}>Aperture</span>
                            <span className={styles.metaValueLarge}>{metadata.exif.aperture}</span>
                          </div>
                          <div className={styles.metadataGridItem}>
                            <span className={styles.metaLabel}>Shutter</span>
                            <span className={styles.metaValueLarge}>{metadata.exif.shutterSpeed}</span>
                          </div>
                          <div className={styles.metadataGridItem}>
                            <span className={styles.metaLabel}>Focal</span>
                            <span className={styles.metaValueLarge}>{metadata.exif.focalLength}</span>
                          </div>
                        </div>
                        <div className={styles.metadataRow}>
                          <span className={styles.metaLabel}>Capture Date & Time</span>
                          <span className={styles.metaValue}>{metadata.exif.captureDate}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GPS Location Card */}
                  <div className={styles.metadataCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardHeaderLeft}>
                        <div className={styles.cardIcon} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                          <Map size={20} />
                        </div>
                        <div>
                          <h3 className={styles.cardTitle}>Vị trí GPS</h3>
                          <p className={styles.cardSubtitle}>Tọa độ địa lý & vị trí</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.success('Mở bản đồ')}
                        className={styles.mapButton}
                      >
                        <ExternalLink size={14} />
                        Xem bản đồ
                      </Button>
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.metadataRow}>
                        <span className={styles.metaLabel}>Địa điểm</span>
                        <span className={styles.metaValue}>{metadata.location.gps}</span>
                      </div>
                      <div className={styles.metadataRow}>
                        <span className={styles.metaLabel}>GPS Coordinates</span>
                        <code className={styles.metaCode}>{metadata.location.coordinates}</code>
                      </div>
                      <div className={styles.metadataGrid}>
                        <div className={styles.metadataGridItem}>
                          <span className={styles.metaLabel}>Altitude</span>
                          <span className={styles.metaValueLarge}>{metadata.location.altitude}</span>
                        </div>
                        <div className={styles.metadataGridItem}>
                          <span className={styles.metaLabel}>Direction</span>
                          <span className={styles.metaValueLarge}>{metadata.location.direction}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hash Integrity Card */}
                  <div className={styles.metadataCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardHeaderLeft}>
                        <div className={styles.cardIcon} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                          <Hash size={20} />
                        </div>
                        <div>
                          <h3 className={styles.cardTitle}>Tính toàn vẹn File</h3>
                          <p className={styles.cardSubtitle}>Xác minh hash mã hóa</p>
                        </div>
                      </div>
                      {metadata.integrity.verified ? (
                        <div className={styles.verifiedBadge}>
                          <CheckCircle2 size={16} />
                          <span>Đã xác minh</span>
                        </div>
                      ) : (
                        <div className={styles.unverifiedBadge}>
                          <AlertTriangle size={16} />
                          <span>Chưa xác minh</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.hashRow}>
                        <div className={styles.hashContent}>
                          <span className={styles.hashLabel}>MD5 Hash</span>
                          <code className={styles.hashCode}>{metadata.integrity.md5Hash}</code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(metadata.integrity.md5Hash);
                            toast.success('Đã copy MD5 hash');
                          }}
                          className={styles.copyButton}
                        >
                          <FileText size={14} />
                        </Button>
                      </div>
                      <div className={styles.hashRow}>
                        <div className={styles.hashContent}>
                          <span className={styles.hashLabel}>SHA-256 Hash</span>
                          <code className={styles.hashCode}>{metadata.integrity.sha256Hash}</code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(metadata.integrity.sha256Hash);
                            toast.success('Đã copy SHA-256 hash');
                          }}
                          className={styles.copyButton}
                        >
                          <FileText size={14} />
                        </Button>
                      </div>
                      <div className={styles.timestampRow}>
                        <Clock size={16} />
                        <span className={styles.timestampLabel}>Thời điểm xác minh:</span>
                        <span className={styles.timestampValue}>{metadata.integrity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Chain of Custody Tab */}
              <TabsContent value="custody" className={styles.tabContent}>
                <div className={styles.custodyPanel}>
                  <div className={styles.custodyHeader}>
                    <h3 className={styles.panelTitle}>Lịch sử niêm phong & xử lý</h3>
                    <Badge variant="outline" className={styles.countBadge}>
                      {custodyTimeline.length} sự kiện
                    </Badge>
                  </div>

                  <div className={styles.custodyTimeline}>
                    {custodyTimeline.map((item, index) => (
                      <div key={item.id} className={styles.timelineItem}>
                        <div className={styles.timelineLine}>
                          <div 
                            className={styles.timelineDot}
                            style={{ backgroundColor: getActionColor(item.action) }}
                          >
                            {getActionIcon(item.action)}
                          </div>
                          {index < custodyTimeline.length - 1 && (
                            <div className={styles.timelineConnector} />
                          )}
                        </div>
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineHeader}>
                            <h4 className={styles.eventTitle}>{item.event}</h4>
                            <span className={styles.eventTime}>
                              {item.date} • {item.time}
                            </span>
                          </div>
                          <div className={styles.eventMeta}>
                            <div className={styles.eventUser}>
                              <User size={14} />
                              <span>{item.user}</span>
                            </div>
                            <Badge variant="outline" className={styles.roleBadge}>
                              {item.role}
                            </Badge>
                          </div>
                          {item.notes && (
                            <p className={styles.eventNotes}>{item.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Link to Cases Tab */}
              <TabsContent value="cases" className={styles.tabContent}>
                <div className={styles.linkPanel}>
                  <div className={styles.linkHeader}>
                    <h3 className={styles.panelTitle}>Gắn vào Vụ việc/Lead/Task</h3>
                    <Button size="sm" onClick={() => toast.success('Chức năng liên kết')}>
                      <Link2 size={16} />
                      Thêm liên kết
                    </Button>
                  </div>

                  <div className={styles.linkedItems}>
                    {linkedCases.map((item) => (
                      <div key={item.id} className={styles.linkedCard}>
                        <div className={styles.cardHeader}>
                          <div className={styles.cardTitle}>
                            <FileCheck size={18} />
                            <div>
                              <h4 className={styles.cardId}>{item.id}</h4>
                              <p className={styles.cardTitleText}>{item.title}</p>
                            </div>
                          </div>
                          <Badge 
                            variant="outline"
                            className={styles.typeBadge}
                          >
                            {item.type === 'case' ? 'Vụ việc' : item.type === 'lead' ? 'Lead' : 'Task'}
                          </Badge>
                        </div>
                        <div className={styles.cardMeta}>
                          <div className={styles.metaItem}>
                            <User size={14} />
                            <span>{item.assignee}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <Clock size={14} />
                            <span>{item.linkedDate}</span>
                          </div>
                          <Badge
                            className={styles.statusBadge}
                            style={{
                              backgroundColor: item.status === 'active' ? '#22c55e20' : '#3b82f620',
                              color: item.status === 'active' ? '#22c55e' : '#3b82f6'
                            }}
                          >
                            {item.status === 'active' ? 'Đang xử lý' : 'Đang điều tra'}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={styles.viewButton}
                          onClick={() => toast.success(`Xem ${item.id}`)}
                        >
                          Xem chi tiết
                          <ExternalLink size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {linkedCases.length === 0 && (
                    <div className={styles.emptyState}>
                      <Link2 size={48} className={styles.emptyIcon} />
                      <h4 className={styles.emptyTitle}>Chưa có liên kết</h4>
                      <p className={styles.emptyText}>
                        Chứng cứ này chưa được gắn vào vụ việc, lead hoặc task nào
                      </p>
                      <Button variant="outline" onClick={() => toast.success('Thêm liên kết')}>
                        <Link2 size={16} />
                        Thêm liên kết đầu tiên
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Versions Tab */}
              <TabsContent value="versions" className={styles.tabContent}>
                <div className={styles.versionsPanel}>
                  <div className={styles.versionsHeader}>
                    <h3 className={styles.panelTitle}>Lịch sử phiên bản</h3>
                    <Badge variant="outline" className={styles.countBadge}>
                      {versions.length} phiên bản
                    </Badge>
                  </div>

                  <div className={styles.versionsList}>
                    {versions.map((version) => (
                      <div 
                        key={version.version}
                        className={`${styles.versionItem} ${version.current ? styles.currentVersion : ''}`}
                      >
                        <div className={styles.versionHeader}>
                          <div className={styles.versionTitle}>
                            <GitBranch size={18} />
                            <h4>{version.version}</h4>
                            {version.current && (
                              <Badge className={styles.currentBadge}>
                                Hiện tại
                              </Badge>
                            )}
                          </div>
                          <span className={styles.versionDate}>
                            {version.date} • {version.time}
                          </span>
                        </div>
                        <div className={styles.versionMeta}>
                          <div className={styles.versionUser}>
                            <User size={14} />
                            <span>{version.user}</span>
                          </div>
                          <span className={styles.versionSize}>{version.size}</span>
                        </div>
                        <p className={styles.versionChanges}>{version.changes}</p>
                        {!version.current && (
                          <div className={styles.versionActions}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.success('Xem phiên bản ' + version.version)}
                            >
                              <Eye size={14} />
                              Xem
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.success('Khôi phục phiên bản ' + version.version)}
                            >
                              <Download size={14} />
                              Khôi phục
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={styles.versionsInfo}>
                    <Info size={16} />
                    <p>Lịch sử phiên bản lưu trữ các thay đổi của chứng cứ (nếu có chỉnh sửa/redaction)</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
