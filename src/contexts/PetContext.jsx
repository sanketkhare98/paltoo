import React, { createContext, useContext, useState, useCallback } from 'react';
import { generateId } from '../utils/helpers';

const PetContext = createContext();

function loadPets() {
  try {
    const stored = localStorage.getItem('paltoo_pets');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function savePets(pets) {
  try {
    localStorage.setItem('paltoo_pets', JSON.stringify(pets));
  } catch (e) {
    console.error('Failed to save pets to localStorage:', e);
  }
}

function loadActivePetId() {
  return localStorage.getItem('paltoo_active_pet') || null;
}

export function PetProvider({ children }) {
  const [pets, setPets] = useState(loadPets);
  const [activePetId, setActivePetId] = useState(() => {
    const stored = loadActivePetId();
    const petsList = loadPets();
    if (stored && petsList.some(p => p.id === stored)) return stored;
    return petsList.length > 0 ? petsList[0].id : null;
  });

  const activePet = pets.find(p => p.id === activePetId) || null;

  const setActivePet = useCallback((petId) => {
    setActivePetId(petId);
    localStorage.setItem('paltoo_active_pet', petId);
  }, []);

  const addPet = useCallback((petData) => {
    const weightNum = parseFloat(petData.weight) || 0;
    const initialWeightHistory = weightNum > 0 
      ? [{ id: generateId(), date: petData.birthDate || new Date().toISOString().split('T')[0], weight: weightNum }] 
      : [];

    const newPet = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...petData,
      weight: weightNum,
      healthConcerns: petData.healthConcerns || [],
      allergies: petData.allergies || [],
      medications: petData.medications || [],
      vaccinations: petData.vaccinations || [],
      weightHistory: petData.weightHistory?.length ? petData.weightHistory : initialWeightHistory,
      medicalHistory: petData.medicalHistory || [],
      dailyChecklist: petData.dailyChecklist || {},
      vetAppointments: petData.vetAppointments || [],
    };

    setPets(prev => {
      const updated = [...prev, newPet];
      savePets(updated);
      return updated;
    });
    setActivePet(newPet.id);
    return newPet;
  }, [setActivePet]);

  const updatePet = useCallback((petId, updates) => {
    setPets(prev => {
      const updated = prev.map(p => {
        if (p.id !== petId) return p;
        
        // If weight is updated, also ensure weightHistory has this entry
        let updatedWeightHistory = updates.weightHistory || p.weightHistory || [];
        if (updates.weight !== undefined && updates.weight !== null) {
          const newWeight = parseFloat(updates.weight);
          if (!isNaN(newWeight) && newWeight > 0) {
            const todayStr = new Date().toISOString().split('T')[0];
            const existingTodayIndex = updatedWeightHistory.findIndex(entry => entry.date === todayStr);
            if (existingTodayIndex >= 0) {
              updatedWeightHistory = updatedWeightHistory.map((item, idx) => 
                idx === existingTodayIndex ? { ...item, weight: newWeight } : item
              );
            } else {
              updatedWeightHistory = [...updatedWeightHistory, { id: generateId(), date: todayStr, weight: newWeight }]
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            }
          }
        }

        return {
          ...p,
          ...updates,
          weight: updates.weight !== undefined ? parseFloat(updates.weight) : p.weight,
          weightHistory: updatedWeightHistory,
          updatedAt: new Date().toISOString(),
        };
      });
      savePets(updated);
      return updated;
    });
  }, []);

  const deletePet = useCallback((petId) => {
    setPets(prev => {
      const updated = prev.filter(p => p.id !== petId);
      savePets(updated);
      if (activePetId === petId) {
        const newActive = updated.length > 0 ? updated[0].id : null;
        setActivePetId(newActive);
        if (newActive) localStorage.setItem('paltoo_active_pet', newActive);
        else localStorage.removeItem('paltoo_active_pet');
      }
      return updated;
    });
  }, [activePetId]);

  // Robust addWeightEntry accepting (petId, weight, date) or (petId, { weight, date })
  const addWeightEntry = useCallback((petId, weightParam, dateParam) => {
    let weightVal = 0;
    let dateVal = new Date().toISOString().split('T')[0];

    if (typeof weightParam === 'object' && weightParam !== null) {
      weightVal = parseFloat(weightParam.weight) || 0;
      dateVal = weightParam.date || dateVal;
    } else {
      weightVal = parseFloat(weightParam) || 0;
      dateVal = dateParam || dateVal;
    }

    if (isNaN(weightVal) || weightVal <= 0) return;

    setPets(prev => {
      const updated = prev.map(p => {
        if (p.id !== petId) return p;

        const currentHistory = [...(p.weightHistory || [])];
        const existingIdx = currentHistory.findIndex(h => h.date === dateVal);

        if (existingIdx >= 0) {
          currentHistory[existingIdx] = { ...currentHistory[existingIdx], weight: weightVal };
        } else {
          currentHistory.push({ id: generateId(), date: dateVal, weight: weightVal });
        }

        currentHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
        const latestWeight = currentHistory[currentHistory.length - 1].weight;

        return {
          ...p,
          weight: latestWeight,
          weightHistory: currentHistory,
          updatedAt: new Date().toISOString()
        };
      });
      savePets(updated);
      return updated;
    });
  }, []);

  // Delete weight entry
  const deleteWeightEntry = useCallback((petId, entryId) => {
    setPets(prev => {
      const updated = prev.map(p => {
        if (p.id !== petId) return p;
        const filtered = (p.weightHistory || []).filter(h => h.id !== entryId && h.date !== entryId);
        const latestWeight = filtered.length > 0 ? filtered[filtered.length - 1].weight : p.weight;
        return {
          ...p,
          weight: latestWeight,
          weightHistory: filtered,
          updatedAt: new Date().toISOString()
        };
      });
      savePets(updated);
      return updated;
    });
  }, []);

  const addVaccination = useCallback((petId, vaccination) => {
    setPets(prev => {
      const updated = prev.map(p => {
        if (p.id !== petId) return p;
        return { ...p, vaccinations: [...(p.vaccinations || []), { id: generateId(), ...vaccination }] };
      });
      savePets(updated);
      return updated;
    });
  }, []);

  const addMedicalRecord = useCallback((petId, record) => {
    setPets(prev => {
      const updated = prev.map(p => {
        if (p.id !== petId) return p;
        return { ...p, medicalHistory: [...(p.medicalHistory || []), { id: generateId(), date: new Date().toISOString().split('T')[0], ...record }] };
      });
      savePets(updated);
      return updated;
    });
  }, []);

  const addVetAppointment = useCallback((petId, appointment) => {
    setPets(prev => {
      const updated = prev.map(p => {
        if (p.id !== petId) return p;
        return { ...p, vetAppointments: [...(p.vetAppointments || []), { id: generateId(), ...appointment }] };
      });
      savePets(updated);
      return updated;
    });
  }, []);

  const removeVetAppointment = useCallback((petId, appointmentId) => {
    setPets(prev => {
      const updated = prev.map(p => {
        if (p.id !== petId) return p;
        return { ...p, vetAppointments: (p.vetAppointments || []).filter(a => a.id !== appointmentId) };
      });
      savePets(updated);
      return updated;
    });
  }, []);

  const toggleChecklistItem = useCallback((petId, dateKey, itemId) => {
    setPets(prev => {
      const updated = prev.map(p => {
        if (p.id !== petId) return p;
        const dailyChecklist = { ...(p.dailyChecklist || {}) };
        const dayItems = { ...(dailyChecklist[dateKey] || {}) };
        dayItems[itemId] = !dayItems[itemId];
        dailyChecklist[dateKey] = dayItems;
        return { ...p, dailyChecklist, checklist: dailyChecklist };
      });
      savePets(updated);
      return updated;
    });
  }, []);

  const addMedication = useCallback((petId, medication) => {
    setPets(prev => {
      const updated = prev.map(p => {
        if (p.id !== petId) return p;
        return { ...p, medications: [...(p.medications || []), { id: generateId(), ...medication }] };
      });
      savePets(updated);
      return updated;
    });
  }, []);

  const removeMedication = useCallback((petId, medicationId) => {
    setPets(prev => {
      const updated = prev.map(p => {
        if (p.id !== petId) return p;
        return { ...p, medications: (p.medications || []).filter(m => m.id !== medicationId) };
      });
      savePets(updated);
      return updated;
    });
  }, []);

  const value = {
    pets,
    activePet,
    activePetId,
    setActivePet,
    addPet,
    updatePet,
    deletePet,
    addWeightEntry,
    deleteWeightEntry,
    addVaccination,
    addMedicalRecord,
    addVetAppointment,
    removeVetAppointment,
    toggleChecklistItem,
    addMedication,
    removeMedication,
  };

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (!context) throw new Error('usePets must be used within PetProvider');
  return context;
}
