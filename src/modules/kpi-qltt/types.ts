/**
 * Type definitions for KPI-QLTT module
 */

export type CompareMode = 'unit' | 'category';

export type CompareMetric = 'leads' | 'tasks' | 'overdue' | 'violations' | 'hotspots';

export interface CompareFilters {
  period: '7d' | '30d' | '90d';
  mode: CompareMode;
  province?: string;
  topic?: string;
  metric: CompareMetric;
}

export interface CompareRow {
  id: string;
  name: string;
  type: 'unit' | 'category';
  leads: number;
  tasks: number;
  overdue: number;
  violations: number;
  hotspots: number;
  total: number;
  trend: number; // % change compared to previous period
  deviation: number; // % deviation from average
}

export interface UnitData {
  date: string; // ISO format
  province: string;
  unitLevel: 'cuc' | 'chicuc' | 'doi';
  unitId: string;
  unitName: string;
  categoryGroup: string;
  leads: number;
  tasks: number;
  overdue: number;
  violations: number;
  hotspots: number;
}
