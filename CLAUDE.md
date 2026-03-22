# Remotion Editor Starter

Visual video editor built on Remotion + React Router + Tailwind v4.

## Quick Reference

```bash
npm run dev              # Editor on localhost:5173
npm run remotion:studio  # Remotion Studio (alternative preview)
npm run build            # Build + deploy Lambda (requires AWS)
npm run typecheck        # react-router typegen + tsc
```

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
    constants.ts      → Comp name, Lambda config, local render output dir
  routes/             → React Router API endpoints
    api/render.ts     → Render video (Lambda or local fallback)
    api/progress.ts   → Poll render progress
    api/upload.ts     → S3 presigned URL uploads
    api/captions.ts   → OpenAI Whisper transcription
    api/download.ts   → Serve locally rendered files
    api/font.ts       → Google Fonts proxy
```

## State Management

- 25 React Contexts for granular re-renders
- Single `setState()` via `useWriteContext()` with `commitToUndoStack` flag
- Undo/redo: 50 snapshots of `UndoableState` via `useSyncExternalStore`
- Persistence: localStorage (`remotion-editor-starter-state-v3`) + IndexedDB for assets + JSON export/import + URL hash sharing

## Rendering

Two modes, transparent to the client:

- **Lambda** (production): if AWS env vars are set → `renderMediaOnLambda()`
- **Local** (dev): if no AWS → `bundle()` + `renderMedia()` from `@remotion/renderer`, output in `out/`

Required env vars for Lambda: `REMOTION_AWS_ACCESS_KEY_ID`, `REMOTION_AWS_SECRET_ACCESS_KEY`, `REMOTION_AWS_REGION`, `REMOTION_AWS_BUCKET_NAME`

Optional: `OPENAI_API_KEY` (for captioning via Whisper)

## Feature Flags

All in `src/editor/flags.ts`. Set any to `false` to disable.
Docs: https://www.remotion.dev/docs/editor-starter/features

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
