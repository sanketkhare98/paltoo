import { format, formatDistanceToNow, differenceInYears, differenceInMonths } from 'date-fns';

export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function getLifeStage(ageYears, species = 'Dog') {
  if (species === 'Cat') {
    if (ageYears < 1) return 'kitten';
    if (ageYears < 3) return 'young';
    if (ageYears < 10) return 'adult';
    return 'senior';
  }
  if (ageYears < 1) return 'puppy';
  if (ageYears < 3) return 'young';
  if (ageYears < 7) return 'adult';
  return 'senior';
}

export function getLifeStageLabel(stage) {
  const labels = {
    puppy: '🐶 Puppy',
    kitten: '🐱 Kitten',
    young: '🌟 Young Adult',
    adult: '💪 Adult',
    senior: '👴 Senior',
  };
  return labels[stage] || stage;
}

export function formatAge(birthDate) {
  if (!birthDate) return 'Unknown';
  const now = new Date();
  const birth = new Date(birthDate);
  const years = differenceInYears(now, birth);
  const months = differenceInMonths(now, birth) % 12;
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years}y ${months}m`;
}

export function getAgeInYears(birthDate) {
  if (!birthDate) return 0;
  return differenceInYears(new Date(), new Date(birthDate));
}

export function formatDate(date) {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatTime(date) {
  return format(new Date(date), 'h:mm a');
}

export function formatRelative(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getPetSummary(pet) {
  if (!pet) return '';
  const parts = [];
  if (pet.name) parts.push(pet.name);
  if (pet.breed) parts.push(pet.breed);
  if (pet.species) parts.push(pet.species);
  if (pet.birthDate) parts.push(formatAge(pet.birthDate) + ' old');
  if (pet.weight) parts.push(`${pet.weight}kg`);
  return parts.join(', ');
}

export function getPetProfilePromptContext(pet) {
  if (!pet) return '';
  const age = pet.birthDate ? formatAge(pet.birthDate) : 'unknown age';
  const lifeStage = pet.birthDate ? getLifeStage(getAgeInYears(pet.birthDate), pet.species) : 'unknown';
  return `Pet Profile:
- Name: ${pet.name}
- Species: ${pet.species}
- Breed: ${pet.breed || 'Mixed/Unknown'}
- Age: ${age} (Life stage: ${lifeStage})
- Weight: ${pet.weight ? pet.weight + 'kg' : 'Unknown'}
- Gender: ${pet.gender || 'Unknown'}
- Activity Level: ${pet.activityLevel || 'Moderate'}
- Spayed/Neutered: ${pet.spayedNeutered ? 'Yes' : 'No'}
- Known Health Concerns: ${pet.healthConcerns?.length ? pet.healthConcerns.join(', ') : 'None reported'}
- Allergies: ${pet.allergies?.length ? pet.allergies.join(', ') : 'None reported'}
- Current Medications: ${pet.medications?.length ? pet.medications.map(m => m.name).join(', ') : 'None'}`;
}
