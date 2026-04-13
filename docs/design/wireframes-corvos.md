# 📐 Wireframes — Corvos BJJ

**Version:** 1.0  
**Date:** 3 de Março, 2026  
**Status:** ✅ Finalized for MVP  
**Format:** ASCII wireframes + specifications

---

## 🎯 Wireframe Guide

Each screen shows:
1. **Desktop Layout** (1024px+)
2. **Mobile Layout** (mobile-first responsive)
3. **Key Elements** & specifications
4. **User Journey** through the app

---

## 📋 Screen Inventory

1. ✅ Login / Authentication
2. ✅ Dashboard / Home
3. ✅ Students List
4. ✅ Student Detail / Profile
5. ✅ Payments Management
6. ✅ Grades / Promotion Timeline
7. ✅ Payment Detail (bonus)

---

## 1️⃣ LOGIN / AUTHENTICATION

### Desktop (1024px)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [CORVOS BJJ LOGO]                   │
│                   Academia de JJ                        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │      Sistema de Gestão de Academia               │ │
│  │                                                   │ │
│  │  Email:                                           │ │
│  │  [____________________________________]            │ │
│  │  label: "Email de professor"                     │ │
│  │                                                   │ │
│  │  Senha:                                           │ │
│  │  [____________________________________]           │ │
│  │  label: "Mínimo 8 caracteres"                    │ │
│  │                                                   │ │
│  │              [  LOGIN  ]                          │ │
│  │                                                   │ │
│  │  [ ] Lembrar-me        Esqueceu a senha? [link] │ │
│  │                                                   │ │
│  │  ────────────────────────────────────────        │ │
│  │  Versão 1.0 | © 2026 Synkra                      │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘

Background: Light gray (Neutral 50)
Card: White, centered, max-width 420px, shadow-md
```

### Mobile (< 640px)

```
┌──────────────────────┐
│                      │
│  [CORVOS JPG LOGO]   │
│  (smaller, 32px)     │
│                      │
│  Email:              │
│  [______________]    │
│                      │
│  Senha:              │
│  [______________]    │
│  [👁 toggle]         │
│                      │
│  [ LOGIN ]           │
│  (full width,44px)   │
│                      │
│  [Esqueceu senha?]   │
│  (link, centered)    │
│                      │
│  v1.0 © 2026 Synkra │
│                      │
└──────────────────────┘

Full width card, padding: 16px
Buttons: 44px height (touch-friendly)
```

### Key Elements

| Element | Component | Behavior |
|---------|-----------|----------|
| Logo | Image | 64x64px desktop, 48x48px mobile |
| Email input | Text input (md) | Placeholder: "seu@email.com" |
| Password input | Text input (md) | Masked, toggle icon |
| Checkbox | Checkbox | "Lembrar credenciais?" |
| Login button | Primary button | Full width, 44px |
| Forgot password | Link | Opens password reset modal |

### User Journey
```
User arrives → Sees login form → Enters email → Enters password
→ Clicks login → Authenticates → Redirects to Dashboard
```

### Validation Rules
- Email: required, valid format (RFC 5322)
- Password: required, min 8 chars
- Error messages: appear below field in red (Error 600)
- Success: redirect immediately (no thank you page)

---

## 2️⃣ DASHBOARD / HOME

### Desktop (1024px)

```
┌──────────────────────────────────────────────────────────────┐
│ CORVOS BJJ │ Bem-vindo, João │ Settings │ Logout             │ Header
├──────────────────────────────────────────────────────────────┤
│ ┌─────────────┐                                              │
│ │ Dashboard   │  Admin / Professor View                      │
│ │ Alunos      │  "3 de Março, 2026"                         │
│ │ Pagamentos  │                                              │
│ │ Graduações  │  [+Novo Aluno] [Registrar Pag] [Promover]   │ Quick Actions
│ │ ────────────│                                              │
│ │ (sidebar)   │  ┌──────────────┬──────────────┬────────┐   │
│ │             │  │ 42 ALUNOS    │ R$ 9.500,00  │ R$ 600 │   │ KPIs
│ │             │  │ Ativos       │ Fev. 2026    │ Atraso │   │
│ │             │  └──────────────┴──────────────┴────────┘   │
│ │             │                                              │
│ │             │  ┌──────────────────────────────────────┐   │
│ │             │  │ Status de Alunos                     │   │ Chart
│ │             │  │ ✓ 35 Em dia (83%)   ✓ Green          │   │
│ │             │  │ ⏳ 5 Vence em 7d (12%)  ✓ Amber       │   │
│ │             │  │ ⚠ 2 Atrasado (5%)    ✓ Red           │   │
│ │             │  └──────────────────────────────────────┘   │
│ │             │                                              │
│ │             │  ┌──────────────────────────────────────┐   │
│ │             │  │ Próximas Graduações                  │   │ Upcoming
│ │             │  │ • 15/3 - João Silva → Azul          │   │
│ │             │  │ • 22/3 - Maria Santos → Roxa       │   │
│ │             │  └──────────────────────────────────────┘   │
│ │             │                                              │
│ │             │  ┌──────────────────────────────────────┐   │
│ │             │  │ Últimas Ações                        │   │
│ │             │  │ • João Silva pagou R$250 (hoje)     │   │
│ │             │  │ • Novo aluno Pedro (hj - branca)    │   │
│ │             │  │ • Maria promoveu roxa (16/2)        │   │
│ │             │  └──────────────────────────────────────┘   │
│ └─────────────┘                                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Sidebar: 240px width, fixed on desktop
Main: responsive grid (1-2 columns)
Cards: 16px padding, shadow-sm, hover shadow-md
```

### Mobile (< 640px)

```
┌──────────────────────┐
│ ☰ │ Corvos │ 👤 👁   │ Header (top bar)
├──────────────────────┤
│ Bem-vindo, João      │ Greeting
│ 3 de Março, 2026     │
├──────────────────────┤
│ [+ Novo] [Pag] [Prom]│ Quick actions (small buttons)
├──────────────────────┤
│  42 ALUNOS           │ KPI 1
│  Ativos              │
├──────────────────────┤
│  R$ 9.500,00         │ KPI 2
│  Fev 2026            │
├──────────────────────┤
│  R$ 600              │ KPI 3
│  Atraso              │
├──────────────────────┤
│ Status de Alunos     │
│ ✓ 35 Em dia          │ Compact chart
│ ⏳ 5 Pendente         │ (stacked bars)
│ ⚠ 2 Atraso           │
├──────────────────────┤
│ Próximas Graduações  │ Section
│ • 15/3 - João → Azul │
│ • 22/3 - Maria → Roxo│
├──────────────────────┤
│ Últimas Ações        │
│ • João pagou (hoje)  │
│ • Pedro novo aluno   │
│                      │
│ Sidebar:             │ Bottom navigation or
│ [🏠] [👥] [💳] [🎖]  │ side menu icon
│                      │
└──────────────────────┘

Hamburger menu opens sidebar when needed
Cards stack vertically
KPIs take full width
```

### Key Elements

| Section | Component | Details |
|---------|-----------|---------|
| **Header** | Fixed nav | Logo, user greeting, settings, logout |
| **Sidebar** | Navigation menu | Dashboard, Students, Payments, Grades, Settings |
| **KPIs** | Card grid | 3 main metrics: Students, Revenue, Overdue |
| **Chart** | Status visual | Donut or stacked bar, color-coded |
| **Upcoming** | List | Next 2-3 graduations with dates |
| **Recent Activity** | Feed | Last 5 actions timestamped |

### User Journey
```
Login success → Dashboard loads → See KPIs → Choose action
→ Click "Students" or "Payments" etc → Navigate to detail page
```

---

## 3️⃣ STUDENTS LIST

### Desktop (1024px)

```
┌──────────────────────────────────────────────────────────┐
│ CORVOS │ Home │ Alunos │ ...                           │ Header
├──────────────────────────────────────────────────────────┤
│ [Alunos]                                                │
│                                                          │
│ [Search: ___________] [Status: ▼ Todos] [Faixa: ▼ Todos]│ Filters
│ [+ Novo Aluno]                                          │
│                                                          │
│ ┌────────────┬──────────┬─────────┬──────────┬─────────┐│
│ │ NOME       │ EMAIL    │ FONE    │ STATUS   │ AÇÃO    ││ Table Header
│ ├────────────┼──────────┼─────────┼──────────┼─────────┤│
│ │ João Silva │ joao@... │ 1199... │ ✓ Ativo  │ ✎ 🗑    ││ Row 1
│ │ Maria S.   │ maria... │ 1198... │ ✓ Ativo  │ ✎ 🗑    ││ Row 2
│ │ Pedro L.   │ pedro... │ 1197... │ ⏳ Pend. │ ✎ 🗑    ││ Row 3
│ │ Ana Costa  │ ana@...  │ 1196... │ ⚠ Atraso │ ✎ 🗑    ││ Row 4
│ │ José M.    │ jose...  │ 1195... │ ✓ Ativo  │ ✎ 🗑    ││ Row 5
│ └────────────┴──────────┴─────────┴──────────┴─────────┘│
│                                                          │
│ Página 1 de 3 | << 1 2 3 >> | Mostrando 1-5 de 42     │ Pagination
│                                                          │
└──────────────────────────────────────────────────────────┘

Search: Full-width search input
Filters: Dropdowns (Status, Belt)
Table: Columns clickable (sort)
Actions: Edit (pencil), Delete (trash)
```

### Mobile (< 640px)

```
┌──────────────────────┐
│ ☰ │ Alunos │ + Novo  │
├──────────────────────┤
│ [Search box]         │
│ [Status ▼] [Faixa ▼] │
├──────────────────────┤
│ João Silva           │ Name
│ joao@example.com     │ Email
│ 11999... | ✓ Ativo   │ Phone | Status
│ [Edit] [Delete]      │ Actions
├──────────────────────┤
│ Maria Santos         │
│ maria@example.com    │
│ 11988... | ✓ Ativo   │
│ [Edit] [Delete]      │
├──────────────────────┤
│ Pedro Lima           │
│ pedro@example.com    │
│ 11977... | ⏳ Pend    │
│ [Edit] [Delete]      │
├──────────────────────┤
│ << Page 1 >>         │ Pagination
│ [1] 2 3              │
│                      │
│ Mostrando 1-3 de 42  │
└──────────────────────┘

Cards instead of table
Each card = 1 student
Full name, email, phone, status
Action buttons below each
```

### Key Elements

| Element | Type | Behavior |
|---------|------|----------|
| Search box | Text input | Real-time filtering |
| Status filter | Select | Ativo, Inativo, Parado, Todos |
| Belt filter | Select | Branca, Azul, Roxa, Marrom, Preta, Todos |
| Add button | Primary button | Opens Create Student modal |
| Table rows | Clickable | Row click → Student detail |
| Edit icon | Link | Opens edit modal |
| Delete icon | Link | Opens delete confirmation |

### Sorting

- Click column header to sort (ascending/descending)
- Visual indicator (↑↓ icon next to header)
- Default sort: Name A-Z

---

## 4️⃣ STUDENT DETAIL / PROFILE

### Desktop (1024px)

```
┌──────────────────────────────────────────────────────────┐
│ CORVOS │ Home │ Alunos │ João Silva               │ Header
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [← Voltar] JOÃO SILVA                 [Editar] [Deletar]│ Title
│                                                          │
│ ┌──────────────────────┬──────────────────────────────┐ │
│ │ Informações Pessoais │ Email: joao@example.com      │ │
│ │ ─────────────────── │ Telefone: 11999999999       │ │
│ │ Data Nascimento:     │ Data Inicio: 15/01/2024     │ │
│ │ 15/05/2000           │ Status: Ativo               │ │
│ │                      │                            │ │
│ └──────────────────────┴──────────────────────────────┘ │
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │ HISTÓRICO DE GRADUAÇÕES                            │ │
│ │ ────────────────────────────────────────────────── │ │
│ │                                                    │ │
│ │ 2024-01-15  ⚪ BRANCA                              │ │
│ │             "Iniciante"                            │ │
│ │             (Prof. João via sistema)               │ │
│ │                                                    │ │
│ │                    ↓                              │ │
│ │                                                    │ │
│ │ 2025-01-15  🔵 AZUL                               │ │
│ │             "Excelente progression"                │ │
│ │             (Prof. João via sistema)               │ │
│ │                                                    │ │
│ │ [+ Adicionar Promoção]                            │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │ HISTÓRICO DE PAGAMENTOS                            │ │
│ │ ────────────────────────────────────────────────── │ │
│ │                                                    │ │
│ │  Mês      │ Valor    │ Data Pag │ Status         │ │
│ │ ─────────┼──────────┼──────────┼────────────     │ │
│ │ JAN 2026 │ R$250.00 │ 05/01    │ ✓ Pago         │ │
│ │ FEV 2026 │ R$250.00 │ 05/02    │ ✓ Pago         │ │
│ │ MAR 2026 │ R$250.00 │ —        │ ⏳ Pendente    │ │
│ │                                                   │ │
│ │ [+ Registrar Pagamento]                          │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Mobile (< 640px)

```
┌──────────────────────┐
│ ← │ João Silva │ ⋯    │
├──────────────────────┤
│ JOÃO SILVA           │
│ 11999999999          │
│ joao@example.com     │
│ Data Inicio: 15/01   │
│ Status: ✓ Ativo      │
├──────────────────────┤
│ HISTÓRICO FAIXAS     │
│ ────────────────     │
│                      │
│ 15/01/2024           │
│ ⚪ BRANCA             │
│ Iniciante            │
│                      │
│        ↓             │
│                      │
│ 15/01/2025           │
│ 🔵 AZUL              │
│ Excelente progre...  │
│                      │
│ [+ Adicionar Prom.]  │
├──────────────────────┤
│ ÚLTIMOS PAGAMENTOS   │
│                      │
│ JAN 2026 | ✓ Pago   │
│ FEV 2026 | ✓ Pago   │
│ MAR 2026 | ⏳ Pend   │
│                      │
│ [+ Registrar Pag]    │
├──────────────────────┤
│ [Editar] [Deletar]   │
│                      │
└──────────────────────┘
```

### Key Elements

| Section | Components | Details |
|---------|-----------|---------|
| **Header** | Title + actions | Back, Edit, Delete buttons |
| **Personal Info** | Cards | Email, Phone, DOB, Start date, Status |
| **Grades** | Timeline | Visual line with promotion circles |
| **Payments** | Table | Last 12 months, dropdown to expand |
| **Actions** | Buttons | Add promotion, Register payment |

### Interactions

- **Click grade circle**: Show full notes
- **Click "Add promotion"**: Opens promotion modal
- **Click "Register payment"**: Opens payment form
- **Edit button**: Opens edit modal (all fields)
- **Delete button**: Confirmation dialog

---

## 5️⃣ PAYMENTS MANAGEMENT

### Desktop (1024px)

```
┌──────────────────────────────────────────────────────────┐
│ CORVOS │ Home │ Pagamentos │ ...                    │ Header
├──────────────────────────────────────────────────────────┤
│ [Pagamentos]                                             │
│                                                          │
│ [Período: Março 2026 ▼] [Status: ▼ Todos]             │ Filters
│ [+ Novo Pagamento]                                      │
│                                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 📊 RESUMO DE MARÇO                              │    │ Summary
│ │ Pago: R$ 8.750,00 (83%)                         │    │
│ │ Pendente: R$ 1.250,00 (12%)                     │    │
│ │ Atrasado: R$ 500,00 (5%)                        │    │
│ │ TOTAL ESPERADO: R$ 10.500,00                    │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ ┌──────┬────────────┬──────────┬────────┬──────────────┐│
│ │ ALUNO│ VENCIMENTO │ VALOR    │ STATUS │ AÇÃO         ││ Table
│ ├──────┼────────────┼──────────┼────────┼──────────────┤│
│ │ João │ 05/03      │ R$ 250   │ ✓ Pago │ [Ver]        ││
│ │ Maria│ 05/03      │ R$ 250   │ ✓ Pago │ [Ver]        ││
│ │ Pedro│ 05/03      │ R$ 250   │ ⏳ Pend │ [Marcar Pag] ││
│ │ Ana  │ 05/02      │ R$ 250   │ ⚠ Atras│ [Avisar]     ││
│ │ José │ 05/03      │ R$ 250   │ ✓ Pago │ [Ver]        ││
│ └──────┴────────────┴──────────┴────────┴──────────────┘│
│                                                          │
│ Página 1 de 2 | << 1 2 >> | Mostrando 1-5 de 8        │
│                                                          │
└──────────────────────────────────────────────────────────┘

Summary card shows this month's stats
Color-coded status
Quick action buttons in table
```

### Mobile (< 640px)

```
┌──────────────────────┐
│ ☰ │ Pagamentos │ +    │
├──────────────────────┤
│ [Período: Mar ▼]     │
│ [Status: Todos ▼]    │
├──────────────────────┤
│ 📊 RESUMO MARÇO      │
│ Pago: R$ 8.750      │ Green badge
│ Pendente: R$ 1.250  │ Yellow badge
│ Atrasado: R$ 500    │ Red badge
├──────────────────────┤
│ João Silva           │ Student card
│ Venc: 05/03          │
│ R$ 250.00 | ✓ Pago   │
│ [Ver]                │
├──────────────────────┤
│ Maria Santos         │
│ Venc: 05/03          │
│ R$ 250.00 | ✓ Pago   │
│ [Ver]                │
├──────────────────────┤
│ Pedro Lima           │
│ Venc: 05/03          │
│ R$ 250.00 | ⏳ Pend   │
│ [Marcar Pago]        │
├──────────────────────┤
│ Ana Costa            │
│ Venc: 05/02          │
│ R$ 250.00 | ⚠ Atras  │
│ [Avisar/Pagar]       │
├──────────────────────┤
│ << Page 1 >>         │
│ [1] 2                │
└──────────────────────┘

Card layout per payment
Status badges (colored)
Quick action buttons
```

### Key Elements

| Element | Component | Details |
|---------|-----------|---------|
| **Period filter** | Select | YYYY-MM format, default current |
| **Status filter** | Select | Paid, Pending, Overdue, All |
| **Summary card** | Stats | 3-4 KPIs with colors |
| **Payments table** | Data grid | Student, due date, amount, status |
| **Quick actions** | Buttons | "Mark paid", "Send notice", "View" |
| **Add payment** | Primary button | Opens payment form |

### Action Buttons

- **"Mark Paid"**: Quick update to paid status
- **"Send Notice"**: Generate payment notice (future: email/WhatsApp)
- **"View"**: Show payment detail modal
- **"Payment Form"**: Register new payment (amount, method, date)

---

## 6️⃣ GRADES / PROMOTION TIMELINE

### Desktop (1024px)

```
┌──────────────────────────────────────────────────────────┐
│ CORVOS │ Home │ Graduações │ ...                  │ Header
├──────────────────────────────────────────────────────────┤
│ [Graduações]                                             │
│                                                          │
│ [Filtro: Últimos 12 meses ▼] [+ Registrar Promoção]   │ Filters
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │ HISTÓRICO DE PROMOÇÕES                             │ │
│ │ ────────────────────────────────────────────────── │ │
│ │                                                    │ │
│ │ 2025-03-01                                         │ │
│ │ 🔵 João Silva → AZUL                              │ │
│ │    "Técnica excelente"                            │ │
│ │                                                    │ │
│ │ 2025-02-15                                         │ │
│ │ 🟣 Maria Santos → ROXA                            │ │
│ │    "Progressão rápida"                            │ │
│ │                                                    │ │
│ │ 2025-02-01                                         │ │
│ │ 🟤 Pedro Lima → MARROM                            │ │
│ │    "Maturidade técnica"                           │ │
│ │                                                    │ │
│ │ 2025-01-15                                         │ │
│ │ ⚪ Ana Costa → BRANCA                              │ │
│ │    "Novo aluno"                                   │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐│
│ │ ESTATÍSTICAS                                        ││
│ │                                                     ││
│ │ Total Promoções: 12                                ││
│ │ ┌─────────────────────────────────┐                ││
│ │ │ Distribuição por Faixa          │                ││
│ │ │ Branca: 2                       │ Bar chart      ││
│ │ │ Azul:   3                       │ or pie         ││
│ │ │ Roxa:   4                       │                ││
│ │ │ Marrom: 2                       │                ││
│ │ │ Preta:  1                       │                ││
│ │ └─────────────────────────────────┘                ││
│ └─────────────────────────────────────────────────────┘│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Mobile (< 640px)

```
┌──────────────────────┐
│ ☰ │ Graduações │ +   │
├──────────────────────┤
│ [Período: 12m ▼]     │
│                      │
│ HISTÓRICO PROMOÇÕES  │
├──────────────────────┤
│ 01 de Março, 2025    │
│ 🔵 João Silva        │
│ → AZUL               │
│ "Técnica excelente"  │
├──────────────────────┤
│ 15 de Fevereiro      │
│ 🟣 Maria Santos      │
│ → ROXA               │
│ "Progressão rápida"  │
├──────────────────────┤
│ 01 de Fevereiro      │
│ 🟤 Pedro Lima        │
│ → MARROM             │
│ "Maturidade técn."   │
├──────────────────────┤
│ 15 de Janeiro        │
│ ⚪ Ana Costa         │
│ → BRANCA             │
│ "Novo aluno"         │
├──────────────────────┤
│ ESTATÍSTICAS         │
│                      │
│ Branca: ███ 2        │
│ Azul:   ████ 3       │
│ Roxa:   ████████ 4   │
│ Marrom: ███ 2        │
│ Preta:  █ 1          │
│                      │
└──────────────────────┘

Timeline list format
Emoji belt colors
Bar chart for stats
```

### Key Elements

| Element | Component | Details |
|---------|-----------|---------|
| **Period filter** | Select | Last month, 3 months, 6 months, 12 months |
| **Timeline** | Card list | Date, student name, new belt, notes |
| **Belt emoji** | Visual | ⚪ White, 🔵 Blue, 🟣 Purple, 🟤 Brown, ⚫ Black |
| **Statistics** | Chart | Bar or pie chart showing distribution |
| **Add button** | Primary button | Opens promotion form |

### Timeline Interactions

- **Click promotion card**: Show full notes + certificate preview
- **Add button**: Opens modal to register new promotion
  - Student selector
  - Previous belt (auto-filled from student record)
  - New belt selector
  - Notes/comments
  - Generate certificate PDF

---

## 7️⃣ PAYMENT DETAIL / REGISTRATION MODAL

### Modal Form

```
┌──────────────────────────────────────┐
│ Registrar Pagamento              [×] │ Title + close
├──────────────────────────────────────┤
│                                      │ 
│ Aluno:                               │
│ [Select: João Silva ▼]               │
│                                      │
│ Referência:                          │
│ [March 2026 ▼]                       │
│ (auto: "Mar 2026" based on today)   │
│                                      │
│ Data de Pagamento:                   │
│ [📅 03/03/2026]                      │
│                                      │
│ Valor:                               │
│ [R$ ________]                        │
│                                      │
│ Método:                              │
│ ◯ Dinheiro ◯ PIX ◯ Crédito           │
│ ◯ Débito   ◯ Boleto                  │
│                                      │
│ Anotações (opcional):                │
│ [____________________________]        │
│ (ex: PIX p/joao@email.com)          │
│                                      │
│ ────────────────────────────────     │
│ [Cancelar]         [Registrar]       │ Actions
│                                      │
└──────────────────────────────────────┘

Width: 500px (md modal)
Max-width 100% on mobile
Scrollable if needed
```

### Form Fields

| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Student | Select | Must exist | ✅ Yes |
| Reference Month | Select | YYYY-MM format | ✅ Yes |
| Payment Date | Date | ≤ today | ✅ Yes |
| Amount | Number | > 0 | ✅ Yes |
| Method | Radio | One of 5 options | ✅ Yes |
| Notes | Text | Free-form, max 200 chars | ❌ No |

### Validation Rules

```
Student: Must be selected (not empty)
  → Error: "Selecione um aluno"

Payment Date: Must be valid date
  → Error: "Data inválida"
  → Cannot be in future: "Data não pode ser no futuro"

Amount: Must be >= 0.01
  → Error: "Valor deve ser maior que zero"
  → Decimals allowed (250.50 OK)

Method: Must be selected
  → Error: "Selecione um método de pagamento"

On success:
  → Toast: "Pagamento registrado com sucesso"
  → Modal closes
  → Table updates
```

---

## 📱 Responsive Summary Table

| Screen | Layout | Navigation | Buttons |
|--------|--------|-----------|---------|
| **Mobile (<640px)** | Stacked (1 col) | Hamburger menu, bottom nav | Full-width, 44px |
| **Tablet (640-1024px)** | 2+ cols | Collapsible sidebar | Medium size |
| **Desktop (>1024px)** | 3+ cols, sidebar | Fixed sidebar | Standard |

---

## 🎨 Design System Applied

- **Colors**: Primary blue (3b82f6), Semantic (green/amber/red), Neutral grays
- **Typography**: Inter font, heading hierarchy H1-H4
- **Spacing**: 8px base unit (12, 16, 24, 32px gaps)
- **Components**: Button, Input, Select, Card, Badge, Modal, Table
- **Interactions**: Hover effects, focus states, loading states
- **Accessibility**: WCAG AA contrast, keyboard navigation, labels

---

## ✅ Wireframe Checklist

- [x] Login screen (desktop + mobile)
- [x] Dashboard (desktop + mobile)
- [x] Students list (desktop + mobile)
- [x] Student detail (desktop + mobile)
- [x] Payments management (desktop + mobile)
- [x] Grades/timeline (desktop + mobile)
- [x] Payment modal form
- [x] All components labeled
- [x] Responsive notes
- [x] User journeys noted

---

**Wireframes v1.0 — Ready for Dev Handoff**  
**Created: 3 de Março, 2026 | @architect (Aria)**

**Next: Implement in Figma/Adobe XD for final polish**  
Or proceed directly to CBTO-2 (Backend) with these specs
