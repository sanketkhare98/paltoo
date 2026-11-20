import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageCircle, 
  Heart, 
  Apple, 
  ShoppingBag, 
  AlertTriangle, 
  GraduationCap, 
  Calendar, 
  CreditCard,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { classNames } from '../../utils/helpers';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Chat', path: '/chat', icon: MessageCircle },
  { name: 'Health', path: '/health', icon: Heart },
  { name: 'Nutrition', path: '/nutrition', icon: Apple },
  { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
  { name: 'Emergency', path: '/emergency', icon: AlertTriangle },
  { name: 'Training', path: '/training', icon: GraduationCap },
  { name: 'Schedule', path: '/schedule', icon: Calendar },
  { name: 'Pricing', path: '/pricing', icon: CreditCard },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTier, user, signOut } = useAuth();
  const { showToast } = useNotifications();

  const handleLogout = () => {
    signOut();
    showToast('Logged out successfully. See you soon! 👋', 'info');
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-gray-200 dark:border-gray-800 bg-[var(--color-surface)] z-30 transition-all duration-300">
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-4 px-3 space-y-1.5 pr-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={classNames(
                isActive 
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 font-bold shadow-sm translate-x-1' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-brand-500 hover:translate-x-1',
                'group flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 text-sm'
              )}
            >
              <item.icon
                className={classNames(
                  isActive ? 'text-brand-600 dark:text-brand-400 scale-110' : 'text-gray-400 group-hover:text-brand-400 group-hover:scale-110',
                  'mr-3 flex-shrink-0 h-5 w-5 transition-all duration-300'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer / Profile & Subscription Section */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
        {/* Subscription Plan Pill */}
        <div className="bg-gradient-to-br from-brand-50 to-orange-50 dark:from-brand-900/20 dark:to-orange-900/20 rounded-xl p-3 border border-brand-100 dark:border-brand-900/30 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="text-[10px] text-brand-600 dark:text-brand-400 mb-0.5 uppercase font-bold tracking-wider">Current Plan</div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-[var(--color-text)] capitalize">{currentTier?.name || 'Free'} Plan</span>
            <Link to="/pricing" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline transition-all duration-300">
              Upgrade
            </Link>
          </div>
        </div>

        {/* User Profile Bar with Log Out */}
        {user && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/70 dark:border-gray-700">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                {user.avatar || '👤'}
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-bold text-[var(--color-text)] truncate">{user.name || 'Pet Parent'}</div>
                <div className="text-[10px] text-[var(--color-text-secondary)] truncate">{user.email || 'account'}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors shrink-0"
              title="Log Out"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
