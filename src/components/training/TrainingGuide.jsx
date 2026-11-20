import React, { useState } from 'react';
import { GraduationCap, Loader2, Target, Clock, AlertTriangle, CheckCircle, Sparkles, Award, Lightbulb, Compass } from 'lucide-react';
import { usePets } from '../../contexts/PetContext';
import { useAuth } from '../../contexts/AuthContext';
import { geminiService } from '../../services/geminiService';
import { PROMPTS } from '../../utils/prompts';
import { useNotifications } from '../../contexts/NotificationContext';

export default function TrainingGuide() {
  const { activePet } = usePets();
  const { canUseAi, incrementAiUsage } = useAuth();
  const { showToast } = useNotifications();
  
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState(null);
  const [expandedSection, setExpandedSection] = useState('focus');
  const [completedExercises, setCompletedExercises] = useState({});

  if (!activePet) {
    return (
      <div className="page-container p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-500 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl">
          🐾
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">No Active Pet Selected</h2>
        <p className="text-[var(--color-text-secondary)] text-sm">Please select or add a pet first to view personalized training guidance.</p>
      </div>
    );
  }

  const toggleExercise = (index) => {
    setCompletedExercises(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const generatePlan = async () => {
    if (!canUseAi()) {
      showToast('AI usage limit reached. Upgrade to Paltoo Premium for unlimited plans.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const prompt = PROMPTS.trainingGuide(activePet);
      const result = await geminiService.generateJSON(prompt);
      
      if (result && (result.currentStage || result.focusAreas || result.dailyExercises)) {
        setGuide(result);
        incrementAiUsage();
        showToast(`Personalized training plan ready for ${activePet.name}! 🎓`, 'success');
      } else {
        throw new Error('Incomplete plan returned');
      }
    } catch (err) {
      console.warn('AI Training Guide fallback engaged:', err);
      // High-quality pet-specific fallback plan
      const petName = activePet.name || 'your pet';
      const petBreed = activePet.breed || activePet.species || 'pet';
      const fallbackPlan = {
        currentStage: `${petName}'s ${activePet.lifeStage || 'Adult'} Foundation & Skill Mastery`,
        overview: `Comprehensive age-tailored training plan for ${petName} (${petBreed}). Focuses on positive reinforcement, daily consistency, and building strong recall and calm focus.`,
        focusAreas: [
          { area: "Reliable Recall & Name Recognition", priority: "high", tip: "Call ${petName} with enthusiastic tone and reward with high-value treats every time they turn to you! 🥩" },
          { area: "Doorway Manners & Impulse Control", priority: "high", tip: "Require a calm 'Sit' and 5 seconds of eye contact before opening exit doors. 🚪" },
          { area: "Loose Leash Walking", priority: "medium", tip: "Stop dead in your tracks whenever the leash gets taut. Move forward only when ${petName} looks back. 🦮" },
          { area: "Mental Stimulation & Scent Work", priority: "medium", tip: "Hide 5 treats around the room for a sniffing search game to tire out the mind. 🧠" }
        ],
        dailyExercises: [
          { exercise: "Recall Drill ('Come')", duration: "5-10 mins", instructions: "Call name from 15 feet away with arms open. Reward enthusiastically upon arrival.", emoji: "🏃" },
          { exercise: "Sit-Stay with Distractions", duration: "5 mins", instructions: "Ask for a sit, step back 3 paces, wait 5 seconds, return and give praise.", emoji: "🪑" },
          { exercise: "Gentle Leash Heel Walk", duration: "10 mins", instructions: "Walk in figure-eight patterns in driveway or backyard with treats at hip level.", emoji: "🐾" },
          { exercise: "Quiet Settle on Mat", duration: "5 mins", instructions: "Guide to bed or mat with a chew stick. Reward quiet resting behavior.", emoji: "🧘" }
        ],
        behavioralTips: [
          { behavior: "Jumping up to greet", advice: "Fold arms and turn back until all four paws touch the floor, then bend down to greet. 🙌" },
          { behavior: "Barking at outside noises", advice: "Acknowledge with a soft 'Thank you', then redirect to a puzzle toy or chew. 🔇" }
        ],
        milestones: [
          { milestone: "Instant response to name within 2 seconds", timeline: "Week 1" },
          { milestone: "Solid 30-second sit-stay with food on floor", timeline: "Week 2" },
          { milestone: "Loose-leash walking on quiet streets", timeline: "Week 3" },
          { milestone: "Calm greeting behavior with visitors", timeline: "Week 4" }
        ],
        doNots: [
          "Never yell or use physical reprimands — it breeds anxiety and mistrust ❌",
          "Don't repeat verbal cues multiple times; say it once and guide with a treat 🛑",
          "Avoid training when either you or your pet are stressed or tired 💤"
        ]
      };
      setGuide(fallbackPlan);
      showToast(`Training guide generated for ${activePet.name}! 🐾`, 'info');
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract safe string from any milestone value
  const getMilestoneText = (m) => {
    if (!m) return '';
    if (typeof m === 'string') return m;
    return m.milestone || m.title || m.name || JSON.stringify(m);
  };

  const getMilestoneTimeline = (m) => {
    if (!m || typeof m === 'string') return null;
    return m.timeline || m.time || m.target || null;
  };

  // Helper to extract safe string from any mistake/do-not value
  const getDoNotText = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.mistake || item.tip || item.text || item.advice || JSON.stringify(item);
  };

  return (
    <div className="page-container p-4 md:p-6 pb-24 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-[var(--color-text)] flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span>Training & Behavior Guide</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            Personalized curriculum for <strong className="text-[var(--color-text)]">{activePet.name}</strong> ({activePet.breed || activePet.species}, {activePet.lifeStage || 'Adult'}) 🎓
          </p>
        </div>

        <button 
          onClick={generatePlan} 
          disabled={loading}
          className="btn-primary py-2.5 px-6 rounded-2xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Crafting Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{guide ? 'Regenerate Plan' : 'Generate Training Plan'}</span>
            </>
          )}
        </button>
      </div>

      {/* Empty Initial State */}
      {!guide && !loading && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-3xl flex items-center justify-center mx-auto mb-5 text-4xl shadow-inner animate-paw-bounce">
            🎾
          </div>
          <h3 className="text-2xl font-display font-bold text-[var(--color-text)] mb-2">
            Ready to train {activePet.name}?
          </h3>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto text-sm leading-relaxed">
            Generate an AI-powered, breed-appropriate training plan specifically calibrated for {activePet.name}'s age, temperament, and learning curve.
          </p>
          <button 
            onClick={generatePlan} 
            className="btn-primary py-3.5 px-8 rounded-2xl text-base font-bold shadow-lg shadow-brand-500/25 inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Custom Plan Now</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-brand-100 dark:bg-brand-900/40 text-brand-500 flex items-center justify-center text-2xl animate-paw-bounce">
              🐾
            </div>
            <Loader2 className="w-20 h-20 text-brand-500 animate-spin absolute -inset-2" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">
              Consulting Paltoo's Dog Trainer AI...
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Building personalized exercises & milestones for {activePet.name}
            </p>
          </div>
        </div>
      )}

      {/* Training Plan Result */}
      {guide && !loading && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Stage Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-brand-500 to-orange-600 p-6 sm:p-7 rounded-3xl text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                Current Developmental Stage
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold mb-2">
                {guide.currentStage || guide.stage || `${activePet.name}'s Foundation Stage`}
              </h2>
              <p className="opacity-95 text-sm sm:text-base max-w-2xl leading-relaxed">
                {guide.overview || `Custom training roadmap designed to reinforce good habits, boost confidence, and stimulate ${activePet.name}'s mind.`}
              </p>
            </div>
            <div className="absolute right-4 -bottom-6 text-8xl opacity-15 pointer-events-none select-none">
              🎓
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            
            {/* Section 1: Key Focus Areas */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
              <button 
                className="w-full p-5 sm:p-6 flex items-center justify-between font-bold text-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                onClick={() => setExpandedSection(expandedSection === 'focus' ? '' : 'focus')}
              >
                <span className="flex items-center gap-3 text-[var(--color-text)]">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <span>Core Focus Areas ({guide.focusAreas?.length || 0})</span>
                </span>
                <span className="text-2xl text-[var(--color-text-secondary)] font-mono">
                  {expandedSection === 'focus' ? '−' : '+'}
                </span>
              </button>

              {expandedSection === 'focus' && (
                <div className="p-5 sm:p-6 pt-0 border-t border-[var(--color-border)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
                    {guide.focusAreas?.map((area, i) => {
                      const areaTitle = typeof area === 'string' ? area : (area.area || area.title || 'Training Priority');
                      const areaTip = typeof area === 'string' ? '' : (area.tip || area.description || '');
                      const priority = area.priority || 'high';

                      return (
                        <div key={i} className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <h4 className="font-bold text-sm text-[var(--color-text)] flex items-center gap-2">
                                <span>🎯</span>
                                <span>{areaTitle}</span>
                              </h4>
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                priority.toLowerCase() === 'high'
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                              }`}>
                                {priority}
                              </span>
                            </div>
                            {areaTip && (
                              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mt-1">
                                {areaTip}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Daily Exercises (Interactive) */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
              <button 
                className="w-full p-5 sm:p-6 flex items-center justify-between font-bold text-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                onClick={() => setExpandedSection(expandedSection === 'routine' ? '' : 'routine')}
              >
                <span className="flex items-center gap-3 text-[var(--color-text)]">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span>Daily Exercises & Training Drills</span>
                </span>
                <span className="text-2xl text-[var(--color-text-secondary)] font-mono">
                  {expandedSection === 'routine' ? '−' : '+'}
                </span>
              </button>

              {expandedSection === 'routine' && (
                <div className="p-5 sm:p-6 pt-0 border-t border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-secondary)] mt-3 mb-4">
                    Keep sessions short, sweet, and fun! Mark off drills as you complete them with {activePet.name}:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(guide.dailyExercises || guide.exercises || []).map((ex, i) => {
                      const exName = typeof ex === 'string' ? ex : (ex.exercise || ex.name || 'Exercise');
                      const exDuration = typeof ex === 'string' ? '5-10m' : (ex.duration || '5-10 mins');
                      const exInstructions = typeof ex === 'string' ? '' : (ex.instructions || ex.description || '');
                      const exEmoji = ex.emoji || '🎾';
                      const isDone = completedExercises[i];

                      return (
                        <div 
                          key={i} 
                          onClick={() => toggleExercise(i)}
                          className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                            isDone 
                              ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800' 
                              : 'bg-[var(--color-bg)] border-[var(--color-border)] hover:border-brand-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{exEmoji}</span>
                                <h4 className={`font-bold text-sm ${isDone ? 'line-through text-emerald-700 dark:text-emerald-300' : 'text-[var(--color-text)]'}`}>
                                  {exName}
                                </h4>
                              </div>
                              <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full shrink-0">
                                {exDuration}
                              </span>
                            </div>

                            {exInstructions && (
                              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                {exInstructions}
                              </p>
                            )}
                          </div>

                          <div className="mt-3 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
                            <span className={isDone ? 'text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1' : 'text-gray-400'}>
                              {isDone ? '✓ Completed today' : 'Tap to mark done'}
                            </span>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              isDone ? 'bg-emerald-500 text-white border-emerald-500' : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {isDone && <CheckCircle className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Behavioral Guidance & Tips */}
            {Array.isArray(guide.behavioralTips) && guide.behavioralTips.length > 0 && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[var(--color-text)]">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>Behavioral Tips & Troubleshooting</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {guide.behavioralTips.map((tip, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                      <strong className="block text-sm text-[var(--color-text)] mb-1">
                        💡 {typeof tip === 'string' ? tip : tip.behavior}
                      </strong>
                      {typeof tip !== 'string' && tip.advice && (
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                          {tip.advice}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Milestones & Common Mistakes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Milestones */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[var(--color-text)]">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span>Target Milestones</span>
                </h3>
                <div className="space-y-2.5">
                  {(guide.milestones || []).map((m, i) => {
                    const text = getMilestoneText(m);
                    const timeline = getMilestoneTimeline(m);

                    return (
                      <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                        <div className="flex items-start gap-2.5 text-xs text-[var(--color-text)] leading-relaxed">
                          <span className="text-purple-500 mt-0.5">⭐</span>
                          <span>{text}</span>
                        </div>
                        {timeline && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full shrink-0">
                            {timeline}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Common Mistakes to Avoid */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[var(--color-text)]">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <span>Mistakes to Avoid</span>
                </h3>
                <div className="space-y-2.5">
                  {(guide.doNots || guide.mistakesToAvoid || []).map((m, i) => {
                    const text = getDoNotText(m);

                    return (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40 text-xs text-[var(--color-text)] leading-relaxed">
                        <span className="text-rose-500 mt-0.5 shrink-0">❌</span>
                        <span>{text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
