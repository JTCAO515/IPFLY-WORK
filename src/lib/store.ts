import { WorkRecord, CATEGORIES } from './types';

const STORAGE_KEY = 'vibecoding-records';

export function loadRecords(): WorkRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecords(records: WorkRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addRecord(record: WorkRecord): WorkRecord[] {
  const records = loadRecords();
  records.unshift(record);
  saveRecords(records);
  return records;
}

export function updateRecord(id: string, updates: Partial<WorkRecord>): WorkRecord[] {
  const records = loadRecords();
  const idx = records.findIndex(r => r.id === id);
  if (idx === -1) return records;
  records[idx] = { ...records[idx], ...updates };
  saveRecords(records);
  return records;
}

export function deleteRecord(id: string): WorkRecord[] {
  const records = loadRecords().filter(r => r.id !== id);
  saveRecords(records);
  return records;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getWeekRecords(records: WorkRecord[]): WorkRecord[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return records.filter(r => new Date(r.date) >= startOfWeek);
}

export function getMonthRecords(records: WorkRecord[]): WorkRecord[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return records.filter(r => new Date(r.date) >= startOfMonth);
}

export function getDailyMinutes(records: WorkRecord[]): { date: string; minutes: number }[] {
  const grouped: Record<string, number> = {};
  records.forEach(r => {
    grouped[r.date] = (grouped[r.date] || 0) + r.duration;
  });
  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, minutes]) => ({ date, minutes }));
}

export function getCategoryDistribution(records: WorkRecord[]): { name: string; value: number; color: string }[] {
  const grouped: Record<string, number> = {};
  records.forEach(r => {
    grouped[r.category] = (grouped[r.category] || 0) + r.duration;
  });
  return CATEGORIES.map(c => ({
    name: c.label,
    value: grouped[c.value] || 0,
    color: c.color,
  }));
}
