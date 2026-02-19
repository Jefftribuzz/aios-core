# 🚀 Guia de Deploy - Jejum Bíblico Landing Page

## Resumo
Seu frontend Next.js está pronto para deploy em produção. Escolha a plataforma que mais se adequa às suas necessidades.

---

## 📋 Opção 1: Vercel (RECOMENDADO - Mais Fácil) ⭐

**Vantagens:**
- Criado pelos mesmos devs do Next.js
- Deploy com 1 clique
- Builds super rápidos
- Gratuito com opções pagos
- CI/CD automático

**Passos:**

1. Acesse https://vercel.com/login
2. Clique em "Sign In with GitHub"
3. Conecte seu repositório SynkraAI/aios-core
4. Selecione a pasta: `/projetos/vsl-jejum-biblico/app/frontend`
5. Configure as variáveis de ambiente:
   ```
   NEXT_PUBLIC_API_URL=https://api.jejumbiblico.com/api
   NEXT_PUBLIC_APP_NAME=Jejum Bíblico
   NEXT_PUBLIC_APP_DESCRIPTION=Transformação Espiritual Genuína
   ```
6. Clique em "Deploy"

**URL Final:** `https://seu-projeto.vercel.app`

**Depois:**
- Cada push para `main` faz deploy automático
- Preview URLs para PRs
- Rollback de 1 clique

---

## 📋 Opção 2: Netlify (Muito Fácil)

**Vantagens:**
- Interface intuitiva
- Deploy automático
- Formulários integrados
- Serverless functions fáceis
- Gratuito com bom tier pro

**Passos:**

1. Acesse https://netlify.com
2. Clique em "New site from Git"
3. Escolha GitHub e autorize
4. Busque por `aios-core`
5. Selecione a pasta: `/projetos/vsl-jejum-biblico/app/frontend`
6. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
7. Configure variáveis em Settings → Build & Deploy → Environment
8. Clique em "Deploy"

**URL Final:** `https://seu-projeto.netlify.app`

---

## 📋 Opção 3: Railway (Full-Stack Completo)

**Vantagens:**
- Ótimo para full-stack
- Banco de dados integrado
- Variáveis de ambiente simples
- Plano gratuito com créditos
- Deployment automático

**Passos:**

1. Acesse https://railway.app
2. Clique em "New Project"
3. Escolha "Deploy from GitHub"
4. Conecte seu repo
5. Selecione `/projetos/vsl-jejum-biblico/app/frontend`
6. Railway detecta Next.js automaticamente
7. Adicione variáveis em Variables
8. Clique em "Deploy"

**URL Final:** `https://seu-projeto.up.railway.app`

---

## 📋 Opção 4: AWS Amplify

**Vantagens:**
- Infraestrutura robusta
- Integração com AWS services
- Bom para escalabilidade
- CDN global
- Tier gratuito

**Passos:**

1. Acesse https://console.aws.amazon.com/amplify
2. Clique em "New App" → "Host Web App"
3. Escolha GitHub
4. Conecte e autorize seu repo
5. Selecione a branch `main`
6. Configure:
   - Project: `aios-core`
   - Branch: `main`
   - Base directory: `projetos/vsl-jejum-biblico/app/frontend`
7. Configure Build Settings:
   - Build command: `npm run build`
   - Artifact: `.next`
8. Clique "Save and Deploy"

**URL Final:** `https://seu-projeto.amplifyapp.com`

---

## 🔧 Variáveis de Ambiente para Produção

Use estas variáveis em qualquer plataforma:

```env
NEXT_PUBLIC_API_URL=https://api.jejumbiblico.com/api
NEXT_PUBLIC_APP_NAME=Jejum Bíblico
NEXT_PUBLIC_APP_DESCRIPTION=Transformação Espiritual Genuína
NODE_ENV=production
```

**Altere `api.jejumbiblico.com` para seu próprio domínio de API**

---

## ✅ Checklist Pré-Deploy

- [x] Build local testado: `npm run build`
- [x] Sem erros de TypeScript
- [x] Sem warnings do ESLint
- [x] Variáveis de ambiente configuradas
- [x] netlify.toml e vercel.json criados
- [x] .env.production configurado
- [x] README.md atualizado
- [x] Página `/sales` testada

---

## 🚀 Deploy Rápido (5 minutos)

### Via Vercel CLI (Para Profissionais)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Entrar na pasta do frontend
cd projetos/vsl-jejum-biblico/app/frontend

# 3. Deploy
vercel

# 4. Responda as perguntas
# - Linked to ... ✔
# - Production ✔
# - Overwrite .vercelignore? y
```

**Resultado:** Deploy em produção em segundos!

---

## 📊 Comparação de Plataformas

| Plataforma | Facilidade | Preço | Perfil | Recomendado Para |
|-----------|-----------|-------|--------|-----------------|
| **Vercel** | ⭐⭐⭐⭐⭐ | Gratuito + $ | Next.js nativo | Landing Pages |
| **Netlify** | ⭐⭐⭐⭐ | Gratuito + $ | Versátil | Qualquer projeto |
| **Railway** | ⭐⭐⭐⭐ | Gratuito + $ | Full-Stack | Projetos Completos |
| **AWS Amplify** | ⭐⭐⭐ | $ | Escalabilidade | Grandes Empresas |

---

## 🎯 My Recommendation (MVP)

Para seu projeto **Jejum Bíblico**, recomendo:

1. **Agora (MVP):** Deploy em **Vercel** (1 clique, melhor performance)
2. **Depois:** Setup de domínio customizado (`jejumbiblico.com/sales`)
3. **Futuro:** Adicionar backend em Railway se necessário

---

## 🔗 Links Úteis

- Documentação Next.js Deploy: https://nextjs.org/docs/deployment
- Vercel Dashboard: https://vercel.com/dashboard
- Netlify Dashboard: https://app.netlify.com
- Railway Dashboard: https://railway.app

---

## ❓ Dúvidas Comuns

**P: Qual é melhor para conversão?**
R: Vercel (performance otimizada para Next.js, CDN global = velocidade máxima)

**P: Posso usar domínio próprio?**
R: Sim! Configure em qualquer plataforma com redirecionamento DNS

**P: Preciso de banco de dados?**
R: Página é estática. Backend separado em outra plataforma (Railway/Heroku)

**P: Como atualizar depois do deploy?**
R: Git push automático > CI/CD automático > Deploy automático

---

## 📞 Próximas Etapas

1. Escolha plataforma (Vercel recomendado)
2. Deploy em 5 minutos
3. Configure domínio
4. Teste página em produção
5. Setup de email para leads
6. Analytics e tracking

---

**Pronto para o sucesso! 🚀**
