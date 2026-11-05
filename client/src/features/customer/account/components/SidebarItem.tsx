import { type ButtonHTMLAttributes } from 'react'
import { NavLink } from 'react-router-dom';

interface SideBarItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isActive?: boolean; 
  isLogout?: boolean;
  navPath?: string;
}

const SidebarItem = ({ label, isActive: _, isLogout, navPath, onClick, ...props }: SideBarItemProps) => {
  const baseStyle = "block w-full md:text-left px-5 py-3 rounded-2xl font-medium transition-all text-sm border cursor-pointer";

  if (isLogout) {
    return (
      <button
        onClick={onClick}
        className={`${baseStyle} bg-white text-gray-700 border-gray-100 hover:border-gray-300 hover:bg-gray-50`}
        {...props}
      >
        {label}
      </button>
    )
  }

  return (
    <NavLink
      to={navPath || "/account/profile"}
      className={({ isActive }) =>
        isActive
          ? `${baseStyle} bg-[#2A2A2A] text-white border-transparent shadow-md`
          : `${baseStyle} bg-white text-gray-700 border-gray-100 hover:border-gray-300 hover:bg-gray-50`
      }
    >
      {label}
    </NavLink>
  );
}

export default SidebarItem