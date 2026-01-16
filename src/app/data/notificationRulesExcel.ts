/**
 * Notification Rules Excel Template - MAPPA Portal
 * Excel Import/Export cho Notification Rules
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import * as XLSX from 'xlsx';
import {
  NotificationRule,
  SAMPLE_NOTIFICATION_RULES,
  getEventTypeLabel,
  getScopeTypeLabel,
  formatChannels,
  formatRoles,
  ALL_EVENT_TYPES,
  ALL_RECIPIENT_ROLES,
  ALL_SCOPE_TYPES,
  ALL_CHANNELS,
} from './notificationRulesTemplates';

// ============================================================================
// EXCEL EXPORT
// ============================================================================

/**
 * Xuất danh sách Notification Rules ra Excel
 */
export const exportRulesToExcel = (
  rules: NotificationRule[] = SAMPLE_NOTIFICATION_RULES
) => {
  try {
    const data = rules.map((rule, index) => ({
      'STT': index + 1,
      'Mã Quy Tắc': rule.rule_code,
      'Tên Quy Tắc': rule.rule_name,
      'Mô Tả': rule.description,
      'Loại Sự Kiện': getEventTypeLabel(rule.event_type),
      'Vai Trò Nhận': formatRoles(rule.recipient_roles),
      'Phạm Vi': getScopeTypeLabel(rule.scope_type),
      'Kênh': formatChannels(rule.channels),
      'Cooldown (phút)': rule.cooldown_minutes || '',
      'Trạng Thái': rule.status,
      'Ưu Tiên': rule.priority,
      'Người Tạo': rule.created_by,
      'Ngày Tạo': rule.created_at,
      'Cập Nhật': rule.updated_at,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Notification Rules');

    // Auto-size columns
    const wscols = [
      { wch: 5 },   // STT
      { wch: 20 },  // Mã
      { wch: 40 },  // Tên
      { wch: 60 },  // Mô tả
      { wch: 25 },  // Loại sự kiện
      { wch: 30 },  // Vai trò
      { wch: 20 },  // Phạm vi
      { wch: 30 },  // Kênh
      { wch: 15 },  // Cooldown
      { wch: 12 },  // Trạng thái
      { wch: 12 },  // Ưu tiên
      { wch: 20 },  // Người tạo
      { wch: 20 },  // Ngày tạo
      { wch: 20 },  // Cập nhật
    ];
    ws['!cols'] = wscols;

    const fileName = `Notification_Rules_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error('❌ Error exporting to Excel:', error);
    return { success: false, error };
  }
};

// ============================================================================
// EXCEL TEMPLATE DOWNLOAD
// ============================================================================

/**
 * Tải file Excel mẫu để nhập liệu
 */
export const downloadExcelTemplate = () => {
  try {
    // Sheet 1: Template
    const templateData = [
      {
        'rule_code': 'SLA_ALERT_001',
        'rule_name': 'Ví dụ: Cảnh báo SLA',
        'description': 'Mô tả chi tiết về quy tắc',
        'event_type': 'SLA_AT_RISK',
        'condition_json': '{"sla_hours":2,"priority":"High"}',
        'recipient_roles': 'Supervisor,Director',
        'scope_type': 'UNIT',
        'channels': 'Push,Email',
        'status': 'Active',
        'priority': 'High',
        'cooldown_minutes': 30,
      },
      {
        'rule_code': 'LEAD_SENS_001',
        'rule_name': 'Ví dụ: Lead nhạy cảm',
        'description': 'Thông báo khi tạo lead nhạy cảm',
        'event_type': 'LEAD_SENSITIVE_CREATED',
        'condition_json': '{"label_code":"SENSITIVE"}',
        'recipient_roles': 'Admin,IT',
        'scope_type': 'GLOBAL',
        'channels': 'Push,Email,System',
        'status': 'Active',
        'priority': 'High',
        'cooldown_minutes': 0,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wscols = [
      { wch: 20 },  // rule_code
      { wch: 40 },  // rule_name
      { wch: 60 },  // description
      { wch: 25 },  // event_type
      { wch: 40 },  // condition_json
      { wch: 30 },  // recipient_roles
      { wch: 20 },  // scope_type
      { wch: 30 },  // channels
      { wch: 12 },  // status
      { wch: 12 },  // priority
      { wch: 15 },  // cooldown_minutes
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rules');

    // Sheet 2: Reference - Event Types
    const eventTypesData = [
      { 'MÃ': 'SLA_AT_RISK', 'TÊN': 'SLA vượt ngưỡng', 'MÔ TẢ': 'Kích hoạt khi nhiệm vụ vượt ngưỡng SLA an toàn' },
      { 'MÃ': 'LEAD_SENSITIVE_CREATED', 'TÊN': 'Lead nhạy cảm', 'MÔ TẢ': 'Kích hoạt khi tạo lead có nhãn nhạy cảm' },
      { 'MÃ': 'MASTER_DATA_UPDATED', 'TÊN': 'Dữ liệu master thay đổi', 'MÔ TẢ': 'Kích hoạt khi có thay đổi dữ liệu danh mục' },
      { 'MÃ': 'EXPORT_JOB_FAILED', 'TÊN': 'Xuất dữ liệu thất bại', 'MÔ TẢ': 'Kích hoạt khi job xuất dữ liệu thất bại' },
      { 'MÃ': 'AUDIT_QUERY_EXECUTED', 'TÊN': 'Truy vấn audit', 'MÔ TẢ': 'Kích hoạt khi có truy vấn audit quan trọng' },
    ];
    const wsEventTypes = XLSX.utils.json_to_sheet(eventTypesData);
    wsEventTypes['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, wsEventTypes, 'Event Types');

    // Sheet 3: Reference - Roles
    const rolesData = [
      { 'MÃ': 'Supervisor', 'TÊN': 'Giám sát' },
      { 'MÃ': 'Analyst', 'TÊN': 'Phân tích' },
      { 'MÃ': 'Reporter', 'TÊN': 'Báo cáo' },
      { 'MÃ': 'Admin', 'TÊN': 'Quản trị' },
      { 'MÃ': 'IT', 'TÊN': 'IT' },
      { 'MÃ': 'Director', 'TÊN': 'Giám đốc' },
    ];
    const wsRoles = XLSX.utils.json_to_sheet(rolesData);
    wsRoles['!cols'] = [{ wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsRoles, 'Roles');

    // Sheet 4: Reference - Scope Types
    const scopeTypesData = [
      { 'MÃ': 'SELF_UNIT', 'TÊN': 'Đơn vị riêng', 'MÔ TẢ': 'Chỉ áp dụng cho đơn vị của chính mình' },
      { 'MÃ': 'UNIT', 'TÊN': 'Đơn vị', 'MÔ TẢ': 'Áp dụng cho một đơn vị cụ thể' },
      { 'MÃ': 'PROVINCE', 'TÊN': 'Cấp tỉnh', 'MÔ TẢ': 'Áp dụng cho toàn bộ tỉnh/thành phố' },
      { 'MÃ': 'GLOBAL', 'TÊN': 'Toàn hệ thống', 'MÔ TẢ': 'Áp dụng cho toàn bộ hệ thống' },
      { 'MÃ': 'BY_JOB_OWNER', 'TÊN': 'Theo người tạo', 'MÔ TẢ': 'Gửi cho người sở hữu job/task' },
    ];
    const wsScopeTypes = XLSX.utils.json_to_sheet(scopeTypesData);
    wsScopeTypes['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, wsScopeTypes, 'Scope Types');

    // Sheet 5: Reference - Channels
    const channelsData = [
      { 'MÃ': 'Push', 'TÊN': 'Push Notification' },
      { 'MÃ': 'Email', 'TÊN': 'Email' },
      { 'MÃ': 'System', 'TÊN': 'Thông báo hệ thống' },
    ];
    const wsChannels = XLSX.utils.json_to_sheet(channelsData);
    wsChannels['!cols'] = [{ wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, wsChannels, 'Channels');

    // Sheet 6: Instructions
    const instructions = [
      {
        'CỘT': 'rule_code',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Text (unique)',
        'VÍ DỤ': 'SLA_ALERT_001',
        'GHI CHÚ': 'Mã quy tắc duy nhất, không trùng lặp',
      },
      {
        'CỘT': 'rule_name',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Text',
        'VÍ DỤ': 'Cảnh báo SLA vượt ngưỡng',
        'GHI CHÚ': 'Tên quy tắc dễ hiểu',
      },
      {
        'CỘT': 'description',
        'BẮT BUỘC': 'Không',
        'ĐỊNH DẠNG': 'Text',
        'VÍ DỤ': 'Mô tả chi tiết...',
        'GHI CHÚ': 'Mô tả chi tiết về quy tắc',
      },
      {
        'CỘT': 'event_type',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Enum',
        'VÍ DỤ': 'SLA_AT_RISK',
        'GHI CHÚ': 'Xem sheet "Event Types"',
      },
      {
        'CỘT': 'condition_json',
        'BẮT BUỘC': 'Không',
        'ĐỊNH DẠNG': 'JSON',
        'VÍ DỤ': '{"sla_hours":2}',
        'GHI CHÚ': 'Điều kiện kích hoạt dạng JSON',
      },
      {
        'CỘT': 'recipient_roles',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'CSV',
        'VÍ DỤ': 'Supervisor,Director',
        'GHI CHÚ': 'Danh sách vai trò, cách nhau bởi dấu phẩy',
      },
      {
        'CỘT': 'scope_type',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Enum',
        'VÍ DỤ': 'UNIT',
        'GHI CHÚ': 'Xem sheet "Scope Types"',
      },
      {
        'CỘT': 'channels',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'CSV',
        'VÍ DỤ': 'Push,Email',
        'GHI CHÚ': 'Danh sách kênh, cách nhau bởi dấu phẩy',
      },
      {
        'CỘT': 'status',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Enum',
        'VÍ DỤ': 'Active',
        'GHI CHÚ': 'Active hoặc Disabled',
      },
      {
        'CỘT': 'priority',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Enum',
        'VÍ DỤ': 'High',
        'GHI CHÚ': 'Low, Medium, hoặc High',
      },
      {
        'CỘT': 'cooldown_minutes',
        'BẮT BUỘC': 'Không',
        'ĐỊNH DẠNG': 'Number',
        'VÍ DỤ': '30',
        'GHI CHÚ': 'Thời gian chờ giữa các lần gửi (phút)',
      },
    ];
    const wsInstructions = XLSX.utils.json_to_sheet(instructions);
    wsInstructions['!cols'] = [
      { wch: 20 },
      { wch: 12 },
      { wch: 20 },
      { wch: 30 },
      { wch: 60 },
    ];
    XLSX.utils.book_append_sheet(wb, wsInstructions, 'Hướng dẫn');

    const fileName = `Mau_Notification_Rules_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error('❌ Error generating template:', error);
    return { success: false, error };
  }
};

// ============================================================================
// EXCEL IMPORT
// ============================================================================

/**
 * Parse file Excel import
 */
export const parseExcelFile = async (
  file: File
): Promise<{ success: boolean; data?: NotificationRule[]; errors?: string[] }> => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

          const parsedRules: NotificationRule[] = [];
          const errors: string[] = [];

          jsonData.forEach((row, index) => {
            try {
              // Validate required fields
              if (!row['rule_code'] || !row['rule_name'] || !row['event_type']) {
                errors.push(`Dòng ${index + 2}: Thiếu thông tin bắt buộc`);
                return;
              }

              // Validate event_type
              if (!ALL_EVENT_TYPES.includes(row['event_type'])) {
                errors.push(`Dòng ${index + 2}: event_type không hợp lệ: ${row['event_type']}`);
                return;
              }

              // Parse recipient_roles
              const recipientRoles = row['recipient_roles']
                ?.split(',')
                .map((r: string) => r.trim())
                .filter((r: string) => ALL_RECIPIENT_ROLES.includes(r as any));

              if (!recipientRoles || recipientRoles.length === 0) {
                errors.push(`Dòng ${index + 2}: recipient_roles không hợp lệ`);
                return;
              }

              // Parse channels
              const channels = row['channels']
                ?.split(',')
                .map((c: string) => c.trim())
                .filter((c: string) => ALL_CHANNELS.includes(c as any));

              if (!channels || channels.length === 0) {
                errors.push(`Dòng ${index + 2}: channels không hợp lệ`);
                return;
              }

              // Validate scope_type
              if (!ALL_SCOPE_TYPES.includes(row['scope_type'])) {
                errors.push(`Dòng ${index + 2}: scope_type không hợp lệ: ${row['scope_type']}`);
                return;
              }

              // Parse condition_json
              let eventCondition = {};
              if (row['condition_json']) {
                try {
                  eventCondition = JSON.parse(row['condition_json']);
                } catch {
                  errors.push(`Dòng ${index + 2}: condition_json không phải JSON hợp lệ`);
                  return;
                }
              }

              const rule: NotificationRule = {
                id: `NR-${Date.now()}-${index}`,
                rule_code: row['rule_code'],
                rule_name: row['rule_name'],
                description: row['description'] || '',
                event_type: row['event_type'],
                event_condition: eventCondition,
                recipient_roles: recipientRoles,
                scope_type: row['scope_type'],
                channels,
                cooldown_minutes: row['cooldown_minutes'] ? parseInt(row['cooldown_minutes']) : undefined,
                status: row['status'] === 'Active' ? 'Active' : 'Disabled',
                priority: row['priority'] || 'Medium',
                created_by: 'Import',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };

              parsedRules.push(rule);
            } catch (error) {
              errors.push(`Dòng ${index + 2}: Lỗi parse - ${error}`);
            }
          });

          resolve({ success: true, data: parsedRules, errors });
        } catch (error) {
          reject({ success: false, errors: [`Lỗi đọc file Excel: ${error}`] });
        }
      };

      reader.onerror = () => {
        reject({ success: false, errors: ['Lỗi đọc file'] });
      };

      reader.readAsBinaryString(file);
    });
  } catch (error) {
    return { success: false, errors: [`${error}`] };
  }
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  exportRulesToExcel,
  downloadExcelTemplate,
  parseExcelFile,
};
