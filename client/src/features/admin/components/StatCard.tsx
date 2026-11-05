import type { ReactNode } from "react";

interface StatCardProps{
    icon: ReactNode;
    title: string;
    value: string;
    subtitle?: string;
    trend: string;
    trendType: string;
    iconBg: string;
}


const StatCard = ({ icon, title, value, subtitle, trend, trendType, iconBg }:StatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
      {trend && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          trendType === 'positive' ? 'bg-green-100 text-green-700' :
          trendType === 'urgent' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
    </div>
  </div>
);

export default StatCard