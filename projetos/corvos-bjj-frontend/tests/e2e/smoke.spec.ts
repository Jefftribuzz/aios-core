import { test, expect } from '@playwright/test';

test.describe('Corvos BJJ frontend smoke', () => {
  test('redirects root to dashboard and blocks unauthorized access', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('renders login form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: 'Entrar no Corvos BJJ' })).toBeVisible();
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });

  test('navigates authenticated flow dashboard -> alunos -> pagamentos', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'e2e-token');
      localStorage.setItem('refreshToken', 'e2e-refresh');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 'u-e2e',
          name: 'Professor E2E',
          email: 'professor@corvosbjj.com',
          role: 'professor',
        })
      );
    });

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    await page.getByRole('link', { name: 'Alunos' }).click();
    await expect(page).toHaveURL(/\/students/);
    await expect(page.getByRole('heading', { name: 'Alunos' })).toBeVisible();

    await page.getByRole('link', { name: 'Pagamentos' }).click();
    await expect(page).toHaveURL(/\/payments/);
    await expect(page.getByRole('heading', { name: 'Pagamentos' })).toBeVisible();
  });
});
