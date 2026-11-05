import React from 'react';

const MetricCard = ({ title, value }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-xs">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
};

export default MetricCard;