import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

// Les tests e2e ont leur propre serveur sur le port 4300, séparé du « npm start » (4200) :
// ils testent toujours le code et la config à jour, même si un vieux serveur tourne encore.
const E2E_PORT = 4300;

// Adresse de l'application testée (modifiable avec la variable BASE_URL, par exemple en CI).
const baseURL = process.env['BASE_URL'] || `http://localhost:${E2E_PORT}`;

/**
 * Configuration Playwright : https://playwright.dev/docs/test-configuration
 * Les tests utilisent la vraie API (compte de démo) : il faut donc une connexion internet.
 */
export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: './src' }),
  // L'API est hébergée sur Railway : on lui laisse un peu plus de temps que le défaut (5 s).
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    // Enregistre une trace (vidéo pas à pas) quand un test échoue puis est relancé.
    trace: 'on-first-retry',
  },
  // Lance l'application sur le port 4300 avant les tests.
  // On passe par « npm start » plutôt que « npx nx run mini-crm:serve » : sinon Nx transforme
  // la commande en tâche Nx, qu'il relance à chaque fois en plus de Playwright.
  webServer: {
    command: `npm start -- --port=${E2E_PORT}`,
    url: `http://localhost:${E2E_PORT}`,
    reuseExistingServer: true,
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
