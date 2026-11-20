import React, { useState } from 'react';
import { Check, X, Diamond, Sparkles, Shield, HeartHandshake, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SUBSCRIPTION_TIERS } from '../../utils/constants';
import { formatCurrency, classNames } from '../../utils/helpers';
import { useNotifications } from '../../contexts/NotificationContext';

export default function PricingPage() {
  const { currentTier, subscription, updateSubscription } = useAuth();
  const { showToast } = useNotifications();
  const [isAnnual, setIsAnnual] = useState(true);

  // Safely determine currently active plan ID
  const activePlanId = (currentTier?.id || subscription?.tier || 'free').toLowerCase();

  const handleUpgrade = (tierId) => {
    updateSubscription(tierId, isAnnual ? 'annual' : 'monthly');
    const name = SUBSCRIPTION_TIERS[tierId]?.name || tierId;
    showToast(`Switched plan to ${name}! 🎉`, 'success');
  };

  // Convert SUBSCRIPTION_TIERS object to an array guaranteed to contain free, premium, and pro
  const tiers = [
    SUBSCRIPTION_TIERS.free || {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      maxPets: 2,
      maxAiQueries: 10,
      features: ['Basic pet profiles (up to 2 pets)', '10 AI queries/month', 'Access to marketplace', 'Basic breed information'],
      excluded: ['Calendar export', 'Health tracking dashboard', 'Full AI insights', 'Medication reminders', 'Vet scheduler'],
    },
    SUBSCRIPTION_TIERS.premium || {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 299,
      annualPrice: 3156.48,
      maxPets: 10,
      maxAiQueries: 200,
      features: [
        'Multi-pet profile management (up to 10)',
        'Full AI insights & personalized recommendations',
        'Google Calendar & Apple Calendar export',
        'Full micro-nutrition plans with notifications',
        'Diet plan export & calendar integration',
        'Health tracking dashboard with daily checklist',
        'Pet-specific product recommendations',
        'Medication & supplement reminders',
        'Vet appointment scheduler',
      ],
      excluded: ['Priority support', 'Advanced analytics', 'Complimentary vet consultations', 'Exclusive merchandise'],
    },
    SUBSCRIPTION_TIERS.pro || {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 599,
      annualPrice: 6325.44,
      maxPets: -1,
      maxAiQueries: -1,
      features: [
        'Everything in Premium',
        'Unlimited pet profiles',
        'Unlimited AI queries',
        'Priority support & response',
        'Advanced analytics & health insights',
        '3 complimentary vet consultations / year',
        'Exclusive merchandise & perks',
        'Early access to new features',
        'Community features & pet photo sharing',
        'Emergency vet locator priority listings',
      ],
      excluded: [],
    },
  ];

  const tierOrder = { free: 0, premium: 1, pro: 2 };
  const currentTierRank = tierOrder[activePlanId] ?? 0;

  return (
    <div className="page-container pb-24 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-brand-700 dark:text-brand-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 shadow-sm">
          <Diamond className="w-4 h-4 text-brand-500" />
          Transparent Pricing
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[var(--color-text)] mb-4">
          Choose Your Care Plan 🐾
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
          Tailored nutrition plans, continuous AI monitoring, and round-the-clock pet wellness tracking.
        </p>

        {/* Monthly / Annual Toggle Switch */}
        <div className="flex items-center justify-center mt-8 gap-4">
          <span className={classNames(
            "font-semibold transition-colors duration-300",
            !isAnnual ? 'text-[var(--color-text)] font-bold' : 'text-[var(--color-text-secondary)]'
          )}>
            Monthly Billing
          </span>

          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className={classNames(
              "w-16 h-8 rounded-full relative transition-all duration-300 focus:outline-none shadow-inner",
              isAnnual ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-700"
            )}
            aria-label="Toggle annual billing"
          >
            <div className={classNames(
              "w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-md",
              isAnnual ? 'left-9' : 'left-1'
            )} />
          </button>

          <span className={classNames(
            "font-semibold flex items-center gap-2 transition-colors duration-300",
            isAnnual ? 'text-[var(--color-text)] font-bold' : 'text-[var(--color-text-secondary)]'
          )}>
            Annual Billing
            <span className="bg-emerald-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm animate-pulse">
              12% OFF
            </span>
          </span>
        </div>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {tiers.map((tier) => {
          const isCurrent = activePlanId === tier.id;
          const isPopular = tier.id === 'premium';
          const isPro = tier.id === 'pro';
          
          const rawPrice = isAnnual ? tier.annualPrice : tier.monthlyPrice;
          const priceDisplay = rawPrice === 0 ? 'Free' : formatCurrency(rawPrice);
          const billingSubtitle = tier.id === 'free' 
            ? 'Forever free for basic use' 
            : (isAnnual ? 'billed annually (12% off)' : 'billed monthly');

          const tierRank = tierOrder[tier.id] ?? 0;
          const isDowngrade = tierRank < currentTierRank;

          return (
            <div
              key={tier.id}
              className={classNames(
                "relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 card-hover",
                isPopular
                  ? "bg-gradient-to-b from-amber-50 to-orange-50/50 dark:from-amber-950/40 dark:to-orange-950/20 border-2 border-brand-500 shadow-xl shadow-brand-500/15 md:-translate-y-2 z-10"
                  : isPro
                    ? "bg-gradient-to-b from-orange-50/70 to-amber-50/40 dark:from-orange-950/30 dark:to-amber-950/20 border-2 border-orange-400 dark:border-orange-500/50 shadow-md"
                    : "bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm"
              )}
            >
              {/* Popular / Pro Ribbon */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> All Inclusive
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">
                      {tier.id === 'free' ? '🐾' : tier.id === 'premium' ? '🌟' : '👑'}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-[var(--color-text)] capitalize">
                      {tier.name}
                    </h3>
                  </div>
                  {isCurrent && (
                    <span className="text-xs bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-bold px-2.5 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                {/* Pricing section */}
                <div className="mt-4 mb-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-display font-black text-[var(--color-text)]">
                      {priceDisplay}
                    </span>
                    {rawPrice > 0 && (
                      <span className="text-[var(--color-text-secondary)] font-medium text-sm">
                        {isAnnual ? '/yr' : '/mo'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {billingSubtitle}
                  </p>
                  {isAnnual && rawPrice > 0 && (
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                      Equivalent to {formatCurrency(Math.round(rawPrice / 12))}/month
                    </p>
                  )}
                </div>

                <hr className="my-6 border-[var(--color-border)] opacity-60" />

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                    Key Features
                  </div>

                  {/* Limits */}
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {tier.maxPets === -1 ? 'Unlimited pet profiles' : `Up to ${tier.maxPets} pet profiles`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {tier.maxAiQueries === -1 ? 'Unlimited AI queries' : `${tier.maxAiQueries} AI queries / month`}
                    </span>
                  </div>

                  {/* Included features */}
                  {tier.features?.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-[var(--color-text)]">
                        {feature}
                      </span>
                    </div>
                  ))}

                  {/* Excluded features for Free/Premium */}
                  {tier.excluded?.map((feature, i) => (
                    <div key={`ex-${i}`} className="flex items-start gap-3 opacity-40">
                      <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-[var(--color-text-secondary)] line-through">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleUpgrade(tier.id)}
                disabled={isCurrent}
                className={classNames(
                  "w-full py-3.5 rounded-xl font-bold transition-all duration-300 text-sm shadow-sm",
                  isCurrent
                    ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : isPopular
                      ? "btn-primary hover:shadow-lg hover:shadow-brand-500/25"
                      : isPro
                        ? "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                        : "btn-secondary"
                )}
              >
                {isCurrent 
                  ? '✓ Current Plan' 
                  : isDowngrade 
                    ? `Switch to ${tier.name}` 
                    : `Upgrade to ${tier.name}`
                }
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="mt-14 glass-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-[var(--color-text)] text-base">Simple & Transparent</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">
              No hidden fees. Change or cancel your plan anytime with immediate effect.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-[var(--color-text)] text-base">Pet-First AI Guidance</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Powered by Google Gemini 2.0 Flash for instant, pet-specific health and diet insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
