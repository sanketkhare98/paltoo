const STORAGE_PREFIX = 'paltoo_';
const STORAGE_VERSION = '1.0';

export const storageService = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === null) return defaultValue;
      const parsed = JSON.parse(raw);
      return parsed.value !== undefined ? parsed.value : parsed;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify({
        value,
        version: STORAGE_VERSION,
        updatedAt: new Date().toISOString(),
      }));
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },

  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  },

  getStorageSize() {
    let total = 0;
    for (const key in localStorage) {
      if (key.startsWith(STORAGE_PREFIX)) {
        total += localStorage.getItem(key).length * 2; // UTF-16
      }
    }
    return total;
  },
};
