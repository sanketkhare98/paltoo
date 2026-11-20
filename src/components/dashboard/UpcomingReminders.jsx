import React, { useState } from 'react';
import { usePets } from '../../contexts/PetContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { format, isToday, isAfter } from 'date-fns';
import { Calendar, Pill, Plus, Bell, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../utils/helpers';

export default function UpcomingReminders() {
  const { activePet } = usePets();
  const { reminders, addReminder, showToast } = useNotifications();
  const navigate = useNavigate();

  const [showQuickModal, setShowQuickModal] = useState(false);
  const [remTitle, setRemTitle] = useState('');
  const [remDate, setRemDate] = useState(new Date().toISOString().split('T')[0]);
  const [remTime, setRemTime] = useState('09:00');
  const [remType, setRemType] = useState('feeding');

  if (!activePet) return null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!remTitle.trim()) return;

    addReminder({
      title: remTitle.trim(),
      date: remDate,
      time: remTime,
      type: remType,
      petId: activePet.id,
      petName: activePet.name
    });

    showToast(`Added reminder for ${activePet.name}! ⏰`, 'success');
    setRemTitle('');
    setShowQuickModal(false);
  };

  // Combine vet appointments and medications and notifications
  const appointments = (activePet.vetAppointments || []).map(appt => ({
    type: 'appointment',
    id: appt.id,
    title: appt.reason || 'Vet Visit',
    date: appt.date,
    time: appt.time || '10:00 AM',
    icon: Calendar,
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30'
  }));

  const meds = (activePet.medications || []).map(med => ({
    type: 'medication',
    id: med.id,
    title: `${med.name} (${med.dosage || 'Dose'})`,
    date: med.startDate || new Date().toISOString().split('T')[0],
    time: med.frequency || 'Daily',
    icon: Pill,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30'
  }));

  const notifs = (reminders || [])
    .filter(r => !r.petId || r.petId === activePet.id)
    .map(r => ({
      type: 'reminder',
      id: r.id,
      title: r.title,
      date: r.date || new Date().toISOString().split('T')[0],
      time: r.time || 'All Day',
      icon: Bell,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30'
    }));

  const allItems = [...appointments, ...meds, ...notifs]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="glass-card p-6 rounded-3xl border border-[var(--color-border)] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
            <Clock size={18} />
          </div>
          <h3 className="text-base font-display font-bold text-[var(--color-text)]">
            Upcoming Schedule 📅
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button 
            type="button"
            onClick={() => setShowQuickModal(true)}
            className="p-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 dark:text-brand-400 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
            title="Add quick reminder"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/reminders')}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--color-text-secondary)] rounded-xl transition-colors text-xs"
            title="View all reminders"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {allItems.length === 0 ? (
        <div className="text-center py-7 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <Calendar className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-xs text-[var(--color-text-secondary)] mb-3">No upcoming reminders or vet visits.</p>
          <button 
            type="button"
            onClick={() => setShowQuickModal(true)} 
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            + Set a reminder
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {allItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={`${item.type}-${item.id}-${idx}`}
                className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-[var(--color-surface)] hover:border-brand-200 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[var(--color-text)]">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-2">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Reminder Modal */}
      {showQuickModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface)] rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[var(--color-border)] animate-scale-in">
            <h3 className="text-lg font-display font-bold text-[var(--color-text)] mb-1 flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-500" /> New Reminder for {activePet.name}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4">
              Get notified for feeding, meds, or vet visits.
            </p>

            <form onSubmit={handleQuickAdd} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                  Reminder Title
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Heartworm Chew, Evening Walk"
                  value={remTitle}
                  onChange={e => setRemTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                    Date
                  </label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={remDate}
                    onChange={e => setRemDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                    Time
                  </label>
                  <input 
                    type="time" 
                    className="input-field" 
                    value={remTime}
                    onChange={e => setRemTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                  Type
                </label>
                <select 
                  className="input-field"
                  value={remType}
                  onChange={e => setRemType(e.target.value)}
                >
                  <option value="feeding">Feeding / Meal 🍽️</option>
                  <option value="medication">Medication / Supplement 💊</option>
                  <option value="walk">Walk / Exercise 🏃</option>
                  <option value="vet">Vet Visit 🩺</option>
                  <option value="custom">Other Note 📝</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setShowQuickModal(false)}
                  className="btn-secondary py-2 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary py-2 px-5 text-xs font-bold"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
