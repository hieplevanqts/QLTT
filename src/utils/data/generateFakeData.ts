// Type definitions (matching AdminPage.tsx interfaces)
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  roleId: string;
  unit: string;
  unitId: string;
  territory: string;
  territoryId: string;
  status: 'active' | 'locked' | 'pending';
  lastLogin?: string;
  createdAt: string;
  createdBy: string;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  userCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  permissions?: Array<{
    module: string;
    permissions: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  }>;
}

export interface Territory {
  id: string;
  code: string;
  name: string;
  level: 'province' | 'district' | 'ward';
  parentId?: string;
  status: 'active' | 'inactive';
  userCount: number;
}

export interface Team {
  id: string;
  code: string;
  name: string;
  type: 'department' | 'team' | 'group';
  leader: string;
  memberCount: number;
  parentId?: string;
  status: 'active' | 'inactive';
}

export interface CategoryItem {
  id: string;
  code: string;
  name: string;
  type: string;
  order: number;
  effectiveFrom: string;
  effectiveTo?: string;
  version: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  description?: string;
}

export interface RiskIndicator {
  id: string;
  code: string;
  name: string;
  type: 'high' | 'medium' | 'low';
  description: string;
  threshold: number;
  status: 'active' | 'inactive';
  effectiveFrom: string;
}

export interface Checklist {
  id: string;
  code: string;
  name: string;
  topic: string;
  itemCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  description?: string;
}

export interface NotificationRule {
  id: string;
  name: string;
  event: string;
  condition: string;
  recipients: string;
  status: 'active' | 'inactive';
  description?: string;
}

// Helper function to generate ID
function generateId(prefix: string, index: number): string {
  return `${prefix}${String(index + 1).padStart(4, '0')}`;
}

// Helper function to format date
function formatDate(): string {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

// Sample data arrays
const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
const lastNames = ['Văn', 'Thị', 'Đức', 'Minh', 'Hữu', 'Thành', 'Quang', 'Đình', 'Công', 'Tuấn'];
const middleNames = ['Anh', 'Bình', 'Cường', 'Dũng', 'Hùng', 'Khoa', 'Long', 'Nam', 'Quang', 'Sơn'];
const finalNames = ['An', 'Bình', 'Cường', 'Dũng', 'Hùng', 'Khoa', 'Long', 'Nam', 'Quang', 'Sơn', 'Tuấn', 'Vinh', 'Đức', 'Minh', 'Thành'];

const roles = ['Công dân', 'Kiểm soát viên', 'Quản lý', 'Giám đốc', 'Nhân viên', 'Trưởng phòng', 'Phó phòng', 'Chuyên viên'];
const roleCodes = ['R001', 'R002', 'R003', 'R004', 'R005', 'R006', 'R007', 'R008'];

const units = ['Chi cục QLTT Phường 1', 'Chi cục QLTT Phường 2', 'Chi cục QLTT Phường 3', 'Phòng Kế hoạch', 'Phòng Nghiệp vụ', 'Phòng Hành chính'];
const unitIds = ['U001', 'U002', 'U003', 'U004', 'U005', 'U006'];

const territories = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang'];
const territoryIds = ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008'];

const districts = ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10'];
const wards = ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8'];

const teamTypes = ['department', 'team', 'group'];
const teamNames = ['Đội Kiểm tra', 'Đội Giám sát', 'Phòng Nghiệp vụ', 'Phòng Kế hoạch', 'Tổ Chuyên môn', 'Nhóm Hỗ trợ'];

const categoryTypes = ['Loại hình cơ sở', 'Hạng mục kiểm tra', 'Tiêu chí đánh giá', 'Mức độ rủi ro', 'Phân loại ngành nghề'];
const categoryNames = ['Nhà hàng', 'Quán ăn', 'Cửa hàng thực phẩm', 'Siêu thị', 'Chợ', 'Cơ sở sản xuất', 'Trung tâm thương mại'];

const riskTypes = ['high', 'medium', 'low'];
const riskNames = ['Rủi ro cao', 'Rủi ro trung bình', 'Rủi ro thấp', 'An toàn thực phẩm', 'Vệ sinh môi trường', 'An toàn lao động'];

const checklistTopics = ['An toàn thực phẩm', 'Vệ sinh môi trường', 'An toàn lao động', 'Phòng cháy chữa cháy', 'Chất lượng sản phẩm'];

const events = ['Tạo mới', 'Cập nhật', 'Xóa', 'Kiểm tra', 'Cảnh báo', 'Sự cố'];
const conditions = ['Khi có thay đổi', 'Hàng ngày', 'Hàng tuần', 'Khi có sự cố', 'Theo lịch'];
const recipients = ['admin@example.com', 'manager@example.com', 'team@example.com', 'all@example.com'];

// Generate Users
export function generateUsers(count: number): User[] {
  const statuses: Array<'active' | 'locked' | 'pending'> = ['active', 'locked', 'pending'];
  
  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[index % lastNames.length];
    const middleName = middleNames[index % middleNames.length];
    const finalName = finalNames[index % finalNames.length];
    const fullName = `${firstName} ${lastName} ${middleName} ${finalName}`;
    const username = `user${index + 1}`;
    
    return {
      id: generateId('U', index),
      username,
      fullName,
      email: `${username}@example.com`,
      phone: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
      role: roles[index % roles.length],
      roleId: roleCodes[index % roleCodes.length],
      unit: units[index % units.length],
      unitId: unitIds[index % unitIds.length],
      territory: territories[index % territories.length],
      territoryId: territoryIds[index % territoryIds.length],
      status: statuses[index % statuses.length],
      lastLogin: index % 3 === 0 ? formatDate() : undefined,
      createdAt: formatDate(),
      createdBy: 'admin',
    };
  });
}

// Generate Roles
export function generateRoles(count: number): Role[] {
  const statuses: Array<'active' | 'inactive'> = ['active', 'inactive'];
  const roleNames = ['Quản trị viên', 'Người dùng', 'Kiểm soát viên', 'Quản lý', 'Xem báo cáo', 'Nhập liệu', 'Xuất báo cáo', 'Phê duyệt'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: generateId('R', index),
    code: generateId('R', index),
    name: `${roleNames[index % roleNames.length]} ${index > roleNames.length ? (index + 1) : ''}`.trim(),
    description: `Vai trò ${roleNames[index % roleNames.length]}`,
    userCount: Math.floor(Math.random() * 50) + 1,
    status: statuses[index % statuses.length],
    createdAt: formatDate(),
  }));
}

// Generate Territories
export function generateTerritories(count: number): Territory[] {
  const levels: Array<'province' | 'district' | 'ward'> = ['province', 'district', 'ward'];
  const statuses: Array<'active' | 'inactive'> = ['active', 'inactive'];
  const names = [...districts, ...wards, ...territories];
  
  return Array.from({ length: count }, (_, index) => ({
    id: generateId('T', index),
    code: generateId('T', index),
    name: names[index % names.length],
    level: levels[index % levels.length],
    parentId: index > 0 && index % 3 === 0 ? generateId('T', index - 1) : undefined,
    status: statuses[index % statuses.length],
    userCount: Math.floor(Math.random() * 100) + 1,
  }));
}

// Generate Teams
export function generateTeams(count: number): Team[] {
  const statuses: Array<'active' | 'inactive'> = ['active', 'inactive'];
  const leaderNames = firstNames.map(fn => `${fn} Văn ${finalNames[Math.floor(Math.random() * finalNames.length)]}`);
  
  return Array.from({ length: count }, (_, index) => ({
    id: generateId('T', index),
    code: generateId('TEAM', index),
    name: `${teamNames[index % teamNames.length]} ${index + 1}`,
    type: teamTypes[index % teamTypes.length] as 'department' | 'team' | 'group',
    leader: leaderNames[index % leaderNames.length],
    memberCount: Math.floor(Math.random() * 20) + 1,
    parentId: index > 0 && index % 5 === 0 ? generateId('T', index - 1) : undefined,
    status: statuses[index % statuses.length],
  }));
}

// Generate Categories
export function generateCategories(count: number): CategoryItem[] {
  const statuses: Array<'draft' | 'pending' | 'approved' | 'rejected'> = ['draft', 'pending', 'approved', 'rejected'];
  const now = new Date();
  const effectiveFrom = now.toISOString().split('T')[0];
  
  return Array.from({ length: count }, (_, index) => ({
    id: generateId('C', index),
    code: generateId('CAT', index),
    name: `${categoryNames[index % categoryNames.length]} ${index + 1}`,
    type: categoryTypes[index % categoryTypes.length],
    order: index + 1,
    effectiveFrom,
    effectiveTo: index % 10 === 0 ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
    version: 'v1.0',
    status: statuses[index % statuses.length],
    createdBy: 'admin',
    createdAt: formatDate(),
    approvedBy: index % 4 === 0 ? 'admin' : undefined,
    approvedAt: index % 4 === 0 ? formatDate() : undefined,
    description: `Mô tả cho danh mục ${categoryNames[index % categoryNames.length]}`,
  }));
}

// Generate Risk Indicators
export function generateRiskIndicators(count: number): RiskIndicator[] {
  const statuses: Array<'active' | 'inactive'> = ['active', 'inactive'];
  const now = new Date();
  const effectiveFrom = now.toISOString().split('T')[0];
  
  return Array.from({ length: count }, (_, index) => ({
    id: generateId('RI', index),
    code: generateId('RISK', index),
    name: `${riskNames[index % riskNames.length]} ${index + 1}`,
    type: riskTypes[index % riskTypes.length] as 'high' | 'medium' | 'low',
    description: `Mô tả chỉ báo rủi ro ${index + 1}`,
    threshold: Math.floor(Math.random() * 100) + 1,
    status: statuses[index % statuses.length],
    effectiveFrom,
  }));
}

// Generate Checklists
export function generateChecklists(count: number): Checklist[] {
  const statuses: Array<'active' | 'inactive'> = ['active', 'inactive'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: generateId('CL', index),
    code: generateId('CHK', index),
    name: `Checklist ${checklistTopics[index % checklistTopics.length]} ${index + 1}`,
    topic: checklistTopics[index % checklistTopics.length],
    itemCount: Math.floor(Math.random() * 50) + 5,
    status: statuses[index % statuses.length],
    createdAt: formatDate(),
    description: `Mô tả checklist ${index + 1}`,
  }));
}

// Generate Notification Rules
export function generateNotificationRules(count: number): NotificationRule[] {
  const statuses: Array<'active' | 'inactive'> = ['active', 'inactive'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: generateId('NR', index),
    name: `Quy tắc thông báo ${events[index % events.length]} ${index + 1}`,
    event: events[index % events.length],
    condition: conditions[index % conditions.length],
    recipients: recipients[index % recipients.length],
    status: statuses[index % statuses.length],
    description: `Mô tả quy tắc thông báo ${index + 1}`,
  }));
}
