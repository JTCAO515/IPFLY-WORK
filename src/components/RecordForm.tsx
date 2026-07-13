'use client';
import { useState, useEffect } from 'react';
import { WorkRecord, CATEGORIES, Category } from '@/lib/types';
import { getTodayKey } from '@/lib/store';
import { Clock, Save, X } from 'lucide-react';

interface Props {
  initialData?: WorkRecord | null;
  onSubmit: (data: Omit<WorkRecord, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const nowStr = () => new Date().toTimeString().slice(0, 5);

export default function RecordForm({ initialData, onSubmit, onCancel }: Props) {
  const [date, setDate] = useState(initialData?.date || getTodayKey());
  const [startTime, setStartTime] = useState(initialData?.startTime || nowStr());
  const [endTime, setEndTime] = useState(initialData?.endTime || nowStr());
  const [project, setProject] = useState(initialData?.project || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'code');
  const [description, setDescription] = useState(initialData?.description || '');
  const [reflection, setReflection] = useState(initialData?.reflection || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);

  const isEdit = !!initialData;

  const calcDuration = (): number => {
    if (!startTime || !endTime) return 0;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    return end > start ? end - start : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !description) return;
    onSubmit({
      date, startTime, endTime,
      duration: calcDuration(),
      project, category, description, tags, reflection,
    });
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(''); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEdit ? '编辑工作记录' : '记录工作'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">日期</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">开始</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">结束</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
          </div>

          {startTime && endTime && (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
              时长：{calcDuration()} 分钟（{Math.floor(calcDuration()/60)}h {calcDuration()%60}m）
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">项目/任务</label>
            <input type="text" value={project} onChange={e => setProject(e.target.value)}
              placeholder="例如：Vibecoding 开发"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">成果类型</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c.value} type="button" onClick={() => setCategory(c.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    category === c.value
                      ? 'text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                  }`}
                  style={category === c.value ? { backgroundColor: c.color } : {}}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">工作描述</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="今天做了什么？有什么成果？"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标签</label>
            <div className="flex gap-2">
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="按 Enter 添加标签"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
              <button type="button" onClick={addTag}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-200">添加</button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs">
                    {t}
                    <button type="button" onClick={() => setTags(tags.filter(x => x !== t))} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">反思/备注</label>
            <textarea value={reflection} onChange={e => setReflection(e.target.value)}
              placeholder="有什么收获？遇到什么问题？"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
              <Save className="w-4 h-4" />
              {isEdit ? '保存修改' : '记录工作'}
            </button>
            <button type="button" onClick={onCancel}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
