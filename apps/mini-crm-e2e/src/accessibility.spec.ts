import AxeBuilder from '@axe-core/playwright';
import { expect, Page, test } from '@playwright/test';
import { login } from './support/login';

/** Analyse la page avec axe, sur les règles WCAG 2.2 niveaux A et AA (exigées par le projet). */
async function expectNoAccessibilityViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  // En cas d'échec, on affiche seulement l'id de la règle et le nombre d'éléments concernés.
  const violations = results.violations.map((violation) => `${violation.id} (${violation.nodes.length})`);
  expect(violations).toEqual([]);
}

test.describe('Accessibilité (axe)', () => {
  test('page de connexion', async ({ page }) => {
    await page.goto('/connect');
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();

    await expectNoAccessibilityViolations(page);
  });

  test('page de connexion en mode inscription, avec des erreurs affichées', async ({ page }) => {
    await page.goto('/connect');
    await page.getByRole('button', { name: 'Créer un compte' }).click();
    await page.getByLabel('Adresse e-mail').fill('pas-un-email');
    await page.getByLabel('Mot de passe').focus();

    await expectNoAccessibilityViolations(page);
  });

  test.describe('une fois connecté', () => {
    test.beforeEach(async ({ page }) => {
      await login(page);
    });

    test('liste des entreprises', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible();

      await expectNoAccessibilityViolations(page);
    });

    test('formulaire d\'ajout avec des erreurs affichées', async ({ page }) => {
      await page.getByRole('button', { name: 'Ajouter une entreprise' }).click();
      await page.getByLabel('Nom').focus();
      await page.getByLabel('Secteur').focus();
      await expect(page.getByText('Le nom est obligatoire.')).toBeVisible();

      await expectNoAccessibilityViolations(page);
    });

    test('formulaire d\'édition', async ({ page }) => {
      await page.getByRole('row').nth(1).getByRole('button', { name: 'Éditer' }).click();
      await expect(page.getByLabel('Nom')).not.toHaveValue('');

      await expectNoAccessibilityViolations(page);
    });

    test('boîte de confirmation de suppression ouverte', async ({ page }) => {
      await page.getByRole('row').nth(1).getByRole('button', { name: 'Supprimer' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();

      await expectNoAccessibilityViolations(page);
    });
  });
});
