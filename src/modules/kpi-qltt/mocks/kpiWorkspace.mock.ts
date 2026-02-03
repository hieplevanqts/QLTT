export type TimeRangeKey = '7d' | '30d' | '90d';
export type KpiMode = 'absolute' | 'normalized';
export type KpiTabKey = 'command' | 'ops' | 'feedback' | 'risk' | 'market';

export interface KpiWorkspaceParams {
  geoUnits: string[];
  orgUnit: string;
  timeRange: TimeRangeKey;
  rangeDays?: number | null;
  mode: KpiMode;
  activeTab: KpiTabKey;
  refreshKey?: number;
}

export interface KpiCardData {
  key: string;
  title: string;
  value: number;
  unit: string;
  trend: number;
  trendDirection: 'up' | 'down' | 'flat';
  max: number;
}

export interface KpiTrendPoint {
  label: string;
  value: number;
}

export interface KpiBreakdownItem {
  label: string;
  value: number;
  color: string;
}

export interface KpiWorkspaceTabData {
  cards: KpiCardData[];
  trend: KpiTrendPoint[];
  breakdown: KpiBreakdownItem[];
  insights: string[];
}

export interface KpiWorkspaceMock {
  tab: KpiWorkspaceTabData;
}

export const orgUnitOptions = [
  { value: 'all', label: 'Tất cả đơn vị' },
  { value: 'cuc', label: 'Cục QLTT' },
  { value: 'chi-cuc', label: 'Chi cục QLTT' },
  { value: 'doi', label: 'Đội QLTT' },
  { value: 'lien-nganh', label: 'Tổ liên ngành' },
];

const clamp = (value: number, min = 0, max = Number.POSITIVE_INFINITY) =>
  Math.min(max, Math.max(min, value));

const round = (value: number, digits = 0) => {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
};

const hashString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getRangeFactor = (timeRange: TimeRangeKey, rangeDays?: number | null) => {
  if (rangeDays && rangeDays > 0) {
    const customFactor = clamp(rangeDays / 30, 0.75, 1.35);
    return customFactor;
  }
  if (timeRange === '7d') return 0.92;
  if (timeRange === '90d') return 1.08;
  return 1;
};

const getGeoFactor = (count: number) => {
  if (count <= 0) return 1;
  if (count === 1) return 1.05;
  if (count <= 3) return 1.12;
  if (count <= 6) return 1.2;
  return 1.28;
};

const getOrgFactor = (orgUnit: string) => {
  switch (orgUnit) {
    case 'cuc':
      return 1.12;
    case 'chi-cuc':
      return 1.05;
    case 'doi':
      return 0.96;
    case 'lien-nganh':
      return 1.08;
    default:
      return 1;
  }
};

const buildTrendLabels = (timeRange: TimeRangeKey, rangeDays?: number | null) => {
  if (rangeDays && rangeDays <= 14) {
    return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
  }
  if (timeRange === '7d') return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
  if (timeRange === '90d') return ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
};

const tabDefinitions: Record<KpiTabKey, Omit<KpiWorkspaceTabData, 'trend'>> = {
  command: {
    cards: [
      { key: 'violations', title: 'Tổng số vụ vi phạm', value: 1234, unit: 'vụ', trend: 12.5, trendDirection: 'up', max: 2000 },
      { key: 'tasks', title: 'Nhiệm vụ đang xử lý', value: 156, unit: 'nhiệm vụ', trend: -5.2, trendDirection: 'down', max: 300 },
      { key: 'hotspots', title: 'Điểm nóng ATTP', value: 42, unit: 'điểm', trend: 8.3, trendDirection: 'up', max: 80 },
      { key: 'overdue', title: 'Nhiệm vụ quá hạn', value: 23, unit: 'nhiệm vụ', trend: -15.4, trendDirection: 'down', max: 60 },
    ],
    breakdown: [
      { label: 'An toàn thực phẩm', value: 420, color: '#f94144' },
      { label: 'Giá cả', value: 290, color: '#f7a23b' },
      { label: 'Hàng giả', value: 260, color: '#695cfb' },
      { label: 'Khác', value: 180, color: '#0fc87a' },
    ],
    insights: [
      'Ưu tiên xử lý các điểm nóng ATTP tăng trong 7 ngày gần nhất.',
      'Tỷ lệ nhiệm vụ quá hạn đã giảm nhưng vẫn cần giám sát theo ca.',
      'Tăng cường phối hợp liên ngành tại các địa bàn trọng điểm.',
    ],
  },
  ops: {
    cards: [
      { key: 'completed', title: 'Nhiệm vụ hoàn thành', value: 890, unit: 'nhiệm vụ', trend: 6.8, trendDirection: 'up', max: 1200 },
      { key: 'sla', title: 'Tỷ lệ đúng hạn SLA', value: 91, unit: '%', trend: 2.4, trendDirection: 'up', max: 100 },
      { key: 'avg_time', title: 'Thời gian xử lý TB', value: 3.6, unit: 'ngày', trend: -4.1, trendDirection: 'down', max: 7 },
      { key: 'backlog', title: 'Hồ sơ tồn', value: 64, unit: 'hồ sơ', trend: -7.9, trendDirection: 'down', max: 150 },
    ],
    breakdown: [
      { label: 'Mới tiếp nhận', value: 140, color: '#695cfb' },
      { label: 'Đang xử lý', value: 210, color: '#f7a23b' },
      { label: 'Đã hoàn thành', value: 360, color: '#0fc87a' },
      { label: 'Quá hạn', value: 90, color: '#f94144' },
    ],
    insights: [
      'Giữ SLA đúng hạn trên 90% trong toàn bộ cụm đội.',
      'Giảm backlog tại nhóm hồ sơ xử lý trên 7 ngày.',
      'Phân bổ lại nhiệm vụ cho các đội có tải thấp.',
    ],
  },
  feedback: {
    cards: [
      { key: 'feedback_total', title: 'Tổng nguồn tin', value: 688, unit: 'nguồn tin', trend: 5.1, trendDirection: 'up', max: 1000 },
      { key: 'feedback_rate', title: 'Tỷ lệ đúng', value: 84, unit: '%', trend: 1.8, trendDirection: 'up', max: 100 },
      { key: 'verify_time', title: 'TG xác minh TB', value: 2.3, unit: 'giờ', trend: -6.5, trendDirection: 'down', max: 6 },
      { key: 'sla_feedback', title: 'SLA phản hồi', value: 81, unit: '%', trend: -2.2, trendDirection: 'down', max: 100 },
    ],
    breakdown: [
      { label: 'Hotline', value: 245, color: '#695cfb' },
      { label: 'App di động', value: 189, color: '#0fc87a' },
      { label: 'Website', value: 156, color: '#f7a23b' },
      { label: 'Trực tiếp', value: 98, color: '#4ecdc4' },
    ],
    insights: [
      'Ưu tiên xác minh nhanh các nguồn tin từ App di động.',
      'Giảm thời gian phản hồi cho kênh Hotline trong giờ cao điểm.',
      'Tăng tỷ lệ đúng bằng cách chuẩn hóa mẫu phân loại.',
    ],
  },
  risk: {
    cards: [
      { key: 'high_risk', title: 'Merchant rủi ro cao', value: 48, unit: 'merchant', trend: 9.6, trendDirection: 'up', max: 120 },
      { key: 'risk_score', title: 'Điểm rủi ro TB', value: 72, unit: 'điểm', trend: 1.3, trendDirection: 'up', max: 100 },
      { key: 'hotspots', title: 'Điểm nóng vi phạm', value: 19, unit: 'điểm', trend: 7.5, trendDirection: 'up', max: 40 },
      { key: 'reoffend', title: 'Tỷ lệ tái phạm', value: 28, unit: '%', trend: -3.4, trendDirection: 'down', max: 60 },
    ],
    breakdown: [
      { label: 'Rủi ro cao', value: 48, color: '#f94144' },
      { label: 'Rủi ro trung bình', value: 92, color: '#f7a23b' },
      { label: 'Rủi ro thấp', value: 130, color: '#0fc87a' },
      { label: 'Theo dõi', value: 64, color: '#695cfb' },
    ],
    insights: [
      'Tập trung kiểm tra các điểm nóng tăng đột biến >10%.',
      'Cập nhật hồ sơ tái phạm theo chu kỳ 2 tuần.',
      'Kết hợp dữ liệu phản ánh để tăng độ chính xác đánh giá rủi ro.',
    ],
  },
  market: {
    cards: [
      { key: 'stores', title: 'Tổng số cơ sở', value: 2699, unit: 'cơ sở', trend: 3.1, trendDirection: 'up', max: 4000 },
      { key: 'revenue', title: 'Doanh thu ước tính', value: 1280, unit: 'tỷ', trend: 4.6, trendDirection: 'up', max: 2000 },
      { key: 'density', title: 'Mật độ cơ sở', value: 3.4, unit: '/1000 dân', trend: 1.1, trendDirection: 'up', max: 6 },
      { key: 'compliance', title: 'Tỷ lệ tuân thủ', value: 86, unit: '%', trend: 2.8, trendDirection: 'up', max: 100 },
    ],
    breakdown: [
      { label: 'Thực phẩm & đồ uống', value: 740, color: '#f7a23b' },
      { label: 'Bán lẻ', value: 620, color: '#695cfb' },
      { label: 'Y tế', value: 410, color: '#0fc87a' },
      { label: 'Khác', value: 420, color: '#4ecdc4' },
    ],
    insights: [
      'Duy trì mật độ kiểm tra tại nhóm ngành thực phẩm.',
      'Giám sát tăng trưởng đột biến ở khu vực trung tâm.',
      'Đánh giá lại các cơ sở có tỷ lệ tuân thủ thấp.',
    ],
  },
};

const applyValue = (value: number, factor: number, jitter: number, kind: 'count' | 'rate' | 'amount' | 'duration') => {
  if (kind === 'rate') {
    const next = value + (factor - 1) * 12 + jitter * 6;
    return clamp(round(next, 1), 0, 100);
  }
  if (kind === 'duration') {
    const next = value * (1 + jitter * 0.08) * (factor >= 1 ? 0.98 : 1.02);
    return clamp(round(next, 1), 0.3, 30);
  }
  if (kind === 'amount') {
    const next = value * factor * (0.95 + jitter * 0.08);
    return clamp(round(next, 1), 0, Number.POSITIVE_INFINITY);
  }
  const next = value * factor * (1 + jitter * 0.06);
  return clamp(Math.round(next), 0, Number.POSITIVE_INFINITY);
};

const guessKind = (unit: string) => {
  if (unit === '%' || unit.includes('%')) return 'rate';
  if (unit.includes('giờ') || unit.includes('ngày')) return 'duration';
  if (unit === 'tỷ') return 'amount';
  return 'count';
};

export const buildKpiWorkspaceMock = (params: KpiWorkspaceParams): KpiWorkspaceMock => {
  const { geoUnits, orgUnit, timeRange, rangeDays, mode, activeTab, refreshKey = 0 } = params;
  const seedKey = [geoUnits.slice().sort().join('|') || 'ALL', orgUnit, timeRange, rangeDays || 0, mode, activeTab, refreshKey].join('|');
  const hash = hashString(seedKey);
  const seed = (hash % 1000) / 1000;
  const jitter = seed - 0.5;

  const geoFactor = getGeoFactor(geoUnits.length);
  const orgFactor = getOrgFactor(orgUnit);
  const rangeFactor = getRangeFactor(timeRange, rangeDays);
  const baseFactor = clamp(geoFactor * orgFactor * rangeFactor * (1 + jitter * 0.05), 0.8, 1.4);

  const definition = tabDefinitions[activeTab];

  const cards = definition.cards.map((card) => {
    const kind = guessKind(card.unit);
    const scaled = applyValue(card.value, baseFactor, jitter, kind);
    const normalizedValue = clamp(Math.round((scaled / card.max) * 100), 0, 100);

    return {
      ...card,
      value: mode === 'normalized' ? normalizedValue : scaled,
      unit: mode === 'normalized' ? 'điểm' : card.unit,
      trend: round(card.trend + jitter * 4, 1),
    };
  });

  const breakdownScaled = definition.breakdown.map((item) => {
    const value = applyValue(item.value, baseFactor, jitter, 'count');
    return {
      ...item,
      value,
    };
  });

  const breakdownTotal = breakdownScaled.reduce((sum, item) => sum + item.value, 0) || 1;
  const breakdown = breakdownScaled.map((item) => ({
    ...item,
    value: mode === 'normalized' ? clamp(Math.round((item.value / breakdownTotal) * 100), 0, 100) : item.value,
  }));

  const labels = buildTrendLabels(timeRange, rangeDays);
  const baseSeries = labels.map((label, index) => {
    const ratio = 0.85 + index * 0.03 + jitter * 0.04;
    const baseValue = (definition.cards[0]?.value || 100) * ratio;
    return { label, value: applyValue(baseValue, baseFactor, jitter, guessKind(definition.cards[0]?.unit || '')) };
  });

  let trend = baseSeries;
  if (mode === 'normalized') {
    const maxTrend = Math.max(...baseSeries.map((item) => item.value)) || 1;
    trend = baseSeries.map((item) => ({
      ...item,
      value: clamp(Math.round((item.value / maxTrend) * 100), 0, 100),
    }));
  }

  return {
    tab: {
      cards,
      trend,
      breakdown,
      insights: definition.insights,
    },
  };
};
