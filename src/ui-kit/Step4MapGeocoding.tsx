import React from 'react';
import {
  MapPin,
  MapPinned,
  Info,
  Target,
  Milestone,
  Map,
  Cpu,
  CheckCircle2,
  User,
  AlertTriangle,
} from 'lucide-react';
import { Label } from '../app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../app/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../app/components/ui/tooltip';
import { toast } from 'sonner';
import styles from './AddStoreDialog.module.css';

interface Step4Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isPinConfirmed: boolean;
  setIsPinConfirmed: (value: boolean) => void;
  wards: any[];
  districts: any[];
  geocodeSuggestions: any[];
}

export function Step4MapGeocoding({
  formData,
  setFormData,
  isPinConfirmed,
  setIsPinConfirmed,
  wards,
  districts,
  geocodeSuggestions,
}: Step4Props) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Định vị trên bản đồ</h3>
        <p className={styles.sectionDescription}>
          Xác nhận vị trí chính xác của cơ sở trên bản đồ. Bạn có thể kéo thả pin để điều chỉnh hoặc chọn từ danh sách gợi ý geocode.
        </p>

        <div className={styles.mapContainer}>
          {/* Map Area */}
          <div className={styles.mapWrapper}>
            <div className={styles.mapPlaceholder}>
              {/* Map Grid Background */}
              <div className={styles.mapGrid}></div>
              
              {/* Address Label */}
              <div className={styles.mapAddressLabel}>
                {(() => {
                  const parts = [];
                  if (formData.address) parts.push(formData.address);
                  if (formData.ward) {
                    const wardName = wards.find((w: any) => w.code === formData.ward)?.name;
                    if (wardName) parts.push(wardName);
                  }
                  if (formData.jurisdiction) {
                    const districtName = districts.find((d: any) => d.code === formData.jurisdiction)?.name;
                    if (districtName) parts.push(districtName);
                  }
                  return parts.join(', ') || 'Chưa có địa chỉ';
                })()}
              </div>
              
              {/* Draggable Pin */}
              <div 
                className={styles.mapPin}
                style={{
                  left: `${formData.longitude !== undefined ? 50 + (formData.longitude as number) * 100 : 50}%`,
                  top: `${formData.latitude !== undefined ? 50 - (formData.latitude as number) * 100 : 50}%`,
                }}
                draggable
                onDragEnd={(e) => {
                  const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                  if (rect) {
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    setFormData((prev: any) => ({
                      ...prev,
                      latitude: 0.5 - y,
                      longitude: x - 0.5,
                    }));
                    setIsPinConfirmed(true);
                    toast.success('Đã cập nhật vị trí pin');
                  }
                }}
              >
                <MapPin size={32} className={styles.pinIcon} />
                <div className={styles.pinShadow}></div>
              </div>

              {/* Map Controls */}
              <div className={styles.mapControls}>
                <button 
                  className={styles.mapControlBtn}
                  onClick={() => toast.info('Zoom in')}
                  type="button"
                >
                  +
                </button>
                <button 
                  className={styles.mapControlBtn}
                  onClick={() => toast.info('Zoom out')}
                  type="button"
                >
                  -
                </button>
              </div>

              {/* Coordinates Display */}
              <div className={styles.coordinatesDisplay}>
                <div className={styles.coordItem}>
                  <span className={styles.coordLabel}>Lat:</span>
                  <span className={styles.coordValue}>
                    {formData.latitude?.toFixed(6) || '10.762622'}
                  </span>
                </div>
                <div className={styles.coordItem}>
                  <span className={styles.coordLabel}>Lng:</span>
                  <span className={styles.coordValue}>
                    {formData.longitude?.toFixed(6) || '106.660172'}
                  </span>
                </div>
              </div>
            </div>

            {/* Geocode Suggestions */}
            <div className={styles.geocodeSuggestions}>
              <div className={styles.suggestionsHeader}>
                <MapPinned size={16} />
                <span>Gợi ý vị trí từ geocode</span>
              </div>
              
              <div className={styles.suggestionsList}>
                {geocodeSuggestions.map((suggestion: any, index: number) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.suggestionItem} ${
                      formData.latitude === suggestion.lat && formData.longitude === suggestion.lng
                        ? styles.suggestionItemActive
                        : ''
                    }`}
                    onClick={() => {
                      setFormData((prev: any) => ({
                        ...prev,
                        latitude: suggestion.lat,
                        longitude: suggestion.lng,
                        locationPrecision: suggestion.precision,
                      }));
                      setIsPinConfirmed(true);
                      toast.success(`Đã chọn: ${suggestion.name}`);
                    }}
                  >
                    <div className={styles.suggestionInfo}>
                      <div className={styles.suggestionName}>{suggestion.name}</div>
                      <div className={styles.suggestionAddress}>{suggestion.address}</div>
                    </div>
                    <div className={styles.suggestionMeta}>
                      <span className={`${styles.precisionBadge} ${styles[`precision${suggestion.precision}`]}`}>
                        {suggestion.precision}
                      </span>
                      <span className={styles.suggestionDistance}>{suggestion.distance}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location Settings Panel */}
          <div className={styles.locationSettings}>
            <h4 className={styles.settingsTitle}>Cài đặt định vị</h4>

            {/* Location Precision */}
            <div className={styles.formGroup}>
              <div className={styles.labelWithTooltip}>
                <Label htmlFor="location-precision">
                  Độ chính xác vị trí <span className={styles.required}>*</span>
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className={styles.tooltipBtn}>
                      <Info size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={styles.tooltipContent}>
                    <div className={styles.tooltipTitle}>Độ chính xác vị trí (Location Precision)</div>
                    <ul className={styles.tooltipList}>
                      <li><strong>Rooftop:</strong> Chính xác đến mái nhà/tòa nhà cụ thể</li>
                      <li><strong>Street:</strong> Chính xác đến đường/phố</li>
                      <li><strong>Ward:</strong> Chính xác đến phường/xã</li>
                      <li><strong>District:</strong> Chính xác đến quận/huyện</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={formData.locationPrecision}
                onValueChange={(value) => setFormData((prev: any) => ({ ...prev, locationPrecision: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn độ chính xác" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rooftop">
                    <Target size={16} />
                    <div>
                      <div className={styles.selectItemLabel}>Rooftop</div>
                      <div className={styles.selectItemDesc}>Chính xác đến mái nhà</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="Street">
                    <Milestone size={16} />
                    <div>
                      <div className={styles.selectItemLabel}>Street</div>
                      <div className={styles.selectItemDesc}>Chính xác đến đường/phố</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="Ward">
                    <MapPinned size={16} />
                    <div>
                      <div className={styles.selectItemLabel}>Ward</div>
                      <div className={styles.selectItemDesc}>Chính xác đến phường/xã</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="District">
                    <Map size={16} />
                    <div>
                      <div className={styles.selectItemLabel}>District</div>
                      <div className={styles.selectItemDesc}>Chính xác đến quận/huyện</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {!formData.locationPrecision && (
                <span className={styles.fieldError}>Vui lòng chọn độ chính xác vị trí</span>
              )}
            </div>

            {/* Location Confidence */}
            <div className={styles.formGroup}>
              <div className={styles.labelWithTooltip}>
                <Label htmlFor="location-confidence">
                  Độ tin cậy nguồn <span className={styles.required}>*</span>
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className={styles.tooltipBtn}>
                      <Info size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={styles.tooltipContent}>
                    <div className={styles.tooltipTitle}>Độ tin cậy nguồn (Location Confidence)</div>
                    <ul className={styles.tooltipList}>
                      <li><strong>AutoGeocoded:</strong> Tự động từ hệ thống geocoding</li>
                      <li><strong>FieldVerified:</strong> Đã xác minh thực địa bởi thanh tra viên</li>
                      <li><strong>SelfDeclared:</strong> Chủ cơ sở tự khai báo</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={formData.locationConfidence}
                onValueChange={(value) => setFormData((prev: any) => ({ ...prev, locationConfidence: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn độ tin cậy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AutoGeocoded">
                    <Cpu size={16} />
                    <div>
                      <div className={styles.selectItemLabel}>AutoGeocoded</div>
                      <div className={styles.selectItemDesc}>Tự động từ hệ thống</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="FieldVerified">
                    <CheckCircle2 size={16} />
                    <div>
                      <div className={styles.selectItemLabel}>FieldVerified</div>
                      <div className={styles.selectItemDesc}>Xác minh thực địa</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="SelfDeclared">
                    <User size={16} />
                    <div>
                      <div className={styles.selectItemLabel}>SelfDeclared</div>
                      <div className={styles.selectItemDesc}>Chủ cơ sở khai báo</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {!formData.locationConfidence && (
                <span className={styles.fieldError}>Vui lòng chọn độ tin cậy nguồn</span>
              )}
            </div>

            {/* Pin Confirmation */}
            <div className={styles.pinConfirmation}>
              {!isPinConfirmed && (
                <div className={styles.warningBox}>
                  <div className={styles.warningIcon}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className={styles.warningContent}>
                    <div className={styles.warningTitle}>Chưa xác nhận vị trí</div>
                    <div className={styles.warningText}>
                      Vui lòng chọn vị trí từ danh sách gợi ý hoặc kéo thả pin trên bản đồ
                    </div>
                  </div>
                </div>
              )}
              
              {isPinConfirmed && (
                <div className={styles.successBox}>
                  <div className={styles.successIcon}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div className={styles.successContent}>
                    <div className={styles.successTitle}>Đã xác nhận vị trí</div>
                    <div className={styles.successText}>
                      Vị trí pin đã được thiết lập tại: {formData.latitude?.toFixed(6)}, {formData.longitude?.toFixed(6)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className={styles.infoBox}>
              <div className={styles.infoIcon}>
                <Info size={16} />
              </div>
              <div className={styles.infoText}>
                <strong>Hướng dẫn:</strong>
                <ul style={{ marginTop: 'var(--spacing-2)', paddingLeft: 'var(--spacing-4)' }}>
                  <li>Kéo thả pin trên bản đồ để điều chỉnh vị trí chính xác</li>
                  <li>Hoặc chọn nhanh từ danh sách gợi ý geocode bên trái</li>
                  <li>Chọn độ chính xác và độ tin cậy phù hợp với thực tế</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}