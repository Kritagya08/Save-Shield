# Save Shield — Emergency Safety Platform

[![CI Status](https://img.shields.io/badge/CI-Passing-emerald?style=for-the-badge&logo=githubactions)](https://github.com/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

> **Emergency protection that keeps working when connectivity doesn't.**

Save Shield is a full-stack web application demonstrating an emergency safety system that works in both online and offline situations. When internet connectivity is unavailable, it uses a Bluetooth relay mesh network (simulated in the browser) to forward SOS alerts through nearby devices to reach emergency services.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   ONLINE MODE                        │
│                                                      │
│   User → SOS → Internet → Backend → Contacts        │
│                                                      │
├─────────────────────────────────────────────────────┤
│                   OFFLINE MODE                       │
│                                                      │
│   Phone A (SOS) → Bluetooth → Phone B (Relay)        │
│   → Bluetooth → Phone C (Gateway) → Internet         │
│   → Backend → Contacts                               │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS 3 |
| State Management | Zustand |
| Routing | React Router v6 |
| Animations | Framer Motion |
| Maps | React Leaflet + OpenStreetMap |
| Icons | Lucide React |
| Backend/Auth/DB | Supabase (PostgreSQL + Auth + Realtime) |
| Testing | Vitest |

## 📦 Installation

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- A Supabase project (free tier — optional, app works in local mode without it)

### Setup

```bash
# Clone or navigate to the project
cd save-shield

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials (optional)
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🗄️ Database Configuration

### Option A: Supabase (Recommended for Full Features)

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in the Supabase dashboard
3. Run the migration script: `supabase/migrations/001_schema.sql`
4. Copy your project URL and anon key from **Settings > API**
5. Add them to `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key
```

### Option B: Local Mode (No Setup Required)

If you don't configure Supabase, the app runs in **local mode** using `localStorage` for data persistence. All features work, but data is stored in the browser only.

## 🚀 Running Locally

```bash
# Development server
npm run dev

# Open in browser
# http://localhost:5173
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

Tests cover:
- Risk assessment engine (scoring, factors, thresholds)
- SOS packet validation (loop prevention, hop limits, expiry, deduplication)
- Date/time formatters
- Simulation constants and structures

## 📦 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Output will be in the `dist/` directory.

## 🎮 Demo Mode

The Demo/Simulation page allows you to experience the full Bluetooth relay system without real devices:

1. **Register/Login** to the app
2. Navigate to **Demo** in the sidebar
3. Configure three virtual devices:
   - **Phone A**: Emergency Device (no internet, Bluetooth on)
   - **Phone B**: Relay Node (no internet, Bluetooth on)
   - **Phone C**: Internet Gateway (internet on, Bluetooth on)
4. Press **SIMULATE SOS**
5. Watch the SOS packet animate through the relay network
6. All events are recorded in the timeline and database

### Controls:
- Toggle internet/Bluetooth on each device
- Add/remove relay devices
- Adjust device roles
- Change risk levels
- Start/stop/reset simulation

> **Note**: Browser-based Bluetooth relay is a simulation. Real BLE mesh networking requires native Android/iOS apps. The simulation creates real database records to demonstrate the concept.

## 📱 Pages

| # | Page | Route | Description |
|---|---|---|---|
| 1 | Landing | `/` | Public landing page with features |
| 2 | Login | `/login` | Email/password authentication |
| 3 | Register | `/register` | New user registration |
| 4 | Dashboard | `/dashboard` | System status overview |
| 5 | Contacts | `/contacts` | Emergency contact CRUD |
| 6 | SOS Center | `/sos` | SOS activation with countdown |
| 7 | Live Emergency | `/emergency/live` | Active emergency dashboard |
| 8 | Relay Network | `/relay-network` | Bluetooth relay visualization |
| 9 | Devices | `/devices` | Device network overview |
| 10 | History | `/history` | Emergency history with filters |
| 11 | Emergency Detail | `/emergency/:id` | Single emergency details |
| 12 | Timeline | `/emergency/:id/timeline` | Chronological event timeline |
| 13 | Context Card | `/emergency/:id/context` | Detailed context card |
| 14 | Risk Assessment | `/risk-assessment` | Rule-based risk scoring |
| 15 | Notifications | `/notifications` | Notification center |
| 16 | Settings | `/settings` | App configuration |
| 17 | Profile | `/profile` | User profile management |
| 18 | Demo | `/demo` | Simulation/demo mode |
| 19 | About | `/about` | About Save Shield |

## 🔒 Security

- **Authentication**: Supabase Auth with secure session management
- **Row Level Security**: All database tables have RLS policies
- **No hardcoded keys**: Environment variables for all secrets
- **Input validation**: Client-side validation on all forms
- **Protected routes**: Auth check on all app routes
- **ANON key only**: The frontend only uses the Supabase anon key (not service_role)

## ⚠️ Known Limitations

1. **Bluetooth Relay**: Web browsers cannot directly access BLE mesh networking. The relay system is simulated in the browser and clearly labeled as "DEMO / SIMULATION"
2. **SMS Notifications**: The app does not send real SMS to emergency contacts. In production, this would require integration with Twilio or a similar service
3. **Real-time Location**: GPS tracking requires HTTPS in production. Development uses HTTP with fallback to demo coordinates
4. **Offline Mode**: While the app detects network status, true offline-first functionality would require Service Workers and IndexedDB (progressive web app)
5. **Password Reset**: Available with Supabase; in local mode, there is no password reset

## 📂 Project Structure

```
save-shield/
├── public/                    # Static assets
├── supabase/migrations/       # Database schema SQL
├── src/
│   ├── __tests__/             # Unit tests
│   ├── components/
│   │   ├── layout/            # AppLayout, Sidebar, Header, MobileNav
│   │   └── ui/                # Button, Card, Badge, Modal, Input, etc.
│   ├── lib/
│   │   ├── constants.ts       # App constants
│   │   ├── database.ts        # Database operations (CRUD)
│   │   └── supabase.ts        # Supabase client
│   ├── pages/                 # All 19 page components
│   ├── services/
│   │   ├── riskEngine.ts      # Risk assessment logic
│   │   └── packetValidator.ts # SOS packet validation
│   ├── stores/
│   │   ├── authStore.ts       # Authentication state
│   │   ├── emergencyStore.ts  # Emergency state
│   │   ├── networkStore.ts    # Online/offline detection
│   │   └── simulationStore.ts # Demo simulation state
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Formatting utilities
│   ├── App.tsx                # Root component with routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── .env.example               # Environment variable template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 📄 License

This project is built for demonstration and hackathon purposes.
