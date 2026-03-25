# Prompt 3 — Vérification de configuration

Copie-colle ce prompt pour vérifier que tout est bien configuré.

---

Vérifie la configuration complète de ce projet Remotion Editor Starter. Pour chaque point, indique ✅ ou ❌ et comment corriger si nécessaire.

## 1. Prérequis système

```bash
node --version          # Requis: >= 20
npm --version           # Requis: >= 9
python3 --version       # Requis: >= 3.10 (pour les MCPs)
uv --version            # Requis: installé (pour les MCPs)
ffmpeg -version         # Recommandé: pour le rendu local
```

## 2. Dépendances

```bash
npm ls --depth=0        # Toutes les deps installées ?
npm audit               # 0 vulnérabilités ?
npm run typecheck       # 0 erreurs TypeScript ?
npm run lint            # 0 erreurs ESLint ? (ignorer src/editor/)
```

## 3. Variables d'environnement

Vérifie `.env` (copier depuis `.env.example` si absent) :

| Variable | Requis pour | Comment vérifier |
| -------- | ----------- | ---------------- |
| `MISTRAL_API_KEY` | Sous-titres auto (Voxtral) | `curl https://api.mistral.ai/v1/models -H "Authorization: Bearer $KEY"` |
| `PEXELS_API_KEY` | MCP Stocky (images/vidéos) | `curl -H "Authorization: KEY" https://api.pexels.com/v1/curated` |
| `UNSPLASH_ACCESS_KEY` | MCP Stocky (images) | `curl "https://api.unsplash.com/photos?client_id=KEY"` |
| `SUNO_API_KEY` | MCP Suno (musique IA) | Tester via le MCP |
| `JAMENDO_API_KEY` | MCP Jamendo (musique libre) | `curl "https://api.jamendo.com/v3.0/tracks/?client_id=KEY"` |
| `KREA_API_KEY` | MCP Krea (Kling + Hailuo 2.3) | Tester via le MCP |
| `ELEVENLABS_API_KEY` | MCP ElevenLabs (TTS + voix) | Tester via le MCP |

Sans `MISTRAL_API_KEY` : les sous-titres automatiques sont désactivés. Le rendu local fonctionne sans aucune clé.

## 4. Serveurs

```bash
npm run dev              # Éditeur → localhost:5173 → doit afficher l'interface
npm run remotion:studio  # Studio → localhost:3002 → doit afficher les compositions
```

## 5. MCPs (dans .claude/settings.json)

Vérifie que chaque MCP démarre :
```bash
# MCPs Python (stocky, suno, jamendo)
uv run --python 3.12 --with "mcp,httpx,python-dotenv" python3 -c "import mcp; print('OK')"

# MCP Krea (npx)
npx -y krea-mcp --version

# MCP ElevenLabs (uvx)
uvx elevenlabs-mcp --help
```

| MCP | Type | Requis pour |
| --- | ---- | ----------- |
| stocky | uv/Python | Images et vidéos stock |
| suno | uv/Python | Musique IA |
| jamendo | uv/Python | Musique libre |
| krea | npx | Vidéo IA (Kling, Hailuo 2.3) |
| elevenlabs | uvx | TTS, voice cloning |

## 6. Vite config

Dans `vite.config.ts` :
- `resolve.dedupe` contient `['react', 'react-dom']` ?
- `@remotion/captions` n'est PAS dans `optimizeDeps.exclude` ?
- Les packages Remotion Node.js sont dans `ssr.external` ?

## 7. Tailwind

Dans `src/editor/editor-starter.css` :
- `@source "../editor/"` est présent ? (nécessaire car src/editor/ est gitignored)

## 8. Git

```bash
git status               # Pas de changements non voulus ?
git log --oneline -5     # Historique propre ?
```

Produis un rapport avec le statut de chaque point.
