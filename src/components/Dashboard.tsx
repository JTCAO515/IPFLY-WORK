'use client';
import { WorkRecord } from '@/lib/types';
import { getWeekRecords, getMonthRecords, getDailyMinutes, getCategoryDistribution } from '@/lib/store';
import RecordList from './RecordList';
import StatsCard from './StatsCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Clock, TrendingUp, Calendar, Layers } from 'lucide-react';

interface Props {
  records: WorkRecord[];
  onEdit: (r: WorkRecord) => void;
  onDelete: (id: string) => void;
}

export default function Dashboard({ records, onEdit, onDelete }: Props) {
  const weekRecords = getWeekRecords(records);
  const monthRecords = getMonthRecords(records);
  const weekMinutes = weekRecords.reduce((sum, r) => sum + r.duration, 0);
  const monthMinutes = monthRecords.reduce((sum, r) => sum + r.duration, 0);
  const dailyData = getDailyMinutes(records);
  const categoryData = getCategoryDistribution(records);
  const todayMinutes = records
    .filter(r => r.date === new Date().toISOString().split('T')[0])
    .reduce((s, r) => s + r.duration, 0);

  const fmt = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard icon={<Clock className="w-5 h-5" />} label="今日" value={fmt(todayMinutes)} color="blue" />
        <StatsCard icon={<Calendar className="w-5 h-5" />} label="本周" value={fmt(weekMinutes)} color="green" />
        <StatsCard icon={<TrendingUp className="w-5 h-5" />} label="本月" value={fmt(monthMinutes)} color="violet" />
        <StatsCard icon={<Layers className="w-5 h-5" />} label="总记录" value={`${records.length} 条`} color="amber" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily trend */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">近 14 天趋势</h3>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${Math.floor(v/60)}h ${v%60}m`, '工时']} />
                <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">暂无数据</div>
          )}
        </div>

        {/* Category distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">成果类型分布</h3>
          {categoryData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" nameKey="name" paddingAngle={2}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">暂无数据</div>
          )}
        </div>
      </div>

      {/* Recent records */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">近期记录</h3>
        <RecordList records={records.slice(0, 10)} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
