export interface SavedReportTemplate {
  id: string;
  name: string;
  description?: string;
  dataset: string;
  datasetGroup: string;
  columns: string[];
  filters: any[];
  groupBy?: string;
  aggregation?: string;
  scope: 'personal' | 'unit';
  createdAt: string;
  lastRun?: string;
  runCount?: number;
}

const STORAGE_KEY = 'mappa_saved_report_templates';

export const templateStorage = {
  // Get all templates
  getAll(): SavedReportTemplate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading templates from localStorage:', error);
      return [];
    }
  },

  // Get templates by scope
  getByScope(scope: 'personal' | 'unit'): SavedReportTemplate[] {
    return this.getAll().filter(t => t.scope === scope);
  },

  // Get template by id
  getById(id: string): SavedReportTemplate | undefined {
    return this.getAll().find(t => t.id === id);
  },

  // Save new template
  save(template: SavedReportTemplate): void {
    try {
      const templates = this.getAll();
      templates.push(template);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving template to localStorage:', error);
      throw error;
    }
  },

  // Update existing template
  update(id: string, updates: Partial<SavedReportTemplate>): void {
    try {
      const templates = this.getAll();
      const index = templates.findIndex(t => t.id === id);
      if (index !== -1) {
        templates[index] = { ...templates[index], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
      }
    } catch (error) {
      console.error('Error updating template in localStorage:', error);
      throw error;
    }
  },

  // Delete template
  delete(id: string): void {
    try {
      const templates = this.getAll().filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Error deleting template from localStorage:', error);
      throw error;
    }
  },

  // Increment run count
  incrementRunCount(id: string): void {
    const template = this.getById(id);
    if (template) {
      this.update(id, {
        runCount: (template.runCount || 0) + 1,
        lastRun: new Date().toLocaleDateString('vi-VN'),
      });
    }
  },
};

// Helper to get dataset group from dataset value
export function getDatasetGroup(dataset: string): string {
  const groups: Record<string, string> = {
    facility: 'Cơ sở quản lý',
    leads: 'Nguồn tin phản ánh',
    plans: 'Kế hoạch kiểm tra',
    campaigns: 'Đợt kiểm tra',
    sessions: 'Phiên làm việc',
    violations: 'Vi phạm',
    reports: 'Báo cáo',
    summary: 'Báo cáo tổng hợp',
  };
  return groups[dataset] || 'Khác';
}

// Helper to get dataset label
export function getDatasetLabel(dataset: string): string {
  const labels: Record<string, string> = {
    facility: 'Cơ sở quản lý',
    leads: 'Nguồn tin phản ánh',
    plans: 'Kế hoạch kiểm tra',
    campaigns: 'Đợt kiểm tra',
    sessions: 'Phiên làm việc',
    violations: 'Vi phạm',
    reports: 'Báo cáo',
    summary: 'Báo cáo tổng hợp',
  };
  return labels[dataset] || dataset;
}
