import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Edit3 } from 'lucide-react';
import { usePets } from '../../contexts/PetContext';
import PetAvatar from './PetAvatar';
import PetProfileForm from './PetProfileForm';
import { useNavigate } from 'react-router-dom';

export default function PetSwitcher() {
  const { pets, activePet, setActivePet } = usePets();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activePet && (!pets || pets.length === 0)) {
    return (
      <button 
        type="button"
        onClick={() => navigate('/onboard-pet')} 
        className="btn-primary text-xs font-bold py-1.5 px-3 rounded-xl"
      >
        + Add Pet
      </button>
    );
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-[var(--color-surface)] hover:bg-brand-50/50 dark:hover:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-2xl py-1 px-2 pr-3 shadow-sm transition-all"
        >
          <PetAvatar species={activePet?.species} size="sm" />
          <span className="font-bold text-xs sm:text-sm truncate max-w-[110px] text-[var(--color-text)]">
            {activePet?.name || 'Select Pet'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 right-0 w-60 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden z-50 animate-scale-in">
            <div className="py-2">
              <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Switch Pet
              </div>

              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className={`w-full flex items-center justify-between px-3 py-2 hover:bg-brand-50/40 dark:hover:bg-brand-900/20 transition-colors ${
                    activePet?.id === pet.id ? 'bg-brand-50 dark:bg-brand-900/30' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActivePet(pet.id);
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2.5 flex-1 text-left"
                  >
                    <PetAvatar species={pet.species} size="sm" />
                    <div className="flex-1 truncate">
                      <div className="font-bold text-xs text-[var(--color-text)]">{pet.name}</div>
                      <div className="text-[11px] text-[var(--color-text-secondary)] capitalize truncate">
                        {pet.breed || pet.species} • {pet.weight ? `${pet.weight}kg` : ''}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPet(pet);
                      setIsOpen(false);
                    }}
                    className="p-1 text-[var(--color-text-secondary)] hover:text-brand-600 rounded-lg hover:bg-brand-100/50 transition-colors ml-1 shrink-0"
                    title={`Edit ${pet.name}`}
                  >
                    <Edit3 size={13} />
                  </button>
                </div>
              ))}

              <div className="border-t border-[var(--color-border)] mt-1 pt-1 space-y-0.5">
                {activePet && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPet(activePet);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-4 py-2 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-xs font-semibold text-[var(--color-text)] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-brand-500" />
                    <span>Edit {activePet.name}'s Profile</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    navigate('/onboard-pet');
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-4 py-2 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-xs font-bold text-brand-600 dark:text-brand-400 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Pet</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {editingPet && (
        <PetProfileForm 
          pet={editingPet} 
          onClose={() => setEditingPet(null)} 
        />
      )}
    </>
  );
}
