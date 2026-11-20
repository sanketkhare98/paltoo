import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Heart, ShoppingBag, Menu, X, Apple, AlertTriangle, GraduationCap, Calendar, CreditCard } from 'lucide-react';
import { classNames } from '../../utils/helpers';

export default function BottomNav() {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const mainTabs = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'Health', path: '/health', icon: Heart },
    { name: 'Shop', path: '/marketplace', icon: ShoppingBag },
  ];

  const moreTabs = [
    { name: 'Nutrition', path: '/nutrition', icon: Apple },
    { name: 'Emergency', path: '/emergency', icon: AlertTriangle },
    { name: 'Training', path: '/training', icon: GraduationCap },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Pricing', path: '/pricing', icon: CreditCard },
  ];

  return (
    <>
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsDrawerOpen(false)} />
      )}
      
      {isDrawerOpen && (
        <div className="md:hidden fixed bottom-16 inset-x-0 z-50 bg-[var(--color-surface)] rounded-t-3xl shadow-2xl border-t border-brand-100 dark:border-brand-900/30 p-5 drawer-enter">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-xl text-brand-600 dark:text-brand-400">More Features</h3>
            <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-y-8 gap-x-2">
            {moreTabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                onClick={() => setIsDrawerOpen(false)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={classNames(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                  location.pathname.startsWith(tab.path) 
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105" 
                    : "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 group-hover:text-brand-500"
                )}>
                  <tab.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-center text-gray-600 dark:text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{tab.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[var(--color-surface)]/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 pb-safe transition-all duration-300">
        <div className="flex items-center justify-around h-16">
          {mainTabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <Link
                key={tab.name}
                to={tab.path}
                className={classNames(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
                  isActive ? "text-brand-500 -translate-y-1" : "text-gray-500 hover:text-brand-400"
                )}
              >
                <div className={classNames(
                  "p-1.5 rounded-full transition-all duration-300",
                  isActive ? "bg-brand-50 dark:bg-brand-900/30" : ""
                )}>
                  <tab.icon className={classNames("w-6 h-6 transition-transform duration-300", isActive ? "scale-110" : "")} />
                </div>
                <span className="text-[10px] font-bold">{tab.name}</span>
              </Link>
            );
          })}
          
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={classNames(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
              isDrawerOpen ? "text-brand-500 -translate-y-1" : "text-gray-500 hover:text-brand-400"
            )}
          >
            <div className={classNames(
              "p-1.5 rounded-full transition-all duration-300",
              isDrawerOpen ? "bg-brand-50 dark:bg-brand-900/30" : ""
            )}>
              <Menu className={classNames("w-6 h-6 transition-transform duration-300", isDrawerOpen ? "scale-110" : "")} />
            </div>
            <span className="text-[10px] font-bold">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
