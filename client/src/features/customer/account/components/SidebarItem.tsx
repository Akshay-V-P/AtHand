import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom';

interface SideBarItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: ReactNode;
  isActive?: boolean;
  isLogout?: boolean;
  navPath?: string;
}

const SidebarItem = ({ label, icon, isActive: _, isLogout, navPath, onClick, ...props }: SideBarItemProps) => {
  const baseStyle =
    "inline-flex md:flex items-center gap-2 md:gap-3 whitespace-nowrap shrink-0 md:w-full text-left px-4 py-2.5 md:px-4 md:py-3 rounded-full md:rounded-2xl font-medium transition-all text-xs sm:text-sm border cursor-pointer";

  if (isLogout) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseStyle} bg-white text-red-600 md:text-gray-700 border-red-100 md:border-gray-100 hover:border-red-200 hover:bg-red-50 md:hover:border-gray-300 md:hover:bg-gray-50`}
        {...props}
      >
        {icon}
        <span>{label}</span>
      </button>
    )
  }

  return (
    <NavLink
      to={navPath || "/account/profile"}
      className={({ isActive }) =>
        isActive
          ? `${baseStyle} bg-[#2A2A2A] text-white border-transparent shadow-sm md:shadow-md`
          : `${baseStyle} bg-white text-gray-700 border-gray-200 md:border-gray-100 hover:border-gray-300 hover:bg-gray-50`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default SidebarItem