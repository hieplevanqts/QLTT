// Mock data for Audit & Monitoring tabs
// Used when Supabase tables don't exist yet

const EVENT_TYPES = [
  'user.login',
  'user.logout',
  'user.create',
  'user.update',
  'user.delete',
  'area.create',
  'area.update',
  'area.delete',
  'merchant.create',
  'merchant.update',
  'merchant.delete',
  'inspection.create',
  'inspection.update',
  'role.assign',
  'permission.change',
  'export.data',
];

const ENTITY_TYPES = [
  'user',
  'area',
  'merchant',
  'inspection',
  'role',
  'permission',
  'export',
];

const USER_IDS = [
  'admin@mappa.vn',
  'inspector1@mappa.vn',
  'inspector2@mappa.vn',
  'manager@mappa.vn',
  'analyst@mappa.vn',
];

const TABLES = [
  'users',
  'areas',
  'merchants',
  'inspections',
  'roles',
  'permissions',
  'provinces',
  'wards',
];

// 🔧 FIX: Use 'CREATE' instead of 'INSERT' to match ChangeEventType
const ACTIONS = ['CREATE', 'UPDATE', 'DELETE'];

const IP_ADDRESSES = [
  '192.168.1.100',
  '192.168.1.101',
  '10.0.0.50',
  '172.16.0.25',
  '203.113.45.67',
];

// Generate random date within last 30 days
function randomDate(daysAgo: number = 30): string {
  const now = new Date();
  const past = new Date(now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
  return past.toISOString();
}

// Generate mock audit events
export function generateMockAuditEvents(count: number = 100): any[] {
  const events: any[] = [];
  
  for (let i = 0; i < count; i++) {
    const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
    const outcome = Math.random() > 0.1 ? 'success' : 'failed';
    const timestamp = randomDate(30);
    
    events.push({
      audit_events_id: `AE${String(i + 1).padStart(6, '0')}`,
      audit_events_event_type: eventType,
      audit_events_actor_user_id: USER_IDS[Math.floor(Math.random() * USER_IDS.length)],
      audit_events_entity_type: ENTITY_TYPES[Math.floor(Math.random() * ENTITY_TYPES.length)],
      audit_events_outcome: outcome,
      audit_events_timestamp: timestamp,
      audit_events_context_json: {
        ip: IP_ADDRESSES[Math.floor(Math.random() * IP_ADDRESSES.length)],
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
      },
      audit_events_details_redacted_json: outcome === 'failed' ? {
        error: 'Permission denied',
        code: 'EACCES',
      } : null,
    });
  }
  
  return events.sort((a, b) => 
    new Date(b.audit_events_timestamp).getTime() - new Date(a.audit_events_timestamp).getTime()
  );
}

// Generate mock data changes
export function generateMockDataChanges(count: number = 100): any[] {
  const changes: any[] = [];
  
  for (let i = 0; i < count; i++) {
    const table = TABLES[Math.floor(Math.random() * TABLES.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const timestamp = randomDate(30);
    
    changes.push({
      id: `DC${String(i + 1).padStart(6, '0')}`,
      timestamp,
      table_name: table,
      record_id: `REC${Math.floor(Math.random() * 10000)}`,
      action,
      actor_user_id: USER_IDS[Math.floor(Math.random() * USER_IDS.length)],
      field_changed: action === 'UPDATE' ? 'status' : null,
      old_value: action === 'UPDATE' ? 'active' : null,
      new_value: action === 'UPDATE' ? 'inactive' : null,
      change_context: {
        ip: IP_ADDRESSES[Math.floor(Math.random() * IP_ADDRESSES.length)],
        timestamp,
      },
    });
  }
  
  return changes.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Generate mock export jobs
export function generateMockExportJobs(count: number = 50): any[] {
  const jobs: any[] = [];
  const statuses = ['pending', 'processing', 'completed', 'failed'];
  const formats = ['xlsx', 'csv', 'pdf'];
  const dataTypes = ['merchants', 'inspections', 'users', 'areas'];
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const format = formats[Math.floor(Math.random() * formats.length)];
    const dataType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
    const createdAt = randomDate(7);
    
    jobs.push({
      id: `EXP${String(i + 1).padStart(6, '0')}`,
      filename: `export_${dataType}_${new Date(createdAt).toISOString().split('T')[0]}.${format}`,
      data_type: dataType,
      format,
      status,
      created_by: USER_IDS[Math.floor(Math.random() * USER_IDS.length)],
      created_at: createdAt,
      completed_at: status === 'completed' ? new Date(new Date(createdAt).getTime() + Math.random() * 3600000).toISOString() : null,
      file_size_bytes: status === 'completed' ? Math.floor(Math.random() * 5000000) + 100000 : null,
      download_url: status === 'completed' ? `/exports/${dataType}_${i}.${format}` : null,
      row_count: status === 'completed' ? Math.floor(Math.random() * 10000) + 100 : null,
      error_message: status === 'failed' ? 'Export timeout - data too large' : null,
    });
  }
  
  return jobs.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// Generate mock security config
export function generateMockSecurityConfig(): any[] {
  return [
    {
      id: 'SEC001',
      key: 'session_timeout',
      value: '3600',
      description: 'Thời gian timeout phiên làm việc (giây)',
      category: 'authentication',
      updated_at: randomDate(7),
      updated_by: 'admin@mappa.vn',
    },
    {
      id: 'SEC002',
      key: 'password_min_length',
      value: '8',
      description: 'Độ dài tối thiểu mật khẩu',
      category: 'authentication',
      updated_at: randomDate(14),
      updated_by: 'admin@mappa.vn',
    },
    {
      id: 'SEC003',
      key: 'max_login_attempts',
      value: '5',
      description: 'Số lần đăng nhập sai tối đa trước khi khóa',
      category: 'authentication',
      updated_at: randomDate(7),
      updated_by: 'admin@mappa.vn',
    },
    {
      id: 'SEC004',
      key: 'lockout_duration',
      value: '900',
      description: 'Thời gian khóa tài khoản sau login sai (giây)',
      category: 'authentication',
      updated_at: randomDate(7),
      updated_by: 'admin@mappa.vn',
    },
    {
      id: 'SEC005',
      key: 'enable_2fa',
      value: 'true',
      description: 'Bật xác thực 2 yếu tố',
      category: 'authentication',
      updated_at: randomDate(3),
      updated_by: 'admin@mappa.vn',
    },
    {
      id: 'SEC006',
      key: 'enable_ip_whitelist',
      value: 'false',
      description: 'Bật whitelist IP',
      category: 'network',
      updated_at: randomDate(10),
      updated_by: 'admin@mappa.vn',
    },
    {
      id: 'SEC007',
      key: 'audit_log_retention_days',
      value: '90',
      description: 'Thời gian lưu trữ audit log (ngày)',
      category: 'logging',
      updated_at: randomDate(30),
      updated_by: 'admin@mappa.vn',
    },
    {
      id: 'SEC008',
      key: 'enable_rate_limiting',
      value: 'true',
      description: 'Bật giới hạn số request',
      category: 'network',
      updated_at: randomDate(5),
      updated_by: 'admin@mappa.vn',
    },
  ];
}

// Generate mock integration services
export function generateMockIntegrationServices(): any[] {
  const services = [
    {
      id: 'SRV001',
      name: 'Cổng thông tin quốc gia (INS)',
      type: 'INS',
      endpoint: 'https://api.ins.gov.vn',
      status: 'connected',
      last_check: new Date(Date.now() - Math.random() * 600000).toISOString(),
      last_success: new Date(Date.now() - Math.random() * 600000).toISOString(),
      response_time_ms: Math.floor(Math.random() * 500) + 100,
      success_rate: 99.2,
      total_requests_24h: Math.floor(Math.random() * 10000) + 5000,
      failed_requests_24h: Math.floor(Math.random() * 50),
    },
    {
      id: 'SRV002',
      name: 'VNeID Authentication',
      type: 'VNeID',
      endpoint: 'https://api.vneid.vn',
      status: 'connected',
      last_check: new Date(Date.now() - Math.random() * 300000).toISOString(),
      last_success: new Date(Date.now() - Math.random() * 300000).toISOString(),
      response_time_ms: Math.floor(Math.random() * 300) + 50,
      success_rate: 98.7,
      total_requests_24h: Math.floor(Math.random() * 5000) + 2000,
      failed_requests_24h: Math.floor(Math.random() * 30),
    },
    {
      id: 'SRV003',
      name: 'Google Maps API',
      type: 'Maps',
      endpoint: 'https://maps.googleapis.com',
      status: 'connected',
      last_check: new Date(Date.now() - Math.random() * 120000).toISOString(),
      last_success: new Date(Date.now() - Math.random() * 120000).toISOString(),
      response_time_ms: Math.floor(Math.random() * 200) + 50,
      success_rate: 99.8,
      total_requests_24h: Math.floor(Math.random() * 20000) + 10000,
      failed_requests_24h: Math.floor(Math.random() * 20),
    },
    {
      id: 'SRV004',
      name: 'Email Service (SMTP)',
      type: 'Email',
      endpoint: 'smtp.mappa.gov.vn',
      status: Math.random() > 0.9 ? 'error' : 'connected',
      last_check: new Date(Date.now() - Math.random() * 600000).toISOString(),
      last_success: new Date(Date.now() - Math.random() * 600000).toISOString(),
      response_time_ms: Math.floor(Math.random() * 1000) + 200,
      success_rate: 97.5,
      total_requests_24h: Math.floor(Math.random() * 3000) + 1000,
      failed_requests_24h: Math.floor(Math.random() * 100),
    },
  ];
  
  return services;
}
