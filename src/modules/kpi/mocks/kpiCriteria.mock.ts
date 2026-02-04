import type { KpiMode, KpiRange } from './kpiWorkspace.mock';
import { seedCatalogItems, seedCatalogs } from '@/modules/system-admin/mocks/masterData.seed';

export interface CriteriaCatalogItem {
  code: string;
  name: string;
}

export interface KpiCriteriaParams {
  catalogKey: string;
  geoUnits: string[];
  orgUnit: string;
  range: KpiRange;
  mode: KpiMode;
}

export interface KpiCriteriaCard {
  key: string;
  title: string;
  value: number;
  unit: string;
  delta: number;
  status: 'good' | 'warning' | 'danger';
  statusLabel: string;
}

export interface KpiCriteriaTrendPoint {
  label: string;
  value: number;
}

export interface KpiCriteriaRow {
  code: string;
  name: string;
  value: number;
  unit: string;
  share: number;
  delta: number;
  status: 'good' | 'warning' | 'danger';
  statusLabel: string;
}

export interface KpiCriteriaMock {
  catalogName: string;
  cards: KpiCriteriaCard[];
  trend: KpiCriteriaTrendPoint[];
  breakdown: KpiCriteriaRow[];
}

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
  if (range.rangeDays && range.rangeDays > 0) {
    return clamp(range.rangeDays / 30, 0.75, 1.35);
  }
  if (range.timeRange === '7d') return 0.92;
  if (range.timeRange === '90d') return 1.08;
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
  if (range.rangeDays && range.rangeDays <= 14) return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
  if (range.timeRange === '7d') return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
  if (range.timeRange === '90d') return ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
};

const fallbackCatalogs: Record<string, { name: string; items: CriteriaCatalogItem[] }> = {
  violation_form: {
    name: 'Hình thức vi phạm',
    items: [
      { code: 'counterfeit', name: 'Hàng giả' },
      { code: 'food_safety', name: 'VSATTP' },
      { code: 'no_price_tag', name: 'Không niêm yết giá' },
      { code: 'smuggling', name: 'Hàng lậu' },
      { code: 'expired', name: 'Hết hạn sử dụng' },
      { code: 'labeling', name: 'Nhãn hàng hóa' },
      { code: 'origin', name: 'Nguồn gốc xuất xứ' },
      { code: 'ecommerce', name: 'Thương mại điện tử' },
      { code: 'advertising', name: 'Quảng cáo sai' },
    ],
  },
  violation_behavior_group: {
    name: 'Nhóm hành vi vi phạm',
    items: [
      { code: 'thematic_food', name: 'An toàn thực phẩm' },
      { code: 'thematic_price', name: 'Giá cả' },
      { code: 'thematic_origin', name: 'Nguồn gốc' },
      { code: 'thematic_measure', name: 'Đo lường' },
      { code: 'thematic_label', name: 'Nhãn mác' },
      { code: 'thematic_ip', name: 'Sở hữu trí tuệ' },
      { code: 'thematic_ecom', name: 'TMĐT' },
      { code: 'thematic_other', name: 'Khác' },
    ],
  },
  inspection_campaign: {
    name: 'Chuyên đề kiểm tra',
    items: [
      { code: 'tet', name: 'Cao điểm Tết' },
      { code: 'mid_autumn', name: 'Trung thu' },
      { code: 'fuel', name: 'Xăng dầu' },
      { code: 'dairy', name: 'Giá sữa' },
      { code: 'health_food', name: 'TPCN' },
      { code: 'ecom', name: 'TMĐT' },
      { code: 'food_chain', name: 'Chuỗi thực phẩm' },
      { code: 'anti_counterfeit', name: 'Chống hàng giả' },
    ],
  },
};

const resolveCatalog = (catalogKey: string) => {
  const normalizedKey = catalogKey.replace(/_/g, '-');
  const seedCatalog = seedCatalogs.find((catalog) => catalog.key === catalogKey || catalog.key === normalizedKey);
  const seedItems = seedCatalog
    ? seedCatalogItems
        .filter((item) => item.catalogKey === seedCatalog.key)
        .map((item) => ({ code: item.code, name: item.name }))
    : [];

  if (seedCatalog && seedItems.length > 0) {
    return { name: seedCatalog.name, items: seedItems };
  }

  if (fallbackCatalogs[catalogKey]) return fallbackCatalogs[catalogKey];

  const genericItems = Array.from({ length: 10 }).map((_, index) => ({
    code: `CAT_${index + 1}`,
    name: `Mục ${index + 1}`,
  }));

  return {
    name: catalogKey.replace(/_/g, ' '),
    items: genericItems,
  };
};

const getNormalizationBase = (catalogKey: string, context: { stores: number; teams: number; population: number }) => {
  if (catalogKey.includes('violation')) return { base: context.stores, per: 100, unit: 'lượt/100 cơ sở' };
  if (catalogKey.includes('inspection') || catalogKey.includes('campaign')) return { base: context.teams, per: 1, unit: 'lượt/đội' };
  if (catalogKey.includes('source') || catalogKey.includes('tips')) return { base: context.population, per: 10_000, unit: 'lượt/10k dân' };
  return { base: context.stores, per: 100, unit: 'lượt/100 cơ sở' };
};

const getRowStatus = (delta: number, share: number) => {
  if (delta > 18 || share > 28) return { status: 'danger', label: 'Nguy cơ' };
  if (delta > 10 || share > 20) return { status: 'warning', label: 'Cảnh báo' };
  return { status: 'good', label: 'Tốt' };
};

export const buildKpiCriteriaMock = ({ catalogKey, geoUnits, orgUnit, range, mode }: KpiCriteriaParams): KpiCriteriaMock => {
  const { name, items } = resolveCatalog(catalogKey);
  const seedKey = [catalogKey, geoUnits.slice().sort().join('|') || 'ALL', orgUnit, range.timeRange, range.rangeDays || 0].join('|');
  const hash = hashString(seedKey);
  const seed = (hash % 1000) / 1000;
  const jitter = seed - 0.5;

  const geoFactor = getGeoFactor(geoUnits.length);
  const orgFactor = getOrgFactor(orgUnit);
  const rangeFactor = getRangeFactor(range);
  const baseFactor = clamp(geoFactor * orgFactor * rangeFactor * (1 + jitter * 0.05), 0.8, 1.4);

  const stores = clamp(Math.round(2600 * baseFactor), 800, 6000);
  const teams = clamp(Math.round(12 * orgFactor * geoFactor), 4, 60);
  const population = clamp(Math.round(1_200_000 * baseFactor), 200_000, 5_000_000);

  const normalization = getNormalizationBase(catalogKey, { stores, teams, population });

  const rawValues = items.map((item, index) => {
    const weight = 1 + (items.length - index) / items.length * 0.4 + jitter * 0.06;
    const rawValue = clamp(Math.round(40 * baseFactor * weight + (index % 3) * 6), 2, 9999);
    const delta = round((jitter * 12) + (index % 5 - 2) * 1.5, 1);
    return { item, rawValue, delta };
  });

  const totalRaw = rawValues.reduce((sum, row) => sum + row.rawValue, 0);

  const rows = rawValues.map((row) => {
    const share = totalRaw > 0 ? round((row.rawValue / totalRaw) * 100, 1) : 0;
    const status = getRowStatus(row.delta, share);
    const normalizedValue = normalization.base > 0 ? round((row.rawValue / normalization.base) * normalization.per, 2) : 0;

    return {
      code: row.item.code,
      name: row.item.name,
      value: mode === 'normalized' ? normalizedValue : row.rawValue,
      unit: mode === 'normalized' ? normalization.unit : 'lượt',
      share,
      delta: row.delta,
      status: status.status,
      statusLabel: status.label,
    };
  });
  const totalDelta = round(jitter * 10 + 6, 1);
  const topItem = rows.reduce((best, row) => (row.share > best.share ? row : best), rows[0]);
  const riskCount = rows.filter((row) => row.status === 'danger').length;
  const totalDisplay = mode === 'normalized'
    ? normalization.base > 0 ? round((totalRaw / normalization.base) * normalization.per, 2) : 0
    : totalRaw;

  const cards: KpiCriteriaCard[] = [
    {
      key: 'total',
      title: 'Tổng số ghi nhận',
      value: totalDisplay,
      unit: mode === 'normalized' ? normalization.unit : 'lượt',
      delta: totalDelta,
      status: totalDelta > 15 ? 'warning' : 'good',
      statusLabel: totalDelta > 15 ? 'Cảnh báo' : 'Tốt',
    },
    {
      key: 'top_share',
      title: 'Đóng góp lớn nhất',
      value: topItem.share,
      unit: '%',
      delta: topItem.delta,
      status: topItem.share > 28 ? 'danger' : topItem.share > 20 ? 'warning' : 'good',
      statusLabel: topItem.share > 28 ? 'Nguy cơ' : topItem.share > 20 ? 'Cảnh báo' : 'Tốt',
    },
    {
      key: 'risk_items',
      title: 'Mục có cảnh báo',
      value: riskCount,
      unit: 'mục',
      delta: round(riskCount * 1.2 + jitter * 2, 1),
      status: riskCount >= 3 ? 'danger' : riskCount >= 2 ? 'warning' : 'good',
      statusLabel: riskCount >= 3 ? 'Nguy cơ' : riskCount >= 2 ? 'Cảnh báo' : 'Tốt',
    },
    {
      key: 'avg_item',
      title: 'Bình quân/mục',
      value: round(totalDisplay / Math.max(rows.length, 1), 2),
      unit: mode === 'normalized' ? normalization.unit : 'lượt',
      delta: round(jitter * 6, 1),
      status: 'good',
      statusLabel: 'Tốt',
    },
  ];

  const labels = buildTrendLabels(range);
  const trend = labels.map((label, index) => {
    const ratio = 0.85 + index * 0.04 + jitter * 0.05;
    const base = totalRaw * ratio;
    const value = mode === 'normalized'
      ? normalization.base > 0 ? round((base / normalization.base) * normalization.per, 2) : 0
      : clamp(Math.round(base), 1, 99999);

    return { label, value };
  });

  return {
    catalogName: name,
    cards,
    trend,
    breakdown: rows,
  };
};
