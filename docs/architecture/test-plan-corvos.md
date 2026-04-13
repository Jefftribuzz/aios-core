# 🧪 Test Plan — Corvos BJJ

**Version:** 1.0  
**Date:** 3 de Março, 2026  
**Status:** ✅ Ready for implementation  
**Coverage Target:** 75% backend, 70% frontend, 40% E2E

---

## 🎯 Test Strategy Overview

**Pyramid Approach:**
```
            🎭 E2E Tests (15%)
           [System-level workflows]
        
        🔗 Integration Tests (35%)
       [API + Database interactions]
      
    ✅ Unit Tests (50%)
   [Functions, components, mutations]
```

**Philosophy:**
- **Unit tests** catch bugs early (developers write during CBTO-2)
- **Integration tests** validate API contracts (CBTO-2 backend)
- **E2E tests** ensure user workflows work end-to-end (CBTO-3 frontend + CBTO-4 deploy)

**Tools:**
- **Backend:** Jest (testing framework) + Supertest (API testing)
- **Frontend:** Vitest (Jest-compatible) + React Testing Library
- **E2E:** Playwright (browser automation)

---

## 📋 Unit Tests (50% coverage)

### Backend Unit Tests

**Coverage Target:** 75% for backend services/utils

**What to Test:**
```
✅ Validation functions (input → error/valid)
✅ Business logic (calculateLateFee, promotionLogic, etc.)
✅ Utility functions (formatDate, calculateAge, etc.)
✅ Error cases (invalid input, edge cases)
❌ Database queries (covered by integration tests)
❌ HTTP responses (covered by integration tests)
```

**Example 1: Password validation**
```javascript
// src/services/auth.test.js

describe('AuthService', () => {
  describe('validatePassword', () => {
    it('should accept valid password', () => {
      const result = validatePassword('SecurePass123!')
      expect(result.valid).toBe(true)
    })

    it('should reject password < 8 chars', () => {
      const result = validatePassword('Short1!')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must be at least 8 characters')
    })

    it('should reject common patterns', () => {
      const result = validatePassword('password123')
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/common pattern/)
    })

    it('should accept password with special chars', () => {
      const result = validatePassword('Secure@Pass#2024')
      expect(result.valid).toBe(true)
    })
  })
})
```

**Example 2: Payment status calculation**
```javascript
// src/services/payment.test.js

describe('PaymentService', () => {
  describe('getPaymentStatus', () => {
    it('should return "pago" if paid today', () => {
      const payment = {
        status: 'pago',
        payment_date: new Date()
      }
      expect(getPaymentStatus(payment)).toBe('pago')
    })

    it('should return "pendente" if not yet due', () => {
      const tomorrow = new Date(Date.now() + 86400000)
      const payment = {
        status: 'pendente',
        due_date: tomorrow
      }
      expect(getPaymentStatus(payment)).toBe('pendente')
    })

    it('should return "atrasado" if overdue and unpaid', () => {
      const yesterday = new Date(Date.now() - 86400000)
      const payment = {
        status: 'pendente',
        due_date: yesterday
      }
      expect(getPaymentStatus(payment)).toBe('atrasado')
    })

    it('should calculate late fee correctly', () => {
      const payment = {
        amount: 100,
        overdue_days: 10
      }
      const fee = calculateLateFee(payment)
      // Assuming 2% per day
      expect(fee).toBe(100 * 0.02 * 10) // 20
    })
  })
})
```

**Example 3: Validation schema**
```javascript
// src/schemas/student.test.js

describe('StudentSchema', () => {
  it('should validate complete student', () => {
    const data = {
      name: 'João Silva',
      email: 'joao@test.com',
      phone: '11999999999',
      dob: '1990-05-15',
      status: 'ativo',
      belt_color: 'azul'
    }
    const result = StudentSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should reject empty email', () => {
    const data = {
      name: 'João',
      email: '',
      phone: '11999999999'
    }
    const result = StudentSchema.safeParse(data)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path.includes('email')).toBe(true)
  })

  it('should reject invalid DOB (future date)', () => {
    const tomorrow = new Date(Date.now() + 86400000)
    const data = {
      name: 'João',
      dob: tomorrow.toISOString().split('T')[0]
    }
    const result = StudentSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})
```

### Frontend Unit Tests

**Coverage Target:** 70% for component props/logic

**What to Test:**
```
✅ Component rendering (given props, correct output)
✅ User interactions (click, input change)
✅ Conditional rendering (if logged in, show X)
✅ Form validation (errors display)
✅ Hooks (useAuth, usePayments)
❌ CSS styling (covered by visual regression)
❌ External API calls (covered by integration tests)
```

**Example 1: LoginForm component**
```javascript
// src/components/LoginForm.test.jsx

import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('should render email and password inputs', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should show error if email is invalid', async () => {
    render(<LoginForm />)
    const input = screen.getByLabelText(/email/i)
    
    await userEvent.type(input, 'not-an-email')
    fireEvent.blur(input)
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
  })

  it('should enable submit button when form is valid', async () => {
    render(<LoginForm />)
    const submitBtn = screen.getByRole('button', { name: /login/i })
    
    expect(submitBtn).toBeDisabled()
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@exam.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    
    expect(submitBtn).not.toBeDisabled()
  })

  it('should call onSubmit with form data', async () => {
    const mockSubmit = jest.fn()
    render(<LoginForm onSubmit={mockSubmit} />)
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@exam.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@exam.com',
      password: 'password123'
    })
  })
})
```

**Example 2: StudentCard component**
```javascript
// src/components/StudentCard.test.jsx

import { render, screen } from '@testing-library/react'
import StudentCard from './StudentCard'

describe('StudentCard', () => {
  const mockStudent = {
    id: '1',
    name: 'João',
    belt_color: 'azul',
    status: 'ativo',
    email: 'joao@test.com'
  }

  it('should display student information', () => {
    render(<StudentCard student={mockStudent} />)
    expect(screen.getByText('João')).toBeInTheDocument()
    expect(screen.getByText(/azul/i)).toBeInTheDocument()
  })

  it('should show active badge when status is ativo', () => {
    render(<StudentCard student={mockStudent} />)
    expect(screen.getByText(/ativo/i)).toBeInTheDocument()
  })

  it('should show inactive badge when status is inativo', () => {
    const inactiveStudent = { ...mockStudent, status: 'inativo' }
    render(<StudentCard student={inactiveStudent} />)
    expect(screen.getByText(/inativo/i)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveClass('badge-gray')
  })

  it('should call onClick when card is clicked', () => {
    const mockClick = jest.fn()
    render(<StudentCard student={mockStudent} onClick={mockClick} />)
    
    fireEvent.click(screen.getByRole('article'))
    expect(mockClick).toHaveBeenCalledWith(mockStudent.id)
  })
})
```

---

## 🔗 Integration Tests (35% coverage)

**Coverage Target:** All API endpoints + database interactions

**What to Test:**
```
✅ API endpoints (POST /students → database)
✅ Authentication flow (login → token → protected endpoint)
✅ Data validation (invalid input → 400 error)
✅ Authorization (professor cannot delete user)
✅ Database queries (Prisma + PostgreSQL)
✅ Error handling (500, 404, 403)
❌ Third-party services (Stripe, Sendgrid)
```

### API Integration Tests

**Test Framework: Jest + Supertest**

**Example 1: Student creation flow**
```javascript
// tests/integration/students.test.js

const request = require('supertest')
const app = require('../../src/server')
const prisma = require('../../src/db')

describe('POST /students', () => {
  let authToken

  beforeAll(async () => {
    // Login as professor
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'professor@test.com',
        password: 'password123'
      })
    authToken = res.body.accessToken
  })

  afterEach(async () => {
    // Cleanup
    await prisma.student.deleteMany()
  })

  it('should create a new student', async () => {
    const res = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'João Silva',
        email: 'joao@test.com',
        phone: '11999999999',
        dob: '1990-05-15',
        status: 'ativo',
        belt_color: 'branca'
      })

    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    expect(res.body.name).toBe('João Silva')

    // Verify in database
    const student = await prisma.student.findUnique({
      where: { id: res.body.id }
    })
    expect(student).not.toBeNull()
    expect(student.email).toBe('joao@test.com')
  })

  it('should return 400 if email is invalid', async () => {
    const res = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'João',
        email: 'not-an-email',
        phone: '11999999999'
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/email/i)
  })

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .post('/students')
      .send({
        name: 'João',
        email: 'joao@test.com'
      })

    expect(res.status).toBe(401)
  })

  it('should return 403 if user is student (not professor)', async () => {
    // Login as student
    const studentRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'student@test.com',
        password: 'password123'
      })
    const studentToken = studentRes.body.accessToken

    const res = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        name: 'João',
        email: 'joao@test.com'
      })

    expect(res.status).toBe(403)
  })
})
```

**Example 2: Authentication flow**
```javascript
// tests/integration/auth.test.js

describe('POST /auth/login', () => {
  beforeEach(async () => {
    // Create test user
    await prisma.user.create({
      data: {
        email: 'test@test.com',
        password_hash: await bcrypt.hash('password123', 10),
        name: 'Test User',
        role: 'professor'
      }
    })
  })

  it('should return access and refresh tokens on successful login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password123'
      })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeDefined()
    expect(res.body.refreshToken).toBeDefined()
    expect(res.body.user.id).toBeDefined()
  })

  it('should return 401 if password is wrong', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'wrongpassword'
      })

    expect(res.status).toBe(401)
  })

  it('should decode JWT and set user in req', async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password123'
      })

    const token = loginRes.body.accessToken

    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.email).toBe('test@test.com')
  })
})
```

**Example 3: Payment API**
```javascript
// tests/integration/payments.test.js

describe('POST /payments', () => {
  it('should create payment and update student status', async () => {
    const student = await prisma.student.create({
      data: {
        name: 'João',
        email: 'joao@test.com',
        status: 'ativo',
        created_by_id: professId
      }
    })

    const res = await request(app)
      .post('/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        student_id: student.id,
        amount: 150,
        payment_date: new Date(),
        payment_method: 'pix',
        reference_month: '2026-03'
      })

    expect(res.status).toBe(201)
    expect(res.body.status).toBe('pago')

    // Verify database
    const payment = await prisma.payment.findUnique({
      where: { id: res.body.id }
    })
    expect(payment.amount).toBe(150)
  })

  it('should prevent duplicate payment for same month', async () => {
    const student = await prisma.student.create({...})
    
    // Create first payment
    await prisma.payment.create({
      data: {
        student_id: student.id,
        amount: 150,
        reference_month: '2026-03'
      }
    })

    // Try to create duplicate
    const res = await request(app)
      .post('/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        student_id: student.id,
        amount: 150,
        reference_month: '2026-03'
      })

    expect(res.status).toBe(409) // Conflict
  })
})
```

---

## 🎭 E2E Tests (15% coverage)

**Coverage Target:** Critical user workflows

**What to Test:**
```
✅ Login → Dashboard → Manage Student → Logout
✅ Create Payment → Verify in list → Mark as paid
✅ Add Student → Promote → View Certificate
❌ Every button click (covered by unit tests)
❌ CSS pixel-perfect rendering
```

**Tool: Playwright**

**Example 1: Complete student management workflow**
```javascript
// tests/e2e/student-workflow.spec.js

import { test, expect } from '@playwright/test'

test('Professor can create and manage student', async ({ page }) => {
  // 1. Login
  await page.goto('https://corvos.com/login')
  await page.fill('input[type="email"]', 'professor@test.com')
  await page.fill('input[type="password"]', 'password123')
  await page.click('button:has-text("Login")')

  // Verify logged in
  await expect(page).toHaveURL('https://corvos.com/dashboard')
  await expect(page.locator('text=Dashboard')).toBeVisible()

  // 2. Navigate to students
  await page.click('a:has-text("Students")')
  await expect(page).toHaveURL('https://corvos.com/students')

  // 3. Create new student
  await page.click('button:has-text("New Student")')
  await page.fill('input[name="name"]', 'João Silva')
  await page.fill('input[name="email"]', 'joao@test.com')
  await page.fill('input[name="phone"]', '11999999999')
  await page.click('button:has-text("Create")')

  // Verify student created
  await expect(page.locator('text=João Silva')).toBeVisible()

  // 4. View student details
  await page.click('text=João Silva')
  await expect(page).toHaveURL(/\/students\//)
  await expect(page.locator('text=João Silva')).toBeVisible()

  // 5. Logout
  await page.click('button:has-text("Logout")')
  await expect(page).toHaveURL('https://corvos.com/login')
})
```

**Example 2: Payment workflow**
```javascript
// tests/e2e/payment-workflow.spec.js

test('Professor can record monthly payment', async ({ page }) => {
  await loginAs(page, 'professor@test.com')

  // Navigate to Payments
  await page.click('a:has-text("Payments")')

  // Filter by status
  await page.selectOption('select[name="status"]', 'pendente')

  // Find student and record payment
  await page.click('button:has-text("Record Payment")[data-student-id="1"]')
  
  // Fill payment form
  await page.fill('input[name="amount"]', '150')
  await page.selectOption('select[name="method"]', 'pix')
  await page.click('button:has-text("Confirm")')

  // Verify payment recorded
  await expect(page.locator('text=Payment recorded')).toBeVisible()
  
  // Verify in list
  const row = page.locator('text=João').first()
  await expect(row.locator('text=pago')).toBeVisible()
})
```

---

## 📊 Test Coverage Targets

| Layer | Coverage | Type | Tools | Total Tests |
|-------|----------|------|-------|-------------|
| **Unit** | 75% | Services, utils, components | Jest, Vitest | 80-100 |
| **Integration** | 40% | API endpoints, DB layers | Jest + Supertest | 30-40 |
| **E2E** | 20% | Critical workflows | Playwright | 10-15 |
| **Total** | ~50% | Blended | All | 120-155 |

---

## 🛠️ Running Tests

### Local Development (CBTO-2)

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm test -- --testPathPattern=unit

# Run only integration tests
npm test -- --testPathPattern=integration

# Watch mode (auto-rerun on change)
npm test -- --watch

# Specific test file
npm test -- auth.test.js
```

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        options: >-
          --health-cmd pg_isready
          --health-interval 10s

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm install
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run test:e2e

      # Report coverage
      - uses: codecov/codecov-action@v2
        with:
          files: ./coverage/lcov.info
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
npm test -- --bail
```

---

## 📈 Test Metrics (Target)

| Metric | Target | Tool | CBTO-2 | CBTO-3 | CBTO-4 |
|--------|--------|------|--------|---------|---------|
| Code coverage | 75% | Jest/Vitest | 50% | 85% | 95% |
| Test count | 120+ | Jest | 80 | 100 | 135 |
| E2E workflows | 15+ | Playwright | 0 | 5 | 15 |
| Performance target | <2s average | App metrics | N/A | <2s | <1.5s |
| Bug escape rate | <2% | Prod metrics | N/A | <3% | <1% |

---

## ✅ Test Readiness Checklist

**For CBTO-2 Backend:**
- [ ] Jest configured with preset
- [ ] Test utilities (factory functions, fixtures)
- [ ] Database test instance setup (Docker pg)
- [ ] Mock auth strategy
- [ ] First 20 unit tests written (auth + validation)
- [ ] Integration tests for 5 main endpoints

**For CBTO-3 Frontend:**
- [ ] Vitest configured
- [ ] React Testing Library setup
- [ ] Mock API responses (@testing-library/msw)
- [ ] Component tests for 10 main components
- [ ] E2E tests for 5 critical workflows (Playwright)

**For CBTO-4 Deployment:**
- [ ] Test coverage >80%
- [ ] E2E tests passing
- [ ] CI/CD pipeline running tests on every push
- [ ] Artifact: Coverage report published

---

## 🎯 Quality Gates

**Before CBTO-2 completion:**
- [ ] 50% code coverage minimum
- [ ] 0 failing tests
- [ ] 0 security warnings (npm audit)
- [ ] Performance baseline recorded

**Before production deployment:**
- [ ] 75% code coverage minimum
- [ ] All E2E tests passing
- [ ] 0 high-severity vulnerabilities
- [ ] Load testing: 100 concurrent users

---

**Test Plan v1.0 — MVP Ready**  
**Created: 3 de Março, 2026 | @architect (Aria)**

**Implementation:** Integrate test setup into CBTO-2 backend initialization  
**Status:** Ready to hand off to @dev for implementation
