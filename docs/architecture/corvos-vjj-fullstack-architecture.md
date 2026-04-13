# 🏗️ Arquitetura Full-Stack — Corvos BJJ

**Architecture ID:** CORVOS-ARCH-001  
**Data:** 2026-03-03  
**Fase:** CBTO-1 Discovery  
**Arquiteto:** @architect (Aria)  
**Status:** 🟡 Draft (Validação pendente)

---

## 📋 Visão Geral Executiva

Sistema de gestão de academia de jiu-jitsu com foco em **simplicidade, escalabilidade e especialização**. Arquitetura moderna, cloud-native, com possibilidade de self-hosting.

### Princípios de Design
- **User-Centric:** Começar simples, crescer complexo
- **Mobile-First:** Responsivo desde dia 1
- **Security:** Defense-in-depth em todas as camadas
- **Scalability:** Pronto para 10K+ alunos
- **Developer Experience:** APIs bem documentadas, setup local simples

---

## 🎯 Requisitos Funcionais (MVP)

### Ator 1: Professor/Admin
- Autenticar com email/senha
- Gerenciar alunos (CRUD)
- Registrar pagamentos
- Ver histórico de graduações
- Gerar relatórios
- Receber notificações de pagamentos atrasados

### Ator 2: Aluno (Futuro v1.5)
- Ver seu perfil
- Ver histórico de pagamentos
- Ver suas faixas
- Receber notificações

### Ator 3: Sistema
- Validar pagamentos
- Enviar emails
- Fazer backups
- Monitorar saúde

---

## 🏛️ Arquitetura de Sistema (Alto Nível)

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
│  Next.js + React + TypeScript + Tailwind CSS                    │
│  (Desktop 1920px, Tablet 768px, Mobile 375px)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Login → Auth Context (JWT) → PrivateRoutes                      │
│            ↓                                                      │
│  Dashboard | Alunos | Pagamentos | Graduações                   │
│                                                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS + CORS
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                          │
│         Node.js + Express + TypeScript (port 3000)               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Rate Limiting → Auth Middleware → Routing                       │
│       ↓                              ↓                            │
│   /auth/login      /students/:id     /payments                   │
│   /auth/refresh    /students/:id/... /grades/:id...             │
│   /auth/reset      /students         /grades                     │
│                                                                   │
│  ↓ Prisma ORM ↓ bcryptjs ↓ jsonwebtoken ↓ axios                 │
│                                                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ TCP/IP
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                    │
│         PostgreSQL Database (Managed or Docker)                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Tables:                                                          │
│  ├─ users (id, email, password_hash, role, ...)                 │
│  ├─ students (id, name, email, phone, ...)                      │
│  ├─ payments (id, student_id, amount, status, ...)              │
│  └─ grades (id, student_id, belt_color, date, ...)              │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                  SUPPORTING SERVICES                            │
│                                                                   │
│  Email Service: Sendgrid / Mailgun                              │
│  Payment Gateway: Stripe / PagSeguro / Mercado Pago             │
│  Monitoring: Sentry / LogRocket                                 │
│  Analytics: Plausible / Simple Analytics                        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Camada Frontend (Next.js)

### Estrutura de Pastas
```
frontend/
├── src/
│   ├── app/                          # Next.js app router
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx        # Login page
│   │   │   └── forgot-password/...
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx            # Layout com Header + Sidebar
│   │   │   ├── page.tsx              # Dashboard principal
│   │   │   ├── students/
│   │   │   │   ├── page.tsx          # Listagem
│   │   │   │   └── [id]/page.tsx     # Detalhe
│   │   │   ├── payments/page.tsx
│   │   │   └── grades/page.tsx
│   │   └── layout.tsx                # Root layout
│   │
│   ├── components/                   # Componentes reutilizáveis
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Badge.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── students/
│   │   │   ├── StudentTable.tsx
│   │   │   ├── StudentForm.tsx
│   │   │   └── StudentDetail.tsx
│   │   ├── payments/
│   │   │   ├── PaymentTable.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── PaymentReport.tsx
│   │   └── grades/
│   │       ├── GradeTimeline.tsx
│   │       └── GradeForm.tsx
│   │
│   ├── hooks/                        # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useStudents.ts
│   │   ├── usePayments.ts
│   │   ├── useGrades.ts
│   │   └── useFetch.ts
│   │
│   ├── services/                     # API calls
│   │   ├── auth.ts
│   │   ├── students.ts
│   │   ├── payments.ts
│   │   └── grades.ts
│   │
│   ├── context/                      # State management
│   │   └── AuthContext.tsx
│   │
│   ├── utils/
│   │   ├── http.ts                   # Axios with JWT
│   │   ├── validation.ts
│   │   ├── format.ts
│   │   └── constants.ts
│   │
│   ├── types/index.ts                # TypeScript types
│   └── styles/globals.css
│
├── public/                           # Static assets
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Tecnologias Frontend
```yaml
Core:
  - Next.js 13+ (App Router)
  - React 18+
  - TypeScript

Styling:
  - Tailwind CSS
  - Headless UI (componentes base)

State Management:
  - React Context API (autenticação)
  - SWR ou React Query (data fetching)

HTTP:
  - Axios (com interceptadores JWT)

Testing:
  - Jest
  - React Testing Library
  - Cypress (E2E)

Build & Deploy:
  - Vercel (deployment automático)
```

### Fluxo de Autenticação (Frontend)
```
User abre app
    ↓
AuthContext checks localStorage.token
    ├─ Token existe?
    │  ├─ Sim: Valida no backend (GET /auth/verify)
    │  │        ├─ Válido: Renderiza app
    │  │        └─ Inválido: Tenta refresh token
    │  │                      ├─ Sucesso: Nova sessão
    │  │                      └─ Erro: Redirect login
    │  └─ Não: Redireciona para /login
    │
User faz login
    ↓
POST /auth/login (email, senha)
    ↓
Response: { user, token, refreshToken }
    ↓
localStorage.setItem('token', token)
localStorage.setItem('refreshToken', refreshToken)
    ↓
AuthContext.setUser(user)
    ↓
Axios interceptor adiciona: Authorization: Bearer {token}
    ↓
Redireciona para /dashboard
```

---

## ⚙️ Camada Backend (Node.js + Express)

### Estrutura de Pastas
```
backend/
├── src/
│   ├── server.ts                     # Entry point
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts        # JWT verification
│   │   ├── error-handler.ts          # Global error handling
│   │   ├── cors.middleware.ts        # CORS config
│   │   ├── rate-limit.ts             # Rate limiting
│   │   └── validation.ts             # Input validation
│   │
│   ├── routes/
│   │   ├── auth.routes.ts            # POST /auth/*
│   │   ├── students.routes.ts        # /students/*
│   │   ├── payments.routes.ts        # /payments/*
│   │   ├── grades.routes.ts          # /grades/*
│   │   └── health.routes.ts          # GET /health
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── students.controller.ts
│   │   ├── payments.controller.ts
│   │   └── grades.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts           # Business logic
│   │   ├── student.service.ts
│   │   ├── payment.service.ts
│   │   ├── grade.service.ts
│   │   └── email.service.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts                    # JWT generation/verification
│   │   ├── hash.ts                   # Password hashing
│   │   ├── validation.ts             # Input validation rules
│   │   ├── errors.ts                 # Custom error classes
│   │   └── logger.ts                 # Logging
│   │
│   ├── types/
│   │   ├── index.ts                  # TypeScript interfaces
│   │   └── express.d.ts              # Express extensions
│   │
│   └── config/
│       ├── env.ts                    # Environment variables
│       ├── database.ts               # DB connection
│       └── external-services.ts      # Sendgrid, Stripe, etc
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Database migrations
│
├── tests/
│   ├── unit/
│   │   ├── auth.service.test.ts
│   │   ├── student.service.test.ts
│   │   └── ...
│   ├── integration/
│   │   ├── auth.integration.test.ts
│   │   └── ...
│   └── setup.ts
│
├── .env.example
├── .env (gitignored)
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
├── jest.config.js
└── package.json
```

### Tecnologias Backend
```yaml
Core:
  - Node.js 18+
  - Express.js
  - TypeScript

Database:
  - PostgreSQL 12+
  - Prisma ORM 4+

Authentication:
  - jsonwebtoken (JWT)
  - bcryptjs (password hashing)

Validation:
  - zod (schema validation)
  - joi (alternative)

External Services:
  - Sendgrid / Mailgun (emails)
  - Stripe / PagSeguro (pagamentos)
  - Axios (HTTP requests)

Testing:
  - Jest
  - Supertest (integration tests)
  - Docker (test database)

Monitoring:
  - Winston (logging)
  - Sentry (error tracking)

Build & Deploy:
  - TypeScript compiler
  - Railway / Render (deployment automático)
```

### Endpoints da API (RESTful)

```
AUTHENTICATION
├── POST /auth/register          Create new user (admin only)
├── POST /auth/login             Login with email/password
├── POST /auth/refresh           Refresh JWT token
├── POST /auth/logout            Invalidate session
├── POST /auth/forgot-password   Request password reset
└── PUT /auth/reset-password     Reset with token

STUDENTS
├── GET /students                List all (pagination, filters)
├── POST /students               Create new student
├── GET /students/:id            Get student details
├── PUT /students/:id            Update student
├── DELETE /students/:id         Delete student
└── GET /students/:id/summary    Summary (payments + grades)

PAYMENTS
├── GET /payments                List all (filters by status, period)
├── POST /payments               Register new payment
├── GET /students/:id/payments   Student payment history
├── PUT /payments/:id            Update payment
├── DELETE /payments/:id         Delete payment
└── GET /payments/report/month   Monthly report

GRADES
├── GET /students/:id/grades     Student grade history (timeline)
├── POST /students/:id/grades    Register new promotion
├── PUT /grades/:id              Update grade
├── DELETE /grades/:id           Delete grade
└── GET /grades/report/stats     Stats by belt

HEALTH
├── GET /health                  System health check
└── GET /health/db               Database connectivity check
```

### Exemplo de Resposta: GET /students

```json
{
  "data": [
    {
      "id": "clu8h9k1p0001kz0h1h1h1h1h",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "+5511999999999",
      "dateOfBirth": "2000-01-15T00:00:00.000Z",
      "status": "ativo",
      "startDate": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-03-03T14:20:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## 🗄️ Camada Database (PostgreSQL)

### ER Diagram (Mermaid)

```
erDiagram
    USERS ||--o{ STUDENTS : none
    STUDENTS ||--o{ PAYMENTS : receives
    STUDENTS ||--o{ GRADES : earns

    USERS {
        string id PK
        string email UK
        string name
        string password_hash
        string role
        datetime created_at
        datetime updated_at
    }

    STUDENTS {
        string id PK
        string name
        string email
        string phone
        date date_of_birth
        date start_date
        string status
        datetime created_at
        datetime updated_at
    }

    PAYMENTS {
        string id PK
        string student_id FK
        decimal amount
        date payment_date
        date due_date
        string status
        string payment_method
        string notes
        datetime created_at
        datetime updated_at
    }

    GRADES {
        string id PK
        string student_id FK
        string belt_color
        date promotion_date
        string notes
        datetime created_at
        datetime updated_at
    }
```

### Schema Prisma (Completo)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  passwordHash  String
  role          String    @default("professor") // "admin", "professor"
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
  @@index([role])
}

model Student {
  id            String    @id @default(cuid())
  name          String
  email         String
  phone         String?
  dateOfBirth   DateTime?
  startDate     DateTime  @default(now())
  status        String    @default("ativo") // "ativo", "inativo", "parado"
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  payments      Payment[]
  grades        Grade[]

  @@index([name])
  @@index([email])
  @@index([status])
}

model Payment {
  id              String    @id @default(cuid())
  studentId       String
  student         Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)
  amount          Float
  paymentDate     DateTime?
  dueDate         DateTime
  status          String    @default("pendente") // "pago", "pendente", "atrasado"
  paymentMethod   String?   // "dinheiro", "transferência", "pix", "cartão"
  notes           String?
  referenceMonth  String?   // "2026-03" for filters
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([studentId])
  @@index([status])
  @@index([dueDate])
  @@index([referenceMonth])
}

model Grade {
  id              String    @id @default(cuid())
  studentId       String
  student         Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)
  beltColor       String    // "branca", "azul", "roxa", "marrom", "preta"
  promotionDate   DateTime
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([studentId])
  @@index([promotionDate])
}
```

### Índices e Otimizações
```sql
-- Índices para queries comuns
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_payments_student_status ON payments(student_id, status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_grades_student_date ON grades(student_id, promotion_date DESC);

-- Para relatórios
CREATE INDEX idx_payments_reference_month ON payments(reference_month);
CREATE INDEX idx_students_start_date ON students(start_date DESC);
```

---

## 🔐 Segurança

### Authentication Flow
```
1. User submits email + password
   ↓
2. Backend queries students table
   ├─ Email exists?
   └─ Hash password, compare
   ↓
3. If valid:
   POST /auth/login → Response:
   {
     "user": { id, email, name, role },
     "token": "eyJhbGc..." (15min expiry),
     "refreshToken": "eyJhbGc..." (7 days expiry)
   }
   ↓
4. Frontend stores token + refreshToken
   ├─ Token: localStorage (short-lived)
   └─ RefreshToken: httpOnly cookie (if possible)
   ↓
5. Axios interceptor adds: Authorization: Bearer {token}
   ↓
6. If token expires:
   POST /auth/refresh (+ refreshToken)
   → Get new token silently
   ↓
7. If refreshToken invalid:
   Redirect to /login
```

### Password Security
```
User password: "MySecurePassword123!"
   ↓
bcryptjs.hash(password, 10)
   ↓
Stored in DB: $2b$10$... (never plain text)
   ↓
On login:
bcryptjs.compare(inputPassword, storedHash)
   ↓
Match? → Generate JWT
```

### HTTPS & CORS
```
Vercel (frontend): auto HTTPS certificate
Railway (backend): auto HTTPS certificate

CORS Configuration:
app.use(cors({
  origin: ['https://corvosbjj.com.br', 'https://www.corvosbjj.com.br'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Input Validation
```typescript
// Example: Create student validation
const createStudentSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+55\d{10,11}$/).optional(),
  dateOfBirth: z.coerce.date().optional(),
  status: z.enum(['ativo', 'inativo', 'parado']).default('ativo')
});
```

### Rate Limiting
```javascript
// 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);

// Stricter for login (10 attempts per 15 min)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true
});

app.post('/auth/login', loginLimiter, ...)
```

---

## 🚀 Deployment Architecture

### Development (Local)
```
docker-compose up
├─ PostgreSQL 15 (localhost:5432)
├─ Backend (localhost:3000)
└─ Frontend (localhost:3001)

npm run dev (each service)
```

### Staging (Automated from main)
```
GitHub Push (main branch)
   ↓
GitHub Actions CI
├─ Run linter
├─ Run tests
└─ Build Docker images
   ↓
Push to Docker Registry
   ↓
Railway/Render detects push
├─ Deploy backend
├─ Run migrations
└─ Deploy frontend
   ↓
URL: https://staging.corvosbjj.com
```

### Production (Manual release)
```
GitHub Release Tag (v1.0.0)
   ↓
GitHub Actions CD
└─ Manual approval required
   ↓
Deploy to production
├─ Backend: https://api.corvosbjj.com.br
├─ Frontend: https://corvosbjj.com.br
└─ Database: Managed PostgreSQL
   ↓
CloudFlare DNS
├─ api.corvosbjj.com.br → Railway
├─ corvosbjj.com.br → Vercel
└─ Automatic HTTPS (Let's Encrypt)
```

### Scaling Strategy
```
Stage 1 (0-100 alunos):
├─ Vercel (frontend) — auto-scales
├─ Railway basic (backend) — single instance
└─ Railway PostgreSQL — managed

Stage 2 (100-1000 alunos):
├─ Vercel Pro + CDN
├─ Railway pro (multiple instances)
├─ Redis cache layer (optional)
└─ Read replicas PostgreSQL

Stage 3 (1000+ alunos):
├─ Kubernetes (self-hosted)
├─ Multiple backend instances
├─ PostgreSQL + sharding
├─ ElastiCache (Redis)
└─ CDN global
```

---

## 📊 Monitoring & Observability

### Health Checks
```typescript
GET /health
Response: {
  "status": "healthy",
  "timestamp": "2026-03-03T14:20:00Z",
  "database": "connected",
  "version": "1.0.0"
}

GET /health/db
Response: {
  "connected": true,
  "responseTime": 12, // ms
  "timestamp": "2026-03-03T14:20:00Z"
}
```

### Error Tracking (Sentry)
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Automatic error capture on unhandled exceptions
// Manual capture:
Sentry.captureException(error);
```

### Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('User logged in', { userId: '123' });
```

### Metrics to Track
- Request count by endpoint
- Error rate (4xx, 5xx)
- Database query performance
- API response times (p50, p95, p99)
- Active users
- Payment success rate

---

## 📱 Estratégia Mobile (v1.5+)

### MVP (Next.js Responsivo)
- Desktop: Full UI
- Tablet: Adapted layout
- Mobile: Touch-friendly, hamburger menu

### v1.5 (React Native App)
```
corvos-mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen
│   │   ├── DashboardScreen
│   │   ├── StudentsScreen
│   │   └── PaymentsScreen
│   ├── navigation/
│   ├── components/
│   └── services/
└── app.json (Expo)
```

Benefits:
- Native performance
- Offline functionality
- Push notifications
- Separate app store listing
- Better UX for touch

---

## 🔗 Integrações Futuras (Roadmap)

### v1.5: Aulas Agendadas
```
SQ-1.1: Class scheduling
├─ Calendar UI
├─ Time slots
├─ Attendance tracking
└─ Auto-notification
```

### v2.0: Pagamentos Online
```
PAY-2.1: Stripe integration
├─ One-time payment
├─ Recurring billing
├─ Invoice management
└─ Webhook handling

PAY-2.2: PagSeguro (Brasil)
├─ Boleto
├─ Debit
├─ Credit card
```

### v2.5: Comunicação
```
COMM-2.5.1: WhatsApp integration
├─ Send reminders
├─ Bulk messages
└─ Two-way chat

COMM-2.5.2: Email campaigns
├─ Automated reminders
└─ Newsletters
```

### v3.0: Community
```
COMM-3.1: Student portal
├─ Profile
├─ Progress tracking
├─ Forum
└─ Social features
```

---

## 🎓 Decision Rationale

### Por que Next.js + Node.js + PostgreSQL?

**Next.js Frontend:**
- ✅ SSR → Better SEO
- ✅ API routes → Less context switching
- ✅ Built-in optimizations (Image, Font)
- ✅ Vercel → 1-click deployment
- ✅ TypeScript → Type safety
- ✅ Tailwind → Fast styling
- ❌ Não adquirido por empresa (vs Svelte)

**Node.js Backend:**
- ✅ Same language as frontend (JS/TS)
- ✅ Large ecosystem (npm)
- ✅ Good performance for I/O
- ✅ Easy async/await
- ✅ Express mature + simple
- ✅ Railway/Render suporte excelente
- ❌ Não tão rápido quanto Go em CPU-heavy

**PostgreSQL:**
- ✅ ACID transactions (critical para pagamentos)
- ✅ Complex relationships (students → payments → grades)
- ✅ Prisma ORM → Easy migrations
- ✅ Managed services (Railway, Heroku, RDS)
- ✅ Open source → No vendor lock-in
- ✅ Escalável (até 100K RPS com optimization)
- ❌ Mais complexo que SQLite para MVP

**JWT Authentication:**
- ✅ Stateless (scales horizontally)
- ✅ Simple implementation
- ✅ Standard in industry
- ✅ Mobile-friendly (no cookies)
- ❌ Refresh tokens needed (não perfeito)

---

## 📈 Performance Targets

| Metric | Target | Atual |
|--------|--------|-------|
| Page Load (LCP) | < 2.5s | TBD |
| First Input Delay (FID) | < 100ms | TBD |
| Cumulative Layout Shift (CLS) | < 0.1 | TBD |
| API Response (p95) | < 500ms | TBD |
| Database Query (p95) | < 100ms | TBD |
| Lighthouse Score | >= 80 | TBD |

---

## 🧪 Testing Strategy

### Frontend
```
Component Tests (React Testing Library):
├─ Button, Input, Card rendering
├─ Form submission
└─ Auth context behavior

E2E Tests (Cypress):
├─ Full login flow
├─ Create student → View → Edit → Delete
├─ Register payment → Check status
└─ View graduation timeline

Visual Regression:
├─ Screenshots across devices (Chromatic)
└─ Catch unintended style changes
```

### Backend
```
Unit Tests (Jest):
├─ Password hashing
├─ JWT generation
├─ Validation rules
├─ Service methods (mocked DB)

Integration Tests (Supertest):
├─ POST /auth/login
├─ GET /students (with JWT)
├─ POST /payments
└─ Delete with cascade

Load Tests (k6):
├─ 100 concurrent users
├─ Dashboard queries
└─ Report generation
```

### Database
```
Migration tests:
├─ Forward migrations
├─ Rollback
└─ Data integrity

Performance tests:
├─ Query performance on 10K+ records
└─ Index effectiveness
```

---

## 📋 Checklist de Implementação

### Setup (Semana 1)
- [ ] Repositories criados (backend + frontend)
- [ ] CI/CD pipeline setup (GitHub Actions)
- [ ] Database local (Docker PostgreSQL)
- [ ] Backend básico (Express, Prisma)
- [ ] Frontend básico (Next.js, Auth)

### Backend MVP (Semanas 2-3)
- [ ] Autenticação completa
- [ ] CRUD Students
- [ ] CRUD Payments
- [ ] CRUD Grades
- [ ] Testes (unit + integration)
- [ ] Documentação (Swagger)

### Frontend MVP (Semanas 3-4)
- [ ] Login + PrivateRoute
- [ ] Dashboard
- [ ] Students CRUD + detalhe
- [ ] Payments CRUD + relatório
- [ ] Grades timeline
- [ ] Responsivo (mobile)
- [ ] Testes (unit + E2E)

### Deploy (Semana 5)
- [ ] Docker + docker-compose
- [ ] Backend → Railway
- [ ] Frontend → Vercel
- [ ] Domínio customizado
- [ ] HTTPS automático
- [ ] Backups configurados
- [ ] Documentação final

---

## 🎯 Próximos Passos

1. **Validar com stakeholder** (professor da academia)
   - Confirmar tech stack
   - Validar fluxos

2. **Criar Decision Record formal**
   - Documentar por que cada escolha
   - Links para papers/docs

3. **Wireframes detalhados**
   - Desenhar todas as telas
   - Mobile + Desktop

4. **API Specification (OpenAPI YAML)**
   - Detalhado endpoint por endpoint
   - Exemplos de request/response

5. **Start CBTO-2 (Backend)**
   - Começar project setup
   - First migrations

---

**Status:** 🟡 Draft arquitetura  
**Próximo Passo:** Validar com stakeholder + criar wireframes  
**Assumido por:** @architect (Aria)

— Aria, com arquitetura full-stack 🏗️
