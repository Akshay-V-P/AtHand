import type { ButtonHTMLAttributes, ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    icon: ReactNode;
    label: string;
    to: string;
    end?: boolean;
}

const SidebarItem = ({ icon, label, to, end = false }: SidebarItemProps) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                    ? "bg-blue-100/50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`
        }
    >
        {({ isActive }) => (
            <>
                <div className={isActive ? "text-blue-600" : "text-gray-400"}>
                    {icon}
                </div>

                <span>{label}</span>
            </>
        )}
    </NavLink>
);

export default SidebarItem;
