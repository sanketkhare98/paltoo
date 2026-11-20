import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [permission, setPermission] = useState(() => {
    if (typeof Notification === 'undefined') return 'unsupported';
    return Notification.permission;
  });

  const [reminders, setReminders] = useState(() => {
    try {
      const stored = localStorage.getItem('paltoo_reminders');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('paltoo_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return 'unsupported';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const sendNotification = useCallback((title, options = {}) => {
    if (permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/paltoo-logo.svg',
          badge: '/paltoo-logo.svg',
          ...options,
        });
      } catch (e) {
        console.warn('Notification failed:', e);
      }
    }
  }, [permission]);

  const addReminder = useCallback((reminder) => {
    const newReminder = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: true,
      ...reminder,
    };
    setReminders(prev => [...prev, newReminder]);
    return newReminder;
  }, []);

  const removeReminder = useCallback((id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const toggleReminder = useCallback((id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Check reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach(reminder => {
        if (!reminder.isActive) return;
        if (reminder.type === 'medication' || reminder.type === 'feeding') {
          const reminderTime = new Date(reminder.nextDue);
          const diff = Math.abs(now - reminderTime);
          if (diff < 60000) { // within 1 minute
            sendNotification(`🐾 ${reminder.title}`, { body: reminder.message });
          }
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [reminders, sendNotification]);

  const value = {
    permission,
    requestPermission,
    sendNotification,
    reminders,
    addReminder,
    removeReminder,
    toggleReminder,
    toasts,
    showToast,
    dismissToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
