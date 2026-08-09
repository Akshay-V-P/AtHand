import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

interface ServiceCardProps extends HTMLAttributes<HTMLDivElement>{
    title: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
}

function ServiceCard({ title, description, isSelected, onClick, ...props }:ServiceCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 flex flex-col gap-4 ${
        isSelected 
          ? 'border-[#545CEB] bg-blue-50/30 shadow-sm' 
          : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm'
              }`}
          {...props}
    >
      
      <div>
        <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard