import { supabase } from '@/api/supabaseClient';

export type SubDepartmentRecord = {
  id: string;
  department_id: string;
  code: string;
  name: string;
  is_active: boolean | null;
  order_index?: number | null;
  created_at?: string;
  updated_at?: string;
  department?: {
    id: string;
    name: string;
    code?: string | null;
  } | null;
};

export type SubDepartmentPayload = {
  department_id: string;
  code: string;
  name: string;
  is_active?: boolean | null;
  order_index?: number | null;
};

export type SubDepartmentListParams = {
  scopeUnitId: string;
  search?: string;
  status?: "all" | "active" | "inactive";
  page?: number;
  pageSize?: number;
};

export type SubDepartmentListResult = {
  data: SubDepartmentRecord[];
  total: number;
  page: number;
  pageSize: number;
};

const mapRow = (row: any): SubDepartmentRecord => ({
  ...row,
  id: row.id ?? row._id,
  department: row.department
    ? {
        id: row.department.id ?? row.department._id,
        name: row.department.name,
        code: row.department.code ?? null,
      }
    : null,
});

export const subDepartmentsService = {
  async listSubDepartments(params: SubDepartmentListParams): Promise<SubDepartmentListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("sub_departments")
      .select("*, id:_id, department:departments(_id, name, code)", { count: "exact" })
      .eq("department_id", params.scopeUnitId)
      .order("order_index", { ascending: true })
      .order("code", { ascending: true })
      .range(from, to);

    const search = params.search?.trim();
    if (search) {
      query = query.or(`code.ilike.%${search}%,name.ilike.%${search}%`);
    }

    if (params.status === "active") {
      query = query.eq("is_active", true);
    }
    if (params.status === "inactive") {
      query = query.eq("is_active", false);
    }

    const { data, error, count } = await query;
    if (error) {
      throw new Error(`sub_departments select failed: ${error.message}`);
    }

    return {
      data: (data || []).map(mapRow),
      total: count ?? 0,
      page,
      pageSize,
    };
  },

  async getSubDepartment(id: string, scopeUnitId: string): Promise<SubDepartmentRecord | null> {
    const { data, error } = await supabase
      .from("sub_departments")
      .select("*, id:_id, department:departments(_id, name, code)")
      .eq("_id", id)
      .eq("department_id", scopeUnitId)
      .maybeSingle();

    if (error) {
      throw new Error(`sub_departments select failed: ${error.message}`);
    }

    return data ? mapRow(data) : null;
  },

  async createSubDepartment(payload: SubDepartmentPayload): Promise<SubDepartmentRecord> {
    const { data, error } = await supabase
      .from("sub_departments")
      .insert([payload])
      .select("*, id:_id, department:departments(_id, name, code)")
      .single();

    if (error) {
      throw new Error(`sub_departments insert failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async updateSubDepartment(id: string, scopeUnitId: string, payload: Partial<SubDepartmentPayload>): Promise<SubDepartmentRecord> {
    const { data, error } = await supabase
      .from("sub_departments")
      .update(payload)
      .eq("_id", id)
      .eq("department_id", scopeUnitId)
      .select("*, id:_id, department:departments(_id, name, code)")
      .single();

    if (error) {
      throw new Error(`sub_departments update failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async toggleStatus(id: string, scopeUnitId: string, nextStatus: boolean): Promise<SubDepartmentRecord> {
    return subDepartmentsService.updateSubDepartment(id, scopeUnitId, { is_active: nextStatus });
  },
};
