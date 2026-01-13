import React, { useMemo } from 'react';
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
  Phone,
} from 'lucide-react';
import { Label } from '../app/components/ui/label';
import { Input } from '../app/components/ui/input';
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
  provinces: any[];
  geocodeSuggestions: any[];
  isValidPhone: (phone: string) => boolean;
}

export function Step4AddressMap({
  formData,
  setFormData,
  isPinConfirmed,
  setIsPinConfirmed,
  wards,
  districts,
  provinces,
  geocodeSuggestions,
  isValidPhone,
}: Step4Props) {
  // Filter management units by selected province
  const filteredManagementUnits = useMemo(() => {
    if (!formData.province) return [];
    
    if (formData.province === '01') {
      // Hà Nội
      return [
        { value: 'qltt-hn', label: 'Chi cục QLTT TP. Hà Nội' },
        { value: 'qltt-ba-dinh', label: 'Chi cục QLTT Ba Đình' },
        { value: 'qltt-hoan-kiem', label: 'Chi cục QLTT Hoàn Kiếm' },
        { value: 'qltt-hai-ba-trung', label: 'Chi cục QLTT Hai Bà Trưng' },
        { value: 'qltt-dong-da', label: 'Chi cục QLTT Đống Đa' },
        { value: 'qltt-tay-ho', label: 'Chi cục QLTT Tây Hồ' },
        { value: 'qltt-cau-giay', label: 'Chi cục QLTT Cầu Giấy' },
        { value: 'qltt-thanh-xuan', label: 'Chi cục QLTT Thanh Xuân' },
        { value: 'qltt-hoang-mai', label: 'Chi cục QLTT Hoàng Mai' },
        { value: 'qltt-long-bien', label: 'Chi cục QLTT Long Biên' },
        { value: 'qltt-ha-dong', label: 'Chi cục QLTT Hà Đông' },
      ];
    } else if (formData.province === '79') {
      // TP. Hồ Chí Minh
      return [
        { value: 'qltt-hcm', label: 'Chi cục QLTT TP. Hồ Chí Minh' },
        { value: 'qltt-q1', label: 'Chi cục QLTT Quận 1' },
        { value: 'qltt-q3', label: 'Chi cục QLTT Quận 3' },
        { value: 'qltt-q5', label: 'Chi cục QLTT Quận 5' },
        { value: 'qltt-q10', label: 'Chi cục QLTT Quận 10' },
        { value: 'qltt-pn', label: 'Chi cục QLTT Quận Phú Nhuận' },
        { value: 'qltt-tb', label: 'Chi cục QLTT Quận Tân Bình' },
        { value: 'qltt-bt', label: 'Chi cục QLTT Quận Bình Thạnh' },
        { value: 'qltt-gv', label: 'Chi cục QLTT Quận Gò Vấp' },
        { value: 'qltt-tp', label: 'Chi cục QLTT Quận Tân Phú' },
        { value: 'qltt-td', label: 'Chi cục QLTT TP. Thủ Đức' },
      ];
    }
    return [];
  }, [formData.province]);

  return (
    <div className={styles.stepContent}>
      {/* Address Form Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Địa chỉ cơ sở kinh doanh</h3>
        <p className={styles.sectionDescription}>
          Nhập địa chỉ chính xác của cơ sở. Vị trí sẽ được hiển thị tự động trên bản đồ bên dưới.
        </p>

        <div className={styles.formGrid}>
          {/* Tỉnh/Thành phố */}
          <div className={styles.formGroup}>
            <Label htmlFor="province">
              Tỉnh/Thành phố <span className={styles.required}>*</span>
            </Label>
            <Select
              value={formData.province}
              onValueChange={(value) => {
                setFormData((prev: any) => ({ 
                  ...prev, 
                  province: value,
                  jurisdiction: '', // Reset district when province changes
                  ward: '', // Reset ward when province changes
                  managementUnit: '', // Reset management unit when province changes
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tỉnh/thành phố" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province: any) => (
                  <SelectItem key={province.code} value={province.code}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!formData.province && (
              <span className={styles.fieldError}>Vui lòng chọn tỉnh/thành phố</span>
            )}
          </div>

          {/* Phường/Xã */}
          <div className={styles.formGroup}>
            <Label htmlFor="ward">
              Phường/Xã <span className={styles.required}>*</span>
            </Label>
            <Select
              value={formData.ward}
              onValueChange={(value) => setFormData((prev: any) => ({ ...prev, ward: value }))}
              disabled={!formData.province}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.province ? "Chọn phường/xã" : "Chọn tỉnh/thành trước"} />
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward: any) => (
                  <SelectItem key={ward.code} value={ward.code}>
                    {ward.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.province && !formData.ward && (
              <span className={styles.fieldError}>Vui lòng chọn phường/xã</span>
            )}
            {!formData.province && (
              <span className={styles.fieldHelper}>
                Chọn tỉnh/thành phố trước để hiển thị danh sách phường/xã
              </span>
            )}
          </div>

          {/* Đơn vị quản lý */}
          <div className={styles.formGroup}>
            <Label htmlFor="management-unit">
              Đơn vị quản lý <span className={styles.required}>*</span>
            </Label>
            <Select
              value={formData.managementUnit}
              onValueChange={(value) => setFormData((prev: any) => ({ ...prev, managementUnit: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn đơn vị quản lý" />
              </SelectTrigger>
              <SelectContent>
                {filteredManagementUnits.map((unit: any) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!formData.managementUnit && (
              <span className={styles.fieldError}>Vui lòng chọn đơn vị quản lý</span>
            )}
            <span className={styles.fieldHelper}>
              Đơn vị QLTT phụ trách kiểm tra và quản lý cơ sở này
            </span>
          </div>
        </div>

        {/* Địa chỉ chi tiết */}
        <div className={styles.formGrid}>
          {/* Số nhà */}
          <div className={styles.formGroup}>
            <Label htmlFor="street-number">
              Số nhà <span className={styles.required}>*</span>
            </Label>
            <Input
              id="street-number"
              placeholder="VD: 123"
              value={formData.address.split(',')[0] || ''}
              onChange={(e) => {
                const parts = formData.address.split(',');
                parts[0] = e.target.value;
                setFormData((prev: any) => ({ ...prev, address: parts.filter((p: string) => p.trim()).join(', ') }));
              }}
            />
            {!formData.address.split(',')[0]?.trim() && (
              <span className={styles.fieldError}>Vui lòng nhập số nhà</span>
            )}
            <span className={styles.fieldHelper}>
              Số nhà, tòa nhà hoặc căn hộ
            </span>
          </div>

          {/* Tên đường */}
          <div className={styles.formGroup}>
            <Label htmlFor="street-name">
              Tên đường <span className={styles.required}>*</span>
            </Label>
            <Input
              id="street-name"
              placeholder="VD: Nguyễn Huệ"
              value={formData.address.split(',')[1]?.trim() || ''}
              onChange={(e) => {
                const parts = formData.address.split(',');
                parts[1] = e.target.value;
                setFormData((prev: any) => ({ ...prev, address: parts.filter((p: string) => p.trim()).join(', ') }));
              }}
            />
            {formData.address.split(',')[0]?.trim() && !formData.address.split(',')[1]?.trim() && (
              <span className={styles.fieldError}>Vui lòng nhập tên đường</span>
            )}
            <span className={styles.fieldHelper}>
              Tên đường, phố, khu vực
            </span>
          </div>
        </div>

        {/* Địa chỉ đầy đủ (tự động tạo) */}
        <div className={styles.formGroupSingle}>
          <Label htmlFor="full-address">
            Địa chỉ đầy đủ
          </Label>
          <div className={styles.addressPreview}>
            {(() => {
              const parts = [];
              if (formData.address) parts.push(formData.address);
              if (formData.ward) {
                const wardName = wards.find((w: any) => w.code === formData.ward)?.name;
                if (wardName) parts.push(wardName);
              }
              if (formData.province) {
                const provinceName = provinces.find((p: any) => p.code === formData.province)?.name;
                if (provinceName) parts.push(provinceName);
              }
              return parts.length > 0 ? parts.join(', ') : 'Địa chỉ sẽ được tạo tự động khi bạn điền đầy đủ thông tin';
            })()}
          </div>
          <span className={styles.fieldHelper}>
            Địa chỉ này được tạo tự động từ các trường bên trên
          </span>
        </div>

        {/* Validation Summary */}
        {(formData.province || formData.ward || formData.address) && 
         (!formData.province || !formData.ward || !formData.address.split(',')[0]?.trim() || !formData.address.split(',')[1]?.trim() || !formData.managementUnit) && (
          <div className={styles.warningBox}>
            <div className={styles.warningIcon}>
              <AlertTriangle size={20} />
            </div>
            <div className={styles.warningContent}>
              <div className={styles.warningTitle}>Địa chỉ chưa đầy đủ</div>
              <div className={styles.warningText}>
                Vui lòng điền đầy đủ các thông tin:
                <ul style={{ marginTop: 'var(--spacing-2)', paddingLeft: 'var(--spacing-5)' }}>
                  {!formData.province && <li>Tỉnh/Thành phố</li>}
                  {!formData.ward && <li>Phường/Xã</li>}
                  {!formData.address.split(',')[0]?.trim() && <li>Số nhà</li>}
                  {!formData.address.split(',')[1]?.trim() && <li>Tên đường</li>}
                  {!formData.managementUnit && <li>Đơn vị quản lý</li>}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Địa chỉ bổ sung */}
        <div className={styles.section} style={{ marginTop: 'var(--spacing-6)' }}>
          <h4 className={styles.subsectionTitle}>Địa chỉ bổ sung (Không bắt buộc)</h4>
          
          <div className={styles.formGrid}>
            {/* Địa chỉ đăng ký kinh doanh */}
            <div className={styles.formGroup}>
              <Label htmlFor="registered-address">Địa chỉ đăng ký kinh doanh</Label>
              <Input
                id="registered-address"
                placeholder="VD: 456 Lê Lợi, Quận 1, TP.HCM"
                value={formData.registeredAddress}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, registeredAddress: e.target.value }))}
              />
              <span className={styles.fieldHelper}>
                Địa chỉ ghi trên giấy phép kinh doanh (nếu khác địa chỉ trên)
              </span>
            </div>

            {/* Địa chỉ trụ sở chính */}
            <div className={styles.formGroup}>
              <Label htmlFor="headquarter-address">Địa chỉ trụ sở chính</Label>
              <Input
                id="headquarter-address"
                placeholder="VD: 789 Hai Bà Trưng, Quận 3, TP.HCM"
                value={formData.headquarterAddress}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, headquarterAddress: e.target.value }))}
              />
              <span className={styles.fieldHelper}>
                Địa chỉ trụ sở chính (nếu khác địa chỉ kinh doanh)
              </span>
            </div>

            {/* Địa chỉ sản xuất */}
            <div className={styles.formGroup}>
              <Label htmlFor="production-address">Địa chỉ sản xuất</Label>
              <Input
                id="production-address"
                placeholder="VD: KCN Tân Bình, TP.HCM"
                value={formData.productionAddress}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, productionAddress: e.target.value }))}
              />
              <span className={styles.fieldHelper}>
                Địa chỉ nhà máy/xưởng sản xuất (nếu có)
              </span>
            </div>

            {/* SĐT chi nhánh */}
            <div className={styles.formGroup}>
              <Label htmlFor="branch-phone">SĐT chi nhánh</Label>
              <div className={styles.inputWithIcon}>
                <Phone size={18} className={styles.inputIcon} />
                <Input
                  id="branch-phone"
                  placeholder="VD: 0281234567"
                  value={formData.branchPhone}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, branchPhone: e.target.value }))}
                  className={styles.inputPadded}
                />
              </div>
              {formData.branchPhone && !isValidPhone(formData.branchPhone) && (
                <span className={styles.fieldError}>Số điện thoại không hợp lệ</span>
              )}
              <span className={styles.fieldHelper}>
                Số điện thoại liên hệ của chi nhánh (nếu có)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className={styles.section} style={{ marginTop: 'var(--spacing-8)' }}>
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
                  return parts.join(', ') || 'Nhập địa chỉ ở trên để xem vị trí';
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
                onDragEnd={(e: any) => {
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

            {/* Two Column Layout for Settings */}
            <div className={styles.settingsGrid}>
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
                      <span>
                        <div className={styles.selectItemLabel}>AutoGeocoded</div>
                        <div className={styles.selectItemDesc}>Tự động từ hệ thống</div>
                      </span>
                    </SelectItem>
                    <SelectItem value="FieldVerified">
                      <CheckCircle2 size={16} />
                      <span>
                        <div className={styles.selectItemLabel}>FieldVerified</div>
                        <div className={styles.selectItemDesc}>Xác minh thực địa</div>
                      </span>
                    </SelectItem>
                    <SelectItem value="SelfDeclared">
                      <User size={16} />
                      <span>
                        <div className={styles.selectItemLabel}>SelfDeclared</div>
                        <div className={styles.selectItemDesc}>Chủ cơ sở khai báo</div>
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {!formData.locationConfidence && (
                  <span className={styles.fieldError}>Vui lòng chọn độ tin cậy nguồn</span>
                )}
              </div>
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
                  <li>Nhập địa chỉ ở phần trên để xem vị trí tự động</li>
                  <li>Kéo thả pin trên bản đồ để điều chỉnh chính xác</li>
                  <li>Hoặc chọn từ danh sách gợi ý geocode</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}