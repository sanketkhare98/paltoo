import React from 'react';
import { usePets } from '../../contexts/PetContext';
import { format } from 'date-fns';
import { CheckCircle2, Circle, ListChecks } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const DEFAULT_TASKS = [
  { id: 'morning_walk', label: 'Morning walk 🏃' },
  { id: 'breakfast', label: 'Breakfast 🍽️' },
  { id: 'water', label: 'Fresh water refill 💧' },
  { id: 'meds', label: 'Medication / Supplements 💊' },
  { id: 'evening_walk', label: 'Evening walk & play 🌅' },
  { id: 'dinner', label: 'Dinner 🥘' },
  { id: 'grooming', label: 'Coat brushing / grooming 🪮' },
  { id: 'bedtime', label: 'Bedtime comfort check 🌙' }
];

export default function DailyChecklist() {
  const { activePet, activePetId, toggleChecklistItem } = usePets();
  
  if (!activePet) return null;

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  // Support both object { [taskId]: boolean } and array [taskId] structures
  const rawChecklist = activePet.dailyChecklist?.[todayStr] || activePet.checklist?.[todayStr] || {};
  
  const isTaskCompleted = (taskId) => {
    if (Array.isArray(rawChecklist)) {
      return rawChecklist.includes(taskId);
    }
    return !!rawChecklist[taskId];
  };

  const handleToggle = (taskId) => {
    toggleChecklistItem(activePetId, todayStr, taskId);
  };

  const completedCount = DEFAULT_TASKS.filter(task => isTaskCompleted(task.id)).length;
  const progressPercent = Math.round((completedCount / DEFAULT_TASKS.length) * 100);
  const isAllDone = completedCount === DEFAULT_TASKS.length;

  return (
    <div className="glass-card p-6 rounded-3xl border border-[var(--color-border)] shadow-sm">
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center">
              <ListChecks size={18} />
            </div>
            <h3 className="text-base font-display font-bold text-[var(--color-text)]">
              Daily Care Routine ✅
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] font-medium">
            {format(new Date(), 'EEEE, MMMM do')}
          </p>
        </div>

        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2.5 py-1 rounded-full">
          {completedCount}/{DEFAULT_TASKS.length} Done ({progressPercent}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mb-5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-brand-500 to-orange-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        {DEFAULT_TASKS.map((task) => {
          const completed = isTaskCompleted(task.id);
          return (
            <button 
              key={task.id}
              type="button"
              onClick={() => handleToggle(task.id)}
              className={classNames(
                "w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 border text-left active:scale-[0.99]",
                completed 
                  ? "bg-brand-50/60 dark:bg-brand-900/15 border-brand-200 dark:border-brand-800/60 text-[var(--color-text-secondary)]" 
                  : "bg-[var(--color-surface)] border-gray-100 dark:border-gray-800 hover:border-brand-200 text-[var(--color-text)] hover:bg-brand-50/30"
              )}
            >
              <div className="flex items-center gap-3">
                {completed ? (
                  <CheckCircle2 className="text-brand-500 shrink-0 animate-scale-in" size={19} />
                ) : (
                  <Circle className="text-gray-300 dark:text-gray-600 shrink-0 hover:text-brand-400" size={19} />
                )}
                <span className={classNames(
                  "text-xs sm:text-sm font-medium transition-all",
                  completed ? "line-through opacity-70" : ""
                )}>
                  {task.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {isAllDone && (
        <div className="mt-5 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 rounded-2xl text-center text-xs font-bold animate-slide-up flex items-center justify-center gap-2">
          <span>🎉 All routines checked for today! Outstanding pet parenting!</span>
        </div>
      )}
    </div>
  );
}
