// components/Navbar.jsx
import React from 'react';

export default function Navbar() {
  return (
    <header className="h-24 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 relative">
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">At.Hand</span>
        <span className="text-2xl font-bold text-red-500 tracking-tight">Pro</span>
      </div>
      <button className="px-4 py-1.5 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
        Login
      </button>
    </header>
  );
}