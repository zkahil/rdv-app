import { test, expect } from '@playwright/test';

test('la page de connexion s\'affiche correctement', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test('affiche une erreur avec des identifiants invalides', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'inconnu@test.com');
  await page.fill('input[type="password"]', 'motdepasseinvalide');
  await page.click('button[type="submit"]');
  await expect(page.getByText('Identifiants invalides')).toBeVisible();
});
