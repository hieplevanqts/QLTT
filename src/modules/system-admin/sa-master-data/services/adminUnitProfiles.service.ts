import { supabase } from '@/api/supabaseClient';
import type { AdminUnitLevel } from "./adminUnits.service";

export type AdminUnitProfileRecord = {
  id: string;
  level: AdminUnitLevel;
  source_id: string;
  headline?: string | null;
  summary?: string | null;
  homepage_url?: string | null;
  banner_url?: string | null;
  thumbnail_url?: string | null;
  news_config?: Record<string, unknown> | null;
  seo_title?: string | null;
  seo_description?: string | null;
  tags?: string[] | null;
  status?: "active" | "inactive" | null;
};

export type AdminUnitProfilePayload = Omit<AdminUnitProfileRecord, "id" | "level" | "source_id">;

const mapRow = (row: any): AdminUnitProfileRecord => ({
  id: row.id ?? row._id,
  level: row.level,
  source_id: row.source_id,
  headline: row.headline ?? null,
  summary: row.summary ?? null,
  homepage_url: row.homepage_url ?? null,
  banner_url: row.banner_url ?? null,
  thumbnail_url: row.thumbnail_url ?? null,
  news_config: row.news_config ?? null,
  seo_title: row.seo_title ?? null,
  seo_description: row.seo_description ?? null,
  tags: row.tags ?? null,
  status: row.status ?? null,
});

export const adminUnitProfilesService = {
  async getProfile(level: AdminUnitLevel, sourceId: string): Promise<AdminUnitProfileRecord | null> {
    const { data, error } = await supabase
      .from("admin_unit_profiles")
      .select("*")
      .eq("level", level)
      .eq("source_id", sourceId)
      .maybeSingle();

    if (error) {
      throw new Error(`admin_unit_profiles select failed: ${error.message}`);
    }

    return data ? mapRow(data) : null;
  },

  async upsertProfile(
    level: AdminUnitLevel,
    sourceId: string,
    payload: AdminUnitProfilePayload,
  ): Promise<AdminUnitProfileRecord> {
    const { data, error } = await supabase
      .from("admin_unit_profiles")
      .upsert(
        [
          {
            level,
            source_id: sourceId,
            ...payload,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "level,source_id" },
      )
      .select("*")
      .single();

    if (error) {
      throw new Error(`admin_unit_profiles upsert failed: ${error.message}`);
    }

    return mapRow(data);
  },
};
