import { expect, test } from '@playwright/test';
import { DEMO_USER, login } from './support/login';

test.describe('Connexion', () => {
  test('un visiteur non connecté est renvoyé vers la page de connexion', async ({ page }) => {
    await page.goto('/companies');

    await expect(page).toHaveURL('/connect');
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
  });

  test('affiche le message de l\'API si le mot de passe est faux', async ({ page }) => {
    await page.goto('/connect');
    await page.getByLabel('Adresse e-mail').fill(DEMO_USER.email);
    await page.getByLabel('Mot de passe').fill('mauvais-mot-de-passe');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(page.getByRole('alert')).toHaveText('Email ou mot de passe incorrect');
    await expect(page).toHaveURL('/connect');
  });

  test('se connecte et affiche le nom de l\'utilisateur dans le header', async ({ page }) => {
    await login(page);

    await expect(page.getByRole('banner')).toContainText(DEMO_USER.fullName);
    await expect(page.getByRole('link', { name: 'Entreprises' })).toBeVisible();
  });

  test('reste connecté après un rafraîchissement de la page', async ({ page }) => {
    await login(page);

    await page.reload();

    await expect(page).toHaveURL('/companies');
    await expect(page.getByRole('banner')).toContainText(DEMO_USER.fullName);
  });

  test('un utilisateur connecté qui revient sur /connect est renvoyé vers les entreprises', async ({
    page,
  }) => {
    await login(page);

    await page.goto('/connect');

    await expect(page).toHaveURL('/companies');
  });

  test('se déconnecte et revient sur la page de connexion', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: 'Déconnexion' }).click();

    await expect(page).toHaveURL('/connect');
    await expect(page.getByRole('banner')).not.toContainText(DEMO_USER.fullName);
  });
});
