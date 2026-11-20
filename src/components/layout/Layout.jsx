import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useNotifications } from '../../contexts/NotificationContext';

export default function Layout() {
  const { toasts } = useNotifications();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col transition-colors duration-300">
      <Navbar />
      
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        
        <main className="flex-1 w-full pb-20 md:pb-8 px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
          <div className="page-enter h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />

      {/* Toast Overlay */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts?.map((toast, i) => (
          <div 
            key={toast.id || i} 
            className={`p-4 rounded-xl shadow-lg pointer-events-auto transition-all animate-fade-in text-sm font-medium ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 
              toast.type === 'success' ? 'bg-emerald-500 text-white' : 
              'bg-brand-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
