import React, { useMemo, useRef, useState, useEffect } from "react";
import { Segmented, Typography, Spin, Select, Tag, Checkbox, Button, Divider, theme } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

const SERIES_MAP = {
  violation_category: [
    "An toàn thực phẩm",
    "Nguồn gốc",
    "Giá cả",
    "Quảng cáo",
    "Hàng giả",
    "Gian lận",
    "Dược phẩm",
    "Mỹ phẩm",
    "Điện tử",
  ],
  industry: [
    "An ninh & Bảo vệ",
    "Ăn uống",
    "Bảo hiểm",
    "Bar & Pub",
    "Bất động sản",
    "Cafe & Trà",
    "Cắm trại & Dã ngoại",
    "Cửa hàng Đồ chơi",
    "Điện tử",
    "Dược phẩm",
    "Mỹ phẩm",
    "Thời trang",
  ],
} as const;

const SERIES_COLORS: Record<string, string> = {
  "An toàn thực phẩm": "#1677ff",
  "Nguồn gốc": "#52c41a",
  "Giá cả": "#faad14",
  "Quảng cáo": "#f5222d",
  "Hàng giả": "#722ed1",
  "Gian lận": "#13c2c2",
  "Dược phẩm": "#fa541c",
  "Mỹ phẩm": "#2f54eb",
  "Điện tử": "#a0d911",
  "An ninh & Bảo vệ": "#1677ff",
  "Ăn uống": "#52c41a",
  "Bảo hiểm": "#faad14",
  "Bar & Pub": "#f5222d",
  "Bất động sản": "#722ed1",
  "Cafe & Trà": "#13c2c2",
  "Cắm trại & Dã ngoại": "#fa541c",
  "Cửa hàng Đồ chơi": "#2f54eb",
  "Thời trang": "#a0d911",
};

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
    let total = 3 + Math.floor(rand() * 23);
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
  const allowed = new Set(seriesList);
  data.forEach((item) => {
    if (!allowed.has(item.series)) return;
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
  const withTotals = rows
    .map((row) => ({
      ...row,
      __total: seriesList.reduce((sum, s) => sum + (row[s] || 0), 0),
    }))
    .filter((row) => (row.__total || 0) > 0);

  withTotals.sort((a, b) => (b.__total || 0) - (a.__total || 0));
  return withTotals;
}

export default function RiskByWardMockChart() {
  const { token } = theme.useToken();
  const [mode, setMode] = useState<Mode>("violation_category");
  const [selectedSeries, setSelectedSeries] = useState<string[]>(
    () => [...SERIES_MAP.violation_category]
  );
  const [loading, setLoading] = useState(false);
  const didMount = useRef(false);

  const dataByMode = useMemo(
    () => ({
      violation_category: generateMockData(SERIES_MAP.violation_category, 20260203),
      industry: generateMockData(SERIES_MAP.industry, 20260213),
    }),
    []
  );

  const currentSeries = SERIES_MAP[mode];
  const currentData = dataByMode[mode];
  const selectedSet = useMemo(() => new Set(selectedSeries), [selectedSeries]);
  const filteredSeries = useMemo(
    () => currentSeries.filter((series) => selectedSet.has(series)),
    [currentSeries, selectedSet]
  );
  const stackedData = useMemo(() => {
    if (filteredSeries.length === 0) return [];
    return toStackedData(currentData, filteredSeries);
  }, [currentData, filteredSeries]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, [mode, selectedSeries]);

  const handleModeChange = (value: Mode) => {
    if (value === mode) return;
    setMode(value);
    setSelectedSeries([...SERIES_MAP[value]]);
  };

  const options = useMemo(
    () => currentSeries.map((series) => ({ label: series, value: series })),
    [currentSeries]
  );
  const allSelected = selectedSeries.length === currentSeries.length;
  const toggleSelectAll = () => {
    setSelectedSeries(allSelected ? [] : [...currentSeries]);
  };

  const rowHeight = 26;
  const chartHeight = Math.max(320, stackedData.length * rowHeight + 80);
  const minWidth = 320;
  const getSeriesColor = (series: string) => SERIES_COLORS[series] || token.colorPrimary;

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
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Segmented
            size="small"
            value={mode}
            onChange={(value) => handleModeChange(value as Mode)}
            options={[
              { label: "Danh mục vi phạm", value: "violation_category" },
              { label: "Ngành hàng", value: "industry" },
            ]}
          />
          <Select
            mode="multiple"
            value={selectedSeries}
            onChange={(values) => setSelectedSeries(values as string[])}
            options={options}
            placeholder="Chọn nhóm hiển thị"
            maxTagCount="responsive"
            maxTagPlaceholder={(omitted) =>
              allSelected ? "Tất cả" : `+${omitted.length}`
            }
            style={{ minWidth }}
            optionFilterProp="label"
            showSearch
            dropdownRender={(menu) => (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Chọn nhóm hiển thị
                  </Text>
                  <Button
                    type="link"
                    size="small"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={toggleSelectAll}
                    style={{ padding: 0 }}
                  >
                    {allSelected ? "Bỏ chọn" : "Chọn tất cả"}
                  </Button>
                </div>
                <Divider style={{ margin: 0 }} />
                {menu}
              </div>
            )}
            optionRender={(option) => (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Checkbox checked={selectedSet.has(option.value as string)} />
                <Tag color={getSeriesColor(option.value as string)} style={{ marginInlineEnd: 0 }}>
                  {option.label}
                </Tag>
              </div>
            )}
            tagRender={(props) => {
              const { label, value, closable, onClose } = props;
              const color = getSeriesColor(String(value));
              return (
                <Tag
                  color={color}
                  closable={closable}
                  onClose={onClose}
                  style={{ marginInlineEnd: 4 }}
                >
                  {label}
                </Tag>
              );
            }}
          />
        </div>
      </div>

      <div style={{ maxHeight: 420, overflowY: "auto" }}>
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
          ) : filteredSeries.length === 0 ? (
            <div
              style={{
                height: chartHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: token.colorTextSecondary,
                fontSize: 12,
              }}
            >
              Chưa chọn nhóm hiển thị
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
                {filteredSeries.map((series) => (
                  <Bar
                    key={series}
                    dataKey={series}
                    stackId="total"
                    fill={getSeriesColor(series)}
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
