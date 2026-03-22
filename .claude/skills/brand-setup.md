# Brand Setup with BMAD Framework

## What this skill does

Guides you through a **one-time** brand identity setup using the BMAD framework (Brief, Mood, Aesthetics, Direction). Each section is completed and validated before moving to the next. At the end, it updates `src/brand.config.ts` and writes detailed brand guidelines to `.prod/brand-guidelines/`.

**When to use**: Run `/brand-setup` before creating any videos. All future skills will inherit from the brand guidelines created here.

---

## Execution Plan

### ✓ Step 0 — Check for existing guidelines

**Read** `.prod/brand-guidelines/metadata.json` (if it exists)

If it exists:
- Display: "Brand guidelines already exist (created {date})"
- Ask: "Would you like to (1) continue using them, (2) update a specific section, or (3) start over?"
- **STOP** — wait for response

If NOT found:
- Greet: "Welcome to brand setup! We'll build your brand guidelines in 4 sections. I'll ask questions section-by-section and confirm your answers before saving anything."
- Proceed to **Step 1**

---

### ✓ Step 1 — BRIEF (Company Identity)

Ask these questions in **TWO groups**:

**Group A — Company identity:**
"Let's start with your company identity. Please answer these questions:"

1. Company name?
2. Tagline or slogan (short phrase under your name)?
3. Website URL?
4. Logo file — is it in the `public/` folder already? If yes, what's the filename? If no, what filename should we use as a placeholder?

**After Group A:**
- **STOP** — wait for all 4 answers
- Then ask: "Thanks. Before the next group, does this look right?"
  - Display: Company name, tagline, URL, logo file
  - Ask: "Continue? (yes/adjust)"
  - **STOP** if they say adjust

**Group B — Audience and objective:**
"Now about your audience and goals:"

5. Who is your primary target audience? (e.g., "SaaS founders", "fitness enthusiasts 25-40")
6. What is the main thing you want viewers to do or feel after watching your videos?
7. What 3 words best describe your brand's personality? (e.g., "confident, human, innovative")

**After Group B:**
- **STOP** — wait for all 3 answers

**Validation checkpoint — BRIEF:**

Display formatted summary:
```
BRAND BRIEF SUMMARY
═══════════════════
Company:     {name}
Tagline:     {tagline}
URL:         {url}
Logo:        {logo filename}
Audience:    {audience description}
Objective:   {objective}
Personality: {word1}, {word2}, {word3}
```

Ask: "Does this look correct? Type 'yes' to continue to Mood, or tell me what to change."

**STOP** — wait for confirmation. Do NOT continue until they say yes or make adjustments.

---

### ✓ Step 2 — MOOD (Tone, Personality, Voice)

Ask all at once (quick section):

"Now let's define the mood and voice of your brand and videos."

1. What tone should your brand have? Choose from: **professional**, **playful**, **energetic**, **calm**, **authoritative**, **friendly**, **bold**, **minimal** — or describe your own?
2. What pacing style for video? Choose: **fast-paced** (cuts every 2-3s), **moderate** (cuts every 4-6s), **slow-burn** (cuts every 8s+)?
3. Music mood preference? (e.g., "upbeat corporate 120bpm", "lo-fi chill 80bpm", "epic orchestral", "minimal", "none")
4. Voiceover style? (e.g., "confident narrator", "conversational", "energetic presenter", "gentle guide", "none")

**STOP** — wait for all 4 answers

**Validation checkpoint — MOOD:**

Display summary:
```
MOOD DEFINITION
═══════════════
Tone:           {tone}
Pacing:         {pacing style}
Music mood:     {music mood}
Voiceover:      {voiceover style}
```

Ask: "Does this feel right? Type 'yes' to continue to Aesthetics, or tell me what to adjust."

**STOP** — wait for confirmation.

---

### ✓ Step 3 — AESTHETICS (Colors, Fonts, Visual Style)

**Group A — Colors:**

"What are your brand colors? I need hex codes (e.g., #6366f1)."

1. Primary color (main accent — buttons, highlights)? (If unsure, try: https://coolors.co)
2. Background color (dark or light)?
3. Surface/card color (slightly lighter than background)?
4. Text color (dark if light background, light if dark background)?
5. Muted text color (for captions, secondary text)?

**STOP** — wait for 5 hex codes

Suggest if they're unsure: "Popular tools: coolors.co, color-hex.com. Or just describe your colors and I'll convert them."

**Group B — Typography:**

"What fonts do you want? (Must be Google Fonts — free via @remotion/google-fonts)"

6. Heading font? (Current: Inter. Alternatives: Montserrat, Poppins, Playfair Display, Roboto)
7. Body font? (Can be same as heading or different)

**STOP** — wait for 2 font choices

**Group C — Visual style:**

8. Visual style keywords? Choose 2-3: **minimal**, **bold**, **cinematic**, **neon/glow**, **corporate**, **brutalist**, **soft/pastel**, **dark-mode**, **light-mode**, **gradient-heavy**
9. Do you want glow effects on your primary color? (**yes** / **no**)

**STOP** — wait for answers

**Validation checkpoint — AESTHETICS:**

Display color swatch summary:
```
AESTHETICS SUMMARY
══════════════════
PRIMARY COLOR:     {hex}
  └─ Used for: CTA buttons, highlights, accent text

BACKGROUND:        {hex}
  └─ Page/canvas background

SURFACE:           {hex}
  └─ Cards, panels, light surfaces

TEXT PRIMARY:      {hex}
  └─ Main text (headings, body)

TEXT MUTED:        {hex}
  └─ Secondary text (subtitles, meta)

Heading font:      {font}
Body font:         {font}

Visual style:      {keywords}
Glow effects:      {yes/no}
```

Ask: "Does this look right? Type 'yes' to continue to Direction, or tell me what to change."

**STOP** — wait for confirmation.

---

### ✓ Step 4 — DIRECTION (Animation, Video Defaults)

Ask all at once:

"Last section — animation and video production defaults."

1. Animation style preference? Choose: **spring-bounce** (lively, organic), **smooth-fade** (elegant), **snap** (sharp, modern), **mixed**
2. Transition style between scenes? Choose: **fade** (smooth), **slide** (dynamic), **cut** (abrupt/modern), **mixed**
3. Default video formats to render? Choose one or more: **landscape** (16:9 YouTube/LinkedIn banner), **linkedin** (4:5 square feed), **short** (9:16 TikTok/Reels/Shorts)
   - You can pick all 3, or just the ones you need
4. Default FPS? (30 = standard, 60 = very smooth). Default: 30
5. Are subtitles/captions important? (**yes** / **no**)

**STOP** — wait for all answers

**Validation checkpoint — DIRECTION:**

Display summary:
```
DIRECTION DEFINITION
════════════════════
Animation style:    {style}
Transition style:   {style}
Default formats:    {list}
Default FPS:        {fps}
Captions needed:    {yes/no}
```

Ask: "Does this capture your direction? Type 'yes' to review everything and save, or tell me what to adjust."

**STOP** — wait for confirmation.

---

### ✓ Step 5 — Final Summary & Save

Display a complete summary of ALL 4 sections:

```
═══════════════════════════════════════════
COMPLETE BRAND GUIDELINES
═══════════════════════════════════════════

BRIEF:
  Company: {name}
  Tagline: {tagline}
  URL: {url}
  Logo: {logo}
  Audience: {audience}
  Objective: {objective}
  Personality: {3 words}

MOOD:
  Tone: {tone}
  Pacing: {pacing}
  Music: {music mood}
  Voiceover: {voiceover style}

AESTHETICS:
  Primary: {hex}
  Background: {hex}
  Surface: {hex}
  Text: {hex}
  Muted: {hex}
  Fonts: {heading} / {body}
  Style: {keywords}
  Glow: {yes/no}

DIRECTION:
  Animation: {style}
  Transitions: {style}
  Formats: {list}
  FPS: {fps}
  Captions: {yes/no}

═══════════════════════════════════════════
```

Ask: "Ready to save? I'll (1) write brand guidelines to `.prod/brand-guidelines/`, and (2) update `src/brand.config.ts` with your colors, fonts, name, and CTA. Proceed? (yes/review)"

**STOP** — wait for final confirmation.

Once they say yes:

1. **Create directories**: `.prod/brand-guidelines/aesthetics/` and `.prod/brand-guidelines/direction/`

2. **Write** `.prod/brand-guidelines/metadata.json`:
```json
{
  "version": "1.0",
  "createdAt": "[today ISO date]",
  "updatedAt": "[today ISO date]",
  "status": "complete",
  "company": "[name]",
  "sections": ["brief", "mood", "aesthetics", "direction"]
}
```

3. **Write** `.prod/brand-guidelines/brief.json`:
```json
{
  "company": "[name]",
  "tagline": "[tagline]",
  "url": "[url]",
  "logo": "[logo filename]",
  "audience": "[audience]",
  "objective": "[objective]",
  "personality": ["[word1]", "[word2]", "[word3]"]
}
```

4. **Write** `.prod/brand-guidelines/mood.json`:
```json
{
  "tone": "[tone]",
  "pacing": "[pacing style]",
  "musicMood": "[music mood]",
  "voiceoverStyle": "[voiceover style]"
}
```

5. **Write** `.prod/brand-guidelines/aesthetics/colors.json`:
```json
{
  "primary": {
    "hex": "[primary hex]",
    "rgb": "[RGB from hex]",
    "role": "CTA buttons, highlights, accent text"
  },
  "primaryLight": {
    "hex": "[15% lighter than primary]",
    "role": "hover states, lighter accents"
  },
  "primaryDark": {
    "hex": "[15% darker than primary]",
    "role": "dark mode accents, borders"
  },
  "background": {
    "hex": "[bg hex]",
    "role": "canvas, main background"
  },
  "bgLight": {
    "hex": "[10% lighter than background]",
    "role": "cards, surfaces"
  },
  "text": {
    "hex": "[text hex]",
    "role": "primary text, headings"
  },
  "textMuted": {
    "hex": "[muted hex]",
    "role": "secondary text, captions"
  }
}
```

6. **Write** `.prod/brand-guidelines/aesthetics/typography.json`:
```json
{
  "heading": {
    "font": "[heading font]",
    "weights": [400, 500, 600, 700],
    "sizes": {
      "h1": 48,
      "h2": 36,
      "h3": 28,
      "h4": 22
    }
  },
  "body": {
    "font": "[body font]",
    "weights": [400, 500],
    "sizes": {
      "lg": 18,
      "base": 16,
      "sm": 14
    }
  }
}
```

7. **Write** `.prod/brand-guidelines/direction/animation-style.json`:
```json
{
  "preference": "[spring-bounce | smooth-fade | snap | mixed]",
  "presets": {
    "gentle": { "damping": 15, "stiffness": 80, "mass": 1 },
    "snappy": { "damping": 10, "stiffness": 120, "mass": 0.8 },
    "bouncy": { "damping": 8, "stiffness": 150, "mass": 1 }
  }
}
```

8. **Write** `.prod/brand-guidelines/direction/pacing.json`:
```json
{
  "transitionStyle": "[fade | slide | cut | mixed]",
  "videoDefaults": {
    "formats": ["[format1]", "[format2]"],
    "fps": [fps number],
    "captionsRequired": [true/false]
  },
  "timingGuidelines": {
    "hookMaxDuration": "3s",
    "patternBreakInterval": "3-5s",
    "transitionDuration": 15,
    "minSceneDuration": "2s"
  }
}
```

9. **Update** `src/brand.config.ts`:
   - Set `name` = company name
   - Set `tagline` = tagline
   - Set `url` = website URL
   - Set `logo` = logo filename
   - Update `colors` object:
     - `primary` = primary hex
     - `primaryLight` = 15% lighter version
     - `primaryDark` = 15% darker version
     - `bg` = background hex
     - `bgLight` = 10% lighter version
     - `text` = text hex
     - `textMuted` = muted hex
     - Keep other colors (success, danger, warning, white, black) or ask user to override
   - Set `fonts.heading` = heading font name
   - Set `fonts.body` = body font name
   - Set `cta.text` = descriptive CTA (e.g., "Get Started", "Learn More")
   - Set `cta.url` = CTA target URL

After all files are written:

Display:
```
✅ BRAND SETUP COMPLETE
═══════════════════════

Created:
  .prod/brand-guidelines/metadata.json
  .prod/brand-guidelines/brief.json
  .prod/brand-guidelines/mood.json
  .prod/brand-guidelines/aesthetics/colors.json
  .prod/brand-guidelines/aesthetics/typography.json
  .prod/brand-guidelines/direction/animation-style.json
  .prod/brand-guidelines/direction/pacing.json

Updated:
  src/brand.config.ts

Your brand guidelines are now ready. Every video you create will inherit these settings.

NEXT STEP:
─────────
Create your first video with:
  /video-brief
```
