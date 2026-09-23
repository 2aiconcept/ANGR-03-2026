import type { Plugin } from 'vite';

/**
 * Windows uniquement : VS Code (extension Nx Console) fournit à Nx la racine du workspace
 * avec la lettre du disque en minuscule (`c:\...`), alors que TypeScript utilise `C:\...`.
 * Les chemins des composants importés depuis une autre lib ne correspondent plus, le plugin
 * Angular ne les compile pas, et les tests échouent avec « Component 'X' is not resolved ».
 * Ce plugin remet la lettre du disque en majuscule sur chaque chemin résolu.
 */
export function fixDriveLetter(): Plugin {
  return {
    name: 'fix-drive-letter',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      if (resolved && /^[a-z]:/.test(resolved.id)) {
        return { ...resolved, id: resolved.id.charAt(0).toUpperCase() + resolved.id.slice(1) };
      }
      return resolved;
    },
  };
}
