'use client';
import { Activity, PlusCircle, BarChart3 } from 'lucide-react';

interface HeaderProps {
  view: 'dashboard' | 'log';
  onViewChange: (v: 'dashboard' | 'log') => void;
}

export default function Header({ view, onViewChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-500" />
          <span className="font-bold text-lg text-gray-900 dark:text-white">IPFLY WORK</span>
        </div>
        <nav className="flex gap-2">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'dashboard'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            仪表盘
          </button>
          <button
            onClick={() => onViewChange('log')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'log'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            记录工作
          </button>
        </nav>
      </div>
    </header>
  );
}
