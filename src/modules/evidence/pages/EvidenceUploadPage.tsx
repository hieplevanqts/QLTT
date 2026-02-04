import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  FileText,
  X,
  Plus,
  AlertCircle,
  Check,
  Loader2,
  MapPin,
  Calendar,
  Tag,
  FileCheck,
  Link as LinkIcon,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/layouts/PageHeader';
import styles from './EvidenceUploadPage.module.css';
import { toast } from 'sonner';

// WEB-05-02 — Evidence Upload (Portal) (P0)
// Mục tiêu: upload file + metadata tối thiểu
// UI: drag/drop, multi-files, progress, metadata form (type/source/capturedAt/location/notes), link target (task/lead/store)
// Rule: sau upload phải tạo evidence item và tính hash tại ingestion (backend)

interface UploadFile {
  id: string;
  name: string;
  size: string;
  type: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  hash?: string;
}

export default function EvidenceUploadPage() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // Metadata form
  const [evidenceType, setEvidenceType] = useState('');
  const [source, setSource] = useState('portal');
  const [capturedAt, setCapturedAt] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [linkType, setLinkType] = useState('');
  const [linkTarget, setLinkTarget] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type.split('/')[0] || 'file',
      file: file,
      progress: 0,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      toast.error('Vui lòng chọn ít nhất một file');
      return;
    }
    setUploading(true);
    // Simulate upload process
    const uploadPromises = files.map(file => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (file.progress < 100) {
            setFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: f.progress + 10 } : f));
          } else {
            clearInterval(interval);
            setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'success', hash: 'abc123' } : f));
            resolve(true);
          }
        }, 500);
      });
    });
    Promise.all(uploadPromises).then(() => {
      toast.success(`Đã tải lên ${files.length} chứng cứ`);
      setTimeout(() => {
        navigate('/evidence');
      }, 1000);
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image size={20} />;
      case 'video': return <Video size={20} />;
      case 'application': return <FileText size={20} />;
      default: return <File size={20} />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Kho chứng cứ', href: '/evidence' },
          { label: 'Tải lên chứng cứ' }
        ]}
        title="Tải lên chứng cứ"
        description="Tải lên hình ảnh, video hoặc tài liệu liên quan đến vụ việc"
        actions={
          <Button variant="outline" onClick={() => navigate('/evidence')}>
            Hủy
          </Button>
        }
      />

      <div className={styles.content}>
        {/* Upload Area */}
        <div className={styles.uploadSection}>
          <div
            className={`${styles.dropZone} ${dragActive ? styles.active : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={48} className={styles.uploadIcon} />
            <h3 className={styles.dropZoneTitle}>Kéo thả file vào đây</h3>
            <p className={styles.dropZoneText}>hoặc</p>
            <label className={styles.fileInputLabel}>
              <input
                type="file"
                multiple
                onChange={handleChange}
                className={styles.fileInput}
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
              <Button variant="outline">Chọn file từ máy tính</Button>
            </label>
            <p className={styles.dropZoneHint}>
              Hỗ trợ: JPG, PNG, MP4, PDF, DOC (Tối đa 50MB mỗi file)
            </p>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className={styles.filesList}>
              <div className={styles.filesHeader}>
                <h3 className={styles.filesTitle}>
                  File đã chọn ({files.length})
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setFiles([])}
                >
                  Xóa tất cả
                </Button>
              </div>
              {files.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <div className={styles.fileIcon}>
                    {getFileIcon(file.type)}
                  </div>
                  <div className={styles.fileInfo}>
                    <p className={styles.fileName}>{file.name}</p>
                    <p className={styles.fileSize}>{file.size}</p>
                  </div>
                  <Badge variant="outline" className={styles.fileStatus}>
                    {file.status === 'pending' && <Plus size={12} />}
                    {file.status === 'uploading' && <Loader2 size={12} />}
                    {file.status === 'success' && <Check size={12} />}
                    {file.status === 'error' && <X size={12} />}
                    {file.status === 'pending' && 'Chờ'}
                    {file.status === 'uploading' && 'Đang tải'}
                    {file.status === 'success' && 'Thành công'}
                    {file.status === 'error' && 'Lỗi'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className={styles.removeButton}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metadata Form */}
        <div className={styles.metadataSection}>
          <h2 className={styles.sectionTitle}>Thông tin bổ sung</h2>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Vụ việc liên quan</label>
              <select className={styles.select}>
                <option>Chọn vụ việc...</option>
                <option>CASE-2026-045 - Vi phạm ATTP tại Phường 1</option>
                <option>CASE-2026-044 - Kiểm tra an toàn thực phẩm</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phân loại</label>
              <select className={styles.select} value={evidenceType} onChange={(e) => setEvidenceType(e.target.value)}>
                <option>Chọn phân loại...</option>
                <option>Hình ảnh hiện trường</option>
                <option>Video ghi hình</option>
                <option>Tài liệu văn bản</option>
                <option>Biên bản</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Độ ưu tiên</label>
              <select className={styles.select}>
                <option>Trung bình</option>
                <option>Thấp</option>
                <option>Cao</option>
                <option>Khẩn cấp</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Vị trí GPS (Tùy chọn)</label>
              <input 
                type="text" 
                className={styles.input}
                placeholder="10.7769, 106.7009"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ngày chụp (Tùy chọn)</label>
            <input 
              type="date" 
              className={styles.input}
              value={capturedAt}
              onChange={(e) => setCapturedAt(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ghi chú</label>
            <textarea 
              className={styles.textarea}
              rows={4}
              placeholder="Thêm mô tả, ghi chú về chứng cứ..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className={styles.notice}>
            <AlertCircle size={16} />
            <p>
              Chứng cứ sau khi tải lên sẽ được lưu trữ an toàn và tự động tính toán hash để đảm bảo tính toàn vẹn
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button 
            variant="outline"
            onClick={() => navigate('/evidence')}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={uploading}>
            <Upload size={16} />
            Tải lên {files.length > 0 && `(${files.length})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
