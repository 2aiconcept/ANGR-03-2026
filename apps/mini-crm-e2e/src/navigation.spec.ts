import { expect, test } from '@playwright/test';
import { login } from './support/login';

test.describe('Navigation et protection des routes', () => {
  // Chaque route protégée par authGuard doit renvoyer un visiteur non connecté vers /connect.
  for (const url of ['/companies', '/companies/add', '/companies/edit/1', '/contacts', '/orders']) {
    test(`${url} est inaccessible sans être connecté`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL('/connect');
    });
  }

  test('la racine du site redirige vers la connexion', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/connect');
  });

  test('une adresse inconnue affiche la page introuvable', async ({ page }) => {
    await page.goto('/cette-page-n-existe-pas');

    await expect(page.locator('app-page-not-found')).toBeVisible();
  });

  test('le menu mène aux trois features et indique la page courante', async ({ page }) => {
    await login(page);
    const nav = page.getByRole('navigation');

    await nav.getByRole('link', { name: 'Contacts' }).click();
    await expect(page).toHaveURL('/contacts');
    await expect(nav.getByRole('link', { name: 'Contacts' })).toHaveAttribute('aria-current', 'page');

    await nav.getByRole('link', { name: 'Commandes' }).click();
    await expect(page).toHaveURL('/orders');

    await nav.getByRole('link', { name: 'Entreprises' }).click();
    await expect(page).toHaveURL('/companies');
    await expect(nav.getByRole('link', { name: 'Entreprises' })).toHaveAttribute('aria-current', 'page');
  });

  test('le menu n\'est pas affiché avant la connexion', async ({ page }) => {
    await page.goto('/connect');

    await expect(page.getByRole('navigation')).toHaveCount(0);
  });

  test('après la déconnexion, le bouton Précédent ne rouvre pas les entreprises', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: 'Déconnexion' }).click();
    await expect(page).toHaveURL('/connect');

    await page.goBack();

    await expect(page).toHaveURL('/connect');
  });

  test('un token invalide ou expiré déconnecte l\'utilisateur (401)', async ({ page }) => {
    // On simule une session dont le token n'est plus accepté par l'API.
    await page.goto('/connect');
    await page.evaluate(() => {
      localStorage.setItem(
        'mini-crm.auth-session',
        JSON.stringify({
          token: 'token-invalide',
          user: { id: 2, email: 'user@test.com', nom: 'Stagiaire', prenom: 'Angular', role: 'user' },
        }),
      );
    });

    await page.goto('/companies');

    await expect(page).toHaveURL('/connect');
    expect(await page.evaluate(() => localStorage.getItem('mini-crm.auth-session'))).toBeNull();
  });
});
