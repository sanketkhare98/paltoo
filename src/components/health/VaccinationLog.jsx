import React, { useState } from 'react';
import { usePets } from '../../contexts/PetContext';
import { Syringe, Plus, Calendar, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { format, isBefore, addDays } from 'date-fns';

const COMMON_VACCINES = ['Rabies', 'DHPP', 'Bordetella', 'Leptospirosis', 'Lyme', 'Canine Influenza', 'FVRCP', 'FeLV'];

export default function VaccinationLog() {
  const { activePet, activePetId, addVaccination } = usePets();
  const [showForm, setShowForm] = useState(false);
  
  const [name, setName] = useState('');
  const [dateGiven, setDateGiven] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [nextDueDate, setNextDueDate] = useState('');
  const [vetName, setVetName] = useState('');
  const [notes, setNotes] = useState('');

  const vaccinations = activePet?.vaccinations || [];
  const sortedVax = [...vaccinations].sort((a, b) => new Date(b.dateGiven) - new Date(a.dateGiven));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !dateGiven) return;
    
    addVaccination(activePetId, {
      name,
      dateGiven,
      nextDueDate: nextDueDate || undefined,
      vetName,
      notes
    });
    
    setName('');
    setDateGiven(format(new Date(), 'yyyy-MM-dd'));
    setNextDueDate('');
    setVetName('');
    setNotes('');
    setShowForm(false);
  };

  const getStatus = (dueDate) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const warningDate = addDays(now, 30);
    
    if (isBefore(due, now)) {
      return { label: 'Overdue', color: 'bg-paw-500 text-white', icon: AlertCircle };
    } else if (isBefore(due, warningDate)) {
      return { label: 'Due soon', color: 'bg-yellow-500 text-white', icon: AlertTriangle };
    }
    return { label: 'Up to date', color: 'bg-forest-500 text-white', icon: ShieldCheck };
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Vaccination Record 💉</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vaccine Name</label>
              <input type="text" list="vaccines" value={name} onChange={e => setName(e.target.value)} className="input-field" required placeholder="e.g. Rabies" />
              <datalist id="vaccines">
                {COMMON_VACCINES.map(v => <option key={v} value={v} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vet / Clinic Name</label>
              <input type="text" value={vetName} onChange={e => setVetName(e.target.value)} className="input-field" placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date Given</label>
              <input type="date" value={dateGiven} onChange={e => setDateGiven(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Next Due Date</label>
              <input type="date" value={nextDueDate} onChange={e => setNextDueDate(e.target.value)} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Notes / Batch No.</label>
              <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="input-field" placeholder="Optional details" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary">Save Record</button>
          </div>
        </form>
      )}

      {sortedVax.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] border-dashed">
          <Syringe className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-3 opacity-50" />
          <p className="text-[var(--color-text-secondary)]">No vaccination records found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedVax.map((vax, idx) => {
            const status = getStatus(vax.nextDueDate);
            const StatusIcon = status?.icon;
            
            return (
              <div key={idx} className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)] flex flex-col md:flex-row gap-4 justify-between md:items-center">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-500 bg-opacity-10 rounded-lg text-brand-500 shrink-0 mt-1 md:mt-0">
                    <Syringe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{vax.name}</h4>
                    <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5" /> Given: {format(new Date(vax.dateGiven), 'MMM d, yyyy')}
                    </p>
                    {vax.vetName && <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Vet: {vax.vetName}</p>}
                    {vax.notes && <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 italic">{vax.notes}</p>}
                  </div>
                </div>
                {vax.nextDueDate && status && (
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" /> {status.label}
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Due: {format(new Date(vax.nextDueDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
