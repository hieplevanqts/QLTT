export type KpiMode = 'absolute' | 'normalized';
export type KpiTab = 'overview' | 'ops' | 'tips' | 'risk' | 'market';
export type TimeRangeKey = '7d' | '30d' | '90d';

export interface KpiRange {
  timeRange: TimeRangeKey;
  rangeDays?: number | null;
}

export interface KpiWorkspaceParams {
  geoUnits: string[];
  orgUnit: string;
  range: KpiRange;
  mode: KpiMode;
  tab: KpiTab;
}

export interface KpiCardData {
  key: string;
  title: string;
  value: number;
  unit: string;
  trend: number;
  status: 'good' | 'warning' | 'danger';
  statusLabel: string;
  ctaLabel: string;
  ctaHint: string;
}

export interface KpiTrendPoint {
  label: string;
  value: number;
}

export interface KpiBreakdownItem {
  label: string;
  value: number;
  color: string;
  unit?: string;
  share?: number;
}

export interface KpiWorkspaceData {
  cards: KpiCardData[];
  trend: KpiTrendPoint[];
  breakdown: KpiBreakdownItem[];
  insights: string[];
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

const getRangeFactor = (range: KpiRange) => {
  const { timeRange, rangeDays } = range;
  if (rangeDays && rangeDays > 0) {
    return clamp(rangeDays / 30, 0.75, 1.35);
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

const buildTrendLabels = (range: KpiRange) => {
  const { timeRange, rangeDays } = range;
  if (rangeDays && rangeDays <= 14) return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
  if (timeRange === '7d') return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
  if (timeRange === '90d') return ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
};

const buildInsights = (cards: KpiCardData[], breakdown: KpiBreakdownItem[], trend: KpiTrendPoint[]) => {
  const insights: string[] = [];
  const dangerCard = cards.find((card) => card.status === 'danger');
  const warningCard = cards.find((card) => card.status === 'warning');

  if (dangerCard) {
    insights.push(`Ưu tiên xử lý: ${dangerCard.title} đang ở mức Nguy cơ.`);
  } else if (warningCard) {
    insights.push(`Cần theo dõi: ${warningCard.title} đang ở mức Cảnh báo.`);
  }

  const first = trend[0]?.value ?? 0;
  const last = trend[trend.length - 1]?.value ?? 0;
  if (first > 0) {
    const delta = round(((last - first) / first) * 100, 1);
    if (Math.abs(delta) < 1) {
      insights.push('Xu hướng đang ổn định so với đầu kỳ.');
    } else {
      insights.push(`Xu hướng ${delta > 0 ? 'tăng' : 'giảm'} ${Math.abs(delta)}% so với đầu kỳ.`);
    }
  }

  const top = breakdown.reduce((best, item) => ((item.share ?? 0) > (best.share ?? 0) ? item : best), breakdown[0]);
  if (top) {
    insights.push(`Đóng góp lớn nhất: ${top.label} (${round(top.share ?? 0, 1)}%).`);
  }

  return insights;
};

const getStatus = (key: string, value: number, trend: number, context: { backlogRate?: number; slaRate?: number }) => {
  if (key === 'sla_rate' || key === 'tips_sla') {
    if (value < 85) return { status: 'danger', label: 'Nguy cơ' };
    if (value < 92) return { status: 'warning', label: 'Cảnh báo' };
    return { status: 'good', label: 'Tốt' };
  }
  if (key === 'overdue_rate') {
    if (value > 12) return { status: 'danger', label: 'Nguy cơ' };
    if (value > 8) return { status: 'warning', label: 'Cảnh báo' };
    return { status: 'good', label: 'Tốt' };
  }
  if (key === 'backlog' && context.backlogRate !== undefined) {
    if (context.backlogRate > 12) return { status: 'danger', label: 'Nguy cơ' };
    if (context.backlogRate > 8) return { status: 'warning', label: 'Cảnh báo' };
    return { status: 'good', label: 'Tốt' };
  }
  if (key === 'violations' || key === 'risk_hotspots') {
    if (trend > 15) return { status: 'warning', label: 'Cảnh báo' };
  }
  if (context.slaRate !== undefined && context.slaRate < 85) {
    return { status: 'danger', label: 'Nguy cơ' };
  }
  return { status: 'good', label: 'Tốt' };
};

const applyCount = (value: number, factor: number, jitter: number) =>
  clamp(Math.round(value * factor * (1 + jitter * 0.06)), 0, Number.POSITIVE_INFINITY);

const applyAmount = (value: number, factor: number, jitter: number) =>
  clamp(round(value * factor * (0.95 + jitter * 0.08), 1), 0, Number.POSITIVE_INFINITY);

const applyRate = (value: number, factor: number, jitter: number) =>
  clamp(round(value + (factor - 1) * 12 + jitter * 6, 1), 0, 100);

const applyDuration = (value: number, factor: number, jitter: number) =>
  clamp(round(value * (1 + jitter * 0.08) * (factor >= 1 ? 0.98 : 1.02), 1), 0.3, 30);

const normalizePer = (value: number, base: number, per: number) =>
  base > 0 ? round((value / base) * per, 2) : 0;

export const buildKpiWorkspaceMock = ({ geoUnits, orgUnit, range, mode, tab }: KpiWorkspaceParams): KpiWorkspaceData => {
  const seedKey = [geoUnits.slice().sort().join('|') || 'ALL', orgUnit, range.timeRange, range.rangeDays || 0, tab].join('|');
  const hash = hashString(seedKey);
  const seed = (hash % 1000) / 1000;
  const jitter = seed - 0.5;

  const geoFactor = getGeoFactor(geoUnits.length);
  const orgFactor = getOrgFactor(orgUnit);
  const rangeFactor = getRangeFactor(range);
  const baseFactor = clamp(geoFactor * orgFactor * rangeFactor * (1 + jitter * 0.05), 0.8, 1.4);

  const buildGeoBreakdown = (scale = 1) => [
    { label: 'Hà Nội', value: applyCount(320 * scale, baseFactor, jitter), color: '#695cfb' },
    { label: 'TP. Hồ Chí Minh', value: applyCount(420 * scale, baseFactor, jitter), color: '#f7a23b' },
    { label: 'Đà Nẵng', value: applyCount(180 * scale, baseFactor, jitter), color: '#0fc87a' },
    { label: 'Khác', value: applyCount(260 * scale, baseFactor, jitter), color: '#4ecdc4' },
  ];

  const population = applyCount(1_200_000, baseFactor * 0.9, jitter);
  const stores = applyCount(2_700, baseFactor, jitter);
  const areaKm2 = clamp(round(520 * geoFactor * (1 + jitter * 0.05), 1), 120, 1500);
  const teams = clamp(Math.round(12 * orgFactor * geoFactor), 4, 60);

  const violations = applyCount(1_234, baseFactor, jitter);
  const tasksOpen = applyCount(180, baseFactor, jitter);
  const hotspots = applyCount(42, baseFactor * 0.9, jitter);
  const overdueTasks = applyCount(26, baseFactor * 0.8, jitter);

  const tasksDone = applyCount(890, baseFactor * 1.02, jitter);
  const slaRate = applyRate(91, baseFactor, jitter);
  const avgProcessDays = applyDuration(3.6, baseFactor, jitter);
  const backlog = applyCount(64, baseFactor * 0.9, jitter);
  const overdueRate = clamp(round((overdueTasks / Math.max(tasksOpen + tasksDone, 1)) * 100, 1), 0, 100);

  const tipsTotal = applyCount(688, baseFactor * 1.05, jitter);
  const tipsAccuracy = applyRate(84, baseFactor, jitter);
  const verifyTime = applyDuration(2.3, baseFactor, jitter);
  const tipsSla = applyRate(81, baseFactor * 0.98, jitter);

  const highRisk = applyCount(48, baseFactor, jitter);
  const riskScore = applyRate(72, baseFactor, jitter);
  const riskHotspots = applyCount(19, baseFactor * 0.95, jitter);
  const reoffendRate = applyRate(28, baseFactor * 0.9, jitter);

  const revenue = applyAmount(1280, baseFactor, jitter);
  const density = clamp(round(stores / Math.max(areaKm2, 1), 2), 0, 20);
  const compliance = applyRate(86, baseFactor, jitter);

  const toNormalized = (key: string, value: number) => {
    if (key === 'violations') return { value: normalizePer(value, stores, 100), unit: 'vụ/100 cơ sở' };
    if (key === 'tasks_open') return { value: normalizePer(value, teams, 1), unit: 'nv/đội' };
    if (key === 'hotspots') return { value: normalizePer(value, areaKm2, 100), unit: 'điểm/100 km²' };
    if (key === 'overdue_rate') return { value, unit: '%' };
    if (key === 'tasks_done') return { value: normalizePer(value, teams, 1), unit: 'nv/đội' };
    if (key === 'sla_rate') return { value, unit: '%' };
    if (key === 'avg_time') return { value, unit: 'ngày' };
    if (key === 'backlog') return { value: normalizePer(value, stores, 100), unit: 'hs/100 cơ sở' };
    if (key === 'tips_total') return { value: normalizePer(value, population, 10_000), unit: 'tin/10k dân' };
    if (key === 'tips_accuracy') return { value, unit: '%' };
    if (key === 'verify_time') return { value, unit: 'giờ' };
    if (key === 'tips_sla') return { value, unit: '%' };
  if (key === 'high_risk') return { value: normalizePer(value, stores, 100), unit: 'cửa hàng/100 cơ sở' };
    if (key === 'risk_score') return { value, unit: 'điểm' };
    if (key === 'risk_hotspots') return { value: normalizePer(value, areaKm2, 100), unit: 'điểm/100 km²' };
    if (key === 'reoffend_rate') return { value, unit: '%' };
    if (key === 'stores') return { value, unit: 'cơ sở' };
    if (key === 'revenue') return { value, unit: 'tỷ' };
    if (key === 'density') return { value, unit: 'cơ sở/km²' };
    if (key === 'compliance') return { value, unit: '%' };
    return { value, unit: '' };
  };

  const tabMap: Record<KpiTab, { cards: KpiCardData[]; breakdown: KpiBreakdownItem[]; baseForTrend: number }> = {
    overview: {
      cards: [
        { key: 'violations', title: 'Tổng số vụ vi phạm', value: violations, unit: 'vụ', trend: round(12.5 + jitter * 4, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách vi phạm' },
        { key: 'tasks_open', title: 'Nhiệm vụ đang xử lý', value: tasksOpen, unit: 'nhiệm vụ', trend: round(-5.2 + jitter * 3, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách nhiệm vụ' },
        { key: 'hotspots', title: 'Điểm nóng ATTP', value: hotspots, unit: 'điểm', trend: round(8.3 + jitter * 3, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách điểm nóng' },
        { key: 'overdue_rate', title: 'Tỷ lệ quá hạn', value: overdueRate, unit: '%', trend: round(-15.4 + jitter * 2, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách nhiệm vụ quá hạn' },
      ],
      breakdown: buildGeoBreakdown(1),
      baseForTrend: violations,
    },
    ops: {
      cards: [
        { key: 'tasks_done', title: 'Nhiệm vụ hoàn thành', value: tasksDone, unit: 'nhiệm vụ', trend: round(6.8 + jitter * 2, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách nhiệm vụ' },
        { key: 'sla_rate', title: 'Tỷ lệ đúng hạn SLA', value: slaRate, unit: '%', trend: round(2.4 + jitter * 2, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách SLA' },
        { key: 'avg_time', title: 'Thời gian xử lý TB', value: avgProcessDays, unit: 'ngày', trend: round(-4.1 + jitter * 1.5, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách xử lý' },
        { key: 'backlog', title: 'Hồ sơ tồn', value: backlog, unit: 'hồ sơ', trend: round(-7.9 + jitter * 2, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách hồ sơ' },
      ],
      breakdown: buildGeoBreakdown(0.9),
      baseForTrend: tasksDone,
    },
    tips: {
      cards: [
        { key: 'tips_total', title: 'Tổng nguồn tin', value: tipsTotal, unit: 'nguồn tin', trend: round(5.1 + jitter * 2, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách nguồn tin' },
        { key: 'tips_accuracy', title: 'Tỷ lệ nguồn tin đúng', value: tipsAccuracy, unit: '%', trend: round(1.8 + jitter * 1.2, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách nguồn tin' },
        { key: 'verify_time', title: 'TG xác minh TB', value: verifyTime, unit: 'giờ', trend: round(-6.5 + jitter * 1.5, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách xác minh' },
        { key: 'tips_sla', title: 'SLA phản hồi', value: tipsSla, unit: '%', trend: round(-2.2 + jitter * 1.2, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách SLA phản hồi' },
      ],
      breakdown: buildGeoBreakdown(0.75),
      baseForTrend: tipsTotal,
    },
    risk: {
      cards: [
        { key: 'high_risk', title: 'Cửa hàng rủi ro cao', value: highRisk, unit: 'cửa hàng', trend: round(9.6 + jitter * 2, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách cửa hàng rủi ro' },
        { key: 'risk_score', title: 'Điểm rủi ro TB', value: riskScore, unit: 'điểm', trend: round(1.3 + jitter * 1.5, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách điểm rủi ro' },
        { key: 'risk_hotspots', title: 'Điểm nóng vi phạm', value: riskHotspots, unit: 'điểm', trend: round(7.5 + jitter * 2, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách điểm nóng' },
        { key: 'reoffend_rate', title: 'Tỷ lệ tái phạm', value: reoffendRate, unit: '%', trend: round(-3.4 + jitter * 1.5, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách tái phạm' },
      ],
      breakdown: buildGeoBreakdown(0.8),
      baseForTrend: highRisk,
    },
    market: {
      cards: [
        { key: 'stores', title: 'Tổng số cơ sở', value: stores, unit: 'cơ sở', trend: round(3.1 + jitter * 1.5, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách cơ sở' },
        { key: 'revenue', title: 'Doanh thu ước tính', value: revenue, unit: 'tỷ', trend: round(4.6 + jitter * 1.8, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách doanh thu' },
        { key: 'density', title: 'Mật độ cơ sở', value: density, unit: 'cơ sở/km²', trend: round(1.1 + jitter * 1.2, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách mật độ' },
        { key: 'compliance', title: 'Tỷ lệ tuân thủ', value: compliance, unit: '%', trend: round(2.8 + jitter * 1.2, 1), status: 'good', statusLabel: 'Tốt', ctaLabel: 'Xem danh sách', ctaHint: 'Danh sách tuân thủ' },
      ],
      breakdown: buildGeoBreakdown(1.15),
      baseForTrend: stores,
    },
  };

  const selected = tabMap[tab];

  const cards = selected.cards.map((card) => {
    const normalized = mode === 'normalized'
      ? toNormalized(card.key, card.value)
      : { value: card.value, unit: card.unit };

    const statusBase = getStatus(card.key, normalized.value, card.trend, {
      backlogRate: overdueRate,
      slaRate,
    });

    return {
      ...card,
      value: normalized.value,
      unit: normalized.unit,
      status: statusBase.status,
      statusLabel: statusBase.label,
    };
  });

  const breakdownTotal = selected.breakdown.reduce((sum, item) => sum + item.value, 0) || 1;
  const breakdown = selected.breakdown.map((item) => {
    const share = round((item.value / breakdownTotal) * 100, 1);
    return {
      ...item,
      value: mode === 'normalized' ? share : item.value,
      unit: mode === 'normalized' ? '%' : undefined,
      share,
    };
  });

  const labels = buildTrendLabels(range);
  const trend = labels.map((label, index) => {
    const ratio = 0.85 + index * 0.03 + jitter * 0.04;
    const baseValue = selected.baseForTrend * ratio;
    const value = mode === 'normalized'
      ? normalizePer(baseValue, stores, 100)
      : applyCount(baseValue, baseFactor, jitter);

    return { label, value };
  });

  const insights = buildInsights(cards, breakdown, trend);

  return {
    cards,
    trend,
    breakdown,
    insights,
  };
};
