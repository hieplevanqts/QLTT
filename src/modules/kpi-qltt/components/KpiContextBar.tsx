import type { Dayjs } from 'dayjs';
import { DatePicker, Segmented, Select, Space } from 'antd';
import GeoUnitTreeSelect from '@/modules/kpi/components/GeoUnitTreeSelect';
import type { KpiMode, TimeRangeKey } from '@/modules/kpi/mocks/kpiWorkspace.mock';
import styles from './KpiContextBar.module.css';

interface KpiContextBarProps {
  geoUnits: string[];
  onGeoUnitsChange: (value: string[]) => void;
  orgUnit: string;
  onOrgUnitChange: (value: string) => void;
  orgUnitOptions: { value: string; label: string }[];
  timeRange: TimeRangeKey;
  onTimeRangeChange: (value: TimeRangeKey) => void;
  rangeValue: [Dayjs, Dayjs] | null;
  onRangeChange: (value: [Dayjs, Dayjs] | null) => void;
  mode: KpiMode;
  onModeChange: (value: KpiMode) => void;
}

export default function KpiContextBar({
  geoUnits,
  onGeoUnitsChange,
  orgUnit,
  onOrgUnitChange,
  orgUnitOptions,
  timeRange,
  onTimeRangeChange,
  rangeValue,
  onRangeChange,
  mode,
  onModeChange,
}: KpiContextBarProps) {
  return (
    <div className={styles.contextBar}>
      <div className={styles.contextRow}>
        <div className={styles.contextGroup}>
          <span className={styles.contextLabel}>Địa bàn</span>
          <GeoUnitTreeSelect value={geoUnits} onChange={onGeoUnitsChange} width={320} />
        </div>

        <div className={styles.contextDivider} />

        <div className={styles.contextGroup}>
          <span className={styles.contextLabel}>Đơn vị thực thi</span>
          <Select
            value={orgUnit}
            onChange={onOrgUnitChange}
            options={orgUnitOptions}
            style={{ minWidth: 200 }}
          />
        </div>

        <div className={styles.contextDivider} />

        <div className={styles.contextGroup}>
          <span className={styles.contextLabel}>Kỳ báo cáo</span>
          <Space size={8} wrap>
            <Segmented
              value={timeRange}
              onChange={(value) => onTimeRangeChange(value as TimeRangeKey)}
              options={[
                { label: '7 ngày', value: '7d' },
                { label: '30 ngày', value: '30d' },
                { label: '90 ngày', value: '90d' },
              ]}
            />
            <DatePicker.RangePicker
              value={rangeValue}
              onChange={(value) => onRangeChange(value ? [value[0]!, value[1]!] : null)}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Space>
        </div>

        <div className={styles.contextDivider} />

        <div className={styles.contextGroup}>
          <span className={styles.contextLabel}>Chế độ</span>
          <Segmented
            value={mode}
            onChange={(value) => onModeChange(value as KpiMode)}
            options={[
              { label: 'Tuyệt đối', value: 'absolute' },
              { label: 'Chuẩn hoá', value: 'normalized' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
