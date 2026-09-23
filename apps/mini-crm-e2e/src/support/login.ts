import { expect, Page } from '@playwright/test';

/** Compte de démo fourni par l'API (voir GET / sur l'API). */
export const DEMO_USER = {
  email: 'user@test.com',
  password: 'password123',
  fullName: 'Angular Stagiaire',
};

/** Se connecte avec le compte de démo et attend l'arrivée sur la liste des entreprises. */
export async function login(page: Page): Promise<void> {
  await page.goto('/connect');
  await page.getByLabel('Adresse e-mail').fill(DEMO_USER.email);
  await page.getByLabel('Mot de passe').fill(DEMO_USER.password);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL('/companies');
}
