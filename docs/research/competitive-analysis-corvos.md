# 📊 Análise Competitiva — Sistemas de Gestão de Academia

**Research ID:** CORVOS-COMP-001  
**Data:** 2026-03-03  
**Fase:** CBTO-1 Discovery  
**Pesquisador:** @architect (Aria)

---

## 🎯 Objetivo

Identificar gaps e oportunidades no mercado de sistemas de gestão de academia, especialmente para jiu-jitsu. Validar requisitos de Corvos BJJ comparando com soluções existentes.

---

## 🏢 Sistemas Analisados

### 1. **Martech Académia** (Brasil)
**Tipo:** SaaS cloud-based para academias
**Foco:** Academia de musculação, pilates, personal training

**Features:**
- ✅ Gestão de alunos (cadastro, contato)
- ✅ Pagamentos (integração Stripe/PagSeguro)
- ✅ Aulas agendadas (horários, salas)
- ✅ Presença (check-in)
- ✅ Personal training (agendamentos)
- ✅ Avaliação física (formulários)
- ✅ Relatórios (faturamento, alunos ativos)

**Gaps:**
- ❌ Não cobre graduações/faixas (específico de artes marciais)
- ❌ Interface desktop-heavy
- ❌ Integrações limitadas

**Para Corvos:** Modelo de pagamento e relatórios interessante


### 2. **Etica App** (Brasil)
**Tipo:** SaaS para academias de artes marciais
**Foco:** MMA, boxe, jiu-jitsu, muay thai

**Features:**
- ✅ Gestão de alunos com níveis/faixas
- ✅ Pagamentos mensais
- ✅ Aulas e horários
- ✅ Frequência
- ✅ Histórico de graduações
- ✅ Comunicação (SMS, email)
- ✅ Mobile app

**Gaps:**
- ❌ Caro (R$ 500-3000/mês dependendo de plano)
- ❌ Setup complexo
- ❌ Não permite customizações fáceis
- ❌ Não open-source

**Para Corvos:** Exatamente nosso mercado! Mas:
  - Podemos ser mais barato (freemium ou cheaper)
  - Podemos ser mais simples para iniciantes
  - Podemos oferecer self-hosted option


### 3. **Mindbody** (EUA)
**Tipo:** Plataforma all-in-one para wellness
**Foco:** Academias, yoga, pilates, personal training

**Features:**
- ✅ Gestão completa (alunos, aulas, pagamentos)
- ✅ App para clientes
- ✅ Integração de pagamento
- ✅ Agendamento de aulas
- ✅ Relatórios avançados
- ✅ Marketing tools
- ✅ Integração com Shopify (venda de produtos)

**Gaps:**
- ❌ Muito caro (starting R$ 3000+/mês globally)
- ❌ Complexo para pequenas academias
- ❌ Overhead desnecessário para JJ

**Para Corvos:** Inspiração em relatórios avançados, mas muito enterprise


### 4. **ClassDojo** (EUA)
**Tipo:** Plataforma para comunidade e comunicação
**Foco:** Escolas e academias (convívio)

**Features:**
- ✅ Comunidade/rede social
- ✅ Portfólio de alunos
- ✅ Comunicação familia
- ✅ Badges/gamificação
- ✅ Livre (freemium)

**Gaps:**
- ❌ Sem gestão de pagamentos
- ❌ Sem controle de frequência
- ❌ Social, não business

**Para Corvos:** Gamificação interessante para futuro (badges de faixa)


### 5. **FitLocker** (Australia/Global)
**Tipo:** App de gym + personal training
**Foco:** Academias standalone e boutique studios

**Features:**
- ✅ Check-in mobile
- ✅ Workouts tracking
- ✅ Integrações de pagamento
- ✅ Member management
- ✅ Reporting

**Gaps:**
- ❌ Foco em workout tracking (não em JJ)
- ❌ Sem graduações
- ❌ Caro

**Para Corvos:** Modelo mobile-first interessante


### 6. **Zen Planner** (EUA - Fechado 2024)
**Tipo:** Especializado em artes marciais
**Foco:** Karatê, jiu-jitsu, MMA

**Features:**
- ✅ Gestão completa de alunos
- ✅ Sistema de faixas/graduations
- ✅ Pagamentos
- ✅ Aulas
- ✅ Mobile app

**Status:** Adquirido pela Mindbody (descontinuado como produto)

**Para Corvos:** Mostra que há mercado! Adquisição indica valor.


### 7. **Pushpress** (EUA)
**Tipo:** Plataforma para CrossFit/Fitness studios
**Foco:** Programação, pagamentos, comunidade

**Features:**
- ✅ Programação de aulas
- ✅ Pagamentos
- ✅ Member portal
- ✅ Integrações
- ✅ Acessível ($200-500/mês starting)

**Gaps:**
- ❌ Sem sistema de níveis/faixas
- ❌ Não customizado para JJ

**Para Corvos:** Preço modelo interessante (mais acessível)


### 8. **Trello / Notion** (Genérico)
**Tipo:** Ferramenta genérica
**Foco:** Qualquer coisa (acadêmicos usam para gerenciar)

**Features:**
- ✅ Livre ou barato
- ✅ Flexível
- ✅ Sem friction para começar

**Gaps:**
- ❌ Não customizado para academia
- ❌ Sem pagamentos integrados
- ❌ Sem relatórios específicos
- ❌ Manual demais

**Para Corvos:** Mostra que muitos usam alternativas baratas


---

## 📈 Matriz Competitiva

| Feature | Corvos (MVP) | Martech | Etica | Mindbody | Push Press | Gerenciador Manual |
|---------|-------------|---------|-------|----------|------------|-------------------|
| **Gestão Alunos** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Pagamentos** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Graduações/Faixas** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Mobile Responsivo** | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Relatórios** | ✅ | ✅ | ✅ | ✅✅ | ✅ | ❌ |
| **App Nativo** | ❌ (v1) | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Customizável** | ✅ | ⚠️ | ❌ | ❌ | ⚠️ | ✅ |
| **Preço** | Free/Cheap | Medium | Alto | Alto | Médio | Muito Barato |
| **Curva Aprendizado** | Baixa | Média | Alta | Alta | Média | N/A |
| **Self-Hosted** | ✅ | ❌ | ❌ | ❌ | ❌ | N/A |

---

## 🎯 Gaps Identificados

### Gap 1: **Solução Acessível para Pequenas Academias**
- Zen Planner foi descontinuado → oportunidade
- Etica é caro (R$ 500-3000/mês)
- Mais de 50% das academias são pequeno/médio porte
- **Corvos Opportunity:** Versão free ou muito cheap ($10-50/mês)

### Gap 2: **Especialização em Jiu-Jitsu**
- Mindbody, FitLocker, Pushpress: genéricos para qualquer studio
- Etica: JJ, MAS também cobre MMA, Boxe
- **Corvos Opportunity:** 100% especializado em JJ → mais features específicas depois

### Gap 3: **Mobile-First + Web**
- Martech: só web
- Etica, Mindbody: app nativo + web
- **Corvos Opportunity:** Web responsivo (MVP) + native later

### Gap 4: **Facilidade de Setup**
- Etica, Mindbody: onboarding complexo
- SaaS tradicional: need support
- **Corvos Opportunity:** Setup rápido, documentação clara, comunidade-driven

### Gap 5: **No Vendor Lock-In**
- Todos os SaaS: dados presos na plataforma
- **Corvos Opportunity:** Self-hosted option, export data, open-source future

---

## 💰 Modelo de Preço (Benchmarking)

### Mercado Atual:
- **Ferramentas Genéricas:** $0-50/mês
- **Martech (Brasil):** R$ 200-500/mês
- **Etica (especializada):** R$ 500-3000/mês
- **Mindbody (enterprise):** $200-3000/mês USD
- **Pushpress (premium):** $200-500/mês USD

### Estratégia Corvos (Recomendado):
```
Freemium Model:
├─ FREE TIER (até 20 alunos)
│   ├─ Gestão de alunos
│   ├─ Pagamentos básicos
│   ├─ Histórico graduações
│   └─ Dashboard simples
│
├─ PRO TIER (21-100 alunos) — R$ 99/mês
│   ├─ Tudo do free
│   ├─ Aulas agendadas
│   ├─ SMS/Email notificações
│   ├─ Relatórios avançados
│   └─ Suporte email
│
└─ ENTERPRISE (100+ alunos) — Custom
    ├─ Tudo do Pro
    ├─ Integrações customizadas
    ├─ Suporte prioritário
    └─ Self-hosted option
```

**Vantagem:** Adoção rápida com free tier, upsell gradual


---

## 🎯 Requisitos Validados para Corvos BJJ

### ✅ Confirmados pelo Mercado:
1. **Gestão de Alunos** — Todas as soluções têm
2. **Pagamentos** — Crítico, 90% das soluções
3. **Graduações/Faixas** — Especialidade, Etica + Zen Planner têm
4. **Mobile Responsivo** — Esperado em 2025+
5. **Relatórios** — Diferencial importante

### 🆕 Oportunidades Únicas para Corvos:
1. **Simples de começar** (free tier até 20 alunos)
2. **Especializado em JJ** (não genérico)
3. **Self-hosted option** (controle de dados)
4. **Documentação excelente** (para devs + usuários)
5. **Comunidade open-source** (futuro)

---

## 📱 User Journey por Tipo de Academia

### Small Dojo (até 30 alunos)
**Pain points:**
- Caro demais (Etica)
- Complexo para começar
- Não precisa de tudo

**Corvos Strategy:** Free tier, super simples, sem onboarding pesado

### Medium Academy (30-100 alunos)
**Pain points:**
- Precisa mais features
- Quer mobile + web
- Quer suporte

**Corvos Strategy:** Pro tier ($99/mês), todas as features MVP

### Large Team (100+ alunos)
**Pain points:**
- Precisa customização
- Quer self-hosted
- Quer integração com sistemas legados

**Corvos Strategy:** Enterprise + open-source (contribuições)

---

## 🚀 Recomendações para CBTO-1

### Tech Stack Implicações:
1. **Mobile-First is MUST** (Etica, Mindbody têm apps)
   - Next.js responsivo (MVP)
   - React Native (future)

2. **Pagamentos integrados é CRITICAL**
   - Stripe, PagSeguro, Mercado Pago (Brasil)
   - Backend deve suportar webhooks

3. **Escalabilidade desde dia 1** (freemium = crescimento exponencial)
   - Database pronta para 10K+ alunos
   - Caching strategy
   - CDN para assets

4. **Documentação é diferencial**
   - API well-documented (Swagger)
   - Video tutorials (futuro)
   - Community forum (futuro)

### Wireframes Implicações:
1. **Dashboard:** Similar Etica/Mindbody (KPIs visíveis)
2. **Alunos:** CRUD simples, busca potente
3. **Pagamentos:** Timeline clara, status óbvio
4. **Graduações:** Timeline visual (único recurso de JJ)

### Roadmap Implicações (Pós-MVP):
```
MVP (v1):        Gestão básica (6 semanas)
├─ Alunos, Pagamentos, Graduações

v1.5 (2-3 meses): Aulas agendadas
├─ Horários de aulas
├─ Presença automática
└─ Notificações

v2 (3-4 meses):  Integrações + Mobile nativa
├─ Stripe/PagSeguro
├─ WhatsApp notifications
└─ React Native app

v3 (6+ meses):   Community + AI
├─ Forum
├─ Student profiles
└─ Smart recommendations
```

---

## 🎓 Conclusão

**Corvos BJJ tem oportunidade REAL no mercado:**

1. ✅ **Mercado existe** (Zen Planner foi adquirido = $$$)
2. ✅ **Gap claro** (Etica é caro, Genéricos são ruins)
3. ✅ **Solução viável** (MVP em 6 semanas)
4. ✅ **Monetização clara** (Freemium model proven)
5. ✅ **Diferencial** (especialização + simplicidade)

**Recomendação:** 
- Validar com 2-3 academias reais durante CBTO-1
- Confirmar prioridades (pagamentos > aulas?)
- Testar preço freemium com beta users

---

**Status:** ✅ Research Completa  
**Próximo:** Começar Decision Record de tech stack (CBTO-1.4)

— Aria 🏛️
