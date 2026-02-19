# Tech Stack Decision Record (ADR)

**App:** Jejum Bíblico MVP  
**Data:** 2026-02-18  
**Status:** Accepted  
**Decision Maker:** Aria (Architect)

---

## Executive Summary

Escolhemos um **stack pragmático e moderno** que equilibra developer experience, performance, escalabilidade e custo:

- **Frontend:** Next.js 14 + React 18 + TypeScript
- **Backend:** Node.js 20 + Express.js
- **Database:** PostgreSQL (Supabase managed)
- **Cache:** Redis (Upstash serverless)
- **Deployment:** Vercel (frontend) + Railway (backend)
- **Auth:** JWT + httpOnly Cookies

---

## Critérios de Avaliação

| Critério | Peso | Importância |
|----------|------|-------------|
| **Developer Experience** | 30% | Rápido onboarding, type-safe, debugging fácil |
| **Performance** | 25% | P95 < 2s, bundle < 500KB |
| **Escalabilidade** | 20% | Suporta 100k+ MAU sem redesign |
| **Custo** | 15% | Serverless, pay-as-you-go |
| **Aprendizado da Equipe** | 10% | Time já conhece tecnologias |

---

## 1. Frontend Framework

### Opções Avaliadas

#### Opção A: Next.js 14 ✅ ESCOLHIDA

**Pros:**
- ✅ SSR/SSG/ISR - optimal performance + SEO
- ✅ File-based routing - simples e intuitivo
- ✅ API routes - micro-backend sem infrastructure
- ✅ Built-in image optimization
- ✅ Edge functions para latência global
- ✅ TypeScript first-class
- ✅ Vercel integration nativa (deployments triviais)
- ✅ React 18 moderna (Suspense, streaming)

**Cons:**
- Opinionated structure (pode ser constritor later)
- Servidor Node.js necessário (mas é o que queremos)

**Score:** 9/10

---

#### Opção B: React 18 + Vite (SPA)

**Pros:**
- Mais flexível
- Vite é muito rápido

**Cons:**
- ❌ SPA não otimizado para SEO (landing page importante)
- ❌ Sem SSR automático
- ❌ Sem static generation
- ❌ API routes separadas (mais infrastructure)
- ❌ Bundle geramente larger (sem tree-shaking automático)

**Score:** 6/10

---

#### Opção C: Remix

**Pros:**
- Excelente data loading patterns
- Server-side focus

**Cons:**
- Less mature ecosystem
- Steeper learning curve
- Smaller community

**Score:** 5/10

---

### Decisão

✅ **Next.js 14** — Balanceia todos os critérios. Time já tem experiência. Vercel integration economiza ops.

---

## 2. Backend Runtime & Framework

### Opções Avaliadas

#### Opção A: Node.js 20 + Express ✅ ESCOLHIDA

**Pros:**
- ✅ Time conhece JavaScript/TypeScript
- ✅ Isomórfico com frontend (shared types)
- ✅ npm ecosystem rico
- ✅ Express é leve (35KB) e maduro
- ✅ Railway suporta bem
- ✅ Rápido de codar (MVP speed)

**Cons:**
- Não ideal para CPU-bound (plan generation usa pouco CPU)
- Performance inferior a Go/Rust (não problema para escala MVP)

**Score:** 9/10

---

#### Opção B: Python + FastAPI

**Pros:**
- Excelente para data science / AI future
- Type hints boas
- Ecosystem maduro

**Cons:**
- ❌ Time não tem exp Python
- ❌ Deployment mais complexo
- ❌ Overhead language runtime

**Score:** 4/10

---

#### Opção C: Go + Gin

**Pros:**
- Performance excelente
- Escalável
- Simples

**Cons:**
- ❌ Team não conhece Go
- ❌ Compilation step (mais lento que Node.js)
- ❌ Ecossystem menor para CRUD REST

**Score:** 5/10

---

### Decisão

✅ **Node.js 20 + Express** — Pragmático. Conhecimento team. Suficiente para MVP.

---

## 3. Database Choice

### Opções Avaliadas

#### Opção A: PostgreSQL (Supabase) ✅ ESCOLHIDA

**Pros:**
- ✅ Relações complexas (User → Plans → DailyTasks)
- ✅ ACID transactions
- ✅ RLS policies (row-level security) - perfeito multi-tenant
- ✅ Migrations versionadas (Flyway, etc.)
- ✅ Type-safe queries (TypeORM, Prisma)
- ✅ Supabase managed (auto backups, replication)
- ✅ PostgREST para instant APIs
- ✅ Realtime support (future)

**Cons:**
- Need SQL knowledge
- Not schemaless (mas é+ feature, não bug)

**Score:** 10/10

---

#### Opção B: MongoDB (NoSQL)

**Pros:**
- Schemaless (rápido prototipagem)
- Escalável horizontalmente

**Cons:**
- ❌ Relações complexas são N+1 queries
- ❌ Sem transactions (até MongoDB 4.0)
- ❌ Sem RLS policies nativas
- ❌ Maior memória/storage

**Score:** 3/10

---

#### Opção C: Firebase Firestore

**Pros:**
- Sem DevOps
- Realtime built-in
- Auth integrado

**Cons:**
- ❌ Denormalization obrigatória
- ❌ Queryable patterns limitadas
- ❌ Caro em escala
- ❌ Lock-in vendor

**Score:** 4/10

---

### Decisão

✅ **PostgreSQL via Supabase** — Relações fazem sentido. RLS perfecto. Managed service.

---

## 4. Caching Layer

### Opções Avaliadas

#### Opção A: Redis (Upstash) ✅ ESCOLHIDA

**Pros:**
- ✅ Sub-millisecond latency
- ✅ ttl automático
- ✅ Upstash é serverless (sem ops)
- ✅ Pub/sub para future notifications
- ✅ Rate limiting tokens

**Cons:**
- Precisa invalidate strategy

**Score:** 9/10

---

#### Opção B: Memcached

**Pros:**
- Simples
- Rápido

**Cons:**
- Menos features
- Menos community support
- Upstash não oferece Memcached

**Score:** 5/10

---

#### Opção C: CDN caching only

**Pros:**
- Sem infrastructure
- Grátis (Vercel Edge)

**Cons:**
- ❌ Só works para GET requests
- ❌ Tidak ottimale untuk content dinámico
- ❌ Hard to invalidate selectively

**Score:** 4/10

---

### Decisão

✅ **Redis via Upstash** — Serverless. Flexível. Realtime capable.

---

## 5. Deployment Strategy

### Opções Avaliadas

#### Opção A: Vercel (frontend) + Railway (backend) ✅ ESCOLHIDA

**Pros:**
- ✅ Vercel: Next.js native, auto-scaling, Edge Network global
- ✅ Railway: Simple git push, auto-restart, managed databases
- ✅ Zero DevOps (não need K8s, Docker knowledge minimal)
- ✅ Pay-as-you-go (barato MVP)
- ✅ PR previews automáticos

**Cons:**
- Vendor lock-in (mitigável)
- Regional latency (US-first)

**Score:** 9/10

---

#### Opção B: AWS Full Stack (ECS + RDS + CloudFront)

**Pros:**
- Muito flexível
- Escalável

**Cons:**
- ❌ DevOps overhead (need expertise)
- ❌ Configuration complexity
- ❌ Caro para MVP
- ❌ Steep learning curve

**Score:** 3/10

---

#### Opção C: Docker + Self-Hosted (DigitalOcean/Linode)

**Pros:**
- Controle completo
- Custo previsível

**Cons:**
- ❌ DevOps overhead
- ❌ Scaling manual
- ❌ Monitoring manual

**Score:** 4/10

---

### Decisão

✅ **Vercel + Railway** — Pragmático. Sem ops. Rápido time-to-market.

---

## 6. Authentication Strategy

### Opções Avaliadas

#### Opção A: JWT + httpOnly Cookies ✅ ESCOLHIDA

**Pros:**
- ✅ Stateless (escalável)
- ✅ httpOnly cookies previne XSS
- ✅ Industry standard
- ✅ Simples implementar
- ✅ 7-day expiry certo balance UX/Security

**Cons:**
- Logout não é instantâneo (precisa Redis blacklist)
- Token não pode ser "passado para trás"

**Score:** 8/10

---

#### Opção B: Sessions (server-side)

**Pros:**
- Logout instantâneo

**Cons:**
- ❌ Stateful (não escalável bem)
- ❌ Precisa session store (Redis anyway)
- ❌ Cookie-only (CSRF risk sem proteção)

**Score:** 5/10

---

#### Opção C: OAuth (Google/GitHub)

**Pros:**
- Sem senhas (mais seguro)

**Cons:**
- ❌ Workflow mais complexo
- ❌ Não ideal para MVP onde customization é chave
- ❌ Pode adicionar em fase 2

**Score:** 3/10 (para MVP)

---

### Decisão

✅ **JWT + httpOnly Cookies** — Stateless. Seguro. Escalável.

**Nota:** OAuth (Google login) pode ser adicionado na fase 2 para UX melhor.

---

## 7. API Style

### Opções Avaliadas

#### Opção A: REST ✅ ESCOLHIDA

**Pros:**
- ✅ HTTP caching nativo (ETags, Last-Modified)
- ✅ Simples entender (CRUD é intuitivo)
- ✅ Browser-native (GET requests in browser)
- ✅ Menos abstração que GraphQL
- ✅ Excelente para CRUD MVP

**Cons:**
- Sem-seleção fields (over-fetch possível)
- Múltiplas requests para relações

**Score:** 9/10

---

#### Opção B: GraphQL

**Pros:**
- Sem over-fetch
- Sem under-fetch

**Cons:**
- ❌ Caching mais complexo
- ❌ Query language overhead
- ❌ N+1 problem possível
- ❌ MVP não precisa (CRUD é simples)

**Score:** 3/10 (para MVP)

---

#### Opção C: tRPC

**Pros:**
- Full type-safety end-to-end
- Simples

**Cons:**
- Novo ecosystem (menos battle-tested)
- Overhead pequeno compare GraphQL

**Score:** 5/10

---

### Decisão

✅ **REST** — Simples, cacheável, MVP-appropriate.

**Futura Evolução:** Se queries complexas surgem, considerar GraphQL ou tRPC.

---

## 8. Testing Strategy

### Opções Avaliadas

#### Unit Testing: Vitest + React Testing Library ✅

**Por quê:**
- Vitest é rápido (Rust backend)
- RTL encoraja test behavior not internals
- TypeScript support nativo

#### Integration Testing: Jest + node-postgres ✅

**Por quê:**
- Jest is standard
- node-postgres simples para queries

#### E2E Testing: Playwright ✅

**Por quê:**
- Cross-browser
- Simples syntax
- Fast execution

---

## Matriz de Comparação Final

| Critério | Next.js | Express | PostgreSQL | Redis | Vercel+Railway | JWT |
|----------|---------|---------|-----------|-------|----------------|-----|
| DevEx | 10 | 9 | 8 | 9 | 10 | 8 |
| Performance | 9 | 9 | 9 | 10 | 9 | 9 |
| Escalabilidade | 9 | 9 | 10 | 10 | 9 | 10 |
| Custo | 8 | 8 | 8 | 9 | 10 | 10 |
| Segurança | 9 | 8 | 10 | 9 | 9 | 8 |
| **Média** | **9.0** | **8.6** | **9.0** | **9.4** | **9.4** | **9.0** |

---

## Risk Assessment

| Risk | Probabilidade | Impacto | Mitigação |
|------|--------------|--------|-----------|
| Node.js performance bottleneck | Baixa | Médio | Plan generation é O(n) onde n=duração |
| PostgreSQL schema evolution | Média | Baixo | Migrations versionadas, testing |
| Vendor lock-in (Vercel) | Média | Alto | Code is portable, migrations possível |
| Redis cache invalidation | Baixa | Médio | TTL + selective invalidation |
| JWT token leakage | Baixa | Alto | httpOnly cookies, short expiry, Sentry monitoring |

---

## Conclusions

Esta stack foi escolhida considerando:

1. **MVP Speed** — Rápido codar, deploy, iterate
2. **Type Safety** — TypeScript end-to-end (frontend + backend)
3. **Pragmatismo** — Escolher tecnologias batidas, não experimental
4. **Escalabilidade** — Suporta 100k+ MAU sem redesign
5. **DevOps Mínimo** — Vercel + Railway = zero ops inicialmente

### Decisões Futuras (Fase 2+)

- [ ] Adicionar OAuth (Google login)
- [ ] Considerar GraphQL se queries complexas
- [ ] Adicionar Kafka se event streaming necessário
- [ ] Expandir para mobile (React Native)
- [ ] AI integration (OpenAI para prayer customization)

---

**Aprovado por:** Aria, Holistic System Architect  
**Revisado por:** Architecture Review  
**Status:** ✅ ACCEPTED  
**Data:** 2026-02-18

