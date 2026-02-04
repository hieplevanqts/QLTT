/**
 * Utility functions for DepartmentDetailModal
 */

export interface FakeOfficer {
  id: string;
  fullName: string;
  position: string;
  phone: string;
  email: string;
  isTeamLeader: boolean;
  criteria: {
    totalInspections: number;
    violationsCaught: number;
    finesIssued: number;
    totalFineAmount: number;
    complaintsResolved: number;
    educationSessions: number;
  };
  yearsOfService: number;
  specialization: string[];
}

export interface FakeData {
  officers: FakeOfficer[];
  statistics: {
    totalInspections: number;
    totalViolations: number;
    totalFines: number;
    totalFineAmount: number;
    totalComplaints: number;
    totalEducation: number;
    successRate: string;
    resolutionRate: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
}

/**
 * Generate deterministic fake data based on departmentId
 */
export function generateFakeData(departmentId: string): FakeData {
  // Use departmentId as seed for consistent fake data
  const seed = departmentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Vietnamese names
  const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đỗ', 'Bùi', 'Đặng', 'Ngô', 'Cao', 'Trịnh', 'Đinh', 'Phan', 'Mai'];
  const firstNames = ['Văn', 'Thị', 'Minh', 'Hải', 'Lan', 'Anh', 'Tuấn', 'Hương', 'Đức', 'Mai', 'Long', 'Hoa', 'Nam', 'Thu', 'Phương'];
  const middleNames = ['Văn', 'Thị', 'Đức', 'Minh', 'Quang', 'Thị', 'Văn', 'Thị', 'Đức', 'Minh'];
  
  // Generate officer names
  const numOfficers = 3 + (seed % 3); // 3-5 officers
  const officers: FakeOfficer[] = [];
  for (let i = 0; i < numOfficers; i++) {
    const nameSeed = (seed + i * 7) % 1000;
    const lastName = lastNames[nameSeed % lastNames.length];
    const firstName = firstNames[(nameSeed * 3) % firstNames.length];
    const middleName = middleNames[(nameSeed * 2) % middleNames.length];
    const fullName = `${lastName} ${middleName} ${firstName}`;
    
    // Generate phone
    const phonePrefixes = ['091', '092', '093', '094', '095', '096', '097', '098', '099'];
    const phonePrefix = phonePrefixes[(nameSeed * 5) % phonePrefixes.length];
    const phoneNumber = Math.floor(1000000 + (nameSeed * 123) % 9000000);
    const phone = `${phonePrefix}${phoneNumber}`;
    
    // Generate email
    const nameParts = fullName.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(' ')
      .filter(p => p.length > 0);
    const lastNamePart = nameParts[nameParts.length - 1];
    const firstNamePart = nameParts[0];
    const email = `${lastNamePart}${firstNamePart.charAt(0)}${i + 1}@qltt.hanoi.gov.vn`;
    
    // Generate criteria
    const baseInspections = 100 + (nameSeed % 100);
    const violationsRate = 0.2 + (nameSeed % 20) / 100; // 20-40%
    const finesRate = 0.7 + (nameSeed % 20) / 100; // 70-90%
    
    officers.push({
      id: `OFF${String(i + 1).padStart(4, '0')}`,
      fullName,
      position: i === 0 ? 'Đội trưởng' : 'Cán bộ',
      phone,
      email,
      isTeamLeader: i === 0,
      criteria: {
        totalInspections: baseInspections,
        violationsCaught: Math.floor(baseInspections * violationsRate),
        finesIssued: Math.floor(baseInspections * violationsRate * finesRate),
        totalFineAmount: Math.floor(100000000 + (nameSeed * 1000000) % 400000000),
        complaintsResolved: Math.floor(10 + (nameSeed % 20)),
        educationSessions: Math.floor(5 + (nameSeed % 10)),
      },
      yearsOfService: 3 + (nameSeed % 17),
      specialization: [
        'An toàn thực phẩm',
        'Hàng giả hàng nhái',
        'Hàng hóa kém chất lượng',
        'Nhãn mác hàng hóa',
      ].slice(0, 2 + (nameSeed % 3)),
    });
  }
  
  // Generate department statistics
  const totalInspections = officers.reduce((sum, o) => sum + o.criteria.totalInspections, 0);
  const totalViolations = officers.reduce((sum, o) => sum + o.criteria.violationsCaught, 0);
  const totalFines = officers.reduce((sum, o) => sum + o.criteria.finesIssued, 0);
  const totalFineAmount = officers.reduce((sum, o) => sum + o.criteria.totalFineAmount, 0);
  const totalComplaints = officers.reduce((sum, o) => sum + o.criteria.complaintsResolved, 0);
  const totalEducation = officers.reduce((sum, o) => sum + o.criteria.educationSessions, 0);
  
  return {
    officers,
    statistics: {
      totalInspections,
      totalViolations,
      totalFines,
      totalFineAmount,
      totalComplaints,
      totalEducation,
      successRate: totalInspections > 0 ? ((totalViolations / totalInspections) * 100).toFixed(1) : '0',
      resolutionRate: totalViolations > 0 ? ((totalFines / totalViolations) * 100).toFixed(1) : '0',
    },
    contact: {
      phone: `024${Math.floor(3000000 + (seed % 1000000))}`,
      email: `dept${seed % 100}@qltt.hanoi.gov.vn`,
      address: `Số ${10 + (seed % 90)}, Phố ${['Hàng', 'Lý Thường Kiệt', 'Trần Phú', 'Nguyễn Trãi', 'Lê Duẩn'][seed % 5]}, Phường ${['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy'][seed % 5]}, Hà Nội`,
    },
  };
}
