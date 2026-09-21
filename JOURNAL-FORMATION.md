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

---

## Questions ouvertes / à approfondir

-

## Ressources citées

- esbuild Bundle Analyzer — https://esbuild.github.io/analyze/
- source-map-explorer — https://www.npmjs.com/package/source-map-explorer
