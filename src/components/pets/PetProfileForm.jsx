import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Sparkles } from 'lucide-react';
import { usePets } from '../../contexts/PetContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { SPECIES_OPTIONS, ACTIVITY_LEVELS } from '../../utils/constants';
import { getBreedsForSpecies } from '../../data/breedData';

export default function PetProfileForm({ pet, onClose }) {
  const { updatePet, addPet } = usePets();
  const { showToast } = useNotifications();

  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    birthDate: '',
    weight: '',
    activityLevel: 'Moderate',
    spayedNeutered: false,
    healthConcerns: [],
    allergies: [],
    medications: []
  });

  const [tempConcern, setTempConcern] = useState('');
  const [tempAllergy, setTempAllergy] = useState('');

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || 'Dog',
        breed: pet.breed || '',
        gender: pet.gender || 'Male',
        birthDate: pet.birthDate || '',
        weight: pet.weight !== undefined ? String(pet.weight) : '',
        activityLevel: pet.activityLevel || 'Moderate',
        spayedNeutered: pet.spayedNeutered || pet.isSpayedNeutered || false,
        healthConcerns: pet.healthConcerns || [],
        allergies: pet.allergies || [],
        medications: pet.medications || []
      });
    }
  }, [pet]);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addChip = (field, value, setTemp) => {
    if (value.trim()) {
      updateForm(field, [...(formData[field] || []), value.trim()]);
      setTemp('');
    }
  };

  const removeChip = (field, index) => {
    updateForm(field, (formData[field] || []).filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Pet name is required', 'error');
      return;
    }

    const processedData = {
      ...formData,
      name: formData.name.trim(),
      weight: parseFloat(formData.weight) || 0,
    };
    
    if (pet?.id) {
      updatePet(pet.id, processedData);
      showToast(`Updated ${processedData.name}'s profile! 🐾`, 'success');
    } else {
      addPet(processedData);
      showToast(`Added ${processedData.name}! 🐾`, 'success');
    }
    onClose();
  };

  const availableBreeds = getBreedsForSpecies(formData.species) || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--color-surface)] rounded-3xl w-full max-w-lg my-8 flex flex-col shadow-2xl border border-[var(--color-border)] animate-scale-in">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {formData.species === 'Dog' ? '🐕' : formData.species === 'Cat' ? '🐈' : '🐾'}
            </span>
            <h2 className="text-xl font-display font-bold text-[var(--color-text)]">
              {pet ? `Edit ${pet.name}'s Profile` : 'Add New Pet Profile'}
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--color-text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
              Pet Name *
            </label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.name} 
              onChange={e => updateForm('name', e.target.value)} 
              placeholder="e.g. Bruno, Luna, Charlie" 
              required 
            />
          </div>
          
          {/* Species & Breed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Species
              </label>
              <select 
                className="input-field" 
                value={formData.species} 
                onChange={e => updateForm('species', e.target.value)}
              >
                {SPECIES_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Breed
              </label>
              <input 
                type="text" 
                list="breed-list"
                className="input-field" 
                value={formData.breed} 
                onChange={e => updateForm('breed', e.target.value)} 
                placeholder="e.g. Golden Retriever"
              />
              <datalist id="breed-list">
                {availableBreeds.map(b => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Gender & Birth Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Gender
              </label>
              <select 
                className="input-field" 
                value={formData.gender} 
                onChange={e => updateForm('gender', e.target.value)}
              >
                <option value="Male">Male ♂</option>
                <option value="Female">Female ♀</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Birth Date (approx)
              </label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.birthDate || ''} 
                onChange={e => updateForm('birthDate', e.target.value)} 
              />
            </div>
          </div>

          {/* Weight & Activity Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Current Weight (kg) *
              </label>
              <input 
                type="number" 
                step="0.1" 
                min="0.1"
                className="input-field" 
                value={formData.weight || ''} 
                onChange={e => updateForm('weight', e.target.value)} 
                placeholder="e.g. 24.5"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Activity Level
              </label>
              <select 
                className="input-field" 
                value={formData.activityLevel} 
                onChange={e => updateForm('activityLevel', e.target.value)}
              >
                {ACTIVITY_LEVELS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Spayed / Neutered checkbox */}
          <div className="flex items-center gap-3 p-3 bg-brand-50/60 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-900/30">
            <input 
              type="checkbox" 
              id="pet-spayed" 
              checked={formData.spayedNeutered} 
              onChange={e => updateForm('spayedNeutered', e.target.checked)}
              className="w-4 h-4 text-brand-500 rounded focus:ring-brand-400"
            />
            <label htmlFor="pet-spayed" className="text-sm font-medium text-[var(--color-text)] cursor-pointer">
              Spayed or Neutered
            </label>
          </div>

          {/* Health Concerns */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
              Health Concerns / Conditions
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="input-field" 
                value={tempConcern} 
                onChange={e => setTempConcern(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChip('healthConcerns', tempConcern, setTempConcern); } }}
                placeholder="e.g. Arthritis, Skin allergy"
              />
              <button 
                type="button" 
                onClick={() => addChip('healthConcerns', tempConcern, setTempConcern)} 
                className="btn-secondary px-3"
              >
                <Plus className="w-5 h-5"/>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(formData.healthConcerns || []).map((item, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
                  {item}
                  <button type="button" onClick={() => removeChip('healthConcerns', i)} className="hover:text-rose-600">
                    <X className="w-3 h-3"/>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
              Food or Environmental Allergies
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="input-field" 
                value={tempAllergy} 
                onChange={e => setTempAllergy(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChip('allergies', tempAllergy, setTempAllergy); } }}
                placeholder="e.g. Chicken, Grain, Pollen"
              />
              <button 
                type="button" 
                onClick={() => addChip('allergies', tempAllergy, setTempAllergy)} 
                className="btn-secondary px-3"
              >
                <Plus className="w-5 h-5"/>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(formData.allergies || []).map((item, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                  {item}
                  <button type="button" onClick={() => removeChip('allergies', i)} className="hover:text-amber-600">
                    <X className="w-3 h-3"/>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Save / Cancel */}
          <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary py-2.5 px-5"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary py-2.5 px-6 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
