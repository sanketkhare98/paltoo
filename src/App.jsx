import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { usePets } from './contexts/PetContext';
import Layout from './components/layout/Layout';
import { PawIcon } from './components/common/PaltooLogo';

// Lazy load pages for fast code splitting
const Welcome = lazy(() => import('./components/onboarding/Welcome'));
const ApiKeySetup = lazy(() => import('./components/onboarding/ApiKeySetup'));
const PetOnboarding = lazy(() => import('./components/onboarding/PetOnboarding'));
const DashboardHome = lazy(() => import('./components/dashboard/DashboardHome'));
const AiChat = lazy(() => import('./components/ai/AiChat'));
const SymptomChecker = lazy(() => import('./components/ai/SymptomChecker'));
const BreedGuide = lazy(() => import('./components/ai/BreedGuide'));
const HealthDashboard = lazy(() => import('./components/health/HealthDashboard'));
const DietPlan = lazy(() => import('./components/nutrition/DietPlan'));
const MarketplaceHome = lazy(() => import('./components/marketplace/MarketplaceHome'));
const EmergencyPage = lazy(() => import('./components/emergency/EmergencyPage'));
const VetScheduler = lazy(() => import('./components/scheduling/VetScheduler'));
const ReminderManager = lazy(() => import('./components/scheduling/ReminderManager'));
const TrainingGuide = lazy(() => import('./components/training/TrainingGuide'));
const PricingPage = lazy(() => import('./components/subscription/PricingPage'));
const SubscriptionManager = lazy(() => import('./components/subscription/SubscriptionManager'));

/* ── Paltoo Loading Screen ─────────────────────────────────────── */
function PaltooLoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="flex flex-col items-center animate-fade-in">
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-brand-500 to-orange-500 p-4 flex items-center justify-center shadow-xl shadow-brand-500/30 animate-paw-bounce">
            <PawIcon />
          </div>
          <div className="absolute -inset-2.5 rounded-3xl bg-brand-500/20 animate-pulse-warm -z-10" />
        </div>

        <h2 className="font-display font-black text-2xl bg-gradient-to-r from-amber-500 via-brand-500 to-orange-600 bg-clip-text text-transparent mb-1">
          Paltoo
        </h2>
        <p className="text-[var(--color-text-secondary)] text-xs font-medium">
          Your AI-Powered Pet Companion
        </p>

        <div className="flex gap-1.5 mt-6">
          <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

/* ── Splash Screen (Brief intro on first visit) ──────────────────── */
function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 900);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-brand-500 to-orange-500 p-5 flex items-center justify-center shadow-2xl shadow-brand-500/30 animate-paw-bounce mb-6">
          <PawIcon />
        </div>
        <h1 className="font-display font-black text-4xl bg-gradient-to-r from-amber-400 via-brand-500 to-orange-500 bg-clip-text text-transparent mb-2 animate-fade-in">
          Paltoo
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm font-medium animate-fade-in">
          Your AI-Powered Pet Companion
        </p>
        <div className="flex gap-1.5 mt-8">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

/* ── Route Guards ─────────────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  const { pets } = usePets();
  if (user) {
    if (!pets || pets.length === 0) {
      return <Navigate to="/onboard-pet" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    const shown = sessionStorage.getItem('paltoo_splash_shown');
    return !shown;
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('paltoo_splash_shown', 'true');
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Suspense fallback={<PaltooLoadingScreen />}>
      <Routes>
        {/* Public Login & Welcome routes */}
        <Route 
          path="/login" 
          element={
            <PublicOnlyRoute>
              <Welcome />
            </PublicOnlyRoute>
          } 
        />
        <Route 
          path="/welcome" 
          element={
            <PublicOnlyRoute>
              <Welcome />
            </PublicOnlyRoute>
          } 
        />
        
        {/* Onboarding routes (require user login) */}
        <Route 
          path="/setup" 
          element={
            <ProtectedRoute>
              <ApiKeySetup />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboard-pet" 
          element={
            <ProtectedRoute>
              <PetOnboarding />
            </ProtectedRoute>
          } 
        />

        {/* Main Application with App Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="chat" element={<AiChat />} />
          <Route path="symptoms" element={<SymptomChecker />} />
          <Route path="breed-guide" element={<BreedGuide />} />
          <Route path="health" element={<HealthDashboard />} />
          <Route path="nutrition" element={<DietPlan />} />
          <Route path="marketplace" element={<MarketplaceHome />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="schedule" element={<VetScheduler />} />
          <Route path="reminders" element={<ReminderManager />} />
          <Route path="training" element={<TrainingGuide />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="settings" element={<SubscriptionManager />} />
        </Route>

        {/* Root Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
