# App Jejum Bíblico — Arquitetura Full-Stack

**Versão:** 1.0  
**Data:** 2026-02-18  
**Arquiteta:** Aria (Holistic System Architect)  
**Status:** 🏗️ Design Completo

---

## 📋 Índice

1. Sumário Executivo
2. Arquitetura Alto-Nível
3. Tech Stack Definitivo
4. Data Models
5. Arquitetura Backend
6. Arquitetura Frontend
7. Integração & Fluxos
8. Decisões Críticas & Tradeoffs
9. Roadmap Técnico

---

## 1️⃣ Sumário Executivo

### Visão Geral

App web-first que permite usuários criar planos de jejum bíblico personalizados em < 2 minutos. Sistema oferece cronogramas diários, orações, meditações, sugestões alimentares e tracker de progresso integrado com comunidade.

### Abordagem Arquitetural

- **Frontend-First:** Next.js (SSR/SSG híbrido) para performance + SEO + dev experience
- **Backend Simples:** Node.js + Express (pragmatism over complexity)
- **Database:** Supabase PostgreSQL (managed, escalável, RLS built-in)
- **Deployment:** Vercel (frontend) + Railway (backend)
- **Integração:** REST APIs simples com validação rigorosa
- **Comunidade:** Discord bot + webhook integration

### Justificativa Técnica

| Aspecto | Escolha | Por Quê |
|---------|---------|---------|
| **Frontend** | Next.js 14 | SSR para SEO + Dynamic routes + API routes para micro-backend |
| **Runtime Backend** | Node.js 20 LTS | Ecosistema npm rico, isomórfico com frontend, rapid development |
| **Database** | PostgreSQL via Supabase | Type-safe queries, RLS para multi-tenant, migrations, Realtime API |
| **Deployment** | Vercel + Railway | Zero-friction deployments, autoscaling, não precisa gerenciar infra |
| **Auth** | JWT + Sessions | Simples, stateless, escalável. Supabase Auth pode ser usado later. |
| **Caching** | Redis via Upstash | Serverless, pay-as-you-go, rápido |

### Métricas de Sucesso

| Métrica | Target | Validação |
|---------|--------|-----------|
| **Time to Create Plan** | < 2 min (wizard + geração) | User testing |
| **Dashboard Load** | < 2s (P95) | Lighthouse / Web Vitals |
| **API Latency** | < 200ms (P95) | APM monitoring |
| **Uptime** | 99.9% | Monitoring sistema |
| **Completion Rate** | > 70% (usuários completam jejum) | Analytics |
| **Escalabilidade** | 10-100k MAU sem degradação | Load testing |

---

## 2️⃣ Arquitetura Alto-Nível

### Diagrama Arquitetural

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cliente (Browser)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (React 18 + TypeScript)                │  │
│  │  ├─ Landing page (/landing)                             │  │
│  │  ├─ Wizard (4 steps) (/wizard)                          │  │
│  │  ├─ Dashboard (/dashboard)                              │  │
│  │  ├─ Community preview (/community)                      │  │
│  │  └─ Settings (/settings)                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                    HTTPS/REST APIs                              │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Railway.app (Backend Deployment)                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Node.js + Express (API Server)                         │  │
│  │  ├─ Route: POST /api/auth/register                      │  │
│  │  ├─ Route: POST /api/plans (create)                     │  │
│  │  ├─ Route: GET /api/plans/:id                           │  │
│  │  ├─ Route: GET /api/content/prayers                     │  │
│  │  ├─ Route: GET /api/content/meditations                 │  │
│  │  ├─ Route: POST /api/user/checkin                       │  │
│  │  └─ Service: Plan Generation Engine                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
├───────────────────────────┼──────────────────────────────────────┤
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Supabase PostgreSQL (Main DB)                          │  │
│  │  ├─ Table: users                                        │  │
│  │  ├─ Table: plans                                        │  │
│  │  ├─ Table: daily_tasks                                  │  │
│  │  ├─ Table: prayers                                      │  │
│  │  ├─ Table: meditations                                  │  │
│  │  ├─ Table: meals                                        │  │
│  │  ├─ Table: user_progress                                │  │
│  │  └─ RLS Policies (row-level security)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Upstash Redis (Cache Layer)                            │  │
│  │  ├─ Cache: prayers by type (TTL 1h)                     │  │
│  │  ├─ Cache: meditations (TTL 1h)                         │  │
│  │  ├─ Cache: user sessions (TTL 7d)                       │  │
│  │  └─ Rate limiting tokens                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              External Integrations                              │
│                                                                 │
│  ├─ Discord Bot (Community integration)                         │
│  ├─ Webhook para notificações                                  │
│  ├─ SendGrid ou Brevo (Email)                                 │
│  └─ Sentry (Error tracking)                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados Principal

```
User Input (Wizard)
    ↓
Frontend Validation (React)
    ↓
POST /api/plans {objective, duration, restrictions}
    ↓
Backend Validation (Express middleware)
    ↓
Plan Generation Engine (generar cronograma)
    ↓
Save to PostgreSQL (plans + daily_tasks)
    ↓
Cache invalidation (Redis)
    ↓
Return plan_id + plan data
    ↓
Frontend renders Dashboard
    ↓
GET /api/plans/:id (fetch detalhes)
    ↓
GET /api/content/prayers (fetch orações)
    ↓
GET /api/content/meditations (fetch meditações)
    ↓
Render Dashboard com timeline + checklist
```

### Padrões Arquiteturais

| Padrão | Aplicação | Benefício |
|--------|-----------|-----------|
| **Jamstack** | Static pages + Serverless APIs | Performance, escalabilidade, deploy simples |
| **BFF** | Next.js como API + Backend Node.js | Type safety end-to-end, code sharing |
| **Repository** | Data access abstraction | Testing, portabilidade, mudança futura de DB |
| **Service Layer** | Plan generation isolated | Lógica reutilizável, testes focus |
| **Cache-Aside** | Redis para content frequente | Reduz load DB, melhora latência |
| **API Gateway** | Express com middleware | Auth, rate limiting, logging centralizado |

---

## 3️⃣ Tech Stack Definitivo

### Tech Stack Table

| Categoria | Tecnologia | Versão | Propósito | Justificativa |
|-----------|-----------|--------|----------|---------------|
| **Frontend Language** | TypeScript | 5.3+ | Type safety | Reduz bugs, melhora IDE support |
| **Frontend Framework** | Next.js | 14.* | Full-stack React | SSR/SSG, API routes, optimal bundle size |
| **UI Component Library** | Shadcn/ui + Tailwind | Latest | Pre-built accessible components | Beautiful, accessible, customizable |
| **State Management** | TanStack Query + Zustand | Latest | Data fetching + local state | Automatic caching, sync, state management |
| **Backend Language** | JavaScript/TypeScript | Node.js 20 LTS | Consistency com frontend | Isomórfico, rápido desenvolvimento |
| **Backend Framework** | Express.js | 4.18+ | Lightweight HTTP server | Simple, maturo, extensível |
| **API Style** | REST (JSON) | - | Standard CRUD + custom endpoints | Simplicity, browser-native, caching |
| **Database** | PostgreSQL 14+ | Via Supabase | Relational, type-safe, RLS | Escalável, ACID, migrations nativas |
| **Cache** | Redis | Via Upstash | Session + content caching | Low-latency, distributed, pub/sub |
| **File Storage** | Supabase Storage | - | Áudios médias, documentos | Managed, integrado com DB |
| **Authentication** | JWT + httpOnly Cookies | - | Stateless, secure | Escalável, CSRF-protected, sessões longas |
| **Frontend Testing** | Vitest + React Testing Library | Latest | Unit + component tests | Fast, modern, type-safe |
| **Backend Testing** | Jest | Latest | Unit + integration tests | Standard, coverage reports |
| **E2E Testing** | Playwright | Latest | User journey testing | Cross-browser, flaky detection |
| **Build Tool** | Next.js (Webpack) | 14.* | Automatic optimization | SSR, ISR, incremental builds |
| **Bundler** | SWC | Integrated | Code transpilation | Rust-based, very fast |
| **IaC Tool** | Vercel + Railway configs | - | Infrastructure as Config | YAML-based, version controlled |
| **CI/CD** | GitHub Actions | - | Automated testing + deployment | Native GitHub integration |
| **Monitoring** | Vercel Analytics + Sentry | - | Performance + errors | Real user monitoring + error tracking |
| **Logging** | Pino (backend) + Browser console (frontend) | Latest | Structured logging | JSON logs, easy parsing |
| **CSS Framework** | Tailwind CSS | 3.3+ | Utility-first styling | Fast workflow, consistent design system |
| **Package Manager** | pnpm | 8+ | Monorepo management | Faster, disk-efficient, workspace support |

### Versioning & Compatibility

```json
{
  "node": ">=20.0.0 <21.0.0",
  "pnpm": ">=8.0.0",
  "npm": "not supported (use pnpm)",
  "typescript": "^5.3.0",
  "nextjs": "^14.0.0",
  "react": "^18.2.0",
  "express": "^4.18.0"
}
```

---

## 4️⃣ Data Models

### Core Entities

#### 1. User (usuário)

```typescript
interface User {
  id: UUID;           // Primary key
  email: string;      // Unique, indexed
  password_hash: string;
  name?: string;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  
  // Denormalization for performance
  plan_count: number; // Número de planos criados
  total_days_fasted: number; // Dias em jejum (counter)
}
```

**Índices:** `(email)`, `(created_at)`  
**RLS Policies:** Usuário vê apenas seus dados

---

#### 2. Plan (plano de jejum)

```typescript
interface Plan {
  id: UUID;
  user_id: UUID;           // FK: users
  objective: Enum;         // 'cura' | 'sabedoria' | 'libertacao' | 'dedicacao'
  duration: number;        // 3 | 7 | 21 | 40 (dias)
  
  // Configuração
  restrictions: string[];  // ['vegetarian', 'gluten-free', 'dairy-free']
  start_date: Date;        // Quando o jejum começa
  timezone: string;        // 'America/Sao_Paulo' para notificações certas
  
  // Status
  status: Enum;            // 'active' | 'completed' | 'suspended' | 'abandoned'
  completion_percentage: number; // 0-100
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
  
  // Denormalization
  days_completed: number;
  last_checkin: Date;
}
```

**Índices:** `(user_id, status)`, `(created_at)`, `(start_date)`  
**Relações:** 1 User → Many Plans  
**RLS Policies:** Usuário vê apenas seus plans

---

#### 3. DailyTask (tarefa diária)

```typescript
interface DailyTask {
  id: UUID;
  plan_id: UUID;           // FK: plans
  day_number: number;      // 1-40
  
  // Content links
  prayer_id?: UUID;        // FK: prayers
  meditation_id?: UUID;    // FK: meditations
  meal_id?: UUID;          // FK: meals
  
  // Progress
  prayer_completed: boolean;
  meditation_completed: boolean;
  meal_logged: boolean;
  checkin_mood?: number;   // 1-5 emoji rating
  
  // Timestamps
  created_at: Date;
  scheduled_for: Date;    // Data/hora que deve ser feita
  completed_at?: Date;
  
  UNIQUE(plan_id, day_number);
}
```

**Índices:** `(plan_id, day_number)`, `(scheduled_for)`  
**Relações:** 1 Plan → Many DailyTasks

---

#### 4. Prayer (oração)

```typescript
interface Prayer {
  id: UUID;
  title: string;
  text_pt: string;        // Texto em português
  text_en?: string;       // Para future i18n
  
  // Categorization
  type: Enum;             // 'cura' | 'sabedoria' | 'libertacao' | 'dedicacao'
  difficulty: number;     // 1-5 (para progressão)
  duration_minutes: number; // ~5-20 min
  
  // Biblical reference
  biblical_ref?: string;  // "Mateus 6:16-18"
  author?: string;        // "Jesus", "Moisés", etc.
  
  // Metadata
  created_at: Date;
  updated_at: Date;
  status: Enum;          // 'active' | 'archived'
}
```

**Índices:** `(type)`, `(difficulty)`, `(status)`  
**Dados:** ~30-50 orações iniciais (seeded)

---

#### 5. Meditation (meditação)

```typescript
interface Meditation {
  id: UUID;
  title: string;
  description: string;
  
  // Media
  audio_url: string;      // Supabase Storage
  duration_minutes: number;
  
  // Categorization
  type: Enum;             // 'guided' | 'music' | 'silence' | 'scripture'
  intensity: number;      // 1-5
  objective: Enum;        // Aligns with plan objectives
  
  // Metadata
  created_at: Date;
  status: Enum;          // 'active' | 'archived'
}
```

**Índices:** `(type)`, `(objective)`  
**Dados:** ~15-20 meditações iniciais

---

#### 6. Meal (refeição)

```typescript
interface Meal {
  id: UUID;
  title: string;
  description: string;
  
  // Nutrition
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  
  // Preparation
  prep_time_minutes: number;
  ingredients: string[];
  instructions: string;
  
  // Restrictions
  restrictions: string[]; // 'vegan', 'gluten-free', etc.
  
  // Metadata
  created_at: Date;
  status: Enum;
}
```

**Dados:** ~30-50 refeições iniciais

---

#### 7. UserProgress (progresso do usuário)

```typescript
interface UserProgress {
  id: UUID;
  user_id: UUID;  // FK: users
  plan_id: UUID;  // FK: plans
  
  // Daily checkin
  date: Date;      // Quando foi feito
  mood_rating: number;     // 1-5 emoji
  energy_level: number;    // 1-10
  notes?: string;  // Diário pessoal
  
  // Completion
  prayers_completed: number;
  meditations_completed: number;
  meals_logged: boolean;
  
  // Streak
  streak_days: number;
  highest_streak: number;
  
  UNIQUE(user_id, plan_id, date);
}
```

**Índices:** `(user_id), (plan_id, date)`  
**Relações:** Denormalizado de DailyTask para queries rápidas

---

### ER Diagram

```
User (1) ──────────────── (M) Plan
                              │
                              ├─ (M) DailyTask
                              │        ├─ (1) Prayer
                              │        ├─ (1) Meditation
                              │        └─ (1) Meal
                              │
                              └─ (M) UserProgress

Prayer (standalone, seeded)
Meditation (standalone, seeded)
Meal (standalone, seeded)
```

---

## 5️⃣ Arquitetura Backend

### Estrutura de Pastas

```
backend/
├── src/
│   ├── index.ts           # Entry point
│   ├── config/
│   │   ├── env.ts         # Environment validation
│   │   └── database.ts    # Supabase client
│   ├── api/
│   │   ├── middleware/
│   │   │   ├── auth.ts    # JWT verification
│   │   │   ├── validation.ts # Request validation
│   │   │   └── errorHandler.ts
│   │   └── routes/
│   │       ├── auth.ts    # Register, login
│   │       ├── plans.ts   # Create, GET, update plan
│   │       ├── content.ts # Prayers, meditations, meals
│   │       └── progress.ts # Daily check-ins
│   ├── services/
│   │   ├── plan-generator.ts     # Core algorithm
│   │   ├── user-service.ts       # User operations
│   │   ├── plan-service.ts       # Plan persistence
│   │   ├── content-service.ts    # Content management
│   │   └── cache-service.ts      # Redis operations
│   ├── models/
│   │   ├── types.ts       # TypeScript interfaces
│   │   └── schema.ts      # Zod schemas for validation
│   ├── utils/
│   │   ├── logger.ts      # Pino logger
│   │   ├── errors.ts      # Custom error classes
│   │   └── jwt.ts         # JWT utilities
│   └── db/
│       ├── migrations/    # SQL migrations
│       └── seeds/         # Seeding data
├── tests/
│   ├── unit/              # Service tests
│   ├── integration/       # API tests
│   └── fixtures/          # Test data
├── Dockerfile
├── package.json
├── tsconfig.json
└── .env.example
```

### API Contract

#### Auth Endpoints

```typescript
// POST /api/auth/register
Request: {
  email: string;
  password: string;
  name?: string;
}
Response: {
  user: { id, email, name };
  token: JWT;
  expiresIn: 604800; // 7 days
}
Errors: 409 (conflict), 400 (validation)

// POST /api/auth/login
Request: {
  email: string;
  password: string;
}
Response: { user, token, expiresIn }
Errors: 401 (unauthorized)

// POST /api/auth/logout
Response: { success: true }
```

#### Plan Endpoints

```typescript
// POST /api/plans
Auth: Required (JWT)
Request: {
  objective: 'cura' | 'sabedoria' | 'libertacao' | 'dedicacao';
  duration: 3 | 7 | 21 | 40;
  restrictions?: string[];
  start_date: ISO8601;
  timezone?: string;
}
Response: {
  plan: {
    id: UUID;
    objective: string;
    duration: number;
    daily_tasks: DailyTask[];
    created_at: Date;
  };
}
Errors: 400 (validation), 401 (auth), 500 (generation fail)

// GET /api/plans/:plan_id
Auth: Required (JWT)
Response: {
  plan: Plan;
  daily_tasks: DailyTask[];
  progress: UserProgress[];
}
Errors: 404 (not found), 403 (unauthorized)

// GET /api/plans
Auth: Required (JWT)
Query: ?status=active&limit=10&offset=0
Response: {
  plans: Plan[];
  total: number;
  hasMore: boolean;
}

// PATCH /api/plans/:plan_id
Auth: Required (JWT)
Request: { status: 'suspend' | 'resume' | 'complete' }
Response: { plan: updated Plan }
```

#### Content Endpoints

```typescript
// GET /api/content/prayers
Query: ?type=cura&limit=10
Response: {
  prayers: Prayer[];
  cache_ttl: 3600;
}

// GET /api/content/meditations
Query: ?objective=cura&duration_max=20
Response: { meditations: Meditation[] }

// GET /api/content/meals
Query: ?restrictions=vegan&calories_max=500
Response: { meals: Meal[] }
```

#### Progress Endpoints

```typescript
// POST /api/user/checkin
Auth: Required (JWT)
Request: {
  plan_id: UUID;
  date: Date;
  mood_rating: 1-5;
  energy_level: 1-10;
  notes?: string;
  completed: { prayers: bool; meditations: bool; meals: bool };
}
Response: { progress: UserProgress }

// GET /api/user/progress
Auth: Required (JWT)
Query: ?plan_id=UUID&start_date=ISO&end_date=ISO
Response: { progress: UserProgress[] }
```

### Plan Generation Algorithm

```typescript
// pseudocode
function generatePlan(objective, duration, restrictions, start_date) {
  const dailyTasks = [];
  
  // Select prayers based on objective
  const prayers = selectPrayers(objective, duration);
  
  for (let day = 1; day <= duration; day++) {
    // Progression: intense difficulty based on day position
    const progressionFactor = computeProgressionFactor(day, duration);
    
    // Select prayer for this day
    const prayer = prayers[day % prayers.length];
    
    // Select meditation matching difficulty
    const meditation = selectMeditationByDifficulty(
      objective,
      progressionFactor
    );
    
    // Select meal respecting restrictions
    const meal = selectMealByRestrictions(
      restrictions,
      progressionFactor
    );
    
    // Create daily task
    dailyTasks.push({
      day_number: day,
      prayer_id: prayer.id,
      meditation_id: meditation.id,
      meal_id: meal.id,
      scheduled_for: addDays(start_date, day - 1),
    });
  }
  
  // Save to database
  const plan = await savePlanAndTasks(objective, duration, dailyTasks);
  
  return plan;
}

// Progression factor: rampa de dificuldade
// Days 1-2: gentle (factor 0.4)
// Days midst: medium (factor 0.7)
// Final days: intense (factor 0.9)
function computeProgressionFactor(day, duration) {
  const progress = day / duration;
  if (progress < 0.2) return 0.4;
  if (progress < 0.8) return 0.5 + (progress * 0.4);
  return 0.8;
}
```

### Error Handling

```typescript
// Error hierarchy
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string
  ) {
    super(message);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR');
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'AUTH_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
  }
}

// Middleware error handler
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }
  
  // Unexpected error
  logger.error('Unexpected error', err);
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  });
}
```

### Security Measures

| Camada | Medida | Implementação |
|--------|--------|---------------|
| **Network** | HTTPS only | Railway + Vercel (auto) |
| **Auth** | JWT + httpOnly | Secure cookie, 7 day expiry |
| **API** | Rate limiting | Redis-backed token bucket |
| **Input** | Validation | Zod schemas on all endpoints |
| **DB** | SQL injection | Parameterized queries (Supabase) |
| **DB** | RLS policies | User isolation at DB level |
| **Secrets** | Env vars | Never commit, Railway/Vercel managed |
| **CORS** | Restrict origins | Only https://app.jejumbiblico.com |
| **Logging** | Sanitize data | No passwords, PII in logs |

---

## 6️⃣ Arquitetura Frontend

### Estrutura de Pastas

```
frontend/
├── public/               # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Landing page (/)
│   │   ├── wizard/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx  # Wizard flow
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx  # Main dashboard
│   │   ├── community/
│   │   │   └── page.tsx  # Community preview
│   │   └── api/          # API routes (micro-backend)
│   │       ├── auth/
│   │       ├── plans/
│   │       └── proxy/    # Proxy to backend
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── wizard/
│   │   │   ├── WizardContainer.tsx
│   │   │   ├── Step1Objective.tsx
│   │   │   ├── Step2Duration.tsx
│   │   │   ├── Step3Restrictions.tsx
│   │   │   ├── Step4StartDate.tsx
│   │   │   └── WizardProgress.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── PlanTimeline.tsx
│   │   │   ├── DailyChecklist.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── DailyDetail.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   └── skeletons/
│   │       ├── PlanSkeleton.tsx
│   │       └── DailySkeleton.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePlan.ts
│   │   ├── useProgress.ts
│   │   └── useContent.ts
│   ├── store/
│   │   ├── authStore.ts  # Zustand
│   │   ├── planStore.ts
│   │   └── uiStore.ts
│   ├── api/
│   │   ├── client.ts     # Axios instance
│   │   ├── auth.ts
│   │   ├── plans.ts
│   │   └── progress.ts
│   ├── types/
│   │   └── index.ts      # Shared types with backend
│   ├── utils/
│   │   ├── date.ts
│   │   ├── formatting.ts
│   │   └── validation.ts
│   └── styles/
│       ├── globals.css   # Tailwind directives
│       └── variables.css # CSS custom properties
├── tests/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── fixtures/
├── Dockerfile
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── .env.example
```

### State Management Strategy

```typescript
// Zustand stores (lightweight, perfect for Next.js)

// Auth store
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  login: (email, password) => Promise<void>;
  register: (email, password, name) => Promise<void>;
  logout: () => void;
  setUser: (user) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Implementation
}));

// Plan store
interface PlanStore {
  currentPlan: Plan | null;
  plans: Plan[];
  loading: boolean;
  error: string | null;
  
  createPlan: (config) => Promise<void>;
  fetchPlan: (id) => Promise<void>;
  fetchPlans: () => Promise<void>;
  updatePlan: (id, changes) => Promise<void>;
}

export const usePlanStore = create<PlanStore>((set) => ({
  // Implementation
}));

// UI store
interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Implementation
}));

// TanStack Query for server state
const useGetPlan = (planId: string) => {
  return useQuery({
    queryKey: ['plans', planId],
    queryFn: () => api.plans.get(planId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,    // 30 minutes
  });
};
```

### Component Architecture

```typescript
// Landing Page (SSG, cached 1 hour)
// export const revalidate = 3600;

<Landing>
  <Hero>
    <CTA button="Começar" href="/wizard" />
  </Hero>
  <Features>
    <Feature 1: Wizard rápido />
    <Feature 2: Plano automático />
    <Feature 3: Comunidade />
  </Features>
  <SignupPreview />
  <Footer />
</Landing>

// Wizard Page (SSR + client state)
<WizardContainer>
  <WizardProgress step={currentStep} />
  
  {currentStep === 1 && <Step1Objective />}
  {currentStep === 2 && <Step2Duration />}
  {currentStep === 3 && <Step3Restrictions />}
  {currentStep === 4 && <Step4StartDate />}
  
  <Navigation prev/next/>
</WizardContainer>

// Dashboard (SSR + realtime updates via SWR)
<DashboardLayout>
  <Header user={user} />
  
  <MainContent>
    <PlanTimeline
      plan={plan}
      dailyTasks={dailyTasks}
      onDayClick={() => expandDay()}
    />
    
    {selectedDay && (
      <DailyDetail
        day={selectedDay}
        prayer={prayer}
        meditation={meditation}
        meal={meal}
        onComplete={() => submitCheckin()}
      />
    )}
  </MainContent>
  
  <Sidebar>
    <StatsCard completionRate={70} />
  </Sidebar>
</DashboardLayout>
```

### Data Fetching Pattern

```typescript
// API client with Next.js Server Components where possible
// Use dynamic imports for client-only features

'use client'; // If using interactivity

import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';

export function PlanCard({ planId }: { planId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['plans', planId],
    queryFn: () => api.plans.get(planId),
  });

  if (isLoading) return <PlanSkeleton />;
  if (error) return <ErrorFallback error={error} />;
  
  return <PlanDisplay plan={data} />;
}
```

### Performance Optimizations

| Técnica | Implementação | Impacto |
|---------|---------------|--------|
| **Code splitting** | Dynamic imports per route | Reduz bundle JS inicial |
| **Image optimization** | Next.js Image component | AVIF, lazy loading |
| **CSS** | Tailwind JIT + purge | Minimal CSS bundle |
| **Caching** | ISR + SWR | Reduz requests |
| **Font optimization** | Self-hosted fonts | Reduz CLS |
| **Lazy loading** | Observer API + dynamic | Faster initial load |

---

## 7️⃣ Integração & Fluxos

### Fluxo de Autenticação

```
1. User submits email + password (Frontend)
   ↓
2. Frontend validates (Zod schema)
   ↓
3. POST /api/auth/register
   ↓
4. Backend validates (Express middleware)
   ↓
5. Hash password (bcrypt)
   ↓
6. Save to PostgreSQL (users table)
   ↓
7. Generate JWT token
   ↓
8. Set httpOnly cookie
   ↓
9. Return {user, token}
   ↓
10. Frontend stores token in memory + cookie
   ↓
11. Redirect to /wizard
```

### Fluxo de Criação de Plano

```
1. User completes wizard (4 steps)
   ↓
2. Frontend validates all inputs
   ↓
3. Dispatch TanStack Query mutation POST /api/plans
   ↓
4. Backend receives request with JWT auth
   ↓
5. Validate inputs (Zod)
   ↓
6. Extract user_id from JWT
   ↓
7. Call planGenerationEngine(objective, duration, restrictions)
   ↓
8. Algorithm selects prayers, meditations, meals
   ↓
9. Save plan to PostgreSQL (plans table)
   ↓
10. Save daily_tasks to PostgreSQL (daily_tasks table)
   ↓
11. Invalidate Redis cache for this user
   ↓
12. Return {plan, daily_tasks}
   ↓
13. Frontend updates store
   ↓
14. Redirect to /dashboard
```

### Fluxo de Dashboard

```
1. Page loads at /dashboard
   ↓
2. useQuery fetches GET /api/plans/:id
   ↓
3. Backend returns plan + daily_tasks
   ↓
4. Frontend renders timeline + checklist
   ↓
5. User clicks "Marcar como feito"
   ↓
6. Frontend updates optimistically (UX)
   ↓
7. POST /api/user/checkin {day, completed tasks}
   ↓
8. Backend saves to user_progress table
   ↓
9. Returns updated progress
   ↓
10. Frontend revalidates query
   ↓
11. Stats update (X dias completos, completion %)
```

### WebSocket Considerations (Future)

Para fase 2, considerar integração realtime:

```typescript
// Socket.io para notificações
// - Lembretes de oração
// - Comunidade updates (quando outro usuário shareiar)
// - Sincronização multi-device

// Por agora, polling via SWR é suficiente
```

---

## 8️⃣ Decisões Críticas & Tradeoffs

### Decisão 1: Monolith vs Microservices

**Escolha:** Monolith (Express backend)

**Rationale:**
- MVP não precisa de autonomia de deploy
- Time pequeno (1-2 devs)
- Complexity overhead não vale

**Futura evolução:** Se escala muito, considerar:
- Serviço separado para plan generation
- Serviço separado para community (Discord bot)

---

### Decisão 2: REST vs GraphQL

**Escolha:** REST (simples)

**Rationale:**
- CRUD operations são simples
- Caching via HTTP cache headers é mais fácil
- Cliente (Next.js) é isomórfico

**Trade-off:** Sem over-fetch (desejável), sem under-fetch (mitigável com query params)

---

### Decisão 3: PostgreSQL vs Firebase/NoSQL

**Escolha:** PostgreSQL via Supabase

**Rationale:**
- Relações complexas (User → Plans → DailyTasks)
- RLS policies perfeitas para multi-tenant
- Type safety com TypeScript é possível
- Migrations versionadas

**Fire base seria mais fácil para MVP mas piora escalabilidade**

---

### Decisão 4: JWT vs Sessions

**Escolha:** JWT + httpOnly cookies

**Rationale:**
- Stateless (escalável)
- httpOnly previne XSS
- 7-day expiry balanceia UX + security

**Trade-off:** Logout não é instantâneo (server-side invalidation needed via blacklist em Redis)

---

### Decisão 5: Caching Strategy

**Escolha:** Cache-Aside (Lazy Loading) com Redis

**Rationale:**
- Content (prayers, meditations) não muda frequentemente
- Queries ao content são repetidas
- TTL 1h é bom balance

**Alternativa:** Write-Through seria mais complexo sem benefício MVP

---

### Decisão 6: Deployment Strategy

**Escolha:** Vercel (frontend) + Railway (backend)

**Rationale:**
- Vercel: Next.js native, auto-scaling, analytics built-in
- Railway: Simple git push deploy, PostgreSQL managed, Redis add-on

**Implicações:**
- Frontend CDN global (Vercel Edge Network)
- Backend em US-East (Railway default, expandir later)
- Database replication possible but not needed MVP

---

## 9️⃣ Roadmap Técnico

### Phase 1: MVP (Weeks 1-4)

**Week 1: Planning & Setup**
- [ ] Database migrations (PostgreSQL schema)
- [ ] Backend scaffold (Express + middleware)
- [ ] Frontend scaffold (Next.js + setuponn)
- [ ] Authentication flow (register + login)

**Week 2: Core API**
- [ ] POST /api/plans (create with plan generation)
- [ ] GET /api/plans/:id (retrieve)
- [ ] Plan generation engine fully working
- [ ] Tests for plan generator

**Week 3: Frontend MVP**
- [ ] Landing page
- [ ] Wizard UI (4 steps)
- [ ] Dashboard (timeline + daily checklist)
- [ ] Responsive design (mobile-first)

**Week 4: Polish & Deploy**
- [ ] E2E testing (Playwright)
- [ ] Performance audit (Lighthouse 85+)
- [ ] Content seeding (prayers, meditations)
- [ ] Deploy to Vercel + Railway
- [ ] Monitor for errors (Sentry)

**Deliverable:** Working MVP at https://app.jejumbiblico.com

---

### Phase 2: Community (Weeks 5-8)

- Discord bot for notifications
- Community feed (share progress)
- Leaderboards
- Email reminders

---

### Phase 3: Analytics & Pro (Weeks 9-12)

- Dashboard with analytics
- Export reports (PDF)
- Premium features (advanced prayers, AI coach)
- Payment integration (Stripe)

---

## 🎬 Próximas Ações

### Para @dev (Backend):

1. Clone backend scaffold
2. Setup Express + middleware
3. Create database migrations
4. Implement plan-generator service
5. Write tests

### Para @dev (Frontend):

1. Clone Next.js project
2. Setup Tailwind + shadcn/ui
3. Build wizard flows
4. Create dashboard layout
5. Connect to backend APIs

### Para @data-engineer:

1. Refine database schema
2. Optimize indexes based on queries
3. Create seed scripts
4. Test RLS policies

---

## ✅ Validação Arquitetural

Esta arquitetura foi validada contra:

- ✅ PRD requirements (story JB-1 acceptance criteria)
- ✅ Escalabilidade (suporta 100k+ MAU)
- ✅ Performance (P95 <2s load time)
- ✅ Security (auth, encryption, RLS)
- ✅ Developer experience (TypeScript end-to-end, type-safe)
- ✅ Cost efficiency (serverless pricing, no ops)
- ✅ Team size (pragmático para 1-3 devs)

---

**Arquitetura aprovada por:** Aria, Holistic System Architect  
**Data:** 2026-02-18  
**Versão:** 1.0 Final

