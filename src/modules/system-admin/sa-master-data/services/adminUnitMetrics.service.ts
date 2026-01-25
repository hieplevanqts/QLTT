import { supabase } from "../../../../lib/supabase";
import type { AdminUnitLevel } from "./adminUnits.service";

export type PeriodGranularity = "month" | "quarter" | "year";

export type PeriodRecord = {
  id: string;
  granularity: PeriodGranularity;
  year: number;
  quarter?: number | null;
  month?: number | null;
  from_date: string;
  to_date: string;
  label: string;
};

export type AdminUnitMetricRecord = {
  id: string;
  level: AdminUnitLevel;
  source_id: string;
  period_id: string;
  population?: number | null;
  area_km2?: number | null;
  grdp?: number | null;
  total_revenue?: number | null;
};

export type AdminUnitMetricPayload = Omit<AdminUnitMetricRecord, "id" | "period_id" | "level" | "source_id">;

const pad2 = (value: number) => String(value).padStart(2, "0");

const toDateString = (value: Date) => value.toISOString().slice(0, 10);

const buildPeriod = (granularity: PeriodGranularity, year: number, quarter?: number | null, month?: number | null) => {
  if (granularity === "month") {
    if (!month || month < 1 || month > 12) {
      throw new Error("Tháng không hợp lệ.");
    }
    const from = new Date(Date.UTC(year, month - 1, 1));
    const to = new Date(Date.UTC(year, month, 0));
    return {
      quarter: null,
      month,
      from_date: toDateString(from),
      to_date: toDateString(to),
      label: `Tháng ${pad2(month)}/${year}`,
    };
  }

  if (granularity === "quarter") {
    if (!quarter || quarter < 1 || quarter > 4) {
      throw new Error("Quý không hợp lệ.");
    }
    const startMonth = (quarter - 1) * 3 + 1;
    const from = new Date(Date.UTC(year, startMonth - 1, 1));
    const to = new Date(Date.UTC(year, startMonth + 2, 0));
    return {
      quarter,
      month: null,
      from_date: toDateString(from),
      to_date: toDateString(to),
      label: `Quý ${quarter}/${year}`,
    };
  }

  const from = new Date(Date.UTC(year, 0, 1));
  const to = new Date(Date.UTC(year, 11, 31));
  return {
    quarter: null,
    month: null,
    from_date: toDateString(from),
    to_date: toDateString(to),
    label: `Năm ${year}`,
  };
};

const mapPeriod = (row: any): PeriodRecord => ({
  id: row.id ?? row._id ?? row.period_id,
  granularity: row.granularity,
  year: row.year,
  quarter: row.quarter ?? null,
  month: row.month ?? null,
  from_date: row.from_date,
  to_date: row.to_date,
  label: row.label,
});

const mapMetric = (row: any): AdminUnitMetricRecord => ({
  id: row.id ?? row._id,
  level: row.level,
  source_id: row.source_id,
  period_id: row.period_id,
  population: row.population ?? null,
  area_km2: row.area_km2 ?? null,
  grdp: row.grdp ?? null,
  total_revenue: row.total_revenue ?? null,
});

export const adminUnitMetricsService = {
  async findPeriod(
    granularity: PeriodGranularity,
    year: number,
    quarter?: number | null,
    month?: number | null,
  ): Promise<PeriodRecord | null> {
    let query = supabase
      .from("dim_period")
      .select("*")
      .eq("granularity", granularity)
      .eq("year", year);

    if (granularity === "quarter") {
      query = query.eq("quarter", quarter ?? null).is("month", null);
    } else if (granularity === "month") {
      query = query.eq("month", month ?? null).is("quarter", null);
    } else {
      query = query.is("quarter", null).is("month", null);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      throw new Error(`dim_period select failed: ${error.message}`);
    }

    return data ? mapPeriod(data) : null;
  },

  async ensurePeriod(
    granularity: PeriodGranularity,
    year: number,
    quarter?: number | null,
    month?: number | null,
  ): Promise<PeriodRecord> {
    const period = buildPeriod(granularity, year, quarter, month);

    const { data, error } = await supabase
      .from("dim_period")
      .upsert(
        [
          {
            granularity,
            year,
            quarter: period.quarter,
            month: period.month,
            from_date: period.from_date,
            to_date: period.to_date,
            label: period.label,
          },
        ],
        { onConflict: "granularity,year,quarter,month" },
      )
      .select("*")
      .single();

    if (error) {
      throw new Error(`dim_period upsert failed: ${error.message}`);
    }

    return mapPeriod(data);
  },

  async getMetric(
    level: AdminUnitLevel,
    sourceId: string,
    periodId: string,
  ): Promise<AdminUnitMetricRecord | null> {
    const { data, error } = await supabase
      .from("fact_admin_unit_metrics")
      .select("*")
      .eq("level", level)
      .eq("source_id", sourceId)
      .eq("period_id", periodId)
      .maybeSingle();

    if (error) {
      throw new Error(`fact_admin_unit_metrics select failed: ${error.message}`);
    }

    return data ? mapMetric(data) : null;
  },

  async upsertMetric(
    level: AdminUnitLevel,
    sourceId: string,
    periodId: string,
    payload: AdminUnitMetricPayload,
  ): Promise<AdminUnitMetricRecord> {
    const { data, error } = await supabase
      .from("fact_admin_unit_metrics")
      .upsert(
        [
          {
            level,
            source_id: sourceId,
            period_id: periodId,
            ...payload,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "level,source_id,period_id" },
      )
      .select("*")
      .single();

    if (error) {
      throw new Error(`fact_admin_unit_metrics upsert failed: ${error.message}`);
    }

    return mapMetric(data);
  },
};
