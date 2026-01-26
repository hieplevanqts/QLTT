import React from "react";
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  PlusOutlined,
  StopOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import PageHeader from "@/layouts/PageHeader";
import { PermissionGate, usePermissions } from "../../_shared";
import { useAuth } from "../../../../contexts/AuthContext";
import { useQLTTScope } from "../../../../contexts/QLTTScopeContext";
import {
  subDepartmentsService,
  type SubDepartmentRecord,
  type SubDepartmentPayload,
} from "../services/subDepartments.service";
import {
  subDepartmentUsersService,
  type SubDepartmentMember,
  type UserOption,
} from "../services/subDepartmentUsers.service";

type FormMode = "create" | "edit";

type StatusFilter = "all" | "active" | "inactive";

type FormValues = {
  code: string;
  name: string;
  order_index?: number | null;
  is_active?: boolean;
};

const statusLabel = (value?: boolean | null) => (value ? "Hoạt động" : "Ngừng");

const buildUserLabel = (user: UserOption) => {
  const main = user.full_name || user.username || user.email || user.id;
  const detail = user.email || user.username;
  if (detail && detail !== main) {
    return `${main} (${detail})`;
  }
  return main;
};

export default function DepartmentsPage() {
  const { user } = useAuth();
  const { scope } = useQLTTScope();
  const { hasPermission } = usePermissions();
  const scopeUnitId = scope.teamId || scope.divisionId || user?.departmentInfo?.id || null;

  const [loading, setLoading] = React.useState(false);
  const [subDepartments, setSubDepartments] = React.useState<SubDepartmentRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState<FormMode>("create");
  const [activeTab, setActiveTab] = React.useState("info");
  const [selected, setSelected] = React.useState<SubDepartmentRecord | null>(null);

  const [members, setMembers] = React.useState<SubDepartmentMember[]>([]);
  const [membersLoading, setMembersLoading] = React.useState(false);
  const [memberModalOpen, setMemberModalOpen] = React.useState(false);
  const [memberOptions, setMemberOptions] = React.useState<UserOption[]>([]);
  const [memberLoading, setMemberLoading] = React.useState(false);
  const [memberSelection, setMemberSelection] = React.useState<string[]>([]);

  const [form] = Form.useForm<FormValues>();
  const canCreate = hasPermission("sa.masterdata.department.create");
  const canUpdate = hasPermission("sa.masterdata.department.update");

  const loadSubDepartments = React.useCallback(async () => {
    if (!scopeUnitId) {
      return;
    }
    setLoading(true);
    try {
      const response = await subDepartmentsService.listSubDepartments({
        scopeUnitId,
        search,
        status: statusFilter,
        page,
        pageSize,
      });
      setSubDepartments(response.data);
      setTotal(response.total);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải phòng ban.";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, scopeUnitId, search, statusFilter]);

  React.useEffect(() => {
    void loadSubDepartments();
  }, [loadSubDepartments]);

  const loadMembers = React.useCallback(async (subDepartmentId: string) => {
    setMembersLoading(true);
    try {
      const data = await subDepartmentUsersService.listMembers(subDepartmentId);
      setMembers(data);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải thành viên.";
      message.error(messageText);
    } finally {
      setMembersLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!drawerOpen || !selected || activeTab !== "members") {
      return;
    }
    void loadMembers(selected.id);
  }, [drawerOpen, selected, activeTab, loadMembers]);

  const handleOpenCreate = () => {
    if (!scopeUnitId) {
      message.error("Chưa xác định đơn vị quản lý.");
      return;
    }
    setDrawerMode("create");
    setSelected(null);
    setActiveTab("info");
    form.resetFields();
    form.setFieldsValue({
      is_active: true,
    });
    setDrawerOpen(true);
  };

  const handleOpenEdit = async (record: SubDepartmentRecord) => {
    if (!scopeUnitId) {
      message.error("Chưa xác định đơn vị quản lý.");
      return;
    }
    try {
      const detail = await subDepartmentsService.getSubDepartment(record.id, scopeUnitId);
      if (!detail) {
        message.warning("Không tìm thấy phòng ban.");
        return;
      }
      setDrawerMode("edit");
      setSelected(detail);
      setActiveTab("info");
      form.resetFields();
      form.setFieldsValue({
        code: detail.code,
        name: detail.name,
        order_index: detail.order_index ?? undefined,
        is_active: detail.is_active ?? true,
      });
      setDrawerOpen(true);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải phòng ban.";
      message.error(messageText);
    }
  };

  const handleCloseDrawer = () => {
    if (loading) return;
    setDrawerOpen(false);
    setSelected(null);
    setActiveTab("info");
    setMembers([]);
  };

  const handleSubmit = async () => {
    if (!scopeUnitId) {
      message.error("Chưa xác định đơn vị quản lý.");
      return;
    }
    if (drawerMode === "create" && !canCreate) {
      message.warning("Bạn không có quyền tạo phòng ban.");
      return;
    }
    if (drawerMode === "edit" && !canUpdate) {
      message.warning("Bạn không có quyền cập nhật phòng ban.");
      return;
    }
    try {
      const values = await form.validateFields();
      const payload: SubDepartmentPayload = {
        department_id: scopeUnitId,
        code: values.code.trim(),
        name: values.name.trim(),
        order_index: typeof values.order_index === "number" ? values.order_index : null,
        is_active: values.is_active ?? true,
      };

      if (drawerMode === "create") {
        await subDepartmentsService.createSubDepartment(payload);
        message.success("Tạo phòng ban thành công.");
      } else if (selected) {
        await subDepartmentsService.updateSubDepartment(selected.id, scopeUnitId, payload);
        message.success("Cập nhật phòng ban thành công.");
      }
      setDrawerOpen(false);
      await loadSubDepartments();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể lưu phòng ban.";
      message.error(messageText);
    }
  };

  const handleToggleStatus = async (record: SubDepartmentRecord) => {
    if (!scopeUnitId) {
      message.error("Chưa xác định đơn vị quản lý.");
      return;
    }
    try {
      const nextStatus = !record.is_active;
      await subDepartmentsService.toggleStatus(record.id, scopeUnitId, nextStatus);
      message.success(nextStatus ? "Đã kích hoạt phòng ban." : "Đã ngừng phòng ban.");
      await loadSubDepartments();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể cập nhật trạng thái.";
      message.error(messageText);
    }
  };

  const handleOpenMemberModal = () => {
    setMemberOptions([]);
    setMemberSelection([]);
    setMemberModalOpen(true);
    if (scopeUnitId) {
      void handleSearchUsers("");
    }
  };

  const handleSearchUsers = async (value: string) => {
    if (!scopeUnitId) return;
    setMemberLoading(true);
    try {
      const options = await subDepartmentUsersService.searchUsersInScope(scopeUnitId, value, 20);
      setMemberOptions(options);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tìm người dùng.";
      message.error(messageText);
    } finally {
      setMemberLoading(false);
    }
  };

  const handleSaveMembers = async () => {
    if (!selected || memberSelection.length === 0) {
      setMemberModalOpen(false);
      return;
    }

    try {
      const assignments = await subDepartmentUsersService.getAssignmentsByUserIds(memberSelection);
      const existingByUser = new Map(assignments.map((item) => [item.user_id, item]));
      const toMove = assignments.filter((item) => item.sub_department_id !== selected.id);
      const toInsert = memberSelection.filter((userId) => !existingByUser.has(userId));

      if (toMove.length > 0) {
        const names = toMove
          .map((item) => {
            const option = memberOptions.find((opt) => opt.id === item.user_id);
            const targetName = item.sub_department?.name || item.sub_department?.code || "phòng ban khác";
            return `${option ? buildUserLabel(option) : item.user_id} → ${targetName}`;
          })
          .join(", ");

        const confirmed = await new Promise<boolean>((resolve) => {
          Modal.confirm({
            title: "Chuyển phòng ban cho người dùng?",
            content: `Một số người dùng đang thuộc phòng ban khác: ${names}. Bạn có muốn chuyển sang phòng ban hiện tại không?`,
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });

        if (!confirmed) {
          return;
        }
      }

      const moveIds = toMove.map((item) => item.user_id);
      await Promise.all([
        subDepartmentUsersService.moveUsersToSubDepartment(selected.id, moveIds),
        subDepartmentUsersService.addUsersToSubDepartment(selected.id, toInsert),
      ]);

      message.success("Đã cập nhật thành viên.");
      setMemberModalOpen(false);
      setMemberSelection([]);
      await loadMembers(selected.id);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể cập nhật thành viên.";
      message.error(messageText);
    }
  };

  const handleRemoveMember = async (member: SubDepartmentMember) => {
    if (!selected) return;
    try {
      await subDepartmentUsersService.removeUsersFromSubDepartment(selected.id, [member.user_id]);
      message.success("Đã gỡ thành viên khỏi phòng ban.");
      await loadMembers(selected.id);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể gỡ thành viên.";
      message.error(messageText);
    }
  };

  const columns: ColumnsType<SubDepartmentRecord> = [
    {
      title: "Mã phòng ban",
      dataIndex: "code",
      key: "code",
      width: 180,
      render: (value) => <Typography.Text strong>{value}</Typography.Text>,
    },
    {
      title: "Tên phòng ban",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đơn vị trực thuộc",
      dataIndex: ["department", "name"],
      key: "department",
      render: (_value, record) => record.department?.name || record.department_id,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      width: 140,
      render: (value) => (
        <Tag color={value ? "green" : "default"}>{statusLabel(value)}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_value, record) => (
        <Space>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
            disabled={!canUpdate}
          >
            Sửa
          </Button>
          <Button
            size="small"
            danger={record.is_active ?? false}
            icon={record.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
            onClick={() => void handleToggleStatus(record)}
            disabled={!canUpdate}
          >
            {record.is_active ? "Ngừng" : "Kích hoạt"}
          </Button>
        </Space>
      ),
    },
  ];

  const memberColumns: ColumnsType<SubDepartmentMember> = [
    {
      title: "Họ và tên",
      dataIndex: ["user", "full_name"],
      key: "full_name",
      render: (_value, record) => record.user?.full_name || record.user?.username || record.user?.email || record.user_id,
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Tài khoản",
      dataIndex: ["user", "username"],
      key: "username",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 140,
      render: (_value, record) => (
        <Button size="small" danger onClick={() => void handleRemoveMember(record)}>
          Gỡ
        </Button>
      ),
    },
  ];

  return (
    <PermissionGate permission="sa.masterdata.department.read">
      <div style={{ padding: 24 }}>
        <PageHeader
          title="Quản lý Phòng ban"
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Quản trị hệ thống", href: "/system-admin" },
            { label: "Dữ liệu nền", href: "/system-admin/master-data" },
            { label: "Phòng ban" },
          ]}
        />

        <Card>
          {!scopeUnitId ? (
            <Typography.Text type="danger">
              Chưa xác định đơn vị quản lý. Vui lòng chọn phạm vi ở thanh trên hoặc kiểm tra lại đơn vị của tài khoản.
            </Typography.Text>
          ) : (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
              <Space wrap>
                <Input.Search
                  placeholder="Tìm theo mã, tên phòng ban..."
                  allowClear
                  onSearch={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                  style={{ width: 280 }}
                />
                <Select
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                  options={[
                    { value: "all", label: "Tất cả trạng thái" },
                    { value: "active", label: "Hoạt động" },
                    { value: "inactive", label: "Ngừng" },
                  ]}
                  style={{ width: 180 }}
                />
              </Space>
              <Space>
                <Typography.Text type="secondary">Tổng: {total} phòng ban</Typography.Text>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleOpenCreate}
                  disabled={!canCreate || !scopeUnitId}
                >
                  Thêm phòng ban
                </Button>
              </Space>
            </Space>

            <Table
              rowKey="id"
              columns={columns}
              dataSource={subDepartments}
              loading={loading}
              pagination={{
                current: page,
                pageSize,
                total,
                onChange: (nextPage, nextPageSize) => {
                  setPage(nextPage);
                  if (nextPageSize !== pageSize) {
                    setPageSize(nextPageSize ?? 10);
                  }
                },
              }}
            />
          </Space>
          )}
        </Card>

        <Drawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          width={560}
          title={drawerMode === "create" ? "Thêm phòng ban" : "Chỉnh sửa phòng ban"}
          extra={
            <Space>
              <Button onClick={handleCloseDrawer}>Hủy</Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={(drawerMode === "create" && !canCreate) || (drawerMode === "edit" && !canUpdate)}
              >
                Lưu
              </Button>
            </Space>
          }
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "info",
                label: "Thông tin",
                children: (
                  <Form layout="vertical" form={form}>
                    <Form.Item
                      name="code"
                      label="Mã phòng ban"
                      rules={[{ required: true, message: "Vui lòng nhập mã phòng ban." }]}
                    >
                      <Input placeholder="VD: QT-TH" disabled={drawerMode === "edit"} />
                    </Form.Item>
                    <Form.Item
                      name="name"
                      label="Tên phòng ban"
                      rules={[{ required: true, message: "Vui lòng nhập tên phòng ban." }]}
                    >
                      <Input placeholder="VD: Phòng Tổng hợp" />
                    </Form.Item>
                    <Form.Item name="order_index" label="Thứ tự hiển thị">
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="is_active" label="Trạng thái" valuePropName="checked">
                      <Switch
                        checkedChildren={<CheckCircleOutlined />}
                        unCheckedChildren={<CloseCircleOutlined />}
                      />
                    </Form.Item>
                  </Form>
                ),
              },
              ...(drawerMode === "edit"
                ? [
                    {
                      key: "members",
                      label: `Thành viên (${members.length})`,
                      children: (
                        <Space direction="vertical" style={{ width: "100%" }} size="middle">
                          <Space style={{ width: "100%", justifyContent: "space-between" }}>
                            <Typography.Text type="secondary">
                              Danh sách người dùng trong phòng ban
                            </Typography.Text>
                            <Button icon={<UserAddOutlined />} onClick={handleOpenMemberModal}>
                              Thêm thành viên
                            </Button>
                          </Space>
                          <Table
                            rowKey={(record) => String(record.id)}
                            columns={memberColumns}
                            dataSource={members}
                            loading={membersLoading}
                            pagination={false}
                          />
                        </Space>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </Drawer>

        <Modal
          open={memberModalOpen}
          onCancel={() => setMemberModalOpen(false)}
          onOk={handleSaveMembers}
          okText="Lưu"
          cancelText="Hủy"
          title="Thêm thành viên"
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Typography.Text>
              Chọn người dùng thuộc cùng đơn vị quản lý để thêm vào phòng ban.
            </Typography.Text>
            <Select
              mode="multiple"
              showSearch
              placeholder="Tìm người dùng theo tên/email..."
              filterOption={false}
              onSearch={handleSearchUsers}
              loading={memberLoading}
              options={memberOptions.map((option) => ({
                value: option.id,
                label: buildUserLabel(option),
              }))}
              value={memberSelection}
              onChange={(value) => setMemberSelection(value)}
              style={{ width: "100%" }}
            />
          </Space>
        </Modal>
      </div>
    </PermissionGate>
  );
}
