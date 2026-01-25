import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  Building2,
  Database,
  Folder,
  GitBranch,
  HardDrive,
  History,
  KeyRound,
  Layers,
  Landmark,
  Menu,
  Settings,
  Shield,
  ShieldCheck,
  Sliders,
  Users,
  UserCheck,
  MapPin,
} from "lucide-react";

import PageHeader from "../../../layouts/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";

const summaryCards = [
  {
    label: "Tổng tài khoản",
    value: "1,247",
    delta: "+12.5%",
    icon: Users,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Tỷ lệ hoạt động",
    value: "94.2%",
    delta: "+1.2%",
    icon: UserCheck,
    tone: "bg-sky-50 text-sky-600",
  },
  {
    label: "Database Size",
    value: "2.8 GB",
    delta: "+350 MB",
    icon: Database,
    tone: "bg-violet-50 text-violet-600",
  },
  {
    label: "Phiên đăng nhập",
    value: "236",
    delta: "Hôm nay",
    icon: ShieldCheck,
    tone: "bg-amber-50 text-amber-600",
  },
];

const quickSections = [
  {
    title: "Master Data",
    description: "Quản lý dữ liệu nền tảng của hệ thống",
    items: [
      {
        label: "Đơn vị tổ chức",
        description: "Cây đơn vị, tổ chức",
        path: "/system-admin/master-data/org-units",
        icon: Building2,
        tone: "bg-indigo-50 text-indigo-600",
      },
      {
        label: "Phòng ban",
        description: "Quản lý phòng ban, bộ phận",
        path: "/system-admin/master-data/departments",
        icon: Users,
        tone: "bg-fuchsia-50 text-fuchsia-600",
      },
      {
        label: "Danh mục hành chính",
        description: "Quản lý địa bàn và bản đồ",
        path: "/system-admin/master-data/admin-areas",
        icon: MapPin,
        tone: "bg-emerald-50 text-emerald-600",
      },
      {
        label: "Danh mục dùng chung",
        description: "Catalogs & items dùng chung",
        path: "/system-admin/master-data/catalogs?group=COMMON",
        icon: Folder,
        tone: "bg-amber-50 text-amber-700",
      },
      {
        label: "Danh mục nghiệp vụ QLTT",
        description: "Catalogs nghiệp vụ chuyên môn",
        path: "/system-admin/master-data/catalogs?group=DOMAIN",
        icon: Layers,
        tone: "bg-rose-50 text-rose-600",
      },
      {
        label: "Danh mục kỹ thuật",
        description: "Catalogs hệ thống và technical",
        path: "/system-admin/master-data/catalogs?group=SYSTEM",
        icon: GitBranch,
        tone: "bg-emerald-50 text-emerald-600",
      },
    ],
  },
  {
    title: "IAM",
    description: "Người dùng, vai trò, quyền hạn, phân quyền",
    items: [
      {
        label: "Người dùng",
        description: "Quản lý tài khoản",
        path: "/system-admin/iam/users",
        icon: Users,
        tone: "bg-sky-50 text-sky-600",
      },
      {
        label: "Vai trò",
        description: "Role & phân nhóm",
        path: "/system-admin/iam/roles",
        icon: Shield,
        tone: "bg-rose-50 text-rose-600",
      },
      {
        label: "Permissions",
        description: "Danh sách quyền hạn",
        path: "/system-admin/iam/permissions",
        icon: KeyRound,
        tone: "bg-violet-50 text-violet-600",
      },
      {
        label: "Phân quyền",
        description: "Gán quyền theo người dùng/role",
        path: "/system-admin/iam/assignments",
        icon: UserCheck,
        tone: "bg-emerald-50 text-emerald-600",
      },
    ],
  },
  {
    title: "Cấu hình hệ thống",
    description: "Thông số, bảo mật, sao lưu",
    items: [
      {
        label: "Thông số hệ thống",
        description: "Thiết lập tham số",
        path: "/system-admin/system-config/parameters",
        icon: Sliders,
        tone: "bg-slate-50 text-slate-600",
      },
      {
        label: "Thông tin tổ chức",
        description: "Cấu hình đơn vị",
        path: "/system-admin/system-config/organization-info",
        icon: Landmark,
        tone: "bg-orange-50 text-orange-600",
      },
      {
        label: "Cài đặt bảo mật",
        description: "Chính sách & mật khẩu",
        path: "/system-admin/system-config/security",
        icon: ShieldCheck,
        tone: "bg-red-50 text-red-600",
      },
      {
        label: "Database Backups",
        description: "Sao lưu và phục hồi",
        path: "/system-admin/system-config/database/backups",
        icon: HardDrive,
        tone: "bg-cyan-50 text-cyan-600",
      },
    ],
  },
  {
    title: "Công cụ quản trị",
    description: "Quản lý module và menu hệ thống",
    items: [
      {
        label: "Quản trị Module",
        description: "Import, update, rollback module",
        path: "/system/modules",
        icon: Boxes,
        tone: "bg-indigo-50 text-indigo-600",
      },
      {
        label: "Quản trị Menu",
        description: "Cấu hình menu điều hướng",
        path: "/system/menus",
        icon: Menu,
        tone: "bg-amber-50 text-amber-700",
      },
      {
        label: "Lịch sử import",
        description: "Theo dõi job import module",
        path: "/system/modules/history",
        icon: History,
        tone: "bg-slate-50 text-slate-600",
      },
      {
        label: "Quản trị (cũ)",
        description: "Trang quản trị tổng hợp",
        path: "/admin",
        icon: Settings,
        tone: "bg-neutral-50 text-neutral-600",
      },
    ],
  },
];

export default function SystemAdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Quản trị", href: "/system-admin" },
        ]}
        title="Dashboard Quản trị viên"
      />

      <div className="px-6 pb-8 space-y-8">
        <div className="text-sm text-muted-foreground">
          Tổng quan hệ thống và truy cập nhanh các chức năng quản trị.
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg p-2 ${card.tone}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold">{card.value}</div>
                      <div className="text-xs text-muted-foreground">{card.label}</div>
                      <div className="text-xs text-emerald-600">{card.delta}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          {quickSections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-base">{section.title}</CardTitle>
                <div className="text-xs text-muted-foreground">{section.description}</div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="group rounded-lg border p-4 transition hover:border-primary/40 hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`rounded-lg p-2 ${item.tone}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
