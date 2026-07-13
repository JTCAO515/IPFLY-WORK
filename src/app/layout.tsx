import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IPFLY WORK — 工作效率追踪',
  description: '记录你的工作成果，可视化你的效率趋势',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
