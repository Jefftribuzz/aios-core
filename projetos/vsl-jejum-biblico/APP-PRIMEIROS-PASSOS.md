# 📱 App Jejum Bíblico — Primeiros Passos

Bem-vindo! Estruturei o projeto completo para criar um app de jejum bíblico seguindo a metodologia AIOS (Story-Driven Development).

## 🎯 O Que Foi Criado

### 1. **Épica Principal** ← Leia isto primeiro
📁 `/docs/stories/epics/epic-app-jejum-biblico/README.md`

- Visão geral do projeto (200-280 horas)
- Squad responsável
- 6 stories principais
- Arquitetura alto-nível
- Success metrics

### 2. **Stories Executáveis** (em prioridade)

#### Story JB-1: Discovery & Arquitetura ⭐ START HERE
📁 `/docs/stories/active/story-jb-1-discovery-arquitetura.md`  
**Assignee:** @architect  
**Esforço:** 24-32h  
**Status:** Ready to start

**O que faz:**
- Analisa 5-7 apps similares (competitive analysis)
- Pesquisa usuários
- Define tech stack (frontend, backend, database)
- Cria wireframes dos 4 flows principais
- Documenta arquitetura + API spec

**Deliverables:**
- Competitive analysis com gaps de mercado
- Wireframes (Figma/PDF)
- Decision records (tech stack)
- API specification (Swagger)

---

#### Story JB-2: Backend MVP
📁 `/docs/stories/active/story-jb-2-backend-mvp.md`  
**Assignee:** @dev, @data-engineer  
**Esforço:** 40-56h  
**Status:** Blocked on JB-1  
**Depends on:** JB-1 completo

**O que faz:**
- Cria database schema completo
- Implementa APIs de criação + recuperação de planos
- Constrói "plan generation engine" (algoritmo que gera cronogramas)
- Setup auth básico (JWT)
- Testes + documentação

**Deliverables:**
- Backend em Node.js/Python (definido em JB-1)
- APIs funcionais (/auth, /plans, /content)
- Database schema pronto
- Swagger documentation

---

#### Story JB-3: Frontend MVP
📁 `/docs/stories/active/story-jb-3-frontend-mvp.md`  
**Assignee:** @dev  
**Esforço:** 32-48h  
**Status:** Blocked on JB-2  
**Depends on:** JB-2 + JB-1

**O que faz:**
- Landing page com CTA
- Wizard interativo (4 steps)
- Dashboard com plano + checklist diário
- Responsivo mobile/desktop
- Integração com backend

**Deliverables:**
- Frontend em React/Next.js (definido em JB-1)
- Landing → Wizard → Dashboard funcional
- E2E tests (wizard criar plano → dashboard)
- Lighthouse score 85+

---

## 🚀 Como Começar

### Opção A: Workflow AIOS Completo (Recomendado)

1. **Leia a Épica:**
   ```bash
   cat docs/stories/epics/epic-app-jejum-biblico/README.md
   ```

2. **Comece com Story JB-1:**
   ```bash
   # Atribuir para @architect
   # Criar planning session
   # Executar discovery + arquitetura
   ```

3. **Depois JB-2 + JB-3 em paralelo:**
   - @dev trabalha backend (JB-2)
   - @dev trabalha frontend (JB-3)
   - Ambos dependem de JB-1 estar completo

4. **Siga as stories até conclusion**

---

### Opção B: Rápida (Se quer começar já)

Se quiser prototipar rapidinho sem esperar discovery completo:

1. **Clone/fork o projeto:**
   ```bash
   cd projetos/vsl-jejum-biblico/app
   ```

2. **Setup backend simples (Node.js + Express):**
   ```bash
   mkdir backend && cd backend
   npm init -y
   npm install express cors dotenv
   # Copie estrutura de JB-2
   ```

3. **Setup frontend simples (React):**
   ```bash
   npx create-react-app frontend
   cd frontend
   npm install axios
   # Implemente wizard básico
   ```

4. **Conecte os dois**

---

## 📊 Estrutura de Pastas Proposta

```
projetos/vsl-jejum-biblico/
├── app/                      # ← Seu código vai aqui
│   ├── backend/
│   │   ├── src/
│   │   │   ├── api/routes/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── index.js
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── .env.example
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── styles/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── .env.example
│   └── README.md              # Instruções de setup
├── architecture/              # Documentação técnica
│   ├── api-spec.md
│   ├── system-architecture.md
│   └── tech-stack-decision.md
├── research/                  # Market research
│   ├── competitive-analysis.md
│   └── user-interviews.md
├── design/                    # Wireframes, UI kit
│   ├── wireframes/
│   └── design-system.md
├── content/                   # Base de orações, meditações
│   ├── prayers.json
│   ├── meditations.json
│   └── meals.json
└── README.md                  # Este arquivo
```

---

## 💡 Quick Reference

### Agentes AIOS
Use no contexto da sua IDE (Claude Code, Cursor, etc.):

- `@po` — Product Owner (decisões de negócio)
- `@architect` — Arquiteto (design técnico) → **começa aqui**
- `@dev` — Desenvolvedor (implementação)
- `@qa` — QA (testes)
- `@data-engineer` — Data Engineer (database)
- `@ux-design-expert` — UX Designer (interface)

### Comandos Úteis
```bash
# Ler a épica
cat docs/stories/epics/epic-app-jejum-biblico/README.md

# Ler story JB-1
cat docs/stories/active/story-jb-1-discovery-arquitetura.md

# Ler story JB-2
cat docs/stories/active/story-jb-2-backend-mvp.md

# Ler story JB-3
cat docs/stories/active/story-jb-3-frontend-mvp.md

# Versão JSON de backlog (se existe)
cat docs/stories/backlog.json
```

---

## 🎯 Success Criteria Resumido

**MVP deve ter:**
- ✅ Usuário cria plano em < 2 min (wizard)
- ✅ Plano contém cronograma + dieta + orações + meditações
- ✅ Dashboard mostra progresso diário
- ✅ Responsivo mobile/desktop
- ✅ Backend com APIs funcionais
- ✅ Testes com 80%+ cobertura

---

## 🔗 Próximas Stories (Após MVP)

- **JB-4:** Conteúdo — Orações, meditações, refeições
- **JB-5:** Community integration — Discord, depoimentos, shares
- **JB-6:** QA & Launch — Testes finais, produção

---

## 📞 Próximo Passo

### Agora, escolha:

**1️⃣ Seguir o workflow AIOS:**
```
Chat: "@architect"
Message: "Let's kickoff JB-1, beginning with competitive analysis"
```

**2️⃣ Prototipar rapidinho:**
```
No formalities, just code! (não siga stories rigidamente)
```

**3️⃣ Entender arquitetura primeiro:**
```
Chat: "@architect"
Message: "Discutir a arquitetura de sistema para o app"
```

---

## 📚 Documentação Relacionada

- [AGENTS.md](../../AGENTS.md) — Como ativar agentes
- [CLAUDE.md](./.claude/CLAUDE.md) — Workflow Claude Code
- [Constitution](./.aios-core/constitution.md) — Princípios AIOS

---

**Criado em:** 2026-02-18  
**Última atualização:** 2026-02-18  
**Status:** 🚀 Ready to Kickoff

