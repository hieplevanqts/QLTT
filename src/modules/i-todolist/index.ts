/**
 * Module: Nhật ký công việc (i-todolist)
 * Version: 1.0.0
 * 
 * Module quản lý nhật ký công việc cá nhân với chức năng theo dõi tiến độ,
 * phân loại ưu tiên và ghi chú chi tiết
 */

// Import module styles
import './styles.css';

export { iTodolistRoute } from './routes';

// Export types
export type * from './types';

// Export services
export * from './services/taskService';

// Metadata
export const moduleMetadata = {
  id: 'i-todolist',
  name: 'Nhật ký công việc',
  version: '1.0.0',
  basePath: '/todolist',
  permissions: ['todolist:read', 'todolist:write']
};
