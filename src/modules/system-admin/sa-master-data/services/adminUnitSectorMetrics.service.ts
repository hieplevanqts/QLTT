import { supabase } from '@/api/supabaseClient';
import type { AdminUnitLevel } from "./adminUnits.service";

export type SectorRecord = {
  id: string;
  code: string;
  name: string;
  parent_sector_id?: string | null;
  status?: string | null;
  sort_order?: number | null;
};

export type AdminUnitSectorMetricPayload = {
  merchant_count?: number | null;
  reported_revenue?: number | null;
  estimated_revenue?: number | null;
  inspection_count?: number | null;
  violation_count?: number | null;
  fine_amount?: number | null;
  risk_score?: number | null;
};

const mapSector = (row: any): SectorRecord => ({
  id: row.id ?? row._id,
  code: row.code,
  name: row.name,
  parent_sector_id: row.parent_sector_id ?? null,
  status: row.status ?? null,
  sort_order: row.sort_order ?? null,
});

export const adminUnitSectorMetricsService = {
  async listSectors(): Promise<SectorRecord[]> {
    const { data, error } = await supabase
      .from("dim_sector")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`dim_sector select failed: ${error.message}`);
    }

    return (data || []).map(mapSector);
  },

  async upsertSectorMetric(
    level: AdminUnitLevel,
    sourceId: string,
    periodId: string,
    sectorId: string,
    payload: AdminUnitSectorMetricPayload,
  ): Promise<void> {
    const { error } = await supabase
      .from("fact_admin_unit_sector_metrics")
      .upsert(
        [
          {
            level,
            source_id: sourceId,
            period_id: periodId,
            sector_id: sectorId,
            ...payload,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "level,source_id,period_id,sector_id" },
      );

    if (error) {
      throw new Error(`fact_admin_unit_sector_metrics upsert failed: ${error.message}`);
    }
  },
};
