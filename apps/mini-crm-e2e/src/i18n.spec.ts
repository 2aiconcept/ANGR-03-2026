import { expect, test } from '@playwright/test';
import { login } from './support/login';

test.describe('Traduction', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await expect(page.getByRole('heading', { name: 'Entreprises' })).toBeVisible();
  });

  test('passe l\'application en anglais puis revient en français', async ({ page }) => {
    // exact: true, sinon « EN » trouverait aussi « Ajouter une entreprise ».
    await page.getByRole('button', { name: 'EN', exact: true }).click();

    await expect(page.getByRole('heading', { name: 'Companies' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Orders' })).toBeVisible();
    // L'attribut lang de la page suit la langue choisie (utile aux lecteurs d'écran).
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('button', { name: 'EN', exact: true })).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'FR', exact: true }).click();

    await expect(page.getByRole('heading', { name: 'Entreprises' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });

  test('traduit aussi les messages de validation du formulaire', async ({ page }) => {
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await page.getByRole('button', { name: 'Add a company' }).click();

    await page.getByLabel('Name').focus();
    await page.getByLabel('Industry').focus();

    await expect(page.getByRole('heading', { name: 'Add a company' })).toBeVisible();
    await expect(page.getByText('Name is required.')).toBeVisible();
  });

  test('traduit la boîte de confirmation de suppression', async ({ page }) => {
    await page.getByRole('button', { name: 'EN', exact: true }).click();

    await page.getByRole('row').nth(1).getByRole('button', { name: 'Delete' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Delete the company' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });
});
