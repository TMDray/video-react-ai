# Prompt 0 — Setup complet du projet

Ce prompt est à utiliser quand on installe le projet pour la première fois ou après un transfert. Il guide Claude pour tout configurer correctement, y compris les pièges connus.

---

Tu dois mettre en place le projet Remotion Editor Starter. C'est un éditeur vidéo visuel (Remotion + React Router + Tailwind v4) avec deux interfaces :
- **Éditeur visuel** (port 5173) — drag & drop pour monter des vidéos
- **Remotion Studio** (port 3002) — prévisualisation des compositions React codées

## Étape 1 — Installer les prérequis

Vérifie que ces outils sont installés :
```bash
node --version    # >= 20 requis
npm --version     # >= 9 requis
```

Optionnel mais recommandé :
```bash
brew install python@3.12 uv ffmpeg   # MCPs + rendu local
```

## Étape 2 — Installer les dépendances

```bash
npm install
cp .env.example .env    # Configurer les clés API ensuite
```

## Étape 3 — Appliquer les fixes critiques connus

### Fix 1 : Tailwind ne scanne pas src/editor/ (gitignored)

Dans `src/editor/editor-starter.css`, vérifie que `@source "../editor/"` est présent après `@import 'tailwindcss'` :

```css
@import 'tailwindcss';

@source "../editor/";
```

**Sans ce fix** : les icônes SVG de l'éditeur seront énormes (230px au lieu de 16px), l'interface sera inutilisable.

### Fix 2 : React dedupe dans Vite

Dans `vite.config.ts`, vérifie que `resolve.dedupe` est présent :

```ts
export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  // ...
});
```

**Sans ce fix** : erreur "null is not an object (evaluating 'resolveDispatcher().useRef')" — l'éditeur crash.

### Fix 3 : @remotion/captions PAS dans optimizeDeps.exclude

Dans `vite.config.ts`, vérifie que `@remotion/captions` n'est PAS dans la liste `optimizeDeps.exclude`. Ce package est CJS, pas ESM.

**Sans ce fix** : écran gris, erreur silencieuse "does not provide an export named 'createTikTokStyleCaptions'".

## Étape 4 — Lancer l'éditeur

```bash
npm run dev
```

Ouvre http://localhost:5173. Tu dois voir :
- Toolbar en haut (curseur, rectangle, texte, image, vidéo, audio)
- Canvas noir au centre avec "Drop videos and images here to get started"
- Inspector à droite (Canvas W/H, Duration, Export)
- Contrôles de lecture (play, skip, timeline)
- Timeline en bas

Si tu vois un **écran gris** : ouvre F12 → Console dans le navigateur et corrige l'erreur affichée. Réfère-toi aux 3 fixes ci-dessus.

## Étape 5 — Lancer Remotion Studio

```bash
npm run remotion:studio
```

Ouvre http://localhost:3002. Tu dois voir l'interface Remotion Studio avec les compositions listées dans la sidebar gauche :
- **Main** — composition principale de l'éditeur
- **TransitionsDemo** — démo fade/slide/wipe
- **SpringAnimationDemo** — démo animations spring

Clique sur une composition et appuie sur Play pour la prévisualiser.

**Note** : Remotion Studio est fourni par le package `@remotion/cli` (open source, gratuit). Il se lance simplement avec `remotion studio`. Rien d'autre à installer.

## Étape 6 — Configurer les MCPs (optionnel)

Les MCPs permettent à Claude de chercher des assets (images, vidéos, musique).

1. Vérifier que `uv` et Python 3.12 sont installés
2. Tester : `uv run --python 3.12 --with "mcp,httpx,python-dotenv" python3 -c "import mcp; print('OK')"`
3. Configurer les clés API dans `.env` :
   - `PEXELS_API_KEY` — images/vidéos stock (gratuit sur pexels.com)
   - `UNSPLASH_ACCESS_KEY` — images stock (gratuit sur unsplash.com)
   - `SUNO_API_KEY` — musique IA (payant)
   - `JAMENDO_API_KEY` — musique libre (gratuit sur jamendo.com)

4. Vérifier `.claude/settings.json` — les 3 MCPs (stocky, suno, jamendo) doivent pointer vers les bons chemins absolus avec `uv run --python 3.12`

## Étape 7 — Vérification finale

```bash
npm run typecheck        # Doit passer sans erreur
npm audit                # Doit afficher 0 vulnérabilités
```

Ouvre les deux interfaces :
- http://localhost:5173 → éditeur visuel fonctionnel
- http://localhost:3002 → Remotion Studio fonctionnel

## Résumé des pièges connus

| Symptôme | Cause | Fix |
|----------|-------|-----|
| Écran gris | `@remotion/captions` dans Vite exclude | Retirer de `optimizeDeps.exclude` |
| Icônes géantes, layout cassé | Tailwind ignore `src/editor/` | `@source "../editor/"` dans CSS |
| Crash `useRef` / `resolveDispatcher` | Double instance React | `resolve.dedupe` dans vite.config.ts |
| 500 SSR "version mismatch" | react ≠ react-dom version | `rm -rf node_modules/.vite` + restart |
| Page blanche après modif vite.config | Cache types React Router | `rm -rf .react-router/types` + restart |

## Structure — ce qu'on peut modifier vs ce qu'on ne touche pas

```
NE PAS MODIFIER                    PERSONNALISABLE
──────────────────                 ──────────────────
src/editor/  (code licencié)       src/remotion/examples/  (tes compositions)
                                   src/routes/api/         (tes API routes)
                                   vite.config.ts          (ta config Vite)
                                   .claude/settings.json   (tes MCPs)
                                   .mcp/                   (tes serveurs MCP)
                                   prompts/                (tes prompts Claude)
                                   .env                    (tes clés API)
                                   CLAUDE.md, WORKFLOW.md, SETUP.md
```

Le seul fichier de `src/editor/` qu'on customise est `flags.ts` (97 feature flags) — mais il est gitignored donc les changements restent locaux.
