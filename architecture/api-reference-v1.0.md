# API Reference — OpenAPI Specification

App: Jejum Bíblico MVP  
Base URL: `https://api.jejumbiblico.com` (prod) / `http://localhost:3001` (dev)  
Version: 1.0.0  
Status: Draft

---

## Quick Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| **POST** | `/api/auth/register` | None | Criar novo usuário |
| **POST** | `/api/auth/login` | None | Fazer login |
| **POST** | `/api/auth/refresh` | JWT | Renovar token |
| **POST** | `/api/auth/logout` | JWT | Logout (invalidar token) |
| **POST** | `/api/plans` | JWT | Criar novo plano |
| **GET** | `/api/plans` | JWT | Listar planos do usuário |
| **GET** | `/api/plans/:plan_id` | JWT | Obter plano específico |
| **PATCH** | `/api/plans/:plan_id` | JWT | Atualizar status do plano |
| **GET** | `/api/content/prayers` | None | Listar orações (cached) |
| **GET** | `/api/content/meditations` | None | Listar meditações (cached) |
| **GET** | `/api/content/meals` | None | Listar refeições (cached) |
| **POST** | `/api/user/checkin` | JWT | Registrar check-in diário |
| **GET** | `/api/user/progress` | JWT | Obter progresso do usuário |

---

## Error Responses

### Error Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {} // optional, specific to error
  }
}
```

### Error Codes

| Code | HTTP | Significado |
|------|------|-----------|
| `VALIDATION_ERROR` | 400 | Input inválido |
| `AUTH_REQUIRED` | 401 | JWT token missing/invalid |
| `UNAUTHORIZED` | 401 | Credenciais incorretas |
| `FORBIDDEN` | 403 | Usuário sem permissão |
| `NOT_FOUND` | 404 | Recurso não existe |
| `CONFLICT` | 409 | Email já existe, etc |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Maintenance/outage |

---

## Authentication

### JWT Token Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Payload

```json
{
  "sub": "user-id-uuid",
  "email": "user@example.com",
  "iat": 1705622400,
  "exp": 1706227200
}
```

### Token Expiry

- **Access Token:** 7 days
- **Refresh Token:** 30 days (future)

---

## Endpoints Detailed

### 🔐 Auth Endpoints

#### POST /api/auth/register

Criar novo usuário e receber JWT token.

**Request:**

```http
POST /api/auth/register HTTP/1.1
Host: api.jejumbiblico.com
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "João Silva"
}
```

**Request Schema:**

```json
{
  "type": "object",
  "required": ["email", "password"],
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "description": "User email address"
    },
    "password": {
      "type": "string",
      "minLength": 8,
      "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)",
      "description": "Mín 8 chars, 1 uppercase, 1 lowercase, 1 digit"
    },
    "name": {
      "type": "string",
      "minLength": 2,
      "maxLength": 100,
      "description": "Full name (optional)"
    }
  }
}
```

**Response 200:**

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "João Silva",
    "created_at": "2026-02-18T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800
}
```

**Response 409 (Email exists):**

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Email already registered",
    "details": {
      "email": "user@example.com"
    }
  }
}
```

---

#### POST /api/auth/login

Fazer login com email e password.

**Request:**

```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response 200:**

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "João Silva"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800
}
```

**Response 401 (Invalid credentials):**

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid email or password"
  }
}
```

---

#### POST /api/auth/logout

Invalidar token (blacklist no Redis).

**Request:**

```http
POST /api/auth/logout HTTP/1.1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 📋 Plan Endpoints

#### POST /api/plans

Criar novo plano de jejum customizado.

**Request:**

```http
POST /api/plans HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "objective": "cura",
  "duration": 21,
  "restrictions": ["gluten-free"],
  "start_date": "2026-02-25T00:00:00Z",
  "timezone": "America/Sao_Paulo"
}
```

**Request Schema:**

```json
{
  "type": "object",
  "required": ["objective", "duration", "start_date"],
  "properties": {
    "objective": {
      "type": "string",
      "enum": ["cura", "sabedoria", "libertacao", "dedicacao"],
      "description": "Objetivo do jejum"
    },
    "duration": {
      "type": "integer",
      "enum": [3, 7, 21, 40],
      "description": "Duração de dias"
    },
    "restrictions": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["vegan", "vegetarian", "gluten-free", "dairy-free"]
      },
      "description": "Restrições alimentares (opcional)"
    },
    "start_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data de início (ISO8601)"
    },
    "timezone": {
      "type": "string",
      "description": "Timezone para notificações (ex: America/Sao_Paulo)",
      "default": "UTC"
    }
  }
}
```

**Response 200 (Created):**

```json
{
  "plan": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "objective": "cura",
    "duration": 21,
    "start_date": "2026-02-25T00:00:00Z",
    "status": "active",
    "completion_percentage": 0,
    "days_completed": 0,
    "created_at": "2026-02-18T10:00:00Z",
    "updated_at": "2026-02-18T10:00:00Z"
  },
  "daily_tasks": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "plan_id": "660e8400-e29b-41d4-a716-446655440001",
      "day_number": 1,
      "prayer_id": "880e8400-e29b-41d4-a716-446655440003",
      "meditation_id": "990e8400-e29b-41d4-a716-446655440004",
      "meal_id": "aa0e8400-e29b-41d4-a716-446655440005",
      "scheduled_for": "2026-02-25T06:00:00Z",
      "prayer_completed": false,
      "meditation_completed": false,
      "meal_logged": false
    }
    // ... 20 more days
  ]
}
```

**Response 400 (Validation error):**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "duration": "Must be one of: 3, 7, 21, 40"
    }
  }
}
```

---

#### GET /api/plans

Listar todos os planos do usuário.

**Request:**

```http
GET /api/plans?status=active&limit=10&offset=0 HTTP/1.1
Authorization: Bearer <token>
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter: `active`, `completed`, `suspended`, `abandoned` (optional) |
| `limit` | integer | Limit results (default: 10, max: 100) |
| `offset` | integer | Pagination offset (default: 0) |

**Response 200:**

```json
{
  "plans": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "objective": "cura",
      "duration": 21,
      "status": "active",
      "completion_percentage": 42,
      "days_completed": 9,
      "created_at": "2026-02-18T10:00:00Z",
      "last_checkin": "2026-02-24T18:30:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0,
  "hasMore": false
}
```

---

#### GET /api/plans/:plan_id

Obter um plano específico com todos os detalhes.

**Request:**

```http
GET /api/plans/660e8400-e29b-41d4-a716-446655440001 HTTP/1.1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "plan": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "objective": "cura",
    "duration": 21,
    "start_date": "2026-02-25T00:00:00Z",
    "status": "active",
    "completion_percentage": 42,
    "days_completed": 9,
    "created_at": "2026-02-18T10:00:00Z",
    "updated_at": "2026-02-24T18:30:00Z",
    "completed_at": null
  },
  "daily_tasks": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "plan_id": "660e8400-e29b-41d4-a716-446655440001",
      "day_number": 1,
      "prayer_id": "880e8400-e29b-41d4-a716-446655440003",
      "meditation_id": "990e8400-e29b-41d4-a716-446655440004",
      "meal_id": "aa0e8400-e29b-41d4-a716-446655440005",
      "scheduled_for": "2026-02-25T06:00:00Z",
      "prayer_completed": true,
      "meditation_completed": true,
      "meal_logged": true,
      "checkin_mood": 5
    }
    // ... 20 more days
  ],
  "prayer": { /* full prayer data */ },
  "meditation": { /* full meditation data */ },
  "meal": { /* full meal data */ }
}
```

**Response 404 (Not found):**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Plan not found"
  }
}
```

**Response 403 (Unauthorized):**

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have access to this plan"
  }
}
```

---

#### PATCH /api/plans/:plan_id

Atualizar status de um plano.

**Request:**

```http
PATCH /api/plans/660e8400-e29b-41d4-a716-446655440001 HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "suspended"
}
```

**Request Schema:**

```json
{
  "type": "object",
  "required": ["status"],
  "properties": {
    "status": {
      "type": "string",
      "enum": ["active", "suspended", "completed", "abandoned"]
    }
  }
}
```

**Response 200:**

```json
{
  "plan": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "status": "suspended",
    "updated_at": "2026-02-24T18:35:00Z"
  }
}
```

---

### 📖 Content Endpoints

#### GET /api/content/prayers

Listar orações disponíveis (cached por 1 hora).

**Request:**

```http
GET /api/content/prayers?type=cura&limit=5 HTTP/1.1
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `type` | string | Filter by objective: `cura`, `sabedoria`, `libertacao`, `dedicacao` (optional) |
| `difficulty` | integer | Filter by difficulty 1-5 (optional) |
| `limit` | integer | Limit results (default: 20, max: 100) |

**Response 200:**

```json
{
  "prayers": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "title": "Oração pelo Corpo Sadio",
      "text_pt": "Senhor, peço para que meu corpo seja curado de toda enfermidade...",
      "type": "cura",
      "difficulty": 3,
      "duration_minutes": 10,
      "biblical_ref": "Mateus 8:16-17",
      "author": "Jesus"
    }
  ],
  "total": 35,
  "cache_ttl": 3600,
  "cached_at": "2026-02-18T10:00:00Z"
}
```

---

#### GET /api/content/meditations

Listar meditações disponíveis (cached).

**Request:**

```http
GET /api/content/meditations?objective=cura&duration_max=20 HTTP/1.1
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `objective` | string | Filter by objective (optional) |
| `duration_max` | integer | Max duration in minutes (optional) |
| `limit` | integer | Limit results (default: 20) |

**Response 200:**

```json
{
  "meditations": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "title": "Meditação de Cura Profunda",
      "description": "Uma meditação guiada para abrir seu coração para cura...",
      "audio_url": "https://storage.supabase.com/meditations/cura-profunda.mp3",
      "duration_minutes": 18,
      "type": "guided",
      "intensity": 3,
      "objective": "cura"
    }
  ],
  "total": 12
}
```

---

#### GET /api/content/meals

Listar refeições sugeridas (cached).

**Request:**

```http
GET /api/content/meals?restrictions=vegetarian&calories_max=500 HTTP/1.1
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `restrictions` | string | Filter by restriction type (optional) |
| `calories_max` | integer | Max calories (optional) |
| `limit` | integer | Limit results (default: 20) |

**Response 200:**

```json
{
  "meals": [
    {
      "id": "aa0e8400-e29b-41d4-a716-446655440005",
      "title": "Végé Salada com Quinoa",
      "description": "Salada levível com grãos e folhas verdes",
      "calories": 320,
      "macros": {
        "protein": 12,
        "carbs": 45,
        "fat": 8
      },
      "prep_time_minutes": 15,
      "ingredients": ["quinoa", "alface", "tomate", "cebola"],
      "restrictions": ["vegetarian", "gluten-free"]
    }
  ],
  "total": 28
}
```

---

### ✅ Progress Endpoints

#### POST /api/user/checkin

Registrar check-in diário (conclusão de tarefas).

**Request:**

```http
POST /api/user/checkin HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan_id": "660e8400-e29b-41d4-a716-446655440001",
  "date": "2026-02-25T00:00:00Z",
  "mood_rating": 4,
  "energy_level": 7,
  "notes": "Dia 1 foi bem! Sinto-me revigorado.",
  "completed": {
    "prayers": true,
    "meditations": true,
    "meals": true
  }
}
```

**Request Schema:**

```json
{
  "type": "object",
  "required": ["plan_id", "date", "mood_rating", "energy_level", "completed"],
  "properties": {
    "plan_id": { "type": "string", "format": "uuid" },
    "date": { "type": "string", "format": "date-time" },
    "mood_rating": { "type": "integer", "minimum": 1, "maximum": 5 },
    "energy_level": { "type": "integer", "minimum": 1, "maximum": 10 },
    "notes": { "type": "string", "maxLength": 500 },
    "completed": {
      "type": "object",
      "properties": {
        "prayers": { "type": "boolean" },
        "meditations": { "type": "boolean" },
        "meals": { "type": "boolean" }
      }
    }
  }
}
```

**Response 200 (Created):**

```json
{
  "progress": {
    "id": "bb0e8400-e29b-41d4-a716-446655440006",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "plan_id": "660e8400-e29b-41d4-a716-446655440001",
    "date": "2026-02-25T00:00:00Z",
    "mood_rating": 4,
    "energy_level": 7,
    "notes": "Dia 1 foi bem! Sinto-me revigorado.",
    "streak_days": 1,
    "created_at": "2026-02-25T10:00:00Z"
  }
}
```

---

#### GET /api/user/progress

Obter progresso do usuário.

**Request:**

```http
GET /api/user/progress?plan_id=660e8400-e29b-41d4-a716-446655440001&start_date=2026-02-25&end_date=2026-03-18 HTTP/1.1
Authorization: Bearer <token>
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `plan_id` | string | Filter by plan (required) |
| `start_date` | string | Start date (ISO8601, optional) |
| `end_date` | string | End date (ISO8601, optional) |

**Response 200:**

```json
{
  "progress": [
    {
      "id": "bb0e8400-e29b-41d4-a716-446655440006",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "plan_id": "660e8400-e29b-41d4-a716-446655440001",
      "date": "2026-02-25T00:00:00Z",
      "mood_rating": 4,
      "energy_level": 7,
      "prayers_completed": 1,
      "meditations_completed": 1,
      "meals_logged": true,
      "streak_days": 1,
      "highest_streak": 1
    }
  ],
  "total": 1
}
```

---

## Rate Limiting

**Rate Limit Headers:**

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1708103400
```

**Limits per Endpoint:**

- `/api/auth/*` — 5 requests/min per IP
- `/api/plans` — 50 requests/min per user
- `/api/content/*` — 100 requests/min per user (cached heavily)
- `/api/user/checkin` — 100 requests/min per user

**Response 429 (Rate limited):**

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again in 30 seconds.",
    "retryAfter": 30
  }
}
```

---

## Pagination

All list endpoints support pagination:

```json
{
  "data": [],
  "total": 100,
  "limit": 10,
  "offset": 0,
  "hasMore": true
}
```

**Query Parameters:**

| Param | Type | Default | Max |
|-------|------|---------|-----|
| `limit` | integer | 10 | 100 |
| `offset` | integer | 0 | - |

---

## Caching Headers

**Cache Strategy:**

- `/api/content/*` — `Cache-Control: public, max-age=3600, s-maxage=86400`
- `/api/plans` — `Cache-Control: private, max-age=0` (no cache, user-specific)
- `/api/user/*` — `Cache-Control: private, max-age=0`

**Conditional Requests:**

```
GET /api/plans/123 HTTP/1.1
If-None-Match: "abc123def456"
```

Response: `304 Not Modified` if unchanged

---

## Webhooks (Future)

Futuras integrations:

```https
POST https://webhook.user.com/prayer-completed
{
  "event": "prayer_completed",
  "plan_id": "...",
  "timestamp": "2026-02-25T18:30:00Z"
}
```

---

**OpenAPI Version:** 3.0.0  
**Status:** Approved by Architecture Team  
**Last Updated:** 2026-02-18

