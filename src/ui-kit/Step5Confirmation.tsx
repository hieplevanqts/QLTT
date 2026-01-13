import React, { useState } from 'react';
import {
  Link2,
  FileText,
  Tag,
  CheckCircle2,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Target,
  Map,
  Cpu,
  User as UserIcon,
  XCircle,
} from 'lucide-react';
import { Label } from '../app/components/ui/label';
import { Input } from '../app/components/ui/input';
import { Textarea } from '../app/components/ui/textarea';
import { Badge } from '../app/components/ui/badge';
import styles from './AddStoreDialog.module.css';

interface Step5Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  wards: any[];
  districts: any[];
  provinces: any[];
}

export function Step5Confirmation({ formData, setFormData, wards, districts, provinces }: Step5Props) {
  const [tagInput, setTagInput] = useState<string>('');

  // Get full names for address
  const provinceName = provinces.find((p: any) => p.code === formData.province)?.name || '';
  const wardName = wards.find((w: any) => w.code === formData.ward)?.name || '';
  const fullAddress = [formData.address, wardName, provinceName]
    .filter(Boolean)
    .join(', ');

  const handleAddTag = () => {
    const currentTags = formData.tags || [];
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      const newTags = [...currentTags, tagInput.trim()];
      console.log('➕ Adding tag:', tagInput.trim());
      console.log('🏷️ Updated tags array:', newTags);
      setFormData((prev: any) => ({
        ...prev,
        tags: newTags,
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = (formData.tags || []).filter((tag: string) => tag !== tagToRemove);
    console.log('➖ Removing tag:', tagToRemove);
    console.log('🏷️ Updated tags array:', updatedTags);
    setFormData((prev: any) => ({
      ...prev,
      tags: updatedTags,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className={styles.stepContent}>
      {/* Summary Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Tóm tắt thông tin</h3>
        <p className={styles.sectionDescription}>
          Xem lại thông tin cơ sở trước khi hoàn tất. Bạn có thể quay lại các bước trước để chỉnh sửa.
        </p>

        <div className={styles.summaryGrid}>
          {/* Step 1: Loại hình */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>
              <Building2 size={18} />
              <span>Loại hình cơ sở</span>
            </div>
            <div className={styles.summaryCardContent}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Loại hình:</span>
                <span className={styles.summaryValue}>
                  {formData.facilityType || 'Chưa chọn'}
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Thông tin định danh */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>
              <FileText size={18} />
              <span>Thông tin định danh</span>
            </div>
            <div className={styles.summaryCardContent}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Tên cơ sở:</span>
                <span className={styles.summaryValue}>{formData.name}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Mã số thuế:</span>
                <span className={styles.summaryValue}>{formData.taxCode}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Ngành hàng:</span>
                <span className={styles.summaryValue}>{formData.industryName}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>SĐT kinh doanh:</span>
                <span className={styles.summaryValue}>
                  <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {formData.businessPhone}
                </span>
              </div>
              {formData.email && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Email:</span>
                  <span className={styles.summaryValue}>
                    <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    {formData.email}
                  </span>
                </div>
              )}
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Diện tích:</span>
                <span className={styles.summaryValue}>{formData.businessArea} m²</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Ngày thành lập:</span>
                <span className={styles.summaryValue}>
                  <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {formData.establishedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Địa chỉ */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>
              <MapPin size={18} />
              <span>Địa chỉ</span>
            </div>
            <div className={styles.summaryCardContent}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Địa chỉ đầy đủ:</span>
                <span className={styles.summaryValue}>{fullAddress}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Đơn vị quản lý:</span>
                <span className={styles.summaryValue}>{formData.managementUnit}</span>
              </div>
            </div>
          </div>

          {/* Step 4: Định vị */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>
              <Map size={18} />
              <span>Định vị</span>
            </div>
            <div className={styles.summaryCardContent}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Tọa độ:</span>
                <span className={styles.summaryValue} style={{ fontFamily: 'monospace' }}>
                  {formData.latitude?.toFixed(6)}, {formData.longitude?.toFixed(6)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Độ chính xác:</span>
                <Badge variant="outline" className={styles.summaryBadge}>
                  <Target size={12} style={{ marginRight: '4px' }} />
                  {formData.locationPrecision}
                </Badge>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Độ tin cậy:</span>
                <Badge variant="outline" className={styles.summaryBadge}>
                  {formData.locationConfidence === 'AutoGeocoded' && <Cpu size={12} style={{ marginRight: '4px' }} />}
                  {formData.locationConfidence === 'FieldVerified' && <CheckCircle2 size={12} style={{ marginRight: '4px' }} />}
                  {formData.locationConfidence === 'SelfDeclared' && <UserIcon size={12} style={{ marginRight: '4px' }} />}
                  {formData.locationConfidence}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments & Notes Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Đính kèm & Ghi chú</h3>
        <p className={styles.sectionDescription}>
          Thêm link tài liệu, ghi chú nguồn và tags để dễ dàng quản lý (không bắt buộc).
        </p>

        <div className={styles.formGrid}>
          {/* Attachment Links */}
          <div className={styles.formGroupSingle}>
            <Label htmlFor="attachment-links">
              <Link2 size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Link đính kèm
            </Label>
            <Input
              id="attachment-links"
              placeholder="VD: https://drive.google.com/file/d/abc123 (phân cách bằng dấu phẩy)"
              value={formData.attachmentLinks || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, attachmentLinks: e.target.value }))}
            />
            <span className={styles.fieldHelper}>
              Link đến ảnh/tài liệu (Google Drive, Dropbox, etc.). Chỉ lưu link, không upload file.
            </span>
          </div>

          {/* Source Notes */}
          <div className={styles.formGroupSingle}>
            <Label htmlFor="source-notes">
              <FileText size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Ghi chú nguồn
            </Label>
            <Textarea
              id="source-notes"
              placeholder="VD: Thông tin từ khảo sát thực địa ngày 15/01/2026 bởi Thanh tra viên Nguyễn Văn A"
              rows={4}
              value={formData.sourceNotes || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, sourceNotes: e.target.value }))}
            />
            <span className={styles.fieldHelper}>
              Ghi chú về nguồn thông tin, người thu thập, ngày khảo sát, v.v.
            </span>
          </div>

          {/* Tags */}
          <div className={styles.formGroupSingle}>
            <Label htmlFor="tags-input">
              <Tag size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Tags
            </Label>
            <div className={styles.tagsInputWrapper}>
              <Input
                id="tags-input"
                placeholder="Nhập tag và nhấn Enter (VD: khảo-sát-q1, ưu-tiên-kiểm-tra)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {formData.tags && formData.tags.length > 0 && (
                <div className={styles.tagsContainer}>
                  {formData.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className={styles.tagBadge}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className={styles.tagRemoveBtn}
                      >
                        <XCircle size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <span className={styles.fieldHelper}>
              Tags giúp phân loại và tìm kiếm cơ sở dễ dàng hơn. Nhấn Enter để thêm tag.
            </span>
          </div>
        </div>
      </div>

      {/* Completion Info Box */}
      <div className={styles.completionBox}>
        <div className={styles.completionIcon}>
          <CheckCircle2 size={24} />
        </div>
        <div className={styles.completionContent}>
          <div className={styles.completionTitle}>Sẵn sàng hoàn tất</div>
          <div className={styles.completionText}>
            Tất cả thông tin bắt buộc đã được điền đầy đủ. Nhấn nút <strong>"Hoàn tất"</strong> bên dưới để lưu cơ sở mới vào hệ thống.
            Sau khi lưu, bạn sẽ được chuyển đến trang chi tiết cơ sở.
          </div>
        </div>
      </div>
    </div>
  );
}
