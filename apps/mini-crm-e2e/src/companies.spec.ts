import { expect, test } from '@playwright/test';
import { login } from './support/login';

test.describe('Entreprises', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('affiche la liste des entreprises', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Entreprises' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Téléphone' })).toBeVisible();
  });

  test('le formulaire d\'ajout signale chaque champ obligatoire', async ({ page }) => {
    await page.getByRole('button', { name: 'Ajouter une entreprise' }).click();
    await expect(page).toHaveURL('/companies/add');
    await expect(page.getByRole('button', { name: 'Ajouter', exact: true })).toBeDisabled();

    // On passe dans chaque champ sans rien écrire.
    for (const label of ['Nom', 'Secteur', 'Adresse', 'Téléphone']) {
      await page.getByLabel(label).focus();
    }
    await page.getByLabel('Nom').focus();

    await expect(page.getByText('Le nom est obligatoire.')).toBeVisible();
    await expect(page.getByText('Le secteur est obligatoire.')).toBeVisible();
    await expect(page.getByText("L'adresse est obligatoire.")).toBeVisible();
    await expect(page.getByText('Le téléphone est obligatoire.')).toBeVisible();
    await expect(page.getByLabel('Nom')).toHaveAttribute('aria-invalid', 'true');
  });

  test('le bouton Ajouter s\'active quand tous les champs sont remplis', async ({ page }) => {
    await page.getByRole('button', { name: 'Ajouter une entreprise' }).click();

    await page.getByLabel('Nom').fill('Acme');
    await page.getByLabel('Secteur').fill('Tech');
    await page.getByLabel('Adresse').fill('Paris');
    await expect(page.getByRole('button', { name: 'Ajouter', exact: true })).toBeDisabled();

    await page.getByLabel('Téléphone').fill('0102030405');
    await expect(page.getByRole('button', { name: 'Ajouter', exact: true })).toBeEnabled();
  });

  test('crée, modifie puis supprime une entreprise', async ({ page }) => {
    // Un nom unique pour retrouver notre entreprise dans la liste, même si d'autres tests tournent.
    const name = `E2E ${Date.now()}`;

    // 1. Création
    await page.getByRole('button', { name: 'Ajouter une entreprise' }).click();
    await page.getByLabel('Nom').fill(name);
    await page.getByLabel('Secteur').fill('Tests');
    await page.getByLabel('Adresse').fill('1 rue de Playwright, Paris');
    await page.getByLabel('Téléphone').fill('0102030405');
    await page.getByRole('button', { name: 'Ajouter', exact: true }).click();

    await expect(page).toHaveURL('/companies');
    const row = page.getByRole('row', { name: name });
    await expect(row).toBeVisible();

    // 2. Modification : le formulaire est pré-rempli avec toutes les valeurs.
    await row.getByRole('button', { name: 'Éditer' }).click();
    await expect(page).toHaveURL(/\/companies\/edit\/\d+$/);
    await expect(page.getByRole('heading', { name: 'Modifier une entreprise' })).toBeVisible();
    await expect(page.getByLabel('Nom')).toHaveValue(name);
    await expect(page.getByLabel('Secteur')).toHaveValue('Tests');
    await expect(page.getByLabel('Adresse')).toHaveValue('1 rue de Playwright, Paris');
    await expect(page.getByLabel('Téléphone')).toHaveValue('0102030405');
    await page.getByLabel('Nom').fill(`${name} modifiée`);
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    await expect(page).toHaveURL('/companies');
    const updatedRow = page.getByRole('row', { name: `${name} modifiée` });
    await expect(updatedRow).toBeVisible();

    // 3. Suppression, avec confirmation
    await updatedRow.getByRole('button', { name: 'Supprimer' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText(`${name} modifiée`);
    await dialog.getByRole('button', { name: 'Supprimer' }).click();

    await expect(updatedRow).toHaveCount(0);
  });

  test('annuler la suppression garde l\'entreprise', async ({ page }) => {
    const firstRow = page.getByRole('row').nth(1);
    const firstName = await firstRow.getByRole('cell').first().innerText();

    await firstRow.getByRole('button', { name: 'Supprimer' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Annuler' }).click();

    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByRole('row', { name: firstName })).toBeVisible();
  });

  test('la touche Échap ferme la boîte de confirmation sans supprimer', async ({ page }) => {
    const firstRow = page.getByRole('row').nth(1);
    const firstName = await firstRow.getByRole('cell').first().innerText();

    await firstRow.getByRole('button', { name: 'Supprimer' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');

    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByRole('row', { name: firstName })).toBeVisible();
  });

  test('le focus passe dans la boîte de confirmation à son ouverture', async ({ page }) => {
    await page.getByRole('row').nth(1).getByRole('button', { name: 'Supprimer' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  });

  test('une entreprise inexistante affiche la page introuvable', async ({ page }) => {
    await page.goto('/companies/edit/999999');

    await expect(page).toHaveURL('/not-found');
    await expect(page.locator('app-page-not-found')).toBeVisible();
  });
});
