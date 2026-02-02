import { supabase } from '@/api/supabaseClient';

export type RolePermissionStatusValue = 0 | 1;

export type PermissionDefinition = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  module_id?: string | null;
  module?: string | null;
  permission_type?: string | null;
  resource?: string | null;
  action?: string | null;
  status: RolePermissionStatusValue;
  sort_order?: number | null;
};

export type ModuleOption = {
  id: string;
  code: string;
  name: string;
  key?: string | null;
};

export const rolePermissionsService = {
  normalizeStatus(value: unknown): RolePermissionStatusValue {
    if (typeof value === "number") {
      return value === 1 ? 1 : 0;
    }
    if (typeof value === "string") {
      return value.toUpperCase() === "ACTIVE" ? 1 : 0;
    }
    return 1;
  },

  async listPermissions(): Promise<PermissionDefinition[]> {
    const baseQuery = () =>
      supabase.from("permissions").select("*").order("code", { ascending: true });

    let response = await supabase
      .from("permissions")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("code", { ascending: true });

    if (response.error && response.error.message.includes("sort_order")) {
      response = await baseQuery();
    }

    if (response.error) {
      throw new Error(`permissions select failed: ${response.error.message}`);
    }

    return (response.data || []).map((row: any) => ({
      id: row._id ?? "",
      code: row.code,
      name: row.name,
      description: row.description ?? null,
      module_id: row.module_id ?? null,
      module: row.module ?? null,
      permission_type: row.permission_type ?? null,
      resource: row.resource ?? null,
      action: row.action ?? null,
      status: rolePermissionsService.normalizeStatus(row.status),
      sort_order: row.sort_order ?? null,
    }));
  },

  async listModules(): Promise<ModuleOption[]> {
    const { data, error } = await supabase
      .from("modules")
      .select("_id, code, name, key")
      .order("code", { ascending: true });

    if (error) {
      throw new Error(`modules select failed: ${error.message}`);
    }

    return (data || []).map((row: any) => ({
      id: row._id ?? "",
      code: row.code ?? row.key ?? "",
      name: row.name ?? row.code ?? row.key ?? "",
      key: row.key ?? null,
    }));
  },

  async listRolePermissionIds(roleId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("role_permissions")
      .select("permission_id")
      .eq("role_id", roleId);

    if (error) {
      throw new Error(`role permissions select failed: ${error.message}`);
    }

    return (data || []).map((row: any) => row.permission_id).filter(Boolean);
  },

  async addRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    if (!permissionIds.length) return;
    const payload = permissionIds.map((permissionId) => ({
      role_id: roleId,
      permission_id: permissionId,
    }));

    const { error } = await supabase
      .from("role_permissions")
      .upsert(payload, { onConflict: "role_id,permission_id" });

    if (error) {
      throw new Error(`role permissions insert failed: ${error.message}`);
    }
  },

  async removeRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    if (!permissionIds.length) return;
    const { error } = await supabase
      .from("role_permissions")
      .delete()
      .eq("role_id", roleId)
      .in("permission_id", permissionIds);

    if (error) {
      throw new Error(`role permissions delete failed: ${error.message}`);
    }
  },
  async listActions(): Promise<{ name: string; code: string }[]> {
    const { data, error } = await supabase
      .from('permission_actions')
      .select('name, code')
      .order('created_at', { ascending: true }); 
    if (error) {
      console.error('Error fetching permission actions:', error);
      throw error;
    }

    return data || [];
  },
  
  async createAction(action: { name: string; code: string }) {
    const { data, error } = await supabase
      .from('permission_actions')
      .insert([action])
      .select();
    if (error) throw error;
    return data;
  },

  async updateAction(code: string, action: { name: string; code: string }) {
    const { error } = await supabase
      .from('permission_actions')
      .update(action)
      .eq('code', code);
    if (error) throw error;
  },

  async deleteAction(code: string) {
    const { error } = await supabase
      .from('permission_actions')
      .delete()
      .eq('code', code);
    if (error) throw error;
  }
};
