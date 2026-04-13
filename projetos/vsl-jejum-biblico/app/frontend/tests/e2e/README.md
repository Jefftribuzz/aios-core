# E2E Testing Guide - Jejum Bíblico App

## Setup

Playwright é configurado para testes E2E. Para usar em ambiente local:

```bash
# Instalar dependências de sistema (Ubuntu/Debian):
sudo apt-get install -y \
  libxrandr2 libxcomposite1 libxcursor1 libxdamage1 libxfixes3 \
  libxi6 libgtk-3-0 libatk1.0-0 libcairo-gobject2 libgdk-pixbuf-2.0-0 libasound2

# Instalar Playwright browsers
npx playwright install

# Rodar testes
npm run test:e2e
```

## Test Scenarios

### 1. Complete User Flow (Critical Path)
- **Test:** `Complete user flow: Register → Wizard → Create Plan → Dashboard`
- **Steps:**
  1. Navigate to home page
  2. Register with email/password
  3. Navigate to wizard
  4. Select Objective (Cura, Sabedoria, Libertação, Dedicação)
  5. Select Duration (3, 7, 21, 40 days)
  6. Select Restrictions (optional)
  7. Set Start Date
  8. Submit and create plan
  9. Verify plan appears in dashboard
  10. Verify daily tasks load

**Acceptance Criteria:**
- ✅ User successfully registers
- ✅ Wizard steps progress correctly
- ✅ Plan is created with 200 status
- ✅ Dashboard loads plan data
- ✅ Daily tasks displayed

### 2. Form Validation
- **Test:** `Wizard form validation`
- **Steps:**
  1. Attempt to advance without selecting objective
  2. Verify error message appears
  3. Select objective
  4. Error should disappear

**Acceptance Criteria:**
- ✅ Validation messages appear
- ✅ Form submission blocked on invalid input

### 3. Dashboard Interactions
- **Test:** `Dashboard daily checklist interaction`
- **Steps:**
  1. Create a plan (via wizard)
  2. Navigate to dashboard
  3. Select different days
  4. Verify day details change
  5. Select mood emoji
  6. Select energy level
  7. Save check-in
  8. Verify success message

**Acceptance Criteria:**
- ✅ Day selection works
- ✅ Modal/details update correctly
- ✅ Check-in saves successfully
- ✅ Toast notifications appear

## Manual Testing Checklist

### Landing Page
- [ ] Hero section loads and is readable
- [ ] CTA buttons visible and clickable
- [ ] Auth form: Register tab works
- [ ] Auth form: Login tab works
- [ ] Responsive on mobile, tablet, desktop

### Wizard
- [ ] Step 1: Objective selection works
- [ ] Step 2: Duration selection works
- [ ] Step 3: Restrictions selection works
- [ ] Step 4: Date picker works
- [ ] Progress bar updates
- [ ] Previous/Next buttons work
- [ ] Submit at step 4 creates plan

### Dashboard
- [ ] Plan data loads
- [ ] Timeline shows all days
- [ ] Daily details show correct content
- [ ] Mood picker works (5 emojis)
- [ ] Energy bar works (1-5 levels)
- [ ] Check-in saves
- [ ] Loading states show properly
- [ ] Error states handled

### API Integration
- [ ] POST /auth/register works
- [ ] POST /auth/login works
- [ ] POST /plans creates successfully
- [ ] GET /plans/:id retrieves plan
- [ ] JWT token included in requests
- [ ] 401 on missing auth header
- [ ] 400 on invalid input

## Performance Testing

See [performance.md](./performance.md) for Lighthouse audit results.

## CI/CD Integration

For GitHub Actions, ensure:
```yaml
- name: Install system dependencies
  run: |
    sudo apt-get update
    sudo apt-get install -y libxrandr2 libxcomposite1 ...
    
- name: Install browsers
  run: npx playwright install

- name: Run E2E tests
  run: npm run test:e2e
```

## Debugging

```bash
# Run with visuals (slow, shows browser)
npm run test:e2e:headed

# Run with interactive debugger
npm run test:e2e:debug

# View test report
npx playwright show-report
```
