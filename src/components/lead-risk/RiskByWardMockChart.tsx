import React, { useMemo, useState, useEffect } from "react";
import { Segmented, Typography, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Text } = Typography;

type Mode = "violation_category" | "industry";

type LongDatum = {
  ward: string;
  series: string;
  value: number;
};

const WARDS = [
  "Phường Trúc Bạch",
  "Phường Hàng Bạc",
  "Phường Cửa Nam",
  "Phường Kim Liên",
  "Phường Láng Hạ",
  "Phường Ô Chợ Dừa",
  "Phường Cầu Giấy",
  "Phường Dịch Vọng",
  "Phường Nghĩa Đô",
  "Phường Bưởi",
  "Phường Thụy Khuê",
  "Phường Yên Hòa",
  "Phường Thanh Xuân Bắc",
  "Phường Khương Đình",
  "Phường Mai Dịch",
  "Phường Trung Hòa",
  "Phường Phương Liệt",
  "Phường Giảng Võ",
  "Phường Hàng Gai",
  "Phường Hàng Đào",
];

const VIOLATION_SERIES = [
  "ATTP",
  "Hàng giả",
  "Gian lận giá",
  "Quảng cáo sai",
  "Dược phẩm",
  "Điện tử",
  "Mỹ phẩm",
];

const INDUSTRY_SERIES = [
  "Ăn uống",
  "Mỹ phẩm",
  "Bảo hiểm",
  "Đồ chơi",
  "Điện tử",
  "Dược phẩm",
  "Thời trang",
];

const SERIES_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#10b981",
];

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function generateMockData(seriesList: string[], seed: number): LongDatum[] {
  const rand = mulberry32(seed);
  const data: LongDatum[] = [];

  WARDS.forEach((ward) => {
    let total = Math.floor(rand() * 26);
    if (rand() < 0.2) {
      total = Math.floor(rand() * 4);
    }
    if (total === 0) return;

    const hot1 = Math.floor(rand() * seriesList.length);
    let hot2 = Math.floor(rand() * seriesList.length);
    if (hot2 === hot1) hot2 = (hot1 + 1) % seriesList.length;

    const weights = seriesList.map((_, idx) => {
      let w = rand() * 0.6 + 0.2;
      if (idx === hot1 || idx === hot2) {
        w += rand() * 1.5 + 0.8;
      }
      return w;
    });

    const weightSum = weights.reduce((sum, w) => sum + w, 0);
    const raw = weights.map((w) => (w / weightSum) * total);
    const values = raw.map((v) => Math.floor(v));
    let remainder = total - values.reduce((sum, v) => sum + v, 0);

    while (remainder > 0) {
      let bestIdx = 0;
      let bestFrac = -1;
      raw.forEach((v, idx) => {
        const frac = v - Math.floor(v);
        if (frac > bestFrac) {
          bestFrac = frac;
          bestIdx = idx;
        }
      });
      values[bestIdx] += 1;
      remainder -= 1;
    }

    const ensureHot = (idx: number) => {
      if (values[idx] > 0) return;
      const donor = values.findIndex((v, i) => v > 1 && i !== idx);
      if (donor >= 0) {
        values[donor] -= 1;
        values[idx] += 1;
      } else if (total > 0) {
        values[idx] = 1;
      }
    };

    ensureHot(hot1);
    ensureHot(hot2);

    values.forEach((value, idx) => {
      if (value > 0) {
        data.push({ ward, series: seriesList[idx], value });
      }
    });
  });

  return data;
}

type StackedRow = { ward: string } & Record<string, number>;

function toStackedData(data: LongDatum[], seriesList: string[]) {
  const map = new Map<string, StackedRow>();
  data.forEach((item) => {
    if (!map.has(item.ward)) {
      const row: StackedRow = { ward: item.ward } as StackedRow;
      seriesList.forEach((s) => {
        row[s] = 0;
      });
      map.set(item.ward, row);
    }
    const row = map.get(item.ward)!;
    row[item.series] = item.value;
  });

  const rows = Array.from(map.values());
  const withTotals = rows.map((row) => ({
    ...row,
    __total: seriesList.reduce((sum, s) => sum + (row[s] || 0), 0),
  }));

  withTotals.sort((a, b) => (b.__total || 0) - (a.__total || 0));
  return withTotals;
}

export default function RiskByWardMockChart() {
  const [mode, setMode] = useState<Mode>("violation_category");
  const [loading, setLoading] = useState(false);

  const violationData = useMemo(
    () => generateMockData(VIOLATION_SERIES, 20260203),
    []
  );
  const industryData = useMemo(
    () => generateMockData(INDUSTRY_SERIES, 20260213),
    []
  );

  const currentSeries = mode === "violation_category" ? VIOLATION_SERIES : INDUSTRY_SERIES;
  const currentData = mode === "violation_category" ? violationData : industryData;
  const stackedData = useMemo(
    () => toStackedData(currentData, currentSeries),
    [currentData, currentSeries]
  );

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const handleModeChange = (value: Mode) => {
    if (value === mode) return;
    setLoading(true);
    setTimeout(() => {
      setMode(value);
      setLoading(false);
    }, 300);
  };

  const rowHeight = 26;
  const chartHeight = Math.max(320, stackedData.length * rowHeight + 80);

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>Biểu đồ vi phạm theo khu vực</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Thống kê theo phường (mặc định: Hà Nội)
          </Text>
        </div>
        <Segmented
          size="small"
          value={mode}
          onChange={(value) => handleModeChange(value as Mode)}
          options={[
            { label: "Danh mục vi phạm", value: "violation_category" },
            { label: "Ngành hàng", value: "industry" },
          ]}
        />
      </div>

      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        <div style={{ height: chartHeight, minHeight: 320 }}>
          {loading ? (
            <div
              style={{
                height: chartHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spin size="small" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stackedData}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 12, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="ward"
                  width={140}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend verticalAlign="top" align="left" />
                {currentSeries.map((series, idx) => (
                  <Bar
                    key={series}
                    dataKey={series}
                    stackId="total"
                    fill={SERIES_COLORS[idx % SERIES_COLORS.length]}
                    radius={[0, 4, 4, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
