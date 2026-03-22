# Workflow — Guide de production vidéo

## Vue d'ensemble

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  1. PRÉPARER    │ ──► │  2. CRÉER        │ ──► │  3. EXPORTER    │
│  Assets         │     │  Éditeur/Studio   │     │  Render MP4     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## 1. Préparer les assets

### Formats recommandés

| Type | Format | Résolution | Notes |
|------|--------|------------|-------|
| Images | PNG (transparence) ou JPEG/WebP | 2x la sortie (ex: 3840x2160 pour du 1080p) | Éviter les BMP, TIFF |
| Vidéos | H.264 MP4 | Même résolution que la sortie | Re-encoder avec keyint=1 pour le seeking exact |
| Audio | WAV ou MP3 CBR (320kbps) | — | Éviter les MP3 VBR (problèmes de sync) |
| Polices | Google Fonts (intégré) ou TTF/OTF dans `public/` | — | Ne pas compter sur les polices système |
| Animations | Lottie JSON via lottiefiles.com | — | Utiliser `@remotion/lottie` |
| GIF | GIF optimisé | Garder < 5MB | Utiliser `@remotion/gif` |

### Préparer une vidéo source (seeking exact)

```bash
ffmpeg -i input.mp4 -c:v libx264 -x264-params keyint=1 output.mp4
```

### Où placer les assets

- **Assets statiques** → dossier `public/`, référencer via `staticFile("nom.png")`
- **Assets dynamiques** (uploads utilisateur) → importés dans l'éditeur (stockés en IndexedDB)
- **Assets distants** → URL directe, pré-charger avec `@remotion/preload`

## 2. Créer — Deux outils disponibles

### Éditeur visuel (`npm run dev` → localhost:5173)

**Pour qui** : montage vidéo visuel, non-développeurs

**Workflow** :
1. Glisser images/vidéos sur le canvas ou utiliser le bouton d'import
2. Ajouter du texte (bouton T), des formes (bouton rectangle)
3. Positionner et redimensionner sur le canvas (drag & drop)
4. Organiser sur la timeline (trim, split, réordonner)
5. Ajuster dans l'inspector à droite (position, opacité, rotation, etc.)
6. Exporter → bouton Export → MP4 ou WebM

**Items disponibles** : Image, Vidéo, Texte, Forme, Audio, GIF, Sous-titres

**Raccourcis clavier** :
- `Ctrl+Z` / `Ctrl+Y` — Undo / Redo
- `Ctrl+S` — Sauvegarder
- `Ctrl+A` — Tout sélectionner
- `Delete` / `Backspace` — Supprimer
- `Espace` — Play / Pause

**Sauvegarde** :
- Automatique dans localStorage (`remotion-editor-starter-state-v3`)
- Export JSON pour backup (bouton ↓ dans la toolbar)
- Import JSON pour restaurer (bouton ↑ dans la toolbar)
- Partage par URL (le state est encodé dans le hash)

### Remotion Studio (`npm run remotion:studio` → localhost:3002)

**Pour qui** : développeurs, animations codées

**Workflow** :
1. Créer une composition dans `src/remotion/examples/`
2. L'enregistrer dans `Root.tsx`
3. Prévisualiser dans le Studio
4. Rendre en vidéo depuis le Studio

**Quand utiliser le Studio plutôt que l'éditeur** :
- Animations complexes (spring, transitions, morphing SVG)
- Effets génératifs (bruit Perlin, particules)
- Animations Lottie
- Data-driven video (graphiques, dashboards animés)

## 3. Exporter / Render

### Paramètres par plateforme

| Plateforme | Résolution | FPS | Ratio | Codec |
|------------|-----------|-----|-------|-------|
| YouTube | 1920x1080 | 30 | 16:9 | H.264 |
| YouTube 4K | 3840x2160 | 30 ou 60 | 16:9 | H.264 |
| TikTok / Reels | 1080x1920 | 30 | 9:16 | H.264 |
| Instagram Feed | 1080x1080 | 30 | 1:1 | H.264 |
| Twitter/X | 1280x720 | 30 | 16:9 | H.264 |
| Web embed | 1280x720 | 30 | 16:9 | WebM VP9 |

### Modes de rendu

- **Local** (sans AWS) : `npx remotion render` via CLI — plus lent mais gratuit
- **Lambda** (avec AWS) : rendu parallélisé dans le cloud — rapide mais payant

### Qualité (CRF)

- `crf: 18` — Haute qualité (fichiers plus gros)
- `crf: 23` — Bon compromis qualité/taille
- `crf: 28` — Qualité acceptable, fichiers légers

## 4. Bonnes pratiques

### À faire

- Toujours dériver l'état depuis `useCurrentFrame()` — jamais `Date.now()` ou `Math.random()`
- Utiliser `delayRender()` / `continueRender()` pour charger des assets async
- Pré-charger les assets lourds avec `@remotion/preload`
- Garder les compositions stateless (pas d'effets de bord)
- Exporter régulièrement le JSON de l'éditeur comme backup
- Tester à la résolution cible avant l'export final

### À éviter

- Audio VBR (Variable Bit Rate) — cause des problèmes de sync
- Assets trop lourds sans preload — frames blanches pendant le chargement
- `Math.random()` — le rendu ne sera pas reproductible
- Polices système — elles varient selon la machine de rendu
- Vidéos sources sans keyframes régulières — seeking imprécis

## 5. Workflow combiné Studio + Éditeur

Pour les projets ambitieux, combiner les deux :

```
Studio                              Éditeur
┌────────────────────┐              ┌────────────────────┐
│ Coder des anims    │              │                    │
│ complexes (intro,  │── render ──► │ Importer comme     │
│ transitions,       │   MP4/WebM   │ clips vidéo        │
│ effets)            │              │                    │
└────────────────────┘              │ + Ajouter audio    │
                                    │ + Ajouter texte    │
┌────────────────────┐              │ + Monter timeline  │
│ Assets             │── import ──► │ + Ajuster timing   │
│ (images, audio,    │   direct     │                    │
│  vidéos, GIF)      │              │── Export ──► MP4   │
└────────────────────┘              └────────────────────┘
```

1. **Créer les animations codées** dans le Studio (intro, outro, lower thirds)
2. **Render chaque animation** séparément (vidéo sans audio)
3. **Importer dans l'éditeur** comme clips vidéo
4. **Ajouter** audio, textes, images directement dans l'éditeur
5. **Monter** le tout sur la timeline
6. **Exporter** la vidéo finale
