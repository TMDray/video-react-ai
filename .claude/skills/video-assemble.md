# Video Assembly & Code Generation

## What this skill does

Takes all your approved sequence guides and **generates complete TypeScript/TSX code**:
1. Validates all sequences are approved
2. Shows a pre-generation summary for final confirmation
3. Generates `config.ts`, `audio.config.ts`, scene components, `Composition.tsx`, and updates `registry.ts`
4. Runs TypeScript typecheck and fixes issues
5. Shows how to preview, generate voiceover, and render

This is the final step before previewing/rendering your video.

**When to use**: Run `/video-assemble {slug}` only after ALL sequences have been approved via `/sequence-guide`. Example: `/video-assemble product-launch`

---

## Execution Plan

### ✓ Step 0 — Pre-flight Checks

**Read**:
- `src/videos/{slug}/.prod/metadata.json`
- `src/videos/{slug}/.prod/sequences.json`

**Check 1 — Video folder exists:**
- If `src/videos/{slug}/` does NOT exist: "❌ Video folder not found for '{slug}'. Run `/video-brief {slug}` first."
- STOP

**Check 2 — All sequences approved:**
- Read sequences.json
- Count sequences where `status == "approved"` vs total sequences
- If ANY are `"pending"` or other status:
  - Display:
    ```
    ❌ NOT ALL SEQUENCES APPROVED YET

    Status:
    ```
  - List each: `Sequence {index} ({role}): {status}`
  - Display:
    ```
    {N} sequences approved, {N} still pending.

    Complete approval with:
    ```
  - List pending: `/sequence-guide {slug} {index}` for each pending

  - **STOP** — Do not proceed until all are "approved"

If all approved:
- Read all guide files: `src/videos/{slug}/.prod/sequences/{index}-{role}/guide.md`
- Display: "✓ All {N} sequences approved. Ready to assemble."
- Proceed to **Step 1**

---

### ✓ Step 1 — Pre-generation Summary

Display a COMPLETE summary of what will be generated:

```
ASSEMBLY PLAN: {slug}
═══════════════════════════════════════════════════════════

Files that will be CREATED or OVERWRITTEN:
  src/videos/{slug}/config.ts
  src/videos/{slug}/audio.config.ts
  src/videos/{slug}/schema.ts (if props-driven)
  src/videos/{slug}/Composition.tsx
  src/videos/{slug}/scenes/
    ├─ HookScene.tsx (or more descriptive name)
    ├─ ProblemScene.tsx
    ├─ SolutionScene.tsx
    └─ CtaScene.tsx
  src/videos/registry.ts (entry updated)

═══════════════════════════════════════════════════════════

COMPOSITION SUMMARY:
  Composition name: {CamelCaseSlug}Composition
  {N} scenes in TransitionSeries

  Scene sequence:
    0 — {role} ({durationSeconds})
       Transition: {transition} fade into scene 1
    1 — {role} ({durationSeconds})
       Transition: {transition}
    ... etc

  Total: {totalFrames} frames @ 30fps = {duration}s

═══════════════════════════════════════════════════════════

AUDIO CONFIGURATION:
  Voiceover provider: ElevenLabs (voice: Adam)
  Voiceover segments: {N}
    01-hook (frames 0→{N}): "{text}" (~{wc} words)
    02-problem (frames {N}→{N}): "{text}"
    ... etc

  SFX cues: {N}
    Frame {N}: whoosh (20f, vol 0.3)
    Frame {N}: success-ding (30f, vol 0.4)
    ... etc

  Music: {from brand direction or default file}
    Source: file
    File: audio/music/ambient.wav
    Volume: 0.08

═══════════════════════════════════════════════════════════

INPUT PROPS (Schema):
  [If visual/voiceover content is data-driven:]
    headline: string — main message text
    brandName: string — company/brand name
    ctaText: string — call-to-action text
    logoUrl: string — path to logo image
    ... [other props from analysis]

  [If fully static/hardcoded:]
    No schema — composition is static, no variable props

═══════════════════════════════════════════════════════════

REGISTRY ENTRY:
  {
    id: "{slug}",
    title: "{title}",
    component: {CamelCase}Composition,
    durationInFrames: {totalFrames},
    fps: 30,
    schema: {camelCase}Schema,
    defaultProps: {camelCase}Schema.parse({...})
  }

═══════════════════════════════════════════════════════════
```

Ask: "Ready to generate? This will overwrite template files in `src/videos/{slug}/` with your custom code. Proceed? (yes/review/no)"

**STOP** — wait for response

If "no": STOP and exit
If "review": Display specifics they ask about
If "yes": Proceed to **Step 2**

---

### ✓ Step 2 — Generate `config.ts`

Based on sequence frame data from sequences.json:

**Generate** `src/videos/{slug}/config.ts`:

```typescript
/**
 * {slug} — {duration} ({totalFrames} frames @ 30fps)
 *
 * | Scene          | From   | Dur   | Time          |
 * |----------------|--------|-------|---------------|
 * | {role1}        | 0      | {N}   | 0s → {Xs}     |
 * | {role2}        | {N}    | {N}   | {X}s → {Y}s   |
 * ... (one per sequence)
 *
 * Overlaps of 15 frames = transition fade duration.
 * Total = sum(scene durations) - (num_transitions × 15)
 */
export const config = {
  fps: 30,
  durationInFrames: {totalFrames},
  scenes: {
    {role1}: { from: {fromFrame}, duration: {durationFrames} },
    {role2}: { from: {fromFrame}, duration: {durationFrames} },
    // ... one per sequence
  },
  transitionDuration: 15,
} as const;
```

Use exact values from sequences.json for `from` and `duration`.

---

### ✓ Step 3 — Generate `audio.config.ts`

Based on voiceover segments and SFX cues from all sequence guides:

**Generate** `src/videos/{slug}/audio.config.ts`:

```typescript
import type { AudioConfig } from "../../lib/types";

export const audioConfig: AudioConfig = {
  voiceover: {
    voiceId: "pNInz6obpgDQGcFmaJgB", // ElevenLabs "Adam"
    segments: [
      {
        id: "01-{role1}",
        text: "{voiceover text from sequence 0}",
        fromFrame: {fromFrame},
        toFrame: {toFrame},
      },
      {
        id: "02-{role2}",
        text: "{voiceover text from sequence 1}",
        fromFrame: {fromFrame},
        toFrame: {toFrame},
      },
      // ... one per sequence
    ],
  },
  sfx: [
    { sfx: "whoosh", frame: {frame}, durationInFrames: 20, volume: 0.3 },
    { sfx: "success-ding", frame: {frame}, durationInFrames: 30, volume: 0.4 },
    // ... all SFX cues from sequences
  ],
  music: {
    source: "file",
    src: "audio/music/ambient.wav",
    volume: 0.08,
  },
};
```

Constraints:
- voiceId: Always "pNInz6obpgDQGcFmaJgB" (Adam preset) unless brand guidelines specify otherwise
- sfx: Only use available files: `whoosh`, `success-ding`, `notif-chime`, `keypress`, `recording-beep`, `typing`
- music: Default to `audio/music/ambient.wav` at vol 0.08; can be overridden based on brand direction

---

### ✓ Step 4 — Generate Scene Components

For EACH sequence, generate `src/videos/{slug}/scenes/{SceneName}.tsx`:

**Naming convention** (use descriptive names when possible):
- Sequence 0 (hook) → `Intro.tsx` (or `HookScene.tsx`)
- Sequence N (cta) → `Outro.tsx` (or `CtaScene.tsx`)
- Sequence N (problem/solution/content) → `ProblemScene.tsx` / `SolutionScene.tsx` / `MainScene.tsx`

**For each scene:**

1. Read the approved guide: `src/videos/{slug}/.prod/sequences/{index}-{role}/guide.md`
2. Follow the component structure EXACTLY as described in the guide
3. Generate the full React component

**Critical constraints (ENFORCE STRICTLY):**
- **Relative imports ONLY** — NOT `@/` alias
  - ✓ `import { colors } from "../../../lib/colors"`
  - ✗ `import { colors } from "@/lib/colors"`
- **extrapolateLeft & extrapolateRight = "clamp"** on ALL `interpolate()` calls
  ```typescript
  interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  ```
- **Spring for entrances**, never `Math.sin`:
  ```typescript
  // ✓ Good
  const scale = spring({ frame, fps: 30, config: { damping: 10, stiffness: 120, mass: 0.8 } });
  // ✗ Bad
  const scale = 1 + 0.5 * Math.sin(frame / 30);
  ```
- **Colors from `colors` object**, never hardcode hex:
  ```typescript
  // ✓ Good
  style={{ color: colors.primary, backgroundColor: colors.bg }}
  // ✗ Bad
  style={{ color: "#6366f1", backgroundColor: "#0f172a" }}
  ```
- **Fonts from font helpers**, never hardcode font-family:
  ```typescript
  // ✓ Good
  style={{ fontFamily: fontHeading, fontSize: 48 }}
  // ✗ Bad
  style={{ fontFamily: "Inter", fontSize: 48 }}
  ```
- **Frame numbers are RELATIVE** to the Sequence (0 = start of this scene)
- **AbsoluteFill wrapper** on every scene:
  ```typescript
  <AbsoluteFill>
    {/* Scene content */}
  </AbsoluteFill>
  ```

**Standard imports for all scenes:**
```typescript
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";
import { colors } from "../../../lib/colors";
import { fontHeading, fontBody } from "../../../lib/fonts";
import { fadeIn, slideIn, scaleIn, glowPulse } from "../../../lib/animations";
```

**Props pattern** (if content is data-driven):
```typescript
interface {SceneName}Props {
  headline?: string;
  brandName?: string;
  ctaText?: string;
  logoUrl?: string;
  // ... other props
}

export const {SceneName}: React.FC<{SceneName}Props> = ({
  headline = "Default headline",
  // ... with defaults
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Component structure from guide */}
    </AbsoluteFill>
  );
};
```

**Animation helper examples** (from `src/lib/animations.ts`):
- `fadeIn(frame, startAt?, duration?)` — opacity 0→1
- `scaleIn(frame, fps, preset)` — spring-based scale entrance
- `slideIn(frame, fps, direction, preset)` — directional slide with spring
- `glowPulse(frame, speed?, min?, max?)` — oscillating value for drop-shadow blur
- `fadeInOut(frame, durationInFrames, fadeInDur?, fadeOutDur?)` — full lifecycle

---

### ✓ Step 5 — Generate `schema.ts` (if applicable)

**Analyze** whether the video content should be parameterizable:
- Is the headline/title editable per-render?
- Is the brand name/logo editable?
- Is the CTA text editable?
- Can images/video filenames be variable?

If YES to any: Generate a Zod schema.
If NO (fully static): Skip this file.

**Pattern** (from hello-world/schema.ts):
```typescript
import { z } from "zod";

export const {camelCaseSlug}Schema = z.object({
  headline: z.string().default("Build videos with code"),
  brandName: z.string().default("Acme"),
  ctaText: z.string().default("Get Started"),
  logoUrl: z.string().default("logo-placeholder.svg"),
  // ... other fields with .default() values
});

export type {CamelCaseSlug}Props = z.infer<typeof {camelCaseSlug}Schema>;
```

All fields must have `.default()` values for the Composition to work without props.

---

### ✓ Step 6 — Generate `Composition.tsx`

The main component that assembles all scenes via TransitionSeries.

**Pattern** (from hello-world/Composition.tsx):

```typescript
import { AbsoluteFill } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { fadePresentation, slidePresentation } from "../../../lib/transitions";
import { springTiming, linearTiming } from "../../../lib/transitions";
import { SfxLayer, MusicLayer } from "../../../lib/audio";
import { audioConfig } from "./audio.config";
import { config } from "./config";

// Scene imports
import { Intro } from "./scenes/Intro";
import { Main } from "./scenes/Main";
import { Outro } from "./scenes/Outro";

// Optional: type import if schema exists
import type { {CamelCaseSlug}Props } from "./schema";

export const {CamelCaseSlug}Composition: React.FC<{CamelCaseSlug}Props> = (props) => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Sequence 0 */}
        <TransitionSeries.Sequence durationInFrames={config.scenes.{role1}.duration}>
          <Intro {...props} />
        </TransitionSeries.Sequence>

        {/* Transition to Sequence 1 */}
        <TransitionSeries.Transition
          presentation={fadePresentation()}
          timing={springTiming(15)}
        />

        {/* Sequence 1 */}
        <TransitionSeries.Sequence durationInFrames={config.scenes.{role2}.duration}>
          <Main {...props} />
        </TransitionSeries.Sequence>

        {/* ... repeat for all sequences ... */}
      </TransitionSeries>

      {/* Audio layers */}
      <SfxLayer cues={audioConfig.sfx} />
      <MusicLayer
        src={audioConfig.music.src}
        source={audioConfig.music.source}
        volume={audioConfig.music.volume}
      />
    </AbsoluteFill>
  );
};
```

**Transition mapping**:
- sequences.json `transition: "fade"` → `fadePresentation()` + `springTiming(15)`
- sequences.json `transition: "slide"` → `slidePresentation("from-left")` + `springTiming(20)`
- sequences.json `transition: "wipe"` → `wipePresentation()` + `springTiming(25)`
- sequences.json `transition: "cut"` → NO TransitionSeries.Transition element (scenes are adjacent)

Always use `springTiming()` for motion-based transitions.

---

### ✓ Step 7 — Update `registry.ts`

**Read** `src/videos/registry.ts`

**Find or create** the entry for this video:
- If entry exists (from `/video-brief` scaffolding): Update it
- If entry doesn't exist: Create it before the `// NEW_VIDEO` marker

**Updated entry**:
```typescript
import { {CamelCaseSlug}Composition } from "./{slug}/Composition";
import { {camelCaseSlug}Schema } from "./{slug}/schema";
import { brand } from "../brand.config";

// In the videos array:
{
  id: "{slug}",
  title: "{title}",
  component: {CamelCaseSlug}Composition,
  durationInFrames: {totalFrames},
  fps: 30,
  schema: {camelCaseSlug}Schema,
  defaultProps: {camelCaseSlug}Schema.parse({
    headline: "Default headline for this video",
    brandName: brand.name,
    ctaText: brand.cta.text,
    logoUrl: brand.logo,
    // ... other defaults based on brand
  }),
},
```

If NO schema (fully static): Omit `schema` and `defaultProps` — the Composition doesn't accept props.

---

### ✓ Step 8 — Typecheck

Run: `npm run typecheck`

**If passes:**
- Display: "✓ TypeScript check passed"
- Proceed to **Step 9**

**If fails:**
- Read the error messages
- **Attempt auto-fix** (up to 3 rounds):
  - Fix obvious issues (missing imports, type mismatches, typos)
  - Re-run typecheck
  - Repeat until clean or unfixable
- If still failing after 3 rounds:
  - Display all remaining errors
  - Explain what manual fix is needed
  - Ask user to review and proceed

---

### ✓ Step 9 — Final Summary & Next Steps

Display:

```
✅ VIDEO ASSEMBLY COMPLETE
═══════════════════════════════════════════════════════════

Generated files:
  src/videos/{slug}/config.ts
  src/videos/{slug}/audio.config.ts
  src/videos/{slug}/schema.ts (if applicable)
  src/videos/{slug}/Composition.tsx
  src/videos/{slug}/scenes/
    ├─ Intro.tsx
    ├─ Main.tsx
    ├─ Outro.tsx
    └─ ... ({N} scene files)

Updated:
  src/videos/registry.ts

TypeScript check: ✓ PASS

═══════════════════════════════════════════════════════════

HOW TO PREVIEW YOUR VIDEO
═════════════════════════

1. Start the studio:
   npm run studio

2. Open http://localhost:3000 in your browser

3. Find "{slug}-landscape" (or -linkedin or -short) in the
   compositions list on the left

4. Hit the PLAY button to see your video!

═══════════════════════════════════════════════════════════

HOW TO GENERATE VOICEOVER AUDIO
════════════════════════════════

Your audio.config.ts has {N} voiceover segments ready.
To generate audio with ElevenLabs:

  npm run generate:voiceover -- {slug}

Requirements:
  - Set ELEVENLABS_API_KEY in your .env file
  - Get a free key from https://elevenlabs.io

Generated files will go to:
  public/audio/voiceover/{slug}/

═══════════════════════════════════════════════════════════

HOW TO RENDER (EXPORT MP4)
══════════════════════════

Single format:
  npm run render -- {slug}-landscape out/{slug}-landscape.mp4
  npm run render -- {slug}-short out/{slug}-short.mp4
  npm run render -- {slug}-linkedin out/{slug}-linkedin.mp4

Or render all formats at once:
  npm run render:all

Output files go to: out/

═══════════════════════════════════════════════════════════

HOW TO ADD STOCK ASSETS
═══════════════════════

If you need to add images, videos, or Lottie animations:

1. Search for stock assets:
   search_stock_images "office worker typing"
   search_stock_videos "nature landscape"
   (Uses Stocky MCP)

2. Download:
   download_image / download_video

3. Place in public/images/ or public/videos/

4. Reference in scene component:
   <Img src={staticFile("images/office-worker.jpg")} />
   <OffthreadVideo src={staticFile("videos/nature.mp4")} />

═══════════════════════════════════════════════════════════

NEXT: Ready to preview!
───────────────────────
npm run studio
```

**Update** `src/videos/{slug}/.prod/metadata.json`:
- Set `status` to `"assembled"`
- Add `assembledAt: "[today ISO date]"`

---

## Key Behaviors

**All sequences must be approved.** Do not generate code if any sequence is still pending.

**Relative imports ONLY.** Enforce no `@/` alias in generated code.

**extrapolateLeft: "clamp" on all interpolate calls.** This is a critical pattern from CLAUDE.md.

**Springs, not trig functions.** Use `spring()` for organic motion, never `Math.sin`.

**Colors and fonts from imports.** Never hardcode hex values or font-family strings.

**Frame numbers are relative.** Each scene's frames start at 0.

**SFX available files only.** `whoosh`, `success-ding`, `notif-chime`, `keypress`, `recording-beep`, `typing`.

---

## Summary

This skill generates:
- `src/videos/{slug}/config.ts` — frame timings
- `src/videos/{slug}/audio.config.ts` — voiceover + SFX + music
- `src/videos/{slug}/schema.ts` — (if applicable) Zod schema for props
- `src/videos/{slug}/Composition.tsx` — main assembly
- `src/videos/{slug}/scenes/*.tsx` — one per sequence
- Updated `src/videos/registry.ts`
- Updated `.prod/metadata.json`

After this: `npm run studio` to preview, `npm run generate:voiceover -- {slug}` for audio, `npm run render -- {slug}-{format} out/video.mp4` to export.
