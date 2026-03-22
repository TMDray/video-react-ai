# Caption & Subtitle Generation

## What this skill does

Creates SRT subtitle files for your video voiceover:
1. **Verify setup**: Checks that voiceover MP3s exist
2. **Choose method**: Transcribe via ElevenLabs or manual from script
3. **Generate SRT**: Creates `public/subs/{slug}/captions.srt` with proper timing
4. **Configure in code**: Shows how to add `<SubtitleLayer>` to Composition.tsx

Critical for video quality: **85% of viewers watch without sound** — subtitles increase retention by 12%.

**When to use**: Run `/generate-captions {slug}` after voiceover is generated and before rendering. SRT timing is automatically synced to your sequence frame data.

---

## Execution Plan

### ✓ Step 0 — Pre-flight Checks

**Read**:
- `src/videos/{slug}/.prod/sequences.json` (exists?)
- `public/audio/voiceover/{slug}/` directory (MP3s exist?)

**Check 1 — Video structure exists**:
- If `src/videos/{slug}/` does NOT exist: "❌ Video not found. Run `/video-brief {slug}` first."
- If `.prod/sequences.json` does NOT exist: "❌ Production notebook not found. Run `/video-brief {slug}` first."
- **STOP**

**Check 2 — Voiceover exists**:
- List MP3 files in `public/audio/voiceover/{slug}/`
- If NO MP3s found:
  - Display:
    ```
    ❌ No voiceover files found for "{slug}"

    Generate voiceover first:
      npm run generate:voiceover -- {slug}

    Then return here and run:
      /generate-captions {slug}
    ```
  - **STOP**

If all checks pass:
- Read sequences.json
- Display: "✅ Found {N} voiceover segments, {N} MP3 files"
- Proceed to **Step 1**

---

### ✓ Step 1 — Choose Transcription Method

Ask (STOP after):

```
How would you like to create captions?

(A) **Auto-transcribe via ElevenLabs**
   - Uses the same API key as voiceover generation
   - Accurate speech-to-text alignment
   - Automatic timing sync to your sequence frames
   - Best for: Professional, accurate, automated

(B) **Manual transcription**
   - Use the voiceover text already in your script
   - You edit/correct if needed
   - I'll sync timing to your sequence frames automatically
   - Best for: Quick turnaround, when script matches audio

(C) **Skip for now**
   - Add captions manually later
   - You can always run this command again

Choose: (A/B/C)
```

**STOP** — wait for response

---

### ✓ Step 2A — If ElevenLabs Auto-Transcribe

**Prerequisites**:
- `ELEVENLABS_API_KEY` in .env
- ElevenLabs account with credits

**Process**:

1. Display progress:
   ```
   Transcribing {N} voiceover segments via ElevenLabs...
   ```

2. For each MP3 in `public/audio/voiceover/{slug}/`:
   - Call ElevenLabs Speech-to-Text API on the MP3 file
   - Parse response to get transcribed text
   - Match to corresponding sequence in sequences.json (by segment ID)
   - Extract timings from sequences.json:
     - `fromFrame` → start time in SRT (frames / 30 fps / 1000 = ms)
     - `toFrame` → end time in SRT

3. If any transcription fails:
   - Display error: `"❌ Transcription failed for {segment_id}: {error}"`
   - Ask: "Fall back to manual mode for remaining segments? (yes/no)"
   - **STOP** — if yes, switch to Step 2B for remaining segments

4. If all succeed:
   - Proceed to **Step 3**

---

### ✓ Step 2B — If Manual Transcription

**Process**:

1. Read voiceover text from sequences.json
2. Display for review:
   ```
   VOICEOVER SCRIPT (from your sequences):
   ════════════════════════════════════

   Segment 0 (0:00 - 3:00):
   "Your intro text here"

   Segment 1 (3:00 - 11:30):
   "Main content text here"

   ...

   Does this match what you hear in the MP3s?
   (yes / make corrections)
   ```

   **STOP** — wait for response

3. If "make corrections":
   - Ask: "For which segment? (0/1/2/...)"
   - **STOP** — wait for segment number
   - Ask: "New text for segment {N}?"
   - **STOP** — wait for corrected text
   - Update the text in sequences.json equivalent
   - Loop back to Step 2B.2 to show updated script

4. If "yes":
   - Proceed to **Step 3**

---

### ✓ Step 3 — Generate SRT File

**SRT Format Reference**:
```
1
00:00:00,000 --> 00:00:03,500
Your subtitle text here

2
00:00:03,500 --> 00:00:11,300
Next subtitle text
```

**Generation**:

1. Create SRT content from:
   - Voiceover text (from sequences.json or manual input)
   - Timings from sequences.json `fromFrame` + `toFrame`
   - Frame-to-time conversion: `frame / 30fps = seconds`
   - Format: `HH:MM:SS,mmm` (hours:minutes:seconds,milliseconds)

2. Create directory if needed:
   ```
   public/subs/{slug}/
   ```

3. Write `public/subs/{slug}/captions.srt`

4. Display preview:
   ```
   ✅ SRT GENERATED
   ═════════════════════════════════════

   File: public/subs/{slug}/captions.srt

   Preview (first 3 entries):
   ─────────────────────────────────
   1
   00:00:00,000 --> 00:00:03,500
   {text}

   2
   00:00:03,500 --> 00:00:11,300
   {text}

   ... ({total} entries total)
   ```

5. Ask: "Looks good? (yes / regenerate)"
   - **STOP** — if no, return to Step 2B for corrections

---

### ✓ Step 4 — Optional: Translate Captions

Ask:

```
Would you like to translate captions to another language?

(Y)es — Translate to another language
(N)o — Done with captions

Choose: (Y/N)
```

**STOP** — if yes:

- Ask: "Which language? (e.g., 'French', 'Spanish', 'German')"
- **STOP** — wait for response
- Suggest command:
  ```
  npm run translate:srt -- public/subs/{slug}/captions.srt {language_code}
  ```
  Example:
  ```
  npm run translate:srt -- public/subs/my-video/captions.srt fr
  ```
  Output: `public/subs/{slug}/captions.fr.srt`

---

### ✓ Step 5 — Configure in Composition

Display how to add captions to your video:

```typescript
// src/videos/{slug}/Composition.tsx

import { AbsoluteFill } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { SubtitleLayer } from "../../../lib/captions";  // ← Add this import
import { SfxLayer, MusicLayer } from "../../../lib/audio";
// ... other imports

export const {CamelCaseSlug}Composition: React.FC<{CamelCaseSlug}Props> = (props) => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* ... scenes ... */}
      </TransitionSeries>

      <SfxLayer cues={audioConfig.sfx} />
      <MusicLayer src={...} />

      {/* ← Add SubtitleLayer */}
      <SubtitleLayer src="subs/{slug}/captions.srt" />
    </AbsoluteFill>
  );
};
```

**Customization options** (optional):

```tsx
// Adjust font size (default: 68px)
<SubtitleLayer src="subs/{slug}/captions.srt" style={{ fontSize: 54 }} />

// Adjust combine threshold (default: 1200ms groups texts within this window)
<SubtitleLayer src="subs/{slug}/captions.srt" combineTokensWithinMs={800} />
```

---

### ✓ Step 6 — Summary & Next Steps

Display:

```
✅ CAPTIONS GENERATED
═════════════════════════════════════════════════════

SRT file: public/subs/{slug}/captions.srt
Entries: {N} subtitles
Method: {ElevenLabs transcription | Manual}
Languages: English {+ {other languages}}

Composition.tsx updated with:
  <SubtitleLayer src="subs/{slug}/captions.srt" />

═════════════════════════════════════════════════════

BENEFITS:
─────────
✓ +12% viewer retention (85% watch without sound)
✓ Accessible (captions for hearing impaired)
✓ SEO-friendly (YouTube auto-indexes captions)
✓ Multi-language support (translate with /translate:srt)

NEXT STEPS:
──────────
Preview in studio:
  npm run studio

Render video:
  npm run render -- {slug}-landscape out/{slug}.mp4

The SubtitleLayer will sync automatically with your timeline!
```

---

## Key Behaviors

**STOP at validation points**:
- After transcription method choice (Step 1)
- After manual text review/correction (Step 2B)
- Before saving SRT (Step 3)
- After SRT generation (ask about translation)

**Automatic timing sync**:
- SRT times come from sequences.json `fromFrame`/`toFrame`
- Frame numbers are converted to SRT time format (MM:SS,mmm)
- No manual timing adjustments needed

**Error recovery**:
- If transcription fails on one segment, offer fallback to manual
- If user makes corrections in Step 2B, regenerate SRT with updated text

---

## Technical Notes

**SRT Time Format**:
```
Frame number to time: time_seconds = frame_number / fps
Example: frame 90 @ 30fps = 90/30 = 3 seconds = 00:00:03,000
Example: frame 450 @ 30fps = 450/30 = 15 seconds = 00:00:15,000
```

**SubtitleLayer rendering** (from `src/lib/captions.tsx`):
- Active word: highlighted in `colors.primary` (from brand config) with scale effect
- Inactive words: white text with drop shadow
- Font: `fontHeading` from brand config
- Position: bottom of frame (paddingBottom: 140px)
- Groups text within `combineTokensWithinMs` window (default 1200ms)

---

## Summary

This skill produces:
- `public/subs/{slug}/captions.srt` — subtitle file with accurate timing
- Updated `Composition.tsx` with `<SubtitleLayer>` import and usage
- Optional translated SRT files (`captions.{lang}.srt`)

Next: Preview in studio with `npm run studio`, render with `npm run render`.
