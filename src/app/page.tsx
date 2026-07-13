'use client';
import { useState, useEffect, useCallback } from 'react';
import { WorkRecord, CATEGORIES } from '@/lib/types';
import { loadRecords, addRecord, updateRecord, deleteRecord, generateId, getTodayKey } from '@/lib/store';
import RecordForm from '@/components/RecordForm';
import RecordList from '@/components/RecordList';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';

export default function HomePage() {
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [view, setView] = useState<'dashboard' | 'log'>('dashboard');
  const [editingRecord, setEditingRecord] = useState<WorkRecord | null>(null);

  useEffect(() => { setRecords(loadRecords()); }, []);

  const refresh = useCallback(() => setRecords(loadRecords()), []);

  const handleAdd = (data: Omit<WorkRecord, 'id' | 'createdAt'>) => {
    const record: WorkRecord = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setRecords(addRecord(record));
    setView('dashboard');
  };

  const handleUpdate = (id: string, data: Partial<WorkRecord>) => {
    setRecords(updateRecord(id, data));
    setEditingRecord(null);
    setView('dashboard');
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除这条记录？')) {
      setRecords(deleteRecord(id));
    }
  };

  const handleEdit = (record: WorkRecord) => {
    setEditingRecord(record);
    setView('log');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Header view={view} onViewChange={setView} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'dashboard' ? (
          <Dashboard records={records} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <RecordForm
            initialData={editingRecord}
            onSubmit={editingRecord
              ? (data) => handleUpdate(editingRecord.id, data)
              : handleAdd
            }
            onCancel={() => { setEditingRecord(null); setView('dashboard'); }}
          />
        )}
      </main>
    </div>
  );
}
