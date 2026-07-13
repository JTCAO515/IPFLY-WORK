'use client';
import { WorkRecord, CATEGORIES } from '@/lib/types';
import { Edit2, Trash2, Clock, Tag } from 'lucide-react';

interface Props {
  records: WorkRecord[];
  onEdit: (r: WorkRecord) => void;
  onDelete: (id: string) => void;
}

export default function RecordList({ records, onEdit, onDelete }: Props) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>还没有工作记录</p>
        <p className="text-sm mt-1">点击「记录工作」开始追踪你的效率</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map(record => {
        const cat = CATEGORIES.find(c => c.value === record.category);
        return (
          <div key={record.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: cat?.color }}>
                    {cat?.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {record.project}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {record.description}
                </p>
                {record.reflection && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">
                    💭 {record.reflection}
                  </p>
                )}
                {record.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {record.tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        <Tag className="w-3 h-3" />{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button onClick={() => onEdit(record)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(record.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span>{record.date}</span>
              <span>{record.startTime} - {record.endTime}</span>
              <span className="font-medium text-gray-500">
                {Math.floor(record.duration / 60)}h {record.duration % 60}m
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
