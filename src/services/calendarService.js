import { format } from 'date-fns';

function formatICSDate(date) {
  const d = new Date(date);
  return format(d, "yyyyMMdd'T'HHmmss");
}

function escapeICS(str) {
  return str.replace(/[\\;,\n]/g, (match) => {
    if (match === '\n') return '\\n';
    return '\\' + match;
  });
}

export const calendarService = {
  generateICS(events) {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Paltoo//Pet Care//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    events.forEach(event => {
      lines.push('BEGIN:VEVENT');
      lines.push(`DTSTART:${formatICSDate(event.start)}`);
      lines.push(`DTEND:${formatICSDate(event.end)}`);
      lines.push(`SUMMARY:${escapeICS(event.title)}`);
      if (event.description) lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
      if (event.location) lines.push(`LOCATION:${escapeICS(event.location)}`);
      if (event.reminder) {
        lines.push('BEGIN:VALARM');
        lines.push('TRIGGER:-PT15M');
        lines.push('ACTION:DISPLAY');
        lines.push(`DESCRIPTION:${escapeICS(event.title)}`);
        lines.push('END:VALARM');
      }
      lines.push(`UID:${Date.now()}-${Math.random().toString(36).slice(2)}@paltoo.app`);
      lines.push(`DTSTAMP:${formatICSDate(new Date())}`);
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  },

  downloadICS(events, filename = 'paltoo-plan.ics') {
    const icsContent = this.generateICS(events);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  getGoogleCalendarUrl(event) {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatICSDate(event.start)}/${formatICSDate(event.end)}`,
      details: event.description || '',
      location: event.location || '',
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  },

  generateDietPlanEvents(dietPlan, petName, startDate = new Date()) {
    const events = [];
    if (!dietPlan?.meals) return events;

    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);

      dietPlan.meals.forEach((meal, i) => {
        const hours = (meal.time || '').toLowerCase().includes('morning') || (meal.time || '').includes('08') ? 8 :
                      (meal.time || '').toLowerCase().includes('afternoon') || (meal.time || '').includes('13') || (meal.time || '').includes('01') ? 13 : 19;
        const start = new Date(date);
        start.setHours(hours, 0, 0, 0);
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + 30);

        const items = meal.items || meal.foods || [];
        const foodList = items.map(f => `${f.name || f.food} (${f.quantity || f.amount || 'portion'})`).join(', ') || '';
        const titleName = meal.name || `${meal.time || 'Daily'} Meal`;

        events.push({
          title: `🐾 ${petName} - ${titleName}`,
          start,
          end,
          description: `Meal for ${petName}:\n${foodList}\nCalories: ${meal.calories || 'N/A'}${meal.notes ? `\nVet Note: ${meal.notes}` : ''}`,
          reminder: true,
        });
      });
    }

    return events;
  },

  generateAppointmentEvent(appointment, petName) {
    const start = new Date(appointment.date);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    return {
      title: `🏥 ${petName} - Vet: ${appointment.reason || 'Check-up'}`,
      start,
      end,
      description: `Vet appointment for ${petName}\nVet: ${appointment.vetName || 'N/A'}\nNotes: ${appointment.notes || ''}`,
      location: appointment.clinicName || '',
      reminder: true,
    };
  },
};
