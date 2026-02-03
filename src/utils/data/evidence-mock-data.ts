/**
 * Mock Data for Evidence Module
 * Bám sát Data Dictionary 8.1-8.4
 */

import {
  EvidenceItem,
  EvidenceType,
  EvidenceStatus,
  EvidenceSource,
  SensitivityLabel,
  CustodyEvent,
  EvidencePackage,
  ExportJob,
  createEvidenceItem,
  createCustodyEvent,
  createEvidencePackage,
  createExportJob
} from '@/types/evidence.types';

/**
 * Generate Mock Evidence Items with diverse data
 */
export function generateMockEvidenceItems(count: number = 50): EvidenceItem[] {
  const items: EvidenceItem[] = [];

  // Evidence 1: Photo - Approved - MULTIPLE FILES EXAMPLE
  const evidence1 = createEvidenceItem({
    evidenceId: 'EVD-2026-1250',
    evidenceName: 'Vi phạm vệ sinh tại nhà hàng Phường 1',
    type: 'PHOTO',
    status: 'Approved',
    scope: {
      province: 'Hà Nội',
      ward: 'Phường Bến Nghé',
      unitId: 'UNIT-Q1-001'
    },
    source: 'MobileCapture',
    capturedAt: '2026-01-10T09:00:00Z',
    uploadedAt: '2026-01-10T09:30:00Z',
    location: {
      lat: 10.7769,
      lng: 106.7009,
      addressText: '123 Đường Lê Lợi, Phường Bến Nghé, Phường 1, Hà Nội',
      precision: 10,
      confidence: 0.95
    },
    file: {
      storageKey: 'evidence/EVD-2026-1250.jpg',
      filename: 'vi_pham_ve_sinh.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 2457600
    },
    hashes: [
      {
        alg: 'SHA-256',
        value: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0',
        computedAt: '2026-01-10T09:30:15Z',
        computedBy: 'System'
      }
    ],
    sensitivityLabel: 'Restricted',
    submitter: {
      userId: 'USER-001',
      unitId: 'UNIT-Q1-001'
    },
    review: {
      assignedReviewerId: 'REVIEWER-001',
      decision: 'Approved',
      decisionAt: '2026-01-10T14:30:00Z',
      decisionReason: 'Evidence is clear and meets all requirements'
    },
    links: [
      { entityType: 'LEAD', entityId: 'CASE-2026-048' },
      { entityType: 'TASK', entityId: 'TASK-2026-091' }
    ],
    createdAt: '2026-01-10T09:30:00Z',
    updatedAt: '2026-01-10T14:30:00Z',
    notes: 'Vi phạm vệ sinh tại bếp chế biến, phát hiện côn trùng trong khu vực lưu trữ thực phẩm',
    tags: ['food-safety', 'inspection', 'violation'],
  });
  
  // Add 2 more files to evidence 1 (multiple files example)
  evidence1.files.push(
    {
      storageKey: 'evidence/EVD-2026-1250-2.jpg',
      filename: 'vi_pham_ve_sinh_close_up.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 1834500
    },
    {
      storageKey: 'evidence/EVD-2026-1250-3.jpg',
      filename: 'khu_vuc_luu_tru.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 2156700
    },
    {
      storageKey: 'evidence/EVD-2026-1250-4.jpg',
      filename: 'thiet_bi_bep_ban.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 2892100
    },
    {
      storageKey: 'evidence/EVD-2026-1250-5.jpg',
      filename: 'khu_vuc_che_bien.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 3124800
    }
  );
  
  items.push(evidence1);

  // Evidence 2: Video - InReview
  const evidence2 = createEvidenceItem({
    evidenceId: 'EVD-2026-1251',
    evidenceName: 'Quy trình chế biến thực phẩm tại nhà hàng Phường 3',
    type: 'VIDEO',
    status: 'InReview',
    scope: {
      province: 'Hà Nội',
      ward: 'Phường 7',
      unitId: 'UNIT-Q3-002'
    },
    source: 'MobileCapture',
    capturedAt: '2026-01-11T10:15:00Z',
    uploadedAt: '2026-01-11T10:45:00Z',
    location: {
      lat: 10.7847,
      lng: 106.6884,
      addressText: '456 Đường Nam Kỳ Khởi Nghĩa, Phường 7, Phường 3, Hà Nội',
      precision: 15,
      confidence: 0.88
    },
    file: {
      storageKey: 'evidence/EVD-2026-1251.mp4',
      filename: 'food_handling_process.mp4',
      mimeType: 'video/mp4',
      sizeBytes: 45678900,
      durationSec: 120
    },
    hashes: [
      {
        alg: 'SHA-256',
        value: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1',
        computedAt: '2026-01-11T10:45:30Z',
        computedBy: 'System'
      }
    ],
    sensitivityLabel: 'Internal',
    submitter: {
      userId: 'USER-002',
      unitId: 'UNIT-Q3-002'
    },
    review: {
      assignedReviewerId: 'REVIEWER-002'
    },
    links: [
      { entityType: 'STORE', entityId: 'STORE-048' }
    ],
    createdAt: '2026-01-11T10:45:00Z',
    updatedAt: '2026-01-11T10:45:00Z',
    notes: 'Video ghi lại quy trình chế biến món ăn tại nhà hàng',
    tags: ['food-handling', 'inspection'],
  });

  items.push(evidence2);

  // Evidence 3: PDF - Sealed
  items.push(createEvidenceItem({
    evidenceId: 'EVD-2026-1252',
    evidenceName: 'Giấy phép kinh doanh thực phẩm hết hạn',
    type: 'PDF',
    status: 'Sealed',
    scope: {
      province: 'Hà Nội',
      ward: 'Phường 14',
      unitId: 'UNIT-Q5-003'
    },
    source: 'PortalUpload',
    capturedAt: '2026-01-09T08:00:00Z',
    uploadedAt: '2026-01-09T08:30:00Z',
    location: {
      lat: 10.7547,
      lng: 106.6662,
      addressText: '789 Đường Trần Hưng Đạo, Phường 14, Phường 5, Hà Nội',
      precision: 0,
      confidence: 1.0
    },
    file: {
      storageKey: 'evidence/EVD-2026-1252.pdf',
      filename: 'inspection_report_052.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 3456789,
      pageCount: 15
    },
    hashes: [
      {
        alg: 'SHA-256',
        value: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
        computedAt: '2026-01-09T08:30:45Z',
        computedBy: 'System'
      }
    ],
    sensitivityLabel: 'Secret-lite',
    submitter: {
      userId: 'USER-003',
      unitId: 'UNIT-Q5-003'
    },
    review: {
      assignedReviewerId: 'REVIEWER-003',
      decision: 'Approved',
      decisionAt: '2026-01-09T16:00:00Z',
      decisionReason: 'Official inspection report - approved for sealing'
    },
    links: [
      { entityType: 'PLAN', entityId: 'PLAN-2026-Q1' },
      { entityType: 'LEAD', entityId: 'CASE-2026-045' }
    ],
    createdAt: '2026-01-09T08:30:00Z',
    updatedAt: '2026-01-09T18:00:00Z',
    notes: 'Báo cáo thanh tra chính thức, đã niêm phong',
    tags: ['inspection-report', 'sealed', 'official'],
  }));

  // Evidence 4: Photo - Submitted
  const evidence4 = createEvidenceItem({
    evidenceId: 'EVD-2026-1253',
    evidenceName: 'Mẫu thực phẩm nghi ngờ nhiễm khuẩn',
    type: 'PHOTO',
    status: 'Submitted',
    scope: {
      province: 'Hà Nội',
      ward: 'Phường Tân Định',
      unitId: 'UNIT-Q1-001'
    },
    source: 'MobileCapture',
    capturedAt: '2026-01-12T11:20:00Z',
    uploadedAt: '2026-01-12T11:30:00Z',
    location: {
      lat: 10.7923,
      lng: 106.6849,
      addressText: '321 Đường Võ Văn Tần, Phường Tân Định, Phường 1, Hà Nội',
      precision: 12,
      confidence: 0.92
    },
    file: {
      storageKey: 'evidence/EVD-2026-1253.jpg',
      filename: 'food_sample_contaminated.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 1876543
    },
    hashes: [
      {
        alg: 'SHA-256',
        value: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3',
        computedAt: '2026-01-12T11:30:22Z',
        computedBy: 'System'
      }
    ],
    sensitivityLabel: 'Internal',
    submitter: {
      userId: 'USER-004',
      unitId: 'UNIT-Q1-001'
    },
    review: {},
    links: [
      { entityType: 'RISK', entityId: 'RISK-2026-012' }
    ],
    createdAt: '2026-01-12T11:30:00Z',
    updatedAt: '2026-01-12T11:30:00Z',
    notes: 'Mẫu thực phẩm nghi ngờ bị nhiễm khuẩn',
    tags: ['food-sample', 'contamination'],
  });
  
  // Add more image files to evidence 4
  evidence4.files.push(
    {
      storageKey: 'evidence/EVD-2026-1253-2.jpg',
      filename: 'food_sample_microscope.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 2345678
    },
    {
      storageKey: 'evidence/EVD-2026-1253-3.jpg',
      filename: 'package_label.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 1234567
    }
  );
  
  items.push(evidence4);

  // Evidence 5: DOC - Draft
  items.push(createEvidenceItem({
    evidenceId: 'EVD-2026-1254',
    evidenceName: 'Báo cáo sơ bộ kết quả thanh tra',
    type: 'DOC',
    status: 'Draft',
    scope: {
      province: 'Hà Nội',
      ward: 'Phường 6',
      unitId: 'UNIT-Q3-002'
    },
    source: 'PortalUpload',
    capturedAt: '2026-01-12T14:00:00Z',
    uploadedAt: '2026-01-12T14:15:00Z',
    location: {
      lat: 10.7801,
      lng: 106.6928,
      addressText: '654 Đường Điện Biên Phủ, Phường 6, Phường 3, Hà Nội',
      precision: 0,
      confidence: 1.0
    },
    file: {
      storageKey: 'evidence/EVD-2026-1254.docx',
      filename: 'preliminary_findings.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      sizeBytes: 234567,
      pageCount: 5
    },
    hashes: [],
    sensitivityLabel: 'Internal',
    submitter: {
      userId: 'USER-005',
      unitId: 'UNIT-Q3-002'
    },
    review: {},
    links: [],
    createdAt: '2026-01-12T14:15:00Z',
    updatedAt: '2026-01-12T14:15:00Z',
    notes: 'Nháp kết quả sơ bộ - chưa hoàn thành',
    tags: ['draft', 'preliminary'],
  }));

  // Evidence 6: AUDIO - Approved
  items.push(createEvidenceItem({
    evidenceId: 'EVD-2026-1255',
    evidenceName: 'Phỏng vấn chủ nhà hàng về vi phạm ATVSTP',
    type: 'AUDIO',
    status: 'Approved',
    scope: {
      province: 'Hà Nội',
      ward: 'Phường An Phú',
      unitId: 'UNIT-Q1-001'
    },
    source: 'MobileCapture',
    capturedAt: '2026-01-11T16:45:00Z',
    uploadedAt: '2026-01-11T17:00:00Z',
    location: {
      lat: 10.8032,
      lng: 106.7423,
      addressText: '987 Đường Lương Định Của, Phường An Phú, Phường 2, Hà Nội',
      precision: 18,
      confidence: 0.85
    },
    file: {
      storageKey: 'evidence/EVD-2026-1255.m4a',
      filename: 'interview_restaurant_owner.m4a',
      mimeType: 'audio/m4a',
      sizeBytes: 8765432,
      durationSec: 360
    },
    hashes: [
      {
        alg: 'SHA-256',
        value: 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4',
        computedAt: '2026-01-11T17:00:55Z',
        computedBy: 'System'
      }
    ],
    sensitivityLabel: 'Restricted',
    submitter: {
      userId: 'USER-006',
      unitId: 'UNIT-Q1-001'
    },
    review: {
      assignedReviewerId: 'REVIEWER-001',
      decision: 'Approved',
      decisionAt: '2026-01-12T09:00:00Z',
      decisionReason: 'Clear recording of interview'
    },
    links: [
      { entityType: 'LEAD', entityId: 'CASE-2026-050' },
      { entityType: 'STORE', entityId: 'STORE-075' }
    ],
    createdAt: '2026-01-11T17:00:00Z',
    updatedAt: '2026-01-12T09:00:00Z',
    notes: 'Ghi âm phỏng vấn chủ nhà hàng về vi phạm',
    tags: ['interview', 'audio-recording'],
  }));

  // Generate additional 44 diverse evidence items programmatically
  const provinces = [
    { name: 'Hà Nội', wards: ['Phường Hàng Bài', 'Phường Ngọc Hà', 'Phường Hàng Bông', 'Phường Hàng Trống', 'Phường Nhân Chính', 'Phường Khương Thượng', 'Phường Quảng An', 'Phường Ngọc Lâm'] },
    { name: 'TP. HCM', wards: ['Phường Thảo Điền', 'Phường 8', 'Phường 10', 'Phường Tân Thuận Đông', 'Phường 11', 'Phường 12', 'Phường 15', 'Phường 22', 'Phường 10 (Phường GV)', 'Phường 13 (Phường TB)', 'Phường 15 (Phường PN)', 'Phường Tân Sơn Nhì'] },
    { name: 'Đà Nẵng', wards: ['Phường Hòa Thuận Tây', 'Phường An Hải Bắc', 'Phường Thọ Quang', 'Phường Mỹ An', 'Phường Hòa Minh', 'Phường Khuê Trung'] },
    { name: 'Cần Thơ', wards: ['Phường Xuân Khánh', 'Phường Bình Thủy', 'Phường Lê Bình', 'Phường Long Hòa', 'Phường Thới An Đông'] },
    { name: 'Hải Phòng', wards: ['Phường Đông Khê', 'Phường Máy Chai', 'Phường Trại Cau', 'Phường Đông Hải', 'Phường Trần Nguyên Hãn', 'Phường Vạn Mỹ'] },
    { name: 'Thừa Thiên Huế', wards: ['Phường Phú Hòa', 'Phường Phú Cát', 'Phường Thuận Hòa'] },
    { name: 'Khánh Hòa', wards: ['Phường Vĩnh Hòa', 'Phường Vĩnh Phước', 'Phường Phương Sài', 'Phường Vĩnh Nguyên'] },
    { name: 'Bình Dương', wards: ['Phường Phú Lợi', 'Phường Dĩ An', 'Phường An Phú', 'Phường Bình Hòa'] },
    { name: 'Đồng Nai', wards: ['Phường Trảng Dài', 'Phường Tân Hiệp', 'Phường Phước Tân', 'Phường Xuân Trung'] },
    { name: 'Bà Rịa - Vũng Tàu', wards: ['Phường 1', 'Phường 2', 'Phường Phước Hưng', 'Phường Bình Giã'] },
    { name: 'Long An', wards: ['Phường 1 (TP. Tân An)', 'Phường 2 (TP. Tân An)', 'Phường 3 (TP. Tân An)', 'Phường 4 (TP. Tân An)'] },
    { name: 'Quảng Ninh', wards: ['Phường Bãi Cháy', 'Phường Hồng Hà', 'Phường Mông Dương', 'Phường Đại Yên'] },
    { name: 'Nghệ An', wards: ['Phường Lê Lợi', 'Phường Quang Trung', 'Phường Nghi Hải', 'Phường Nghi Thuỷ'] },
    { name: 'Bình Định', wards: ['Phường Lê Hồng Phong', 'Phường Trần Phú', 'Phường Nhơn Bình', 'Phường Nhơn Phú'] },
    { name: 'Lâm Đồng', wards: ['Phường 1 (TP. Đà Lạt)', 'Phường 2 (TP. Đà Lạt)', 'Phường 1 (TP. Bảo Lộc)', 'Phường 2 (TP. Bảo Lộc)'] }
  ];

  const types: EvidenceType[] = ['PHOTO', 'VIDEO', 'AUDIO', 'DOC', 'PDF', 'OTHER'];
  const statuses: EvidenceStatus[] = ['Draft', 'Submitted', 'InReview', 'Approved', 'Rejected', 'NeedMoreInfo', 'Sealed'];
  const sources: EvidenceSource[] = ['MobileCapture', 'PortalUpload', 'Import'];
  const sensitivityLabels: SensitivityLabel[] = ['Public', 'Internal', 'Restricted', 'Secret-lite'];

  const entityTypes: Array<'LEAD' | 'RISK' | 'TASK' | 'STORE'> = ['LEAD', 'RISK', 'TASK', 'STORE'];

  // Evidence name templates for realistic data
  const evidenceNameTemplates = [
    'Vi phạm vệ sinh an toàn thực phẩm',
    'Kiểm tra nguồn gốc xuất xứ hàng hóa',
    'Phát hiện thực phẩm không rõ nguồn gốc',
    'Giấy chứng nhận kinh doanh hết hạn',
    'Báo cáo thanh tra định kỳ',
    'Không gian bếp không đảm bảo vệ sinh',
    'Nhân viên không có giấy khám sức khỏe',
    'Thực phẩm quá hạn sử dụng',
    'Vi phạm quy định bảo quản thực phẩm',
    'Hồ sơ chứng từ không đầy đủ',
    'Phát hiện côn trùng trong khu vực chế biến',
    'Thiết bị chế biến không đảm bảo',
    'Ghi nhận quy trình chế biến món ăn',
    'Phỏng vấn chủ cơ sở kinh doanh',
    'Mẫu thực phẩm gửi kiểm nghiệm',
    'Biên bản vi phạm hành chính',
    'Cam kết khắc phục vi phạm',
    'Ảnh hiện trường kiểm tra',
    'Tài liệu hướng dẫn an toàn thực phẩm',
    'Báo cáo kết quả kiểm nghiệm mẫu'
  ];

  for (let i = 0; i < 44; i++) {
    const evidenceId = `EVD-2026-${1256 + i}`;
    const typeIndex = i % types.length;
    const type = types[typeIndex];

    const provinceIndex = i % provinces.length;
    const province = provinces[provinceIndex];
    const wardIndex = i % province.wards.length;
    const ward = province.wards[wardIndex];
    
    const statusIndex = i % statuses.length;
    const status = statuses[statusIndex];
    
    const sourceIndex = i % sources.length;
    const source = sources[sourceIndex];
    
    const sensitivityIndex = i % sensitivityLabels.length;
    const sensitivityLabel = sensitivityLabels[sensitivityIndex];

    // Random location coordinates (Vietnam general area)
    const latBase = 10.0 + (provinceIndex * 1.5);
    const lngBase = 105.5 + (provinceIndex * 0.8);

    // Unit ID
    const unitId = `UNIT-${province.name.substring(0, 3)}-${String(i % 10).padStart(3, '0')}`;

    // File extension based on type
    const fileExt: Record<EvidenceType, string> = {
      PHOTO: 'jpg',
      VIDEO: 'mp4',
      AUDIO: 'm4a',
      DOC: 'docx',
      PDF: 'pdf',
      OTHER: 'zip'
    };

    const mimeType: Record<EvidenceType, string> = {
      PHOTO: 'image/jpeg',
      VIDEO: 'video/mp4',
      AUDIO: 'audio/m4a',
      DOC: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      PDF: 'application/pdf',
      OTHER: 'application/zip'
    };

    // Random file size (1MB - 50MB)
    const sizeBytes = 1000000 + Math.floor(Math.random() * 49000000);

    // Hash value (mock)
    const hashValue = Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    // Random dates
    const daysAgo = Math.floor(Math.random() * 30);
    const capturedDate = new Date();
    capturedDate.setDate(capturedDate.getDate() - daysAgo);
    const uploadedDate = new Date(capturedDate);
    uploadedDate.setHours(capturedDate.getHours() + 1);

    // Random links (0-3)
    const linkCount = Math.floor(Math.random() * 4);
    const links = [];
    for (let j = 0; j < linkCount; j++) {
      const entityType = entityTypes[j % entityTypes.length];
      links.push({
        entityType,
        entityId: `${entityType}-${2026}-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`
      });
    }

    const evidence = createEvidenceItem({
      evidenceId,
      type,
      status,
      scope: {
        province: province.name,
        ward,
        unitId
      },
      source,
      capturedAt: capturedDate.toISOString(),
      location: {
        lat: latBase + (i * 0.01) % 0.5,
        lng: lngBase + (i * 0.008) % 0.3,
        addressText: `${ward}, ${province.name}`,
        precision: 10 + (i % 30),
        confidence: 0.70 + (i % 25) / 100
      },
      file: {
        storageKey: `evidence/${evidenceId}.${fileExt[type]}`,
        filename: `evidence_${i + 1}.${fileExt[type]}`,
        mimeType: mimeType[type],
        sizeBytes,
        durationSec: (type === 'VIDEO' || type === 'AUDIO') ? 60 + (i * 30) % 300 : undefined,
        pageCount: (type === 'PDF' || type === 'DOC') ? 5 + (i % 20) : undefined
      },
      hashes: status !== 'Draft' ? [
        {
          alg: 'SHA-256',
          value: hashValue,
          computedAt: uploadedDate.toISOString(),
          computedBy: 'System'
        }
      ] : [],
      sensitivityLabel,
      submitter: {
        userId: `USER-${String(i % 20).padStart(3, '0')}`,
        unitId
      },
      review: status === 'Approved' || status === 'Rejected' ? {
        assignedReviewerId: `REVIEWER-${String(i % 5).padStart(3, '0')}`,
        decision: status === 'Approved' ? 'Approved' : 'Rejected',
        decisionAt: new Date(uploadedDate.getTime() + 3600000 * 4).toISOString(),
        decisionReason: status === 'Approved' ? 'Meets requirements' : 'Insufficient quality'
      } : (status === 'InReview' ? {
        assignedReviewerId: `REVIEWER-${String(i % 5).padStart(3, '0')}`
      } : {}),
      links,
      notes: `Evidence ${i + 1} - ${type} from ${province.name}`,
      tags: [`tag-${i % 5}`, type.toLowerCase()],
    });
    
    // Add multiple image files for PHOTO evidence
    if (type === 'PHOTO') {
      const additionalFileCount = 2 + (i % 4); // 2-5 additional files
      for (let f = 0; f < additionalFileCount; f++) {
        evidence.files.push({
          storageKey: `evidence/${evidenceId}-${f + 2}.jpg`,
          filename: `evidence_${i + 1}_${f + 2}.jpg`,
          mimeType: 'image/jpeg',
          sizeBytes: 1000000 + Math.floor(Math.random() * 3000000)
        });
      }
    }

    // Assign a random evidence name template
    const evidenceNameIndex = i % evidenceNameTemplates.length;
    evidence.evidenceName = evidenceNameTemplates[evidenceNameIndex];

    items.push(evidence);
  }

  return items;
}

/**
 * Generate Mock Custody Events for an Evidence Item
 */
export function generateMockCustodyEvents(evidenceId: string, count: number = 10): CustodyEvent[] {
  const events: CustodyEvent[] = [];
  const eventTypes: Array<'Upload' | 'Submit' | 'View' | 'Edit' | 'Review' | 'Approve'> = 
    ['Upload', 'Submit', 'View', 'Edit', 'Review', 'Approve'];

  for (let i = 0; i < count; i++) {
    const eventType = eventTypes[i % eventTypes.length];
    const daysAgo = count - i;
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() - daysAgo);

    events.push(createCustodyEvent(
      evidenceId,
      eventType,
      `USER-${String(i % 10).padStart(3, '0')}`,
      'UNIT-001',
      {
        ip: `192.168.1.${100 + i}`,
        device: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        requestId: `REQ-${Date.now()}-${i}`
      },
      `Event ${i + 1}: ${eventType}`
    ));
  }

  return events;
}

/**
 * Generate Mock Evidence Packages
 */
export function generateMockEvidencePackages(count: number = 10): EvidencePackage[] {
  const packages: EvidencePackage[] = [];

  for (let i = 0; i < count; i++) {
    const packageId = `PKG-2026-${String(i + 1).padStart(4, '0')}`;
    const pkg = createEvidencePackage(
      packageId,
      `Evidence Package ${i + 1}`,
      'UNIT-001',
      `USER-${String(i % 5).padStart(3, '0')}`,
      {
        province: 'Hà Nội',
        ward: 'Phường Bến Nghé'
      }
    );

    // Add random evidence items
    const itemCount = 3 + (i % 5);
    for (let j = 0; j < itemCount; j++) {
      pkg.items.push({
        evidenceId: `EVD-2026-${1250 + j}`,
        order: j + 1
      });
    }

    packages.push(pkg);
  }

  return packages;
}

/**
 * Generate Mock Export Jobs
 */
export function generateMockExportJobs(count: number = 10): ExportJob[] {
  const jobs: ExportJob[] = [];
  const jobTypes: Array<'EVIDENCE_PACKAGE' | 'CHAIN_OF_CUSTODY' | 'ITEMS_LIST'> = 
    ['EVIDENCE_PACKAGE', 'CHAIN_OF_CUSTODY', 'ITEMS_LIST'];
  const jobStatuses: Array<'Pending' | 'Processing' | 'Completed' | 'Failed'> = 
    ['Pending', 'Processing', 'Completed', 'Failed'];

  for (let i = 0; i < count; i++) {
    const jobId = `JOB-2026-${String(i + 1).padStart(4, '0')}`;
    const type = jobTypes[i % jobTypes.length];
    const status = jobStatuses[i % jobStatuses.length];

    const job = createExportJob(
      jobId,
      type,
      `USER-${String(i % 10).padStart(3, '0')}`
    );

    job.status = status;

    if (status === 'Completed') {
      job.completedAt = new Date(Date.now() - 3600000 * (i + 1)).toISOString();
      job.downloadUrl = `/downloads/${jobId}.zip`;
      job.fileSizeBytes = 5000000 + Math.floor(Math.random() * 10000000);
      job.downloadCount = i % 5;
      if (job.downloadCount > 0) {
        job.lastDownloadedAt = new Date(Date.now() - 1800000 * i).toISOString();
      }
    } else if (status === 'Failed') {
      job.errorMessage = 'Export process failed due to network timeout';
    }

    jobs.push(job);
  }

  return jobs;
}
