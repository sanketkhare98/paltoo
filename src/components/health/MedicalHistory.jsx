import React, { useState } from 'react';
import { usePets } from '../../contexts/PetContext';
import { FileText, Plus, Stethoscope, Activity, Scissors, Beaker, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

const TYPE_CONFIG = {
  visit: { icon: Stethoscope, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  surgery: { icon: Scissors, color: 'text-red-500', bg: 'bg-red-500/10' },
  illness: { icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  test: { icon: Beaker, color: 'text-purple-500', bg: 'bg-purple-500/10' },
};

export default function MedicalHistory() {
  const { activePet, activePetId, addMedicalRecord } = usePets();
  const [showForm, setShowForm] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const [type, setType] = useState('visit');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [vetName, setVetName] = useState('');
  const [description, setDescription] = useState('');

  const records = activePet?.medicalHistory || [];
  const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) return;
    
    addMedicalRecord(activePetId, {
      id: Date.now().toString(),
      type,
      title,
      date,
      vetName,
      description
    });
    
    setTitle('');
    setDescription('');
    setVetName('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setShowForm(false);
  };

  const toggleExpand = (id) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Medical History 📋</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Record Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="input-field">
                <option value="visit">Vet Visit</option>
                <option value="illness">Illness / Injury</option>
                <option value="surgery">Surgery</option>
                <option value="test">Lab Test</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input-field" required placeholder="e.g. Annual Checkup" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Vet / Clinic</label>
              <input type="text" value={vetName} onChange={e => setVetName(e.target.value)} className="input-field" placeholder="Optional" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Details / Notes</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-field min-h-[100px]" placeholder="Add description..."></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      )}

      {sortedRecords.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] border-dashed">
          <FileText className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-3 opacity-50" />
          <p className="text-[var(--color-text-secondary)]">No medical records found.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-[var(--color-border)] ml-3 space-y-6 pb-4 mt-8">
          {sortedRecords.map((record) => {
            const config = TYPE_CONFIG[record.type] || TYPE_CONFIG.visit;
            const Icon = config.icon;
            const isExpanded = expandedIds.has(record.id);

            return (
              <div key={record.id} className="relative pl-6">
                <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full ${config.bg} flex items-center justify-center border-4 border-[var(--color-surface)]`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                
                <div className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)]">
                  <div className="flex justify-between items-start gap-4 cursor-pointer" onClick={() => toggleExpand(record.id)}>
                    <div>
                      <h4 className="font-semibold text-lg">{record.title}</h4>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">{format(new Date(record.date), 'MMMM d, yyyy')}</p>
                    </div>
                    {record.description && (
                      <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                  
                  {record.vetName && (
                    <p className="text-sm text-[var(--color-text)] mt-2 font-medium">Vet: {record.vetName}</p>
                  )}
                  
                  {isExpanded && record.description && (
                    <div className="mt-3 pt-3 border-t border-[var(--color-border)] text-sm whitespace-pre-wrap text-[var(--color-text-secondary)]">
                      {record.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
