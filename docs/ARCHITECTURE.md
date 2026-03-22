# Architecture — Remotion Video Template

## 🏗️ System Architecture

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         VIDEO GENERATION                         │
└─────────────────────────────────────────────────────────────────┘

INPUT SOURCES
├── Remotion Studio (visual editing)
│   └─> Props panel UI
│
├── CLI (--props JSON)
│   └─> remotion render src/index.ts my-video --props '{...}'
│
├── Registry defaults
│   └─> schema.parse({ ... })
│
└── API / CMS
    └─> Fetch data → validate → register → render

         ↓ ↓ ↓ (all merge here)

COMPOSITION SYSTEM
├─ src/Root.tsx
│  └─ reads: videos (registry)
│  └─ for each video × format
│      └─ <Composition schema={...} defaultProps={...} />
│
├─ Remotion merges:
│  ├─ defaultProps (registry)
│  ├─ --props CLI override
│  └─ Studio edits
│  └─> Final merged props object
│
├─ Component receives props
│  └─ React.FC<VideoProps>
│
├─ Component → Scenes
│  ├─ Intro scene (subset of props)
│  ├─ Main scene (subset of props)
│  └─ Outro scene (subset of props)
│
└─ Output: rendered video.mp4
```

---

## 📦 Project Structure

```
remotion-video-template/
│
├─ src/
│  │
│  ├─ index.ts                    ← Entry point (Remotion.registerRoot)
│  ├─ Root.tsx                    ← Root component iterates registry
│  ├─ brand.config.ts             ← Single source of truth (colors, fonts, logo)
│  │
│  ├─ lib/                        ← Shared utilities & components
│  │  ├─ types.ts                 ← VideoEntry, Format, AudioConfig, Zod types
│  │  ├─ formats.ts               ← landscape/linkedin/short dimensions
│  │  ├─ colors.ts                ← Colors from brand + helpers (primaryGlow)
│  │  ├─ fonts.ts                 ← Google Fonts loader
│  │  ├─ animations.ts            ← fadeIn, scaleIn, slideIn, spring helpers
│  │  ├─ transitions.ts           ← fadePresentation, slidePresentation, timing
│  │  ├─ audio.tsx                ← <SfxLayer>, <MusicLayer>, <VoiceoverLayer>
│  │  ├─ captions.tsx             ← <SubtitleLayer> for SRT files
│  │  ├─ useFormat.ts             ← useFormat() hook (responsive design)
│  │  └─ lottie.tsx               ← <LottieAsset> component
│  │
│  └─ videos/
│     │
│     ├─ registry.ts              ← VideoEntry[] list (Root reads this)
│     │
│     ├─ _template/               ← Template for new videos (copied by new-video.sh)
│     │  ├─ schema.ts             ← Zod schema + TypeScript type (TemplateProps)
│     │  ├─ Composition.tsx        ← Main component (React.FC<TemplateProps>)
│     │  ├─ config.ts             ← { fps, durationInFrames, scenes { ... } }
│     │  ├─ audio.config.ts       ← { voiceover, sfx, music }
│     │  ├─ script.ts             ← (optional) VideoScript for storyboarding
│     │  │
│     │  └─ scenes/
│     │     ├─ Intro.tsx          ← Opening (React.FC<IntroProps>)
│     │     ├─ Main.tsx           ← Middle content
│     │     └─ Outro.tsx          ← Closing & CTA
│     │
│     ├─ hello-world/             ← Working example (refactored for CMS)
│     │  ├─ schema.ts             ← HelloWorldProps
│     │  ├─ Composition.tsx
│     │  ├─ config.ts
│     │  ├─ audio.config.ts
│     │  │
│     │  ├─ scenes/
│     │  │  ├─ Intro.tsx
│     │  │  ├─ Main.tsx
│     │  │  └─ Outro.tsx
│     │  │
│     │  └─ components/
│     │     └─ FeatureCard.tsx    ← Reusable video component
│     │
│     └─ <your-video>/            ← New videos follow same structure
│        ├─ schema.ts
│        ├─ Composition.tsx
│        ├─ config.ts
│        ├─ audio.config.ts
│        ├─ scenes/ { ... }
│        └─ components/ { ... }
│
├─ public/
│  ├─ logo-placeholder.svg        ← Shared assets
│  ├─ audio/
│  │  ├─ sfx/                     ← Shared SFX (.wav/.mp3)
│  │  ├─ music/                   ← Background tracks
│  │  └─ voiceover/
│  │     └─ <slug>/               ← Per-video voiceover MP3s
│  ├─ images/                     ← Stock images, artwork
│  ├─ videos/                     ← B-roll, background video
│  ├─ subs/                       ← SRT subtitle files
│  │  └─ <slug>/
│  │     ├─ intro.srt
│  │     ├─ intro.fr.srt          ← Translated subtitles
│  │     └─ intro.es.srt
│  └─ lottie/                     ← Lottie JSON animations
│
├─ docs/
│  ├─ CMS-INPUT-PROPS.md          ← This pattern (detailed guide)
│  ├─ ARCHITECTURE.md             ← This file
│  └─ API.md                      ← (future) API reference
│
├─ scripts/
│  ├─ new-video.sh                ← npm run new-video <slug> "Title"
│  ├─ generate-audio.ts           ← Generate voiceover + music (ElevenLabs)
│  ├─ generate-voiceover.ts       ← Per-video voiceover
│  └─ translate-srt.ts            ← Translate subtitles to other languages
│
├─ .mcp/                          ← Model Context Protocol servers
│  ├─ stocky/                     ← Stock images/videos (Pexels, Unsplash)
│  ├─ jamendo/                    ← Royalty-free music
│  ├─ suno/                       ← AI music generation
│  └─ lottiefiles/                ← Lottie animations
│
├─ .claude/
│  ├─ settings.json               ← MCP server configuration
│  └─ projects/                   ← Planning files
│
├─ .env.example                   ← API keys template
├─ package.json
├─ tsconfig.json
├─ remotion.config.ts
├─ tailwind.config.js
│
├─ CLAUDE.md                      ← Project guidelines & patterns
├─ README.md
└─ docs/
   └─ (this architecture doc)
```

---

## 🔄 Composition Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│                    COMPOSITION LIFECYCLE                      │
└──────────────────────────────────────────────────────────────┘

1. REGISTRATION
   ├─ VideoEntry created in registry.ts
   ├─ schema: Zod type defined
   └─ defaultProps: schema.parse({...}) validates

2. ROOT RENDERING (React)
   ├─ Root.tsx reads videos (registry)
   ├─ For each video × format pair
   ├─ Creates <Composition id={video.id-format} ... />
   └─ Passes component, schema, defaultProps

3. REMOTION SETUP
   ├─ Studio loads schema
   ├─ Props panel UI generated from schema
   ├─ defaultProps used as initial values
   └─ Ready for editing

4. PROPS RESOLUTION (at render time)
   ├─ defaultProps (registry default)
   ├─ + Studio edits (if any)
   ├─ + --props CLI override (if any)
   └─> Final merged props object

5. COMPONENT EXECUTION
   ├─ React.FC<VideoProps> receives merged props
   ├─ Composition logic executes (TransitionSeries, etc.)
   ├─ Passes subset of props to each scene
   └─ Scenes render with prop values

6. SCENE RENDERING
   ├─ Each scene (Intro, Main, Outro) receives props
   ├─ No global imports of hardcoded content
   ├─ All text/images from props
   └─> Pure render of prop values

7. OUTPUT
   ├─ Remotion renders to video.mp4
   ├─ All frames merged with audio (SFX, music, voiceover)
   └─> Final deliverable
```

---

## 🎬 Video Composition Structure

Every video follows this pattern:

```
MyVideo/
├─ schema.ts
│  └─ export MyVideoProps type
│
├─ Composition.tsx
│  ├─ export const MyComposition: React.FC<MyVideoProps>
│  ├─ Receives full props object
│  ├─ Assembles scenes with TransitionSeries
│  ├─ Passes scene-specific props to each scene
│  └─ Attaches audio layers (SfxLayer, MusicLayer, VoiceoverLayer)
│
├─ config.ts
│  ├─ fps: 30
│  ├─ durationInFrames: 600
│  └─ scenes: { intro: {...}, main: {...}, outro: {...} }
│
├─ audio.config.ts
│  ├─ voiceover: { voiceId, segments: [...] }
│  ├─ sfx: [{ sfx, frame, durationInFrames, volume }, ...]
│  └─ music: { source, src, volume }
│
├─ script.ts (optional)
│  └─ VideoScript interface (for storyboarding)
│
├─ scenes/
│  ├─ Intro.tsx
│  │  ├─ interface IntroProps { title, logoUrl }
│  │  └─ Renders opening animation + text
│  │
│  ├─ Main.tsx
│  │  ├─ interface MainProps { ... }
│  │  └─ Renders main content with animations
│  │
│  └─ Outro.tsx
│     ├─ interface OutroProps { ... }
│     └─ Renders closing + CTA
│
└─ components/
   ├─ (optional) Reusable components for this video
   ├─ e.g., FeatureCard, ArtworkFrame, etc.
   └─ Scoped to this video (not shared)
```

---

## 🔗 Type Hierarchy

```
Remotion Framework
│
└─ <Composition />
   ├─ schema: ZodTypeAny         ← Validation + Studio UI
   ├─ defaultProps: Record       ← Initial values
   ├─ component: React.FC<any>   ← Component to render
   │
   └─ Renders Component with props
      │
      └─ React.FC<VideoProps>    ← Typed composition
         │
         ├─ Receives: full props object (type-safe via Zod)
         ├─ State: frame, fps from useCurrentFrame(), useVideoConfig()
         ├─ Layout: scenes assembled in TransitionSeries
         │
         └─ Renders scenes
            │
            ├─ Scene 1: React.FC<Scene1Props>
            │  ├─ Receives: subset of VideoProps
            │  ├─ State: frame (relative to Sequence)
            │  └─ Renders: JSX with prop values
            │
            ├─ Transition (fade/slide/wipe)
            │
            ├─ Scene 2: React.FC<Scene2Props>
            │
            └─ ... etc
```

---

## 🔀 Multi-Format Rendering

```
registry.ts: { id: "my-video", ... }
       ↓
Root.tsx: for each format in ["landscape", "linkedin", "short"]
       ↓
┌─────────────────────────────────────────┐
│ my-video-landscape (1920×1080)          │
│ my-video-linkedin  (1080×1350)          │
│ my-video-short     (1080×1920)          │
└─────────────────────────────────────────┘
       ↓
useFormat() hook in scenes:
├─ format: FormatId
├─ isPortrait: boolean
├─ scaleFactor: number (relative to 1920×1080 base)
└─ padding: number (responsive spacing)
       ↓
Scenes adapt layout based on format
├─ Landscape: 3 feature cards in row
├─ LinkedIn: 2 cards in column
└─ Short: 1 card per screen
```

---

## 📊 Data Flow: CMS Integration Example

```
┌────────────────────────────────────────────────────────────┐
│                   CMS / Database                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Artworks Table:                                      │  │
│  │ - id: "girl-pearl-earring"                           │  │
│  │ - title: "Girl with a Pearl Earring"                 │  │
│  │ - artist: "Johannes Vermeer"                         │  │
│  │ - year: 1665                                         │  │
│  │ - image_url: "s3://cdn/girl-pearl-earring.jpg"       │  │
│  │ - hook_text: "One of the most mysterious..."         │  │
│  │ - body_text: "Painted in the Dutch Golden Age..."    │  │
│  │ - cta: "Discover more"                               │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
          ↓
┌────────────────────────────────────────────────────────────┐
│         Build Script / Workflow Runner                      │
│                                                             │
│  async function buildRegistry() {                          │
│    const artworks = await cms.getArtworks();               │
│    return artworks.map(art => ({                           │
│      id: `art-${art.slug}`,                                │
│      component: ArtHistoryComposition,                     │
│      schema: artHistorySchema,                             │
│      defaultProps: artHistorySchema.parse({                │
│        artwork: { ... },                                   │
│        script: { ... },                                    │
│      }),                                                   │
│    }));                                                    │
│  }                                                         │
└────────────────────────────────────────────────────────────┘
          ↓
┌────────────────────────────────────────────────────────────┐
│                  registry.ts (Dynamic)                      │
│                                                             │
│  export const videos: VideoEntry[] = [                     │
│    { id: "girl-pearl-earring", ... },                      │
│    { id: "starry-night", ... },                            │
│    { id: "persistence-memory", ... },                      │
│  ];                                                        │
└────────────────────────────────────────────────────────────┘
          ↓
┌────────────────────────────────────────────────────────────┐
│                     Root.tsx                                │
│                                                             │
│  videos.map(video => (                                     │
│    <Composition                                             │
│      schema={video.schema}                                 │
│      defaultProps={video.defaultProps}                     │
│      component={video.component}                           │
│      ...                                                   │
│    />                                                      │
│  ))                                                        │
└────────────────────────────────────────────────────────────┘
          ↓
┌────────────────────────────────────────────────────────────┐
│                  Remotion Studio / CLI                      │
│                                                             │
│  npm run render:all                                        │
│  → girl-pearl-earring-landscape.mp4                        │
│  → girl-pearl-earring-linkedin.mp4                         │
│  → girl-pearl-earring-short.mp4                            │
│  → starry-night-landscape.mp4                              │
│  → ... (all variations)                                    │
└────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer           | Technology             | Purpose                        |
| --------------- | ---------------------- | ------------------------------ |
| **Framework**   | Remotion 4.x           | Video composition & rendering  |
| **Language**    | TypeScript 5.x         | Type safety                    |
| **Validation**  | Zod 4.x                | Runtime schema validation      |
| **Styling**     | Tailwind CSS 4.x       | Utility-first styling          |
| **Fonts**       | @remotion/google-fonts | Google Fonts loading           |
| **Animations**  | Remotion spring()      | Natural motion                 |
| **Transitions** | @remotion/transitions  | Scene transitions              |
| **Audio**       | Web Audio API          | SFX, music, voiceover playback |
| **Subtitles**   | @remotion/captions     | SRT-based captions             |
| **Lottie**      | @remotion/lottie       | Vector animations              |
| **CLI**         | Remotion CLI           | Development & rendering        |
| **Build**       | Remotion Bundler       | Webpack-based bundling         |

---

## 🎯 Key Design Decisions

### 1. **Zod for Runtime Validation**

- ✅ Ensures props are valid at build-time (`schema.parse()`)
- ✅ Generates Studio UI automatically from schema
- ✅ Type-safe via `z.infer<typeof schema>`

### 2. **Props-Driven Content**

- ✅ No global imports in scenes (`brand.name`, `config.x`)
- ✅ All content flows through props
- ✅ Makes CMS integration straightforward

### 3. **Subset Props to Scenes**

- ✅ Scenes only receive props they need
- ✅ Type safety: `interface IntroProps { title, logoUrl }`
- ✅ Easy to refactor scenes independently

### 4. **registry.ts as Single Source**

- ✅ All compositions registered in one place
- ✅ Easy to add/remove videos
- ✅ Dynamic registration possible (fetch from CMS)

### 5. **Separate schema.ts Files**

- ✅ Composition props defined in dedicated file
- ✅ Can export type for use elsewhere
- ✅ Easier to test validation rules

---

## 📈 Scaling Patterns

### Adding 10 Videos

```
✓ Use same composition, different defaultProps
✓ Registry entries with unique IDs
✓ All get all 3 formats automatically
```

### Adding 1000 Videos (Batch)

```
✓ Fetch data from CMS/database
✓ Generate registry entries programmatically
✓ Use Remotion CLI: npm run render:all
✓ Or: remotion render src/index.ts <id> --props <json>
```

### Custom Per-Video Logic

```
✓ Create new composition with unique Composition.tsx
✓ Define own schema.ts (different fields)
✓ Register with schema + defaultProps
✓ All existing infrastructure works
```

---

**Last updated:** March 2026
**Architecture version:** 1.1.0 (CMS + Input Props)
