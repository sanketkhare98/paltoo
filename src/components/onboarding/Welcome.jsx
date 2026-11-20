import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePets } from '../../contexts/PetContext';
import { ShieldCheck, Heart, Utensils, AlertTriangle, ArrowRight } from 'lucide-react';
import PaltooLogo, { PawIcon } from '../common/PaltooLogo';

export default function Welcome() {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithApple, signInAsGuest } = useAuth();
  const { pets } = usePets();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleNextRoute = () => {
    if (!pets || pets.length === 0) {
      navigate('/onboard-pet');
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoadingProvider('google');
      if (signInWithGoogle) await signInWithGoogle();
      handleNextRoute();
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoadingProvider('apple');
      if (signInWithApple) await signInWithApple();
      handleNextRoute();
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setLoadingProvider('guest');
      if (signInAsGuest) await signInAsGuest();
      handleNextRoute();
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/60 to-yellow-50 dark:from-stone-950 dark:via-orange-950/25 dark:to-stone-900 flex flex-col justify-between p-4 sm:p-6 lg:p-10 transition-colors duration-300">
      
      {/* Top Brand Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <PaltooLogo size="md" showText={true} />
      </div>

      {/* Main Login / Hero Section */}
      <div className="w-full max-w-5xl mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Value Proposition & Brand */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
            <span>🐾 Your Pet's Best Friend in AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-[var(--color-text)] tracking-tight leading-tight">
            Your Pet Deserves <span className="gradient-text">Expert Care</span>, Every Single Day
          </h1>

          <p className="text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            From breed-specific nutrition to AI symptom checks and emergency vet assistance — Paltoo keeps your furry companion thriving every day.
          </p>

          {/* Quick feature pill items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="glass-card p-3.5 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[var(--color-text)]">Tailored Diet</div>
                <div className="text-[11px] text-[var(--color-text-secondary)]">Custom calories & macros</div>
              </div>
            </div>

            <div className="glass-card p-3.5 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[var(--color-text)]">Health Tracking</div>
                <div className="text-[11px] text-[var(--color-text-secondary)]">Weight, vaccines & records</div>
              </div>
            </div>

            <div className="glass-card p-3.5 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[var(--color-text)]">Emergency Care</div>
                <div className="text-[11px] text-[var(--color-text-secondary)]">Nearby 24/7 clinics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dedicated Login Card (Front & Center) */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="glass-card p-8 sm:p-9 rounded-3xl border border-brand-200/80 dark:border-brand-900/40 shadow-2xl shadow-brand-500/10 backdrop-blur-xl relative">
            
            {/* Top Badge */}
            <div className="text-center space-y-1.5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-brand-500 to-orange-500 mx-auto p-3.5 flex items-center justify-center shadow-lg shadow-brand-500/25 mb-4 animate-paw-bounce">
                <PawIcon />
              </div>
              <h2 className="text-2xl font-display font-black text-[var(--color-text)]">
                Sign In to Paltoo
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Sign in with Google or Apple to access your pet's dashboard
              </p>
            </div>

            {/* Sign-In Actions */}
            <div className="space-y-3.5">
              
              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3.5 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 font-semibold py-3.5 px-6 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-60"
              >
                {loadingProvider === 'google' ? (
                  <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                <span className="text-sm">Continue with Google</span>
              </button>

              {/* Apple Sign-In Button */}
              <button
                type="button"
                onClick={handleAppleSignIn}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3.5 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 font-semibold py-3.5 px-6 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-60"
              >
                {loadingProvider === 'apple' ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.8 1.58.07 2.65.69 3.36 1.76-2.73 1.5-2.26 5.16.51 6.24-.61 1.52-1.39 3.02-2.53 4.97zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                )}
                <span className="text-sm">Continue with Apple</span>
              </button>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <hr className="w-full border-[var(--color-border)]" />
                <span className="absolute bg-[var(--color-surface)] px-3 text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">
                  or
                </span>
              </div>

              {/* Guest Explore Button */}
              <button
                type="button"
                onClick={handleGuestSignIn}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-2 btn-secondary py-3 px-6 rounded-2xl text-sm font-semibold"
              >
                <span>Continue as Guest</span>
                <ArrowRight className="w-4 h-4 text-brand-500" />
              </button>
            </div>

            {/* Privacy footer note */}
            <div className="mt-6 pt-5 border-t border-[var(--color-border)] text-center flex items-center justify-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No password required • Single secure API integration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-6xl mx-auto text-center py-3 text-xs text-[var(--color-text-secondary)]">
        Paltoo © 2026 • AI-Powered Pet Companion • Powered by Google Gemini 2.0
      </div>
    </div>
  );
}
