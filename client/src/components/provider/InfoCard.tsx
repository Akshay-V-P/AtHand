import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

interface InfoCardProps extends HTMLAttributes<HTMLDivElement>{
    title: string;
    description: string;
    icon?: LucideIcon;
    variant?: "default" | "blue" | "pattern";
}

function InfoCard({ icon: Icon, title, description, variant = 'default', ...props }:InfoCardProps) {
  const styles = {
    default: "bg-[#F8F9FA] border border-gray-100 text-gray-800",
    blue: "bg-[#545CEB] text-white",
    pattern: "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 border border-gray-200 relative overflow-hidden"
  };

  return (
    <div className={`p-6 rounded-xl shadow-sm flex flex-col gap-3 ${styles[variant]}`} {...props}>
      {variant === 'pattern' && (
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      )}
      
      {Icon && (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          variant === 'default' ? 'bg-blue-100 text-blue-700' : 
          variant === 'blue' ? 'text-white' : ''
        }`}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="relative z-10">
        <h3 className={`font-bold text-lg mb-1 ${variant === 'blue' ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`text-sm leading-relaxed ${variant === 'blue' ? 'text-blue-100' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default InfoCard