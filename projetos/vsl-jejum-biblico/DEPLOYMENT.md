# Deployment Guide - Jejum Bíblico App

## Architecture

```
┌─────────────────────┐
│  GitHub Repository  │
│  (aios-core)        │
└──────────┬──────────┘
           │ Push to main
           ▼
┌─────────────────────────────────────────┐
│           Vercel (Frontend)             │
│      (Frontend: Next.js on Edge)        │
│  - Auto build on push                   │
│  - CDN: 150+ edge locations             │
│  - Environment: Production              │
└──────────┬──────────────────────────────┘
           │
           │ API calls
           ▼
┌──────────────────────────────────────┐
│    Railway (Backend + Database)      │
│  - Node.js Express server            │
│  - PostgreSQL database               │
│  - Redis cache                       │
│  - Auto-scaling                      │
└──────────────────────────────────────┘
```

## Prerequisites

1. **GitHub Account** - Already have (SynkraAI/aios-core)
2. **Vercel Account** - Free tier for personal projects
3. **Railway Account** - For backend deployment
4. **Git CLI** - Already configured

## Step 1: Deploy Frontend on Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# 1. Login to Vercel
cd /workspaces/aios-core/projetos/vsl-jejum-biblico/app/frontend
npx vercel --version

# 2. Deploy
npx vercel deploy --prod

# When prompted:
#   - Link to existing project? NO (first time)
#   - Project name: jejum-biblico
#   - Root directory: ./ (current)
#   - Build command: npm run build
#   - Output directory: .next
```

### Option B: Using Vercel Web UI (Easiest)

1. Go to https://vercel.com/signup
2. Sign in with GitHub
3. Click "Add New Project"
4. Select repository: `SynkraAI/aios-core`
5. Configure:
   ```
   Framework: Next.js
   Root Directory: projetos/vsl-jejum-biblico/app/frontend
   Build Command: npm run build
   Environment Variables: (see .env.production)
   ```
6. Click "Deploy"

### Environment Variables

Add to Vercel (Settings → Environment Variables):

```env
NEXT_PUBLIC_API_URL=https://jejum-biblico-api.railway.app/api
NEXT_PUBLIC_APP_NAME=Escolha Jejum
NEXT_PUBLIC_APP_DESCRIPTION=Jejum Bíblico Personalizado
NEXT_PUBLIC_USE_MOCKS=false
```

## Step 2: Deploy Backend on Railway

### Create Railway Project

```bash
# 1. Go to https://railway.app
# 2. Sign in with GitHub
# 3. Click "New Project"
# 4. Select "Deploy from GitHub repo"
# 5. Select aios-core repository
# 6. Search for: vsl-jejum-biblico/app/backend
```

### Configure Build

In Railway dashboard:
```
Build Command: npm run build (or leave empty)
Start Command: npm start
```

### Add Services

1. **PostgreSQL**
   - Click "Add Plugin" → PostgreSQL
   - Railway auto-creates DATABASE_URL

2. **Redis**
   - Click "Add Plugin" → Redis
   - Railway auto-creates REDIS_URL

### Set Environment Variables

In Railway dashboard → Jejum Backend:
```
JWT_SECRET=your-secret-key (change in production!)
JWT_EXPIRY=7d
PORT=3001
NODE_ENV=production
```

Database and Redis URLs auto-populated by Railway.

### Deploy

Push to main branch:
```bash
git add .
git commit -m "chore: configure Railway backend deployment"
git push origin main
```

Railway auto-deploys on push.

## Step 3: Verify Deployment

### Test Frontend
```bash
curl https://jejum-biblico.vercel.app/
# Should return HTML homepage
```

### Test Backend
```bash
curl https://jejum-biblico-api.railway.app/health
# Should return: {"status":"ok"}
```

### Test API Integration
```bash
curl -X POST https://jejum-biblico-api.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Production Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] PostgreSQL database running
- [ ] Redis cache running
- [ ] Environment variables set correctly
- [ ] API_URL in frontend updated
- [ ] SSL certificates installed (auto with Vercel)
- [ ] Domain custom domain configured (optional)
- [ ] Monitoring/logs enabled
- [ ] Database backups configured
- [ ] Secrets rotated (JWT_SECRET)

## Monitoring

### Vercel Analytics
- https://vercel.com/dashboard
- View: Deployments, Build times, Web Vitals

### Railway Dashboard
- https://railway.app/dashboard
- View: Server logs, metrics, database usage

### Custom Monitoring
Add to backend (later):
```javascript
// New Relic, DataDog, or similar
// Send metrics to monitoring service
```

## Rollback

### Revert Frontend
```bash
# Vercel automatically keeps last 10 deployments
# In Vercel dashboard: Click deployment → Redeploy
```

### Revert Backend
```bash
# In Railway dashboard: Click deployment → Rollback
```

## Performance Optimization

### After Deployment

1. **Run Lighthouse on production:**
   ```bash
   npm run audit:lighthouse
   # Update with production URL
   ```

2. **Check Core Web Vitals:**
   - Vercel dashboard → Analytics
   - Should show real user metrics

3. **Database Optimization:**
   ```sql
   -- Create indexes for frequent queries
   CREATE INDEX idx_plans_user_id ON plans(user_id);
   CREATE INDEX idx_plans_status ON plans(status);
   ```

## Troubleshooting

### Frontend won't build
```bash
# Local build test
npm run build
# Check logs in Vercel dashboard
```

### Backend server won't start
```bash
# Check logs in Railway dashboard
# Verify DATABASE_URL is set
# Verify migrations ran
```

### API calls failing  
```bash
# Check CORS settings in backend
# Verify API_URL in frontend .env
# Check logs in browser DevTools
```

### Database connection errors
```bash
# Railway: Click PostgreSQL service
# Note the DATABASE_URL
# Verify credentials in backend
```

## Domain Setup (Optional)

### Add Custom Domain

**Frontend (Vercel):**
1. Vercel dashboard → Settings → Domains
2. Add domain (e.g., jejum.app)
3. Update DNS records per Vercel instructions

**Backend (Railway):**
1. Railway dashboard → Settings → Domains
2. Add domain (e.g., api.jejum.app)
3. Update DNS records

## SSL Certificates

- **Vercel**: Auto generates & renews (free with Vercel)
- **Railway**: Auto generates & renews (free with Railway)

## Cost Estimation (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Pro | $20 |
| Railway | Hobby | $0-5 |
| PostgreSQL | Shared | Included |
| Redis | Shared | Included |
| **Total** | | **$20-25** |

For free tier (hobby project):
- Vercel: Free (with limitations)
- Railway: Free (with limitations)
- Total: Free

## Security

- [ ] Use strong JWT_SECRET in production
- [ ] Rotate secrets monthly
- [ ] Enable database encryption (Railway)
- [ ] Monitor for suspicious activity
- [ ] Set up alert on Railway for high CPU usage

## CI/CD Pipeline

.github/workflows/deploy.yml (create later):
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy to Vercel
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

**Next Steps:**
1. Deploy frontend to Vercel
2. Deploy backend to Railway
3. Test integration
4. Monitor for errors
5. Optimize performance

**Questions?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) or Railway/Vercel docs.
