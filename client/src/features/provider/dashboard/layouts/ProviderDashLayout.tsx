// components/Layout.jsx
import React from 'react';
import Navbar from "@/features/provider/dashboard/components/ProviderNavbar";
import { Outlet } from 'react-router-dom';
import Sidebar from "@/features/provider/dashboard/components/ProviderSidebar";

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