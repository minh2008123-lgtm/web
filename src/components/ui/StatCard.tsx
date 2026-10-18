import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  color?: string;
}

export function StatCard({ icon, label, value, change, changeType = 'neutral', color = 'primary' }: StatCardProps) {
  const changeColors = {
    up: 'text-success-600',
    down: 'text-red-600',
    neutral: 'text-gray-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg bg-${color}-50`} style={{ backgroundColor: 'var(--tw-bg-opacity: 0.1)' }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
