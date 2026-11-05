// components/Sidebar.jsx
import { LayoutDashboard, Inbox, Wrench, Briefcase, Star, DollarSign, User, HelpCircle, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, to: '/provider/dashboard' },
    { name: 'Request Inbox', icon: Inbox, to: '/provider/dashboard/requests' },
    { name: 'Active Repairs', icon: Wrench, to: '/provider/dashboard/repairs' },
    { name: 'My Services', icon: Briefcase, to: '/provider/dashboard/services' },
    { name: 'Reviews', icon: Star, to: '/provider/dashboard/reviews' },
    { name: 'Earnings', icon: DollarSign, to: '/provider/dashboard/earnings' },
    { name: 'Account', icon: User, to: '/provider/dashboard/account' },
  ];

  return (
    <aside className="w-64 bg-gray-50/50 border-r border-gray-200 flex flex-col h-[calc(100vh-4rem)]">
      <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.to === '/provider/dashboard'}
            className={({ isActive }) => `flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
              ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-1">
        <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100">
          <HelpCircle className="w-5 h-5 mr-3 text-gray-400" />
          Support
        </a>
        <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100">
          <LogOut className="w-5 h-5 mr-3 text-gray-400" />
          Logout
        </a>
      </div>
    </aside>
  );
}