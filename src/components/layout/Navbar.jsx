import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Bell, Settings, User, LogOut, Sparkles, Shield, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import PetSwitcher from '../pets/PetSwitcher';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { reminders, showToast } = useNotifications();
  const { user, currentTier, signOut } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfileMenu(false);
    signOut();
    showToast('Logged out of Paltoo 👋', 'info');
    navigate('/login');
  };

  const unreadCount = reminders?.length || 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-white via-amber-50/20 to-orange-50/30 dark:from-[var(--color-surface)] dark:via-brand-950/10 dark:to-orange-950/10 border-b border-brand-100 dark:border-brand-900/20 shadow-sm backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo with Vibrant Orange Paw */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-brand-500 to-orange-500 p-2 flex items-center justify-center shadow-md shadow-brand-500/25 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                {/* Canonical Orange Paw Icon */}
                <svg className="w-full h-full text-white fill-current" viewBox="0 0 24 24">
                  {/* Central paw pad */}
                  <path d="M12 11.2c-2.3 0-4.2 1.8-4.2 4.1 0 1.9 1.4 3.5 3.2 3.5.9 0 1.5-.5 2-.5.5 0 1.1.5 2 .5 1.8 0 3.2-1.6 3.2-3.5 0-2.3-1.9-4.1-4.2-4.1z" />
                  {/* 4 toe pads */}
                  <ellipse cx="6.5" cy="9.8" rx="1.6" ry="2.2" />
                  <ellipse cx="10" cy="6.8" rx="1.6" ry="2.2" />
                  <ellipse cx="14" cy="6.8" rx="1.6" ry="2.2" />
                  <ellipse cx="17.5" cy="9.8" rx="1.6" ry="2.2" />
                </svg>
              </div>
              <span className="font-display font-black text-2xl bg-gradient-to-r from-brand-600 via-amber-500 to-orange-500 bg-clip-text text-transparent hidden sm:block">
                Paltoo
              </span>
            </Link>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <PetSwitcher />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 rounded-xl hover:bg-brand-100/50 dark:hover:bg-brand-900/30 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifMenuRef}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 rounded-xl hover:bg-brand-100/50 dark:hover:bg-brand-900/30 transition-all duration-300"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 block w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900 animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-[var(--color-surface)] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 animate-slide-up origin-top-right overflow-hidden">
                  <div className="p-3.5 border-b border-gray-100 dark:border-gray-800 font-bold text-sm flex items-center justify-between">
                    <span>Reminders & Alerts</span>
                    <span className="text-[10px] px-2 py-0.5 bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 rounded-full font-extrabold">
                      {unreadCount} active
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    {unreadCount > 0 ? (
                      reminders.map((r, i) => (
                        <div key={i} className="p-2.5 text-xs border-b border-gray-100 dark:border-gray-800/60 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 rounded-xl transition-colors">
                          <div className="font-bold text-[var(--color-text)]">{r.title || 'Pet Reminder'}</div>
                          <div className="text-[var(--color-text-secondary)] mt-0.5">{r.time || r.date || 'Today'}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-xs text-center text-gray-400">
                        No pending reminders 🎉
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown with Log Out */}
            {user && (
              <div className="relative ml-1" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-brand-100/50 dark:hover:bg-brand-900/30 transition-all cursor-pointer group"
                  aria-label="User profile menu"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm shadow-sm group-hover:scale-105 transition-transform">
                    {user.avatar || <User className="w-4 h-4" />}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-500 transition-transform" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-[var(--color-surface)] border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl z-50 animate-slide-up origin-top-right overflow-hidden">
                    
                    {/* User Info Header */}
                    <div className="p-4 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg shadow-md shrink-0">
                          {user.avatar || '🐾'}
                        </div>
                        <div className="overflow-hidden text-left">
                          <h4 className="font-bold text-sm text-[var(--color-text)] truncate">
                            {user.name || 'Pet Parent'}
                          </h4>
                          <p className="text-[11px] text-[var(--color-text-secondary)] truncate">
                            {user.email || 'account'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-2.5 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wide">
                          {currentTier?.name || 'Free'} Plan
                        </span>
                        <Link 
                          to="/pricing" 
                          onClick={() => setShowProfileMenu(false)}
                          className="font-bold text-orange-600 dark:text-orange-400 hover:underline"
                        >
                          Upgrade
                        </Link>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="p-2 space-y-1 text-xs font-semibold">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-[var(--color-text)] hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-500 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-brand-500" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        to="/pricing"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-[var(--color-text)] hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-500 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-500" />
                        <span>Subscription Plans</span>
                      </Link>
                    </div>

                    {/* Prominent Log Out Button */}
                    <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-xs font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
