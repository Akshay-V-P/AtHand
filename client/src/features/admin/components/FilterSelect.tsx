import type { ReactNode } from "react";

interface FilterSelectProps{
    label: string;
    value: string;
    options?: [];
    icon?: ReactNode;
}

const FilterSelect = ({ label, value, options, icon }:FilterSelectProps) => (
  <div className="flex flex-col">
    <label className="text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <option>{value}</option>
        {options && options.map((opt, i) => <option key={i}>{opt}</option>)}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
           {icon}
        </div>
      )}
    </div>
  </div>
);

export default FilterSelect