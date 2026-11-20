import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MealSchedule({ meals }) {
  const [expandedIndices, setExpandedIndices] = useState([0, 1, 2]); // Expand all meals by default for easy scanning

  if (!meals || meals.length === 0) {
    return (
      <div className="p-6 text-center bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
        <p className="text-sm text-[var(--color-text-secondary)]">No meals defined in diet plan.</p>
      </div>
    );
  }

  // Determine current upcoming meal based on time of day
  const currentHour = new Date().getHours();
  let suggestedIndex = 0;
  if (currentHour >= 11 && currentHour < 16) suggestedIndex = 1;
  else if (currentHour >= 16) suggestedIndex = meals.length > 2 ? 2 : 1;

  const toggleExpand = (idx) => {
    setExpandedIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const getCategoryBadge = (category, name = '') => {
    const cat = (category || '').toLowerCase();
    const n = (name || '').toLowerCase();

    if (cat.includes('protein') || n.includes('chicken') || n.includes('beef') || n.includes('turkey') || n.includes('lamb') || n.includes('fish') || n.includes('salmon') || n.includes('egg')) {
      return {
        label: 'Protein',
        emoji: '🥩',
        className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800'
      };
    }
    if (cat.includes('vitamin') || n.includes('vitamin') || n.includes('carrot') || n.includes('pumpkin') || n.includes('spinach') || n.includes('blueberry') || n.includes('apple') || n.includes('greens')) {
      return {
        label: 'Vitamins',
        emoji: '🍊',
        className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800'
      };
    }
    if (cat.includes('supplement') || n.includes('supplement') || n.includes('probiotic') || n.includes('glucosamine') || n.includes('omega') || n.includes('chondroitin') || n.includes('enzyme') || n.includes('chew') || n.includes('powder')) {
      return {
        label: 'Supplement',
        emoji: '💊',
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      };
    }
    if (cat.includes('mineral') || n.includes('calcium') || n.includes('zinc') || n.includes('iron') || n.includes('phosphorus') || n.includes('bone')) {
      return {
        label: 'Minerals',
        emoji: '⚡',
        className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      };
    }
    if (cat.includes('fat') || cat.includes('oil') || n.includes('oil') || n.includes('flaxseed')) {
      return {
        label: 'Healthy Fats',
        emoji: '🥑',
        className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      };
    }

    return {
      label: category || 'Nutrient',
      emoji: '🥗',
      className: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 border-brand-200 dark:border-brand-800'
    };
  };

  return (
    <div className="space-y-6">
      {meals.map((meal, idx) => {
        const isExpanded = expandedIndices.includes(idx);
        const isSuggested = suggestedIndex === idx;
        const items = meal.items || meal.foods || [];
        const mealTitle = meal.name || (meal.time ? `${meal.time} Meal` : `Meal ${idx + 1}`);

        return (
          <div 
            key={idx} 
            className={`bg-[var(--color-surface)] rounded-3xl border transition-all duration-300 shadow-sm overflow-hidden ${
              isSuggested 
                ? 'border-brand-400 ring-2 ring-brand-400/20 shadow-md shadow-brand-500/10' 
                : 'border-[var(--color-border)] hover:border-brand-300'
            }`}
          >
            {/* Meal Header */}
            <div 
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
              onClick={() => toggleExpand(idx)}
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                  isSuggested 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-brand-500/30' 
                    : 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                }`}>
                  {idx === 0 ? '🌅' : idx === 1 ? '☀️' : '🌙'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display font-bold text-lg sm:text-xl text-[var(--color-text)]">
                      {mealTitle}
                    </h4>
                    {isSuggested && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-brand-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                        Next Up
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] mt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-500" />
                      <span>{meal.time || 'Schedule time'}</span>
                    </span>
                    <span>•</span>
                    <span>{items.length} prescribed items</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border)]">
                {meal.calories && (
                  <div className="text-right">
                    <span className="font-display font-extrabold text-base text-brand-600 dark:text-brand-400">
                      {meal.calories}
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)] ml-1">kcal</span>
                  </div>
                )}
                <div className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--color-text-secondary)] transition-colors">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {/* Meal Items: Proteins, Vitamins, Minerals, Supplements */}
            {isExpanded && (
              <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[var(--color-border)] bg-gray-50/40 dark:bg-gray-900/20">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3 flex items-center justify-between">
                  <span>Prescribed Nutrients & Portion Quantities:</span>
                  <span className="text-[11px] font-normal lowercase">proteins • vitamins • supplements</span>
                </div>

                {items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {items.map((item, i) => {
                      const itemName = item.name || item.food || (typeof item === 'string' ? item : 'Nutrient');
                      const itemQuantity = item.quantity || item.amount || item.dosage || 'Portion prescribed';
                      const itemBenefit = item.benefit || item.notes || item.importance || item.reason || '';
                      const badge = getCategoryBadge(item.category, itemName);

                      return (
                        <div 
                          key={i} 
                          className="bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border)] shadow-xs flex flex-col justify-between hover:border-brand-300 transition-colors"
                        >
                          <div>
                            {/* Top row: Category tag + Quantity Badge */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${badge.className}`}>
                                <span>{badge.emoji}</span>
                                <span>{badge.label}</span>
                              </span>
                              
                              {/* Quantity Badge */}
                              <span className="font-display font-black text-xs px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs shrink-0">
                                {itemQuantity}
                              </span>
                            </div>

                            {/* Food / Supplement Name */}
                            <h5 className="font-bold text-sm text-[var(--color-text)] leading-snug">
                              {itemName}
                            </h5>
                          </div>

                          {/* Nutritional Benefit */}
                          {itemBenefit && (
                            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mt-2 pt-2 border-t border-[var(--color-border)]/60 flex items-start gap-1.5">
                              <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                              <span>{itemBenefit}</span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--color-text-secondary)] italic p-3">
                    No specific ingredients listed.
                  </p>
                )}

                {/* Veterinary Preparation Notes */}
                {meal.notes && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                    <div>
                      <strong className="block font-bold mb-0.5">Vet Preparation Advice:</strong>
                      <p className="leading-relaxed opacity-90">{meal.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
