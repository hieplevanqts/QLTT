import React, { useState } from 'react';
import { 
  Package,
  Download,
  FileArchive,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Square,
  Circle,
  Type,
  MousePointer,
  Eraser,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Save,
  Undo,
  Redo,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Hash,
  Settings,
  Upload,
  Trash2,
  Plus,
  Minus,
  Grid3x3,
  List,
  Shield,
  Key,
  Clock,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import styles from './EvidencePackageExport.module.css';

interface EvidenceItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  status: string;
}

interface PackageConfig {
  name: string;
  description: string;
  format: string;
  encryption: boolean;
  password: string;
  includeMetadata: boolean;
  includeChainOfCustody: boolean;
  watermark: boolean;
}

export default function EvidencePackageExport() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [packageConfig, setPackageConfig] = useState<PackageConfig>({
    name: '',
    description: '',
    format: 'zip',
    encryption: false,
    password: '',
    includeMetadata: true,
    includeChainOfCustody: true,
    watermark: false
  });

  // Redaction tool state
  const [redactionTool, setRedactionTool] = useState<'select' | 'rectangle' | 'circle' | 'text' | 'erase'>('select');
  const [redactionZoom, setRedactionZoom] = useState(100);
  const [redactions, setRedactions] = useState<any[]>([]);

  // Mock evidence data
  const evidenceList: EvidenceItem[] = [
    {
      id: 'EV-2026-100',
      fileName: 'building_violation_01.jpg',
      fileType: 'image',
      fileSize: '2.3 MB',
      uploadedBy: 'Nguyễn Văn A',
      uploadedDate: '2026-01-08',
      status: 'Đã duyệt'
    },
    {
      id: 'EV-2026-101',
      fileName: 'inspection_video_01.mp4',
      fileType: 'video',
      fileSize: '45.6 MB',
      uploadedBy: 'Trần Thị B',
      uploadedDate: '2026-01-08',
      status: 'Đã duyệt'
    },
    {
      id: 'EV-2026-102',
      fileName: 'document_scan_01.pdf',
      fileType: 'document',
      fileSize: '1.8 MB',
      uploadedBy: 'Lê Văn C',
      uploadedDate: '2026-01-07',
      status: 'Đã duyệt'
    },
    {
      id: 'EV-2026-103',
      fileName: 'site_photo_02.jpg',
      fileType: 'image',
      fileSize: '3.1 MB',
      uploadedBy: 'Phạm Thị D',
      uploadedDate: '2026-01-07',
      status: 'Đã duyệt'
    },
    {
      id: 'EV-2026-104',
      fileName: 'witness_statement.pdf',
      fileType: 'document',
      fileSize: '0.9 MB',
      uploadedBy: 'Hoàng Văn E',
      uploadedDate: '2026-01-06',
      status: 'Đã duyệt'
    }
  ];

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === evidenceList.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(evidenceList.map(item => item.id));
    }
  };

  const handleCreatePackage = () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một minh chứng');
      return;
    }
    if (!packageConfig.name) {
      toast.error('Vui lòng nhập tên gói minh chứng');
      return;
    }
    if (packageConfig.encryption && !packageConfig.password) {
      toast.error('Vui lòng nhập mật khẩu mã hóa');
      return;
    }
    toast.success(`Đang tạo gói "${packageConfig.name}" với ${selectedItems.length} minh chứng...`);
  };

  const handleAddRedaction = () => {
    if (redactionTool === 'select') return;
    const newRedaction = {
      id: Date.now(),
      tool: redactionTool,
      x: 100,
      y: 100,
      width: 150,
      height: 100
    };
    setRedactions([...redactions, newRedaction]);
    toast.success('Đã thêm vùng che mờ');
  };

  const handleRemoveRedaction = (id: number) => {
    setRedactions(redactions.filter(r => r.id !== id));
    toast.success('Đã xóa vùng che mờ');
  };

  const handleApplyRedaction = () => {
    if (redactions.length === 0) {
      toast.error('Chưa có vùng che mờ nào');
      return;
    }
    toast.success(`Đã áp dụng ${redactions.length} vùng che mờ`);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className={styles.fileIcon} />;
      case 'video':
        return <Video className={styles.fileIcon} />;
      case 'document':
        return <FileText className={styles.fileIcon} />;
      default:
        return <File className={styles.fileIcon} />;
    }
  };

  const getTotalSize = () => {
    const selected = evidenceList.filter(item => selectedItems.includes(item.id));
    const totalMB = selected.reduce((sum, item) => {
      const size = parseFloat(item.fileSize);
      return sum + size;
    }, 0);
    return totalMB.toFixed(1);
  };

  return (
    <div className={styles.container}>
      <Tabs defaultValue="pack-builder" className={styles.subTabs}>
        {/* Sub Tabs */}
        <TabsList className={styles.subTabsList}>
          <TabsTrigger value="pack-builder" className={styles.subTabsTrigger}>
            <Package className={styles.subTabIcon} />
            Tạo gói minh chứng
          </TabsTrigger>
          <TabsTrigger value="redaction" className={styles.subTabsTrigger}>
            <EyeOff className={styles.subTabIcon} />
            Che mờ & Làm mờ
          </TabsTrigger>
        </TabsList>

        {/* WEB-05-16: Evidence Pack Builder */}
        <TabsContent value="pack-builder" className={styles.subTabContent}>
          <div className={styles.packBuilderContainer}>
            {/* Header */}
            <div className={styles.pageHeader}>
              <div className={styles.headerLeft}>
                <h2 className={styles.pageTitle}>Tạo gói minh chứng</h2>
                <p className={styles.pageDescription}>
                  Chọn minh chứng và tạo gói bàn giao với mã hóa an toàn
                </p>
              </div>
              <div className={styles.headerRight}>
                {selectedItems.length > 0 && (
                  <Badge variant="default" className={styles.selectionBadge}>
                    Đã chọn: {selectedItems.length} / {evidenceList.length}
                  </Badge>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                  <FileArchive />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{selectedItems.length}</div>
                  <div className={styles.statLabel}>Minh chứng đã chọn</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <Download />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{getTotalSize()} MB</div>
                  <div className={styles.statLabel}>Tổng dung lượng</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <Lock />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{packageConfig.encryption ? 'Bật' : 'Tắt'}</div>
                  <div className={styles.statLabel}>Mã hóa</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                  <Package />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{packageConfig.format.toUpperCase()}</div>
                  <div className={styles.statLabel}>Định dạng</div>
                </div>
              </div>
            </div>

            {/* Main Layout */}
            <div className={styles.builderLayout}>
              {/* Left: Evidence Selection */}
              <div className={styles.selectionPanel}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>Danh sách minh chứng</h3>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedItems.length === evidenceList.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </Button>
                </div>

                <div className={styles.evidenceList}>
                  {evidenceList.map(item => (
                    <div 
                      key={item.id} 
                      className={`${styles.evidenceItem} ${selectedItems.includes(item.id) ? styles.evidenceItemSelected : ''}`}
                      onClick={() => handleSelectItem(item.id)}
                    >
                      <Checkbox 
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className={styles.evidenceIconWrapper}>
                        {getFileIcon(item.fileType)}
                      </div>
                      <div className={styles.evidenceContent}>
                        <div className={styles.evidenceId}>{item.id}</div>
                        <div className={styles.evidenceFileName}>{item.fileName}</div>
                        <div className={styles.evidenceMeta}>
                          <span className={styles.metaItem}>
                            <User className={styles.metaIcon} />
                            {item.uploadedBy}
                          </span>
                          <span className={styles.metaItem}>
                            <Calendar className={styles.metaIcon} />
                            {item.uploadedDate}
                          </span>
                        </div>
                      </div>
                      <div className={styles.evidenceSize}>
                        {item.fileSize}
                      </div>
                      <Badge variant="default" className={styles.evidenceStatus}>
                        <CheckCircle className={styles.badgeIcon} />
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Package Configuration */}
              <div className={styles.configPanel}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>Cấu hình gói minh chứng</h3>
                </div>

                <div className={styles.configForm}>
                  {/* Basic Info */}
                  <div className={styles.formSection}>
                    <h4 className={styles.sectionTitle}>Thông tin cơ bản</h4>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Tên gói minh chứng *</label>
                      <Input
                        placeholder="VD: Vụ thanh tra TC-2026-001"
                        value={packageConfig.name}
                        onChange={(e) => setPackageConfig({ ...packageConfig, name: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Mô tả</label>
                      <Textarea
                        placeholder="Nhập mô tả chi tiết về gói minh chứng..."
                        value={packageConfig.description}
                        onChange={(e) => setPackageConfig({ ...packageConfig, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Export Format */}
                  <div className={styles.formSection}>
                    <h4 className={styles.sectionTitle}>Định dạng xuất</h4>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Chọn định dạng</label>
                      <Select
                        value={packageConfig.format}
                        onValueChange={(value) => setPackageConfig({ ...packageConfig, format: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zip">ZIP Archive</SelectItem>
                          <SelectItem value="7z">7-Zip Archive</SelectItem>
                          <SelectItem value="pdf">PDF Portfolio</SelectItem>
                          <SelectItem value="encrypted">Encrypted Package</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Security */}
                  <div className={styles.formSection}>
                    <h4 className={styles.sectionTitle}>Bảo mật</h4>
                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <Checkbox
                          checked={packageConfig.encryption}
                          onCheckedChange={(checked) => setPackageConfig({ ...packageConfig, encryption: checked as boolean })}
                        />
                        <Lock className={styles.checkboxIcon} />
                        <span>Mã hóa gói minh chứng</span>
                      </label>
                    </div>
                    {packageConfig.encryption && (
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Mật khẩu mã hóa *</label>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu..."
                          value={packageConfig.password}
                          onChange={(e) => setPackageConfig({ ...packageConfig, password: e.target.value })}
                        />
                        <p className={styles.formHint}>
                          Yêu cầu tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Include Options */}
                  <div className={styles.formSection}>
                    <h4 className={styles.sectionTitle}>Tùy chọn đính kèm</h4>
                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <Checkbox
                          checked={packageConfig.includeMetadata}
                          onCheckedChange={(checked) => setPackageConfig({ ...packageConfig, includeMetadata: checked as boolean })}
                        />
                        <FileText className={styles.checkboxIcon} />
                        <span>Bao gồm metadata (GPS, thiết bị, hash...)</span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <Checkbox
                          checked={packageConfig.includeChainOfCustody}
                          onCheckedChange={(checked) => setPackageConfig({ ...packageConfig, includeChainOfCustody: checked as boolean })}
                        />
                        <Shield className={styles.checkboxIcon} />
                        <span>Bao gồm Chain of Custody</span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <Checkbox
                          checked={packageConfig.watermark}
                          onCheckedChange={(checked) => setPackageConfig({ ...packageConfig, watermark: checked as boolean })}
                        />
                        <ImageIcon className={styles.checkboxIcon} />
                        <span>Thêm watermark (hình ảnh/video)</span>
                      </label>
                    </div>
                  </div>

                  {/* Preview Summary */}
                  <div className={styles.summarySection}>
                    <h4 className={styles.sectionTitle}>Tóm tắt gói minh chứng</h4>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Số lượng minh chứng:</span>
                        <span className={styles.summaryValue}>{selectedItems.length} file</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Tổng dung lượng:</span>
                        <span className={styles.summaryValue}>{getTotalSize()} MB</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Định dạng:</span>
                        <span className={styles.summaryValue}>{packageConfig.format.toUpperCase()}</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Mã hóa:</span>
                        <span className={styles.summaryValue}>
                          {packageConfig.encryption ? (
                            <Badge variant="default">
                              <Lock className={styles.badgeIcon} />
                              Có
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Unlock className={styles.badgeIcon} />
                              Không
                            </Badge>
                          )}
                        </span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Metadata:</span>
                        <span className={styles.summaryValue}>
                          {packageConfig.includeMetadata ? 'Có' : 'Không'}
                        </span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Chain of Custody:</span>
                        <span className={styles.summaryValue}>
                          {packageConfig.includeChainOfCustody ? 'Có' : 'Không'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.formActions}>
                    <Button variant="outline" onClick={() => {
                      setSelectedItems([]);
                      setPackageConfig({
                        name: '',
                        description: '',
                        format: 'zip',
                        encryption: false,
                        password: '',
                        includeMetadata: true,
                        includeChainOfCustody: true,
                        watermark: false
                      });
                    }}>
                      Đặt lại
                    </Button>
                    <Button onClick={handleCreatePackage}>
                      <Package className={styles.buttonIcon} />
                      Tạo gói minh chứng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* WEB-05-11: Redaction & Masking */}
        <TabsContent value="redaction" className={styles.subTabContent}>
          <div className={styles.redactionContainer}>
            {/* Header */}
            <div className={styles.pageHeader}>
              <div className={styles.headerLeft}>
                <h2 className={styles.pageTitle}>Che mờ thông tin nhạy cảm</h2>
                <p className={styles.pageDescription}>
                  Công cụ che mờ tự động và thủ công trước khi xuất minh chứng
                </p>
              </div>
              <div className={styles.headerRight}>
                <Badge variant="default" className={styles.redactionBadge}>
                  <EyeOff className={styles.badgeIcon} />
                  {redactions.length} vùng che mờ
                </Badge>
              </div>
            </div>

            {/* Main Layout */}
            <div className={styles.redactionLayout}>
              {/* Left: Toolbar */}
              <div className={styles.toolbarPanel}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>Công cụ</h3>
                </div>

                <div className={styles.toolsSection}>
                  <h4 className={styles.toolsTitle}>Chọn công cụ</h4>
                  <div className={styles.toolsGrid}>
                    <button
                      className={`${styles.toolButton} ${redactionTool === 'select' ? styles.toolButtonActive : ''}`}
                      onClick={() => setRedactionTool('select')}
                    >
                      <MousePointer className={styles.toolIcon} />
                      <span>Chọn</span>
                    </button>
                    <button
                      className={`${styles.toolButton} ${redactionTool === 'rectangle' ? styles.toolButtonActive : ''}`}
                      onClick={() => setRedactionTool('rectangle')}
                    >
                      <Square className={styles.toolIcon} />
                      <span>Hình chữ nhật</span>
                    </button>
                    <button
                      className={`${styles.toolButton} ${redactionTool === 'circle' ? styles.toolButtonActive : ''}`}
                      onClick={() => setRedactionTool('circle')}
                    >
                      <Circle className={styles.toolIcon} />
                      <span>Hình tròn</span>
                    </button>
                    <button
                      className={`${styles.toolButton} ${redactionTool === 'text' ? styles.toolButtonActive : ''}`}
                      onClick={() => setRedactionTool('text')}
                    >
                      <Type className={styles.toolIcon} />
                      <span>Văn bản</span>
                    </button>
                    <button
                      className={`${styles.toolButton} ${redactionTool === 'erase' ? styles.toolButtonActive : ''}`}
                      onClick={() => setRedactionTool('erase')}
                    >
                      <Eraser className={styles.toolIcon} />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>

                <div className={styles.toolsSection}>
                  <h4 className={styles.toolsTitle}>Tự động phát hiện</h4>
                  <div className={styles.autoDetectButtons}>
                    <Button variant="outline" size="sm" className={styles.autoButton}>
                      <User className={styles.buttonIcon} />
                      Khuôn mặt
                    </Button>
                    <Button variant="outline" size="sm" className={styles.autoButton}>
                      <Hash className={styles.buttonIcon} />
                      Số CMND/CCCD
                    </Button>
                    <Button variant="outline" size="sm" className={styles.autoButton}>
                      <FileText className={styles.buttonIcon} />
                      Biển số xe
                    </Button>
                    <Button variant="outline" size="sm" className={styles.autoButton}>
                      <Type className={styles.buttonIcon} />
                      Thông tin cá nhân
                    </Button>
                  </div>
                </div>

                <div className={styles.toolsSection}>
                  <h4 className={styles.toolsTitle}>Danh sách che mờ</h4>
                  {redactions.length === 0 ? (
                    <div className={styles.emptyRedactions}>
                      <Info className={styles.emptyIcon} />
                      <p className={styles.emptyText}>Chưa có vùng che mờ nào</p>
                    </div>
                  ) : (
                    <div className={styles.redactionsList}>
                      {redactions.map((redaction, index) => (
                        <div key={redaction.id} className={styles.redactionItem}>
                          <div className={styles.redactionInfo}>
                            <EyeOff className={styles.redactionIcon} />
                            <span>Vùng {index + 1}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveRedaction(redaction.id)}
                          >
                            <Trash2 className={styles.buttonIcon} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.toolsActions}>
                  <Button variant="outline" onClick={() => setRedactions([])}>
                    <Trash2 className={styles.buttonIcon} />
                    Xóa tất cả
                  </Button>
                  <Button onClick={handleApplyRedaction}>
                    <Save className={styles.buttonIcon} />
                    Áp dụng
                  </Button>
                </div>
              </div>

              {/* Center: Canvas */}
              <div className={styles.canvasPanel}>
                <div className={styles.canvasControls}>
                  <div className={styles.controlsLeft}>
                    <Button variant="outline" size="sm" onClick={() => setRedactionZoom(Math.max(25, redactionZoom - 25))}>
                      <ZoomOut className={styles.controlIcon} />
                    </Button>
                    <span className={styles.zoomLabel}>{redactionZoom}%</span>
                    <Button variant="outline" size="sm" onClick={() => setRedactionZoom(Math.min(300, redactionZoom + 25))}>
                      <ZoomIn className={styles.controlIcon} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCw className={styles.controlIcon} />
                    </Button>
                  </div>
                  <div className={styles.controlsRight}>
                    <Button variant="outline" size="sm">
                      <Undo className={styles.controlIcon} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Redo className={styles.controlIcon} />
                    </Button>
                  </div>
                </div>

                <div className={styles.canvasArea}>
                  <div 
                    className={styles.canvasContent}
                    style={{ transform: `scale(${redactionZoom / 100})` }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800"
                      alt="Redaction preview"
                      className={styles.canvasImage}
                    />
                    {/* Mock redaction overlays */}
                    {redactions.map((redaction) => (
                      <div
                        key={redaction.id}
                        className={styles.redactionOverlay}
                        style={{
                          left: redaction.x,
                          top: redaction.y,
                          width: redaction.width,
                          height: redaction.height,
                          borderRadius: redaction.tool === 'circle' ? '50%' : '0'
                        }}
                      />
                    ))}
                  </div>
                  <div className={styles.canvasHint}>
                    <Info className={styles.hintIcon} />
                    Click vào ảnh để thêm vùng che mờ bằng công cụ đã chọn
                  </div>
                </div>
              </div>

              {/* Right: Preview */}
              <div className={styles.previewPanel}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>Xem trước</h3>
                </div>

                <div className={styles.previewContent}>
                  <div className={styles.previewImage}>
                    <img
                      src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400"
                      alt="Preview"
                      className={styles.previewImg}
                    />
                    {redactions.map((redaction) => (
                      <div
                        key={redaction.id}
                        className={styles.previewRedaction}
                        style={{
                          left: `${(redaction.x / 800) * 100}%`,
                          top: `${(redaction.y / 600) * 100}%`,
                          width: `${(redaction.width / 800) * 100}%`,
                          height: `${(redaction.height / 600) * 100}%`,
                          borderRadius: redaction.tool === 'circle' ? '50%' : '0'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.previewInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>File gốc:</span>
                    <span className={styles.infoValue}>building_photo.jpg</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Vùng che mờ:</span>
                    <span className={styles.infoValue}>{redactions.length}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Trạng thái:</span>
                    <span className={styles.infoValue}>
                      {redactions.length > 0 ? (
                        <Badge variant="default">Đã chỉnh sửa</Badge>
                      ) : (
                        <Badge variant="secondary">Gốc</Badge>
                      )}
                    </span>
                  </div>
                </div>

                <div className={styles.previewActions}>
                  <Button variant="outline">
                    <Eye className={styles.buttonIcon} />
                    Xem toàn màn hình
                  </Button>
                  <Button onClick={handleAddRedaction}>
                    <Plus className={styles.buttonIcon} />
                    Thêm vùng che mờ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
