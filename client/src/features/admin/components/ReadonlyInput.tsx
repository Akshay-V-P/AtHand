import type { ReactNode } from "react";

interface ReadOnlyInputProps{
    label: string;
    value: string;
    icon?: ReactNode;
    fullWidth?: boolean;
}

const ReadOnlyInput = ({ label, value, icon, fullWidth }:ReadOnlyInputProps) => (
  <div className={`flex flex-col ${fullWidth ? 'col-span-full' : ''}`}>
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative flex items-center bg-gray-100/80 border border-transparent rounded-lg px-4 py-2.5">
      {icon && (
        <span className="text-blue-600 mr-2">
          {icon}
        </span>
      )}
      <span className="text-gray-900 text-sm">{value}</span>
    </div>
  </div>
);

export default ReadOnlyInput