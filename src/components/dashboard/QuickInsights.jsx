import React, { useState, useEffect, useCallback } from 'react';
import { usePets } from '../../contexts/PetContext';
import { geminiService } from '../../services/geminiService';
import { PROMPTS } from '../../utils/prompts';
import { Lightbulb, ChevronRight, ChevronLeft, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { classNames } from '../../utils/helpers';

export default function QuickInsights() {
  const { activePet, activePetId } = usePets();
  
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastFetchedPetId, setLastFetchedPetId] = useState(null);

  const generateInsights = useCallback(async () => {
    if (!activePet) return;
    
    setLoading(true);
    try {
      // Call PROMPTS.healthInsights as a function with activePet
      const prompt = PROMPTS.healthInsights(activePet);
      const data = await geminiService.generateJSON(prompt);
      
      const petName = activePet.name || 'Your pet';
      const petBreed = activePet.breed || activePet.species || 'pet';

      const items = [];

      // 1. Recommendations from AI
      if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        data.recommendations.forEach(r => {
          items.push({
            category: r.category || 'health',
            title: r.title || `Care for ${petName}`,
            detail: r.detail || r.recommendation || r.description || ''
          });
        });
      }

      // 2. Breed-specific risks from AI
      if (Array.isArray(data.breedRisks) && data.breedRisks.length > 0) {
        data.breedRisks.forEach(br => {
          items.push({
            category: 'breed',
            title: `${petBreed} Focus: ${br.condition || 'Health Check'}`,
            detail: br.prevention || br.advice || `Watch for ${br.condition} (${br.risk || 'moderate'} risk).`
          });
        });
      }

      // 3. Score explanation or seasonal tips
      if (data.scoreExplanation) {
        items.unshift({
          category: 'overview',
          title: `Health Score Status`,
          detail: data.scoreExplanation
        });
      }

      if (items.length > 0) {
        setInsights(items);
        setCurrentIndex(0);
      } else {
        // High quality pet-specific fallback
        setInsights([
          {
            category: 'diet',
            title: `Nutrition for ${petName}`,
            detail: `As a ${activePet.weight ? `${activePet.weight}kg ` : ''}${petBreed}, maintain measured daily portions with high quality protein to support joint and digestive health. 🥩`
          },
          {
            category: 'exercise',
            title: `Activity Routine`,
            detail: `Given ${petName}'s ${activePet.activityLevel || 'Moderate'} activity level, prioritize 30-45 minutes of daily structured play and walks. 🏃`
          },
          {
            category: 'health',
            title: `Wellness Check`,
            detail: `Keep up with seasonal flea/tick protection and maintain consistent grooming to prevent skin irritation. 🪮`
          }
        ]);
      }
      setLastFetchedPetId(activePetId);
    } catch (err) {
      console.warn('Could not generate dynamic insights, using tailored pet defaults:', err);
      const petName = activePet.name || 'Your pet';
      const petBreed = activePet.breed || activePet.species || 'pet';
      setInsights([
        {
          category: 'diet',
          title: `Portion Plan for ${petName}`,
          detail: `Tailored for a ${activePet.weight ? `${activePet.weight}kg ` : ''}${petBreed}. Ensure fresh water is always available and limit treats to 10% of daily calories. 🦴`
        },
        {
          category: 'exercise',
          title: `Daily Movement`,
          detail: `A consistent daily walk routine keeps ${petName}'s heart, joints, and mood in peak shape. 🐕`
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [activePet, activePetId]);

  useEffect(() => {
    if (activePet && activePetId !== lastFetchedPetId) {
      generateInsights();
    }
  }, [activePet, activePetId, lastFetchedPetId, generateInsights]);

  const nextInsight = () => {
    if (insights.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }
  };

  const prevInsight = () => {
    if (insights.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + insights.length) % insights.length);
    }
  };

  const categoryThemes = {
    diet: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800/60',
    exercise: 'bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-sky-950/20 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800/60',
    grooming: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/20 text-pink-900 dark:text-pink-200 border-pink-200 dark:border-pink-800/60',
    health: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/60',
    breed: 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/20 text-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800/60',
    overview: 'bg-gradient-to-br from-brand-50 to-amber-50 dark:from-brand-950/40 dark:to-amber-950/20 text-brand-900 dark:text-brand-200 border-brand-200 dark:border-brand-800/60',
  };

  const currentItem = insights[currentIndex];

  return (
    <div className="glass-card p-6 rounded-3xl h-full flex flex-col justify-between border border-[var(--color-border)] shadow-sm">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center">
            <Lightbulb size={18} />
          </div>
          <h3 className="text-base font-display font-bold text-[var(--color-text)]">
            AI Pet Insights 💡
          </h3>
        </div>

        <button 
          type="button"
          onClick={generateInsights}
          disabled={loading}
          className="p-1.5 hover:bg-brand-50 dark:hover:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-50"
          title="Regenerate insights with Gemini"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex-1 flex flex-col justify-center py-6 space-y-3">
          <div className="h-4 bg-brand-100 dark:bg-brand-900/30 rounded-full w-28 animate-pulse" />
          <div className="h-6 bg-brand-50 dark:bg-brand-900/20 rounded-xl w-3/4 animate-pulse" />
          <div className="h-16 bg-brand-50/50 dark:bg-brand-900/10 rounded-2xl w-full animate-pulse" />
          <div className="flex justify-center gap-1.5 pt-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      ) : currentItem ? (
        <div className="flex-1 flex flex-col justify-between">
          
          {/* Card */}
          <div className={classNames(
            "w-full p-5 rounded-2xl border transition-all duration-300 shadow-sm",
            categoryThemes[currentItem.category?.toLowerCase()] || categoryThemes.overview
          )}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/70 dark:bg-black/30 backdrop-blur-sm">
                {currentItem.category}
              </span>
              <span className="text-xs opacity-75 font-semibold">
                for {activePet?.name}
              </span>
            </div>

            <h4 className="font-bold text-sm mb-1.5">
              {currentItem.title}
            </h4>

            <p className="text-xs sm:text-sm leading-relaxed opacity-90">
              {currentItem.detail}
            </p>
          </div>

          {/* Carousel navigation & Dots */}
          <div className="flex items-center justify-between mt-4 pt-2">
            <button 
              type="button"
              onClick={prevInsight} 
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-[var(--color-text-secondary)] transition-colors"
              aria-label="Previous insight"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1.5">
              {insights.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={classNames(
                    "h-1.5 rounded-full transition-all duration-300",
                    idx === currentIndex ? "w-5 bg-brand-500" : "w-1.5 bg-gray-300 dark:bg-gray-700"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button 
              type="button"
              onClick={nextInsight} 
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-[var(--color-text-secondary)] transition-colors"
              aria-label="Next insight"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-[var(--color-text-secondary)] py-8 text-center">
          Click refresh to generate Gemini insights for {activePet.name}.
        </div>
      )}
    </div>
  );
}
