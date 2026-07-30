import React, { type ButtonHTMLAttributes} from 'react'

interface SideBarItemProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    label: string;
    isActive?: boolean;
  isLogout?: boolean;
}

const SidebarItem = ({ label, isActive, isLogout, ...props }:SideBarItemProps) => {
    const baseStyle = "w-full text-left px-5 py-3 rounded-2xl font-medium transition-all text-sm border cursor-pointer";
  if (isActive) {
    return (
      <button className={`${baseStyle} bg-[#2A2A2A] text-white border-transparent shadow-md`} {...props}>
        {label}
      </button>
    );
  }

  return (
    <button className={`${baseStyle} bg-white text-gray-700 border-gray-100 hover:border-gray-300 hover:bg-gray-50`} {...props}>
      {label}
    </button>
  );

}

export default SidebarItem