import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package,
  Plus,
  Search,
  Filter,
  X,
  GripVertical,
  FileText,
  Image,
  Video,
  CheckSquare,
  Save,
  ArrowRight,
  AlertCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/layouts/PageHeader';
import styles from './EvidencePackageBuilderPage.module.css';
import { toast } from 'sonner';

// WEB-05-13 — Package Builder (P0)
// Mục tiêu: tạo "gói minh chứng" cho một lead/task/plan/đợt
// UI: chọn phạm vi, add items, reorder, include metadata, include chain-of-custody excerpt, generate package
// AC: chỉ add evidence đã Approved (hoặc theo policy)

interface Evidence {
  id: string;
  fileName: string;
  type: 'image' | 'video' | 'document';
  status: 'approved' | 'sealed';
  capturedAt: string;
  location: string;
}

export default function EvidencePackageBuilderPage() {
  const navigate = useNavigate();
  const [packageName, setPackageName] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const [linkedEntity, setLinkedEntity] = useState('');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeCustody, setIncludeCustody] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock approved evidence
  const availableEvidence: Evidence[] = [
    {
      id: 'EVD-2026-1250',
      fileName: 'anh_vi_pham_ve_sinh.jpg',
      type: 'image',
      status: 'approved',
      capturedAt: '10/01/2026 09:00',
      location: 'Phường 1, Hà Nội'
    },
    {
      id: 'EVD-2026-1249',
      fileName: 'video_thanh_tra.mp4',
      type: 'video',
      status: 'approved',
      capturedAt: '10/01/2026 08:00',
      location: 'Phường 3, Hà Nội'
    },
    {
      id: 'EVD-2026-1248',
      fileName: 'bien_ban_kiem_tra.pdf',
      type: 'document',
      status: 'sealed',
      capturedAt: '09/01/2026 15:00',
      location: 'Phường 5, Hà Nội'
    },
    {
      id: 'EVD-2026-1245',
      fileName: 'giay_phep_attp.pdf',
      type: 'document',
      status: 'approved',
      capturedAt: '08/01/2026 11:00',
      location: 'Phường 7, Hà Nội'
    }
  ];

  const handleAddItem = (id: string) => {
    if (!selectedItems.includes(id)) {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item !== id));
  };

  const handleGeneratePackage = () => {
    if (!packageName.trim()) {
      toast.error('Vui lòng nhập tên gói chứng cứ');
      return;
    }
    if (!linkedEntity) {
      toast.error('Vui lòng chọn vụ việc liên kết');
      return;
    }
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một chứng cứ');
      return;
    }

    toast.success(`Đã tạo gói chứng cứ "${packageName}" với ${selectedItems.length} mục`);
    setTimeout(() => {
      navigate('/evidence/packages');
    }, 1500);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image size={16} />;
      case 'video': return <Video size={16} />;
      case 'document': return <FileText size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const selectedEvidenceList = availableEvidence.filter(e => selectedItems.includes(e.id));

  return (
    <div className={styles.container}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Kho chứng cứ', href: '/evidence' },
          { label: 'Gói chứng cứ', href: '/evidence/packages' },
          { label: 'Tạo mới' }
        ]}
        title="Tạo gói chứng cứ mới"
      />

      <div className={styles.content}>
        <div className={styles.layout}>
          {/* Left: Package Config */}
          <div className={styles.configSection}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Thông tin gói</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tên gói chứng cứ <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="VD: Gói chứng cứ vi phạm ATTP - CASE-2026-048"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Mô tả</label>
                <textarea
                  value={packageDescription}
                  onChange={(e) => setPackageDescription(e.target.value)}
                  placeholder="Mô tả chi tiết về gói chứng cứ này..."
                  rows={3}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Liên kết vụ việc <span className={styles.required}>*</span>
                </label>
                <select
                  value={linkedEntity}
                  onChange={(e) => setLinkedEntity(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Chọn vụ việc...</option>
                  <option value="CASE-2026-048">CASE-2026-048 - Vi phạm ATTP tại Phường 1</option>
                  <option value="CASE-2026-042">CASE-2026-042 - Kiểm tra an toàn thực phẩm</option>
                  <option value="TASK-2026-091">TASK-2026-091 - Thanh tra cơ sở kinh doanh</option>
                </select>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Tùy chọn xuất</h3>
              
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                />
                <span>Bao gồm Metadata chi tiết</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={includeCustody}
                  onChange={(e) => setIncludeCustody(e.target.checked)}
                />
                <span>Bao gồm Chain of Custody Log</span>
              </label>
            </div>

            <div className={styles.infoBox}>
              <AlertCircle size={16} />
              <p>Chỉ có thể thêm chứng cứ đã được phê duyệt hoặc niêm phong vào gói.</p>
            </div>
          </div>

          {/* Right: Evidence Selection */}
          <div className={styles.selectionSection}>
            {/* Available Evidence */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Chứng cứ khả dụng</h3>
                <Badge variant="secondary">{availableEvidence.length} mục</Badge>
              </div>

              <div className={styles.searchBar}>
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.evidenceList}>
                {availableEvidence.map((evidence) => (
                  <div key={evidence.id} className={styles.evidenceCard}>
                    <div className={styles.evidenceInfo}>
                      <div className={styles.evidenceIcon}>
                        {getFileIcon(evidence.type)}
                      </div>
                      <div className={styles.evidenceDetails}>
                        <span className={styles.evidenceId}>{evidence.id}</span>
                        <span className={styles.evidenceName}>{evidence.fileName}</span>
                        <span className={styles.evidenceMeta}>{evidence.location}</span>
                      </div>
                    </div>
                    <Button
                      variant={selectedItems.includes(evidence.id) ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => handleAddItem(evidence.id)}
                      disabled={selectedItems.includes(evidence.id)}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Evidence */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Đã chọn</h3>
                <Badge variant="secondary" style={{ background: '#005cb615', color: '#005cb6' }}>
                  {selectedItems.length} mục
                </Badge>
              </div>

              {selectedEvidenceList.length === 0 ? (
                <div className={styles.emptyState}>
                  <Package size={48} />
                  <p>Chưa có chứng cứ nào được chọn</p>
                </div>
              ) : (
                <div className={styles.selectedList}>
                  {selectedEvidenceList.map((evidence, index) => (
                    <div key={evidence.id} className={styles.selectedCard}>
                      <div className={styles.dragHandle}>
                        <GripVertical size={16} />
                      </div>
                      <div className={styles.selectedOrder}>{index + 1}</div>
                      <div className={styles.selectedInfo}>
                        <div className={styles.selectedIcon}>
                          {getFileIcon(evidence.type)}
                        </div>
                        <div className={styles.selectedDetails}>
                          <span className={styles.selectedId}>{evidence.id}</span>
                          <span className={styles.selectedName}>{evidence.fileName}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(evidence.id)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button variant="outline" onClick={() => navigate('/evidence/packages')}>
            Hủy
          </Button>
          <Button onClick={handleGeneratePackage}>
            <Package size={16} />
            Tạo gói chứng cứ
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
