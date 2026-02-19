# Backend — App Jejum Bíblico

Backend MVP para a aplicação de jejum bíblico personalizado.

**Tech Stack:**
- Node.js 20 LTS
- Express.js 4.18
- PostgreSQL (via postgres)
- Redis (optional, caching)
- JWT (authentication)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (local or Supabase)
- Redis (optional)
- `.env` file configured

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

3. **Initialize database:**
```bash
npm run db:migrate  # Creates tables
npm run db:seed     # Populates with initial content
```

4. **Start server:**
```bash
npm run dev         # Development with hot reload
# or
npm start           # Production
```

Server runs on `http://localhost:3001`

---

## 📚 API Endpoints

### Authentication

**POST /api/auth/register**
```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

### Plans

**POST /api/plans** (requires Bearer token)
```json
{
  "objective": "cura",
  "duration": 7,
  "restrictions": [],
  "start_date": "2026-02-20"
}
```

**GET /api/plans/:id** (requires Bearer token)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/plans/plan-id
```

**GET /api/plans** (requires Bearer token, paginated)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/plans?limit=10&offset=0
```

### Content

**GET /api/content/prayers**
```bash
# All prayers
curl http://localhost:3001/api/content/prayers

# Filter by type
curl "http://localhost:3001/api/content/prayers?type=cura"
```

**GET /api/content/meditations**
**GET /api/content/meals**

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

---

## 🗄️ Database Commands

```bash
npm run db:migrate  # Run migrations
npm run db:seed     # Seed initial data
npm run db:reset    # Drop all and recreate
```

---

## 🌍 Deployment

### Environment Variables (Production)

Set in your deployment platform:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secure JWT signing key
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Production/development
- `REDIS_URL` - Redis URL (optional)

### Deploy to Railway

```bash
# Railway CLI setup
railway init
railway add
railway logs
```

---

## 📊 Architecture

### Database Schema

**users**
- id (UUID)
- email (unique)
- password_hash
- created_at

**plans**
- id (UUID)
- user_id (FK)
- objective (enum: cura, sabedoria, libertacao, dedicacao)
- duration (3, 7, 21, 40)
- start_date
- status (active, completed, abandoned)
- created_at

**daily_tasks**
- id (UUID)
- plan_id (FK)
- day_number
- prayer_id (FK)
- meditation_id (FK)
- meal_id (FK)
- notes
- completed_at

**prayers, meditations, meals**
- Content library for plan generation

### Plan Generation Algorithm

When user creates a plan:
1. Select prayers matching objective
2. Calculate progression factor (0.4 → 0.9 per day)
3. Distribute meditations by difficulty
4. Select meals compatible with fasting
5. Save 7/21/40 daily_tasks to database
6. Return full plan with content

---

## 🛠️ Development

### File Structure

```
src/
├── index.js              # Express app & startup
├── config/
│   ├── database.js       # PostgreSQL setup
│   └── redis.js          # Redis setup (optional)
├── middleware/
│   ├── auth.js           # JWT & errors
│   └── error.js          # Error handling
├── routes/
│   ├── auth.js           # /api/auth/*
│   ├── plans.js          # /api/plans/*
│   └── content.js        # /api/content/*
├── services/
│   └── plan-generator.js # Core algorithm
├── models/               # (future: more complex queries)
└── database/
    ├── migrations/       # (future: versioned migrations)
    └── seeds/            # Initial data
```

### Adding a New Endpoint

1. Create route file in `src/routes/`
2. Import in `src/index.js` 
3. Add middleware (auth if needed)
4. Use `asyncHandler` wrapper for error handling
5. Add validation with `zod`
6. Add tests in `tests/`

---

## ⚠️ Known Limitations (MVP)

- No refresh tokens (7-day expiry only)
- No pagination metadata beyond total count
- Redis caching optional
- No rate limiting (add later)
- No request logging/audit trail (add later)

---

## 📝 Next Steps

1. Deploy database (Supabase or managed PostgreSQL)
2. Deploy backend (Railway or Vercel)
3. Generate frontend API client
4. Integration testing with frontend

---

**Status:** MVP Complete  
**Last Updated:** 2026-02-19
