import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Table, Checkbox, Button, notification, Space, Typography,
  Spin, Layout, Input, Tag, Divider, Empty, Modal, Form, Popconfirm
} from "antd";
import {
  SaveOutlined, SearchOutlined, ReloadOutlined,
  AppstoreOutlined, SettingOutlined, UserOutlined, 
  PlusOutlined, EditOutlined, DeleteOutlined,
  CheckCircleOutlined, StopOutlined
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";

import { rolesService, type RoleRecord } from "../services/roles.service";
import { rolePermissionsService } from "../services/rolePermissions.service";

const { Text, Title } = Typography;
const { Sider, Content } = Layout;

export default function RolePermissionsMatrixPage() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  // States
  const [actions, setActions] = useState<{ id: string, name: string, code: string }[]>([]);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesSearch, setRolesSearch] = useState("");
  const [rawPermissions, setRawPermissions] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [baselineIds, setBaselineIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);

  const selectedRole = useMemo(() => roles.find(r => r.id === roleId), [roles, roleId]);

  const notify = useCallback((type: 'success' | 'error' | 'info', msg: string) => {
    api[type]({
      message: 'Thông báo hệ thống',
      description: msg,
      placement: 'bottomRight',
      duration: 3,
    });
  }, [api]);

  // --- LOGIC QUẢN LÝ ACTIONS ---
  
  const loadInitialData = useCallback(async () => {
    try {
      const actionRes = await rolePermissionsService.listActions();
      setActions((actionRes || []).filter(a => a && a.code));
    } catch (err) {
      notify('error', "Không thể tải danh sách hành động");
    }
  }, [notify]);

  const handlePermissionActionSubmit = async (values: { name: string, code: string }) => {
    try {
      setLoading(true);
      const cleanValues = {
        name: values.name.trim(),
        code: values.code.trim().toUpperCase().replace(/\s/g, '')
      };
  
      if (editingActionId) {
        await rolePermissionsService.updateAction(editingActionId, cleanValues);
        notify('success', 'Cập nhật hành động thành công');
      } else {
        if (actions.some(a => a.code === cleanValues.code)) {
          notify('error', 'Mã hành động này đã tồn tại!');
          setLoading(false);
          return;
        }
        await rolePermissionsService.createAction(cleanValues);
        notify('success', 'Thêm hành động mới thành công');
      }
      form.resetFields();
      setEditingActionId(null);
      await loadInitialData();
    } catch (err) {
      notify('error', 'Thao tác không thành công');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAction = async (code: string) => {
    try {
      await rolePermissionsService.deleteAction(code);
      notify('success', 'Đã xóa hành động');
      loadInitialData();
    } catch (err) {
      notify('error', 'Lỗi: Hành động này đang được sử dụng');
    }
  };

  // --- LOGIC PHÂN QUYỀN MA TRẬN ---

  const loadRoles = useCallback(async () => {
    setRolesLoading(true);
    try {
      const result = await rolesService.listRoles({ q: rolesSearch, page: 1, pageSize: 100 });
      setRoles(result.data || []);
    } catch (err) {
      notify('error', "Lỗi tải danh sách vai trò");
    } finally {
      setRolesLoading(false);
    }
  }, [rolesSearch, notify]);

  useEffect(() => {
    loadInitialData();
    loadRoles();
  }, [loadInitialData, loadRoles]);

  const fetchPermissionData = useCallback(async () => {
    if (!roleId) return;
    setLoading(true);
    try {
      const [perms, mods, assignedIdsArray] = await Promise.all([
        rolePermissionsService.listPermissions(),
        rolePermissionsService.listModules(),
        rolePermissionsService.listRolePermissionIds(roleId)
      ]);
      setRawPermissions(perms || []);
      setModules(mods || []);
      const assignedSet = new Set(assignedIdsArray);
      setAssignedIds(assignedSet);
      setBaselineIds(new Set(assignedSet));
    } catch (err) {
      notify('error', "Lỗi đồng bộ dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [roleId, notify]);

  useEffect(() => { fetchPermissionData(); }, [fetchPermissionData]);

  const handleSave = async () => {
    if (!roleId) return;
    const toAdd = Array.from(assignedIds).filter(id => !baselineIds.has(id));
    const toRemove = Array.from(baselineIds).filter(id => !assignedIds.has(id));

    if (toAdd.length === 0 && toRemove.length === 0) {
      notify('info', "Không có thay đổi nào.");
      return;
    }

    setLoading(true);
    try {
      if (toAdd.length > 0) await rolePermissionsService.addRolePermissions(roleId, toAdd);
      if (toRemove.length > 0) await rolePermissionsService.removeRolePermissions(roleId, toRemove);
      notify('success', "Lưu thành công!");
      setBaselineIds(new Set(assignedIds));
    } catch (err) {
      notify('error', "Lỗi khi lưu dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC CHỌN TẤT CẢ ---

  const allPermissionIds = useMemo(() => rawPermissions.map(p => p.id), [rawPermissions]);
  
  const isAllChecked = useMemo(() => 
    allPermissionIds.length > 0 && allPermissionIds.every(id => assignedIds.has(id)), 
    [allPermissionIds, assignedIds]
  );

  const handleSelectAllHeader = (checked: boolean) => {
    const next = new Set(assignedIds);
    allPermissionIds.forEach(id => checked ? next.add(id) : next.delete(id));
    setAssignedIds(next);
  };

  const getColumnPermissionIds = useCallback((actionCode: string) => {
    return rawPermissions
      .filter(p => p.permission_type?.toUpperCase() === actionCode.toUpperCase())
      .map(p => p.id);
  }, [rawPermissions]);

  const handleSelectColumn = (actionCode: string, checked: boolean) => {
    const columnIds = getColumnPermissionIds(actionCode);
    const next = new Set(assignedIds);
    columnIds.forEach(id => checked ? next.add(id) : next.delete(id));
    setAssignedIds(next);
  };

  const treeDataSource = useMemo(() => {
    if (!modules.length) return [];
    const permMap = new Map();
    rawPermissions.forEach(p => {
      const mId = p.module_id;
      if (!permMap.has(mId)) permMap.set(mId, {});
      if (p.permission_type) permMap.get(mId)[p.permission_type.toUpperCase()] = p;
    });

    const buildTree = (parentId: any = null): any[] => {
      return modules
        .filter(m => (!parentId ? (!m.parent_id || m.parent_id === "0") : m.parent_id === parentId))
        .map(m => {
          const children = buildTree(m.id);
          return {
            ...m,
            key: m.id,
            isParent: children.length > 0,
            permissions: permMap.get(m.id) || {},
            children: children.length > 0 ? children : undefined,
          };
        });
    };
    return buildTree(null);
  }, [modules, rawPermissions]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: <span style={{ fontSize: '15px', fontWeight: 800 }}>MODULE</span>,
        dataIndex: "name",
        key: "name",
        width: 300,
        render: (text: string, record: any) => (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start', 
            justifyContent: 'center',
            textAlign: 'left',
            lineHeight: '1.2'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {record.isParent && <AppstoreOutlined style={{ marginRight: 8, color: '#1677ff', fontSize: '16px' }} />}
              <Text strong style={{ 
                fontSize: '14px', 
                color: record.isParent ? "#1677ff" : "inherit",
                margin: 0
              }}>
                {text}
              </Text>
            </div>
            <Text style={{ 
              fontSize: '11px', 
              color: '#8c8c8c', 
              margin: 0,
              paddingLeft: record.isParent ? '24px' : '0px' // Đẩy text nhỏ sang để thẳng hàng với text to bên dưới icon
            }}>
              {record.code}
            </Text>
          </div>
        )
      },
      {
        title: (
          <Space orientation="vertical" size={4} align="center">
            <span style={{ fontSize: '11px', fontWeight: 800 }}>TẤT CẢ</span>
            <Checkbox className="custom-cb-size" checked={isAllChecked} onChange={(e) => handleSelectAllHeader(e.target.checked)} />
          </Space>
        ),
        key: "selectAll",
        align: "center" as const,
        width: 80,
        render: (_: any, record: any) => {
          const rowPerms = Object.values(record.permissions) as any[];
          if (rowPerms.length === 0) return null;
          return (
            <Checkbox 
              className="custom-cb-size"
              checked={rowPerms.every(p => assignedIds.has(p.id))}
              onChange={(e) => {
                const next = new Set(assignedIds);
                rowPerms.forEach(p => e.target.checked ? next.add(p.id) : next.delete(p.id));
                setAssignedIds(next);
              }}
            />
          );
        }
      }
    ];

    const actionColumns = actions.map(act => {
      const safeCode = (act?.code || "").toUpperCase();
      const colIds = getColumnPermissionIds(safeCode);
      const isColChecked = colIds.length > 0 && colIds.every(id => assignedIds.has(id));

      return {
        title: (
          <Space orientation="vertical" size={4} align="center">
            <span style={{ fontSize: '12px', fontWeight: 800 }}>{(act?.name || "N/A").toUpperCase()}</span>
            <Checkbox 
              className="custom-cb-size" 
              checked={isColChecked} 
              onChange={(e) => handleSelectColumn(safeCode, e.target.checked)} 
            />
          </Space>
        ),
        key: act.code,
        align: "center" as const,
        width: 100,
        render: (_: any, record: any) => {
          const permission = record.permissions[safeCode];
          if (!permission) return null;
          return (
            <Checkbox
              className="custom-cb-size"
              checked={assignedIds.has(permission.id)}
              onChange={(e) => {
                const next = new Set(assignedIds);
                e.target.checked ? next.add(permission.id) : next.delete(permission.id);
                setAssignedIds(next);
              }}
            />
          );
        }
      };
    });

    return [...baseColumns, ...actionColumns];
  }, [actions, assignedIds, isAllChecked, getColumnPermissionIds]);

  return (
    <Layout style={{ height: 'calc(100vh - 10px)', background: '#f5f5f5', padding: '12px' }}>
      {contextHolder}
      
      <Sider width={280} theme="light" style={{ borderRadius: 10, marginRight: 12, border: '1px solid #d9d9d9' }}>
        <div style={{ padding: '16px' }}>
          <Title level={5} style={{ marginBottom: 12 }}><UserOutlined /> Danh sách Vai trò</Title>
          <Input prefix={<SearchOutlined />} placeholder="Tìm vai trò..." size="large" onChange={e => setRolesSearch(e.target.value)} allowClear />
        </div>
        <Divider style={{ margin: '0' }} />
        <div style={{ height: 'calc(100vh - 120px)', overflowY: 'auto', padding: '10px' }}>
          <Spin spinning={rolesLoading}>
            {roles.map(role => (
              <div key={role.id} className={`role-item-box ${roleId === role.id ? 'active' : ''}`} onClick={() => navigate(`/system-admin/iam/role-permissions/new/${role.id}`)}>
                <div style={{ flex: 1 }}>
                  <div className="role-main-name">{role.name}</div>
                  <div className="role-sub-code">{role.code}</div>
                </div>
                {role.status === 1 ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <StopOutlined style={{ color: '#ff4d4f' }} />}
              </div>
            ))}
          </Spin>
        </div>
      </Sider>

      <Content style={{ borderRadius: 10, background: '#fff', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
        {roleId ? (
          <>
            <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', borderBottom: '2px solid #e8e8e8' }}>
              <Space size={16}>
                <div style={{ background: '#1677ff', padding: '8px', borderRadius: '8px' }}><SettingOutlined style={{ fontSize: '20px', color: '#fff' }} /></div>
                <div>
                  <Title level={4} style={{ margin: 0, fontSize: '18px' }}>Ma trận phân quyền</Title>
                  <Tag color="geekblue" style={{ fontWeight: 700 }}>{selectedRole?.name || "..."}</Tag>
                </div>
              </Space>
              <Space>
                <Button size="large" icon={<ReloadOutlined />} onClick={fetchPermissionData}>Tải lại</Button>
                <Button size="large" icon={<PlusOutlined />} onClick={() => { setIsActionModalOpen(true); form.resetFields(); setEditingActionId(null); }}>Hành động</Button>
                <Button type="primary" size="large" icon={<SaveOutlined />} onClick={handleSave} loading={loading}>LƯU THAY ĐỔI</Button>
              </Space>
            </div>
            
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
              <Spin spinning={loading}>
                <Table
                  bordered
                  size="middle"
                  className="heavy-header-table"
                  dataSource={treeDataSource}
                  columns={columns}
                  pagination={false}
                  scroll={{ x: 'max-content', y: 'calc(100vh - 180px)' }}
                  expandable={{ indentSize: 20, defaultExpandAllRows: true }}
                />
              </Spin>
            </div>
          </>
        ) : (
          <Empty style={{ marginTop: 180 }} description="Chọn vai trò để bắt đầu" />
        )}
      </Content>

      <Modal
        title="Quản lý các loại Quyền (Actions)"
        open={isActionModalOpen}
        onCancel={() => setIsActionModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handlePermissionActionSubmit} style={{ background: '#f9f9f9', padding: 20, borderRadius: 8, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="name" label="Tên (Hiển thị)" rules={[{ required: true, message: 'Bắt buộc!' }, { max: 20, message: 'Tối đa 20 ký tự!' }]} style={{ flex: 1 }}>
              <Input placeholder="Ví dụ: Phê duyệt" />
            </Form.Item>
            <Form.Item name="code" label="Mã (In hoa, không dấu)" rules={[{ required: true, message: 'Bắt buộc!' }, { pattern: /^[A-Z0-9_]+$/, message: 'Sai định dạng!' }, { max: 20, message: 'Tối đa 20 ký tự!' }]} style={{ flex: 1 }}>
              <Input placeholder="APPROVE" onChange={(e) => form.setFieldsValue({ code: e.target.value.toUpperCase().replace(/\s/g, '') })} />
            </Form.Item>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Space>
              {editingActionId && <Button onClick={() => { setEditingActionId(null); form.resetFields(); }}>Hủy</Button>}
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>{editingActionId ? 'Cập nhật' : 'Thêm mới'}</Button>
            </Space>
          </div>
        </Form>
        <Table
          dataSource={actions}
          size="small"
          rowKey="id"
          columns={[
            { title: 'Tên', dataIndex: 'name' },
            { title: 'Code', dataIndex: 'code', render: (c) => <Tag color="blue">{c}</Tag> },
            {
              title: 'Thao tác',
              align: 'center',
              render: (_, rec) => (
                <Space>
                  <Button type="text" icon={<EditOutlined />} onClick={() => { setEditingActionId(rec.code); form.setFieldsValue(rec); }} />
                  <Popconfirm title="Xóa hành động này?" onConfirm={() => handleDeleteAction(rec.code)}>
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              )
            }
          ]}
        />
      </Modal>

      <style>{`
        .custom-cb-size { transform: scale(1.4); }
        .role-item-box { padding: 12px 16px; margin-bottom: 8px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: 0.2s; border: 1px solid #f0f0f0; }
        .role-item-box:hover { background: #f0f7ff; border-color: #1677ff; }
        .role-item-box.active { background: #e6f7ff; border-color: #1677ff; border-width: 2px; }
        .role-main-name { font-weight: 700; font-size: 15px; }
        .heavy-header-table .ant-table-thead > tr > th { padding: 12px 4px !important; background: #f0f5ff !important; text-align: center !important; border-bottom: 2px solid #adc6ff !important; }
        .heavy-header-table .ant-table-thead > tr > th:first-child { text-align: left !important; padding-left: 16px !important; }
        .heavy-header-table .ant-table-tbody > tr > td { padding: 8px 4px !important; text-align: center !important; }
        .heavy-header-table .ant-table-tbody > tr > td:first-child { text-align: left !important; padding-left: 16px !important; }
        .heavy-header-table .ant-table-tbody > tr:hover > td { background-color: #f0faff !important; }
      `}</style>
    </Layout>
  );
}