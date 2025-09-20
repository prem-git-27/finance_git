import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  setIsSidebarOpen: (open: boolean) => void;
}

export function Header({ setIsSidebarOpen }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        
        <h1 className="text-lg font-semibold text-gray-900">FinanceApp</h1>
        
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            2
          </span>
        </button>
      </div>
    </header>
  );
}