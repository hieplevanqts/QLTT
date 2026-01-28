import React from "react";
import { Button, Input, Modal, Space, Tag, Transfer, Typography, message } from "antd";
import type { TransferDirection, TransferItem } from "antd/es/transfer";

import type { RoleRecord } from "../services/roles.service";
import { roleUsersService, type RoleUserLite } from "../services/roleUsers.service";

type RoleUserAssignmentModalProps = {
  open: boolean;
  role: RoleRecord | null;
  onClose: () => void;
  onSaved?: () => void;
};

type TransferUserItem = TransferItem & {
  raw: RoleUserLite;
};

const statusTag = (status: number) => {
  if (status === 1) return <Tag color="green">Hoạt động</Tag>;
  if (status === 0) return <Tag color="orange">Tạm dừng</Tag>;
  if (status === 2) return <Tag color="red">Khóa</Tag>;
  return <Tag>Không rõ</Tag>;
};

const toTransferItem = (user: RoleUserLite): TransferUserItem => {
  const username = user.username || "(không có username)";
  const fullName = user.full_name || "Chưa cập nhật";
  const email = user.email || "-";
  return {
    key: user.id,
    title: `${username} — ${fullName}`,
    description: email,
    raw: user,
  };
};

const filterTransferItems = (items: TransferUserItem[], query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => {
    const { username, full_name, email } = item.raw;
    return (
      (username || "").toLowerCase().includes(q) ||
      (full_name || "").toLowerCase().includes(q) ||
      (email || "").toLowerCase().includes(q)
    );
  });
};

export default function RoleUserAssignmentModal({ open, role, onClose, onSaved }: RoleUserAssignmentModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [users, setUsers] = React.useState<TransferUserItem[]>([]);
  const [originalUserIds, setOriginalUserIds] = React.useState<string[]>([]);
  const [targetKeys, setTargetKeys] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");

  const hasChanges = React.useMemo(() => {
    if (originalUserIds.length !== targetKeys.length) return true;
    const originalSet = new Set(originalUserIds);
    return targetKeys.some((id) => !originalSet.has(id));
  }, [originalUserIds, targetKeys]);

  const loadData = React.useCallback(async () => {
    if (!role?.id) return;
    setLoading(true);
    try {
      const result = await roleUsersService.loadRoleUserAssignment(role.id);
      const items = result.users.map(toTransferItem);
      setUsers(items);
      setOriginalUserIds(result.assignedUserIds);
      setTargetKeys(result.assignedUserIds);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải danh sách người dùng.";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, [role?.id]);

  React.useEffect(() => {
    if (!open) return;
    void loadData();
  }, [open, loadData]);

  React.useEffect(() => {
    if (open) return;
    setUsers([]);
    setOriginalUserIds([]);
    setTargetKeys([]);
    setSearch("");
  }, [open]);

  const handleSave = async () => {
    if (!role?.id) return;
    setSaving(true);
    try {
      await roleUsersService.saveRoleUsers(role.id, targetKeys, originalUserIds);
      message.success("Đã cập nhật người dùng cho vai trò.");
      setOriginalUserIds(targetKeys);
      onSaved?.();
      onClose();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể lưu gán người dùng.";
      message.error(messageText);
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = React.useMemo(() => filterTransferItems(users, search), [users, search]);

  const handleChange = (nextTargetKeys: string[], _direction: TransferDirection, _moveKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={role ? `Gán người dùng cho vai trò: ${role.name}` : "Gán người dùng"}
      width={980}
      centered
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={onClose} disabled={saving}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={saving} disabled={!hasChanges || loading}>
          Lưu thay đổi
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }} wrap>
          <Input
            placeholder="Tìm theo username, họ tên, email..."
            allowClear
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: 320 }}
            disabled={loading}
          />
          <Typography.Text type="secondary">
            Đã chọn: <strong>{targetKeys.length}</strong>
          </Typography.Text>
        </Space>

        <Transfer
          dataSource={filteredItems}
          targetKeys={targetKeys}
          onChange={handleChange}
          showSearch={false}
          titles={["Tất cả người dùng", "Thuộc vai trò"]}
          render={(item) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 600 }}>{item.title}</span>
              <Space size={6} wrap>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {item.description || "-"}
                </Typography.Text>
                {statusTag((item as TransferUserItem).raw.status)}
              </Space>
            </div>
          )}
          listStyle={{
            width: 430,
            height: 440,
          }}
          disabled={loading || saving}
        />
      </Space>
    </Modal>
  );
}
