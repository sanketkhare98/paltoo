# 🐾 Paltoo — AI-Powered Pet Companion

Paltoo is a comprehensive, interactive pet care management platform powered by Google's Gemini AI. Get personalized health insights, nutrition plans, breed-specific care guides, and smart product recommendations — all tailored to your pet's unique profile.

![Paltoo](https://img.shields.io/badge/Paltoo-AI%20Pet%20Companion-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-3-teal?style=flat-square)
![Express](https://img.shields.io/badge/Express-4-green?style=flat-square)

---

## ✨ Features

### 🤖 AI-Powered Insights (Gemini API)
- **Real-time AI Chat** — Ask anything about your pet's health, diet, behavior, and care
- **Personalized Diet Plans** — AI-generated nutrition plans with proteins, vitamins, minerals, supplements, and treats
- **Symptom Checker** — AI-powered analysis of common pet health issues
- **Breed-Specific Guides** — Temperament, exercise, grooming, health risks, and training tips
- **Smart Product Recommendations** — AI-generated pros/cons for marketplace products

### 🔐 Authentication
- **Google Sign-In** — One-click sign in with Google
- **Apple Sign-In** — Sign in with Apple ID
- **Guest Mode** — Skip sign-in and explore

### 📊 Health Tracking Dashboard
- **Weight & Growth Charts** — Visual tracking with trend analysis
- **Daily Care Checklist** — Morning walk, meals, medication, grooming tracking
- **Vaccination Records** — Log and track with status alerts
- **Medical History Timeline** — Chronological record of vet visits
- **Medication & Supplement Reminders** — Push notifications

### 🍽️ Nutrition & Diet
- **Personalized Diet Plans** — Breed, age, weight-specific meal plans
- **Nutrition Breakdown** — Visual protein, vitamin, mineral display
- **Calendar Export** — Google Calendar and Apple Calendar (.ics)

### 🛒 Marketplace (25+ Products)
- **8 Categories**: Grooming, Daily Essentials, Supplements, Treats, Toys, Health & Hygiene, Accessories, Food & Storage
- **Real Brands**: KONG, FURminator, Zesty Paws, Frontline Plus, and more
- **AI Recommendations**: Pet-specific match scores with pros/cons

### 🚨 Emergency Services
- **Google Maps Integration** — Find nearby emergency vet clinics
- **Geolocation Detection** — Auto-detect location
- **Emergency Contacts** — Quick-dial with click-to-call

### 💎 Subscription Tiers
| Feature | Free | Premium (₹299/mo) | Pro (₹599/mo) |
|---------|------|-------------------|----------------|
| Pet Profiles | Up to 2 | Up to 10 | Unlimited |
| AI Queries | 10/month | 200/month | Unlimited |
| Health Dashboard | ❌ | ✅ | ✅ |
| Calendar Export | ❌ | ✅ | ✅ |
| Annual Discount | — | 12% off | 12% off |

### 🎨 Design
- 🌙 **Dark Mode** with system preference detection
- 🟠 **Warm yellow/orange color palette** throughout
- ✨ **Scroll animations** — fade-in, slide, scale effects
- 📱 **Mobile-first responsive design**
- 🐾 **Branded loading screen** with animated Paltoo logo

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm** 9+
- **Gemini API Key** — Get one free at [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

```bash
# Navigate to the project
cd paltoo

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Configure your Gemini API key
# Edit server/.env and replace YOUR_GEMINI_API_KEY_HERE with your actual key
```

### Running the App

```bash
# Option 1: Start both frontend + backend together
npm start

# Option 2: Start separately
npm run server   # Backend API (port 3001)
npm run dev      # Frontend (port 3000)
```

The app will open at **http://localhost:3000**.

### Setup Flow
1. **Splash Screen** — Animated Paltoo logo (first visit only)
2. **Welcome Screen** — Sign in with Google, Apple, or continue as guest
3. **Pet Profile** — Create your first pet profile
4. **Dashboard** — Start exploring AI insights!

---

## ⚙️ Configuration

### Gemini API Key (Server-Side)
The API key is stored **securely on the server** — users never need to enter it.

```bash
# Edit server/.env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
```

**To get a key:**
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy and paste into `server/.env`

---

## 🏗️ Architecture

```
paltoo/
├── server/                      # Express backend
│   ├── index.js                 # Gemini API proxy with rate limiting
│   ├── package.json
│   └── .env                     # API key configuration
├── src/
│   ├── App.jsx                  # Router + splash/loading screens
│   ├── main.jsx                 # Entry point with providers
│   ├── index.css                # Tailwind + warm theme + animations
│   ├── contexts/                # React Context state management
│   ├── services/                # API proxy, storage, calendar, notifications
│   ├── components/              # 42 React components
│   │   ├── layout/              # Navbar, Sidebar, BottomNav
│   │   ├── onboarding/          # Welcome (Google/Apple sign-in), PetOnboarding
│   │   ├── dashboard/           # Health score, checklist, insights
│   │   ├── ai/                  # Chat, symptom checker, breed guide
│   │   ├── health/              # Weight, vaccinations, medications
│   │   ├── nutrition/           # Diet plans, calendar export
│   │   ├── marketplace/         # Products, cart, AI recommendations
│   │   ├── emergency/           # Maps, emergency contacts
│   │   ├── scheduling/          # Vet appointments, reminders
│   │   ├── training/            # Training guides
│   │   └── subscription/        # Pricing, settings
│   ├── data/                    # Products, breeds
│   └── utils/                   # Constants, helpers, AI prompts
├── package.json
├── vite.config.js               # Includes API proxy config
└── tailwind.config.js           # Warm color palette
```

---

## 🔧 Scripts

```bash
npm start         # Run frontend + backend together
npm run dev       # Frontend only (port 3000)
npm run server    # Backend only (port 3001)
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

---

## 📄 License

MIT License

---

Built with ❤️ and 🐾 by the Paltoo Team
