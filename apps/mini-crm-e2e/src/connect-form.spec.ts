import { expect, test } from '@playwright/test';

test.describe('Formulaire de connexion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/connect');
  });

  test('le bouton reste désactivé tant que le formulaire est vide', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeDisabled();
  });

  test('signale un e-mail au mauvais format', async ({ page }) => {
    await page.getByLabel('Adresse e-mail').fill('pas-un-email');
    await page.getByLabel('Mot de passe').focus();

    await expect(page.getByText("Le format de l'adresse email est invalide")).toBeVisible();
    await expect(page.getByLabel('Adresse e-mail')).toHaveAttribute('aria-invalid', 'true');
  });

  test('signale un mot de passe trop court', async ({ page }) => {
    await page.getByLabel('Mot de passe').fill('123');
    await page.getByLabel('Adresse e-mail').focus();

    await expect(page.getByText('Le mot de passe doit contenir au moins 6 caractères')).toBeVisible();
  });

  test('bascule vers l\'inscription, qui demande aussi le prénom et le nom', async ({ page }) => {
    await expect(page.getByLabel('Prénom')).toHaveCount(0);

    await page.getByRole('button', { name: 'Créer un compte' }).click();

    await expect(page.getByRole('heading', { name: 'Inscription' })).toBeVisible();
    await expect(page.getByLabel('Prénom')).toBeVisible();
    await expect(page.getByLabel('Nom', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer mon compte' })).toBeVisible();
  });

  test('inscrit un nouvel utilisateur et le connecte directement', async ({ page }) => {
    // Un e-mail unique à chaque exécution, sinon l'API refuse (compte déjà existant).
    const email = `e2e-${Date.now()}@example.com`;

    await page.getByRole('button', { name: 'Créer un compte' }).click();
    await page.getByLabel('Prénom').fill('Jean');
    await page.getByLabel('Nom', { exact: true }).fill('Testeur');
    await page.getByLabel('Adresse e-mail').fill(email);
    await page.getByLabel('Mot de passe').fill('password123');
    await page.getByRole('button', { name: 'Créer mon compte' }).click();

    await expect(page).toHaveURL('/companies');
    await expect(page.getByRole('banner')).toContainText('Jean Testeur');
  });

  test('affiche le message de l\'API si l\'e-mail est déjà utilisé', async ({ page }) => {
    await page.getByRole('button', { name: 'Créer un compte' }).click();
    await page.getByLabel('Prénom').fill('Angular');
    await page.getByLabel('Nom', { exact: true }).fill('Stagiaire');
    await page.getByLabel('Adresse e-mail').fill('user@test.com');
    await page.getByLabel('Mot de passe').fill('password123');
    await page.getByRole('button', { name: 'Créer mon compte' }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page).toHaveURL('/connect');
  });

  test('se connecte uniquement au clavier', async ({ page }) => {
    await page.getByLabel('Adresse e-mail').focus();
    await page.keyboard.type('user@test.com');
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Mot de passe')).toBeFocused();
    await page.keyboard.type('password123');
    // On attend que le formulaire soit valide avant de valider avec Entrée.
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeEnabled();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL('/companies');
  });
});
