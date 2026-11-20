import React, { useState } from 'react';
import { usePets } from '../../contexts/PetContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Pill, Plus, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function MedicationReminders() {
  const { activePet, activePetId, addMedication, removeMedication } = usePets();
  const { addReminder, requestPermission, permission } = useNotifications();
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [times, setTimes] = useState('08:00');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');

  const medications = activePet?.medications || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !dosage) return;

    if (permission !== 'granted') {
      await requestPermission();
    }
    
    const medId = Date.now().toString();
    addMedication(activePetId, {
      id: medId,
      name,
      dosage,
      frequency,
      times: times.split(',').map(t => t.trim()),
      startDate,
      notes,
      active: true
    });

    addReminder({
      title: `Medication Time: ${name}`,
      body: `Time to give ${activePet.name} their ${dosage} of ${name}`,
      time: times.split(',')[0].trim(),
      type: 'medication',
      relatedId: medId
    });
    
    setName('');
    setDosage('');
    setTimes('08:00');
    setNotes('');
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Medications & Supplements 💊</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Med
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Medication Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dosage</label>
              <input type="text" value={dosage} onChange={e => setDosage(e.target.value)} className="input-field" placeholder="e.g. 1 tablet, 5ml" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)} className="input-field">
                <option value="daily">Daily</option>
                <option value="twice_daily">Twice Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as_needed">As Needed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time(s) (comma separated)</label>
              <input type="text" value={times} onChange={e => setTimes(e.target.value)} className="input-field" placeholder="e.g. 08:00, 20:00" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Notes / Instructions</label>
              <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="input-field" placeholder="e.g. Give with food" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary">Save Medication</button>
          </div>
        </form>
      )}

      {medications.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] border-dashed">
          <Pill className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-3 opacity-50" />
          <p className="text-[var(--color-text-secondary)]">No active medications.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map(med => (
            <div key={med.id} className={`bg-[var(--color-bg)] p-4 rounded-xl border ${med.active !== false ? 'border-[var(--color-border)]' : 'border-dashed border-[var(--color-border)] opacity-60'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Pill className={`w-5 h-5 ${med.active !== false ? 'text-brand-500' : 'text-gray-400'}`} />
                  <h4 className="font-semibold text-lg">{med.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{med.dosage}</span>
                  <button onClick={() => removeMedication(activePetId, med.id)} className="text-red-500 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1 mb-2">
                <Clock className="w-4 h-4" /> {med.frequency.replace('_', ' ')} at {Array.isArray(med.times) ? med.times.join(', ') : med.times}
              </p>
              {med.notes && (
                <p className="text-sm italic text-[var(--color-text-secondary)] bg-[var(--color-surface)] p-2 rounded-lg mt-2">
                  {med.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
