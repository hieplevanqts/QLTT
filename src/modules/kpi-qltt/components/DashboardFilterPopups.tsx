import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import styles from '../pages/KpiQlttDashboard.module.css';

// Filter interfaces
export interface InspectionFilters {
  dateFrom: string;
  dateTo: string;
  teams: string[];
  violationTypes: string[];
}

export interface RiskFilters {
  violationCategories: string[];
  riskStatuses: string[];
  businessTypes: string[];
  industries: string[];
}

export interface FeedbackFilters {
  sourceTypes: string[];
  processingStatuses: string[];
  updatePeriods: string[];
}

// Inspection Filter Popup
interface InspectionFilterPopupProps {
  filters: InspectionFilters;
  onFiltersChange: (filters: InspectionFilters) => void;
  onClose: () => void;
}

export function InspectionFilterPopup({ filters, onFiltersChange, onClose }: InspectionFilterPopupProps) {
  const [tempFilters, setTempFilters] = useState<InspectionFilters>(filters);

  const teamOptions = ['Đội 1', 'Đội 2', 'Đội 3', 'Đội 4', 'Đội 5'];
  const violationTypeOptions = [
    'Vi phạm an toàn thực phẩm',
    'Vi phạm giá cả',
    'Vi phạm giấy phép',
    'Hàng giả',
    'Vi phạm dược phẩm'
  ];

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleClearAll = () => {
    const emptyFilters = { dateFrom: '', dateTo: '', teams: [], violationTypes: [] };
    setTempFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <>
      <div className={styles.filterPopupHeader}>
        <h3 className={styles.filterPopupTitle}>Bộ lọc nâng cao</h3>
        <button className={styles.filterCloseBtn} onClick={onClose} aria-label="Đóng">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className={styles.filterPopupContent}>
        <div className={styles.dateRangeGroup}>
          <label className={styles.filterLabel}>Chọn thời gian xem kết quả kiểm tra</label>
          <div className={styles.dateRangeInputs}>
            <div className={styles.dateInputWrapper}>
              <label className={styles.dateLabel}>Từ ngày</label>
              <input
                type="date"
                className={styles.dateInput}
                value={tempFilters.dateFrom}
                onChange={(e) => setTempFilters({ ...tempFilters, dateFrom: e.target.value })}
              />
            </div>
            <div className={styles.dateInputWrapper}>
              <label className={styles.dateLabel}>Đến ngày</label>
              <input
                type="date"
                className={styles.dateInput}
                value={tempFilters.dateTo}
                onChange={(e) => setTempFilters({ ...tempFilters, dateTo: e.target.value })}
              />
            </div>
          </div>
        </div>
        <MultiSelect
          label="Chọn đội kiểm tra"
          options={teamOptions}
          selectedValues={tempFilters.teams}
          onChange={(values) => setTempFilters({ ...tempFilters, teams: values })}
          placeholder="Chọn đội"
          allOptionLabel="Tất cả đội"
        />
        <MultiSelect
          label="Lọc theo loại vi phạm"
          options={violationTypeOptions}
          selectedValues={tempFilters.violationTypes}
          onChange={(values) => setTempFilters({ ...tempFilters, violationTypes: values })}
          placeholder="Chọn loại vi phạm"
          allOptionLabel="Tất cả loại"
        />
      </div>
      <div className={styles.filterPopupFooter}>
        <Button variant="outline" size="sm" onClick={handleClearAll}>
          Xóa bộ lọc
        </Button>
        <Button variant="default" size="sm" onClick={handleApply}>
          <CheckCircle className="w-4 h-4" />
          Áp dụng
        </Button>
      </div>
    </>
  );
}

// Risk Filter Popup
interface RiskFilterPopupProps {
  filters: RiskFilters;
  onFiltersChange: (filters: RiskFilters) => void;
  onClose: () => void;
}

export function RiskFilterPopup({ filters, onFiltersChange, onClose }: RiskFilterPopupProps) {
  const [tempFilters, setTempFilters] = useState<RiskFilters>(filters);

  const violationCategoryOptions = ['An toàn thực phẩm', 'Hàng giả', 'Dược phẩm', 'Giá cả', 'Giấy phép'];
  const riskStatusOptions = ['Đang xử lý', 'Đã giải quyết', 'Chờ xác minh', 'Đang giám sát'];
  const businessTypeOptions = ['Doanh nghiệp tư nhân', 'Công ty TNHH', 'Công ty cổ phần', 'Hộ kinh doanh'];
  const industryOptions = ['Công nghệ', 'Thực phẩm', 'Bán lẻ', 'Y tế', 'Dược phẩm', 'Xây dựng', 'Dịch vụ', 'Sản xuất'];

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleClearAll = () => {
    const emptyFilters = { violationCategories: [], riskStatuses: [], businessTypes: [], industries: [] };
    setTempFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <>
      <div className={styles.filterPopupHeader}>
        <h3 className={styles.filterPopupTitle}>Bộ lọc nâng cao</h3>
        <button className={styles.filterCloseBtn} onClick={onClose} aria-label="Đóng">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className={styles.filterPopupContent}>
        <MultiSelect
          label="Chọn danh mục vi phạm"
          options={violationCategoryOptions}
          selectedValues={tempFilters.violationCategories}
          onChange={(values) => setTempFilters({ ...tempFilters, violationCategories: values })}
          placeholder="Chọn danh mục"
          allOptionLabel="Tất cả danh mục"
        />
        <MultiSelect
          label="Lọc theo tình trạng rủi ro"
          options={riskStatusOptions}
          selectedValues={tempFilters.riskStatuses}
          onChange={(values) => setTempFilters({ ...tempFilters, riskStatuses: values })}
          placeholder="Chọn trạng thái"
          allOptionLabel="Tất cả trạng thái"
        />
        <MultiSelect
          label="Lọc theo phân loại doanh nghiệp"
          options={businessTypeOptions}
          selectedValues={tempFilters.businessTypes}
          onChange={(values) => setTempFilters({ ...tempFilters, businessTypes: values })}
          placeholder="Chọn loại hình"
          allOptionLabel="Tất cả loại hình"
        />
        <MultiSelect
          label="Chọn ngành nghề liên quan đến rủi ro"
          options={industryOptions}
          selectedValues={tempFilters.industries}
          onChange={(values) => setTempFilters({ ...tempFilters, industries: values })}
          placeholder="Chọn ngành nghề"
          allOptionLabel="Tất cả ngành nghề"
        />
      </div>
      <div className={styles.filterPopupFooter}>
        <Button variant="outline" size="sm" onClick={handleClearAll}>
          Xóa bộ lọc
        </Button>
        <Button variant="default" size="sm" onClick={handleApply}>
          <CheckCircle className="w-4 h-4" />
          Áp dụng
        </Button>
      </div>
    </>
  );
}

// Feedback Filter Popup
interface FeedbackFilterPopupProps {
  filters: FeedbackFilters;
  onFiltersChange: (filters: FeedbackFilters) => void;
  onClose: () => void;
}

export function FeedbackFilterPopup({ filters, onFiltersChange, onClose }: FeedbackFilterPopupProps) {
  const [tempFilters, setTempFilters] = useState<FeedbackFilters>(filters);

  const sourceTypeOptions = [
    'Nguồn tin từ báo cáo',
    'Nguồn tin từ đối tác',
    'Nguồn tin từ người dân',
    'Nguồn tin từ doanh nghiệp',
    'Nguồn tin từ cơ quan'
  ];
  const processingStatusOptions = [
    'Đã xác minh',
    'Chưa xác minh',
    'Đang xác minh',
    'Đã xử lý',
    'Đang xử lý'
  ];
  const updatePeriodOptions = [
    'Hôm nay',
    'Tuần này',
    'Tuần trước',
    'Tháng này',
    'Tháng trước',
    'Quý này',
    'Quý trước'
  ];

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleClearAll = () => {
    const emptyFilters = { sourceTypes: [], processingStatuses: [], updatePeriods: [] };
    setTempFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <>
      <div className={styles.filterPopupHeader}>
        <h3 className={styles.filterPopupTitle}>Bộ lọc nâng cao</h3>
        <button className={styles.filterCloseBtn} onClick={onClose} aria-label="Đóng">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className={styles.filterPopupContent}>
        <MultiSelect
          label="Lọc theo loại nguồn tin"
          options={sourceTypeOptions}
          selectedValues={tempFilters.sourceTypes}
          onChange={(values) => setTempFilters({ ...tempFilters, sourceTypes: values })}
          placeholder="Chọn loại nguồn tin"
          allOptionLabel="Tất cả loại"
        />
        <MultiSelect
          label="Lọc theo tình trạng xử lý của nguồn tin"
          options={processingStatusOptions}
          selectedValues={tempFilters.processingStatuses}
          onChange={(values) => setTempFilters({ ...tempFilters, processingStatuses: values })}
          placeholder="Chọn tình trạng"
          allOptionLabel="Tất cả tình trạng"
        />
        <MultiSelect
          label="Lọc theo thời gian cập nhật nguồn tin"
          options={updatePeriodOptions}
          selectedValues={tempFilters.updatePeriods}
          onChange={(values) => setTempFilters({ ...tempFilters, updatePeriods: values })}
          placeholder="Chọn thời gian"
          allOptionLabel="Tất cả thời gian"
        />
      </div>
      <div className={styles.filterPopupFooter}>
        <Button variant="outline" size="sm" onClick={handleClearAll}>
          Xóa bộ lọc
        </Button>
        <Button variant="default" size="sm" onClick={handleApply}>
          <CheckCircle className="w-4 h-4" />
          Áp dụng
        </Button>
      </div>
    </>
  );
}
