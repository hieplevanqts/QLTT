export type RiskLevel = 'low' | 'medium' | 'high';
export type MonitoringStatus = 'active' | 'removed';

export interface RiskFactor {
  id: string;
  name: string; // Tên yếu tố
  description: string; // Mô tả ngắn tình trạng
  weight: number; // Trọng số (%)
  score: number; // Điểm thành phần (0-100)
}

export interface MonitoringRecord {
  id: string;
  flaggedDate: string; // Ngày gắn cờ (YYYY-MM-DD)
  displayFlaggedDate: string; // Format: "15/11/2024"
  flaggedBy: string; // Người gắn cờ
  reason: string; // Lý do theo dõi
  status: MonitoringStatus;
  removedDate?: string; // Ngày bỏ cờ (YYYY-MM-DD)
  displayRemovedDate?: string; // Format: "20/11/2024"
  removedBy?: string; // Người bỏ cờ
}

export interface RiskAssessment {
  storeId: number;
  riskLevel: RiskLevel;
  riskScore: number; // Điểm rủi ro (0-100)
  assessmentDate: string; // Ngày đánh giá (YYYY-MM-DD)
  displayAssessmentDate: string; // Format: "15/11/2024"
  assessedBy: string; // Người đánh giá
  factors: RiskFactor[]; // Các yếu tố đánh giá
  recommendations: string[]; // Khuyến nghị
  internalNotes?: string; // Ghi chú nội bộ (chỉ người có quyền xem)
  monitoringHistory: MonitoringRecord[]; // Lịch sử theo dõi
}

// Mock risk assessments data
export const mockRiskAssessments: RiskAssessment[] = [
  // Store ID 1 - Medium Risk
  {
    storeId: 1,
    riskLevel: 'medium',
    riskScore: 58,
    assessmentDate: '2024-11-20',
    displayAssessmentDate: '20/11/2024',
    assessedBy: 'Trần Văn B - Đội QLTT Phường 1',
    factors: [
      {
        id: 'F1',
        name: 'Lịch sử vi phạm',
        description: 'Phát hiện 2 vi phạm nhỏ trong 12 tháng qua, đã khắc phục',
        weight: 30,
        score: 65,
      },
      {
        id: 'F2',
        name: 'Tuân thủ giấy phép',
        description: 'Giấy phép đầy đủ, hợp lệ đến tháng 6/2025',
        weight: 25,
        score: 85,
      },
      {
        id: 'F3',
        name: 'Kết quả kiểm tra',
        description: 'Lần kiểm tra gần nhất đạt yêu cầu, không vi phạm',
        weight: 25,
        score: 80,
      },
      {
        id: 'F4',
        name: 'Phản ánh khách hàng',
        description: '2 phản ánh trong 6 tháng, mức độ thấp, đã xử lý',
        weight: 20,
        score: 70,
      },
    ],
    recommendations: [
      'Duy trì tần suất kiểm tra định kỳ 6 tháng/lần',
      'Theo dõi việc khắc phục các vi phạm đã ghi nhận',
      'Kiểm tra giấy phép trước khi hết hạn để đảm bảo gia hạn kịp thời',
    ],
    internalNotes:
      'Cơ sở có dấu hiệu cải thiện sau lần vi phạm gần đây. Chủ cơ sở hợp tác tốt với cơ quan quản lý. Đề xuất giảm mức độ giám sát xuống "Thường xuyên" sau 6 tháng nếu không có vi phạm mới.',
    monitoringHistory: [
      {
        id: 'M1',
        flaggedDate: '2024-08-22',
        displayFlaggedDate: '22/08/2024',
        flaggedBy: 'Lê Thị C - Đội QLTT Phường 1',
        reason: 'Phát hiện vi phạm vệ sinh ATTP, cần theo dõi việc khắc phục',
        status: 'removed',
        removedDate: '2024-10-15',
        displayRemovedDate: '15/10/2024',
        removedBy: 'Trần Văn B - Đội QLTT Phường 1',
      },
    ],
  },

  // Store ID 2 - High Risk
  {
    storeId: 2,
    riskLevel: 'high',
    riskScore: 35,
    assessmentDate: '2024-11-18',
    displayAssessmentDate: '18/11/2024',
    assessedBy: 'Hoàng Thị E - Đội QLTT Phường 2',
    factors: [
      {
        id: 'F1',
        name: 'Lịch sử vi phạm',
        description: '5 vi phạm trong 12 tháng qua, có vi phạm nghiêm trọng',
        weight: 30,
        score: 25,
      },
      {
        id: 'F2',
        name: 'Tuân thủ giấy phép',
        description: 'Thiếu giấy chứng nhận ATTP, đang trong thời gian chỉnh sửa',
        weight: 25,
        score: 30,
      },
      {
        id: 'F3',
        name: 'Kết quả kiểm tra',
        description: 'Lần kiểm tra gần nhất không đạt, yêu cầu tạm dừng hoạt động',
        weight: 25,
        score: 20,
      },
      {
        id: 'F4',
        name: 'Phản ánh khách hàng',
        description: '7 phản ánh trong 6 tháng, có phản ánh mức độ cao',
        weight: 20,
        score: 40,
      },
    ],
    recommendations: [
      'Tăng tần suất kiểm tra lên 1 lần/tháng cho đến khi cải thiện',
      'Yêu cầu cơ sở khắc phục toàn bộ vi phạm trong vòng 7 ngày',
      'Xem xét đình chỉ hoạt động nếu không khắc phục vi phạm nghiêm trọng',
      'Gắn cờ theo dõi đặc biệt',
    ],
    internalNotes:
      'Cơ sở có dấu hiệu hoạt động không tuân thủ pháp luật. Chủ cơ sở thiếu hợp tác, nhiều lần chậm trễ khắc phục vi phạm. Đề xuất cử thanh tra viên chuyên trách theo dõi hàng tuần. Cân nhắc xử phạt nặng hoặc đề xuất thu hồi giấy phép nếu tình trạng không cải thiện sau 30 ngày.',
    monitoringHistory: [
      {
        id: 'M2',
        flaggedDate: '2024-10-26',
        displayFlaggedDate: '26/10/2024',
        flaggedBy: 'Hoàng Thị E - Đội QLTT Phường 2',
        reason: 'Vi phạm nghiêm trọng về vệ sinh ATTP, cần giám sát chặt chẽ',
        status: 'active',
      },
      {
        id: 'M3',
        flaggedDate: '2024-07-20',
        displayFlaggedDate: '20/07/2024',
        flaggedBy: 'Trần Văn B - Đội QLTT Phường 2',
        reason: 'Nhiều phản ánh từ khách hàng về chất lượng thực phẩm',
        status: 'removed',
        removedDate: '2024-09-10',
        displayRemovedDate: '10/09/2024',
        removedBy: 'Hoàng Thị E - Đội QLTT Phường 2',
      },
    ],
  },

  // Store ID 3 - Low Risk
  {
    storeId: 3,
    riskLevel: 'low',
    riskScore: 85,
    assessmentDate: '2024-11-15',
    displayAssessmentDate: '15/11/2024',
    assessedBy: 'Nguyễn Văn A - Đội QLTT Phường 3',
    factors: [
      {
        id: 'F1',
        name: 'Lịch sử vi phạm',
        description: 'Không có vi phạm trong 24 tháng qua',
        weight: 30,
        score: 95,
      },
      {
        id: 'F2',
        name: 'Tuân thủ giấy phép',
        description: 'Giấy phép đầy đủ, hợp lệ đến tháng 12/2025',
        weight: 25,
        score: 90,
      },
      {
        id: 'F3',
        name: 'Kết quả kiểm tra',
        description: 'Tất cả các lần kiểm tra đều đạt yêu cầu',
        weight: 25,
        score: 85,
      },
      {
        id: 'F4',
        name: 'Phản ánh khách hàng',
        description: '1 phản ánh nhỏ trong 12 tháng, đã xử lý tốt',
        weight: 20,
        score: 75,
      },
    ],
    recommendations: [
      'Duy trì tần suất kiểm tra định kỳ 12 tháng/lần',
      'Tiếp tục duy trì chất lượng hoạt động hiện tại',
    ],
    internalNotes:
      'Cơ sở hoạt động tốt, tuân thủ đầy đủ quy định. Chủ cơ sở có ý thức cao về an toàn thực phẩm. Đề nghị giảm mức độ giám sát xuống "Định kỳ hàng năm".',
    monitoringHistory: [],
  },

  // Store ID 4 - Very High Risk
  {
    storeId: 4,
    riskLevel: 'high',
    riskScore: 28,
    assessmentDate: '2024-11-12',
    displayAssessmentDate: '12/11/2024',
    assessedBy: 'Hoàng Thị E - Chi cục QLTT Phường 4',
    factors: [
      {
        id: 'F1',
        name: 'Lịch sử vi phạm',
        description: '4 vi phạm nghiêm trọng trong 6 tháng qua, chưa khắc phục hoàn toàn',
        weight: 30,
        score: 15,
      },
      {
        id: 'F2',
        name: 'Tuân thủ giấy phép',
        description: 'Thiếu nhiều giấy phép bắt buộc, kinh doanh không đúng ngành nghề',
        weight: 25,
        score: 20,
      },
      {
        id: 'F3',
        name: 'Kết quả kiểm tra',
        description: '3/5 lần kiểm tra không đạt, có vi phạm nghiêm trọng về ATTP',
        weight: 25,
        score: 25,
      },
      {
        id: 'F4',
        name: 'Phản ánh khách hàng',
        description: '5 phản ánh mức độ cao trong 3 tháng, có ca ngộ độc thực phẩm',
        weight: 20,
        score: 35,
      },
    ],
    recommendations: [
      'Tăng tần suất kiểm tra lên 1 lần/tuần cho đến khi cải thiện',
      'Yêu cầu tạm dừng hoạt động ngay lập tức để khắc phục vi phạm nghiêm trọng',
      'Xử phạt nặng và xem xét thu hồi giấy phép nếu không cải thiện trong 15 ngày',
      'Gắn cờ theo dõi đặc biệt, phân công thanh tra viên chuyên trách',
      'Báo cáo hàng tuần về tình trạng khắc phục lên Chi cục QLTT',
    ],
    internalNotes:
      'Cơ sở có dấu hiệu hoạt động thiếu an toàn nghiêm trọng. Đã xảy ra ca ngộ độc thực phẩm khiến 2 người nhập viện. Chủ cơ sở không hợp tác, nhiều lần trốn tránh thanh tra. Đề xuất cử tổ công tác liên ngành kiểm tra đột xuất hàng tuần. Cân nhắc khởi tố hình sự nếu tiếp tục vi phạm gây nguy hiểm cho sức khỏe cộng đồng. Phối hợp với Công an phường để giám sát chặt chẽ.',
    monitoringHistory: [
      {
        id: 'M4',
        flaggedDate: '2024-11-12',
        displayFlaggedDate: '12/11/2024',
        flaggedBy: 'Hoàng Thị E - Chi cục QLTT Phường 4',
        reason: 'Ngộ độc thực phẩm nghiêm trọng, yêu cầu theo dõi đặc biệt và kiểm tra liên tục',
        status: 'active',
      },
      {
        id: 'M5',
        flaggedDate: '2024-10-15',
        displayFlaggedDate: '15/10/2024',
        flaggedBy: 'Trần Văn B - Đội QLTT Phường 4',
        reason: 'Kinh doanh không đúng ngành nghề, thiếu giấy phép PCCC',
        status: 'active',
      },
      {
        id: 'M6',
        flaggedDate: '2024-08-05',
        displayFlaggedDate: '05/08/2024',
        flaggedBy: 'Lê Văn F - Đội QLTT Phường 4',
        reason: 'Vi phạm nghiêm trọng về bảo quản thực phẩm',
        status: 'removed',
        removedDate: '2024-09-20',
        displayRemovedDate: '20/09/2024',
        removedBy: 'Hoàng Thị E - Chi cục QLTT Phường 4',
      },
    ],
  },
];

/**
 * Get risk assessment for a specific store
 */
export function getRiskAssessmentByStoreId(
  storeId: number
): RiskAssessment | undefined {
  return mockRiskAssessments.find((assessment) => assessment.storeId === storeId);
}

/**
 * Get risk level badge configuration
 */
export function getRiskLevelInfo(level: RiskLevel): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (level) {
    case 'low':
      return {
        label: 'Thấp',
        color: 'var(--success-text)',
        bgColor: 'var(--success-bg)',
      };
    case 'medium':
      return {
        label: 'Trung bình',
        color: 'var(--warning-text)',
        bgColor: 'var(--warning-bg)',
      };
    case 'high':
      return {
        label: 'Cao',
        color: 'var(--destructive)',
        bgColor: 'rgba(254, 226, 226, 1)',
      };
    default:
      return {
        label: 'Không xác định',
        color: 'var(--text-secondary)',
        bgColor: 'var(--muted)',
      };
  }
}

/**
 * Get monitoring status badge configuration
 */
export function getMonitoringStatusInfo(status: MonitoringStatus): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (status) {
    case 'active':
      return {
        label: 'Đang theo dõi',
        color: 'var(--warning-text)',
        bgColor: 'var(--warning-bg)',
      };
    case 'removed':
      return {
        label: 'Đã bỏ cờ',
        color: 'var(--text-secondary)',
        bgColor: 'var(--muted)',
      };
    default:
      return {
        label: 'Không xác định',
        color: 'var(--text-secondary)',
        bgColor: 'var(--muted)',
      };
  }
}

/**
 * Calculate risk score from factors
 */
export function calculateRiskScore(factors: RiskFactor[]): number {
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
  const weightedScore = factors.reduce(
    (sum, factor) => sum + (factor.score * factor.weight) / 100,
    0
  );
  return Math.round(weightedScore / (totalWeight / 100));
}
