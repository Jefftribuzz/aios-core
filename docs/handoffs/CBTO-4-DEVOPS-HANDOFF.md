# CBTO-4 DevOps Handoff — Corvos BJJ

## Objetivo
Entregar para @devops a execução final de staging/produção com checklist operacional, baseado no estado atual do projeto Corvos BJJ.

## Estado Atual (2026-03-04)

### Pronto (validado localmente)
- Backend containerizado
  - `projetos/corvos-bjj-backend/Dockerfile`
  - `projetos/corvos-bjj-backend/.dockerignore`
- Frontend containerizado
  - `projetos/corvos-bjj-frontend/Dockerfile`
  - `projetos/corvos-bjj-frontend/.dockerignore`
- Stack full-stack local
  - `projetos/corvos-bjj-backend/docker-compose.fullstack.yml`
  - Validado com `docker compose config` e `up/down`
- Quality gates locais
  - Frontend: lint + test + build + e2e verdes
  - Backend: type-check + test:coverage verde (branches > threshold)

### Já existente em CI
- Workflow principal em `.github/workflows/ci.yml`
- Job dedicado de integração backend Corvos: `corvos-bjj-backend`

## Checklist de Execução @devops

### 1) Preparar segredos e variáveis (GitHub/Plataformas)
- [ ] Definir segredos de produção para backend
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`
  - `EMAIL_FROM`
  - `EMAIL_API_KEY`
- [ ] Definir variáveis públicas do frontend
  - `NEXT_PUBLIC_API_URL`
- [ ] Definir ambiente de staging e produção (separados)

### Secrets obrigatórios para os novos workflows CD

- [ ] `STAGING_BACKEND_DEPLOY_HOOK_URL`
- [ ] `STAGING_FRONTEND_DEPLOY_HOOK_URL`
- [ ] `PROD_BACKEND_DEPLOY_HOOK_URL`
- [ ] `PROD_FRONTEND_DEPLOY_HOOK_URL`

Workflows criados:
- `.github/workflows/corvos-cd-staging.yml`
- `.github/workflows/corvos-cd-production.yml`

### 2) CI/CD
- [ ] Confirmar CI em PR para mudanças de Corvos (backend e frontend)
- [x] Workflow de CD para staging criado (build backend/frontend + trigger por deploy hook)
- [x] Workflow/manual gate para produção criado (confirmação `DEPLOY_PROD` + environment `production`)

### 2.1) Execução direta pelo @devops (sem parar)
- [ ] Plugar os 4 secrets no repositório
- [ ] Rodar staging manualmente em Actions: **Corvos CD - Staging**
- [ ] Validar deploy em staging
- [ ] Rodar produção em Actions: **Corvos CD - Production** com input `DEPLOY_PROD`
- [ ] Validar deploy em produção

Comandos prontos (CLI):

```bash
gh secret set STAGING_BACKEND_DEPLOY_HOOK_URL -R SynkraAI/aios-core
gh secret set STAGING_FRONTEND_DEPLOY_HOOK_URL -R SynkraAI/aios-core
gh secret set PROD_BACKEND_DEPLOY_HOOK_URL -R SynkraAI/aios-core
gh secret set PROD_FRONTEND_DEPLOY_HOOK_URL -R SynkraAI/aios-core

gh workflow run "Corvos CD - Staging" -R SynkraAI/aios-core
gh workflow run "Corvos CD - Production" -R SynkraAI/aios-core -f confirm=DEPLOY_PROD
```

### 3) Deploy
- [ ] Backend em plataforma (Railway/Render/Heroku)
- [ ] Frontend em plataforma (Vercel/Netlify)
- [ ] Validar health checks
  - Backend: `GET /health`
  - Frontend: rota `/login` disponível

### 4) Pós-deploy obrigatório
- [ ] Configurar domínio customizado
- [ ] Ativar HTTPS
- [ ] Configurar backup automático de banco
- [ ] Configurar monitoramento mínimo
  - Uptime backend
  - Uptime frontend
  - Alertas de falha de deploy

## Smoke Test de Produção (Go/No-Go)
- [ ] Login com credencial válida
- [ ] Navegação protegida (`/dashboard` -> `/students` -> `/payments` -> `/grades`)
- [ ] CRUD básico de aluno
- [ ] CRUD básico de pagamento
- [ ] CRUD básico de graduação
- [ ] Renovação de sessão (`/auth/refresh`)

Runbook operacional para @qa executar sem parar após deploy:
- `docs/handoffs/CBTO-4-QA-SMOKE-RUNBOOK.md`

## Critério de Aceite para Fechar CBTO-4
- [ ] CD staging ativo
- [ ] Produção publicada (backend + frontend)
- [ ] Domínio + HTTPS ativos
- [ ] Backups automáticos configurados
- [ ] Observabilidade mínima ativa

## Observações de Governança
- Push para remoto é responsabilidade exclusiva de @devops conforme política do repositório.
- Este handoff consolida apenas execução de infraestrutura e publicação; escopo de produto local já está validado.
