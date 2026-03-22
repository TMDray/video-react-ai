# Remotion Video Template

## Quick Reference

- Entry: `src/index.ts` → `src/Root.tsx` → `src/videos/registry.ts`
- Brand config: `src/brand.config.ts` (edit this to change brand)
- New video: `npm run new-video -- <slug> "Title"`
- Studio: `npm run studio`
- Render: `npm run render -- <composition-id> out/<name>.mp4`
- Generate audio: `npm run generate:audio`
- Generate voiceover: `npm run generate:voiceover -- <slug>`

## Architecture

### Project structure

```
src/
  brand.config.ts     → Single source of truth for brand (colors, fonts, logo, CTA)
  lib/                → Shared utilities (import from @/lib/*)
    types.ts          → VideoEntry, Format, SfxCue, AudioConfig, CaptionConfig
    formats.ts        → landscape (1920×1080), linkedin (1080×1350), short (1080×1920)
    colors.ts         → Re-exports brand.colors + primaryGlow() helper
    fonts.ts          → @remotion/google-fonts loading
    animations.ts     → fadeIn, fadeOut, fadeInOut, slideIn, scaleIn, glowPulse, typewriter
    transitions.ts    → fadePresentation, slidePresentation, wipePresentation + timing presets
    audio.ts          → <SfxLayer>, <MusicLayer>, <VoiceoverLayer> components
    captions.tsx      → <SubtitleLayer> TikTok-style captions from SRT files
    useFormat.ts      → useFormat() hook → { format, isPortrait, scaleFactor, padding }
  videos/
    registry.ts       → Explicit list of all videos (Root.tsx reads this)
    _template/        → Copied by new-video.sh for each new video
    hello-world/      → Working sample video
    <your-video>/     → Your videos go here
```

### How Root.tsx works

Root.tsx iterates `registry × formats` and auto-generates all compositions:
- `hello-world-landscape`
- `hello-world-linkedin`
- `hello-world-short`

You never edit Root.tsx manually. Add videos via `registry.ts`.

### Video structure

Each video folder contains:
- `config.ts` — fps, durationInFrames, scene timings
- `audio.config.ts` — voiceover segments + SFX cue sheet
- `Composition.tsx` — TransitionSeries assembling scenes + audio layers
- `scenes/` — Individual scene components (Intro.tsx, Main.tsx, Outro.tsx)
- `components/` — Video-specific reusable components
- `schema.ts` — (optional) Zod schema defining input props for CMS integration

### CMS + Input Props (Data-Driven Videos)

The template supports **data-driven videos** — one composition can generate multiple videos with different content via input props. This enables CMS integration and batch video generation.

#### Creating a data-driven composition

**1. Define a Zod schema in `schema.ts`:**

```ts
// src/videos/my-video/schema.ts
import { z } from "zod";

export const myVideoSchema = z.object({
  title: z.string().default("Video Title"),
  subtitle: z.string().default("Subtitle"),
  headline: z.string().default("Main headline"),
  ctaText: z.string().default("Learn More"),
  logoUrl: z.string().default("logo-placeholder.svg"),
});

export type MyVideoProps = z.infer<typeof myVideoSchema>;
```

**2. Update Composition to accept props:**

```tsx
// src/videos/my-video/Composition.tsx
import type { MyVideoProps } from "./schema";

export const MyVideoComposition: React.FC<MyVideoProps> = (props) => {
  return (
    <AbsoluteFill>
      <Intro title={props.title} logoUrl={props.logoUrl} />
      <Main headline={props.headline} />
      <Outro title={props.title} subtitle={props.subtitle} ctaText={props.ctaText} />
    </AbsoluteFill>
  );
};
```

**3. Update scenes to accept props:**

```tsx
// src/videos/my-video/scenes/Intro.tsx
interface IntroProps {
  title: string;
  logoUrl: string;
}

export const Intro: React.FC<IntroProps> = ({ title, logoUrl }) => {
  return (
    <AbsoluteFill>
      <Img src={staticFile(logoUrl)} />
      <div>{title}</div>
    </AbsoluteFill>
  );
};
```

**4. Register in `registry.ts` with schema + defaultProps:**

```ts
// src/videos/registry.ts
import { myVideoSchema } from "./my-video/schema";

{
  id: "my-video",
  title: "My Video",
  component: MyVideoComposition,
  schema: myVideoSchema,
  defaultProps: myVideoSchema.parse({
    title: brand.name,
    ctaText: brand.cta.text,
    // ... other defaults
  }),
  durationInFrames: 450,
  fps: 30,
}
```

#### Using the data-driven video

**Studio UI (visual editing):**
```bash
npm run studio
# Open "my-video-landscape" → see editable Props panel on the right
```

**CLI (override props):**
```bash
remotion render src/index.ts my-video-landscape \
  --props '{"title":"Custom Title","ctaText":"Buy Now"}' \
  out/my-video.mp4
```

**Multiple variants from one composition:**
```ts
// Register same composition with different data
{
  id: "variant-a",
  component: MyVideoComposition,
  schema: myVideoSchema,
  defaultProps: myVideoSchema.parse({ title: "Product A", ... }),
  ...
},
{
  id: "variant-b",
  component: MyVideoComposition,
  schema: myVideoSchema,
  defaultProps: myVideoSchema.parse({ title: "Product B", ... }),
  ...
},
```

**Key examples:**
- `hello-world` — refactored to use input props (`brandName`, `tagline`, `headline`, `ctaText`, `logoUrl`)
- `_template` — generic template accepting `title`, `subtitle`, `body`, `ctaText`, `logoUrl`

## Conventions

### Scenes

- Every scene wraps content in `<AbsoluteFill>`
- Use `useCurrentFrame()` and `useVideoConfig()` from remotion
- Import colors from `@/lib/colors`, fonts from `@/lib/fonts`
- Use animation helpers from `@/lib/animations` — never raw interpolate for common patterns
- Frame is RELATIVE to the Sequence, not absolute timeline

### Animations

```tsx
// Fade in over 10 frames starting at frame 0
opacity: fadeIn(frame)

// Fade in starting at frame 15 over 10 frames
opacity: fadeIn(frame, 15, 10)

// Full scene lifecycle (fade in + hold + fade out)
opacity: fadeInOut(frame, durationInFrames)

// Spring-based scale entrance
const scale = scaleIn(frame, fps, "snappy");

// Directional slide with spring
const { translateX, translateY } = slideIn(frame, fps, "up", "gentle");

// Pulsing glow for logos
filter: `drop-shadow(0 0 ${glowPulse(frame)}px ${primaryGlow(0.5)})`
```

Spring presets: `gentle`, `snappy`, `bouncy`, `heavy`

### Transitions (between scenes)

```tsx
import { TransitionSeries } from "@remotion/transitions";
import { fadePresentation, slidePresentation, springTiming } from "@/lib/transitions";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={120}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fadePresentation()}
    timing={springTiming(15)}
  />
  <TransitionSeries.Sequence durationInFrames={200}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

Note: transition frames overlap — total duration = sum of scenes - sum of transitions.

### Audio

SFX are declared in `audio.config.ts`, NOT inline in Composition.tsx:

```ts
sfx: [
  { sfx: "whoosh", frame: 103, durationInFrames: 20, volume: 0.3 },
  { sfx: "success-ding", frame: 200, durationInFrames: 30, volume: 0.4 },
]
```

Rendered via `<SfxLayer cues={audioConfig.sfx} />`.

SFX files live in `public/audio/sfx/` (shared) or per-video directories.

### Multi-format responsive

Use `useFormat()` to adapt layouts:

```tsx
const { format, isPortrait, scaleFactor, padding } = useFormat();
const fontSize = isPortrait ? 24 : 36;
```

### Assets

- Shared: `staticFile("logo-placeholder.svg")`, `staticFile("audio/sfx/whoosh.wav")`
- Per-video voiceover: `staticFile("audio/voiceover/<slug>/01-intro.mp3")`

## Stock Images & Videos (Stocky MCP)

Le serveur MCP Stocky est inclus dans `.mcp/stocky/` pour chercher des images et videos libres de droits.

### Configuration requise

Ajouter les clés API dans `.env` :

```
PEXELS_API_KEY=xxx        # Gratuit sur https://www.pexels.com/api/
UNSPLASH_ACCESS_KEY=xxx   # Gratuit sur https://unsplash.com/developers
```

Config MCP (`.claude/settings.json`) :

```json
{
  "mcpServers": {
    "stocky": {
      "command": "python",
      "args": [".mcp/stocky/stocky_mcp.py"],
      "env": {
        "PEXELS_API_KEY": "${PEXELS_API_KEY}",
        "UNSPLASH_ACCESS_KEY": "${UNSPLASH_ACCESS_KEY}"
      }
    }
  }
}
```

### Outils images

- `search_stock_images` — Recherche multi-provider (Pexels + Unsplash)
  - `query` : mots-cles (ex: "modern office", "person typing")
  - `providers` : ["pexels", "unsplash"] (par defaut les deux)
  - `per_page` : nombre de resultats (max 50)
- `get_image_details` — Metadata complete d'une image (dimensions, photographe, licence)
- `download_image` — Telecharger dans public/images/ pour utilisation dans les scenes

### Outils videos

- `search_stock_videos` — Recherche de videos sur Pexels
  - `query` : mots-cles (ex: "office meeting", "nature aerial")
  - `per_page` : nombre de resultats (max 50)
  - `min_duration` / `max_duration` : filtrer par duree (secondes)
  - `orientation` : "landscape", "portrait", ou "square"
- `get_video_details` — Metadata complete d'une video (duree, qualites disponibles)
- `download_video` — Telecharger dans public/videos/
  - `quality` : "sd", "hd", ou "uhd" (defaut: "hd")
  - `output_path` : chemin absolu de destination

### Utilisation dans une scene Remotion

```tsx
import { Img, staticFile } from "remotion";
import { OffthreadVideo } from "remotion";

// Image stock
<Img src={staticFile("images/office-bg.jpg")} style={{ width: "100%", height: "100%" }} />

// Video stock (background, B-roll, etc.)
<OffthreadVideo src={staticFile("videos/office-meeting.mp4")} style={{ width: "100%", height: "100%" }} />
```

### Limites

- Pexels : 200 requetes/heure (images + videos, meme cle API)
- Unsplash : 50 requetes/heure (demo), 5000/heure (production) — images uniquement
- Videos disponibles via Pexels uniquement

## Captions / Subtitles

### SubtitleLayer component

TikTok-style animated captions from an SRT file. Uses `@remotion/captions` under the hood.

```tsx
import { SubtitleLayer } from "@/lib/captions";

// In your Composition, add as an overlay layer:
<SubtitleLayer src="subs/intro.srt" />

// With custom styling:
<SubtitleLayer
  src="subs/intro.srt"
  combineTokensWithinMs={1000}
  style={{ fontSize: 54 }}
/>
```

- SRT files go in `public/subs/`
- Active word is highlighted with `colors.primary`, inactive words are white
- Font uses `fontHeading` from `@/lib/fonts`
- Positioned at bottom of frame (paddingBottom: 140px)

### Generating SRT from voiceover

After generating voiceover audio with `npm run generate:voiceover`, create matching SRT files:
1. Use a transcription tool (Whisper, AssemblyAI, etc.) on the generated MP3
2. Export as `.srt` format
3. Place in `public/subs/<slug>/` directory
4. Reference in your Composition: `<SubtitleLayer src="subs/<slug>/intro.srt" />`

### SRT format reference

```
1
00:00:00,000 --> 00:00:02,500
First subtitle text

2
00:00:02,800 --> 00:00:05,000
Second subtitle text
```

## Translation

Translate SRT subtitle files to any language:

```bash
# With DeepL (set DEEPL_API_KEY in .env)
npx tsx scripts/translate-srt.ts public/subs/intro.srt fr

# Without DeepL key — falls back to Google Translate
npx tsx scripts/translate-srt.ts public/subs/intro.srt es
```

- Output: `<input>.<lang>.srt` (e.g. `intro.fr.srt`) in the same directory
- Timestamps are preserved, only text is translated
- DeepL free tier: 500K chars/month (key ending in `:fx` auto-detected)
- Supported language codes: `fr`, `de`, `es`, `it`, `pt`, `nl`, `ja`, `zh`, etc.

## AI Music Generation (Suno MCP)

Le serveur MCP Suno est inclus dans `.mcp/suno/` pour generer de la musique IA via l'API Suno.

### Configuration requise

Ajouter les cles API dans `.env` :

```
SUNO_API_KEY=xxx              # Payant sur https://sunoapi.org
SUNO_API_BASE_URL=https://api.sunoapi.org
```

Config MCP (`.claude/settings.json`) :

```json
{
  "mcpServers": {
    "suno": {
      "command": "python",
      "args": [".mcp/suno/server.py"],
      "env": {
        "SUNO_API_KEY": "${SUNO_API_KEY}",
        "SUNO_API_BASE_URL": "https://api.sunoapi.org"
      }
    }
  }
}
```

### Outils disponibles

- `generate_music` — Generer de la musique IA a partir d'un prompt texte
  - `prompt` : description ou paroles (max 3000-5000 chars en custom mode)
  - `model_version` : "v3.5", "v4", "v4.5", "v4.5plus", "v5" (v5 recommande)
  - `make_instrumental` : true pour instrumental sans voix
  - `custom_mode` : true pour controle avance (necessite `style` + `title`)
  - `style` : tags genre/style (ex: "orchestral epic, cinematic, powerful strings")
  - `wait_audio` : true pour attendre la fin de generation (defaut: true)
- `get_task_status` — Verifier le statut d'une generation par task ID
- `get_music_info` — Infos detaillees sur des tracks par track IDs (URLs, duree, metadata)
- `get_credits` — Verifier le solde de credits API
- `convert_to_wav` — Convertir un MP3 genere en WAV haute qualite
- `get_wav_conversion_status` — Statut de conversion WAV + URL de telechargement

### Utilisation dans une scene Remotion

```tsx
import { Audio, staticFile } from "remotion";

// Apres avoir telecharge le MP3/WAV genere dans public/audio/music/
<Audio src={staticFile("audio/music/epic-theme.wav")} volume={0.3} />
```

### Workflow type

1. Generer : `generate_music` avec prompt + model v5 + make_instrumental=true
2. Suno retourne 2 variations par requete
3. Optionnel : convertir en WAV via `convert_to_wav`
4. Telecharger le fichier audio dans `public/audio/music/`
5. Utiliser `<Audio>` ou `<MusicLayer>` dans la composition

### Limites

- ~6 credits par generation (2 tracks par requete)
- Cle API payante requise (pas de tier gratuit)
- Les tracks generees sont des MP3 ; conversion WAV disponible

## Royalty-Free Music (Jamendo MCP)

Le serveur MCP Jamendo est inclus dans `.mcp/jamendo/` pour rechercher et telecharger de la musique libre de droit.

### Configuration requise

Ajouter la cle API dans `.env` :

```
JAMENDO_API_KEY=xxx        # Gratuit sur https://www.jamendo.com/developers
```

Config MCP (`.claude/settings.json`) :

```json
{
  "mcpServers": {
    "jamendo": {
      "command": "python",
      "args": [".mcp/jamendo/server.py"],
      "env": {
        "JAMENDO_API_KEY": "${JAMENDO_API_KEY}"
      }
    }
  }
}
```

### Outils disponibles

- `search_music` — Chercher de la musique par mots-cles, genre ou tags
  - `query` : mots-cles (ex: "ambient", "cinematic", "upbeat")
  - `genre` : filtre par genre (ex: "electronic", "orchestral")
  - `tags` : tags separes par virgule
  - `limit` : nombre de resultats (defaut: 10, max: 100)
- `get_track_info` — Infos detaillees sur un track (metadata, duree, license)
- `download_track` — URL de telechargement + metadata pour un track

### Utilisation dans une scene Remotion

```tsx
import { MusicLayer } from "@/lib/audio";

// Apres avoir telecharge la musique dans public/audio/music/
<MusicLayer src="ambient-cinematic" source="jamendo" volume={0.1} />

// Ou en local file
<MusicLayer src="audio/music/background.mp3" source="file" volume={0.1} />
```

Dans `audio.config.ts` :

```typescript
music: {
  source: "jamendo",
  src: "track-id",  // ID Jamendo ou nom de fichier
  volume: 0.1
}
```

### Workflow type

1. Chercher : `search_music` avec query/genre (ex: "cinematic background")
2. Recuperer l'ID du track qui convient
3. Telecharger : `download_track` avec le track ID
4. Sauvegarder le MP3 dans `public/audio/music/`
5. Reference dans `audio.config.ts` avec le nom de fichier
6. Utiliser `<MusicLayer>` dans la composition

### Limites

- Musique Creative Commons libre
- Attribution requise (lien vers le track Jamendo)
- 100 requetes/jour en tier gratuit
- Telechargement automatique en MP3 320kbps

## Lottie Animations (LottieFiles MCP)

Animations vectorielles (icones animees, transitions, confettis, loaders) via LottieFiles.

### Configuration

MCP via npx (pas de cle API requise) :

```json
{
  "mcpServers": {
    "lottiefiles": {
      "command": "npx",
      "args": ["-y", "mcp-server-lottiefiles"]
    }
  }
}
```

### Outils disponibles

- `search_animations` — Rechercher des animations par mots-cles (ex: "confetti", "loading", "checkmark")
- `get_animation_details` — Metadata complete d'une animation (dimensions, duree, auteur)
- `get_popular_animations` — Animations tendance de la semaine

### Utilisation dans une scene Remotion

```tsx
import { LottieAsset } from "@/lib/lottie";

// Apres avoir telecharge le JSON dans public/lottie/
<LottieAsset src="lottie/confetti.json" />

// Avec options
<LottieAsset src="lottie/check.json" style={{ width: 200 }} loop playbackRate={1.5} />
```

### Workflow type

1. Chercher : `search_animations` avec mots-cles
2. Telecharger le fichier `.json` dans `public/lottie/`
3. Utiliser `<LottieAsset>` dans la scene — synchronise automatiquement avec la timeline Remotion

### Limites

- API non-officielle LottieFiles (pas de cle, peut etre instable)
- Animations gratuites uniquement

## Video Scripting & Retention

### Workflow script-first (optionnel)

1. L'utilisateur donne un brief (sujet, plateforme, duree, ton)
2. Claude genere un `script.ts` avec le type `VideoScript` de `@/lib/types`
3. L'utilisateur valide/ajuste le script
4. Claude implemente les scenes, config audio et composition a partir du script

Le script est un document de reference, pas un framework rigide. On peut creer des videos sans.

### Regles de retention universelles

Ces regles s'appliquent a TOUT type de video (marketing, divertissement, education) :

- **Hook en 1-3 secondes** — ne jamais commencer par un logo, une intro animee, ou "Bonjour". Droit au visuel/phrase qui capte l'attention
- **Pattern interrupt toutes les 3-5s** en short-form — changement visuel, zoom, SFX, text overlay, cut B-roll, shift de couleur
- **Max 15s sans changement** visuel ou audio, meme en format long
- **Sous-titres obligatoires** — 85% regardent sans le son. +12% retention avec captions
- **Text overlay : max 7 mots**, 2 lignes max, 0.5-0.7s par mot + 3s de base pour l'affichage
- **SFX synchronises** avec les transitions et apparitions de texte (whoosh, pop, ding)
- **Re-engagement** a 15s et 30s — relancer l'attention avec un pattern break
- **Silence strategique** — 1-2s de silence avant une phrase cle pour creer un "spotlight"

### Hooks par type

| Type | Marketing | Divertissement |
|------|-----------|----------------|
| Question | "Encore bloque sur X ?" | "Vous saviez que X ?" |
| Stat choc | "80% des Y font Z" | "En 2024, X personnes ont..." |
| Contrarian | "Arretez de faire X" | "Tout le monde se trompe sur X" |
| Resultat d'abord | Montrer le before/after | Montrer la punchline puis le contexte |
| Visuel fort | Pattern interrupt frame 1 | Image surprenante ou absurde |
| Curiosite | "Voici comment X en Y secondes" | "Attendez la fin..." |

### Frameworks narratifs

**Marketing :**
- **PAS** (Problem → Agitate → Solution) — demos produit, pain points
- **BAB** (Before → After → Bridge) — transformations, SaaS
- **AIDA** (Attention → Interest → Desire → Action) — marketing general

**Divertissement :**
- **Setup → Build → Payoff** — humour, storytelling, revelations
- **HSO** (Hook → Story → Offer) — temoignages, brand storytelling
- **Free** — structure libre

### Structure par duree

**15 secondes** (~35-40 mots VO)
- 0-2s : Hook (visuel + texte + VO alignes)
- 2-12s : Message cle unique (1 seule idee)
- 12-15s : CTA ou punchline
- 2-3 cuts rapides

**30 secondes** (~75-80 mots VO)
- 0-3s : Hook
- 3-10s : Probleme ou setup
- 10-22s : Solution/demo ou build
- 22-27s : Preuve ou climax
- 27-30s : CTA ou payoff
- Pattern interrupt toutes les 4-5s, re-engagement a 15s

**60 secondes** (~150 mots VO)
- 0-3s : Hook
- 3-13s : Probleme/setup
- 13-23s : Agiter/build
- 23-45s : Solution/demo ou climax
- 45-52s : Preuve ou resolution
- 52-60s : CTA ou payoff
- Pattern interrupt toutes les 3-5s, re-engagement a 15s et 30s
- Musique : tension au debut, montee progressive, pic a 30-45s

**90 secondes** (~225 mots VO)
- 0-3s : Hook
- 3-13s : Contexte/setup
- 13-28s : Probleme/build detaille
- 28-55s : Solution/demo ou climax etendu
- 55-70s : Preuve / resolution
- 70-83s : Recapitulatif
- 83-90s : CTA ou payoff final
- Re-engagement a 15s, 30s, 60s

### Plateforme

| Plateforme | Duree optimale | Ton | Format |
|------------|---------------|-----|--------|
| LinkedIn | 15-60s | Pro, educatif | 1:1 ou 9:16 |
| TikTok/Reels | 15-34s | Direct, dynamique | 9:16 |
| YouTube Shorts | 15-35s | Valeur immediate | 9:16 |
| YouTube | 5-10 min | Approfondi | 16:9 |

### Musique (BPM selon le ton)

| Ton | BPM | Usage |
|-----|-----|-------|
| Calme, confiance | 60-80 | Temoignages, thought leadership |
| Corporate, focus | 80-100 | Explainers, tutoriels |
| Energique, demo | 120-140 | Lancements, produits |
| Intense, urgence | 140-180 | Ads rapides, action |

### CTA

- **Video < 30s** : CTA en fin uniquement
- **Video 30-90s** : CTA mid-roll (apres la demo/climax) + rappel en fin — le mid-roll convertit 5x mieux
- CTA = verbe d'action + valeur ("Essayez gratuitement", "Voir la demo")
- Visuellement : bouton en couleur accent (brand.colors.primary)

### Erreurs a eviter

- Logo/intro anime en ouverture (= bouton "skip" mental)
- Pas de hook dans les 3 premieres secondes
- Contenu statique sans pattern interrupts pendant 10s+
- Trop de texte sur un seul ecran (max 2 lignes)
- Etirer une idee de 20s sur 45s
- Pas de sous-titres
- CTA uniquement a la fin (84% des viewers ne l'atteignent pas)

## Rules

- Always use `extrapolateLeft/Right: "clamp"` on interpolate() calls
- Use spring() for natural motion, not raw Math.sin for entrances
- Colors come from `@/lib/colors` — never hardcode hex values in scenes
- Fonts come from `@/lib/fonts` — never hardcode font-family strings
- One component per file, named export matching filename
- Keep scenes pure — no side effects, no async, no fetching
