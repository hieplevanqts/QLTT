import { useEffect, useMemo, useState } from 'react';
import type { Dayjs } from 'dayjs';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  Progress,
  Row,
  Space,
  Statistic,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import KpiContextBar from '../components/KpiContextBar';
import {
  buildKpiWorkspaceMock,
  orgUnitOptions,
  type KpiMode,
  type KpiTab,
  type TimeRangeKey,
} from '@/modules/kpi/mocks/kpiWorkspace.mock';
import styles from './KpiWorkspacePage.module.css';

const { Title, Text } = Typography;

const tabItems = [
  { key: 'overview', label: 'Tổng quan chỉ huy' },
  { key: 'ops', label: 'Tác nghiệp & SLA' },
  { key: 'tips', label: 'Nguồn tin – Phản ánh' },
  { key: 'risk', label: 'Rủi ro & Điểm nóng' },
  { key: 'market', label: 'Thị trường & Cơ sở' },
];

const criteriaLinks = [
  { key: 'violation_form', label: 'Hình thức vi phạm' },
  { key: 'violation_behavior_group', label: 'Nhóm hành vi vi phạm' },
  { key: 'inspection_campaign', label: 'Chuyên đề kiểm tra' },
];

const parseGeoUnits = (value: string | null) =>
  value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const parseTimeRange = (value: string | null): TimeRangeKey => {
  if (value === '7d' || value === '30d' || value === '90d') return value;
  return '30d';
};

const parseMode = (value: string | null): KpiMode => {
  if (value === 'normalized' || value === 'absolute') return value;
  return 'absolute';
};

const parseTab = (value: string | null): KpiTab => {
  if (value === 'overview' || value === 'ops' || value === 'tips' || value === 'risk' || value === 'market') {
    return value;
  }
  return 'overview';
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value);

export default function KpiWorkspacePage() {
  const [searchParams] = useSearchParams();
  const [geoUnits, setGeoUnits] = useState<string[]>([]);
  const [orgUnit, setOrgUnit] = useState('all');
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('30d');
  const [rangeValue, setRangeValue] = useState<[Dayjs, Dayjs] | null>(null);
  const [mode, setMode] = useState<KpiMode>('absolute');
  const [activeTab, setActiveTab] = useState<KpiTab>('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const searchParamsKey = searchParams.toString();

  useEffect(() => {
    const params = new URLSearchParams(searchParamsKey);
    const nextGeoUnits = parseGeoUnits(params.get('geoUnits'));
    const nextOrgUnit = params.get('orgUnit') || 'all';
    const nextRange = parseTimeRange(params.get('range'));
    const nextMode = parseMode(params.get('mode'));
    const nextTab = parseTab(params.get('tab'));

    setGeoUnits(nextGeoUnits);
    setOrgUnit(nextOrgUnit);
    setTimeRange(nextRange);
    setMode(nextMode);
    setActiveTab(nextTab);
    setRangeValue(null);
  }, [searchParamsKey]);

  const rangeDays = useMemo(() => {
    if (!rangeValue) return null;
    return rangeValue[1].diff(rangeValue[0], 'day') + 1;
  }, [rangeValue]);

  const mockData = useMemo(
    () =>
      buildKpiWorkspaceMock({
        geoUnits,
        orgUnit,
        range: { timeRange, rangeDays },
        mode,
        tab: activeTab,
      }),
    [geoUnits, orgUnit, timeRange, rangeDays, mode, activeTab, refreshKey],
  );

  const { cards, trend, breakdown, insights } = mockData;

  const criteriaQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (geoUnits.length > 0) params.set('geoUnits', geoUnits.join(','));
    if (orgUnit) params.set('orgUnit', orgUnit);
    if (timeRange) params.set('range', timeRange);
    if (mode) params.set('mode', mode);
    if (activeTab) params.set('tab', activeTab);
    params.set('from', '/kpi');
    return params.toString();
  }, [geoUnits, orgUnit, timeRange, mode, activeTab]);

  const showCriteriaLinks = useMemo(() => {
    const violationKeys = ['violations', 'hotspots', 'risk_hotspots', 'reoffend_rate', 'high_risk'];
    return activeTab === 'risk' || cards.some((card) => violationKeys.includes(card.key));
  }, [activeTab, cards]);

  const trendSummary = useMemo(() => {
    if (trend.length < 2) return 'Xu hướng đang ổn định so với đầu kỳ.';
    const first = trend[0].value;
    const last = trend[trend.length - 1].value;
    if (first === 0) return 'Xu hướng đang ổn định so với đầu kỳ.';
    const delta = ((last - first) / first) * 100;
    if (Math.abs(delta) < 1) return 'Xu hướng đang ổn định so với đầu kỳ.';
    return `Xu hướng ${delta > 0 ? 'tăng' : 'giảm'} ${formatNumber(Math.abs(delta))}% so với đầu kỳ.`;
  }, [trend]);

  const topBreakdown = useMemo(() => {
    if (breakdown.length === 0) return null;
    return breakdown.reduce((best, item) => ((item.share ?? 0) > (best.share ?? 0) ? item : best), breakdown[0]);
  }, [breakdown]);

  const handleExport = () => {
    const payload = JSON.stringify(
      {
        filters: { geoUnits, orgUnit, timeRange, rangeDays, mode, activeTab },
        data: mockData,
      },
      null,
      2,
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kpi-workspace-${activeTab}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderTabContent = () => (
    <div>
      <div className={styles.kpiGrid}>
        <Row gutter={[16, 16]}>
          {cards.map((card) => {
            const trendColor = card.trend > 0 ? 'green' : card.trend < 0 ? 'red' : 'default';
            const trendPrefix = card.trend > 0 ? '+' : '';
            const statusColor = card.status === 'good' ? 'green' : card.status === 'warning' ? 'orange' : 'red';
            return (
              <Col key={card.key} xs={24} sm={12} lg={6}>
                <Card className={styles.kpiCard} size="small">
                  <div className={styles.kpiHeaderRow}>
                    <span className={styles.kpiTitle}>{card.title}</span>
                    <Space size={6}>
                      <Tag color={statusColor}>{card.statusLabel}</Tag>
                      <Tag color={trendColor}>Δ kỳ trước {trendPrefix}{card.trend}%</Tag>
                    </Space>
                  </div>
                  <Statistic
                    value={card.value}
                    formatter={(value) => formatNumber(Number(value))}
                    suffix={card.unit}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => message.info(`Đi tới danh sách: ${card.ctaHint}`)}
                    >
                      {card.ctaLabel}
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      {showCriteriaLinks && (
        <Card className={styles.criteriaCard} size="small" title="Xem theo tiêu chí">
          <div className={styles.criteriaLinks}>
            {criteriaLinks.map((item) => (
              <Link
                key={item.key}
                className={styles.criteriaLink}
                to={`/kpi/criteria/${item.key}${criteriaQuery ? `?${criteriaQuery}` : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Card>
      )}

      <div className={styles.sectionGrid}>
        <Card className={styles.sectionCard} title="Xu hướng chỉ số điều hành">
          <Text type="secondary">{trendSummary}</Text>
          <div style={{ width: '100%', height: 260, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  formatter={(value: number) => formatNumber(value)}
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: 'var(--border)',
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#1677ff" fill="#1677ff" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={styles.sectionCard} title="Đóng góp theo nhóm trọng điểm">
          <Text type="secondary">
            {topBreakdown
              ? `Đóng góp lớn nhất: ${topBreakdown.label} (${formatNumber(topBreakdown.share ?? 0)}%).`
              : 'Chưa có dữ liệu đóng góp.'}
          </Text>
          <div className={styles.breakdownList} style={{ marginTop: 16 }}>
            {breakdown.map((item) => {
              const percent = item.share ?? 0;
              return (
                <div key={item.label} className={styles.breakdownRow}>
                  <div className={styles.breakdownHeader}>
                    <Space size={6}>
                      <Tag color={item.color}>{item.label}</Tag>
                    </Space>
                    <Text strong>
                      {formatNumber(item.value)}{item.unit ? ` ${item.unit}` : ''}
                    </Text>
                  </div>
                  <Progress percent={Number(percent.toFixed(1))} strokeColor={item.color} showInfo={false} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card title="Điểm nhấn chỉ huy">
        <ul className={styles.insightList}>
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </Card>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <Title level={3} style={{ margin: 0 }}>Chỉ số điều hành QLTT</Title>
          <Text className={styles.subtitle}>
            Trung tâm chỉ số điều hành – theo dõi hiệu suất QLTT theo thời gian thực.
          </Text>
        </div>
        <div className={styles.actionGroup}>
          <Button icon={<ReloadOutlined />} onClick={() => setRefreshKey((prev) => prev + 1)}>
            Làm mới
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      <KpiContextBar
        geoUnits={geoUnits}
        onGeoUnitsChange={setGeoUnits}
        orgUnit={orgUnit}
        onOrgUnitChange={setOrgUnit}
        orgUnitOptions={orgUnitOptions}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        rangeValue={rangeValue}
        onRangeChange={setRangeValue}
        mode={mode}
        onModeChange={setMode}
      />

      <div className={styles.tabsWrapper}>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as KpiTab)}
          destroyInactiveTabPane
          items={tabItems.map((tabItem) => ({
            key: tabItem.key,
            label: tabItem.label,
            children: renderTabContent(),
          }))}
        />
      </div>
    </div>
  );
}
