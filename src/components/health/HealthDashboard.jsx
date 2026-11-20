import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePets } from '../../contexts/PetContext';
import { Activity, Scale, Syringe, FileText, Pill, AlertCircle } from 'lucide-react';
import WeightTracker from './WeightTracker';
import VaccinationLog from './VaccinationLog';
import MedicalHistory from './MedicalHistory';
import MedicationReminders from './MedicationReminders';
import { classNames } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export default function HealthDashboard() {
  const { hasFeature } = useAuth();
  const { activePet } = usePets();
  const [activeTab, setActiveTab] = useState('overview');

  if (!hasFeature('healthDashboard')) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Activity className="w-16 h-16 text-brand-500 mb-6" />
        <h2 className="section-title text-2xl mb-4">Health Dashboard 📊</h2>
        <p className="text-[var(--color-text-secondary)] max-w-md mb-8">
          Track weight, vaccinations, medical history, and medications. Upgrade to premium to unlock comprehensive health tracking.
        </p>
        <Link to="/settings" className="btn-primary">
          Upgrade Plan
        </Link>
      </div>
    );
  }

  if (!activePet) {
    return (
      <div className="page-container">
        <h2 className="section-title">Health Dashboard 📊</h2>
        <p className="text-[var(--color-text-secondary)]">Please select or add a pet first.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'weight', name: 'Weight', icon: Scale },
    { id: 'vaccinations', name: 'Vaccinations', icon: Syringe },
    { id: 'history', name: 'Medical History', icon: FileText },
    { id: 'medications', name: 'Medications', icon: Pill },
  ];

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)] flex items-center gap-3">
          {activePet.name}'s Health Dashboard 📊
        </h1>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar mb-6 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={classNames(
                'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200',
                activeTab === tab.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.name}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm min-h-[500px]">
        {activeTab === 'overview' && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-xl font-semibold mb-4">Health Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="glass-card p-4 flex items-center justify-between">
                 <div>
                   <p className="text-sm text-[var(--color-text-secondary)]">Current Weight</p>
                   <p className="text-2xl font-bold">{activePet.weightHistory?.length > 0 ? activePet.weightHistory[activePet.weightHistory.length - 1].weight : '--'} kg</p>
                 </div>
                 <Scale className="w-8 h-8 text-brand-500 opacity-80" />
               </div>
               <div className="glass-card p-4 flex items-center justify-between">
                 <div>
                   <p className="text-sm text-[var(--color-text-secondary)]">Active Medications</p>
                   <p className="text-2xl font-bold">{activePet.medications?.filter(m => m.active !== false).length || 0}</p>
                 </div>
                 <Pill className="w-8 h-8 text-paw-500 opacity-80" />
               </div>
               <div className="glass-card p-4 flex items-center justify-between">
                 <div>
                   <p className="text-sm text-[var(--color-text-secondary)]">Vaccines Due Soon</p>
                   <p className="text-2xl font-bold">
                     {activePet.vaccinations?.filter(v => new Date(v.nextDueDate) < new Date(Date.now() + 30*24*60*60*1000)).length || 0}
                   </p>
                 </div>
                 <Syringe className="w-8 h-8 text-forest-500 opacity-80" />
               </div>
            </div>
            
            <div className="mt-8 bg-[var(--color-bg)] rounded-xl p-4 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-brand-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-medium">Stay on track!</h4>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Keep your pet's health records updated. A healthy pet is a happy pet! 🐾</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'weight' && <WeightTracker />}
        {activeTab === 'vaccinations' && <VaccinationLog />}
        {activeTab === 'history' && <MedicalHistory />}
        {activeTab === 'medications' && <MedicationReminders />}
      </div>
    </div>
  );
}
