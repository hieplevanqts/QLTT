import { supabase } from "../../../../lib/supabase";

export type SubDepartmentMember = {
  id: number;
  sub_department_id: string;
  user_id: string;
  created_at?: string;
  user?: {
    id: string;
    full_name?: string | null;
    email?: string | null;
    username?: string | null;
  } | null;
};

export type SubDepartmentUserAssignment = {
  id: number;
  sub_department_id: string;
  user_id: string;
  sub_department?: {
    id: string;
    name: string;
    code?: string | null;
  } | null;
};

export type UserOption = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  username?: string | null;
};

const mapMember = (row: any): SubDepartmentMember => ({
  ...row,
  user: row.user
    ? {
        id: row.user.id ?? row.user._id,
        full_name: row.user.full_name ?? null,
        email: row.user.email ?? null,
        username: row.user.username ?? null,
      }
    : null,
});

const mapAssignment = (row: any): SubDepartmentUserAssignment => ({
  ...row,
  sub_department: row.sub_department
    ? {
        id: row.sub_department.id ?? row.sub_department._id,
        name: row.sub_department.name,
        code: row.sub_department.code ?? null,
      }
    : null,
});

export const subDepartmentUsersService = {
  async listMembers(subDepartmentId: string): Promise<SubDepartmentMember[]> {
    const { data, error } = await supabase
      .from("sub_department_users")
      .select("id, sub_department_id, user_id, created_at, user:users(_id, full_name, email, username)")
      .eq("sub_department_id", subDepartmentId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`sub_department_users select failed: ${error.message}`);
    }

    return (data || []).map(mapMember);
  },

  async getAssignmentsByUserIds(userIds: string[]): Promise<SubDepartmentUserAssignment[]> {
    if (userIds.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from("sub_department_users")
      .select("id, sub_department_id, user_id, sub_department:sub_departments(_id, name, code)")
      .in("user_id", userIds);

    if (error) {
      throw new Error(`sub_department_users select failed: ${error.message}`);
    }

    return (data || []).map(mapAssignment);
  },

  async moveUsersToSubDepartment(subDepartmentId: string, userIds: string[]): Promise<void> {
    if (userIds.length === 0) return;
    const { error } = await supabase
      .from("sub_department_users")
      .update({ sub_department_id: subDepartmentId })
      .in("user_id", userIds);

    if (error) {
      throw new Error(`sub_department_users update failed: ${error.message}`);
    }
  },

  async addUsersToSubDepartment(subDepartmentId: string, userIds: string[]): Promise<void> {
    if (userIds.length === 0) return;
    const payload = userIds.map((userId) => ({
      sub_department_id: subDepartmentId,
      user_id: userId,
    }));

    const { error } = await supabase.from("sub_department_users").insert(payload);
    if (error) {
      throw new Error(`sub_department_users insert failed: ${error.message}`);
    }
  },

  async removeUsersFromSubDepartment(subDepartmentId: string, userIds: string[]): Promise<void> {
    if (userIds.length === 0) return;
    const { error } = await supabase
      .from("sub_department_users")
      .delete()
      .eq("sub_department_id", subDepartmentId)
      .in("user_id", userIds);

    if (error) {
      throw new Error(`sub_department_users delete failed: ${error.message}`);
    }
  },

  async searchUsersInScope(scopeDepartmentId: string, keyword: string, limit = 20): Promise<UserOption[]> {
    let query = supabase
      .from("users")
      .select("id:_id, full_name, email, username, department_users!inner(department_id)")
      .eq("department_users.department_id", scopeDepartmentId)
      .order("full_name", { ascending: true })
      .limit(limit);

    const search = keyword.trim();
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,username.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`users select failed: ${error.message}`);
    }

    return (data || []).map((row: any) => ({
      id: row.id ?? row._id,
      full_name: row.full_name ?? null,
      email: row.email ?? null,
      username: row.username ?? null,
    }));
  },
};
