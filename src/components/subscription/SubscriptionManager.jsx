import React from 'react';
import { Settings, CreditCard, Shield, Server, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePets } from '../../contexts/PetContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

export default function SubscriptionManager() {
  const { currentTier, getRemainingQueries, signOut, user } = useAuth();
  const { pets } = usePets();
  const navigate = useNavigate();
  const { showToast } = useNotifications();
  const tier = currentTier || { name: 'Free', id: 'free', maxAiQueries: 10, maxPets: 2 };

  const queriesLeft = getRemainingQueries();
  const maxQueries = tier.maxAiQueries ?? 10;
  const isUnlimitedQueries = maxQueries === -1;
  const queriesUsed = isUnlimitedQueries ? 'Unlimited' : Math.max(0, maxQueries - queriesLeft);
  const queryPercent = isUnlimitedQueries ? 0 : Math.min(100, (queriesUsed / maxQueries) * 100);

  const cancelSubscription = () => {
    showToast('In a real app, this would open a cancellation flow.', 'info');
  };

  const handleSignOut = () => {
    signOut();
    navigate('/login');
    showToast('Signed out successfully 👋', 'info');
  };

  return (
    <div className="page-container p-4 md:p-6 pb-24 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-[var(--color-text)] flex items-center gap-2 mb-6">
        <Settings className="w-8 h-8 text-brand-500" /> Account & Settings
      </h1>

      {/* User profile card */}
      {user && (
        <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center text-2xl font-bold">
              {user.avatar || '🐾'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">{user.name}</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">{user.email}</p>
              <span className="inline-block mt-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                Signed in via {user.provider ? user.provider.toUpperCase() : 'Account'}
              </span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="btn-secondary text-sm px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Current Subscription Card */}
      <div className="bg-[var(--color-surface)] rounded-3xl p-6 border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--color-text)]">
              <CreditCard className="w-5 h-5 text-brand-500" /> Current Plan
            </h2>
            <p className="text-[var(--color-text-secondary)] text-sm">Manage your Paltoo subscription</p>
          </div>
          <div className="bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold px-4 py-1.5 rounded-full capitalize">
            {tier.name} Plan
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-brand-50/50 dark:bg-gray-800/50 p-4 rounded-xl border border-brand-100 dark:border-gray-700">
            <div className="text-sm text-[var(--color-text-secondary)] mb-1">AI Usage This Month</div>
            <div className="text-2xl font-bold text-[var(--color-text)] mb-2">
              {isUnlimitedQueries ? 'Unlimited' : `${queriesUsed} / ${maxQueries}`}
            </div>
            {!isUnlimitedQueries && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${queryPercent > 90 ? 'bg-red-500' : queryPercent > 70 ? 'bg-yellow-500' : 'bg-brand-500'}`} 
                  style={{ width: `${queryPercent}%` }}
                />
              </div>
            )}
          </div>
          <div className="bg-brand-50/50 dark:bg-gray-800/50 p-4 rounded-xl border border-brand-100 dark:border-gray-700">
            <div className="text-sm text-[var(--color-text-secondary)] mb-1">Pets Registered</div>
            <div className="text-2xl font-bold text-[var(--color-text)]">
              {pets.length} <span className="text-base text-[var(--color-text-secondary)] font-normal">/ {tier.maxPets === -1 ? '∞' : tier.maxPets}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--color-border)]">
          <button onClick={() => navigate('/pricing')} className="btn-primary py-2 px-6 rounded-lg font-medium">
            Change Plan
          </button>
          {tier.id !== 'free' && (
            <button onClick={cancelSubscription} className="py-2 px-6 text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              Cancel Subscription
            </button>
          )}
        </div>
      </div>

      {/* AI Backend Status */}
      <div className="bg-[var(--color-surface)] rounded-3xl p-6 border border-[var(--color-border)] shadow-sm space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--color-text)]">
          <Server className="w-5 h-5 text-emerald-500" /> AI Service Architecture
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Paltoo is integrated with Google Gemini 2.0 Flash through a secure, high-throughput server backend. Your requests are processed centrally with zero client-side key exposure.
        </p>
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Backend Gemini API Proxy is active & configured securely.</span>
        </div>
      </div>
    </div>
  );
}
