# Frontend — App Jejum Bíblico

Frontend MVP para a aplicação de jejum bíblico personalizado.

**Tech Stack:**
- Next.js 14 (React 18 + TypeScript)
- Tailwind CSS + Custom Design System
- Zustand (State Management)
- TanStack Query (Server State)
- Axios (HTTP Client)
- API Mocks (Development)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env.local
# Edit .env.local if needed (default uses mocks)
```

3. **Start development server:**
```bash
npm run dev
```

App runs on `http://localhost:3000`

---

## 🎨 Features (Phase 1)

### ✅ Landing Page
- Hero section with brand messaging
- Auth form (login/register)
- Feature highlights
- Duration options overview
- Mobile responsive

### ✅ Wizard (4 Steps) — Ready to Build
- Step 1: Select objective (Cura, Sabedoria, Libertação, Dedicação)
- Step 2: Choose duration (3, 7, 21, 40 days)
- Step 3: Dietary restrictions
- Step 4: Start date picker
- Form validation
- Loading states

### ✅ Dashboard — Ready to Build
- Plan timeline (visual day-by-day)
- Daily checklist (prayer, meditation, meal)
- Progress tracking
- Community section (preview)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Landing page + Auth
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Tailwind + global styles
│   ├── wizard/
│   │   └── page.tsx        # Wizard (4 steps)
│   └── dashboard/
│       └── page.tsx        # Dashboard (plan + checklist)
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Toast.tsx
│   ├── Layout.tsx
│   └── index.ts            # Barrel export
├── api/
│   ├── index.ts            # API client (real/mock aware)
│   └── mocks.ts            # Mock data & generators
├── stores/
│   └── index.ts            # Zustand stores (auth, plan, ui)
├── types/
│   └── index.ts            # TypeScript interfaces
└── lib/
    └── (utilities)
```

---

## 🔄 API Integration

### Using Mocks (Development, No Backend Needed)

```bash
# Default: Uses mocks automatically
# Mock responses are instant and stored in localStorage
NEXT_PUBLIC_USE_MOCKS=true  # default
```

### Switching to Real Backend

```bash
# When backend is ready
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_USE_MOCKS=false
```

### Available Endpoints (both mocks and real)

```javascript
// Auth
authAPI.register(email, password)      // POST /auth/register
authAPI.login(email, password)         // POST /auth/login

// Plans
plansAPI.create(objective, duration, restrictions, start_date)
plansAPI.getById(planId)
plansAPI.getAll()
plansAPI.updateStatus(planId, status)

// Content
contentAPI.getPrayers(type?)
contentAPI.getMeditations(duration?)
contentAPI.getMeals(restrictions?)
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm test:watch
```

---

## 📱 Responsive Design

- **Mobile First:** Designed for iPhone 12+
- **Breakpoints:**
  - sm: 640px
  - md: 768px
  - lg: 1024px
- **Touch Targets:** Minimum 44x44px
- **Accessibility:** WCAG AA compliant

---

## 🎨 Design System

### Colors
- **Primary:** #2C5F2D (Green)
- **Secondary:** #D4A574 (Gold)
- **Accent:** #E74C3C (Red)
- **Background:** #F9F7F4 (Off-white)
- **Text:** #2C3E50 (Charcoal)

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)
- **Code:** IBM Plex Mono (monospace)

### Spacing
- Unit: 8px
- Standard gaps: 8, 16, 24, 32, 48px

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Vercel automatically detects Next.js and deploys
# Just push to GitHub!

# Manual deployment:
npm run build
vercel
```

### Environment Variables (Production)

```
NEXT_PUBLIC_API_URL=https://api.example.com/api
NEXT_PUBLIC_USE_MOCKS=false
```

---

## 📊 Architecture Highlights

### State Management (Zustand)
```typescript
// Authentication
const { user, token, setUser, setToken, logout } = useAuthStore();

// Plans & Daily Tasks
const { currentPlan, dailyTasks, setCurrentPlan, completeTask } = usePlanStore();

// UI State
const { isLoading, error, setLoading, setError } = useUIStore();
```

### API Client with Dual Mode
```typescript
// Automatically switches between mocks and real API
const response = await plansAPI.create(objective, duration, restrictions, start_date);
// Behind the scenes: checks NEXT_PUBLIC_USE_MOCKS and routes accordingly
```

### Component Patterns
```typescript
// Reusable, composable components
<Button variant="primary" size="lg" isLoading={isLoading}>
  Click me
</Button>

<Input label="Email" error={error} required />

<Card isSelected={isSelected} onClick={handleSelect}>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

---

## ⚠️ Known Limitations (MVP)

- No offline support
- No progressive image loading
- No service workers yet
- Mock data uses localStorage (not persistent between browsers)
- No dark mode

---

## 📝 Next Steps

1. Build Wizard component (4 steps)
2. Build Dashboard component
3. Connect to real backend (after backend deploy)
4. Add E2E tests (Playwright)
5. Performance audit & optimization
6. Deploy to Vercel

---

**Status:** Landing Page Complete, Wizard & Dashboard Ready to Build  
**Last Updated:** 2026-02-19
