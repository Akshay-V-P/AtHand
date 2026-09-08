// components/Layout.jsx
import React from 'react';
import Navbar from '../../../../components/provider/dashboard/ProviderNavbar';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../../components/provider/dashboard/ProviderSidebar';

export default function ProviderDashLayout() {
  return (
    <div className="max-h-screen bg-[#F8FAFC] font-sans flex flex-col text-gray-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
              <Sidebar />
        <div className="flex-1 overflow-y-auto relative">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}