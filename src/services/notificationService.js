export const notificationService = {
  async requestPermission() {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    return await Notification.requestPermission();
  },

  send(title, options = {}) {
    if (Notification.permission !== 'granted') return null;
    try {
      return new Notification(title, {
        icon: '/paltoo-logo.svg',
        badge: '/paltoo-logo.svg',
        vibrate: [200, 100, 200],
        ...options,
      });
    } catch {
      return null;
    }
  },

  scheduleMedicationReminder(medication, petName) {
    const times = medication.times || ['09:00'];
    return times.map(time => ({
      type: 'medication',
      title: `💊 ${petName} - ${medication.name}`,
      message: `Time for ${petName}'s ${medication.name} (${medication.dosage || ''})`,
      time,
      petName,
      medicationName: medication.name,
    }));
  },

  scheduleFeedingReminder(meal, petName) {
    return {
      type: 'feeding',
      title: `🍽️ ${petName} - ${meal.time} Meal`,
      message: `Time to feed ${petName}!`,
      time: meal.time === 'Morning' ? '08:00' : meal.time === 'Afternoon' ? '13:00' : '19:00',
      petName,
    };
  },
};
