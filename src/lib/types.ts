export interface WorkRecord {
  id: string;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  duration: number; // minutes
  project: string;
  category: 'code' | 'design' | 'writing' | 'research' | 'management' | 'learning';
  description: string;
  tags: string[];
  reflection: string;
  createdAt: string;
}

export type Category = WorkRecord['category'];

export const CATEGORIES: { value: Category; label: string; color: string }[] = [
  { value: 'code', label: '编码', color: '#3b82f6' },
  { value: 'design', label: '设计', color: '#8b5cf6' },
  { value: 'writing', label: '写作', color: '#10b981' },
  { value: 'research', label: '研究', color: '#f59e0b' },
  { value: 'management', label: '管理', color: '#ef4444' },
  { value: 'learning', label: '学习', color: '#06b6d4' },
];
