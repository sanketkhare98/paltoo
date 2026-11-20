import React from 'react';
import { Edit, Trash2, Activity, Weight, AlertCircle } from 'lucide-react';
import { getLifeStageLabel, formatAge } from '../../utils/helpers';
import PetAvatar from './PetAvatar';
import { usePets } from '../../contexts/PetContext';

export default function PetCard({ pet, onEdit }) {
  const { deletePet } = usePets();

  if (!pet) return null;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${pet.name}'s profile?`)) {
      deletePet(pet.id);
    }
  };

  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(pet)} className="p-1.5 text-gray-500 hover:text-brand-500 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-sm">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={handleDelete} className="p-1.5 text-gray-500 hover:text-rose-500 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-sm">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-start space-x-4">
        <PetAvatar species={pet.species} size="lg" />
        <div className="flex-1">
          <h3 className="font-bold text-xl text-[var(--color-text)]">{pet.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{pet.breed || pet.species}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {pet.birthDate && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {formatAge(pet.birthDate)}
              </span>
            )}
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              {getLifeStageLabel(pet.birthDate, pet.species)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-lg">
            <Weight className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Weight</div>
            <div className="font-semibold text-sm">{pet.weight ? `${pet.weight} kg` : '--'}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-lg">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Activity</div>
            <div className="font-semibold text-sm capitalize">{pet.activityLevel || 'Unknown'}</div>
          </div>
        </div>
      </div>

      {pet.healthConcerns && pet.healthConcerns.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-1.5 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Health Concerns</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pet.healthConcerns.map((concern, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded text-xs">
                {concern}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
