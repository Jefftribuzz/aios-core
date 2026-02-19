# ⚡ Quick Deploy - Jejum Bíblico Landing Page

## 🚀 Deploy em 2 Minutos

### Via Vercel (Recomendado)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Enter frontend directory
cd projetos/vsl-jejum-biblico/app/frontend

# 3. Deploy
vercel --prod
```

**✓ URL gerada automaticamente: `https://seu-projeto.vercel.app`**

---

### Via Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Enter frontend directory
cd projetos/vsl-jejum-biblico/app/frontend

# 3. Deploy
netlify deploy --prod
```

---

### Via Docker (Local)

```bash
cd projetos/vsl-jejum-biblico/app/frontend

# Option 1: Direct build
./docker-deploy.sh

# Option 2: Manual
docker build -t jejum-biblico .
docker run -p 3000:3000 jejum-biblico
```

**Access: http://localhost:3000**

---

### Via npm (Local)

```bash
cd projetos/vsl-jejum-biblico/app/frontend
npm install
npm run build
npm start
```

---

## 📋 Files Created

| File | Purpose |
|------|---------|
| `DEPLOY.md` | Guia completo de deployment (4 plataformas) |
| `vercel.json` | Configuração Vercel |
| `netlify.toml` | Configuração Netlify |
| `.env.production` | Variáveis de produção |
| `Dockerfile` | Containerização |
| `docker-compose.yml` | Orquestração Docker |
| `deploy.sh` | Script de deploy local |
| `docker-deploy.sh` | Script Docker |

---

## ✓ Building Checklist

- [x] Next.js configurado
- [x] Página `/sales` implementada
- [x] TypeScript validado
- [x] Tailwind CSS integrado
- [x] Responsivo (mobile/tablet/desktop)
- [x] Confiars configurados
- [x] Variáveis de ambiente prontas
- [x] Build otimizado
- [x] Deploy pronto

---

## 🎯 Recomendação

**Para MVP:** Use **Vercel** (built by Vercel, optimal performance)

**Para Production:** Configure domínio customizado em qualquer plataforma

---

## 📞 Próximos Passos

1. ✓ Página criada e testada
2. → **Choose deployment platform** (Vercel recommended)
3. → Configure domain (jejumbiblico.com/sales)
4. → Setup email/CRM for leads
5. → Launch ads campaign
6. → Monitor analytics

---

**Pronto para o sucesso! 🎉**
