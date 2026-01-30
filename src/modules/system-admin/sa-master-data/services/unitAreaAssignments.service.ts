import { supabase } from '@/api/supabaseClient';

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
};

export type CoordinatePreview = {
  lat: number;
  lng: number;
};

export type AreaRecord = {
  id: string;
  code: string;
  name: string;
  level?: string | null;
  province_id?: string | null;
  ward_id?: string | null;
};

export type DepartmentAreaRecord = {
  id: string;
  department_id: string;
  area_id: string;
  area: AreaRecord | null;
};

export type ChiCucProvinceAssignment = {
  province_id: string;
  area_id: string;
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
});

const toNumber = (value: unknown) => {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const extractLatLng = (row: Record<string, unknown>): CoordinatePreview | null => {
  const directLat =
    toNumber(row.center_lat) ??
    toNumber(row.center_latitude) ??
    toNumber(row.latitude) ??
    toNumber(row.lat) ??
    toNumber(row.center_y);
  const directLng =
    toNumber(row.center_lng) ??
    toNumber(row.center_long) ??
    toNumber(row.center_longitude) ??
    toNumber(row.longitude) ??
    toNumber(row.lng) ??
    toNumber(row.lon) ??
    toNumber(row.long) ??
    toNumber(row.center_x);

  if (directLat !== null && directLng !== null) {
    return { lat: directLat, lng: directLng };
  }

  const coords = row.coordinates;
  if (Array.isArray(coords) && coords.length >= 2) {
    const lng = toNumber(coords[0]);
    const lat = toNumber(coords[1]);
    if (lat !== null && lng !== null) {
      return { lat, lng };
    }
  }

  return null;
};

const mapArea = (row: any): AreaRecord => ({
  id: row.id ?? row._id,
  code: row.code,
  name: row.name,
  level: row.level ?? null,
  province_id: row.province_id ?? null,
  ward_id: row.ward_id ?? null,
});

const mapDepartmentArea = (row: any): DepartmentAreaRecord => ({
  id: row.id ?? row._id,
  department_id: row.department_id,
  area_id: row.area_id,
  area: row.area ? mapArea(row.area) : null,
});

const findProvinceArea = (areas: AreaRecord[]) =>
  areas.find((area) => !area.ward_id) ?? null;

export const unitAreaAssignmentsService = {
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

  async listWardsByProvince(provinceId: string, keyword = "", limit = 50): Promise<WardRecord[]> {
    let query = supabase
      .from("wards")
      .select("_id, code, name, province_id")
      .eq("province_id", provinceId)
      .order("name", { ascending: true })
      .limit(limit);

    const search = keyword.trim();
    if (search) {
      query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`wards select failed: ${error.message}`);
    }

    return (data || []).map(mapWard);
  },

  async getWardsByIds(wardIds: string[]): Promise<WardRecord[]> {
    if (wardIds.length === 0) return [];
    const { data, error } = await supabase
      .from("wards")
      .select("_id, code, name, province_id")
      .in("_id", wardIds);

    if (error) {
      throw new Error(`wards select failed: ${error.message}`);
    }

    return (data || []).map(mapWard);
  },

  async listDepartmentAreas(departmentId: string): Promise<DepartmentAreaRecord[]> {
    const { data, error } = await supabase
      .from("department_areas")
      .select("id:_id, department_id, area_id, area:areas(_id, code, name, level, province_id, ward_id)")
      .eq("department_id", departmentId);

    if (error) {
      throw new Error(`department_areas select failed: ${error.message}`);
    }

    return (data || []).map(mapDepartmentArea);
  },

  async getProvinceAreaByProvinceId(provinceId: string): Promise<AreaRecord | null> {
    const { data, error } = await supabase
      .from("areas")
      .select("_id, code, name, level, province_id, ward_id")
      .eq("province_id", provinceId)
      .is("ward_id", null)
      .limit(1);

    if (error) {
      throw new Error(`areas select failed: ${error.message}`);
    }

    if (!data || data.length === 0) return null;
    return mapArea(data[0]);
  },

  async getAreaIdsByWardIds(wardIds: string[]): Promise<Map<string, string>> {
    if (wardIds.length === 0) return new Map();
    const { data, error } = await supabase
      .from("areas")
      .select("_id, ward_id")
      .in("ward_id", wardIds);

    if (error) {
      throw new Error(`areas select failed: ${error.message}`);
    }

    const map = new Map<string, string>();
    (data || []).forEach((row: any) => {
      if (row.ward_id) {
        map.set(row.ward_id, row._id ?? row.id);
      }
    });
    return map;
  },

  async getProvinceCoordinates(provinceId: string): Promise<CoordinatePreview | null> {
    const { data, error } = await supabase
      .from("provinces_with_coordinates")
      .select("*")
      .or(`province_id.eq.${provinceId},_id.eq.${provinceId},id.eq.${provinceId}`)
      .limit(1);

    if (error) {
      throw new Error(`provinces_with_coordinates select failed: ${error.message}`);
    }

    const row = data?.[0];
    if (!row) return null;
    return extractLatLng(row as Record<string, unknown>);
  },

  async getWardCoordinates(wardId: string): Promise<CoordinatePreview | null> {
    const { data, error } = await supabase
      .from("wards_with_coordinates")
      .select("*")
      .or(`ward_id.eq.${wardId},_id.eq.${wardId},id.eq.${wardId}`)
      .limit(1);

    if (error) {
      throw new Error(`wards_with_coordinates select failed: ${error.message}`);
    }

    const row = data?.[0];
    if (!row) return null;
    return extractLatLng(row as Record<string, unknown>);
  },

  async getChiCucProvinceAssignment(chiCucId: string): Promise<ChiCucProvinceAssignment | null> {
    const assignments = await unitAreaAssignmentsService.listDepartmentAreas(chiCucId);
    const provinceArea = findProvinceArea(assignments.map((item) => item.area).filter(Boolean) as AreaRecord[]);
    if (!provinceArea || !provinceArea.province_id) return null;
    const assignment = assignments.find((item) => item.area_id === provinceArea.id);
    if (!assignment) return null;
    return {
      province_id: provinceArea.province_id,
      area_id: assignment.area_id,
    };
  },

  async listTeamAssignments(teamId: string): Promise<DepartmentAreaRecord[]> {
    return unitAreaAssignmentsService.listDepartmentAreas(teamId);
  },

  async upsertChiCucProvince(chiCucId: string, provinceId: string): Promise<void> {
    const provinceArea = await unitAreaAssignmentsService.getProvinceAreaByProvinceId(provinceId);
    if (!provinceArea) {
      throw new Error("Không tìm thấy địa bàn tỉnh/TP trong bảng areas.");
    }

    const { error: deleteError } = await supabase
      .from("department_areas")
      .delete()
      .eq("department_id", chiCucId);

    if (deleteError) {
      throw new Error(`department_areas delete failed: ${deleteError.message}`);
    }

    const { error: insertError } = await supabase
      .from("department_areas")
      .insert({
        department_id: chiCucId,
        area_id: provinceArea.id,
      });

    if (insertError) {
      throw new Error(`department_areas insert failed: ${insertError.message}`);
    }
  },

  async setTeamCoverageAllProvince(teamId: string, provinceId: string): Promise<void> {
    const provinceArea = await unitAreaAssignmentsService.getProvinceAreaByProvinceId(provinceId);
    if (!provinceArea) {
      throw new Error("Không tìm thấy địa bàn tỉnh/TP trong bảng areas.");
    }

    const { error: deleteError } = await supabase
      .from("department_areas")
      .delete()
      .eq("department_id", teamId);

    if (deleteError) {
      throw new Error(`department_areas delete failed: ${deleteError.message}`);
    }

    const { error: insertError } = await supabase
      .from("department_areas")
      .insert({
        department_id: teamId,
        area_id: provinceArea.id,
      });

    if (insertError) {
      throw new Error(`department_areas insert failed: ${insertError.message}`);
    }
  },

  async setTeamCoverageWardList(teamId: string, wardIds: string[]): Promise<void> {
    const areaMap = await unitAreaAssignmentsService.getAreaIdsByWardIds(wardIds);

    const { error: deleteError } = await supabase
      .from("department_areas")
      .delete()
      .eq("department_id", teamId);

    if (deleteError) {
      throw new Error(`department_areas delete failed: ${deleteError.message}`);
    }

    const payload = wardIds
      .map((wardId) => areaMap.get(wardId))
      .filter((areaId): areaId is string => Boolean(areaId))
      .map((areaId) => ({
        department_id: teamId,
        area_id: areaId,
      }));

    if (payload.length === 0) {
      return;
    }

    const { error: insertError } = await supabase
      .from("department_areas")
      .insert(payload);

    if (insertError) {
      throw new Error(`department_areas insert failed: ${insertError.message}`);
    }
  },

  async removeTeamWard(teamId: string, wardId: string): Promise<void> {
    const areaMap = await unitAreaAssignmentsService.getAreaIdsByWardIds([wardId]);
    const areaId = areaMap.get(wardId);
    if (!areaId) {
      throw new Error("Không tìm thấy địa bàn phường/xã trong bảng areas.");
    }

    const { error } = await supabase
      .from("department_areas")
      .delete()
      .eq("department_id", teamId)
      .eq("area_id", areaId);

    if (error) {
      throw new Error(`department_areas delete failed: ${error.message}`);
    }
  },
};
