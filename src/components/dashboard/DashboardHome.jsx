import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePets } from '../../contexts/PetContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { 
  MessageSquare, 
  Activity, 
  PlusCircle, 
  Calendar, 
  ShieldAlert, 
  Edit3, 
  Sparkles, 
  LogOut, 
  User, 
  Scale, 
  CreditCard 
} from 'lucide-react';
import HealthScore from './HealthScore';
import DailyChecklist from './DailyChecklist';
import QuickInsights from './QuickInsights';
import UpcomingReminders from './UpcomingReminders';
import PetProfileForm from '../pets/PetProfileForm';
import { formatAge } from '../../utils/helpers';

export default function DashboardHome() {
  const { currentTier, user, signOut } = useAuth();
  const { activePet, activePetId, addWeightEntry } = usePets();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  
  const [isEditingPet, setIsEditingPet] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [quickWeight, setQuickWeight] = useState('');
  const [quickWeightDate, setQuickWeightDate] = useState(new Date().toISOString().split('T')[0]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = () => {
    signOut();
    showToast('Logged out successfully. See you soon! 👋', 'info');
    navigate('/login');
  };

  if (!activePet) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-24 h-24 bg-brand-100 text-brand-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/20 animate-paw-bounce">
          <span className="text-5xl">🐾</span>
        </div>
        <h2 className="text-3xl font-display font-bold mb-3 text-[var(--color-text)]">
          Welcome to Paltoo!
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-8 max-w-md text-base">
          Get started by setting up your pet's profile for personalized AI nutrition, symptom analysis, and health tracking.
        </p>
        <button 
          className="btn-primary flex items-center gap-2 text-base px-7 py-3" 
          onClick={() => navigate('/onboard-pet')}
        >
          <PlusCircle size={20} />
          Create First Pet Profile
        </button>
      </div>
    );
  }

  const isFreePlan = (currentTier?.id || 'free').toLowerCase() === 'free';

  const handleQuickWeightSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(quickWeight);
    if (!isNaN(val) && val > 0) {
      addWeightEntry(activePetId, val, quickWeightDate);
      setQuickWeight('');
      setShowWeightModal(false);
      showToast(`Logged ${val} kg for ${activePet.name}! ⚖️`, 'success');
    }
  };

  const speciesEmoji = activePet.species === 'Dog' ? '🐕' : activePet.species === 'Cat' ? '🐈' : '🐾';

  return (
    <div className="page-container space-y-6 animate-fade-in pb-16">
      
      {/* User Account / Profile Section Bar with Log Out Option */}
      <div className="glass-card p-4 sm:p-5 rounded-3xl border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-brand-500 to-orange-500 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-brand-500/20 shrink-0">
            {user?.avatar || <User className="w-5 h-5" />}
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-display font-bold text-[var(--color-text)] truncate">
                {user?.name || 'Pet Parent'}
              </span>
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 shrink-0">
                {currentTier?.name || 'Free'} Plan
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] truncate">
              {user?.email || 'Logged in to Paltoo'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => navigate('/pricing')}
            className="btn-secondary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap"
          >
            <CreditCard size={14} className="text-brand-500" />
            <span>{isFreePlan ? 'Upgrade Tier' : 'Manage Subscription'}</span>
          </button>
          
          {/* Explicit Log Out Option */}
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap"
            title="Log Out of your Paltoo account"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Free tier upgrade nudge */}
      {isFreePlan && (
        <div className="bg-gradient-to-r from-amber-500 via-brand-500 to-orange-500 p-4 sm:p-5 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-brand-500/20">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center justify-center sm:justify-start gap-2">
                Upgrade to Paltoo Premium
              </h3>
              <p className="text-xs text-white/90">
                Unlock full AI health scores, calendar export, and unlimited personalized care plans for ₹299/mo.
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/pricing')}
            className="whitespace-nowrap px-5 py-2.5 bg-white text-brand-600 rounded-xl text-xs font-bold hover:bg-opacity-95 transition-all shadow-md active:scale-95 shrink-0"
          >
            View Plans (12% Off)
          </button>
        </div>
      )}

      {/* Header with Greeting, Active Pet Summary, and Edit Pet Profile Button */}
      <header className="glass-card p-6 rounded-3xl border border-[var(--color-border)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center text-3xl shadow-sm shrink-0">
            {speciesEmoji}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--color-text)]">
                {getGreeting()}, {activePet.name}! {speciesEmoji}
              </h1>
              
              {/* EDIT PET PROFILE BUTTON */}
              <button
                type="button"
                onClick={() => setIsEditingPet(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-semibold transition-all border border-brand-200 dark:border-brand-800"
                title="Edit pet profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Pet Profile</span>
              </button>
            </div>

            {/* Pet Subtitle Attributes */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-text-secondary)] mt-1.5 font-medium">
              <span>{activePet.breed || activePet.species}</span>
              <span>•</span>
              <span>{activePet.birthDate ? formatAge(activePet.birthDate) : 'Age not set'}</span>
              <span>•</span>
              <span className="font-bold text-[var(--color-text)]">
                {activePet.weight ? `${activePet.weight} kg` : 'Weight not set'}
              </span>
              {activePet.activityLevel && (
                <>
                  <span>•</span>
                  <span>{activePet.activityLevel} Activity</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            type="button"
            className="btn-primary whitespace-nowrap flex items-center gap-2 text-xs sm:text-sm py-2 px-4 shadow-sm" 
            onClick={() => navigate('/chat')}
          >
            <MessageSquare size={16} /> 
            <span>Ask AI</span>
          </button>

          <button 
            type="button"
            className="btn-secondary whitespace-nowrap flex items-center gap-2 text-xs sm:text-sm py-2 px-4" 
            onClick={() => setShowWeightModal(true)}
          >
            <Activity size={16} className="text-brand-500" /> 
            <span>Log Weight</span>
          </button>

          <button 
            type="button"
            className="btn-secondary whitespace-nowrap flex items-center gap-2 text-xs sm:text-sm py-2 px-4" 
            onClick={() => navigate('/symptoms')}
          >
            <ShieldAlert size={16} className="text-rose-500" /> 
            <span>Symptom Check</span>
          </button>

          <button 
            type="button"
            className="btn-secondary whitespace-nowrap flex items-center gap-2 text-xs sm:text-sm py-2 px-4" 
            onClick={() => navigate('/schedule')}
          >
            <Calendar size={16} className="text-blue-500" /> 
            <span>Schedule Vet</span>
          </button>
        </div>
      </header>

      {/* Main Grid: Health Score, Reminders, Checklist, AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        
        {/* Column 1: Health Score & Reminders */}
        <div className="space-y-6">
          <HealthScore />
          <UpcomingReminders />
        </div>

        {/* Column 2: Today's Routine Checklist */}
        <div className="space-y-6">
          <DailyChecklist />
        </div>

        {/* Column 3: AI Insights (Directly tailored to this pet) */}
        <div className="space-y-6 md:col-span-2 xl:col-span-1">
          <QuickInsights />
        </div>
      </div>

      {/* Edit Pet Profile Modal */}
      {isEditingPet && (
        <PetProfileForm 
          pet={activePet} 
          onClose={() => setIsEditingPet(false)} 
        />
      )}

      {/* Quick Weight Log Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface)] rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[var(--color-border)] animate-scale-in">
            <h3 className="text-lg font-display font-bold text-[var(--color-text)] mb-1 flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-500" /> Log Weight for {activePet.name}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4">
              Keep track of growth and diet trends.
            </p>

            <form onSubmit={handleQuickWeightSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                  Weight (in kg)
                </label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0.1"
                  className="input-field" 
                  placeholder={`Current: ${activePet.weight || 0} kg`}
                  value={quickWeight}
                  onChange={e => setQuickWeight(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                  Date
                </label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={quickWeightDate}
                  onChange={e => setQuickWeightDate(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setShowWeightModal(false)}
                  className="btn-secondary py-2 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary py-2 px-5 text-xs font-bold"
                >
                  Save Weight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
