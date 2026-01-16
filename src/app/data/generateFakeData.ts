// Generate extensive fake data for Admin module

const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Mai', 'Tô', 'Trịnh', 'Đinh', 'Lâm'];
const middleNames = ['Văn', 'Thị', 'Đức', 'Minh', 'Hoàng', 'Anh', 'Thu', 'Hà', 'Mai', 'Lan', 'Quốc', 'Thanh', 'Tuấn', 'Thúy', 'Ngọc'];
const lastNames = ['An', 'Bình', 'Chi', 'Dũng', 'Em', 'Hùng', 'Giang', 'Hằng', 'Hoa', 'Khánh', 'Linh', 'Long', 'Nam', 'Phong', 'Quân', 'Sơn', 'Trang', 'Tuấn', 'Uyên', 'Vân', 'Xuân', 'Yến'];

const wards = ['Ngọc Hà', 'Điện Biên', 'Đội Cấn', 'Kim Mã', 'Nguyễn Trung Trực', 'Quán Thánh', 'Cống Vị', 'Liễu Giai', 'Phúc Xá', 'Thành Công', 'Vĩnh Phúc', 'Trúc Bạch', 'Giảng Võ', 'Thống Nhất'];
const districts = ['Ba Đình', 'Hoàn Kiếm', 'Hai Bà Trưng', 'Đống Đa', 'Cầu Giấy', 'Tây Hồ', 'Thanh Xuân', 'Hoàng Mai'];
const roles = ['Công dân', 'Cán bộ thực thi', 'Quản lý cấp huyện', 'Quản trị hệ thống'];
const statuses = ['active', 'active', 'active', 'locked', 'pending'];

const categoryTypes = ['Loại hình cơ sở', 'Lĩnh vực kinh doanh', 'Phân loại rủi ro', 'Loại vi phạm', 'Hình thức xử lý'];
const categoryNames = [
  'Nhà hàng', 'Khách sạn', 'Quán ăn', 'Quán cà phê', 'Cửa hàng tạp hóa', 
  'Siêu thị mini', 'Quầy thuốc', 'Tiệm bánh', 'Bar/Pub', 'Karaoke',
  'Spa/Massage', 'Salon tóc', 'Phòng gym', 'Trung tâm thương mại', 'Chợ',
  'Cửa hàng điện tử', 'Cửa hàng thời trang', 'Cửa hàng giày dép', 'Cửa hàng mỹ phẩm', 'Cửa hàng đồ chơi',
  'Nhà thuốc', 'Phòng khám', 'Trường học', 'Trung tâm đào tạo', 'Văn phòng',
  'Xưởng sản xuất', 'Kho bãi', 'Bãi xe', 'Cửa hàng xăng dầu', 'Trạm rửa xe'
];

const riskNames = [
  'Cơ sở có nguy cơ cao về ATTP', 'Điểm vệ sinh kém', 'Hàng hóa gần hết hạn',
  'Thiếu giấy phép kinh doanh', 'Vi phạm PCCC', 'Gây ô nhiễm môi trường',
  'Không đảm bảo an toàn lao động', 'Kinh doanh không đúng ngành nghề',
  'Sử dụng lao động chưa đủ tuổi', 'Không nộp thuế đầy đủ',
  'Gian lận thương mại', 'Hàng giả hàng nhái', 'Không niêm yết giá',
  'Chiếm dụng vỉa hè', 'Hoạt động không phép'
];

const checklistTopics = [
  'An toàn thực phẩm', 'Phòng cháy chữa cháy', 'Bảo vệ môi trường',
  'An toàn lao động', 'Vệ sinh cơ sở', 'Giấy tờ pháp lý',
  'Chất lượng hàng hóa', 'Niêm yết giá', 'Truy xuất nguồn gốc',
  'Bảo vệ người tiêu dùng', 'Quản lý chất thải', 'Kiểm soát tiếng ồn',
  'An ninh trật tự', 'Phòng chống Covid-19', 'Đảm bảo quyền lợi người lao động'
];

const notificationEvents = [
  'Tạo nhiệm vụ', 'Nhiệm vụ quá hạn', 'Phát hiện vi phạm', 'Tạo cơ sở mới',
  'Cập nhật cơ sở', 'Xóa cơ sở', 'Phê duyệt báo cáo', 'Từ chối báo cáo',
  'Gán vai trò mới', 'Thay đổi quyền hạn', 'Đăng nhập thất bại', 'Khóa tài khoản',
  'Mở khóa tài khoản', 'Thay đổi mật khẩu', 'Xuất dữ liệu'
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUsername(fullName: string): string {
  const parts = fullName.toLowerCase().split(' ');
  const lastName = parts[parts.length - 1];
  const firstName = parts.slice(0, -1).map(p => p.charAt(0)).join('');
  return firstName + lastName + randomNumber(1, 99);
}

function generateEmail(username: string): string {
  return `${username}@mappa.gov.vn`;
}

function generatePhone(): string {
  return `09${randomNumber(10, 99)}${randomNumber(100, 999)}${randomNumber(100, 999)}`;
}

function generateDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomNumber(0, daysAgo));
  return date.toISOString().slice(0, 16).replace('T', ' ');
}

// Generate Users (80 records)
export function generateUsers(count: number = 80): any[] {
  const users = [];
  const departments = ['Phòng Nghiệp vụ', 'Phòng Thanh tra', 'Phòng Pháp chế', 'Phòng Hành chính', 'Văn phòng'];
  const positions = ['Chuyên viên', 'Phó trưởng phòng', 'Trưởng phòng', 'Phó giám đốc', 'Giám đốc'];
  const educationLevels = ['Trung cấp', 'Cao đẳng', 'Đại học', 'Thạc sĩ', 'Tiến sĩ'];
  
  for (let i = 1; i <= count; i++) {
    const fullName = `${randomElement(firstNames)} ${randomElement(middleNames)} ${randomElement(lastNames)}`;
    const username = generateUsername(fullName);
    const role = randomElement(roles);
    const status = randomElement(statuses) as 'active' | 'locked' | 'pending';
    const ward = randomElement(wards);
    const district = randomElement(districts);
    const isOfficer = role !== 'Công dân';
    
    users.push({
      id: `U${String(i).padStart(3, '0')}`,
      username,
      fullName,
      email: generateEmail(username),
      phone: generatePhone(),
      role,
      roleId: role === 'Công dân' ? 'R001' : role === 'Cán bộ thực thi' ? 'R002' : role === 'Quản lý cấp huyện' ? 'R003' : 'R004',
      unit: isOfficer ? `Phường ${ward}` : 'N/A',
      unitId: isOfficer ? `T${randomNumber(1, 50).toString().padStart(3, '0')}` : '',
      territory: `Phường ${ward}, ${district}`,
      territoryId: `TER${randomNumber(1, 100).toString().padStart(3, '0')}`,
      status,
      lastLogin: status === 'active' ? generateDate(30) : undefined,
      createdAt: generateDate(365),
      createdBy: randomElement(['admin', 'system', 'manager1']),
      // Additional rich fields
      department: isOfficer ? randomElement(departments) : 'N/A',
      position: isOfficer ? randomElement(positions) : 'Công dân',
      education: randomElement(educationLevels),
      dateOfBirth: `${randomNumber(1970, 2000)}-${String(randomNumber(1, 12)).padStart(2, '0')}-${String(randomNumber(1, 28)).padStart(2, '0')}`,
      gender: Math.random() > 0.5 ? 'Nam' : 'Nữ',
      idNumber: `0${randomNumber(10, 99)}${randomNumber(100000, 999999)}${randomNumber(100, 999)}`,
      address: `Số ${randomNumber(1, 999)}, Phường ${ward}, Quận ${district}, Hà Nội`,
      joinDate: isOfficer ? generateDate(1825).split(' ')[0] : undefined,
      contractType: isOfficer ? randomElement(['Hợp đồng không xác định thời hạn', 'Hợp đồng 3 năm', 'Hợp đồng 1 năm', 'Biên chế']) : undefined,
      salary: isOfficer ? randomNumber(8, 25) * 1000000 : undefined,
      tasksCompleted: randomNumber(0, 150),
      tasksInProgress: randomNumber(0, 12),
      performance: randomElement(['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Cần cải thiện']),
      notes: Math.random() > 0.7 ? `Ghi chú: ${randomElement(['Cán bộ năng động', 'Đang tập sự', 'Chuyên môn tốt', 'Cần đào tạo thêm', 'Ứng viên thăng tiến'])}` : '',
    });
  }
  return users;
}

// Generate Roles (12 records)
export function generateRoles(count: number = 20): any[] {
  // Define module permissions structure
  const allModules = [
    'Tổng quan',
    'Bản đồ',
    'Cơ sở & Địa bàn',
    'Nhiệm vụ',
    'Kiểm tra',
    'Báo cáo',
    'Quản trị hệ thống',
  ];

  // Function to generate permissions based on role type
  const generatePermissions = (roleCode: string) => {
    const permissions = allModules.map(module => ({
      module,
      view: false,
      create: false,
      edit: false,
      delete: false,
    }));

    // CITIZEN - view only basic modules
    if (roleCode === 'CITIZEN') {
      permissions[0].view = true; // Tổng quan
      permissions[1].view = true; // Bản đồ
      return permissions;
    }

    // OFFICER - view + CRUD on stores and tasks
    if (roleCode === 'OFFICER') {
      permissions[0].view = true; // Tổng quan
      permissions[1].view = true; // Bản đồ
      permissions[2] = { module: 'Cơ sở & Địa bàn', view: true, create: true, edit: true, delete: false };
      permissions[3] = { module: 'Nhiệm vụ', view: true, create: true, edit: true, delete: false };
      permissions[4].view = true; // Kiểm tra - view only
      permissions[5].view = true; // Báo cáo - view only
      return permissions;
    }

    // MANAGER - full CRUD except delete on most, view admin
    if (roleCode === 'MANAGER') {
      permissions[0].view = true; // Tổng quan
      permissions[1].view = true; // Bản đồ
      permissions[2] = { module: 'Cơ sở & Địa bàn', view: true, create: true, edit: true, delete: true };
      permissions[3] = { module: 'Nhiệm vụ', view: true, create: true, edit: true, delete: true };
      permissions[4] = { module: 'Kiểm tra', view: true, create: true, edit: true, delete: false };
      permissions[5] = { module: 'Báo cáo', view: true, create: true, edit: true, delete: false };
      permissions[6].view = true; // Quản trị hệ thống - view only
      return permissions;
    }

    // ADMIN - full permissions on everything
    if (roleCode === 'ADMIN') {
      return permissions.map(p => ({ ...p, view: true, create: true, edit: true, delete: true }));
    }

    // INSPECTOR - view all, CRUD on inspection
    if (roleCode === 'INSPECTOR') {
      permissions[0].view = true;
      permissions[1].view = true;
      permissions[2].view = true;
      permissions[3].view = true;
      permissions[4] = { module: 'Kiểm tra', view: true, create: true, edit: true, delete: true };
      permissions[5] = { module: 'Báo cáo', view: true, create: true, edit: false, delete: false };
      return permissions;
    }

    // AUDITOR - view all, create reports
    if (roleCode === 'AUDITOR') {
      permissions[0].view = true;
      permissions[1].view = true;
      permissions[2].view = true;
      permissions[3].view = true;
      permissions[4].view = true;
      permissions[5] = { module: 'Báo cáo', view: true, create: true, edit: true, delete: false };
      return permissions;
    }

    // SUPERVISOR - view + create/edit tasks and inspections
    if (roleCode === 'SUPERVISOR') {
      permissions[0].view = true;
      permissions[1].view = true;
      permissions[2].view = true;
      permissions[3] = { module: 'Nhiệm vụ', view: true, create: true, edit: true, delete: false };
      permissions[4] = { module: 'Kiểm tra', view: true, create: true, edit: true, delete: false };
      permissions[5].view = true;
      return permissions;
    }

    // ANALYST - view all, create reports
    if (roleCode === 'ANALYST') {
      permissions[0].view = true;
      permissions[1].view = true;
      permissions[2].view = true;
      permissions[3].view = true;
      permissions[4].view = true;
      permissions[5] = { module: 'Báo cáo', view: true, create: true, edit: true, delete: false };
      return permissions;
    }

    // SUPPORT - view basic modules
    if (roleCode === 'SUPPORT') {
      permissions[0].view = true;
      permissions[1].view = true;
      permissions[2].view = true;
      return permissions;
    }

    // REPORTER - view all, create/edit reports
    if (roleCode === 'REPORTER') {
      permissions[0].view = true;
      permissions[1].view = true;
      permissions[2].view = true;
      permissions[3].view = true;
      permissions[4].view = true;
      permissions[5] = { module: 'Báo cáo', view: true, create: true, edit: true, delete: false };
      return permissions;
    }

    // REVIEWER - view all, edit most
    if (roleCode === 'REVIEWER') {
      permissions[0].view = true;
      permissions[1].view = true;
      permissions[2] = { module: 'Cơ sở & Địa bàn', view: true, create: false, edit: true, delete: false };
      permissions[3] = { module: 'Nhiệm vụ', view: true, create: false, edit: true, delete: false };
      permissions[4] = { module: 'Kiểm tra', view: true, create: false, edit: true, delete: false };
      permissions[5] = { module: 'Báo cáo', view: true, create: false, edit: true, delete: false };
      return permissions;
    }

    // APPROVER - view all, full CRUD on tasks/inspections/reports
    if (roleCode === 'APPROVER') {
      permissions[0].view = true;
      permissions[1].view = true;
      permissions[2].view = true;
      permissions[3] = { module: 'Nhiệm vụ', view: true, create: true, edit: true, delete: true };
      permissions[4] = { module: 'Kiểm tra', view: true, create: true, edit: true, delete: true };
      permissions[5] = { module: 'Báo cáo', view: true, create: true, edit: true, delete: true };
      return permissions;
    }
    
    // COORDINATOR - coordinate tasks and teams
    if (roleCode === 'COORDINATOR') {
      permissions[0].view = true;
      permissions[1].view = true;
      permissions[2].view = true;
      permissions[3] = { module: 'Nhiệm vụ', view: true, create: true, edit: true, delete: false };
      permissions[4].view = true;
      permissions[5].view = true;
      return permissions;
    }
    
    // MONITOR - view only all modules
    if (roleCode === 'MONITOR') {
      return permissions.map(p => ({ ...p, view: true, create: false, edit: false, delete: false }));
    }
    
    // FIELD_AGENT - limited field operations
    if (roleCode === 'FIELD_AGENT') {
      permissions[0].view = true;
      permissions[1].view = true;
      permissions[2] = { module: 'Cơ sở & Địa bàn', view: true, create: true, edit: false, delete: false };
      permissions[3] = { module: 'Nhiệm vụ', view: true, create: false, edit: true, delete: false };
      return permissions;
    }
    
    // DATA_ENTRY - data input only
    if (roleCode === 'DATA_ENTRY') {
      permissions[0].view = true;
      permissions[2] = { module: 'Cơ sở & Địa bàn', view: true, create: true, edit: true, delete: false };
      return permissions;
    }
    
    // VIEWER - read-only access to all
    if (roleCode === 'VIEWER') {
      return permissions.map(p => ({ ...p, view: true, create: false, edit: false, delete: false }));
    }
    
    // SPECIALIST - specialized operations
    if (roleCode === 'SPECIALIST') {
      permissions[0].view = true;
      permissions[1].view = true;
      permissions[2].view = true;
      permissions[3].view = true;
      permissions[4] = { module: 'Kiểm tra', view: true, create: true, edit: true, delete: false };
      permissions[5] = { module: 'Báo cáo', view: true, create: true, edit: true, delete: false };
      return permissions;
    }

    // Default - view only overview and map
    permissions[0].view = true;
    permissions[1].view = true;
    return permissions;
  };

  const baseRoles = [
    { code: 'CITIZEN', name: 'Công dân', description: 'Người dân sử dụng hệ thống', userCount: 1247 },
    { code: 'OFFICER', name: 'Cán bộ thực thi', description: 'Cán bộ QLTT cấp phường/xã', userCount: 89 },
    { code: 'MANAGER', name: 'Quản lý cấp huyện', description: 'Lãnh đạo UBND cấp quận/huyện', userCount: 24 },
    { code: 'ADMIN', name: 'Quản trị hệ thống', description: 'Quản trị viên toàn hệ thống', userCount: 5 },
    { code: 'INSPECTOR', name: 'Thanh tra viên', description: 'Cán bộ thanh tra chuyên trách', userCount: 42 },
    { code: 'AUDITOR', name: 'Kiểm toán viên', description: 'Cán bộ kiểm toán nội bộ', userCount: 12 },
    { code: 'SUPERVISOR', name: 'Giám sát viên', description: 'Cán bộ giám sát thực địa', userCount: 65 },
    { code: 'ANALYST', name: 'Phân tích viên', description: 'Chuyên viên phân tích dữ liệu', userCount: 18 },
    { code: 'SUPPORT', name: 'Hỗ trợ kỹ thuật', description: 'Nhân viên hỗ trợ người dùng', userCount: 8 },
    { code: 'REPORTER', name: 'Báo cáo viên', description: 'Cán bộ lập báo cáo tổng hợp', userCount: 15 },
    { code: 'REVIEWER', name: 'Phê duyệt cấp 1', description: 'Người phê duyệt cấp phòng', userCount: 28 },
    { code: 'APPROVER', name: 'Phê duyệt cấp 2', description: 'Người phê duyệt cấp ban', userCount: 9 },
    { code: 'COORDINATOR', name: 'Điều phối viên', description: 'Điều phối nhiệm vụ và đội nhóm', userCount: 22 },
    { code: 'MONITOR', name: 'Người quan sát', description: 'Xem thông tin không chỉnh sửa', userCount: 45 },
    { code: 'FIELD_AGENT', name: 'Nhân viên thực địa', description: 'Thu thập thông tin tại hiện trường', userCount: 78 },
    { code: 'DATA_ENTRY', name: 'Nhập liệu', description: 'Nhập dữ liệu vào hệ thống', userCount: 34 },
    { code: 'VIEWER', name: 'Người xem', description: 'Chỉ xem không chỉnh sửa', userCount: 156 },
    { code: 'SPECIALIST', name: 'Chuyên viên', description: 'Chuyên gia lĩnh vực cụ thể', userCount: 19 },
    { code: 'GUEST', name: 'Khách', description: 'Truy cập giới hạn', userCount: 234 },
    { code: 'TRAINEE', name: 'Thực tập sinh', description: 'Đang trong quá trình đào tạo', userCount: 41 },
  ];
  
  return baseRoles.slice(0, count).map((r, i) => ({
    id: `R${String(i + 1).padStart(3, '0')}`,
    ...r,
    permissions: generatePermissions(r.code),
    status: randomElement(['active', 'active', 'active', 'inactive']) as 'active' | 'inactive',
    createdAt: generateDate(730),
  }));
}

// Generate Territories (50 records)
export function generateTerritories(count: number = 50): any[] {
  const territories = [];
  
  // Add provinces
  const provinces = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng'];
  provinces.forEach((prov, i) => {
    territories.push({
      id: `TER${String(i + 1).padStart(3, '0')}`,
      code: prov.substring(0, 2).toUpperCase(),
      name: prov,
      level: 'province' as const,
      status: 'active' as const,
      userCount: randomNumber(100, 500),
    });
  });
  
  // Add districts
  districts.forEach((dist, i) => {
    territories.push({
      id: `TER${String(i + 5).padStart(3, '0')}`,
      code: `HN-${dist.substring(0, 2).toUpperCase()}`,
      name: `Quận ${dist}`,
      level: 'district' as const,
      parentId: 'TER001',
      status: randomElement(['active', 'active', 'inactive']) as 'active' | 'inactive',
      userCount: randomNumber(30, 100),
    });
  });
  
  // Add wards
  let wardId = 13;
  districts.forEach(dist => {
    wards.slice(0, 3).forEach(ward => {
      territories.push({
        id: `TER${String(wardId++).padStart(3, '0')}`,
        code: `HN-${dist.substring(0, 2)}-${ward.substring(0, 2)}`.toUpperCase(),
        name: `Phường ${ward}`,
        level: 'ward' as const,
        parentId: `TER${districts.indexOf(dist) + 5}`,
        status: randomElement(['active', 'active', 'inactive']) as 'active' | 'inactive',
        userCount: randomNumber(5, 25),
      });
    });
  });
  
  return territories.slice(0, count);
}

// Generate Teams (25 records)
export function generateTeams(count: number = 25): any[] {
  const teams = [];
  const teamTypes = ['department', 'team', 'group'] as const;
  const leaders = generateUsers(25).map(u => u.fullName);
  
  for (let i = 1; i <= count; i++) {
    const type = randomElement(teamTypes);
    const typeName = type === 'department' ? 'Phòng' : type === 'team' ? 'Đội' : 'Tổ';
    const ward = randomElement(wards);
    
    teams.push({
      id: `T${String(i).padStart(3, '0')}`,
      code: `DV${String(i).padStart(3, '0')}`,
      name: `${typeName} QLTT ${ward}`,
      type,
      leader: randomElement(leaders),
      memberCount: randomNumber(5, 30),
      status: randomElement(['active', 'active', 'active', 'inactive']) as 'active' | 'inactive',
    });
  }
  
  return teams;
}

// Generate Categories (40 records)
export function generateCategories(count: number = 40): any[] {
  const categories = [];
  const statuses = ['draft', 'pending', 'approved', 'approved', 'approved', 'rejected'] as const;
  
  for (let i = 1; i <= count; i++) {
    const name = categoryNames[i % categoryNames.length];
    const status = randomElement(statuses);
    
    categories.push({
      id: `C${String(i).padStart(3, '0')}`,
      code: name.substring(0, 2).toUpperCase() + String(i).padStart(2, '0'),
      name,
      type: randomElement(categoryTypes),
      order: i,
      effectiveFrom: generateDate(365).split(' ')[0],
      effectiveTo: Math.random() > 0.8 ? generateDate(30).split(' ')[0] : undefined,
      version: `v${randomNumber(1, 3)}.${randomNumber(0, 5)}`,
      status,
      createdBy: randomElement(['admin', 'user1', 'manager1']),
      createdAt: generateDate(730),
      approvedBy: status === 'approved' ? randomElement(['manager1', 'admin']) : undefined,
      approvedAt: status === 'approved' ? generateDate(365) : undefined,
      description: `Danh mục ${name}`,
    });
  }
  
  return categories;
}

// Generate Risk Indicators (18 records)
export function generateRiskIndicators(count: number = 18): any[] {
  const indicators = [];
  const types = ['high', 'high', 'medium', 'medium', 'medium', 'low'] as const;
  
  for (let i = 1; i <= count; i++) {
    const type = randomElement(types);
    const name = riskNames[i % riskNames.length];
    
    indicators.push({
      id: `RI${String(i).padStart(3, '0')}`,
      code: `RISK_${type.toUpperCase()}_${String(i).padStart(2, '0')}`,
      name,
      type,
      description: `Chỉ báo rủi ro: ${name}`,
      threshold: type === 'high' ? randomNumber(3, 5) : type === 'medium' ? randomNumber(40, 60) : randomNumber(20, 40),
      status: randomElement(['active', 'active', 'active', 'inactive']) as 'active' | 'inactive',
      effectiveFrom: generateDate(365).split(' ')[0],
    });
  }
  
  return indicators;
}

// Generate Checklists (20 records)
export function generateChecklists(count: number = 20): any[] {
  const checklists = [];
  const vietnameseNames = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E', 'Phan Thị F', 'Vũ Văn G', 'Võ Thị H', 'Đặng Văn I', 'Bùi Thị J', 'Đỗ Văn K', 'Hồ Thị L', 'Ngô Văn M', 'Dương Thị N', 'Lý Văn O', 'Mai Thị P', 'Tô Văn Q', 'Trịnh Thị R', 'Đinh Văn S', 'Lâm Thị T'];
  
  for (let i = 1; i <= count; i++) {
    const topic = checklistTopics[i % checklistTopics.length];
    
    checklists.push({
      id: `CL${String(i).padStart(3, '0')}`,
      code: `CL_${topic.substring(0, 4).toUpperCase()}_${String(i).padStart(2, '0')}`,
      name: `Checklist kiểm tra ${topic.toLowerCase()}`,
      topic,
      itemCount: randomNumber(10, 35),
      status: randomElement(['active', 'active', 'active', 'inactive']) as 'active' | 'inactive',
      createdAt: generateDate(365),
      createdBy: randomElement(vietnameseNames),
      description: `Danh sách kiểm tra ${topic.toLowerCase()}`,
      formTemplateId: i % 3 === 0 ? `FORM_${String(i).padStart(3, '0')}` : undefined,
    });
  }
  
  return checklists;
}

// Generate Notification Rules (15 records)
export function generateNotificationRules(count: number = 15): any[] {
  const rules = [];
  const recipients = ['Người được gán', 'Quản lý', 'Người gán + Quản lý', 'Tất cả cán bộ', 'Quản lý cấp huyện'];
  
  for (let i = 1; i <= count; i++) {
    const event = notificationEvents[i % notificationEvents.length];
    
    rules.push({
      id: `NR${String(i).padStart(3, '0')}`,
      name: `Thông báo ${event.toLowerCase()}`,
      event,
      condition: `Khi có ${event.toLowerCase()}`,
      recipients: randomElement(recipients),
      status: randomElement(['active', 'active', 'active', 'inactive']) as 'active' | 'inactive',
      description: `Quy tắc thông báo tự động cho ${event.toLowerCase()}`,
    });
  }
  
  return rules;
}