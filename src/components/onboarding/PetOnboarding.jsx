import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { usePets } from '../../contexts/PetContext';
import { useAuth } from '../../contexts/AuthContext';
import { SPECIES_OPTIONS, ACTIVITY_LEVELS } from '../../utils/constants';
import { getBreedsForSpecies } from '../../data/breedData';

export default function PetOnboarding() {
  const navigate = useNavigate();
  const { addPet } = usePets();
  const { completeOnboarding } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Unknown',
    birthDate: '',
    weight: '',
    activityLevel: 'moderate',
    isSpayedNeutered: false,
    healthConcerns: [],
    allergies: [],
    medications: []
  });

  const [tempConcern, setTempConcern] = useState('');
  const [tempAllergy, setTempAllergy] = useState('');

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleCreate = () => {
    const newPet = {
      ...formData,
      weight: parseFloat(formData.weight) || 0,
    };
    addPet(newPet);
    if (completeOnboarding) completeOnboarding();
    navigate('/dashboard');
  };

  const addChip = (field, value, setTemp) => {
    if (value.trim()) {
      updateForm(field, [...formData[field], value.trim()]);
      setTemp('');
    }
  };

  const removeChip = (field, index) => {
    updateForm(field, formData[field].filter((_, i) => i !== index));
  };

  const getEmojiForSpecies = (species) => {
    const s = species.toLowerCase();
    if (s === 'dog') return '🐕';
    if (s === 'cat') return '🐈';
    if (s === 'bird') return '🦜';
    if (s === 'rabbit') return '🐇';
    if (s === 'fish') return '🐠';
    if (s === 'reptile') return '🦎';
    if (s === 'small_pet') return '🐹';
    return '🐾';
  };

  const breeds = getBreedsForSpecies ? getBreedsForSpecies(formData.species) : ['Mixed', 'Other'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-gray-900 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
              <span className="text-3xl">🐾</span>
            </div>
          </div>
          <div className="text-sm font-medium text-brand-500 mb-2">Step 2 of 2</div>
          <h1 className="text-3xl font-display font-bold gradient-text">Add Your Pet</h1>
          <p className="text-gray-500 mt-2">Let's create a profile for your furry friend.</p>
        </div>

        <div className="glass-card p-6 md:p-8 border border-orange-100/50 dark:border-orange-900/50">
          {/* Progress Bar */}
          <div className="flex mb-8 space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= i ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-fade-in-up">
              <h2 className="text-xl font-bold mb-4">Basic Info</h2>
              
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-4xl shadow-inner transition-all duration-300">
                  {getEmojiForSpecies(formData.species)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="input-field border-orange-200 focus:border-brand-500" value={formData.name} onChange={e => updateForm('name', e.target.value)} placeholder="Max" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Species</label>
                  <select className="input-field border-orange-200 focus:border-brand-500" value={formData.species} onChange={e => updateForm('species', e.target.value)}>
                    {SPECIES_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Breed</label>
                  <select className="input-field border-orange-200 focus:border-brand-500" value={formData.breed} onChange={e => updateForm('breed', e.target.value)}>
                    <option value="">Select breed...</option>
                    {breeds.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select className="input-field border-orange-200 focus:border-brand-500" value={formData.gender} onChange={e => updateForm('gender', e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in-up">
              <h2 className="text-xl font-bold mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Birth Date (Approx)</label>
                  <input type="date" className="input-field border-orange-200 focus:border-brand-500" value={formData.birthDate} onChange={e => updateForm('birthDate', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <input type="number" step="0.1" className="input-field border-orange-200 focus:border-brand-500" value={formData.weight} onChange={e => updateForm('weight', e.target.value)} placeholder="0.0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Activity Level</label>
                <select className="input-field border-orange-200 focus:border-brand-500" value={formData.activityLevel} onChange={e => updateForm('activityLevel', e.target.value)}>
                  {ACTIVITY_LEVELS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="flex items-center space-x-3 mt-4">
                <input type="checkbox" id="spayed" className="w-5 h-5 text-brand-500 rounded border-orange-300 focus:ring-brand-500" checked={formData.isSpayedNeutered} onChange={e => updateForm('isSpayedNeutered', e.target.checked)} />
                <label htmlFor="spayed" className="text-sm font-medium">Spayed / Neutered</label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in-up">
              <h2 className="text-xl font-bold mb-4">Health (Optional)</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Health Concerns</label>
                <div className="flex space-x-2">
                  <input type="text" className="input-field border-orange-200 focus:border-brand-500" value={tempConcern} onChange={e => setTempConcern(e.target.value)} onKeyPress={e => e.key === 'Enter' && addChip('healthConcerns', tempConcern, setTempConcern)} placeholder="e.g. Arthritis" />
                  <button onClick={() => addChip('healthConcerns', tempConcern, setTempConcern)} className="btn-secondary px-3"><Plus className="w-5 h-5"/></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.healthConcerns.map((item, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
                      {item}
                      <button onClick={() => removeChip('healthConcerns', i)} className="ml-1 text-rose-600 hover:text-rose-800"><X className="w-3 h-3"/></button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Allergies</label>
                <div className="flex space-x-2">
                  <input type="text" className="input-field border-orange-200 focus:border-brand-500" value={tempAllergy} onChange={e => setTempAllergy(e.target.value)} onKeyPress={e => e.key === 'Enter' && addChip('allergies', tempAllergy, setTempAllergy)} placeholder="e.g. Chicken" />
                  <button onClick={() => addChip('allergies', tempAllergy, setTempAllergy)} className="btn-secondary px-3"><Plus className="w-5 h-5"/></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.allergies.map((item, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      {item}
                      <button onClick={() => removeChip('allergies', i)} className="ml-1 text-amber-600 hover:text-amber-800"><X className="w-3 h-3"/></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            {step > 1 ? (
              <button onClick={handleBack} className="btn-secondary border-orange-200">Back</button>
            ) : <div />}
            
            {step < 3 ? (
              <button onClick={handleNext} disabled={!formData.name} className="btn-primary">Next Step</button>
            ) : (
              <button onClick={handleCreate} className="warm-gradient-strong text-white px-6 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50">Create Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
