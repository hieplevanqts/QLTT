/**
 * ROLE PERMISSIONS V2 - Matrix (resource × action)
 * Permission: sa.iam.assignment.read
 */

import React from "react";
import { Input, Radio, Spin, Tag, Typography, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "@/layouts/PageHeader";
import { PermissionGate } from "../../_shared";
import { rolesService, type RoleRecord } from "../services/roles.service";
import { RolePermissionMatrixV2 } from "../components/RolePermissionMatrixV2";

const { Text } = Typography;

export default function RolePermissionsV2Page() {
  const navigate = useNavigate();
  const { roleId } = useParams<{ roleId?: string }>();

  const [roles, setRoles] = React.useState<RoleRecord[]>([]);
  const [rolesLoading, setRolesLoading] = React.useState(false);
  const [rolesSearch, setRolesSearch] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<RoleRecord | null>(null);

  const loadRoles = React.useCallback(async () => {
    setRolesLoading(true);
    try {
      const result = await rolesService.listRoles({ q: rolesSearch, page: 1, pageSize: 200 });
      setRoles(result.data || []);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể tải danh sách vai trò.");
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  }, [rolesSearch]);

  React.useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  React.useEffect(() => {
    if (!roleId) {
      setSelectedRole(null);
      return;
    }
    const found = roles.find((role) => role.id === roleId);
    if (found) {
      setSelectedRole(found);
      return;
    }
    void (async () => {
      try {
        const role = await rolesService.getRoleById(roleId);
        setSelectedRole(role);
      } catch {
        setSelectedRole(null);
      }
    })();
  }, [roleId, roles]);

  const handleRoleSelect = (nextRoleId: string) => {
    navigate(`/system-admin/iam/role-permissions/${nextRoleId}`);
  };

  return (
    <PermissionGate permission="sa.iam.assignment.read">
      <div className="flex flex-col gap-4">
        <PageHeader
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Quản trị hệ thống", href: "/system-admin" },
            { label: "IAM", href: "/system-admin/iam" },
            { label: "Phân quyền" },
          ]}
          title="Phân quyền theo vai trò"
          subtitle="Ma trận phân quyền theo resource × action"
        />

        <div className="grid grid-cols-12 gap-4 px-6 pb-8">
          <div className="col-span-12 xl:col-span-3">
            <div className="rounded border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-700">Vai trò</div>
              <Input
                className="mt-3"
                allowClear
                value={rolesSearch}
                onChange={(event) => setRolesSearch(event.target.value)}
                placeholder="Tìm theo mã / tên"
              />
              <div className="mt-4 max-h-[70vh] overflow-auto">
                <Spin spinning={rolesLoading}>
                  <Radio.Group
                    value={roleId ?? null}
                    onChange={(event) => handleRoleSelect(event.target.value)}
                    className="flex w-full flex-col gap-2"
                  >
                    {roles.map((role) => (
                      <label
                        key={role.id}
                        className={`flex items-center gap-3 rounded border px-3 py-2 transition ${
                          roleId === role.id
                            ? "border-blue-200 bg-blue-50"
                            : "border-slate-200 hover:border-blue-100 hover:bg-slate-50"
                        }`}
                      >
                        <Radio value={role.id} />
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{role.name}</div>
                          <Text type="secondary" className="text-xs">
                            {role.code}
                          </Text>
                        </div>
                        <Tag color={role.status === 1 ? "green" : "red"}>
                          {role.status === 1 ? "Hoạt động" : "Ngừng"}
                        </Tag>
                      </label>
                    ))}
                  </Radio.Group>
                </Spin>
              </div>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-9">
            <RolePermissionMatrixV2
              roleId={roleId ?? null}
              roleName={selectedRole?.name ?? null}
              roleCode={selectedRole?.code ?? null}
            />
          </div>
        </div>
      </div>
    </PermissionGate>
  );
}
