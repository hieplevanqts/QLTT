import { geoValueLabelMap } from './vnGeoUnits.mock';

export type RangeKey = '7d' | '30d' | '90d';

export interface GeoMockContext {
  factor: number;
  seed: number;
  range: RangeKey;
  geoUnits: string[];
}

export type GeoValueKind = 'count' | 'amount' | 'rate' | 'duration';

interface ApplyOptions {
  decimals?: number;
  min?: number;
  max?: number;
}

interface SeriesScaleConfig extends ApplyOptions {
  key: string;
  kind: GeoValueKind;
}

const clamp = (value: number, min = 0, max = Number.POSITIVE_INFINITY) =>
  Math.min(max, Math.max(min, value));

const roundTo = (value: number, decimals = 1) => {
  const factor = Math.pow(10, decimals);
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

export const buildKpiDashboardMock = ({
  geoUnits,
  range,
}: {
  geoUnits: string[];
  range: RangeKey;
}): GeoMockContext => {
  const normalized = geoUnits.length > 0 ? geoUnits.slice().sort().join('|') : 'ALL';
  const hash = hashString(normalized);
  const seed = (hash % 1000) / 1000;
  const count = geoUnits.length;

  const countFactor = count === 0 ? 1 : count === 1 ? 1.05 : count <= 3 ? 1.12 : count <= 5 ? 1.2 : 1.28;
  const rangeFactor = range === '7d' ? 0.98 : range === '30d' ? 1 : 1.06;
  const seedFactor = 1 + (seed - 0.5) * 0.04;
  const factor = clamp(countFactor * rangeFactor * seedFactor, 0.85, 1.35);

  return {
    factor,
    seed,
    range,
    geoUnits,
  };
};

export const applyGeoValue = (
  value: number,
  context: GeoMockContext,
  kind: GeoValueKind,
  options: ApplyOptions = {},
) => {
  const { decimals = 1, min = 0, max = Number.POSITIVE_INFINITY } = options;
  const jitter = context.seed - 0.5;

  let nextValue = value;

  if (kind === 'count') {
    nextValue = value * context.factor * (1 + jitter * 0.06);
    return clamp(Math.round(nextValue), min, max);
  }

  if (kind === 'amount') {
    nextValue = value * context.factor * (0.95 + jitter * 0.1);
    return clamp(roundTo(nextValue, decimals), min, max);
  }

  if (kind === 'rate') {
    const drift = (context.factor - 1) * 12;
    nextValue = value + drift + jitter * 6;
    return clamp(roundTo(nextValue, decimals), min, max);
  }

  if (kind === 'duration') {
    const rangeFactor = context.range === '90d' ? 1.05 : context.range === '7d' ? 0.95 : 1;
    nextValue = value * rangeFactor * (1 + jitter * 0.08);
    return clamp(roundTo(nextValue, decimals), min, max);
  }

  return clamp(roundTo(nextValue, decimals), min, max);
};

export const applyGeoSeries = <T extends Record<string, any>>(
  data: T[],
  context: GeoMockContext,
  configs: SeriesScaleConfig[],
): T[] => {
  return data.map((item) => {
    const next = { ...item };
    configs.forEach((config) => {
      const rawValue = item[config.key];
      if (typeof rawValue === 'number') {
        next[config.key] = applyGeoValue(rawValue, context, config.kind, {
          decimals: config.decimals,
          min: config.min,
          max: config.max,
        });
      }
    });
    return next;
  });
};

export const formatGeoSelection = (geoUnits: string[], max = 2) => {
  if (!geoUnits || geoUnits.length === 0) return 'Tất cả địa bàn';
  const labels = geoUnits.map((value) => geoValueLabelMap[value] || value);
  const visible = labels.slice(0, max).join(', ');
  if (labels.length <= max) return visible;
  return `${visible} +${labels.length - max}`;
};
