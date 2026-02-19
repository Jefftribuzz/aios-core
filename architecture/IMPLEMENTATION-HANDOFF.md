# Implementation Handoff Document

**From:** Aria (Architect)  
**To:** @dev (Backend & Frontend)  
**Project:** App Jejum Bíblico MVP  
**Date:** 2026-02-18  
**Status:** Ready for Hand-off

---

## 🎯 Purpose

Este documento facilita o handoff da arquitetura para implementação. Cada dev tem exatamente o que precisa — sem ambiguidades.

---

## 📦 Backend Developer Handoff

### Your Task: Implement Express Backend

**Files You Need to Read (in order):**

1. ✅ `/architecture/api-reference-v1.0.md` — **START HERE**
   - Todos endpoints documentados
   - Request/response schemas exatos
   - Error codes padronizados

2. ✅ `/architecture/app-jejum-biblico-fullstack-v1.0.md` → Section "Backend Architecture"
   - Folder structure
   - Services breakdown
   - Plan generation algorithm
   - Security measures

3. ✅ `/architecture/app-jejum-biblico-fullstack-v1.0.md` → Section "Data Models"
   - Exactly what database tables you need
   - Field types
   - Relations

---

### Before You Start Coding

**Ask yourself:**

- [ ] Entendo todos 12 endpoints?
- [ ] Entendo o algoritmo de geração de planos?
- [ ] Conheço as tabelas que preciso criar?
- [ ] Sei por quê PostgreSQL e Redis?

**If NO to any:** Ask me (Aria) or re-read the docs.

---

### Your week 1 Todo

```
Day 1: Setup
├─ Clone Node.js + Express scaffold
├─ Setup PostgreSQL connection (Supabase)
├─ Setup Redis connection (Upstash)
└─ Configure environment variables

Day 2-3: Authentication
├─ Implement POST /api/auth/register
├─ Implement POST /api/auth/login  
├─ Implement JWT middleware
└─ Write unit tests

Day 4-5: Plans & Plan Generation
├─ Create database migrations (all 13 tables)
├─ Implement POST /api/plans (core logic!)
├─ Implement GET /api/plans
├─ Implement GET /api/plans/:id
└─ TEST THOROUGHLY

Day 6: Content & Progress
├─ Implement GET /api/content/prayers
├─ Implement GET /api/content/meditations
├─ Implement POST /api/user/checkin
├─ Add Redis caching for content

Day 7: Polish
├─ Error handling completeness
├─ Request validation (Zod)
├─ Logging setup
├─ Documentation finalized
```

---

### Critical Implementation Details

#### 1. Plan Generation Algorithm

This is THE CORE of your backend. Here's pseudocode:

```typescript
async function generatePlan(
  objective: string,           // 'cura', 'sabedoria', etc.
  duration: number,            // 3, 7, 21, 40
  restrictions: string[],      // ['vegetarian']
  start_date: Date,
): Promise<DailyTask[]> {
  
  // 1. Select prayers matching objective
  const prayers = await db.prayers.find({ 
    where: { type: objective, status: 'active' }
  });
  
  // 2. Loop through each day
  const dailyTasks = [];
  for (let day = 1; day <= duration; day++) {
    
    // 3. Calculate difficulty progression
    const progressFactor = computeProgression(day, duration);
    // Results in: 0.4 (easy) → 0.5-0.8 (medium) → 0.9 (intense)
    
    // 4. Select prayer for this day (round-robin)
    const prayer = prayers[day % prayers.length];
    
    // 5. Select meditation matching progression
    const meditation = await selectMeditation({
      objective,
      difficulty: progressFactor,
      duration_max: 20
    });
    
    // 6. Select meal (respect restrictions!)
    const meal = await selectMeal({
      restrictions,
      calories_max: 600,
      difficulty: progressFactor
    });
    
    // 7. Create daily task entry
    dailyTasks.push({
      day_number: day,
      prayer_id: prayer.id,
      meditation_id: meditation.id,
      meal_id: meal.id,
      scheduled_for: addDays(start_date, day - 1)
    });
  }
  
  // 8. Save everything
  const plan = await db.plans.create({
    user_id: authenticated_user_id,
    objective,
    duration,
    start_date,
    status: 'active'
  });
  
  // 9. Bulk insert daily tasks
  await db.daily_tasks.createMany(
    dailyTasks.map(t => ({ ...t, plan_id: plan.id }))
  );
  
  // 10. Cache invalidation
  await redis.del(`user:${user_id}:plans`);
  
  return dailyTasks;
}
```

**Testing:**
- Test with objective='cura' duration=7 → verify generates 7 days
- Test with restrictions=['vegetarian'] → verify meals are vegetarian
- Test progression factor (day 1 < day 7) → meals get more challenging

---

#### 2. Error Handling (Non-negotiable)

Use this error class everywhere:

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string
  ) {
    super(message);
  }
}

// Usage:
try {
  if (!user) {
    throw new AppError(404, 'User not found', 'NOT_FOUND');
  }
} catch (err) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ 
      error: { code: err.code, message: err.message } 
    });
  }
  // Unexpected error
  logger.error('Unexpected error', err);
  return res.status(500).json({ 
    error: { code: 'INTERNAL_ERROR', message: 'Server error' } 
  });
}
```

---

#### 3. Request Validation (Zod)

For POST /api/plans:

```typescript
import { z } from 'zod';

const CreatePlanSchema = z.object({
  objective: z.enum(['cura', 'sabedoria', 'libertacao', 'dedicacao']),
  duration: z.enum([3, 7, 21, 40]).transform(Number),
  restrictions: z.array(z.string()).optional(),
  start_date: z.coerce.date(),
  timezone: z.string().optional().default('UTC')
});

// Middleware
app.post('/api/plans', (req, res, next) => {
  const result = CreatePlanSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request',
        details: result.error.issues
      }
    });
  }
  req.validated = result.data;
  next();
});
```

---

#### 4. Caching Strategy

For GET /api/content/prayers:

```typescript
async function getPrayers(type?: string) {
  // 1. Check Redis cache
  const cacheKey = `prayers:${type || 'all'}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached); // Sub-millisecond ⚡
  }
  
  // 2. Query database
  const prayers = await db.prayers.find({
    where: { status: 'active', ...(type && { type }) }
  });
  
  // 3. Set cache (1 hour TTL)
  await redis.setex(cacheKey, 3600, JSON.stringify(prayers));
  
  return prayers;
}

// Cache invalidation when admin updates prayers
async function updatePrayer(id: string, updates: any) {
  const prayer = await db.prayers.update(id, updates);
  
  // Invalidate relevant cache keys
  await redis.del(`prayers:${prayer.type}`);
  await redis.del('prayers:all');
  
  return prayer;
}
```

---

#### 5. Rate Limiting

For prevent abuse:

```typescript
import RedisStore from 'rate-limit-redis';

const limiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rate-limit:'
  }),
  windowMs: 60 * 1000,     // 1 minute window
  max: 50,                 // 50 requests per window
  message: 'Too many requests'
});

// Apply to sensitive endpoints
app.post('/api/plans', limiter, async (req, res) => {
  // ...
});
```

---

#### 6. Logging with Pino

```typescript
import pino from 'pino';

const logger = pino(
  pino.transport({
    target: 'pino-pretty',
    options: { colorize: true }
  })
);

// Usage
logger.info('Plan created', { userId, planId, duration });
logger.error('Database connection failed', { error: err.message });

// Avoid logging sensitive data
logger.debug('User', { email, /* NO password! */ });
```

---

### Files You'll Create

```
backend/
├── src/
│   ├── index.ts              # Entry point (setup Express)
│   ├── config/
│   │   ├── env.ts            # Validate env vars
│   │   └── database.ts       # Supabase client
│   ├── api/
│   │   ├── middleware/
│   │   │   ├── auth.ts       # JWT verification
│   │   │   ├── validation.ts # Zod validation
│   │   │   └── errors.ts     # Global error handler
│   │   └── routes/
│   │       ├── auth.ts       # /api/auth/*
│   │       ├── plans.ts      # /api/plans/*
│   │       ├── content.ts    # /api/content/*
│   │       └── progress.ts   # /api/user/*
│   ├── services/
│   │   ├── plan-generator.ts # CORE ALGORITHM HERE
│   │   ├── auth-service.ts
│   │   ├── plan-service.ts
│   │   ├── content-service.ts
│   │   └── cache-service.ts
│   ├── db/
│   │   ├── migrations/       # SQL files (.sql)
│   │   └── seeds/            # Seed data
│   └── utils/
│       ├── logger.ts
│       ├── errors.ts
│       └── jwt.ts
├── tests/
│   ├── unit/
│   │   ├── plan-generator.test.ts
│   │   ├── auth-service.test.ts
│   │   └── ...
│   └── integration/
│       ├── auth.test.ts
│       ├── plans.test.ts
│       └── ...
├── Dockerfile
├── package.json
├── tsconfig.json
└── .env.example
```

---

### Questions to Ask Before Starting

1. **JWT Secret:** Where will you store? (Railway env vars)
2. **Supabase Connection:** Do you have credentials ready?
3. **Redis Connection:** Do you have Upstash URL ready?
4. **Content Seeding:** Should I provide SQL to seed 30 prayers/meditations?

**If you don't have:** Ask @po or create dummy data for MVP.

---

---

## 🎨 Frontend Developer Handoff

### Your Task: Implement Next.js Frontend

**Files You Need to Read (in order):**

1. ✅ `/architecture/api-reference-v1.0.md` — **START HERE**
   - Todos endpoints (você vai chamar eles)
   - Request/response schemas (type-safe)
   - Error codes (para tratamento)

2. ✅ `/architecture/app-jejum-biblico-fullstack-v1.0.md` → Section "Frontend Architecture"
   - Component structure
   - State management (Zustand + TanStack Query)
   - Folder layout
   - Data fetching patterns

3. ✅ `/projetos/vsl-jejum-biblico/APP-PRIMEIROS-PASSOS.md` → Quick reference

---

### Before You Start Coding

**Ask yourself:**

- [ ] Entendo quais são os 4 steps do wizard?
- [ ] Entendo o dashboard layout?
- [ ] Conheço TanStack Query e Zustand?
- [ ] Entendo a API contract (todos endpoints)?

**If NO to any:** Ask me (Aria) or re-read the docs.

---

### Your Week 1 Todo

```
Day 1: Setup
├─ Clone Next.js 14 scaffold
├─ Setup Tailwind CSS + Shadcn/ui
├─ Setup Zustand stores (auth, plans, ui)
└─ Setup environment variables

Day 2: Landing Page
├─ Build hero section
├─ Build features/benefits section
├─ Build CTA button
└─ Make responsive (mobile-first)

Day 3: Wizard - Core
├─ Build WizardContainer component (progress bar)
├─ Build Step1Objective (radio buttons)
├─ Build Step2Duration (cards)
├─ Setup form state (Zustand)

Day 4: Wizard - Completion
├─ Build Step3Restrictions (checkboxes)
├─ Build Step4StartDate (date picker)
├─ Build TanStack Query mutation (POST /api/plans)
├─ Handle loading/error states

Day 5: Dashboard - Layout
├─ Build DashboardLayout (header + sidebar)
├─ Build PlanTimeline (visual progress)
├─ Build DailyDetail component
└─ TanStack Query for GET /api/plans/:id

Day 6: Dashboard - Checklist
├─ Build DailyChecklist (3-4 items per day)
├─ Build check-in flow (prayer, meditation, meal)
├─ Implement optimistic updates
├─ POST /api/user/checkin integration

Day 7: Polish
├─ Error boundaries & loading states
├─ Toast notifications (Sonner)
├─ Mobile optimization (44px touch targets)
├─ Performance audit (Lighthouse)
```

---

### Critical Implementation Details

#### 1. Component Architecture

```typescript
// Landing Page (SSG - cached 1 hour)
// pages/index.tsx
export const revalidate = 3600; // ISR

export default function Landing() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <SignupPreview />
      <Footer />
    </>
  );
}

// Wizard Page (SSR + client state)
// app/wizard/page.tsx
'use client';

export default function WizardPage() {
  const [step, setStep] = useState(1);
  
  return (
    <WizardContainer>
      <WizardProgress step={step} />
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      {step === 4 && <Step4 onComplete={() => goToDashboard()} />}
    </WizardContainer>
  );
}

// Dashboard (SSR + realtime updates via SWR)
// app/dashboard/page.tsx
'use client';

export default function Dashboard() {
  const { data: plan, isLoading } = useGetPlan(planId);
  
  if (isLoading) return <DashboardSkeleton />;
  
  return (
    <DashboardLayout>
      <PlanTimeline plan={plan} />
      <DailyChecklist day={selectedDay} />
      <StatsCard />
    </DashboardLayout>
  );
}
```

---

#### 2. State Management (Zustand + TanStack Query)

```typescript
// store/authStore.ts
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token, isAuthenticated: !!token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false })
}));

// hooks/useCreatePlan.ts
import { useMutation } from '@tanstack/react-query';

export function useCreatePlan() {
  return useMutation({
    mutationFn: async (config: CreatePlanRequest) => {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Success toast + redirect
      toast.success('Plano criado com sucesso!');
      router.push(`/dashboard/${data.plan.id}`);
    },
    onError: (error) => {
      // Error toast
      toast.error(error.message || 'Erro ao criar plano');
    }
  });
}
```

---

#### 3. Data Fetching Pattern

```typescript
// app/dashboard/[planId]/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';

export default function Dashboard({ params }: { params: { planId: string } }) {
  // TanStack Query handles caching, refetching, etc.
  const { data: plan, isLoading, error } = useQuery({
    queryKey: ['plans', params.planId],
    queryFn: () => api.plans.get(params.planId),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 30 * 60 * 1000,     // 30 minutes (formerly cacheTime)
  });

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <ErrorFallback error={error} />;
  
  return <Dashboard plan={plan} />;
}

// api/client.ts
import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' }
});

// Auto-attach JWT token
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (redirect to login)
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.setState({ isAuthenticated: false });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  plans: {
    create: (config: CreatePlanRequest) => 
      client.post('/api/plans', config).then(r => r.data),
    get: (id: string) => 
      client.get(`/api/plans/${id}`).then(r => r.data),
    list: () => 
      client.get('/api/plans').then(r => r.data),
  },
  // ... other endpoints
};
```

---

#### 4. Wizard Component

```typescript
// components/wizard/WizardContainer.tsx
'use client';

import { useState } from 'react';
import { Step1Objective } from './Step1Objective';
import { Step2Duration } from './Step2Duration';
import { Step3Restrictions } from './Step3Restrictions';
import { Step4StartDate } from './Step4StartDate';
import { WizardProgress } from './WizardProgress';

export function WizardContainer() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    objective: '',
    duration: 0,
    restrictions: [],
    start_date: new Date()
  });

  const handleNext = () => {
    // Validate current step
    if (isStepValid(step, formData)) {
      setStep(step + 1);
    }
  };

  const handleComplete = () => {
    // Submit form (mutation calls backend)
    createPlan.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <WizardProgress step={step} />
      
      {step === 1 && (
        <Step1Objective 
          value={formData.objective}
          onChange={(val) => setFormData({ ...formData, objective: val })}
        />
      )}
      
      {step === 2 && (
        <Step2Duration
          value={formData.duration}
          onChange={(val) => setFormData({ ...formData, duration: val })}
        />
      )}
      
      {/* ... more steps ... */}
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          Anterior
        </Button>
        
        {step < 4 ? (
          <Button onClick={handleNext}>Próximo</Button>
        ) : (
          <Button onClick={handleComplete} variant="primary">
            Gerar Plano
          </Button>
        )}
      </div>
    </div>
  );
}
```

---

#### 5. Dashboard Timeline

```typescript
// components/dashboard/PlanTimeline.tsx
'use client';

export function PlanTimeline({ plan, dailyTasks }: Props) {
  const today = new Date();
  
  return (
    <div className="space-y-4">
      {dailyTasks.map((task, index) => {
        const isToday = isDateToday(task.scheduled_for);
        const isCompleted = task.prayer_completed && 
                           task.meditation_completed && 
                           task.meal_logged;
        
        return (
          <Card
            key={task.id}
            className={`border-2 ${
              isToday ? 'border-primary bg-blue-50' :
              isCompleted ? 'border-green-300 bg-green-50' :
              'border-gray-200'
            }`}
          >
            <CardHeader>
              <h3 className="text-lg font-semibold">
                Dia {task.day_number}
                {isToday && <span className="ml-2 badge">Hoje</span>}
                {isCompleted && <span className="ml-2 badge variant-success">✓</span>}
              </h3>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <Checkbox 
                  label="Oração"
                  checked={task.prayer_completed}
                  onChange={() => markPrayerComplete(task.id)}
                />
                <Checkbox
                  label="Meditação"
                  checked={task.meditation_completed}
                  onChange={() => markMeditationComplete(task.id)}
                />
                <Checkbox
                  label="Refeição"
                  checked={task.meal_logged}
                  onChange={() => markMealLogged(task.id)}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
```

---

#### 6. Mobile Responsiveness

```typescript
// Make sure all interactive elements are 44x44 minimum
<Button className="w-full h-12"> {/* Instead of h-8 */}
  Click me
</Button>

// Vertical stacking on mobile
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Card>Content 1</Card>
  <Card>Content 2</Card>
</div>

// Touch-friendly spacing
<div className="space-y-6 md:space-y-4"> {/* More spacing on mobile */}
  {items.map(item => <Item key={item.id} {...item} />)}
</div>
```

---

### Files You'll Create

```
frontend/
├── app/
│   ├── layout.tsx            # Root layout (Providers)
│   ├── page.tsx              # Landing (/)
│   ├── wizard/
│   │   └── page.tsx          # Wizard (/wizard)
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Dashboard list (/dashboard)
│   │   └── [planId]/
│   │       └── page.tsx      # Plan detail (/dashboard/[planId])
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts
│   │       └── register/route.ts
│   └── error.tsx, layout.tsx, etc.
├── components/
│   ├── wizard/
│   │   ├── WizardContainer.tsx
│   │   ├── Step1Objective.tsx
│   │   ├── Step2Duration.tsx
│   │   ├── Step3Restrictions.tsx
│   │   ├── Step4StartDate.tsx
│   │   └── WizardProgress.tsx
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── PlanTimeline.tsx
│   │   ├── DailyChecklist.tsx
│   │   ├── StatsCard.tsx
│   │   └── DailyDetail.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── skeletons/
│       ├── PlanSkeleton.tsx
│       └── DailySkeleton.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── usePlan.ts
│   ├── useGetPlan.ts
│   ├── useCreatePlan.ts
│   ├── useProgress.ts
│   └── useContent.ts
├── store/
│   ├── authStore.ts
│   ├── planStore.ts
│   └── uiStore.ts
├── api/
│   └── client.ts            # Axios instance + all endpoints
├── types/
│   └── index.ts             # Shared with backend
├── utils/
│   ├── date.ts
│   ├── formatting.ts
│   └── validation.ts
├── styles/
│   ├── globals.css
│   └── variables.css
├── tests/
│   ├── components/
│   ├── hooks/
│   └── pages/
├── Dockerfile
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── .env.example
```

---

### Questions to Ask Before Starting

1. **Shadcn/ui Setup:** Know how to install components? (npx shadcn-ui@latest add button)
2. **TanStack Query/Zustand:** Used both before?
3. **Tailwind Workflow:** Know how to use utility classes?
4. **Next.js App Router:** Familiar with file-based routing?

**If NO to any:** Ask me (Aria) or watch quick tutorials.

---

---

## 🤝 Coordination Between Backend & Frontend

### Parallel Development Strategy

**Week 1:**
- **Backend:** Database schema + auth endpoints
- **Frontend:** Landing page + wizard UI (mock data first)

**Week 2:**
- **Backend:** Plans generation + GET endpoints
- **Frontend:** Connect wizard to real API, test with backend

**Week 3:**
- **Backend:** Content endpoints + caching
- **Frontend:** Dashboard + daily checklist

**Week 4:**
- **Both:** Integration testing, performance audit, deployment

---

### API Contract is Source of Truth

If backend dev changes an endpoint:
1. **Update** `/architecture/api-reference-v1.0.md` FIRST
2. **Then** implement backend
3. **Frontend dev** reads updated doc → stays synced

**Meeting Point:** Post changes to #dev-backend #dev-frontend channels

---

### Daily Sync

**Daily standup (15 min):**
- What I did yesterday
- What I'm doing today
- Blocking issues

**If blocked:**
- API contract unclear? → Ask @architect (Aria)
- Database schema unclear? → Ask @data-engineer
- Deployment issue? → Ask @devops (Gage)

---

## ✅ Sign-Off

**Architecture team confirms:**
- ✅ Design is complete
- ✅ No ambiguities in API contract
- ✅ Data models are final
- ✅ Tech stack is approved
- ✅ Developers have everything needed

**Backend dev:** Ready to start?
**Frontend dev:** Ready to start?

**If YES:** Delete mock data, connect real APIs, and let's ship! 🚀

---

**Approved by:** Aria, Holistic System Architect ✅  
**Date:** 2026-02-18  
**Status:** READY FOR IMPLEMENTATION

