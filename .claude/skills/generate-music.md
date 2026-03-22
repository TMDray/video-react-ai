# Music Selection & Setup

## What this skill does

Guides you through choosing and setting up background music for your video:
1. **Choose the source**: Suno (generate AI music, paid) or Jamendo (search royalty-free music, free)
2. **Generate or search**: Use MCP tools to find or create music
3. **Configure in audio.config.ts**: Integrate the music into your voiceover/SFX layers

This skill does NOT generate code — it guides you through music selection and shows how to configure `audio.config.ts`.

**When to use**: Run `/generate-music {slug}` after setting up brand guidelines and before running `/video-assemble`. Music should match the brand mood + video tone.

---

## Execution Plan

### ✓ Step 0 — Check brand mood

**Read**:
- `.prod/brand-guidelines/mood.json` (if exists)

If no brand guidelines exist:
- Warn: "No brand guidelines found. Recommended to run `/brand-setup` first for consistent music mood."
- Ask: "Continue with project defaults? (yes/no)"
- **STOP** — wait for response

If exists:
- Read `musicMood` from brand guidelines
- Display: "Brand music mood: {musicMood}"
- Proceed to **Step 1**

---

### ✓ Step 1 — Choose Source

Ask (STOP after):

"How would you like to add music to your video?

(A) **Suno AI** — Generate original music with AI (powered by Suno API)
   - Cost: ~6 credits per generation (~$0.30-1.00)
   - Time: ~1 min to generate
   - Result: 2 variations of original music
   - Best for: Custom, unique music matching your exact mood

(B) **Jamendo** — Search royalty-free music library (free)
   - Cost: Free (Creative Commons license)
   - Time: Instant search
   - Result: Browse 100K+ tracks
   - Best for: Quick, affordable, licensed music
   - Requires: Attribution link to Jamendo track

(C) **Skip for now** — Add music manually later

Choose: (A/B/C)"

**STOP** — wait for response

---

### ✓ Step 2A — If Suno: Generate Music

**Prerequisites**:
- `SUNO_API_KEY` in .env (payant, get from https://sunoapi.org)
- Credits remaining in account

**Process**:

1. Display the brand `musicMood` as suggestion:
   ```
   Brand music mood: {musicMood}

   Example Suno prompts for this mood:
   - If "upbeat corporate 120bpm": "Upbeat corporate background music, electric piano, drums, 120bpm, energetic"
   - If "lo-fi chill 80bpm": "Lo-fi hip-hop chill beats, ambient, 80bpm, relaxing"
   ```

2. Ask (STOP):
   ```
   Use the suggested prompt, or provide your own?

   (S) Use suggested
   (C) Custom prompt

   Choose: (S/C)
   ```

3. If custom:
   - Ask: "Describe the music you want (mood, instruments, BPM, style)"
   - **STOP** — wait for user input

4. Call Suno MCP `generate_music`:
   ```json
   {
     "prompt": "{user_prompt_or_suggested}",
     "model_version": "v5",
     "make_instrumental": true,
     "custom_mode": false,
     "wait_audio": true
   }
   ```

5. Present results:
   ```
   Generated 2 variations:

   Variation 1:
     Title: {title}
     Duration: {duration}
     Preview: {url}

   Variation 2:
     Title: {title}
     Duration: {duration}
     Preview: {url}

   Which one would you like? (1/2/neither)
   ```

   **STOP** — wait for response

6. If neither:
   - Ask: "Try again with different prompt? (yes/no)"
   - **STOP** — loop back to Step 2A.3 if yes, else Step 3 if no

7. If chosen (1 or 2):
   - Confirm track ID and download link
   - Optional: "Convert to WAV for better quality? (yes/no)"
   - If yes: Call `convert_to_wav`, wait for completion, get WAV URL
   - Download MP3 or WAV to `public/audio/music/{title}.{mp3|wav}`
   - Note: Manual download required from Suno (no direct download via MCP)
   - Proceed to **Step 3**

---

### ✓ Step 2B — If Jamendo: Search Music

**Prerequisites**:
- `JAMENDO_API_KEY` in .env (free, get from https://www.jamendo.com/developers)

**Process**:

1. Suggest search queries based on brand mood:
   ```
   Brand music mood: {musicMood}

   Suggested searches:
   - If "upbeat corporate": "corporate background, business, upbeat"
   - If "lo-fi chill": "lo-fi, ambient, chill, relax"
   ```

2. Ask (STOP):
   ```
   Use a suggested search, or provide your own keywords?

   (S) Use suggested
   (C) Custom search

   Choose: (S/C)
   ```

3. If custom:
   - Ask: "Search keywords? (e.g., 'ambient electronic', 'cinematic orchestra')"
   - **STOP** — wait for input

4. Call Jamendo MCP `search_music`:
   ```json
   {
     "query": "{search_keywords}",
     "limit": 10
   }
   ```

5. Present results as a numbered list:
   ```
   Jamendo search results (first 10):

   1. Title: {title}
      Artist: {artist}
      Duration: {duration}
      Genre: {genre}
      License: CC {license_type}

   2. Title: ...
   ...

   Which one? (1-10 / search again / skip)
   ```

   **STOP** — wait for response

6. If search again:
   - Loop back to Step 2B.3

7. If skip:
   - Proceed to **Step 3**

8. If chosen (1-10):
   - Call `get_track_info` to get download details
   - Display:
     ```
     Selected: {title} by {artist}

     License: {license_type}
     Duration: {duration}
     Download link: {url}

     ⚠️  Manual download required:
     1. Open the link above in your browser
     2. Download the MP3
     3. Place in: public/audio/music/{filename}.mp3
     4. Return here when done.

     Ready? (yes)
     ```
   - **STOP** — wait for confirmation
   - Proceed to **Step 3**

---

### ✓ Step 2C — If Skip

Proceed directly to **Step 3** with note:
```
Skipped music setup. You can add music later by:
1. Placing an MP3 in public/audio/music/
2. Updating audio.config.ts (see Step 3 below)
```

---

### ✓ Step 3 — Configure audio.config.ts

Display how to set up the music in the video:

```typescript
// src/videos/{slug}/audio.config.ts

import type { AudioConfig } from "../../lib/types";

export const audioConfig: AudioConfig = {
  voiceover: {
    // ... voiceover segments
  },
  sfx: [
    // ... SFX cues
  ],
  music: {
    source: "file",
    src: "audio/music/{filename}.mp3",  // ← Path to your music file
    volume: 0.08,                        // ← Adjust 0.0-1.0 (0.08 = quiet background)
  },
};
```

**Options**:
- `volume: 0.05-0.10` for background music (doesn't overpower voiceover)
- `volume: 0.15-0.25` for instrumental videos (no voiceover)
- `volume: 0.30+` for music-focused videos (intro/outro)

Ask: "Want to adjust the volume? (yes / keep 0.08 as default)"

**STOP** — if yes, ask for new volume value

---

### ✓ Step 4 — Summary & Next Steps

Display:

```
✅ MUSIC CONFIGURED
═════════════════════════════════════════════════════

Music file: {filename}.mp3
Location: public/audio/music/{filename}.mp3
Volume: {volume}
License: {license type, or "None (custom AI)"}

audio.config.ts updated with:
  music: {
    source: "file",
    src: "audio/music/{filename}.mp3",
    volume: {volume}
  }

═════════════════════════════════════════════════════

NEXT STEPS:
──────────
If you haven't already:
  /sequence-guide {slug} 0  (implement first sequence)
  /sequence-guide {slug} 1  (implement next sequence)
  ... repeat for all sequences

When all sequences approved:
  /video-assemble {slug}    (generate all code)

Then preview:
  npm run studio
```

---

## Key Behaviors

**STOP at every decision point** — user chooses source, selects track, confirms download, adjusts volume.

**No code generation** — this skill only guides music selection and shows how to configure `audio.config.ts` manually.

**Manual downloads** — Suno and Jamendo don't support direct download via MCP; user must download via browser and place in `public/audio/music/`.

**Attribution** — If using Jamendo, include link to track in video description (Creative Commons requirement).

---

## Summary

This skill produces:
- Chosen music file in `public/audio/music/`
- Updated `audio.config.ts` with music configuration
- Instructions for next steps (sequence-guide → video-assemble)

Next: Implement sequences with `/sequence-guide {slug} 0`, or add captions with `/generate-captions {slug}`.
