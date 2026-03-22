# Sequence Implementation Guide

## What this skill does

For **ONE sequence at a time**, this skill:
1. Validates the sequence against retention rules (PASS/WARN/FAIL)
2. Scans existing video components for reference patterns
3. Plans assets needed (stock video, images, Lottie, SFX)
4. Proposes component structure in pseudocode
5. Gets your approval before writing any code

You decide the pacing — do one sequence, then decide if you want to do the next.

**When to use**: Run `/sequence-guide {slug} {index}` after running `/video-brief`. Do this for each sequence (0, 1, 2, etc.) until all are approved.

**Example**: `/sequence-guide product-launch 0` (implements hook sequence for "product-launch" video)

---

## Execution Plan

### ✓ Step 0 — Load Context

**Read**:
- `src/videos/{slug}/.prod/metadata.json` — video metadata
- `src/videos/{slug}/.prod/sequences.json` — all sequence data
- `src/videos/{slug}/.prod/script.md` — full script context

**Validate**:
- Does `src/videos/{slug}/` exist? If no: "Video folder not found. Run `/video-brief {slug}` first."
- Does sequence at index `{index}` exist? If no: "Sequence {index} not found. Video has {total} sequences (0 to {total-1})."
- Is the sequence status?
  - If `"approved"`: Ask "Sequence {index} ({role}) is already approved. Review it? (yes/no)"
  - If `"pending"`: Proceed to Step 1

**Display the sequence**:
```
SEQUENCE {index} OF {total-1}: {ROLE}
Video: {slug} — "{title}"
══════════════════════════════════════

Duration:     {durationInFrames} frames ({durationSeconds})
From frame:   {fromFrame}
Visual:       {visual}
Voiceover:    "{voiceover}" (~{wordCount} words)
Text overlay: "{textOverlay}" ({wordCount} words)
SFX:          {sfx list or "none"}
Transition:   {transition} (entering this scene)
```

---

### ✓ Step 1 — Retention Rules Checklist

Run automated checks:

```
RETENTION RULES CHECK
═══════════════════════════════════════════════════════════
```

**For EVERY sequence:**

- [PASS/WARN/FAIL] **Text overlay word count**: Max 7 words
  - FAIL if ≥ 10 words
  - WARN if 8-9 words
  - PASS if ≤ 7 words
  - Show: "{wordCount} words OK" or "{wordCount} words — too long!"

- [PASS/WARN/FAIL] **Voiceover pacing**: Should be ~2.5 words/second
  - Calculate: voiceoverWordCount / (durationInFrames / 30)
  - FAIL if < 1.5 or > 3.5 words/sec
  - WARN if 1.5-2 or 3-3.5 words/sec
  - PASS if 2-3 words/sec
  - Show: "{wps} words/sec — OK" or "{wps} words/sec — too fast/slow"

- [PASS/NOTE] **SFX on transitions?** If transition is not "cut" and sfx list is empty:
  - NOTE: "No SFX on this transition. Consider adding whoosh or similar."

**For sequence index 0 (hook) ONLY:**
- [PASS/FAIL] **Hook within 3s?**
  - FAIL if durationSeconds > 3s
  - PASS if ≤ 3s

- [PASS/WARN] **Hook visual is strong?** Check if visual description starts with action/surprise, not logo/intro:
  - FAIL if visual includes "logo intro" or "title card"
  - WARN if visual is passive (e.g., "background gradient")
  - PASS if visual is active/surprising (e.g., "dramatic zoom", "stat appears", "problem shown")

**For sequences at ~50% duration (e.g., 15s mark in 30s video):**
- [NOTE] **Pattern break opportunity**: "This is a re-engagement point. Consider a visual shift, zoom, or color change here."

**For the last sequence (role == "cta"):**
- [PASS/WARN] **CTA has action verb?** Check voiceover text for verb like "click", "sign up", "learn", "join":
  - WARN if no clear action verb
  - PASS if action verb present

**Display results:**
```
CHECKS PASSED:   {N}
CHECKS WARNED:   {N}
CHECKS FAILED:   {N}
```

**If ANY FAIL items:**
- Display: "❌ There are {N} blocking issues to resolve."
- List each FAIL
- Ask: "Would you like to (1) adjust the sequence definition now, or (2) override and continue anyway? (1/2)"
- **STOP** — wait for response
- If they choose (1): They need to go back and edit sequences.json manually, then restart this skill
- If they choose (2): Note the overrides and continue to Step 2

**If only WARN/NOTE items:**
- Display: "✓ Sequence passes, with {N} notes"
- Continue automatically to Step 2

---

### ✓ Step 2 — Reference Pattern Scan

Look at existing scenes to find patterns for this sequence role.

**Read**:
- `src/videos/hello-world/scenes/Intro.tsx`
- `src/videos/hello-world/scenes/Main.tsx`
- `src/videos/hello-world/scenes/Outro.tsx`
- `src/videos/_template/scenes/Intro.tsx`
- `src/lib/animations.ts` (for animation helpers)
- `src/lib/transitions.ts` (for transition options)

**Match the sequence role to existing patterns:**

```
REFERENCE COMPONENTS
════════════════════════════════════════════════════════════

Your sequence role: {role}

Best match: {component file path}
  Pattern: {description}
  Why: {reason it's a good fit}

Other references:
  - {other component} — {why useful}
  - {other component} — {why useful}
```

**Common mappings:**
- `hook` → `hello-world/Intro.tsx` (spring scale + fadeIn + glow effect)
- `cta` → `hello-world/Outro.tsx` (fadeInOut container + button styling + CTA text)
- `problem`, `solution`, `content`, `demo` → `hello-world/Main.tsx` (useFormat responsive layout + centered text + potential for image/video background)
- `pattern-break`, `twist` → mix of Intro + Main (visual shift + animation)

---

### ✓ Step 3 — Asset Planning

Based on the `visual` field, determine what assets this sequence needs.

**Ask and plan:**

**Background/Main visual:**
- Does the visual description mention a scene/environment/action? (e.g., "office worker typing", "product demo on screen", "nature landscape")
  - If YES: This needs a background asset
    - Option A: Stock **video** (dynamic, motion) — search Pexels via `search_stock_videos "query"`
    - Option B: Stock **image** (static) — search Unsplash/Pexels via `search_stock_images "query"`
    - Option C: **Solid color** background (no asset needed)
  - Ask: "For the visual '{visual description}', what background? (A) Stock video, (B) Stock image, (C) Solid color, (D) Skip / I'll add later"
  - **STOP** — wait for choice
  - If A or B: Propose a search query and ask: "Search for '{query}'? (yes/no or suggest different query)"
  - If yes: Use Stocky MCP tools (search_stock_videos or search_stock_images), present results, ask user to pick one or request new search
  - **STOP** until they select an asset

**Animated elements:**
- Does the visual mention animations? (e.g., "loading spinner", "checkmark animation", "confetti")
  - If YES: Check if Lottie animation would help
  - Ask: "Would you like a Lottie animation for '{animation element}'? (yes/no)"
  - If yes: Propose LottieFiles search query, offer to search
  - **STOP** until selection

**UI elements/Icons:**
- Does the visual mention icons, buttons, badges? (e.g., "success icon", "CTA button")
  - Note: These can be built with React (no asset needed), or sourced from icon libraries

**SFX:**
- List the SFX in this sequence from sequences.json: {sfx list}
- Confirm available files: `whoosh`, `success-ding`, `notif-chime`, `keypress`, `recording-beep`, `typing`
- If SFX is requested but not available: "SFX '{name}' not available. Use one of: {list} instead"

**Display asset summary:**
```
ASSET PLAN
═══════════════════════���═════════════════════════════════════

Background:
  Type: {video | image | solid color | none}
  Source: {asset name or color hex}
  File path: public/{type}/{filename} (or derivable once downloaded)

Animations:
  Lottie: {yes/no, if yes: {asset name}}

SFX:
  {sfx1 @ frame {N} (duration {Nf}, vol {vol})}
  {sfx2 @ frame {N} ...}

Fonts & Colors:
  Heading font: {from brand guidelines}
  Body font: {from brand guidelines}
  Primary color: {from brand guidelines}
  Text color: {from brand guidelines}

═════════════════════════════════════════════════════════════
```

---

### ✓ Step 4 — Component Structure Proposal

Describe HOW to build the scene component in **pseudocode/prose** (NOT actual TypeScript).

Based on the reference patterns, animation helpers, and assets, outline:

```
COMPONENT STRUCTURE: {SceneName}.tsx
═════════════════════════════════════════════════════════════

File location: src/videos/{slug}/scenes/{SceneName}.tsx

Props interface:
  - {prop1}: {type} — {description of what it's used for}
  - {prop2}: {type} — {description}
  [If no props needed: "No props — scene is self-contained"]

Layout structure:
  Root: <AbsoluteFill> with backgroundColor: colors.bg

  Layer 1 — Background:
    {Element: Img or OffthreadVideo or solid fill}
    - Full bleed (width: 100%, height: 100%)
    - Opacity animation: fadeIn(frame, 0, 8 frames)

  Layer 2 — Main content:
    Positioned {relative | absolute} at {position: top-center | bottom-right | etc}

    Element A: {description of element}
      - Style: {font-size, color, etc. using colors.primary, fontHeading, etc}
      - Animation: {scaleIn | fadeIn | slideIn} at frame {startFrame}
      - Duration: {durationFrames}

    Element B: {description}
      - Style: ...
      - Animation: ...

  Layer 3 — Text overlay (if applicable):
    Text: "{textOverlay content}"
    Position: {center | bottom}
    Font: fontHeading, size: 48px, color: colors.primary
    Animation: fadeIn(frame, {startFrame}, 12 frames)

  Layer 4 — Interactive elements (if any):
    {Button | Icon | other}
    Animation: ...

Animation strategy:
  - Use spring() for organic entrance motion
  - Apply `extrapolateLeft: "clamp"` and `extrapolateRight: "clamp"` on all interpolate() calls
  - Reference animation helpers from src/lib/animations.ts:
    * fadeIn(frame, startAt, duration)
    * scaleIn(frame, fps, "snappy" | "gentle" | "bouncy")
    * slideIn(frame, fps, "up" | "down" | "left" | "right", springPreset)
    * glowPulse(frame) for glow effects

Transition OUT:
  This scene transitions to the next via {fade | slide | wipe}
  (Handled in Composition.tsx — not inline in the scene)

═════════════════════════════════════════════════════════════

KEY PATTERNS FROM REFERENCE:
  {Pattern 1: how the reference does something}
  {Pattern 2: ...}
```

---

### ✓ Step 5 — Approval & Save

Display a complete sequence guide summary:

```
SEQUENCE GUIDE SUMMARY
═════════════════════════════════════════════════════════════

Sequence:    {index} — {role}
Duration:    {durationInFrames} frames ({durationSeconds})
Component:   src/videos/{slug}/scenes/{SceneName}.tsx

Retention:   ✓ PASS ({N} checks)
             ⚠ WARN: {list of WARN items if any}

Assets:
  Background:    {description}
  SFX:           {list}
  Fonts/Colors:  {from brand guidelines}

Component structure:
  Root: <AbsoluteFill>
  ├─ Background layer (video/image/color)
  ├─ Main content ({description of elements})
  ├─ Text overlay (if applicable)
  └─ SFX cues (in audio.config.ts)

Animations:
  - {fadeIn | scaleIn | slideIn} for entrances
  - {glowPulse} for glow effects
  - Spring-based motion (not raw Math.sin)

Status: READY FOR APPROVAL

═════════════════════════════════════════════════════════════
```

Ask: "Does this guide look correct? Options:
- Type 'yes' to approve this sequence (I'll save the guide)
- Tell me what to change in the layout, animations, or assets
- Type 'back' to go back and revise the asset plan"

**STOP** — Do NOT write any files until explicit 'yes'

**If they revise:**
- Update the relevant sections (layout, animations, assets)
- Re-display the summary
- Ask again until 'yes'

---

### ✓ Step 6 — Save Guide & Update Status

Once approved:

**Create directory** (if not exists): `src/videos/{slug}/.prod/sequences/{index}-{role}/`

**Write** `src/videos/{slug}/.prod/sequences/{index}-{role}/guide.md`:
```markdown
# Sequence Guide: {index} — {role}

**Video**: {slug} — "{title}"
**Duration**: {durationSeconds} ({durationInFrames} frames)
**Status**: Approved

## Retention Check
{PASS/WARN summary}

## Assets
{Asset plan from Step 3}

## Component Structure
{Pseudocode from Step 4}

## Animations
{Animation helpers to use}

## Next Steps
Once all sequences are approved, run:
  /video-assemble {slug}
```

**Update** `src/videos/{slug}/.prod/sequences.json`:
- Find the sequence object at index `{index}`
- Change `status` from `"pending"` to `"approved"`

**Update** `src/videos/{slug}/.prod/metadata.json`:
- Read current `sequencesApproved` count
- Increment by 1
- Save updated value

Display progress:
```
✅ SEQUENCE APPROVED
═════════════════════════════════════════════════════════════

Sequence {index} ({role}): APPROVED
Guide saved: src/videos/{slug}/.prod/sequences/{index}-{role}/guide.md

Progress: {sequencesApproved}/{sequencesTotal} sequences approved

═════════════════════════════════════════════════════════════
```

**If more sequences pending:**
```
NEXT SEQUENCE:
──────────────
/sequence-guide {slug} {nextIndex}   ({nextRole} sequence)

Or check progress: /sequence-guide {slug} {currentIndex}
```

**If all sequences approved:**
```
ALL SEQUENCES APPROVED! 🎉
─────────────────────────

Ready to assemble the video:
  /video-assemble {slug}
```

---

## Key Behaviors

**One sequence at a time.** This skill handles one sequence per invocation. You control the pacing.

**No code generation.** This skill only produces guide.md. The actual React code is generated by `/video-assemble`.

**FAIL items are blockers.** Do not approve if retention checks have FAILs. Either fix them or explicitly override.

**Pseudocode, not TypeScript.** The component structure is prose/pseudocode. Full code generation happens later in video-assemble.

**Assets are optional.** If the user says "skip / I'll add later", that's fine — they can add assets manually after code generation.

---

## Summary

This skill produces:
- `src/videos/{slug}/.prod/sequences/{index}-{role}/guide.md` — detailed implementation guide
- Updated `.prod/sequences.json` with `status: "approved"`
- Updated `.prod/metadata.json` with incremented `sequencesApproved`

Next: Run `/sequence-guide {slug} {nextIndex}` for the next sequence, or `/video-assemble {slug}` when all are approved.
