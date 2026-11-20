import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SUBSCRIPTION_TIERS } from '../utils/constants';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('paltoo_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [subscription, setSubscription] = useState(() => {
    try {
      const stored = localStorage.getItem('paltoo_subscription');
      if (!stored) return { tier: 'free', billing: 'monthly', startDate: null };
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'string') return { tier: parsed.toLowerCase(), billing: 'monthly', startDate: null };
      if (parsed && parsed.tier) return parsed;
      return { tier: 'free', billing: 'monthly', startDate: null };
    } catch {
      return { tier: 'free', billing: 'monthly', startDate: null };
    }
  });

  const [aiUsage, setAiUsage] = useState(() => {
    try {
      const stored = localStorage.getItem('paltoo_ai_usage');
      if (stored) {
        const data = JSON.parse(stored);
        const now = new Date();
        const resetDate = new Date(data.resetDate);
        if (now > resetDate) {
          return { count: 0, resetDate: getNextResetDate().toISOString() };
        }
        return data;
      }
    } catch {}
    return { count: 0, resetDate: getNextResetDate().toISOString() };
  });

  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('paltoo_onboarded') === 'true';
  });

  function getNextResetDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    const mockUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'usr_' + Date.now().toString(36),
      name: 'Google Pet Parent',
      email: 'petlover@gmail.com',
      avatar: '🐕',
      provider: 'google',
      signedInAt: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem('paltoo_user', JSON.stringify(mockUser));
    return mockUser;
  }, []);

  // Sign in with Apple
  const signInWithApple = useCallback(async () => {
    const mockUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'usr_' + Date.now().toString(36),
      name: 'Apple Pet Parent',
      email: 'petlover@icloud.com',
      avatar: '🐱',
      provider: 'apple',
      signedInAt: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem('paltoo_user', JSON.stringify(mockUser));
    return mockUser;
  }, []);

  // Sign in as Guest
  const signInAsGuest = useCallback(async () => {
    const mockUser = {
      id: 'guest_' + Date.now().toString(36),
      name: 'Guest Explorer',
      email: 'guest@paltoo.app',
      avatar: '🐾',
      provider: 'guest',
      signedInAt: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem('paltoo_user', JSON.stringify(mockUser));
    return mockUser;
  }, []);

  // Sign out
  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem('paltoo_user');
  }, []);

  const updateSubscription = useCallback((tierId, billing = 'monthly') => {
    const safeTierId = (tierId || 'free').toLowerCase();
    const sub = { tier: safeTierId, billing, startDate: new Date().toISOString() };
    setSubscription(sub);
    localStorage.setItem('paltoo_subscription', JSON.stringify(sub));
  }, []);

  const completeOnboarding = useCallback(() => {
    setIsOnboarded(true);
    localStorage.setItem('paltoo_onboarded', 'true');
  }, []);

  const resetOnboarding = useCallback(() => {
    setIsOnboarded(false);
    localStorage.removeItem('paltoo_onboarded');
  }, []);

  const incrementAiUsage = useCallback(() => {
    setAiUsage(prev => {
      const updated = { ...prev, count: prev.count + 1 };
      localStorage.setItem('paltoo_ai_usage', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Resolve current active tier object safely
  const activeTierId = (typeof subscription === 'string' ? subscription : subscription?.tier)?.toLowerCase() || 'free';
  const currentTier = SUBSCRIPTION_TIERS[activeTierId] || SUBSCRIPTION_TIERS.free;

  const canUseAi = useCallback(() => {
    if (currentTier.maxAiQueries === -1) return true;
    return aiUsage.count < currentTier.maxAiQueries;
  }, [currentTier, aiUsage.count]);

  const getRemainingQueries = useCallback(() => {
    if (currentTier.maxAiQueries === -1) return Infinity;
    return Math.max(0, currentTier.maxAiQueries - aiUsage.count);
  }, [currentTier, aiUsage.count]);

  const hasFeature = useCallback((feature) => {
    const tierOrder = { free: 0, premium: 1, pro: 2 };
    const featureTier = {
      calendar: 'premium',
      healthDashboard: 'premium',
      fullAi: 'premium',
      medicationReminders: 'premium',
      vetScheduler: 'premium',
      dietExport: 'premium',
      notifications: 'premium',
      productRecommendations: 'premium',
      prioritySupport: 'pro',
      advancedAnalytics: 'pro',
      vetConsultations: 'pro',
      community: 'pro',
      emergencyPriority: 'pro',
    };
    const required = featureTier[feature] || 'free';
    const userTierKey = (currentTier.id || 'free').toLowerCase();
    return (tierOrder[userTierKey] ?? 0) >= (tierOrder[required] ?? 0);
  }, [currentTier]);

  useEffect(() => {
    try {
      localStorage.setItem('paltoo_ai_usage', JSON.stringify(aiUsage));
    } catch {}
  }, [aiUsage]);

  const value = {
    user,
    isAuthenticated: !!user,
    signInWithGoogle,
    signInWithApple,
    signInAsGuest,
    signOut,
    subscription,
    updateSubscription,
    isOnboarded,
    completeOnboarding,
    resetOnboarding,
    aiUsage,
    incrementAiUsage,
    canUseAi,
    getRemainingQueries,
    hasFeature,
    currentTier,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
