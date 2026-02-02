import {
  Alert,
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Tag,
  message,
} from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/layouts/PageHeader";
import { MenuDetailTabs } from "../components/MenuDetailTabs";
import { MenuTree } from "../components/MenuTree";
import type { PreviewListItem, PreviewReason, PreviewTreeNode } from "../components/RolePreviewPanel";
import { useMenuDetail } from "../hooks/useMenuDetail";
import { useMenuTree } from "../hooks/useMenuTree";
import { menuService } from "../services/supabase/menu.service";
import type { MenuNode, MenuRecord } from "../menu.types";
import styles from "./MenuAdminPage.module.css";
import { clearAllMenuCache, emitMenuUpdated } from "@/shared/menu/menuCache";
import { getIconComponent } from "../../components/iconRegistry";
import { supabase } from "@/api/supabaseClient";
import { IconPickerModal } from "../../components/IconPickerModal";

const toTreeData = (
  nodes: MenuRecord[],
  options: {
    showPermissionStatus?: boolean;
    onAction?: (action: string, node: MenuRecord) => void;
  } = {},
): DataNode[] =>
  nodes.map((node: any) => {
    const hasPermission =
      Boolean(node.permission_ids?.length) || Boolean(node.permission_codes?.length);
    const showPermissionStatus = options.showPermissionStatus !== false;
    const Icon = getIconComponent(node.icon);
    const items = [
      { key: "add-child", label: "Thêm menu con" },
      { key: "edit", label: "Sửa menu" },
      { key: "delete", label: "Xoá menu", danger: true },
    ];
    const content = (
      <div className="flex items-center gap-2">
        {Icon ? <Icon size={16} /> : null}
        <span>{node.name}</span>
        {showPermissionStatus ? (
          <Tag color={hasPermission ? "green" : "orange"}>
            {hasPermission ? "Đã gán quyền" : "Chưa gán quyền"}
          </Tag>
        ) : null}
      </div>
    );
    return {
      key: node._id,
      title: options.onAction ? (
        <Dropdown
          trigger={["contextMenu"]}
          menu={{
            items,
            onClick: ({ key }) => options.onAction?.(String(key), node),
          }}
        >
          {content}
        </Dropdown>
      ) : (
        content
      ),
      children: node.children ? toTreeData(node.children, options) : undefined,
    };
  });

type MenuFormValues = {
  code: string;
  name: string;
  path: string;
  module_id: string;
  icon?: string | null;
  parent_id?: string | null;
  order_index?: number | null;
  is_active?: boolean;
};

const makeMenuCodeFromPath = (path: string | undefined, moduleKey?: string | null) => {
  const raw = String(path ?? "").trim();
  if (!raw) return "";
  const cleaned = raw.startsWith("/") ? raw : `/${raw}`;
  const dots = cleaned
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_"),
    )
    .filter(Boolean)
    .join(".");
  const safeModule = String(moduleKey ?? "").trim().toLowerCase();
  if (!safeModule) return dots || "root";
  if (dots.startsWith(`${safeModule}.`)) {
    const suffix = dots.slice(safeModule.length + 1);
    return `${safeModule}.${suffix || "root"}`;
  }
  if (dots === safeModule) {
    return `${safeModule}.root`;
  }
  return `${safeModule}.${dots || "root"}`;
};

const MenuAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [treeSearch, setTreeSearch] = React.useState<string>("");
  const [treeStatus, setTreeStatus] = React.useState<string>("all");
  const [treeGroup, setTreeGroup] = React.useState<string>("all");
  const [treeModule, setTreeModule] = React.useState<string>("all");
  const [selectedMenu, setSelectedMenu] = React.useState<MenuRecord | null>(null);
  const [roles, setRoles] = React.useState<Array<{ _id: string; name: string }>>([]);
  const [previewRoleId, setPreviewRoleId] = React.useState<string | undefined>(undefined);
  const [previewRoleCodes, setPreviewRoleCodes] = React.useState<string[]>([]);
  const [previewRoleLoading, setPreviewRoleLoading] = React.useState(false);
  const [previewMenuPermLoading, setPreviewMenuPermLoading] = React.useState(false);
  const [previewMenuPermMap, setPreviewMenuPermMap] = React.useState<Record<string, string>>({});
  const [historyRows, setHistoryRows] = React.useState<Array<any>>([]);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [assigningModule, setAssigningModule] = React.useState(false);
  const [autoSelectEnabled, setAutoSelectEnabled] = React.useState(true);
  const [detailTab, setDetailTab] = React.useState("info");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingMenu, setEditingMenu] = React.useState<MenuRecord | null>(null);
  const [createAdvanced, setCreateAdvanced] = React.useState(false);
  const [editAdvanced, setEditAdvanced] = React.useState(false);
  const [iconPickerTarget, setIconPickerTarget] = React.useState<"create" | "edit" | null>(null);
  const [createLoading, setCreateLoading] = React.useState(false);
  const [editLoading, setEditLoading] = React.useState(false);
  const [createForm] = Form.useForm<MenuFormValues>();
  const [editForm] = Form.useForm<MenuFormValues>();
  const createIconValue = Form.useWatch("icon", createForm) as string | null | undefined;
  const editIconValue = Form.useWatch("icon", editForm) as string | null | undefined;
  const CreateIconPreview = getIconComponent(createIconValue ?? null);
  const EditIconPreview = getIconComponent(editIconValue ?? null);

  const { flatMenus, treeMenus, modules, loading, selectedMenuId, setSelectedMenuId, refreshMenus } =
    useMenuTree();
  const {
    menu: menuDetail,
    assignedPermissions,
    saving,
    saveMenu,
    savePermissions,
    loading: detailLoading,
    error: detailError,
    reload: reloadDetail,
  } = useMenuDetail(selectedMenuId);

  React.useEffect(() => {
    const current = menuDetail ?? flatMenus.find((menu) => menu._id === selectedMenuId) ?? null;
    setSelectedMenu(current);
    if (autoSelectEnabled && !selectedMenuId && flatMenus.length > 0) {
      setSelectedMenuId(flatMenus[0]._id);
    }
  }, [autoSelectEnabled, flatMenus, selectedMenuId, modules, menuDetail]);

  React.useEffect(() => {
    void (async () => {
      try {
        const rows = await menuService.listRoles();
        setRoles(rows.map((row) => ({ _id: row._id, name: row.name })));
      } catch {
        setRoles([]);
      }
    })();
  }, []);

  React.useEffect(() => {
    void (async () => {
      setHistoryLoading(true);
      try {
        const rows = await menuService.listMenuHistory(20);
        setHistoryRows(rows);
      } catch {
        setHistoryRows([]);
      } finally {
        setHistoryLoading(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (!previewRoleId) {
      setPreviewRoleCodes([]);
      return;
    }
    let active = true;
    void (async () => {
      setPreviewRoleLoading(true);
      try {
        const { data, error } = await supabase
          .from("role_permissions")
          .select("permissions:permission_id(code, category, status)")
          .eq("role_id", previewRoleId)
          .eq("permissions.category", "PAGE")
          .eq("permissions.status", 1);
        if (error) throw error;
        const codes = (data ?? [])
          .map((row: any) => row.permissions?.code)
          .filter(Boolean);
        if (active) setPreviewRoleCodes(codes);
      } catch {
        if (active) setPreviewRoleCodes([]);
      } finally {
        if (active) setPreviewRoleLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [previewRoleId]);

  React.useEffect(() => {
    if (!flatMenus.length) {
      setPreviewMenuPermMap({});
      return;
    }
    let active = true;
    void (async () => {
      setPreviewMenuPermLoading(true);
      try {
        const menuIds = flatMenus.map((menu) => menu._id).filter(Boolean);
        if (!menuIds.length) {
          if (active) setPreviewMenuPermMap({});
          return;
        }
        const { data, error } = await supabase
          .from("menu_permissions")
          .select("menu_id, permissions:permission_id(code, category, status)")
          .in("menu_id", menuIds)
          .eq("permissions.category", "PAGE")
          .eq("permissions.status", 1);
        if (error) throw error;
        const map: Record<string, string> = {};
        (data ?? []).forEach((row: any) => {
          const code = row.permissions?.code;
          if (!code || !row.menu_id) return;
          if (!map[row.menu_id]) {
            map[row.menu_id] = code;
          }
        });
        if (active) setPreviewMenuPermMap(map);
      } catch {
        if (active) setPreviewMenuPermMap({});
      } finally {
        if (active) setPreviewMenuPermLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [flatMenus]);

  const moduleLookup = React.useMemo(
    () => new Map(modules.map((mod) => [mod._id, mod])),
    [modules],
  );

  const previewList = React.useMemo<PreviewListItem[]>(() => {
    const roleSet = new Set(previewRoleCodes.map((code) => code.toLowerCase()));
    return flatMenus.map((menu) => {
      const module = menu.module_id ? moduleLookup.get(menu.module_id) : undefined;
      const moduleKey = module?.key ?? module?.code ?? menu.module_code ?? null;
      const moduleName = module?.name ?? menu.module_name ?? null;
      const requiredPermission = previewMenuPermMap[menu._id] ?? null;
      let visible = true;
      let reason: PreviewReason | undefined;

      if (menu.is_active === false) {
        visible = false;
        reason = "MENU_INACTIVE";
      } else if (!requiredPermission) {
        visible = false;
        reason = "MENU_NO_PERMISSION";
      } else if (!roleSet.has(requiredPermission.toLowerCase())) {
        visible = false;
        reason = "MISSING_PAGE_PERMISSION";
      }

      return {
        menuId: menu._id,
        name: menu.name ?? menu.code ?? "",
        path: menu.path ?? null,
        moduleKey,
        moduleName,
        requiredPermission,
        visible,
        reason,
      };
    });
  }, [flatMenus, moduleLookup, previewMenuPermMap, previewRoleCodes]);

  const previewStats = React.useMemo(() => {
    if (!previewRoleId) {
      return { seen: 0, hidden: 0, noPermission: 0 };
    }
    const seen = previewList.filter((item) => item.visible).length;
    const hidden = previewList.length - seen;
    const noPermission = previewList.filter((item) => item.reason === "MENU_NO_PERMISSION").length;
    return { seen, hidden, noPermission };
  }, [previewList, previewRoleId]);

  const previewMap = React.useMemo(
    () => new Map(previewList.map((item) => [item.menuId, item])),
    [previewList],
  );

  const previewTree = React.useMemo<PreviewTreeNode[]>(() => {
    const buildNodes = (nodes: MenuNode[]): PreviewTreeNode[] =>
      nodes.map((menu) => {
        const info = previewMap.get(menu._id);
        const children = menu.children ? buildNodes(menu.children) : [];
        return {
          key: menu._id,
          title: menu.name ?? menu.code ?? "",
          menuId: menu._id,
          name: menu.name ?? menu.code ?? "",
          path: menu.path ?? null,
          moduleKey: info?.moduleKey ?? null,
          moduleName: info?.moduleName ?? null,
          requiredPermission: info?.requiredPermission ?? null,
          visible: info?.visible ?? false,
          reason: info?.reason,
          children: children.length ? children : undefined,
        };
      });
    return buildNodes(treeMenus);
  }, [previewMap, treeMenus]);

  const previewLoading = previewRoleLoading || previewMenuPermLoading;

  const handleTreeSelect = (keys: React.Key[]) => {
    const key = keys[0];
    if (typeof key === "string") {
      setAutoSelectEnabled(true);
      setSelectedMenuId(key);
    }
  };

  const handlePreviewFocusMenu = React.useCallback(
    (menuId: string) => {
      setAutoSelectEnabled(true);
      setSelectedMenuId(menuId);
      setDetailTab("permissions");
    },
    [setSelectedMenuId],
  );

  const handleOpenRolePermissions = React.useCallback(
    (roleId: string, moduleKey?: string | null) => {
      if (!roleId) return;
      const moduleParam = moduleKey ? `?module=${encodeURIComponent(moduleKey)}` : "";
      navigate(`/system-admin/iam/role-permissions/${roleId}${moduleParam}`);
    },
    [navigate],
  );

  const handleTreeAction = (action: string, node: MenuRecord) => {
    if (action === "add-child") {
      openCreateModal({ parent_id: node._id, module_id: node.module_id ?? undefined });
      return;
    }
    if (action === "edit") {
      setAutoSelectEnabled(true);
      setSelectedMenuId(node._id);
      openEditModal(node);
      return;
    }
    if (action === "delete") {
      handleDeleteMenu(node);
    }
  };

  const notifyMenuUpdated = () => {
    clearAllMenuCache();
    emitMenuUpdated();
  };

  const suggestedModule = React.useMemo(() => {
    if (!selectedMenu?.path || selectedMenu?.module_id) return null;
    const trimmed = String(selectedMenu.path ?? "").trim();
    if (!trimmed) return null;
    const cleaned = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    const segments = cleaned.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
    if (!segments.length) return null;
    const key = segments[0];
    return modules.find((mod) => (mod.key ?? mod.code) === key) ?? null;
  }, [modules, selectedMenu]);

  const parentOptions = React.useMemo(
    () =>
      flatMenus.map((menu) => ({
        value: menu._id,
        label: menu.name,
      })),
    [flatMenus],
  );

  const editParentOptions = React.useMemo(
    () => parentOptions.filter((item) => item.value !== editingMenu?._id),
    [parentOptions, editingMenu?._id],
  );

  const handleAssignModuleByRoute = async () => {
    if (!selectedMenu?._id || !suggestedModule?._id) return;
    setAssigningModule(true);
    try {
      await saveMenu({ module_id: suggestedModule._id });
      await reloadDetail();
      await handleRefresh();
      notifyMenuUpdated();
      message.success("Đã gán phân hệ theo route.");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể gán phân hệ theo route.");
    } finally {
      setAssigningModule(false);
    }
  };

  const resetCreateForm = React.useCallback(
    (defaults?: Partial<MenuFormValues>) => {
      createForm.resetFields();
      setCreateAdvanced(false);
      createForm.setFieldsValue({
        name: "",
        path: "",
        module_id: defaults?.module_id ?? undefined,
        icon: defaults?.icon ?? null,
        parent_id: defaults?.parent_id ?? null,
        order_index: defaults?.order_index ?? 0,
        is_active: true,
        code: "",
      });
    },
    [createForm],
  );

  const openCreateModal = (defaults?: Partial<MenuFormValues>) => {
    resetCreateForm(defaults);
    setCreateOpen(true);
  };

  const openEditModal = (menu: MenuRecord) => {
    setEditingMenu(menu);
    editForm.setFieldsValue({
      code: menu.code ?? "",
      name: menu.name ?? "",
      path: menu.path ?? "",
      module_id: menu.module_id ?? undefined,
      icon: menu.icon ?? null,
      parent_id: menu.parent_id ?? null,
      order_index: menu.order_index ?? 0,
      is_active: menu.is_active ?? true,
    });
    setEditAdvanced(false);
    setEditOpen(true);
  };

  const handleDeleteMenu = (menu: MenuRecord) => {
    Modal.confirm({
      title: "Xoá menu?",
      content: "Menu con (nếu có) sẽ bị xoá theo. Quyền hiển thị (menu_permissions) cũng bị xoá.",
      okText: "Xoá",
      cancelText: "Huỷ",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const { error } = await supabase.from("menus").delete().eq("_id", menu._id);
          if (error) throw error;
          if (selectedMenuId === menu._id) {
            setSelectedMenuId(undefined);
            setAutoSelectEnabled(false);
          }
          await handleRefresh();
          notifyMenuUpdated();
          message.success("Đã xoá menu.");
        } catch (err) {
          message.error(err instanceof Error ? err.message : "Không thể xoá menu.");
        }
      },
    });
  };

  const isDescendant = React.useCallback(
    (parentId: string | null, dragId: string) => {
      if (!parentId) return false;
      const map = new Map(flatMenus.map((menu) => [menu._id, menu]));
      let current: string | null = parentId;
      while (current) {
        if (current === dragId) return true;
        const next = map.get(current)?.parent_id ?? null;
        current = next;
      }
      return false;
    },
    [flatMenus],
  );

  const handleDrop: TreeProps["onDrop"] = async (info) => {
    const dragNode = info.dragNode as any;
    const dropNode = info.node as any;
    const dragId = dragNode.key as string;
    const dropId = dropNode.key as string;

    if (dragId === dropId) return;

    const menuMap = new Map(flatMenus.map((menu) => [menu._id, menu]));
    const dropMenu = menuMap.get(dropId);
    const dropParentId = info.dropToGap ? dropMenu?.parent_id ?? null : dropId;
    if (isDescendant(dropParentId, dragId)) {
      message.warning("Không thể chuyển menu vào chính nhánh con của nó.");
      return;
    }

    const siblings = flatMenus
      .filter((menu) => (menu.parent_id ?? null) === dropParentId && menu._id !== dragId)
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

    let targetIndex = siblings.findIndex((menu) => menu._id === dropId);
    if (targetIndex === -1) {
      targetIndex = siblings.length;
    } else if (info.dropToGap && info.dropPosition > 0) {
      targetIndex += 1;
    }

    try {
      await menuService.moveMenu(dragId, dropParentId, targetIndex);
      await handleRefresh();
      notifyMenuUpdated();
      message.success("Đã cập nhật vị trí menu.");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể cập nhật menu.");
    }
  };

  const handleAssignSelected = async (ids?: string[]) => {
    if (!selectedMenuId) return;
    const currentModule = selectedMenu?.module_id
      ? modules.find((mod) => mod._id === selectedMenu.module_id)
      : undefined;
    if (!selectedMenu?.module_id || !currentModule?.key) {
      message.warning("Chọn phân hệ trước.");
      return;
    }
    const targetIds = ids && ids.length ? ids : [];
    if (!targetIds.length) return;
    const pageAssigned = assignedPermissions
      .filter((perm) => String(perm.category ?? "").toUpperCase() === "PAGE")
      .map((perm) => perm._id);
    const existing =
      pageAssigned.length > 0
        ? pageAssigned
        : (selectedMenu?.permission_ids ?? []).filter(Boolean);
    const merged = Array.from(new Set([...existing, ...targetIds]));
    await savePermissions(merged);
    await refreshMenus({
      search: treeSearch || undefined,
      status: treeStatus !== "all" ? treeStatus : undefined,
      moduleGroup: treeGroup !== "all" ? treeGroup : undefined,
      moduleId: treeModule !== "all" ? treeModule : undefined,
    });
    notifyMenuUpdated();
    message.success("Đã cập nhật quyền hiển thị.");
  };

  const createPathValue = Form.useWatch("path", createForm);
  const createModuleId = Form.useWatch("module_id", createForm);
  const editPathValue = Form.useWatch("path", editForm);
  const editModuleId = Form.useWatch("module_id", editForm);

  React.useEffect(() => {
    if (!createOpen || createAdvanced) return;
    const moduleKey =
      modules.find((mod) => mod._id === createModuleId)?.key ??
      modules.find((mod) => mod._id === createModuleId)?.code ??
      null;
    const nextCode = makeMenuCodeFromPath(createPathValue, moduleKey);
    if (!nextCode) return;
    if (createForm.getFieldValue("code") !== nextCode) {
      createForm.setFieldsValue({ code: nextCode });
    }
  }, [createAdvanced, createForm, createModuleId, createOpen, createPathValue, modules]);

  React.useEffect(() => {
    if (!editOpen || editAdvanced) return;
    const moduleKey =
      modules.find((mod) => mod._id === editModuleId)?.key ??
      modules.find((mod) => mod._id === editModuleId)?.code ??
      null;
    const nextCode = makeMenuCodeFromPath(editPathValue, moduleKey);
    if (!nextCode) return;
    if (editForm.getFieldValue("code") !== nextCode) {
      editForm.setFieldsValue({ code: nextCode });
    }
  }, [editAdvanced, editForm, editModuleId, editOpen, editPathValue, modules]);

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      const moduleKey =
        modules.find((mod) => mod._id === values.module_id)?.key ??
        modules.find((mod) => mod._id === values.module_id)?.code ??
        null;
      const code = createAdvanced ? values.code : makeMenuCodeFromPath(values.path, moduleKey);
      if (!code) {
        message.error("Không thể tạo mã menu.");
        return;
      }
      const payload = {
        code,
        name: values.name,
        path: values.path.startsWith("/") ? values.path : `/${values.path}`,
        icon: values.icon ?? null,
        order_index: values.order_index ?? 0,
        parent_id: values.parent_id ?? null,
        module_id: values.module_id,
        is_active: true,
      };
      setCreateLoading(true);
      const { data, error } = await supabase
        .from("menus")
        .insert([payload])
        .select("*")
        .single();
      if (error) throw error;
      setCreateOpen(false);
      await handleRefresh();
      notifyMenuUpdated();
      if (data?._id) {
        setAutoSelectEnabled(true);
        setSelectedMenuId(data._id);
      }
      message.success("Đã tạo menu.");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể tạo menu.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editingMenu?._id) return;
    try {
      const values = await editForm.validateFields();
      const moduleKey =
        modules.find((mod) => mod._id === values.module_id)?.key ??
        modules.find((mod) => mod._id === values.module_id)?.code ??
        null;
      const code = editAdvanced ? values.code : makeMenuCodeFromPath(values.path, moduleKey);
      if (!code) {
        message.error("Không thể tạo mã menu.");
        return;
      }
      const payload = {
        code,
        name: values.name,
        path: values.path.startsWith("/") ? values.path : `/${values.path}`,
        icon: values.icon ?? null,
        order_index: values.order_index ?? 0,
        parent_id: values.parent_id ?? null,
        module_id: values.module_id,
        is_active: values.is_active ?? true,
      };
      setEditLoading(true);
      const { error } = await supabase.from("menus").update(payload).eq("_id", editingMenu._id);
      if (error) throw error;
      setEditOpen(false);
      setEditingMenu(null);
      await handleRefresh();
      notifyMenuUpdated();
      message.success("Đã cập nhật menu.");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể cập nhật menu.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleRemoveAssigned = async (permissionId: string) => {
    if (!selectedMenuId) return;
    const pageAssigned = assignedPermissions
      .filter((perm) => String(perm.category ?? "").toUpperCase() === "PAGE")
      .map((perm) => perm._id);
    const baseAssigned =
      pageAssigned.length > 0
        ? pageAssigned
        : (selectedMenu?.permission_ids ?? []).filter(Boolean);
    const remaining = baseAssigned.filter((permId) => permId !== permissionId);
    await savePermissions(remaining);
    await refreshMenus({
      search: treeSearch || undefined,
      status: treeStatus !== "all" ? treeStatus : undefined,
      moduleGroup: treeGroup !== "all" ? treeGroup : undefined,
      moduleId: treeModule !== "all" ? treeModule : undefined,
    });
    notifyMenuUpdated();
  };

  const handleRefresh = async () => {
    await refreshMenus({
      search: treeSearch || undefined,
      status: treeStatus !== "all" ? treeStatus : undefined,
      moduleGroup: treeGroup !== "all" ? treeGroup : undefined,
      moduleId: treeModule !== "all" ? treeModule : undefined,
    });
  };

  React.useEffect(() => {
    void handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeSearch, treeStatus, treeGroup, treeModule]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Quản trị hệ thống", href: "/system-admin" },
          { label: "IAM", href: "/system-admin/iam" },
          { label: "Menu" },
        ]}
        title="Quản lý Menu"
        subtitle="Quản trị cây menu, quyền hiển thị và preview theo vai trò"
        actions={
          <Space>
            <Button onClick={handleRefresh}>Làm mới</Button>
            <Button type="primary" onClick={() => openCreateModal()}>
              Thêm menu
            </Button>
          </Space>
        }
      />

      <div className="px-6 pb-8">
        <Row gutter={16}>
        <Col span={7}>
          <div className={`${styles.panel} ${styles.treePanel}`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Cây menu</span>
              <span className={styles.panelHint}>{treeMenus.length} mục</span>
            </div>
            <MenuTree
              treeData={toTreeData(treeMenus, {
                showPermissionStatus: true,
                onAction: handleTreeAction,
              })}
              loading={loading}
              selectedKeys={selectedMenuId ? [selectedMenuId] : []}
              moduleOptions={modules.map((mod) => ({
                label: `${mod.key ?? mod.code} — ${mod.name}`,
                value: mod._id,
              }))}
              moduleGroupOptions={Array.from(new Set(modules.map((mod) => mod.group).filter(Boolean))).map(
                (group) => ({ label: String(group), value: String(group) }),
              )}
              onSelect={handleTreeSelect}
              onSearch={setTreeSearch}
              onFilterStatus={setTreeStatus}
              onFilterGroup={setTreeGroup}
              onFilterModule={setTreeModule}
              onDrop={handleDrop}
            />
          </div>
        </Col>
        <Col span={17}>
          <div className={`${styles.panel} ${styles.detailPanel}`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Chi tiết menu</span>
              <span className={styles.panelHint}>
                {selectedMenu ? `${selectedMenu.code}` : "Chưa chọn menu"}
              </span>
            </div>
            {detailError ? (
              <Alert
                type="error"
                showIcon
                message="Không tải được chi tiết menu"
                description={detailError}
                action={
                  <Button size="small" onClick={() => void reloadDetail()}>
                    Thử lại
                  </Button>
                }
              />
            ) : null}
            {selectedMenu && !selectedMenu.module_id ? (
              <Alert
                type="warning"
                showIcon
                message="Menu chưa chọn phân hệ"
                description={
                  suggestedModule
                    ? `Gợi ý phân hệ: ${suggestedModule.key ?? suggestedModule.code} — ${suggestedModule.name}`
                    : "Không tìm thấy phân hệ phù hợp từ route."
                }
                action={
                  suggestedModule ? (
                    <Button size="small" loading={assigningModule} onClick={handleAssignModuleByRoute}>
                      Gán phân hệ theo route
                    </Button>
                  ) : null
                }
              />
            ) : null}
            <Spin spinning={detailLoading}>
            <MenuDetailTabs
              menu={selectedMenu}
              modules={modules}
              saving={saving}
              activeTabKey={detailTab}
              onTabChange={setDetailTab}
              onSaveMenu={async (payload) => {
                try {
                  await saveMenu(payload);
                  await refreshMenus({
                    search: treeSearch || undefined,
                    status: treeStatus !== "all" ? treeStatus : undefined,
                    moduleGroup: treeGroup !== "all" ? treeGroup : undefined,
                    moduleId: treeModule !== "all" ? treeModule : undefined,
                  });
                  notifyMenuUpdated();
                  message.success("Đã lưu thay đổi.");
                } catch (err) {
                  message.error(err instanceof Error ? err.message : "Không thể cập nhật menu.");
                }
              }}
              assignedPermissions={assignedPermissions}
              onAssignSelected={handleAssignSelected}
              onRemoveAssigned={handleRemoveAssigned}
              previewPanel={{
                roleOptions: roles.map((role) => ({ label: role.name, value: role._id })),
                roleId: previewRoleId,
                onRoleChange: setPreviewRoleId,
                loading: previewLoading,
                stats: previewStats,
                treeData: previewTree,
                listData: previewList,
                onFocusMenu: handlePreviewFocusMenu,
                onOpenRolePermissions: handleOpenRolePermissions,
              }}
              historyData={historyRows}
              historyLoading={historyLoading}
            />
            </Spin>
          </div>
        </Col>
        </Row>
      </div>

      <Modal
        centered
        open={createOpen}
        title="Thêm menu"
        onCancel={() => {
          setCreateOpen(false);
          setIconPickerTarget(null);
        }}
        onOk={handleCreateSubmit}
        okText="Tạo menu"
        confirmLoading={createLoading}
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            label="Tên menu"
            name="name"
            rules={[{ required: true, message: "Nhập tên menu." }]}
          >
            <Input placeholder="Tên menu" />
          </Form.Item>
          <Form.Item
            label="Route/path"
            name="path"
            rules={[
              { required: true, message: "Nhập route/path." },
              {
                validator: async (_: unknown, value?: string) => {
                  if (!value) return;
                  if (!String(value).startsWith("/")) {
                    throw new Error("Path phải bắt đầu bằng '/'.");
                  }
                },
              },
            ]}
          >
            <Input placeholder="/system-admin/iam/menus" />
          </Form.Item>
          <Form.Item
            label="Phân hệ"
            name="module_id"
            rules={[{ required: true, message: "Chọn phân hệ." }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Chọn phân hệ"
              popupMatchSelectWidth={false}
              dropdownStyle={{ minWidth: 360 }}
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={modules.map((mod) => ({
                label: `${mod.key ?? mod.code} — ${mod.name}`,
                value: mod._id,
              }))}
            />
          </Form.Item>
          <Form.Item label="Menu cha" name="parent_id">
            <Select
              allowClear
              placeholder="Menu gốc"
              options={parentOptions}
            />
          </Form.Item>
          <Form.Item label="Icon">
            <Space>
              <div className="flex h-9 w-9 items-center justify-center rounded border">
                {CreateIconPreview ? <CreateIconPreview size={18} /> : null}
              </div>
              <Form.Item name="icon" noStyle>
                <Input readOnly placeholder="Chưa chọn icon" style={{ minWidth: 220 }} />
              </Form.Item>
              <Button onClick={() => setIconPickerTarget("create")}>Chọn icon</Button>
              <Button onClick={() => createForm.setFieldsValue({ icon: null })}>Xóa</Button>
            </Space>
          </Form.Item>
          <Form.Item label="Mã menu" name="code" rules={[{ required: true, message: "Nhập mã menu." }]}>
            <Input readOnly={!createAdvanced} />
          </Form.Item>
          <Form.Item label="Nâng cao">
            <Switch checked={createAdvanced} onChange={(checked) => setCreateAdvanced(checked)} />
          </Form.Item>
          <Form.Item label="Thứ tự" name="order_index">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        centered
        open={editOpen}
        title="Sửa menu"
        onCancel={() => {
          setEditOpen(false);
          setEditingMenu(null);
          setIconPickerTarget(null);
        }}
        onOk={handleEditSubmit}
        okText="Lưu"
        confirmLoading={editLoading}
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Tên menu"
            name="name"
            rules={[{ required: true, message: "Nhập tên menu." }]}
          >
            <Input placeholder="Tên menu" />
          </Form.Item>
          <Form.Item
            label="Route/path"
            name="path"
            rules={[
              { required: true, message: "Nhập route/path." },
              {
                validator: async (_: unknown, value?: string) => {
                  if (!value) return;
                  if (!String(value).startsWith("/")) {
                    throw new Error("Path phải bắt đầu bằng '/'.");
                  }
                },
              },
            ]}
          >
            <Input placeholder="/system-admin/iam/menus" />
          </Form.Item>
          <Form.Item
            label="Phân hệ"
            name="module_id"
            rules={[{ required: true, message: "Chọn phân hệ." }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Chọn phân hệ"
              popupMatchSelectWidth={false}
              dropdownStyle={{ minWidth: 360 }}
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={modules.map((mod) => ({
                label: `${mod.key ?? mod.code} — ${mod.name}`,
                value: mod._id,
              }))}
            />
          </Form.Item>
          <Form.Item label="Menu cha" name="parent_id">
            <Select
              allowClear
              placeholder="Menu gốc"
              options={editParentOptions}
            />
          </Form.Item>
          <Form.Item label="Icon">
            <Space>
              <div className="flex h-9 w-9 items-center justify-center rounded border">
                {EditIconPreview ? <EditIconPreview size={18} /> : null}
              </div>
              <Form.Item name="icon" noStyle>
                <Input readOnly placeholder="Chưa chọn icon" style={{ minWidth: 220 }} />
              </Form.Item>
              <Button onClick={() => setIconPickerTarget("edit")}>Chọn icon</Button>
              <Button onClick={() => editForm.setFieldsValue({ icon: null })}>Xóa</Button>
            </Space>
          </Form.Item>
          <Form.Item label="Mã menu" name="code" rules={[{ required: true, message: "Nhập mã menu." }]}>
            <Input readOnly={!editAdvanced} />
          </Form.Item>
          <Form.Item label="Nâng cao">
            <Switch checked={editAdvanced} onChange={(checked) => setEditAdvanced(checked)} />
          </Form.Item>
          <Form.Item label="Thứ tự" name="order_index">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Trạng thái" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <IconPickerModal
        open={iconPickerTarget !== null}
        value={(iconPickerTarget === "create" ? createIconValue : editIconValue) ?? null}
        onClose={() => setIconPickerTarget(null)}
        onSelect={(iconName) => {
          if (iconPickerTarget === "create") {
            createForm.setFieldsValue({ icon: iconName });
          } else if (iconPickerTarget === "edit") {
            editForm.setFieldsValue({ icon: iconName });
          }
          setIconPickerTarget(null);
        }}
      />
    </div>
  );
};

export default MenuAdminPage;
