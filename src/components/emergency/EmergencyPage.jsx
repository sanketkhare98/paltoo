import React from 'react';
import { PhoneCall, AlertTriangle } from 'lucide-react';
import VetLocator from './VetLocator';
import EmergencyContacts from './EmergencyContacts';
import { useAuth } from '../../contexts/AuthContext';

export default function EmergencyPage() {
  const { hasFeature } = useAuth();

  return (
    <div className="page-container p-4 md:p-6 pb-24 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-red-600 dark:text-red-500 flex items-center justify-center gap-2 mb-2">
          <AlertTriangle className="w-8 h-8" /> Emergency Services
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Immediate help when your pet needs it most.</p>
      </div>

      <a 
        href="tel:112" 
        className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-5 rounded-2xl font-black text-xl shadow-lg shadow-red-500/30 transition-transform active:scale-[0.98]"
      >
        <div className="flex items-center justify-center gap-3">
          <PhoneCall className="w-7 h-7 animate-pulse" />
          CALL EMERGENCY (112)
        </div>
      </a>

      {hasFeature('priority_support') && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3 text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
          <span className="text-lg">⭐</span> 
          As a Pro user, your calls to partner clinics are prioritized.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <EmergencyContacts />
          
          <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-lg mb-3 text-[var(--color-text)] flex items-center gap-2">
              🚑 While you wait (First Aid Basics)
            </h3>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex gap-2">
                <span className="text-red-500 font-bold">•</span>
                <strong>Stay Calm:</strong> Pets sense panic. Approach slowly and speak softly.
              </li>
              <li className="flex gap-2">
                <span className="text-red-500 font-bold">•</span>
                <strong>Prevent Bites:</strong> Even gentle pets may bite when in pain. Muzzle if necessary (except if vomiting).
              </li>
              <li className="flex gap-2">
                <span className="text-red-500 font-bold">•</span>
                <strong>Bleeding:</strong> Apply firm, direct pressure with a clean cloth.
              </li>
              <li className="flex gap-2">
                <span className="text-red-500 font-bold">•</span>
                <strong>Poisoning:</strong> Do NOT induce vomiting unless instructed by a vet. Bring the suspected poison wrapper.
              </li>
            </ul>
          </div>
        </div>

        <div className="h-full">
          <VetLocator />
        </div>
      </div>
    </div>
  );
}
