# Remotion Editor Starter

Visual video editor built on Remotion + React Router + Tailwind v4.

## Quick Reference

```bash
npm run dev              # Editor on localhost:5173 (main experience)
npm run remotion:studio  # Remotion Studio (preview compositions without editor UI)
npm run build            # Typecheck + build prod
npm run typecheck        # react-router typegen + tsc
npm run lint             # ESLint + Prettier
```

## Environment Setup

```bash
cp .env.example .env
```

| Variable | Requis pour | Default |
| --- | --- | --- |
| `MISTRAL_API_KEY` | Auto-captioning (Voxtral) | — |
| `PEXELS_API_KEY` | MCP Stocky (images/videos stock) | — |
| `UNSPLASH_ACCESS_KEY` | MCP Stocky (images) | — |
| `SUNO_API_KEY` | MCP Suno (musique IA) | — |
| `JAMENDO_API_KEY` | MCP Jamendo (musique libre) | — |
| `KREA_API_KEY` | MCP Krea (Kling + Hailuo 2.3 vidéo IA) | — |
| `ELEVENLABS_API_KEY` | MCP ElevenLabs (TTS + voice cloning) | — |
| `ELEVENLABS_MCP_BASE_PATH` | MCP ElevenLabs — dossier sortie audio | `~/Desktop` |

Toutes les clés sont optionnelles. L'éditeur fonctionne sans aucune clé.

## Architecture

```
src/
  editor/             → Visual editor (canvas, timeline, inspector)
    flags.ts          → 97 feature flags (all toggleable)
    state/            → Redux-like state: 43 actions, 25 contexts
    items/            → 7 item types: image, video, text, solid, audio, gif, captions
    canvas/           → Interactive canvas with drag, resize, crop, snapping
    timeline/         → Multi-track timeline with trim, split, rolling edits
    inspector/        → Context-sensitive property panel
    rendering/        → Render trigger + progress tracking
  remotion/           → Compositions (Root.tsx, main.tsx)
    constants.ts      → Comp name, local render output dir
  routes/             → React Router API endpoints
    api/render.ts     → Render video (local via Remotion CLI)
    api/progress.ts   → Poll render progress
    api/upload.ts     → Local file uploads
    api/upload-file.ts → Local file upload receiver
    api/captions.ts   → Mistral Voxtral transcription
    api/download.ts   → Serve locally rendered files
    api/font.ts       → Google Fonts proxy
```

## State Management

- 25 React Contexts for granular re-renders
- Single `setState()` via `useWriteContext()` with `commitToUndoStack` flag
- Undo/redo: 50 snapshots of `UndoableState` via `useSyncExternalStore`
- Persistence: localStorage (`remotion-editor-starter-state-v3`) + IndexedDB for assets + JSON export/import + URL hash sharing

## Rendering

Rendu local via Remotion CLI (`npx remotion render`), output dans `out/`.

Flow: Export button → POST `/api/render` → `renderId` → poll `/api/progress` → download

## Feature Flags

All in `src/editor/flags.ts`. Set any to `false` to disable.
Docs: <https://www.remotion.dev/docs/editor-starter/features>

## Adding a New Item Type

TypeScript guides the process — the union type forces exhaustive matching:

1. Define type in `src/editor/items/<type>/<type>-item-type.ts`
2. Add to union in `src/editor/items/item-type.ts`
3. Create factory in `src/editor/items/<type>/make-<type>-item.ts`
4. Create layer (canvas render) in `src/editor/items/<type>/<type>-layer.tsx`
5. Create inspector in `src/editor/inspector/<type>-inspector.tsx`
6. Add dispatch in `src/editor/items/inner-layer.tsx`
7. Add dispatch in `src/editor/inspector/inspector-content.tsx`
8. Add asset type if needed in `src/editor/assets/assets.ts`
9. Add UI entry point (tool or drop handler)

## Conventions

- Tailwind v4 (CSS-first, no config file)
- ESLint: `no-console`, `no-shadow`, `exhaustive-deps` as errors
- Prettier: tabs, single quotes, organize imports
- TypeScript strict mode with `noUnusedLocals`

## Motion Design Packages

Installed alongside the editor for creating compositions:

| Package | Usage |
| --- | --- |
| `@remotion/transitions` | Scene transitions: fade, slide, wipe, flip, iris, clock-wipe |
| `@remotion/animation-utils` | CSS transform helpers, style interpolation |
| `@remotion/paths` | SVG path animation, morphing, progressive drawing |
| `@remotion/motion-blur` | Cinematic motion blur (`<Trail>`, `<CameraMotionBlur>`) |
| `@remotion/noise` | Perlin noise for generative effects, organic movement |
| `@remotion/lottie` | Lottie vector animations (lottiefiles.com) — needs `lottie-web` |
| `@remotion/preload` | Asset preloading for smooth playback |
| `@remotion/media-utils` | Audio waveform visualization, video metadata |

## MCP Servers

Five MCP servers configured in `.claude/settings.json` for Claude-assisted asset sourcing and generation:

| MCP | Source | Clé API | Usage |
| --- | ------ | ------- | ----- |
| **Stocky** (`.mcp/stocky/`) | Pexels + Unsplash | `PEXELS_API_KEY`, `UNSPLASH_ACCESS_KEY` | Images et vidéos stock |
| **Suno** (`.mcp/suno/`) | suno.ai | `SUNO_API_KEY` | Génération de musique IA |
| **Jamendo** (`.mcp/jamendo/`) | jamendo.com | `JAMENDO_API_KEY` | Musique libre de droits |
| **Krea** (`npx krea-mcp`) | fal.ai / krea.ai | `KREA_API_KEY` | Vidéo IA : Kling (illustration→animation), Hailuo 2.3 (personnages, logos) |
| **ElevenLabs** (`uvx elevenlabs-mcp`) | elevenlabs.io | `ELEVENLABS_API_KEY` | TTS, voice cloning, conversion vocale |

Configure API keys in `.env` and MCP config in `.claude/settings.json`.

## Rules

- Do NOT modify `src/editor/` (licensed Remotion code, gitignored)
- Feature flags in `flags.ts` are the intended customization mechanism
- All API routes are server-side only (React Router SSR)
- State persisted to localStorage key `remotion-editor-starter-state-v3`
- Assets cached in IndexedDB for offline use
