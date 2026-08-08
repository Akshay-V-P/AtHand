import type { ButtonHTMLAttributes } from "react";
import {  type LucideIcon } from "lucide-react";

interface SideBarItemProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
}

function SidebarItem({ icon: Icon, label, isActive }:SideBarItemProps) {

  return (
    <div className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${isActive
      ? 'bg-blue-50 text-blue-600 font-semibold border-b-4 md:border-b-0 md:border-r-4 border-blue-600'
      : 'text-gray-600 hover:bg-gray-100 font-medium'
    }`}>
    <Icon  size={20}/>
    <span>{label}</span>
  </div>
  )
};

export default SidebarItem