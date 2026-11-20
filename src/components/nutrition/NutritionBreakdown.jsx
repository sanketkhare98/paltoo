import React from 'react';
import { Beef, Citrus, Zap, Pill, Bone, CheckCircle } from 'lucide-react';

const CATEGORY_CONFIG = {
  proteins: { 
    icon: Beef, 
    color: 'text-rose-600 dark:text-rose-400', 
    bg: 'bg-rose-100 dark:bg-rose-900/30', 
    border: 'border-rose-200 dark:border-rose-800', 
    label: 'Proteins 🥩',
    subtitle: 'Essential amino acids for muscle & cell repair'
  },
  vitamins: { 
    icon: Citrus, 
    color: 'text-orange-600 dark:text-orange-400', 
    bg: 'bg-orange-100 dark:bg-orange-900/30', 
    border: 'border-orange-200 dark:border-orange-800', 
    label: 'Essential Vitamins 🍊',
    subtitle: 'Immune defense, eye health & vital organ support'
  },
  supplements: { 
    icon: Pill, 
    color: 'text-blue-600 dark:text-blue-400', 
    bg: 'bg-blue-100 dark:bg-blue-900/30', 
    border: 'border-blue-200 dark:border-blue-800', 
    label: 'Targeted Supplements 💊',
    subtitle: 'Probiotics, joint support & omega fatty acids'
  },
  minerals: { 
    icon: Zap, 
    color: 'text-emerald-600 dark:text-emerald-400', 
    bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
    border: 'border-emerald-200 dark:border-emerald-800', 
    label: 'Vital Minerals ⚡',
    subtitle: 'Bone density, electrolyte balance & enzymatic health'
  },
  treats: { 
    icon: Bone, 
    color: 'text-amber-700 dark:text-amber-300', 
    bg: 'bg-amber-100 dark:bg-amber-900/30', 
    border: 'border-amber-200 dark:border-amber-800', 
    label: 'Controlled Treats 🦴',
    subtitle: 'Training rewards under strict calorie bounds'
  },
};

export default function NutritionBreakdown({ dietPlan }) {
  if (!dietPlan) return null;

  // Extract categories whether nested in nutritionBreakdown or flat on root
  const breakdown = {
    proteins: dietPlan.nutritionBreakdown?.proteins || dietPlan.proteins || [],
    vitamins: dietPlan.nutritionBreakdown?.vitamins || dietPlan.vitamins || [],
    supplements: dietPlan.nutritionBreakdown?.supplements || dietPlan.supplements || [],
    minerals: dietPlan.nutritionBreakdown?.minerals || dietPlan.minerals || [],
    treats: dietPlan.nutritionBreakdown?.treats || dietPlan.treats || []
  };

  const activeCategories = Object.keys(breakdown).filter(k => Array.isArray(breakdown[k]) && breakdown[k].length > 0);

  if (activeCategories.length === 0) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-display font-bold text-[var(--color-text)]">
          Nutritional & Supplement Profile 🔬
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          Daily micronutrient breakdown, required supplements, and dosages.
        </p>
      </div>

      <div className="space-y-4">
        {activeCategories.map(categoryKey => {
          const config = CATEGORY_CONFIG[categoryKey] || { 
            icon: Zap, 
            color: 'text-brand-500', 
            bg: 'bg-brand-500/10', 
            border: 'border-brand-500/20', 
            label: categoryKey,
            subtitle: ''
          };
          const items = breakdown[categoryKey];
          const Icon = config.icon;

          return (
            <div 
              key={categoryKey} 
              className={`rounded-3xl p-5 border ${config.border} bg-[var(--color-surface)] shadow-sm`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className={`font-display font-bold text-base flex items-center gap-2 ${config.color}`}>
                  <div className={`p-1.5 rounded-xl ${config.bg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{config.label}</span>
                </h4>
                <span className="text-xs font-bold text-[var(--color-text-secondary)]">
                  {items.length} items
                </span>
              </div>
              
              {config.subtitle && (
                <p className="text-[11px] text-[var(--color-text-secondary)] mb-3 pl-8">
                  {config.subtitle}
                </p>
              )}

              <div className="space-y-2.5 mt-3">
                {items.map((item, idx) => {
                  const name = item.name || item.food || 'Nutrient';
                  const quantity = item.quantity || item.dosage || item.amount || null;
                  const benefit = item.benefit || item.importance || item.reason || null;
                  const source = item.source || item.timing || null;

                  return (
                    <div 
                      key={idx} 
                      className="bg-[var(--color-bg)] p-3 rounded-2xl text-xs border border-[var(--color-border)]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[var(--color-text)] text-sm">
                          {name}
                        </span>
                        {quantity && (
                          <span className="font-display font-black text-[11px] px-2 py-0.5 rounded-lg bg-brand-500 text-white shadow-xs shrink-0">
                            {quantity}
                          </span>
                        )}
                      </div>

                      {source && (
                        <div className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                          <span className="font-semibold text-gray-500">Source / Timing:</span> {source}
                        </div>
                      )}

                      {benefit && (
                        <p className="text-[11px] text-[var(--color-text-secondary)] mt-1.5 pt-1.5 border-t border-[var(--color-border)]/60 italic flex items-start gap-1">
                          <CheckCircle size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
