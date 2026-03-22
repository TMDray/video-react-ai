# Setup & Transfert du projet

## Transférer le projet à quelqu'un

### Option 1 — Git (recommandé)

```bash
# Toi : push vers un repo privé
git remote add origin git@github.com:ton-user/remotion-video-template.git
git push -u origin main

# Ton ami : clone
git clone git@github.com:ton-user/remotion-video-template.git
cd remotion-video-template
npm install
cp .env.example .env   # Configurer ses propres clés API
npm run dev             # Lancer l'éditeur
```

### Option 2 — ZIP

```bash
# Toi : créer le ZIP (exclut node_modules, .env, build)
git archive --format=zip HEAD -o remotion-editor.zip

# Ton ami :
unzip remotion-editor.zip -d remotion-video-template
cd remotion-video-template
npm install
cp .env.example .env
npm run dev
```

### Option 3 — ZIP complet (avec src/editor/ gitignored)

`git archive` exclut les fichiers gitignored. Pour inclure `src/editor/` :

```bash
# Créer un ZIP avec TOUT (sauf node_modules et .env)
zip -r remotion-editor-full.zip . \
  -x "node_modules/*" \
  -x ".env" \
  -x "out/*" \
  -x ".react-router/*" \
  -x "node_modules/.vite/*"
```

### Ce que ton ami doit installer

| Outil | Commande d'install | Requis |
|-------|-------------------|--------|
| Node.js >= 20 | `brew install node` | Oui |
| npm | Inclus avec Node | Oui |
| Python 3.12 | `brew install python@3.12` | Pour les MCPs |
| uv | `brew install uv` | Pour les MCPs |
| ffmpeg | `brew install ffmpeg` | Pour le rendu local |

### Checklist premier lancement

1. `npm install`
2. `cp .env.example .env` → configurer les clés API
3. `npm run dev` → ouvrir http://localhost:5173
4. Vérifier que l'éditeur s'affiche correctement
5. (Optionnel) `npm run remotion:studio` → http://localhost:3002

## Mettre à jour le template Remotion

### Séparation template / personnalisation

```
TEMPLATE (ne pas toucher)          PERSONNALISATION (tes fichiers)
─────────────────────────          ─────────────────────────────────
src/editor/        (gitignored)    src/remotion/examples/   ← tes compositions
                                   src/routes/api/          ← tes API routes
                                   src/editor/flags.ts      ← tes feature flags
                                   vite.config.ts           ← ta config Vite
                                   .claude/settings.json    ← tes MCPs
                                   .mcp/                    ← tes serveurs MCP
                                   CLAUDE.md                ← ta doc
                                   WORKFLOW.md              ← ta doc
                                   prompts/                 ← tes prompts
                                   .env                     ← tes clés API
```

### Comment mettre à jour

Le template Remotion se met à jour via la commande :

```bash
npm run upgrade    # Équivalent de `remotion upgrade`
```

Cela met à jour tous les packages `@remotion/*` et `remotion` vers la dernière version.

**Pour `src/editor/`** : Remotion fournit les mises à jour via leur système de licence. Remplacer le dossier `src/editor/` par la nouvelle version fournie.

### Après une mise à jour

```bash
# 1. Mettre à jour les packages Remotion
npm run upgrade

# 2. Si src/editor/ a été mis à jour, remplacer le dossier

# 3. Vérifier que rien ne casse
npm run typecheck
npm run dev

# 4. Vérifier les points critiques dans vite.config.ts :
#    - resolve.dedupe contient ['react', 'react-dom']
#    - @remotion/captions n'est PAS dans optimizeDeps.exclude
#    - @source "../editor/" est dans editor-starter.css

# 5. Tester l'éditeur dans le navigateur
```

### Risques lors d'une mise à jour

| Risque | Comment vérifier | Comment corriger |
|--------|-----------------|-----------------|
| React version mismatch | `npm ls react react-dom` | `resolve.dedupe` dans vite.config.ts |
| Nouveaux packages CJS | Écran gris / erreur d'export | Retirer de `optimizeDeps.exclude` |
| Tailwind ne scanne pas editor | Icônes géantes | `@source "../editor/"` dans CSS |
| Breaking changes React Router | 500 SSR | Vérifier la compatibilité sur remotion.dev |
