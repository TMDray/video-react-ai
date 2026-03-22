# Video Brief, Script & Scaffolding

## What this skill does

Creates a new video from scratch by:
1. Collecting a brief (what, where, how long, why)
2. Generating a complete script with scenes, voiceover, SFX
3. Breaking the script into frame-accurate sequences
4. Scaffolding the video folder and creating a production notebook

Each step is validated before moving to the next. The script is **iterated until approved** — I'll re-generate it after each of your revisions until you explicitly say 'yes'.

**When to use**: Run `/video-brief` to create each new video. Run `/brand-setup` first if you haven't set up brand guidelines.

---

## Execution Plan

### ✓ Step 0 — Check Brand Guidelines

**Read** `.prod/brand-guidelines/metadata.json` (if it exists)

If it exists:
- Read the full brand brief, mood, and aesthetics
- Display: "Brand guidelines loaded: {company name}"
- Proceed to **Step 1**

If NOT found:
- Warn: "⚠️ No brand guidelines found. It's recommended to run `/brand-setup` first so your video inherits your brand identity, colors, and tone."
- Ask: "Would you like to (1) run brand-setup first, or (2) continue without brand guidelines using project defaults?"
- **STOP** — wait for response
- If they choose (1): Suggest running `/brand-setup` now
- If they choose (2): Note in the production notebook: "Created without brand guidelines — used src/brand.config.ts defaults"
- Proceed to **Step 1**

---

### ✓ Step 1 — Video Brief

Ask all these questions in ONE group:

"Let's define your video. Answer as much or as little as you like — I'll help fill in the gaps."

1. **What is this video about?** (1-2 sentences — the core topic/subject)
2. **What platform is this for?** (LinkedIn / TikTok / YouTube Shorts / Instagram Reels / YouTube / Other?)
3. **How long?** (15s / 30s / 60s / 90s — or your own estimate)
4. **What is the ONE goal of this video?** (What should viewers do? Feel? Understand? E.g., "Sign up for free trial", "Understand the problem", "Feel inspired")
5. **Who is the target audience?** (Can be "same as brand" if you set up brand guidelines — or be specific, e.g., "CTOs at tech companies")
6. **Narrative framework preference?** Choose from:
   - **PAS** = Problem → Agitate → Solution (best for marketing/product)
   - **BAB** = Before → After → Bridge (best for transformations)
   - **AIDA** = Attention → Interest → Desire → Action (best for ads)
   - **Free** = I'll structure it naturally based on the topic
   - **Let Claude decide** = I'll pick what fits best
7. **Any specific content, stats, or key messages?** (E.g., "mention our new AI feature", "include stat: 500K users", "focus on sustainability")
8. **What video slug?** (URL-safe ID like `product-launch-q1` or `customer-story-acme`. If unsure, I can suggest one)

**STOP** — wait for all 8 answers

**Validation checkpoint — BRIEF:**

Display formatted summary:
```
VIDEO BRIEF
═══════════════════════════════════════════
Slug:        {slug}
Subject:     {subject}
Platform:    {platform}
Duration:    {duration}
Objective:   {objective}
Audience:    {audience}
Framework:   {framework}
Key content: {key messages}
```

Ask: "Does this brief look correct? Type 'yes' to generate the script, or tell me what to adjust."

**STOP** — wait for explicit 'yes' before continuing. Do NOT generate the script until confirmed.

---

### ✓ Step 2 — Script Generation

Once the brief is confirmed, generate a complete **VideoScript** object applying these retention rules from CLAUDE.md:

**Retention rules to apply:**
- First scene MUST be role "hook" with duration 3s or less
- Hook should have a strong visual or surprising statement — NO logo intro
- Scene count:
  - 15s: 3 scenes (hook + content + cta)
  - 30s: 4-5 scenes (hook + problem + solution + cta, with optional pattern-break)
  - 60s: 5-7 scenes (hook + problem + agitate + solution + demo/proof + cta)
  - 90s: 6-8 scenes
- Text overlay: max 7 words per line
- Voiceover pacing: ~2.5 words per second (total words / duration in seconds should be ~2-3)
- Include SFX cues: `whoosh` on transitions, `success-ding` or `notif-chime` on key reveals
- Pattern interrupts every 3-5s (new visual, text change, SFX, color shift, zoom)
- Silence before key phrases: 1-2s to create "spotlight"

**Generate the script in HUMAN-READABLE format (NOT raw TypeScript):**

```
GENERATED SCRIPT: "{title}"
Platform: {platform} | Duration: {duration} | Framework: {framework}
Music: {music mood from brand, if available}
Voice: {voice style from brand, if available}
══════════════════════════════════════════════════════════════════════

SCENE 1 — HOOK (3s, 0 words VO + visual)
Visual:      {visual description, strong opening image/action}
Voiceover:   "{voiceover text}" (~{word count} words, {duration}s)
Text overlay: "{max 7 words}" {position: top/center/bottom}
SFX:         {whoosh | none}
Transition:  {fade | slide | cut} (exit TO scene 2)

SCENE 2 — {ROLE} ({duration}s)
[similar structure...]

[Continue for all scenes...]
```

After presenting the script, ask:

"Does this script work for your video?

Options:
- Type 'yes' to approve and continue to sequence planning
- Tell me specific changes (e.g., 'make the hook more aggressive', 'remove scene 3', 'make the CTA text "Sign up free"')
- Type 'regenerate' to get a completely different approach"

**STOP** — wait for response

**If they make changes:**
- Apply the requested modifications
- Re-present the ENTIRE updated script in the same human-readable format
- Ask again: "Better? Type 'yes' to approve, or tell me what else to change"
- **STOP** and iterate until they explicitly type 'yes'

**Do NOT proceed to Step 3 until they type 'yes' or equivalent explicit approval.**

---

### ✓ Step 3 — Sequence Breakdown

Once the script is approved, translate it into a **frame-accurate sequence breakdown**.

Using fps=30 (standard):
- 1 second = 30 frames
- Transition overlap = 15 frames (0.5s) between adjacent scenes
- `fromFrame` calculation: each scene starts where the previous ended, minus the overlap

**Frame math formula:**
```
totalFrames = sum(all durationInFrames) - ((numSequences - 1) * 15)
fromFrame[N] = fromFrame[N-1] + durationInFrames[N-1] - 15
```

**Present as a timing table:**

```
SEQUENCE BREAKDOWN
═══════════════════════════════════════════════════════════
Video: {slug} — "{title}"
FPS: 30 | Total: {totalFrames} frames ({durationSeconds}s)
Transition: 15 frames (0.5s fade overlap between each scene)

Seq  Role         From    Dur    Time
───  ────────     ─────   ────   ────────
0    hook         0       90     0s → 3s
1    problem      75      120    2.5s → 6.5s    [15f overlap]
2    solution     195     150    6.5s → 11.5s   [15f overlap]
3    cta          330     120    11s → 15s      [15f overlap]

TOTAL COMPOSITION: {totalFrames} frames @ 30fps = {duration}s

─────────────────────────────────────────────────────────────

AUDIO CUE SHEET — SFX:
  Frame 88:   whoosh (duration: 20f, volume: 0.3)
  Frame 193:  whoosh (duration: 20f, volume: 0.3)
  Frame 328:  success-ding (duration: 30f, volume: 0.4)

───────────���─────────────────────────────────────────────────

VOICEOVER SEGMENTS (to be generated with ElevenLabs):
  01-hook     (0→90f):     "{voiceover text}" (~{N} words, ~{Xs})
  02-problem  (75→195f):   "{voiceover text}"
  03-solution (195→330f):  "{voiceover text}"
  04-cta      (330→450f):  "{voiceover text}"

═════════════════════════════════════════════════════════════
```

After presenting the breakdown, ask:

"Does this sequence breakdown look right? Check:
- Are the timings accurate? (Do the 'Time' columns make sense?)
- Are scene durations reasonable?
- Do SFX cues land at the right moments?
- Do voiceover segments make sense?

Type 'yes' to scaffold the video folder, or tell me what to adjust."

**STOP** — wait for explicit 'yes'

**If they adjust:**
- Modify the affected sequences
- Re-present the updated table
- Ask again until 'yes'

---

### ✓ Step 4 — Scaffold & Save

Once sequences are confirmed:

Ask: "I'm about to run `npm run new-video -- {slug} \"{title}\"` to create the file structure. This will create `src/videos/{slug}/` with template files (Composition.tsx, config.ts, audio.config.ts, scenes/). Ready?"

**STOP** — wait for confirmation

Run the command: `npm run new-video -- {slug} "{title}"`

If successful, confirm:
```
✅ Video folder created: src/videos/{slug}/

Files scaffolded:
  - Composition.tsx
  - config.ts
  - audio.config.ts
  - schema.ts
  - scenes/Intro.tsx, Main.tsx, Outro.tsx
  - public/audio/voiceover/{slug}/ (empty directory)
```

Then write the production notebook:

**Create directory**: `src/videos/{slug}/.prod/`

**Write** `src/videos/{slug}/.prod/metadata.json`:
```json
{
  "slug": "{slug}",
  "title": "{title}",
  "platform": "{platform}",
  "duration": "{duration}",
  "durationSeconds": {durationSeconds},
  "fps": 30,
  "totalFrames": {totalFrames},
  "createdAt": "[today ISO date]",
  "status": "scripted",
  "sequencesTotal": {numSequences},
  "sequencesApproved": 0,
  "brandGuidelinesUsed": [true/false]
}
```

**Write** `src/videos/{slug}/.prod/brief.md`:
```markdown
# Video Brief: {title}

**Video ID**: {slug}
**Platform**: {platform}
**Duration**: {duration}
**Target Audience**: {audience}

## Objective
{objective}

## Key Messages
{key messages or "none specified"}

## Narrative Framework
{framework}

---

*Created: [date]*
```

**Write** `src/videos/{slug}/.prod/script.md`:
Full human-readable script from Step 2 (copy-paste the formatted script)

**Write** `src/videos/{slug}/.prod/sequences.json`:
```json
[
  {
    "index": 0,
    "id": "hook",
    "role": "hook",
    "fromFrame": 0,
    "durationInFrames": 90,
    "durationSeconds": "3s",
    "timeRange": "0s → 3s",
    "visual": "{visual description}",
    "voiceover": "{voiceover text}",
    "voiceoverWordCount": {N},
    "textOverlay": "{max 7 words or empty}",
    "sfx": ["whoosh"],
    "transition": "fade",
    "notes": "",
    "status": "pending"
  },
  [... repeat for each sequence ...]
]
```

After saving, display:
```
✅ PRODUCTION NOTEBOOK CREATED
═══════════════════════════════════════════════════════════

Location: src/videos/{slug}/.prod/

Files created:
  - metadata.json (project metadata)
  - brief.md (video brief)
  - script.md (full approved script)
  - sequences.json (frame breakdown + audio cues)

Status: {numSequences} sequences pending approval

═════════════════════════════════════════════════════════════

NEXT STEPS:
──────────

1. Implement each sequence:
   /sequence-guide {slug} 0   → Hook scene
   /sequence-guide {slug} 1   → Problem scene
   /sequence-guide {slug} 2   → Solution scene
   ...etc (one at a time, in any order)

2. When all {numSequences} sequences are approved, assemble the video:
   /video-assemble {slug}

3. Then generate voiceover:
   npm run generate:voiceover -- {slug}

4. Preview in studio:
   npm run studio

5. Render to MP4:
   npm run render -- {slug}-landscape out/{slug}.mp4
```

---

## Key Behaviors

**Do NOT generate the script until the brief is confirmed.**

**Re-generate the script for each revision.** Show the full revised script, not just the changes. This lets the user see the whole picture.

**Iterate until 'yes'.** Do not skip the iteration loop. If they ask for changes, re-present and re-ask.

**Frame math must be correct.** Double-check `fromFrame` calculations with the overlap formula.

**Use CLAUDE.md retention rules.** Hook within 3s, pattern breaks every 3-5s, max 7-word text, ~2.5 wps pacing.

**Sequence status starts as 'pending'.** Only `/sequence-guide` updates it to 'approved'.

---

## Summary

This skill produces:
- `.prod/videos/{slug}/metadata.json` — project metadata
- `.prod/videos/{slug}/brief.md` — video brief
- `.prod/videos/{slug}/script.md` — approved script
- `.prod/videos/{slug}/sequences.json` — frame breakdown + approval tracking
- Scaffolded folder: `src/videos/{slug}/` (via npm run new-video)

Next: Run `/sequence-guide {slug} 0` to implement the first sequence.
