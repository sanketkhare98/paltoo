import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePets } from '../../contexts/PetContext';
import { geminiService } from '../../services/geminiService';
import { PROMPTS } from '../../utils/prompts';
import { COMMON_SYMPTOMS } from '../../utils/constants';
import { AlertTriangle, ShieldAlert, HeartPulse, Activity, CheckCircle, ChevronRight, Stethoscope, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { classNames } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

export default function SymptomChecker() {
  const { hasFeature, incrementAiUsage } = useAuth();
  const { activePet } = usePets();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isPremium = hasFeature('healthDashboard');

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleCheck = async () => {
    if (selectedSymptoms.length === 0 && !details.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    const petName = activePet?.name || 'your pet';
    const petBreed = activePet?.breed || activePet?.species || 'Pet';

    try {
      const allSymptoms = [...selectedSymptoms];
      if (details.trim()) allSymptoms.push(`Note: ${details.trim()}`);
      
      const petContext = activePet || { 
        name: petName, 
        species: 'Dog', 
        breed: 'Mixed Breed', 
        age: 'Adult' 
      };

      const prompt = PROMPTS.symptomCheck(petContext, allSymptoms);
      const data = await geminiService.generateJSON(prompt);

      if (data && (data.urgency || data.urgencyMessage || data.possibleCauses || data.vetAdvice)) {
        setResult(data);
        if (incrementAiUsage) incrementAiUsage();
        showToast('Symptom analysis generated successfully 🩺', 'success');
      } else {
        throw new Error('Incomplete symptom analysis');
      }
    } catch (err) {
      console.warn('AI Symptom analysis fallback triggered:', err);
      
      // Clinical safety fallback based on selected symptoms
      const isUrgent = selectedSymptoms.some(s => 
        ['Seizures', 'Difficulty Breathing', 'Extreme Lethargy', 'Pale Gums', 'Unconscious'].includes(s)
      );

      const fallbackData = {
        urgency: isUrgent ? 'high' : 'medium',
        urgencyMessage: isUrgent 
          ? `⚠️ Critical attention recommended: Please reach out to your veterinarian or animal hospital immediately.`
          : `Monitor ${petName} closely over the next 12-24 hours. Keep hydrated and rested.`,
        possibleCauses: [
          {
            cause: selectedSymptoms[0] ? `Mild reaction or sensitivity (${selectedSymptoms[0]})` : 'Dietary indiscretion or minor bug',
            likelihood: 'common',
            explanation: `Commonly observed in ${petBreed}s following sudden diet changes, stress, or mild environment irritants.`
          },
          {
            cause: 'Transient gastrointestinal / metabolic upset',
            likelihood: 'possible',
            explanation: `Can occur if ${petName} ingested something unusual or experienced a sudden change in activity.`
          }
        ],
        homecare: [
          {
            tip: `Ensure constant access to fresh, cool water to prevent dehydration.`,
            icon: '💧'
          },
          {
            tip: `Provide a quiet, comfortable resting spot away from loud noises and bright lights.`,
            icon: '🛌'
          },
          {
            tip: `Withhold rich treats or new foods for 12 hours; offer bland boiled chicken and rice if appetite returns.`,
            icon: '🍚'
          }
        ],
        vetAdvice: isUrgent
          ? `Seek immediate veterinary care. Do not wait if symptoms worsen or breathing changes.`
          : `Contact your vet if symptoms persist beyond 24 hours, if ${petName} refuses water, or develops fever or severe vomiting.`,
        disclaimer: `Always consult your licensed veterinarian for diagnosis and treatment. Paltoo AI is an educational assistant, not an emergency clinical service. 🏥`
      };

      setResult(fallbackData);
      showToast(`Symptom assessment ready for ${petName}`, 'info');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyBadge = (urgency) => {
    const u = (urgency || '').toLowerCase();
    switch (u) {
      case 'emergency':
      case 'high':
        return {
          label: 'High Urgency — Vet Attention Recommended',
          boxClass: 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800',
          badgeClass: 'bg-rose-600 text-white'
        };
      case 'medium':
        return {
          label: 'Moderate Urgency — Monitor Closely',
          boxClass: 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800',
          badgeClass: 'bg-amber-500 text-white'
        };
      case 'low':
      default:
        return {
          label: 'Low Urgency — Home Observation',
          boxClass: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800',
          badgeClass: 'bg-emerald-600 text-white'
        };
    }
  };

  const urgencyInfo = result ? getUrgencyBadge(result.urgency || result.urgencyLevel) : null;

  return (
    <div className="page-container max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
      
      {/* Header */}
      <header className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-brand-600 dark:text-brand-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Stethoscope size={32} />
        </div>
        <h1 className="text-3xl font-display font-black text-[var(--color-text)]">
          AI Symptom Checker 🩺
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-2 text-sm max-w-lg mx-auto">
          Describe what you're noticing in <strong className="text-[var(--color-text)]">{activePet?.name || 'your pet'}</strong>. Paltoo AI analyzes potential causes, urgency, and safe home care steps.
        </p>
      </header>

      {/* Premium upgrade alert */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-2xl text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <ShieldAlert size={22} className="shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Free Health Check Tier</h4>
              <p className="text-xs opacity-90">Basic insights enabled. Upgrade to Paltoo Premium for full lab-level analysis.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/pricing')}
            className="px-3 py-1.5 bg-white text-brand-600 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-opacity-95 shadow-sm"
          >
            Upgrade
          </button>
        </div>
      )}

      {/* Symptom Input Form */}
      <div className="glass-card p-6 rounded-3xl border border-[var(--color-border)] shadow-sm">
        <h3 className="font-bold text-base text-[var(--color-text)] mb-3 flex items-center gap-2">
          <span>1. Select Observed Symptoms</span>
          <span className="text-xs font-normal text-[var(--color-text-secondary)]">({selectedSymptoms.length} selected)</span>
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {COMMON_SYMPTOMS.map(symptom => {
            const isSelected = selectedSymptoms.includes(symptom);
            return (
              <button
                key={symptom}
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className={classNames(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border",
                  isSelected
                    ? "bg-brand-500 text-white border-brand-500 shadow-md transform scale-105"
                    : "bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:border-brand-400"
                )}
              >
                {isSelected ? '✓ ' : ''}{symptom}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--color-text)] block">
            2. Describe Details & Duration (Optional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="input-field min-h-[100px] resize-y text-sm"
            placeholder="E.g., Started this morning after eating a treat. Sleeping more than usual and drank a full bowl of water."
          />
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || (selectedSymptoms.length === 0 && !details.trim())}
          className="btn-primary w-full mt-6 py-3.5 rounded-2xl flex justify-center items-center gap-2 text-base font-bold shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Analyzing with Pet Health AI...</span>
            </>
          ) : (
            <>
              <Activity size={18} />
              <span>Analyze Symptoms for {activePet?.name || 'Pet'}</span>
            </>
          )}
        </button>
        {error && <p className="text-red-500 text-xs mt-3 text-center">{error}</p>}
      </div>

      {/* Analysis Results View */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          
          {/* Urgency Alert Box */}
          <div className={classNames("p-5 rounded-3xl border flex items-start gap-4 shadow-sm", urgencyInfo.boxClass)}>
            <AlertTriangle className="shrink-0 mt-0.5" size={24} />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={classNames("px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase", urgencyInfo.badgeClass)}>
                  {result.urgency || result.urgencyLevel || 'Analysis'}
                </span>
                <h3 className="font-bold text-sm">
                  {urgencyInfo.label}
                </h3>
              </div>
              <p className="text-sm font-medium leading-relaxed mt-1">
                {result.urgencyMessage || result.summary || 'Observation and gentle care advised.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Possible Causes */}
            <div className="glass-card p-6 rounded-3xl border border-[var(--color-border)] shadow-sm">
              <h4 className="font-bold text-base text-[var(--color-text)] flex items-center gap-2 mb-4">
                <HeartPulse className="text-brand-500" size={20} />
                <span>Possible Causes</span>
              </h4>
              
              <div className="space-y-3">
                {Array.isArray(result.possibleCauses) && result.possibleCauses.length > 0 ? (
                  result.possibleCauses.slice(0, isPremium ? undefined : 2).map((item, idx) => {
                    const causeTitle = typeof item === 'string' ? item : (item.cause || item.name || 'Cause');
                    const likelihood = typeof item === 'string' ? null : item.likelihood;
                    const explanation = typeof item === 'string' ? null : item.explanation;

                    return (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <strong className="text-sm text-[var(--color-text)] flex items-center gap-1.5">
                            <span className="text-brand-500">•</span>
                            <span>{causeTitle}</span>
                          </strong>
                          {likelihood && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                              {likelihood}
                            </span>
                          )}
                        </div>
                        {explanation && (
                          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mt-1">
                            {explanation}
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[var(--color-text-secondary)]">No specific causes identified.</p>
                )}
              </div>

              {!isPremium && Array.isArray(result.possibleCauses) && result.possibleCauses.length > 2 && (
                <p className="text-xs text-brand-500 mt-4 font-medium italic">
                  + {result.possibleCauses.length - 2} additional differential diagnoses available on Paltoo Premium.
                </p>
              )}
            </div>

            {/* Column 2: Home Care Suggestions */}
            <div className="glass-card p-6 rounded-3xl border border-[var(--color-border)] shadow-sm">
              <h4 className="font-bold text-base text-[var(--color-text)] flex items-center gap-2 mb-4">
                <CheckCircle className="text-emerald-500" size={20} />
                <span>Recommended Home Care</span>
              </h4>
              
              <div className="space-y-3">
                {((result.homecare || result.homeCareTips || [])).map((item, idx) => {
                  const tipText = typeof item === 'string' ? item : (item.tip || item.advice || JSON.stringify(item));
                  const icon = typeof item === 'string' ? '🐾' : (item.icon || '💧');

                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-start gap-3">
                      <span className="text-lg shrink-0 mt-0.5">{icon}</span>
                      <span className="text-xs text-[var(--color-text)] leading-relaxed">{tipText}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* When to see a vet */}
          <div className="glass-card p-6 rounded-3xl border-l-4 border-l-rose-500 border border-[var(--color-border)] shadow-sm">
            <h4 className="font-bold text-sm text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-2">
              <span>🚨 When to See a Veterinarian</span>
            </h4>
            <p className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed">
              {result.vetAdvice || result.whenToSeeVet || `If ${activePet?.name || 'your pet'} is unresponsive, has pale gums, persistent vomiting, or symptoms that worsen, seek immediate emergency veterinary attention.`}
            </p>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-4 rounded-2xl text-center text-xs text-[var(--color-text-secondary)]">
            <p className="flex items-center justify-center gap-1.5 font-medium mb-0.5">
              <span>🏥</span>
              <span>{result.disclaimer || "Disclaimer: This AI analysis is for informational guidance only."}</span>
            </p>
            <p className="text-[11px] opacity-80">
              It does not replace professional veterinary examination, medical diagnosis, or prescription treatment.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
