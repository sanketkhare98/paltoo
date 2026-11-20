import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { calendarService } from '../../services/calendarService';
import { Calendar, Download, ExternalLink, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CalendarExport({ dietPlan, petName }) {
  const { hasFeature } = useAuth();
  const { showToast } = useNotifications();

  const handleGoogleCalendar = () => {
    if (!dietPlan || !dietPlan.meals) return;
    
    const events = calendarService.generateDietPlanEvents(dietPlan, petName);
    if (events.length === 0) {
      showToast('No meals available to export.', 'error');
      return;
    }
    
    // Open Google Calendar link for the first meal as an example/quick add
    const url = calendarService.getGoogleCalendarUrl(events[0]);
    window.open(url, '_blank');
    
    // Suggest iCal for all meals
    if (events.length > 1) {
      showToast('Opened Google Calendar for the first meal. For all meals, download the iCal file.', 'info');
    }
  };

  const handleDownloadICS = () => {
    if (!dietPlan || !dietPlan.meals) return;
    
    const events = calendarService.generateDietPlanEvents(dietPlan, petName);
    if (events.length === 0) {
      showToast('No meals available to export.', 'error');
      return;
    }
    
    const success = calendarService.downloadICS(events, `${petName}_Diet_Plan`);
    if (success) {
      showToast('Calendar file downloaded! Open it to add to your calendar app.', 'success');
    } else {
      showToast('Failed to generate calendar file.', 'error');
    }
  };

  if (!hasFeature('calendar')) {
    return (
      <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--color-bg)] opacity-50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
          <Lock className="w-8 h-8 text-brand-500 mb-2" />
          <h4 className="font-bold text-lg mb-2">Unlock Calendar Sync</h4>
          <Link to="/settings" className="btn-primary text-sm py-1.5 px-4">Upgrade Plan</Link>
        </div>
        
        <div className="opacity-30 blur-sm pointer-events-none">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 justify-center">
            <Calendar className="w-5 h-5" /> Export Schedule
          </h3>
          <div className="flex justify-center gap-4">
             <button className="btn-secondary flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Google Calendar</button>
             <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" /> Download iCal</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-brand-500" /> Export Schedule
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Add this feeding schedule to your personal calendar app to never miss a meal time.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={handleGoogleCalendar}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-gray-50 border border-gray-200 font-medium py-2 px-4 rounded-xl transition-colors shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <ExternalLink className="w-4 h-4" /> Add to Google Calendar
        </button>
        <button 
          onClick={handleDownloadICS}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-medium py-2 px-4 rounded-xl transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Download .ics File
        </button>
      </div>
    </div>
  );
}
