import { test, expect } from '@playwright/test';

test.describe('Jejum Bíblico App - E2E', () => {
  test('Complete user flow: Register → Wizard → Create Plan → Dashboard', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/');
    
    // 2. Verify landing page loads
    await expect(page.locator('h1')).toContainText('Escolha Jejum');
    
    // 3. Register new user
    const userEmail = `test-${Date.now()}@example.com`;
    const userPassword = 'password123';
    
    // Fill email
    await page.fill('input[type="email"]', userEmail);
    
    // Fill password
    await page.fill('input[type="password"]', userPassword);
    
    // Click register button
    await page.locator('button', { hasText: /Cadastro.*Começar/ }).click();
    
    // Wait for redirect to wizard
    await page.waitForURL('/wizard', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/wizard/);
    
    // 4. Step 1: Select Objective
    await expect(page.locator('h2')).toContainText('Passo 1 de 4');
    
    // Click "Cura" option
    const curaCard = page.locator('div').filter({ hasText: 'Cura' }).first();
    await curaCard.click();
    
    // Click Next
    await page.locator('button', { hasText: 'Próximo' }).click();
    
    // 5. Step 2: Select Duration
    await expect(page.locator('h2')).toContainText('Passo 2 de 4');
    
    // Click "7 dias" option
    const daysCard = page.locator('div').filter({ hasText: '7' }).first();
    await daysCard.click();
    
    // Click Next
    await page.locator('button', { hasText: 'Próximo' }).click();
    
    // 6. Step 3: Select Restrictions
    await expect(page.locator('h2')).toContainText('Passo 3 de 4');
    
    // Just click Next (restrictions are optional)
    await page.locator('button', { hasText: 'Próximo' }).click();
    
    // 7. Step 4: Set Start Date
    await expect(page.locator('h2')).toContainText('Passo 4 de 4');
    
    // Start date should be pre-filled with today
    // Just click "Gerar plano"
    const generateBtn = page.locator('button', { hasText: /Gerar plano|Próximo/ }).last();
    await generateBtn.click();
    
    // 8. Wait for dashboard and verify plan
    await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Verify plan details
    await expect(page.locator('text=Cronograma')).toBeVisible();
    await expect(page.locator('text=Dia 1')).toBeVisible();
    
    // Verify stats cards
    await expect(page.locator('text=Progresso').first()).toBeVisible();
    await expect(page.locator('text=Objetivo')).toBeVisible();
  });
  
  test('Wizard form validation', async ({ page }) => {
    await page.goto('/wizard');
    
    // Try to advance without selecting objective
    const nextBtn = page.locator('button', { hasText: 'Próximo' }).first();
    await nextBtn.click();
    
    // Should show error toast
    await expect(page.locator('text=/Por favor|obrigatório/i')).toBeVisible();
  });
  
  test('Dashboard daily checklist interaction', async ({ page }) => {
    // First, create a plan
    await page.goto('/');
    
    const userEmail = `test-${Date.now()}@example.com`;
    const userPassword = 'password123';
    
    // Register
    await page.fill('input[type="email"]', userEmail);
    await page.fill('input[type="password"]', userPassword);
    await page.locator('button', { hasText: /Cadastro.*Começar/ }).click();
    
    // Complete wizard - Step 1
    await page.waitForURL('/wizard');
    await page.locator('div').filter({ hasText: 'Cura' }).first().click();
    await page.locator('button', { hasText: 'Próximo' }).click();
    
    // Step 2
    await page.locator('div').filter({ hasText: '7' }).first().click();
    await page.locator('button', { hasText: 'Próximo' }).click();
    
    // Step 3
    await page.locator('button', { hasText: 'Próximo' }).click();
    
    // Step 4
    const generateBtn = page.locator('button', { hasText: /Gerar plano|Próximo/ }).last();
    await generateBtn.click();
    
    // Wait for dashboard
    await page.waitForURL('/dashboard');
    
    // Test selecting different days
    const day2Btn = page.locator('text=Dia 2').first();
    await day2Btn.click();
    
    // Verify day 2 details show
    await expect(page.locator('text=Dia 2').first()).toBeVisible();
    
    // Test mood selector
    const moodEmojis = page.locator('button').filter({ hasText: /😔|😊|😍/ });
    const firstMood = moodEmojis.first();
    await firstMood.click();
    
    // Test energy selector
    const energyBtns = page.locator('button[role="button"]').filter({ hasText: /[1-5]/ });
    if (await energyBtns.count() > 0) {
      await energyBtns.first().click();
    }
    
    // Test save checkin button
    const checkinBtn = page.locator('button', { hasText: 'Salvar Check-in' }).first();
    if (await checkinBtn.isEnabled()) {
      await checkinBtn.click();
    }
  });
});
