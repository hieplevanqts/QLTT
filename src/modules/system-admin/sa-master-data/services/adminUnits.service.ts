import { supabase } from "../../../../lib/supabase";

export type AdminUnitLevel = "province" | "ward";

export type ProvinceRecord = {
  id: string;
  code: string;
  name: string;
};

export type WardRecord = {
  id: string;
  code: string;
  name: string;
  province_id: string;
  area?: string | null;
  officer?: string | null;
};

export type AdminUnitCoordinates = {
  level: AdminUnitLevel;
  source_id: string;
  code: string;
  name: string;
  parent_id?: string | null;
  center_lat?: number | null;
  center_lng?: number | null;
  bounds?: unknown;
  area?: number | null;
  officer?: string | null;
};

export type ProvincePayload = {
  code: string;
  name: string;
};

export type WardPayload = {
  code: string;
  name: string;
  area?: string | null;
  officer?: string | null;
};

const mapProvince = (row: any): ProvinceRecord => ({
  id: row.id ?? row._id,
  code: row.code,
  name: row.name,
});

const mapWard = (row: any): WardRecord => ({
  id: row.id ?? row._id,
  code: row.code,
  name: row.name,
  province_id: row.province_id,
  area: row.area ?? null,
  officer: row.officer ?? null,
});

export const adminUnitsService = {
  async listProvinces(): Promise<ProvinceRecord[]> {
    const { data, error } = await supabase
      .from("provinces")
      .select("_id, code, name")
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`provinces select failed: ${error.message}`);
    }

    return (data || []).map(mapProvince);
  },

  async listWardsByProvince(provinceId: string): Promise<WardRecord[]> {
    const { data, error } = await supabase
      .from("wards")
      .select("_id, code, name, province_id, area, officer")
      .eq("province_id", provinceId)
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`wards select failed: ${error.message}`);
    }

    return (data || []).map(mapWard);
  },

  async searchWards(
    keyword: string,
    options?: { provinceIds?: string[]; wardIds?: string[]; limit?: number },
  ): Promise<WardRecord[]> {
    const search = keyword.trim();
    if (!search) return [];

    let query = supabase
      .from("wards")
      .select("_id, code, name, province_id, area, officer")
      .or(`name.ilike.%${search}%,code.ilike.%${search}%`)
      .order("name", { ascending: true })
      .limit(options?.limit ?? 200);

    if (options?.provinceIds && options.provinceIds.length > 0) {
      query = query.in("province_id", options.provinceIds);
    }

    if (options?.wardIds && options.wardIds.length > 0) {
      query = query.in("_id", options.wardIds);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`wards search failed: ${error.message}`);
    }

    return (data || []).map(mapWard);
  },

  async getProvince(id: string): Promise<ProvinceRecord | null> {
    const { data, error } = await supabase
      .from("provinces")
      .select("_id, code, name")
      .eq("_id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`provinces select failed: ${error.message}`);
    }

    return data ? mapProvince(data) : null;
  },

  async getWard(id: string): Promise<WardRecord | null> {
    const { data, error } = await supabase
      .from("wards")
      .select("_id, code, name, province_id, area, officer")
      .eq("_id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`wards select failed: ${error.message}`);
    }

    return data ? mapWard(data) : null;
  },

  async updateProvince(id: string, payload: ProvincePayload): Promise<ProvinceRecord> {
    const { data, error } = await supabase
      .from("provinces")
      .update(payload)
      .eq("_id", id)
      .select("_id, code, name")
      .single();

    if (error) {
      throw new Error(`provinces update failed: ${error.message}`);
    }

    return mapProvince(data);
  },

  async updateWard(id: string, payload: WardPayload): Promise<WardRecord> {
    const { data, error } = await supabase
      .from("wards")
      .update(payload)
      .eq("_id", id)
      .select("_id, code, name, province_id, area, officer")
      .single();

    if (error) {
      throw new Error(`wards update failed: ${error.message}`);
    }

    return mapWard(data);
  },

  async getCoordinates(level: AdminUnitLevel, sourceId: string): Promise<AdminUnitCoordinates | null> {
    const { data, error } = await supabase
      .from("v_admin_units_with_coordinates")
      .select("*")
      .eq("level", level)
      .eq("source_id", sourceId)
      .maybeSingle();

    if (error) {
      throw new Error(`v_admin_units_with_coordinates select failed: ${error.message}`);
    }

    if (!data) return null;
    return {
      level: data.level,
      source_id: data.source_id,
      code: data.code,
      name: data.name,
      parent_id: data.parent_id ?? null,
      center_lat: data.center_lat ?? null,
      center_lng: data.center_lng ?? null,
      bounds: data.bounds ?? null,
      area: data.area ?? null,
      officer: data.officer ?? null,
    };
  },

  async upsertCoordinates(level: AdminUnitLevel, sourceId: string, lat: number, lng: number): Promise<void> {
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      throw new Error("Tọa độ không hợp lệ.");
    }

    const payload =
      level === "province"
        ? { province_id: sourceId, center_lat: lat, center_lng: lng, updated_at: new Date().toISOString() }
        : { ward_id: sourceId, center_lat: lat, center_lng: lng, updated_at: new Date().toISOString() };

    const { error } = await supabase
      .from(level === "province" ? "province_coordinates" : "ward_coordinates")
      .upsert([payload], {
        onConflict: level === "province" ? "province_id" : "ward_id",
      });

    if (error) {
      const tableName = level === "province" ? "province_coordinates" : "ward_coordinates";
      throw new Error(`${tableName} upsert failed: ${error.message}`);
    }
  },
};
