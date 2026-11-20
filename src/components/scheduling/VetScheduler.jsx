import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Trash2, Download } from 'lucide-react';
import { usePets } from '../../contexts/PetContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { calendarService } from '../../services/calendarService';
import { formatDate, formatTime } from '../../utils/helpers';

export default function VetScheduler() {
  const { activePet, addVetAppointment, removeVetAppointment } = usePets();
  const { hasFeature } = useAuth();
  const { showToast } = useNotifications();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    vetName: '',
    clinicName: '',
    reason: '',
    notes: ''
  });

  if (!activePet) {
    return <div className="p-8 text-center text-gray-500">Please select a pet first.</div>;
  }

  if (!hasFeature('vet_scheduling')) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-2xl m-6 border border-gray-200 dark:border-gray-800">
        <div className="text-4xl mb-4">💎</div>
        <h2 className="text-xl font-bold mb-2 text-[var(--color-text)]">Premium Feature</h2>
        <p className="text-gray-500 mb-4">Upgrade to Premium to manage vet appointments and calendar syncing.</p>
        <button className="btn-primary px-6 py-2">Upgrade Now</button>
      </div>
    );
  }

  const appointments = activePet.vetAppointments || [];
  
  const sortedAppointments = [...appointments].sort((a, b) => {
    return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.vetName) return;
    
    addVetAppointment({
      ...formData,
      id: Date.now().toString()
    });
    
    setFormData({ date: '', time: '', vetName: '', clinicName: '', reason: '', notes: '' });
    setIsAdding(false);
    showToast('Appointment scheduled! 📅');
  };

  const handleExport = (appt) => {
    const event = calendarService.generateAppointmentEvent(appt, activePet.name);
    calendarService.downloadICS([event], `vet_appointment_${activePet.name}.ics`);
    showToast('Calendar file downloaded!');
  };

  return (
    <div className="page-container p-4 md:p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-brand-500" /> Vet Appointments
        </h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary flex items-center gap-1 py-2 px-4 rounded-full text-sm"
        >
          <Plus className="w-4 h-4" /> Schedule
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 space-y-4 animate-fade-in">
          <h3 className="font-bold text-lg mb-2">New Appointment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <input type="date" className="input-field" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time *</label>
              <input type="time" className="input-field" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vet Name *</label>
              <input type="text" className="input-field" placeholder="Dr. Smith" required value={formData.vetName} onChange={e => setFormData({...formData, vetName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Clinic Name</label>
              <input type="text" className="input-field" placeholder="City Vet Clinic" value={formData.clinicName} onChange={e => setFormData({...formData, clinicName: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Reason</label>
              <input type="text" className="input-field" placeholder="Annual vaccination" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsAdding(false)} className="btn-ghost px-4 py-2">Cancel</button>
            <button type="submit" className="btn-primary px-6 py-2">Save</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-10 bg-[var(--color-surface)] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500">
            <div className="text-4xl mb-3">🏥</div>
            <p>No upcoming appointments.</p>
          </div>
        ) : (
          sortedAppointments.map(appt => {
            const isPast = new Date(`${appt.date}T${appt.time}`) < new Date();
            
            return (
              <div key={appt.id} className={`p-5 rounded-2xl border ${isPast ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75' : 'bg-[var(--color-surface)] border-brand-200 dark:border-brand-900/50 shadow-sm'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-[var(--color-text)]">{appt.reason || 'Vet Visit'}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-medium">
                        <CalendarIcon className="w-4 h-4" /> {formatDate(appt.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {formatTime(appt.time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {appt.clinicName || 'Clinic'} - {appt.vetName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleExport(appt)}
                      className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Export to Calendar"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => removeVetAppointment(appt.id)}
                      className="p-2 text-red-500 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
