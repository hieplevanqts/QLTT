import { useEffect, useMemo, useState } from 'react';
import type { Dayjs } from 'dayjs';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  Card,
  Col,
  message,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import { ArrowLeftOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
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
import type { KpiMode, TimeRangeKey } from '@/modules/kpi/mocks/kpiWorkspace.mock';
import { orgUnitOptions } from '@/modules/kpi/mocks/kpiWorkspace.mock';
import {
  buildKpiCriteriaMock,
  type KpiCriteriaRow,
} from '@/modules/kpi/mocks/kpiCriteria.mock';
import { useIamIdentity } from '@/shared/iam/useIamIdentity';
import styles from './KpiCriteriaDetailPage.module.css';

const { Title, Text } = Typography;

const formatNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value);

const catalogLabelMap: Record<string, string> = {
  violation_form: 'Hình thức vi phạm',
  violation_behavior_group: 'Nhóm hành vi vi phạm',
  inspection_campaign: 'Chuyên đề kiểm tra',
};

const getCatalogLabel = (key: string, fallback?: string) =>
  catalogLabelMap[key] || fallback || key;

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

const buildBackUrl = (search: string) => {
  const params = new URLSearchParams(search);
  const from = params.get('from');
  const keepKeys = ['geoUnits', 'orgUnit', 'range', 'mode', 'tab'];
  const preserved = new URLSearchParams();
  keepKeys.forEach((key) => {
    const value = params.get(key);
    if (value) preserved.set(key, value);
  });
  const query = preserved.toString();
  const base = from || '/kpi';
  if (!query) return base;
  return `${base}${base.includes('?') ? '&' : '?'}${query}`;
};

export default function KpiCriteriaDetailPage() {
  const { catalogKey = '' } = useParams<{ catalogKey: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isSuperAdmin } = useIamIdentity();
  const [geoUnits, setGeoUnits] = useState<string[]>([]);
  const [orgUnit, setOrgUnit] = useState('all');
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('30d');
  const [rangeValue, setRangeValue] = useState<[Dayjs, Dayjs] | null>(null);
  const [mode, setMode] = useState<KpiMode>('absolute');
  const [refreshKey, setRefreshKey] = useState(0);
  const searchParamsKey = searchParams.toString();

  useEffect(() => {
    const params = new URLSearchParams(searchParamsKey);
    const nextGeoUnits = parseGeoUnits(params.get('geoUnits'));
    const nextOrgUnit = params.get('orgUnit') || 'all';
    const nextRange = parseTimeRange(params.get('range'));
    const nextMode = parseMode(params.get('mode'));

    setGeoUnits(nextGeoUnits);
    setOrgUnit(nextOrgUnit);
    setTimeRange(nextRange);
    setMode(nextMode);
    setRangeValue(null);
  }, [searchParamsKey]);

  const rangeDays = useMemo(() => {
    if (!rangeValue) return null;
    return rangeValue[1].diff(rangeValue[0], 'day') + 1;
  }, [rangeValue]);

  const data = useMemo(
    () =>
      buildKpiCriteriaMock({
        catalogKey,
        geoUnits,
        orgUnit,
        range: { timeRange, rangeDays },
        mode,
      }),
    [catalogKey, geoUnits, orgUnit, timeRange, rangeDays, mode, refreshKey],
  );

  const catalogLabel = useMemo(
    () => getCatalogLabel(catalogKey, data.catalogName),
    [catalogKey, data.catalogName],
  );

  const backUrl = useMemo(() => buildBackUrl(searchParamsKey), [searchParamsKey]);

  const trendSummary = useMemo(() => {
    if (data.trend.length < 2) return 'Xu hướng đang ổn định so với đầu kỳ.';
    const first = data.trend[0].value;
    const last = data.trend[data.trend.length - 1].value;
    if (first === 0) return 'Xu hướng đang ổn định so với đầu kỳ.';
    const delta = ((last - first) / first) * 100;
    if (Math.abs(delta) < 1) return 'Xu hướng đang ổn định so với đầu kỳ.';
    return `Xu hướng ${delta > 0 ? 'tăng' : 'giảm'} ${formatNumber(Math.abs(delta))}% so với đầu kỳ.`;
  }, [data.trend]);

  const topRow = useMemo(() => {
    if (data.breakdown.length === 0) return null;
    return data.breakdown.reduce((best, row) => (row.share > best.share ? row : best), data.breakdown[0]);
  }, [data.breakdown]);

  const columns = useMemo(
    () => [
      {
        title: 'Mã',
        dataIndex: 'code',
        key: 'code',
        width: 160,
      },
      {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Số lượng',
        dataIndex: 'value',
        key: 'value',
        align: 'right' as const,
        render: (_: number, row: KpiCriteriaRow) => (
          <span>{formatNumber(row.value)} {row.unit}</span>
        ),
      },
      {
        title: 'Tỷ trọng %',
        dataIndex: 'share',
        key: 'share',
        align: 'right' as const,
        render: (value: number) => `${formatNumber(value)}%`,
      },
      {
        title: 'Δ kỳ trước',
        dataIndex: 'delta',
        key: 'delta',
        align: 'right' as const,
        render: (value: number) => {
          const color = value > 0 ? 'green' : value < 0 ? 'red' : 'default';
          const prefix = value > 0 ? '+' : '';
          return <Tag color={color}>{prefix}{value}%</Tag>;
        },
      },
      {
        title: 'Đánh giá',
        dataIndex: 'status',
        key: 'status',
        render: (_: string, row: KpiCriteriaRow) => {
          const color = row.status === 'good' ? 'green' : row.status === 'warning' ? 'orange' : 'red';
          return <Tag color={color}>{row.statusLabel}</Tag>;
        },
      },
      {
        title: 'Thao tác',
        key: 'action',
        render: (_: unknown, row: KpiCriteriaRow) => (
          <Button type="link" size="small" onClick={() => message.info(`Đi tới danh sách: ${row.name}`)}>
            Xem danh sách
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <Breadcrumb
            className={styles.breadcrumb}
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: 'Báo cáo & KPI' },
              { title: <Link to="/kpi">KPI QLTT</Link> },
              { title: 'Chi tiết theo tiêu chí' },
              { title: catalogLabel },
            ]}
          />
          <Title level={3} style={{ margin: 0 }}>Chỉ số điều hành theo {catalogLabel}</Title>
          <Text className={styles.subtitle}>Theo dõi chi tiết theo tiêu chí danh mục để ra quyết định.</Text>
        </div>
        <div className={styles.actionGroup}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(backUrl)}>
            Quay lại KPI
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => setRefreshKey((prev) => prev + 1)}>
            Làm mới
          </Button>
          {isSuperAdmin && catalogKey && (
            <Button
              icon={<SettingOutlined />}
              onClick={() =>
                navigate('/system-admin/master-data/dms-catalogs?catalogId=f2f5206a-afe3-438a-b6f4-0a21f063f558')
              }
            >
              Quản trị danh mục
            </Button>
          )}
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

      <div className={styles.kpiGrid}>
        <Row gutter={[16, 16]}>
          {data.cards.map((card) => {
            const statusColor = card.status === 'good' ? 'green' : card.status === 'warning' ? 'orange' : 'red';
            const deltaColor = card.delta > 0 ? 'green' : card.delta < 0 ? 'red' : 'default';
            const deltaPrefix = card.delta > 0 ? '+' : '';
            return (
              <Col key={card.key} xs={24} sm={12} lg={6}>
                <Card className={styles.kpiCard} size="small">
                  <div className={styles.kpiHeaderRow}>
                    <span className={styles.kpiTitle}>{card.title}</span>
                    <Space size={6}>
                      <Tag color={statusColor}>{card.statusLabel}</Tag>
                      <Tag color={deltaColor}>Δ kỳ trước {deltaPrefix}{card.delta}%</Tag>
                    </Space>
                  </div>
                  <Statistic
                    value={card.value}
                    formatter={(value) => formatNumber(Number(value))}
                    suffix={card.unit}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Button type="link" size="small" onClick={() => message.info(`Đi tới danh sách: ${card.title}`)}>
                      Xem danh sách
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      <div className={styles.sectionGrid}>
        <Card className={styles.sectionCard} title="Xu hướng theo kỳ">
          <Text type="secondary">{trendSummary}</Text>
          <div style={{ width: '100%', height: 260, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  formatter={(value: number) => formatNumber(value)}
                  contentStyle={{ borderRadius: 8, borderColor: 'var(--border)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#1677ff" fill="#1677ff" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={styles.sectionCard} title="Đóng góp theo danh mục">
          <Text type="secondary">
            {topRow ? `Mục đóng góp lớn nhất: ${topRow.name} (${formatNumber(topRow.share)}%).` : 'Chưa có dữ liệu.'}
          </Text>
          <div style={{ marginTop: 16 }}>
            <Table
              dataSource={data.breakdown}
              columns={columns}
              rowKey="code"
              pagination={false}
              size="small"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
