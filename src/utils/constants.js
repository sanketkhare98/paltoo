export const APP_NAME = 'Paltoo';
export const APP_TAGLINE = 'Your AI-Powered Pet Companion';

export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const SPECIES_OPTIONS = [
  { value: 'Dog', label: '🐕 Dog' },
  { value: 'Cat', label: '🐈 Cat' },
  { value: 'Bird', label: '🐦 Bird' },
  { value: 'Rabbit', label: '🐇 Rabbit' },
  { value: 'Fish', label: '🐠 Fish' },
  { value: 'Hamster', label: '🐹 Hamster' },
  { value: 'Other', label: '🐾 Other' },
];

export const ACTIVITY_LEVELS = [
  { value: 'Low', label: '😴 Low' },
  { value: 'Moderate', label: '🚶 Moderate' },
  { value: 'Active', label: '🏃 Active' },
  { value: 'Very Active', label: '⚡ Very Active' },
];

export const LIFE_STAGES = {
  puppy: { label: 'Puppy/Kitten', ageRange: '0-1 year' },
  young: { label: 'Young Adult', ageRange: '1-3 years' },
  adult: { label: 'Adult', ageRange: '3-7 years' },
  senior: { label: 'Senior', ageRange: '7+ years' },
};

export const SUBSCRIPTION_TIERS = {
  free: {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    maxPets: 2,
    maxAiQueries: 10,
    features: [
      'Basic pet profiles (up to 2 pets)',
      'Limited AI queries (10/month)',
      'Access to marketplace',
      'Basic breed information',
    ],
    excluded: [
      'Calendar export',
      'Health tracking dashboard',
      'Full AI insights',
      'Medication reminders',
      'Vet appointment scheduler',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 299,
    annualPrice: Math.round(299 * 12 * 0.88 * 100) / 100, // 12% discount = 3156.48
    maxPets: 10,
    maxAiQueries: 200,
    features: [
      'Multi-pet profile management (up to 10)',
      'Full AI insights & personalized recommendations',
      'Google Calendar & Apple Calendar export',
      'Full micro-nutrition plans with notifications',
      'Diet plan export',
      'Health tracking dashboard with checklists',
      'Pet-specific product recommendations',
      'Medication & supplement reminders',
      'Vet appointment scheduler',
    ],
    excluded: [
      'Priority support',
      'Advanced analytics',
      'Complimentary vet consultations',
      'Exclusive merchandise',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 599,
    annualPrice: Math.round(599 * 12 * 0.88 * 100) / 100, // 12% discount = 6325.44
    maxPets: -1, // unlimited
    maxAiQueries: -1, // unlimited
    features: [
      'Everything in Premium',
      'Priority support',
      'Advanced analytics & health insights',
      '3 complimentary vet consultations/year',
      'Exclusive merchandise',
      'Early access to new features',
      'Community features (photos, tips)',
      'Emergency vet locator with priority listings',
      'Unlimited AI queries',
      'Unlimited pet profiles',
    ],
    excluded: [],
  },
};

export const MARKETPLACE_CATEGORIES = [
  { id: 'grooming', label: 'Grooming', icon: 'Scissors', emoji: '✂️' },
  { id: 'daily-essentials', label: 'Daily Essentials', icon: 'ShoppingBag', emoji: '🛍️' },
  { id: 'supplements', label: 'Supplements & Vitamins', icon: 'Pill', emoji: '💊' },
  { id: 'treats', label: 'Treats', icon: 'Cookie', emoji: '🦴' },
  { id: 'toys', label: 'Toys', icon: 'Gamepad2', emoji: '🧸' },
  { id: 'health-hygiene', label: 'Health & Hygiene', icon: 'Heart', emoji: '🏥' },
  { id: 'accessories', label: 'Accessories', icon: 'Tag', emoji: '🏷️' },
  { id: 'food-storage', label: 'Food & Storage', icon: 'Package', emoji: '📦' },
];

export const HEALTH_METRICS = [
  { id: 'weight', label: 'Weight', unit: 'kg', icon: 'Scale' },
  { id: 'appetite', label: 'Appetite', unit: '', icon: 'Utensils' },
  { id: 'energy', label: 'Energy Level', unit: '', icon: 'Zap' },
  { id: 'mood', label: 'Mood', unit: '', icon: 'Smile' },
];

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const COMMON_SYMPTOMS = [
  'Vomiting', 'Diarrhea', 'Loss of appetite', 'Lethargy',
  'Coughing', 'Sneezing', 'Itching/Scratching', 'Limping',
  'Excessive thirst', 'Weight loss', 'Swelling', 'Hair loss',
  'Eye discharge', 'Ear odor', 'Bad breath', 'Difficulty breathing',
];
