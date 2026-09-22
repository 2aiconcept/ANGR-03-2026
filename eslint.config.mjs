import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/vitest.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // Le domaine companies ne dépend que de lui-même et du code partagé.
            {
              sourceTag: 'scope:companies',
              onlyDependOnLibsWithTags: ['scope:companies', 'scope:shared'],
            },
            {
              sourceTag: 'scope:connect',
              onlyDependOnLibsWithTags: ['scope:connect', 'scope:shared'],
            },
            {
              sourceTag: 'scope:contact',
              onlyDependOnLibsWithTags: ['scope:contact', 'scope:shared'],
            },
            {
              sourceTag: 'scope:orders',
              onlyDependOnLibsWithTags: ['scope:orders', 'scope:shared'],
            },
            {
              sourceTag: 'scope:not-found',
              onlyDependOnLibsWithTags: ['scope:contact', 'scope:shared'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            // Une feature peut tout utiliser : ui, data-access, util et une autre feature.
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:data-access',
                'type:util',
              ],
            },
            {
              sourceTag: 'scope:mini-crm',
              onlyDependOnLibsWithTags: ['*'],
            },
            // Une lib ui ne dépend que d'une autre lib ui ou util (pas de data-access :
            // un composant de présentation ne fait pas d'appel HTTP).
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:util'],
            },
            // Une lib data-access ne dépend que d'une autre lib data-access ou util
            // (pas de feature ni de ui : le sens de dépendance va dans l'autre sens).
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:util'],
            },
            // Une lib util ne dépend de rien d'autre : ce sont des modèles/constantes
            // sans logique, au bas de la pyramide de dépendances.
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            // L'application est la racine de composition : aucune restriction de type.
            { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['*'] },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
