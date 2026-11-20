import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePets } from '../../contexts/PetContext';
import { geminiService } from '../../services/geminiService';
import { PROMPTS } from '../../utils/prompts';
import { BookOpen, Sparkles, Activity, Scissors, AlertCircle, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { classNames } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function BreedGuide() {
  const { incrementAiUsage } = useAuth();
  const { activePet } = usePets();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState(null);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState('overview');

  const generateGuide = async () => {
    if (!activePet?.breed) {
      setError("Please set a breed for your pet first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = PROMPTS.breedGuide(activePet);
      const data = await geminiService.generateJSON(prompt);
      setGuide(data);
      incrementAiUsage();
      setExpandedSection('overview');
    } catch (err) {
      console.error(err);
      setError("Failed to generate breed guide. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ id, title, icon: Icon, color, content }) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className="glass-card overflow-hidden transition-all duration-300">
        <button
          onClick={() => setExpandedSection(isExpanded ? null : id)}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={classNames("p-2 rounded-lg", color)}>
              <Icon size={20} />
            </div>
            <h3 className="font-bold text-[var(--color-text)]">{title}</h3>
          </div>
          {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        
        {isExpanded && (
          <div className="p-5 pt-0 border-t border-gray-100 dark:border-gray-800 animate-slide-up">
            <div className="text-sm text-[var(--color-text-muted)] leading-relaxed mt-4">
              {Array.isArray(content) ? (
                <ul className="space-y-2 list-disc list-inside">
                  {content.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              ) : (
                <p>{content}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!activePet) return <div className="p-8 text-center">Please select a pet first.</div>;

  return (
    <div className="page-container max-w-3xl mx-auto space-y-6 pb-12">
      <header className="flex flex-col md:flex-row items-center gap-6 glass-card p-6 bg-gradient-to-br from-brand-50 to-[var(--color-surface)] dark:from-brand-900/10 border-brand-100 dark:border-brand-900/30">
        <div className="w-24 h-24 rounded-full bg-brand-100 dark:bg-brand-900/30 text-4xl flex items-center justify-center shadow-inner">
          {activePet.species === 'Dog' ? '🐕' : activePet.species === 'Cat' ? '🐈' : '🐾'}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            {activePet.breed || 'Unknown Breed'} Guide 📖
          </h1>
          <p className="text-[var(--color-text-muted)] mb-4">
            Personalized insights for {activePet.name}'s breed characteristics and needs.
          </p>
          {!guide && (
            <button 
              onClick={generateGuide} 
              disabled={loading || !activePet.breed}
              className="btn-primary flex items-center gap-2 mx-auto md:mx-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Sparkles size={18} /> Generate AI Guide</>
              )}
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-medium">{error}</div>
      )}

      {loading && !guide && (
        <div className="space-y-4 animate-pulse mt-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          ))}
        </div>
      )}

      {guide && (
        <div className="space-y-4 animate-fade-in mt-8">
          <Section 
            id="overview" 
            title="Breed Overview" 
            icon={BookOpen} 
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            content={guide.overview} 
          />
          <Section 
            id="exercise" 
            title="Exercise & Energy" 
            icon={Activity} 
            color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            content={guide.exerciseNeeds} 
          />
          <Section 
            id="grooming" 
            title="Grooming Needs" 
            icon={Scissors} 
            color="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
            content={guide.groomingNeeds} 
          />
          <Section 
            id="health" 
            title="Common Health Issues" 
            icon={AlertCircle} 
            color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            content={guide.commonHealthIssues} 
          />
          <Section 
            id="training" 
            title="Training & Temperament" 
            icon={Brain} 
            color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            content={guide.trainingTips} 
          />
        </div>
      )}
    </div>
  );
}
