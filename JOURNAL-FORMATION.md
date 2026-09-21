# Journal de formation — Nx & Angular avancé

> **Instructions pour Claude (à lire en fin de formation)**
> Ce fichier est le journal de bord d'une formation « Nx & Angular avancé ».
> Il a été tenu au fil de l'eau pendant la formation. À partir de ce journal, rédige un
> **support de cours complet à remettre aux stagiaires** :
> - structuré en chapitres dans l'ordre pédagogique des séances ci-dessous ;
> - chaque chapitre contient : objectifs, notions théoriques expliquées, exemples de code
>   commentés (tirés du projet fil rouge), commandes, bonnes pratiques, pièges à éviter,
>   et un exercice ou récapitulatif ;
> - rédigé en français, ton pédagogique, pour des développeurs Angular ayant déjà les bases ;
> - reprends les conventions du projet (voir section « Conventions du projet ») ;
> - termine par un glossaire, un aide-mémoire des commandes et une liste de ressources.

---

## Contexte

- **Formateur** : 2aiconcept (contact@2aiconcept.com)
- **Projet fil rouge** : `mini-crm` — application de gestion de relation client
  (sociétés, contacts, commandes, authentification).
- **Démarrage du journal** : 2026-09-21

### Stack technique au démarrage du journal

| Élément | Version / choix |
|---|---|
| Angular | 21.2 (standalone, signals, control flow natif) |
| Builder | `@angular/build` (esbuild, builder `application`) |
| TypeScript | 5.9 (strict) |
| Tests | Vitest 4 + jsdom |
| UI | Bootstrap 5.3 |
| Documentation | Compodoc (`npm run compodoc`) |
| Formatage | Prettier |
| Nx | pas encore installé à ce stade |

### État du projet au démarrage du journal

Déjà réalisé avant l'ouverture de ce journal (historique git) :
1. Architecture du projet et routes, génération de la doc Compodoc
2. Header, Nav, layout `app.html`
3. Formulaire de connexion (HTML puis version signals) — feature `connect`
4. Liste des sociétés, composant table réutilisable, dialogue de confirmation
5. Page liste des sociétés, formulaire d'ajout de société

Structure `src/app` :
```
feature-companies/   feature-connect/   feature-contacts/
feature-not-found/   feature-orders/    shared/
```
Organisation : un dossier par feature (`pages/`, `components/`), routes lazy-loadées,
code partagé dans `shared/`.

### Conventions du projet (règles imposées, cf. `.claude/CLAUDE.md`)

- Composants standalone (sans `standalone: true` explicite), `ChangeDetectionStrategy.OnPush`
- `input()` / `output()` / `computed()` / signals ; pas de `mutate`
- Control flow natif `@if` / `@for` (avec `track`) / `@switch`, `@defer` pour le contenu lourd
- `inject()` plutôt que l'injection par constructeur ; services `providedIn: 'root'`
- `host: {}` au lieu de `@HostBinding` / `@HostListener` ; bindings `class`/`style` au lieu de `ngClass`/`ngStyle`
- Formulaires réactifs ; `NgOptimizedImage` pour les images statiques
- Accessibilité : WCAG 2.2 AA, AXE, labels, `aria-describedby`, `aria-invalid`, focus au changement de route, `cdkTrapFocus` dans les modales, `aria-live` / `LiveAnnouncer`
- Performance / éco-conception : budgets `angular.json`, `takeUntilDestroyed()`, `debounceTime`, virtual scroll, pagination
- Clean code : noms explicites, pas de magic numbers, pas de code mort ni de `console.log`

---

## Séances

<!-- Format de chaque entrée :
### [date] — Titre du thème
**Objectif** : ...
**Notions abordées** : ...
**Réalisation dans le projet** : fichiers créés / modifiés, extraits de code clés
**Commandes** : ...
**Points d'attention / pièges** : ...
**Questions des stagiaires & réponses** : ...
-->

### 2026-09-21 — Analyse de la taille des bundles (chunk initial)

**Objectif** : savoir mesurer ce qui est chargé au démarrage de l'application pour
optimiser le temps de chargement initial.

**Notions abordées** :
- Distinction **initial chunks** (chargés au démarrage) / **lazy chunks** (routes lazy-loadées, `@defer`).
- Taille brute vs taille transférée (compression gzip / brotli).
- Mesurer toujours sur un **build de production**, jamais avec `ng serve`.

**Outils et commandes** :
1. Sortie de `ng build` : tableau « Initial chunk files » / « Lazy chunk files » et « Initial total ».
2. **esbuild Bundle Analyzer** (recommandé avec le builder `application`) :
   ```bash
   ng build --stats-json
   ```
   puis charger `dist/mini-crm/stats.json` sur https://esbuild.github.io/analyze/ (treemap / sunburst).
3. **source-map-explorer** :
   ```bash
   npm i -D source-map-explorer
   ng build --source-map
   npx source-map-explorer dist/mini-crm/browser/*.js
   ```
4. **Chrome DevTools** :
   - Network (filtre JS, rechargement) : chunks réellement téléchargés au démarrage ;
   - Coverage (Ctrl+Shift+P → « Show Coverage ») : code chargé mais non exécuté ;
   - Lighthouse : score de performance, JS inutilisé.
5. **Budgets** dans `angular.json` (`type: "initial"`, `maximumWarning`, `maximumError`)
   pour faire échouer le build si le chunk initial grossit trop.

**Points d'attention** :
- Un import statique d'une feature dans `app.routes.ts` ou `app.ts` la fait basculer dans le chunk initial : utiliser `loadComponent` / `loadChildren`.
- Les grosses dépendances importées globalement (ex. dans `styles` ou `app.config.ts`) pèsent sur le démarrage.

### 2026-09-21 — Migration vers Nx : feuille de route

**Objectif** : faire passer le projet Angular CLI `mini-crm` sur Nx, puis vers un monorepo découpé en librairies.

**Étapes prévues** :
- **Phase 1 — Préparer** : committer le travail en cours (arbre git propre), créer une branche
  `migration-nx`, vérifier la compatibilité Nx ↔ Angular ↔ Node (matrice sur nx.dev),
  installer l'extension VS Code **Nx Console**.
- **Phase 2 — Migrer le projet CLI** : `npx nx@latest init` (installe `nx`, `@nx/angular`,
  `@nx/workspace`, crée `nx.json`, convertit `angular.json` en `project.json`, ajoute `.nx/cache`
  au `.gitignore`, propose Nx Cloud). Vérifier ensuite `nx serve`, `nx build` (budgets, chunk
  initial), `nx test` (executor Vitest), adapter le script Compodoc, puis lancer `nx graph`.
- **Phase 3 — Monorepo** : app dans `apps/mini-crm` (ou nouveau workspace
  `create-nx-workspace --preset=angular-monorepo`) ; découpage en libs `feature-*`, `ui`,
  `data-access`, `util` ; `nx g @nx/angular:library`, `@nx/workspace:move` ; alias
  `@mini-crm/...` dans `tsconfig.base.json` ; le lazy loading pointe vers les libs.
- **Phase 4 — Gouvernance** : ESLint (`nx add @nx/eslint` + angular-eslint, absent du projet
  au départ), tags dans `project.json` + règle `@nx/enforce-module-boundaries`,
  `nx run-many` / `nx affected`, cache, CI.

### 2026-09-21 — Incident : `nx init` échoue avec `npm ERESOLVE`

**Symptôme** : `npx nx@latest init` (Nx 23.2.1) ajoute `nx`, `@nx/angular` et `@nx/workspace`
dans `package.json`, puis l'installation npm échoue :
```
npm error ERESOLVE could not resolve
Found: @angular/compiler@21.2.15
Conflicting peer dependency: @angular/compiler@21.2.23
  peer @angular/compiler@"21.2.23" from @angular/compiler-cli@21.2.23
  ... peerOptional @angular-devkit/build-angular@">= 20.0.0 < 23.0.0" from @nx/angular@23.2.1
```

**Analyse (à expliquer aux stagiaires, c'est un grand classique)** :
- Le `package-lock.json` fige les paquets Angular en **21.2.15**.
- `@nx/angular` déclare `@angular-devkit/build-angular` en peer optionnelle. npm 7+ installe
  les peers automatiquement et prend donc la dernière version (21.2.24), qui demande
  `@angular/compiler-cli` en 21.x. npm résout alors vers la dernière, **21.2.23**.
- Or `@angular/compiler-cli` exige **exactement la même version** de `@angular/compiler`
  (peer figée `21.2.23`), alors que la version installée est 21.2.15, d'où le conflit.
- Leçon : les paquets `@angular/*` sont publiés **en version alignée** (lockstep). Un
  workspace dont les versions sont en retard entre en conflit dès qu'un outil tiers tire une
  version plus récente.

**Compatibilité Nx ↔ Angular** (peerDependencies de `@nx/angular` vérifiées sur npm) :

| `@nx/angular` | Angular supporté |
|---|---|
| 22.2.x | 18 → 20 |
| 22.3 → 23.0 | 19 → 21 |
| 23.2.1 | 20 → 22 |

Nx 23.2.1 est donc compatible Angular 21 : le conflit ne vient pas de Nx lui-même mais de la
peer optionnelle `@angular-devkit/build-angular`. npm prend sa dernière version (21.2.24), qui
dépend de `@angular/build` **21.2.24** en version exacte, alors que le projet a
`@angular/build` 21.2.13.

**Correctif retenu : rester sur les versions actuelles** en installant d'abord
`build-angular` à la même version que `@angular/build` :
```bash
git checkout package.json                              # annule l'ajout partiel de nx init
npm install -D @angular-devkit/build-angular@21.2.13   # même version que @angular/build
npx nx@latest init                                     # ou npx nx@23.2.1 init pour figer
```
`build-angular@21.2.13` dépend de `@angular/build@21.2.13` et accepte
`@angular/compiler-cli ^21.0.0`, donc plus de conflit.

**Créer un workspace Nx neuf en Angular 21** : utiliser une version de Nx dont la plage
Angular s'arrête à 21, par exemple `npx create-nx-workspace@23.0.2 mini-crm-nx --preset=angular-monorepo`
(`create-nx-workspace@latest` pourrait générer une version d'Angular plus récente).

**Correctif alternatif** (ne **pas** utiliser `--force` ou `--legacy-peer-deps`, qui masquent le
problème et peuvent casser le build) :
1. Annuler la modification partielle de `nx init` : `git checkout package.json`
2. Aligner Angular sur la dernière version corrective 21.2.x :
   `npx ng update @angular/core@21 @angular/cli@21` (ou `npm update`)
3. Vérifier que `ng build` et `ng test` passent, puis committer.
4. Relancer `npx nx@latest init`.

### 2026-09-21 — Scripts npm après la migration vers Nx

**Objectif** : adapter les scripts de `package.json` maintenant que `angular.json` est remplacé
par `nx.json` + `project.json`.

**Scripts ajoutés / modifiés** :
```json
"ng": "nx",
"start": "nx serve",
"start:prod": "nx serve --configuration production",
"build": "nx build",
"build:dev": "nx build --configuration development",
"watch": "nx build --watch --configuration development",
"test": "nx test",
"test:watch": "nx test --watch",
"format": "prettier --write \"src/**/*.{ts,html,css,json}\"",
"format:check": "prettier --check \"src/**/*.{ts,html,css,json}\"",
"graph": "nx graph",
"reset": "nx reset",
"compodoc": "compodoc -p tsconfig.doc.json"
```

**Notions** :
- Sans `angular.json`, la commande `ng` ne trouve plus le projet → le script `ng` pointe vers `nx`
  (`npm run ng -- build` passe par Nx).
- Les options `--configuration` correspondent aux `configurations` des cibles de `project.json`.
- `nx graph` affiche le graphe des projets et des dépendances du workspace.
- `nx reset` vide le cache local de Nx (`cache: true` sur `build` et `test` dans `nx.json`) : utile
  quand un résultat mis en cache semble périmé.
- Dans un script npm, `npx` est inutile : les binaires de `node_modules/.bin` sont déjà dans le PATH.
- `format:check` sert en CI (échoue si un fichier n'est pas formaté) ; `format` corrige.

**Vérifications** :
- `npm run build:dev` → build OK (≈ 30 s, cache 0/1 au premier lancement).
- `npm run format:check` → 21 fichiers non conformes à Prettier (pas encore corrigés).

**À faire ensuite** :
- Ajouter une cible `lint` (ESLint via `npx nx add @nx/eslint` ou `ng add angular-eslint`),
  puis le script `"lint": "nx lint"`.
- Lancer `npm run format` une fois, dans un commit dédié, pour aligner le code sur Prettier.

### 2026-09-21 — Passer du layout « standalone » au layout monorepo (`apps/`)

**Question** : la doc Nx indique que la migration « installe `nx`, `@nx/angular`, `@nx/workspace`
et déplace les applications dans `apps/` ». Comment faire ?

**Notions** :
- Ce texte décrit `npx nx init --integrated`. Cette option ne fonctionne que sur un workspace
  **Angular CLI** (avec `angular.json`). Ici, `nx init` a déjà été lancé sans l'option : le projet
  est un workspace Nx **standalone** (`project.json` à la racine, `sourceRoot: "src"`), et les trois
  paquets sont déjà installés.
- Pour déplacer ensuite l'application dans `apps/`, on utilise le générateur
  `@nx/workspace:convert-to-monorepo` : il déplace le projet dans `apps/mini-crm/` et met à jour
  les chemins (`project.json`, `tsconfig*`, `outputPath`…).

**Commandes** :
```bash
git add -A && git commit -m "chore: migrate to nx (standalone)"   # point de retour propre
npx nx g @nx/workspace:convert-to-monorepo --dry-run              # prévisualiser
npx nx g @nx/workspace:convert-to-monorepo                        # appliquer
npx nx show projects                                              # vérifier
npm run build && npm test
```

**Pièges** :
- Toujours committer avant un générateur qui déplace des fichiers, pour pouvoir annuler (`git reset --hard`).
- Après le déplacement, vérifier les chemins non gérés par Nx : script `compodoc`
  (`tsconfig.doc.json`), `public/`, styles Bootstrap. Dès qu'il y a plusieurs projets, préférer
  `nx serve mini-crm` / `nx build mini-crm` dans les scripts npm.
- Résultat du `--dry-run` sur `mini-crm` : `project.json`, `src/`, `public/`, `tsconfig.app/spec/doc.json`
  passent dans `apps/mini-crm/` ; `tsconfig.json` racine devient `tsconfig.base.json` (qui recevra les
  alias des libs) ; `package.json` mis à jour. Le script `compodoc` doit ensuite pointer vers
  `apps/mini-crm/tsconfig.doc.json`.

### 2026-09-21 — `nx import` : intégrer `mini-crm` dans le monorepo `mini-crm-nx`

**Objectif** : importer le dépôt `mini-crm` (Angular 21, Nx standalone) dans le monorepo
`mini-crm-nx` (Angular 22, `apps/shop`, `apps/api`, libs dans `packages/`), **avec son historique git**.

**Notions** :
- `nx import <source> <destination>` clone le dépôt source (URL ou chemin local), réécrit son
  historique git pour le placer dans le dossier de destination, puis le fusionne (commit
  `feat(repo): merge main from …`). `git log apps/mini-crm` montre les anciens commits.
- Seul le **contenu commité** de la branche `--ref` est importé : il faut committer la source avant.
- `nx import` **ne recopie pas** les dépendances racine et **ne corrige pas** les chemins :
  c'est à faire à la main (Nx l'indique par les avertissements `missing_root_deps` et
  `config_path_mismatch`).

**Commande** (lancée depuis `mini-crm-nx`, dépôt propre) :
```bash
npx nx import ../mini-crm apps/mini-crm --ref=main --interactive=false --plugins=skip
```

**Corrections après l'import** :
1. Supprimer les fichiers de workspace en double : `apps/mini-crm/nx.json`, `package.json`,
   `package-lock.json` (un seul `nx.json`/`package.json` à la racine du monorepo).
2. Dépendances : `npm install bootstrap@^5.3.8` à la racine (seule dépendance absente ; Angular,
   RxJS, Vitest sont déjà fournis par le monorepo en version 22).
3. `apps/mini-crm/project.json` : chemins relatifs à la **racine du workspace**
   (`apps/mini-crm/src/main.ts`, `apps/mini-crm/tsconfig.app.json`, `apps/mini-crm/public`,
   `fileReplacements`…), `sourceRoot: "apps/mini-crm/src"`, `outputPath: "dist/apps/mini-crm"`,
   `$schema: "../../node_modules/…"`, `tags: ["scope:mini-crm"]` (pour les règles
   `@nx/enforce-module-boundaries`), `tsConfig` explicite pour la cible `test`.
4. `apps/mini-crm/tsconfig.json` : `"extends": "../../tsconfig.base.json"` pour hériter des alias
   `@org/*` des libs partagées ; `outDir` → `../../dist/out-tsc`.

**Vérifications** :
- `npx nx show projects` → `mini-crm` apparaît à côté de `shop`, `api` et des libs.
- `npx nx build mini-crm` → OK sous **Angular 22** (le code Angular 21 compile sans migration) ;
  avertissement de budget initial (559 kB > 500 kB), déjà identifié dans la séance « bundles ».
- `npx nx test mini-crm` → échec **déjà présent dans le dépôt d'origine** : 4 specs importent
  `{ PageListCompanies }` (export nommé) alors que les pages sont en `export default` (pour
  `loadComponent`). Correction : `import PageListCompanies from './page-list-companies';`.

**Correction des tests** (commit `chore(mini-crm): wire imported app into the monorepo`) :
- 4 specs de pages en `export default` → import par défaut. Attention : les autres pages
  (contacts, orders, connect) sont en export nommé, ne modifier que celles qui échouent.
- 3 specs générées n'avaient jamais été mises à jour après l'évolution des composants :
  ```ts
  // input.required() → fournir une valeur avant le premier rendu
  fixture.componentRef.setInput('companies', []);   // TableCompany
  fixture.componentRef.setInput('open', false);     // ConfirmDialog
  // composant qui utilise routerLink → fournir le routeur
  providers: [provideRouter([])],                   // Nav
  ```
  Erreurs associées : `NG0950` (input requis sans valeur) et `NG0201` (`ActivatedRoute` sans provider).
- Résultat : `npx nx test mini-crm` → 22/22 ; `npx nx build mini-crm` → OK.
- Ces correctifs sont dans `mini-crm-nx` uniquement ; le dépôt d'origine `mini-crm` garde les specs cassées.

**Pièges** :
- Lancer `nx import` sur un dépôt destination **propre** (sinon refus).
- Mélange de versions : la source était en Angular 21 / TS 5.9, le monorepo en Angular 22 / TS 6 ;
  ce sont les versions **racine** qui s'appliquent après l'import. Dans les autres cas, lancer
  `nx migrate` sur la source avant l'import.
- Le script `compodoc` et la cible `lint` n'ont pas été repris ; à recréer côté monorepo
  (`apps/mini-crm/eslint.config.mjs` sur le modèle de `apps/shop`).

---

## Questions ouvertes / à approfondir

-

## Ressources citées

- esbuild Bundle Analyzer — https://esbuild.github.io/analyze/
- source-map-explorer — https://www.npmjs.com/package/source-map-explorer
