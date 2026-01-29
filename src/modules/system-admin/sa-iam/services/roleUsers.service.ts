import { supabase } from '@/api/supabaseClient';

export type RoleUserLite = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
  status: number;
};

export type RoleUserAssignmentResult = {
  users: RoleUserLite[];
  assignedUserIds: string[];
};

const mapLiteUser = (row: any): RoleUserLite => ({
  id: row._id ?? row.id,
  username: row.username ?? null,
  full_name: row.full_name ?? null,
  email: row.email ?? null,
  status: Number(row.status ?? 0),
});

export const roleUsersService = {
  async loadRoleUserAssignment(roleId: string, search?: string): Promise<RoleUserAssignmentResult> {
    let usersQuery = supabase
      .from("users")
      .select("_id, username, full_name, email, status")
      .is("deleted_at", null)
      .order("full_name", { ascending: true })
      .order("username", { ascending: true })
      .limit(500);

    const q = search?.trim();
    if (q) {
      usersQuery = usersQuery.or(
        `username.ilike.%${q}%,full_name.ilike.%${q}%,email.ilike.%${q}%`,
      );
    }

    const [usersResult, assignedResult] = await Promise.all([
      usersQuery,
      supabase.from("user_roles").select("user_id").eq("role_id", roleId),
    ]);

    if (usersResult.error) {
      throw new Error(`users select failed: ${usersResult.error.message}`);
    }

    if (assignedResult.error) {
      throw new Error(`role users select failed: ${assignedResult.error.message}`);
    }

    const assignedUserIds = (assignedResult.data || [])
      .map((row: any) => row.user_id as string)
      .filter(Boolean);

    return {
      users: (usersResult.data || []).map(mapLiteUser),
      assignedUserIds,
    };
  },

  async listUserIdsByRole(roleId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role_id", roleId);

    if (error) {
      throw new Error(`role users select failed: ${error.message}`);
    }

    return (data || []).map((row: any) => row.user_id).filter(Boolean);
  },

  async saveRoleUsers(roleId: string, targetUserIds: string[], originalUserIds: string[]): Promise<void> {
    const originalSet = new Set(originalUserIds);
    const targetSet = new Set(targetUserIds);

    const toAdd = targetUserIds.filter((id) => !originalSet.has(id));
    const toRemove = originalUserIds.filter((id) => !targetSet.has(id));

    if (toAdd.length > 0) {
      const rows = toAdd.map((userId) => ({
        user_id: userId,
        role_id: roleId,
        created_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from("user_roles")
        .upsert(rows, { onConflict: "user_id,role_id" });

      if (insertError) {
        throw new Error(`role users insert failed: ${insertError.message}`);
      }
    }

    if (toRemove.length > 0) {
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("role_id", roleId)
        .in("user_id", toRemove);

      if (deleteError) {
        throw new Error(`role users delete failed: ${deleteError.message}`);
      }
    }
  },
};
