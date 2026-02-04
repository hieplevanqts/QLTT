// Mock data cho Cục QLTT TP Hà Nội với 25 đội
// Mỗi đội có 3-5 cán bộ (1 đội trưởng + 2-4 cán bộ khác)
// Mỗi đội phụ trách các địa bàn (xã/phường) ở Hà Nội

import { hanoiWards } from './hanoiWards';

export interface Officer {
  id: string;
  fullName: string;
  position: string; // Chức vụ: "Đội trưởng" hoặc "Cán bộ"
  phone: string;
  email: string;
  teamId: string; // ID của đội
  teamName: string; // Tên đội
  isTeamLeader: boolean; // true nếu là đội trưởng
  ward?: string; // Phường/xã chính phụ trách (optional)
  district?: string; // Phường/Xã (optional)
  // Tiêu chí ngành
  criteria: {
    totalInspections: number;
    violationsCaught: number;
    finesIssued: number;
    totalFineAmount: number;
    complaintsResolved: number;
    educationSessions: number;
  };
  // Thông tin bổ sung
  yearsOfService: number;
  specialization: string[];
}

export interface Team {
  id: string;
  name: string; // "Đội QLTT Số 1", "Đội QLTT Số 2", etc.
  officers: Officer[];
  managedWards: Array<{
    name: string;
    district: string;
    province: string;
  }>;
}

export interface Department {
  id: string;
  name: string; // "Cục QLTT TP Hà Nội"
  teams: Team[];
}

// Helper function to generate random number between min and max
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate random phone number
function generatePhone(): string {
  const prefixes = ['091', '092', '093', '094', '095', '096', '097', '098', '099'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix}${number}`;
}

// Helper function to generate email from name
function generateEmail(fullName: string, teamNumber: number): string {
  const nameParts = fullName.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')
    .filter(p => p.length > 0);
  const lastName = nameParts[nameParts.length - 1];
  const firstName = nameParts[0];
  const middleName = nameParts.length > 2 ? nameParts[1].charAt(0) : '';
  const email = middleName 
    ? `${lastName}${firstName.charAt(0)}${middleName}${teamNumber}@qltt.hanoi.gov.vn`
    : `${lastName}${firstName.charAt(0)}${teamNumber}@qltt.hanoi.gov.vn`;
  return email;
}

// Helper function to generate random criteria
function generateCriteria(): Officer['criteria'] {
  return {
    totalInspections: randomInt(100, 200),
    violationsCaught: randomInt(20, 60),
    finesIssued: randomInt(15, 50),
    totalFineAmount: randomInt(100000000, 500000000),
    complaintsResolved: randomInt(10, 30),
    educationSessions: randomInt(5, 15),
  };
}

// Helper function to generate random specialization
function generateSpecialization(): string[] {
  const allSpecializations = [
    'An toàn thực phẩm',
    'Hàng giả hàng nhái',
    'Hàng hóa kém chất lượng',
    'Nhãn mác hàng hóa',
    'Sở hữu trí tuệ',
    'Hàng cấm',
    'Bảo vệ người tiêu dùng',
    'Hàng hóa nhập lậu',
    'Kiểm tra chợ truyền thống',
    'An toàn vệ sinh thực phẩm',
    'Quản lý giá',
    'Hoạt động kinh doanh có điều kiện',
    'Trang sức vàng bạc',
    'Hàng thủ công mỹ nghệ',
    'Nguồn gốc xuất xứ',
  ];
  const count = randomInt(2, 4);
  const shuffled = [...allSpecializations].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to generate officer name
function generateOfficerName(index: number, isLeader: boolean): string {
  const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đỗ', 'Bùi', 'Đặng', 'Ngô', 'Cao', 'Trịnh', 'Đinh', 'Phan', 'Mai'];
  const firstNames = ['Văn', 'Thị', 'Minh', 'Hải', 'Lan', 'Anh', 'Tuấn', 'Hương', 'Đức', 'Mai', 'Long', 'Hoa', 'Nam', 'Thu', 'Phương'];
  const middleNames = ['Văn', 'Thị', 'Đức', 'Minh', 'Quang', 'Thị', 'Văn', 'Thị', 'Đức', 'Minh'];
  
  const lastName = lastNames[index % lastNames.length];
  const firstName = isLeader 
    ? ['Đức', 'Minh', 'Tuấn', 'Anh', 'Hải', 'Long', 'Sơn', 'Thành', 'Hùng', 'Kiên'][index % 10]
    : firstNames[(index * 3) % firstNames.length];
  const middleName = middleNames[(index * 2) % middleNames.length];
  
  return `${lastName} ${middleName} ${firstName}`;
}

// Get all wards from Hanoi
function getAllHanoiWards(): Array<{ name: string; district: string; province: string }> {
  const allWards: Array<{ name: string; district: string; province: string }> = [];
  Object.keys(hanoiWards).forEach(district => {
    hanoiWards[district].forEach(ward => {
      allWards.push({
        name: ward.name,
        district: ward.district,
        province: ward.province,
      });
    });
  });
  return allWards;
}

// Generate teams data
function generateTeamsData(): Department {
  const allWards = getAllHanoiWards();
  const totalWards = allWards.length;
  const wardsPerTeam = Math.ceil(totalWards / 25);
  
  const teams: Team[] = [];
  let officerIdCounter = 1;
  let wardIndex = 0;
  
  for (let teamNum = 1; teamNum <= 25; teamNum++) {
    const teamId = `TEAM${teamNum.toString().padStart(2, '0')}`;
    const teamName = `Đội QLTT Số ${teamNum}`;
    
    // Random number of officers: 3-5
    const numOfficers = randomInt(3, 5);
    const officers: Officer[] = [];
    
    // Generate officers
    for (let i = 0; i < numOfficers; i++) {
      const isLeader = i === 0; // First officer is team leader
      const officerId = `OFF${officerIdCounter.toString().padStart(4, '0')}`;
      const fullName = generateOfficerName(officerIdCounter - 1, isLeader);
      
      officers.push({
        id: officerId,
        fullName,
        position: isLeader ? 'Đội trưởng' : 'Cán bộ',
        phone: generatePhone(),
        email: generateEmail(fullName, teamNum),
        teamId,
        teamName,
        isTeamLeader: isLeader,
        criteria: generateCriteria(),
        yearsOfService: randomInt(3, 20),
        specialization: generateSpecialization(),
      });
      
      officerIdCounter++;
    }
    
    // Assign wards to this team
    const teamWards = allWards.slice(wardIndex, Math.min(wardIndex + wardsPerTeam, totalWards));
    wardIndex += wardsPerTeam;
    
    teams.push({
      id: teamId,
      name: teamName,
      officers,
      managedWards: teamWards,
    });
  }
  
  return {
    id: 'DEPT001',
    name: 'Cục QLTT TP Hà Nội',
    teams,
  };
}

// Generate and export the data
export const departmentData: Department = generateTeamsData();

// Export flat list of all officers for backward compatibility
export const officersData: Officer[] = departmentData.teams.flatMap(team => team.officers);

// Export teams data
export const teamsData: Team[] = departmentData.teams;
