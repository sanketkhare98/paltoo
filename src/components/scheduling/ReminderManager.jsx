import React, { useState } from 'react';
import { Bell, Plus, Trash2, Power, PowerOff } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatTime } from '../../utils/helpers';

export default function ReminderManager() {
  const { permission, requestPermission, reminders, addReminder, removeReminder } = useNotifications();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    time: '',
    type: 'feeding'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.time) return;
    
    addReminder(formData);
    setFormData({ title: '', message: '', time: '', type: 'feeding' });
    setIsAdding(false);
  };

  const typeIcons = {
    feeding: '🥣',
    medication: '💊',
    vet: '🏥',
    custom: '📌'
  };

  return (
    <div className="page-container p-4 md:p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <Bell className="w-6 h-6 text-brand-500" /> Reminders
        </h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary flex items-center gap-1 py-2 px-4 rounded-full text-sm"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {permission !== 'granted' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
            <Bell className="w-5 h-5 shrink-0 mt-0.5" />
            <p>Enable browser notifications to receive alerts for your reminders.</p>
          </div>
          <button onClick={requestPermission} className="whitespace-nowrap px-4 py-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors">
            Enable Notifications
          </button>
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input type="text" className="input-field" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Evening Walk" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time (Daily) *</label>
              <input type="time" className="input-field" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="feeding">Feeding</option>
                <option value="medication">Medication</option>
                <option value="vet">Vet / Care</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <input type="text" className="input-field" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Optional detail" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsAdding(false)} className="btn-ghost px-4 py-2">Cancel</button>
            <button type="submit" className="btn-primary px-6 py-2">Save Reminder</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-[var(--color-surface)] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No reminders set. Add one to keep track of your pet's routine!</p>
          </div>
        ) : (
          reminders.map(reminder => (
            <div key={reminder.id} className="flex items-center justify-between p-4 bg-[var(--color-surface)] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="text-3xl bg-gray-50 dark:bg-gray-800 p-2 rounded-xl">
                  {typeIcons[reminder.type] || '📌'}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-text)]">{reminder.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-brand-600 dark:text-brand-400">{formatTime(reminder.time)}</span>
                    {reminder.message && <span>• {reminder.message}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => removeReminder(reminder.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
