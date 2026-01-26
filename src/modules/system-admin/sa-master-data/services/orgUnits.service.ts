import { supabase } from "../../../../lib/supabase";

export type OrgUnitRecord = {
  id: string;
  parent_id: string | null;
  name: string;
  code: string;
  short_name?: string | null;
  type?: string | null;
  level?: number | null;
  order_index?: number | null;
  path?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_active?: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export type OrgUnitPayload = {
  parent_id?: string | null;
  name: string;
  code: string;
  short_name?: string | null;
  type?: string | null;
  level?: number | null;
  order_index?: number | null;
  path?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_active?: boolean | null;
};

const mapRow = (row: any): OrgUnitRecord => ({
  ...row,
  id: row.id ?? row._id,
});

export const orgUnitsService = {
  async listUnits(): Promise<OrgUnitRecord[]> {
    const { data, error } = await supabase
      .from("departments")
      .select("*, id:_id")
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`departments select failed: ${error.message}`);
    }

    return (data || []).map(mapRow);
  },

  async getUnit(id: string): Promise<OrgUnitRecord | null> {
    const { data, error } = await supabase
      .from("departments")
      .select("*, id:_id")
      .eq("_id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`departments select failed: ${error.message}`);
    }

    return data ? mapRow(data) : null;
  },

  async isCodeTaken(code: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from("departments")
      .select("_id", { count: "exact", head: true })
      .eq("code", code);

    if (excludeId) {
      query = query.neq("_id", excludeId);
    }

    const { count, error } = await query;
    if (error) {
      throw new Error(`departments select failed: ${error.message}`);
    }
    return (count ?? 0) > 0;
  },

  async createUnit(payload: OrgUnitPayload): Promise<OrgUnitRecord> {
    const { data, error } = await supabase
      .from("departments")
      .insert([payload])
      .select("*, id:_id")
      .single();

    if (error) {
      throw new Error(`departments insert failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async updateUnit(id: string, payload: Partial<OrgUnitPayload>): Promise<OrgUnitRecord> {
    const { data, error } = await supabase
      .from("departments")
      .update(payload)
      .eq("_id", id)
      .select("*, id:_id")
      .single();

    if (error) {
      throw new Error(`departments update failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async toggleStatus(id: string, nextStatus: boolean): Promise<OrgUnitRecord> {
    return orgUnitsService.updateUnit(id, { is_active: nextStatus });
  },
};
