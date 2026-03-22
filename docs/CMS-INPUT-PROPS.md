# CMS + Input Props Pattern — Documentation Technique

## 🎯 Vue d'ensemble

Ce template Remotion supporte la **génération de vidéos data-driven** : une seule composition peut générer N vidéos avec des contenus différents via des input props Zod-typées.

**Cas d'usage:**

- 📺 Vidéos marketing : différentes variantes de produits/messages depuis une composition
- 🎨 Galerie de vidéos : art history, portfolios, catalogues
- 🤖 Batch generation : générer 1000 vidéos à partir d'une feuille de calcul
- 🔄 CMS integration : feed external content (Strapi, Contentful, custom API)

---

## 🏗️ Architecture

### Type System (Zod + TypeScript)

```
VideoEntry (registry.ts)
├── component: React.FC<any>        ← accepts props
├── schema: ZodTypeAny              ← runtime validation + Studio GUI
└── defaultProps: Record<string>    ← resolved defaults from schema

MyComposition (React.FC<MyVideoProps>)
├── props: MyVideoProps             ← typed, validated
└── scenes: React.FC<SceneProps>    ← receive subset of props
```

### Data Flow

```
Registry Entry
    ↓
Root.tsx reads schema + defaultProps
    ↓
<Composition schema={schema} defaultProps={defaultProps} component={Component} />
    ↓
Remotion merges: defaultProps + CLI --props + Studio edits
    ↓
Component receives merged props
    ↓
Scenes render with prop values
```

---

## 📋 Implementation Checklist

### 1️⃣ Define Schema (per composition)

**File:** `src/videos/my-video/schema.ts`

```typescript
import { z } from "zod";

// Define what props this composition accepts
export const myVideoSchema = z.object({
  // Text content
  title: z.string().describe("Main title").default("Default Title"),
  subtitle: z.string().describe("Subtitle").default(""),
  headline: z.string().describe("Hero text").default("Your message here"),
  bodyText: z.string().describe("Body content").default(""),
  ctaText: z.string().describe("Call-to-action button").default("Learn More"),

  // Assets
  logoUrl: z.string().describe("Logo path").default("logo-placeholder.svg"),
  backgroundImageUrl: z.string().optional(),

  // Metadata
  brandName: z.string().default("Brand"),
  accentColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
});

// Export inferred TypeScript type
export type MyVideoProps = z.infer<typeof myVideoSchema>;
```

**Zod features:**

- `.describe()` — appears as label in Remotion Studio GUI
- `.default()` — fallback value
- `.optional()` — nullable field
- `.regex()`, `.min()`, `.max()` — validation rules

### 2️⃣ Accept Props in Composition

**File:** `src/videos/my-video/Composition.tsx`

```typescript
import type { MyVideoProps } from "./schema";

export const MyVideoComposition: React.FC<MyVideoProps> = (props) => {
  return (
    <AbsoluteFill>
      {/* Pass subset of props to each scene */}
      <Intro
        title={props.title}
        logoUrl={props.logoUrl}
      />
      <Main
        headline={props.headline}
        bodyText={props.bodyText}
      />
      <Outro
        brandName={props.brandName}
        ctaText={props.ctaText}
      />
    </AbsoluteFill>
  );
};
```

### 3️⃣ Type Scene Components

**File:** `src/videos/my-video/scenes/Intro.tsx`

```typescript
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

**Key points:**

- Scene receives only the props it needs (not the full composition props)
- Props are typed with local `interface`, not generics (simpler)
- Values are rendered directly from props, no global imports

### 4️⃣ Register with Schema + Default Props

**File:** `src/videos/registry.ts`

```typescript
import { myVideoSchema } from "./my-video/schema";
import { brand } from "../brand.config";

export const videos: VideoEntry[] = [
  {
    id: "my-video",
    title: "My Video",
    component: MyVideoComposition,

    // ✨ NEW: Schema enables Studio props editor
    schema: myVideoSchema,

    // ✨ NEW: Default values (merged with schema defaults)
    defaultProps: myVideoSchema.parse({
      title: "My Custom Title",
      brandName: brand.name,
      logoUrl: brand.logo,
      accentColor: brand.colors.primary,
      // ... rest use schema defaults
    }),

    durationInFrames: 600,
    fps: 30,
  },
];
```

**Note on `schema.parse()`:**

- Validates object against schema at build time
- TypeScript ensures no missing required fields
- Returns type-safe `Record<string, unknown>` for `defaultProps`

---

## 🎬 Usage Patterns

### Pattern 1: Studio Visual Editing

```bash
npm run studio
```

1. Open Remotion Studio
2. Select composition (e.g., `my-video-landscape`)
3. **Props panel** appears on right side
4. Edit fields in real-time
5. Video updates live in preview

**Fields rendered:**

- `.string()` → text input
- `.number()` → number input
- `.optional()` → can leave empty
- `.describe()` → label + tooltip
- `.enum()` / `.union()` → dropdown

### Pattern 2: CLI Props Override

```bash
npm run render -- my-video-landscape \
  --props '{"title":"Custom Title","ctaText":"Buy Now"}' \
  out/video.mp4
```

**Advantages:**

- Batch rendering scripts
- CMS integration (fetch data → JSON → render)
- A/B testing variations
- Internationalization

### Pattern 3: Multiple Variants from One Composition

```typescript
// Same composition, different data
const artVideoVariants = [
  {
    id: "girl-pearl-earring",
    component: ArtComposition,
    schema: artSchema,
    defaultProps: artSchema.parse({
      artwork: { title: "Girl with a Pearl Earring", artist: "Vermeer", year: 1665 },
      ...
    }),
  },
  {
    id: "starry-night",
    component: ArtComposition,
    schema: artSchema,
    defaultProps: artSchema.parse({
      artwork: { title: "The Starry Night", artist: "Van Gogh", year: 1889 },
      ...
    }),
  },
  {
    id: "persistence-memory",
    component: ArtComposition,
    schema: artSchema,
    defaultProps: artSchema.parse({
      artwork: { title: "The Persistence of Memory", artist: "Dalí", year: 1931 },
      ...
    }),
  },
];
```

Then render all:

```bash
npm run render:all
# Generates: girl-pearl-earring-landscape, starry-night-landscape, etc.
```

### Pattern 4: CMS/API Integration

```typescript
// Fetch data from CMS, generate video props
async function generateFromCMS() {
  const data = await fetch("https://api.example.com/artworks").then((r) => r.json());

  const entry: VideoEntry = {
    id: `art-${data.slug}`,
    component: ArtComposition,
    schema: artSchema,
    defaultProps: artSchema.parse({
      artwork: {
        title: data.title,
        artist: data.creator,
        year: data.year,
        imageUrl: data.image_url,
      },
      script: {
        hook: data.hook_text,
        body: data.body_text,
        cta: data.cta_button,
      },
    }),
    durationInFrames: 600,
    fps: 30,
  };

  return entry;
}
```

---

## 🎨 Real Example: Art History Video

### Schema Definition

```typescript
// src/videos/art-history/schema.ts
export const artHistorySchema = z.object({
  artwork: z.object({
    imageUrl: z.string().describe("Artwork image URL"),
    title: z.string().describe("Artwork title"),
    artist: z.string().describe("Artist name"),
    year: z.number().describe("Year created"),
    museum: z.string().describe("Museum / Collection"),
  }),
  script: z.object({
    hook: z.string().describe("Opening hook (first 3s)"),
    context: z.string().describe("Historical context"),
    detail: z.string().describe("Artistic detail explanation"),
    mystery: z.string().describe("Interesting fact / mystery"),
    cta: z.string().describe("Call-to-action"),
  }),
  colors: z.object({
    primary: z.string().optional().describe("Primary accent color"),
    secondary: z.string().optional().describe("Secondary color"),
  }),
});

export type ArtHistoryProps = z.infer<typeof artHistorySchema>;
```

### Composition

```typescript
// src/videos/art-history/Composition.tsx
export const ArtHistoryComposition: React.FC<ArtHistoryProps> = (props) => {
  const { artwork, script, colors } = props;

  return (
    <TransitionSeries>
      <Intro artwork={artwork} script={script} colors={colors} />
      <Context artwork={artwork} script={script} colors={colors} />
      <Detail artwork={artwork} script={script} colors={colors} />
      <Outro script={script} colors={colors} />
    </TransitionSeries>
  );
};
```

### Registry Entry

```typescript
// src/videos/registry.ts
{
  id: "girl-pearl-earring",
  title: "Girl with a Pearl Earring",
  component: ArtHistoryComposition,
  schema: artHistorySchema,
  defaultProps: artHistorySchema.parse({
    artwork: {
      imageUrl: "images/girl-pearl-earring.jpg",
      title: "Girl with a Pearl Earring",
      artist: "Johannes Vermeer",
      year: 1665,
      museum: "Mauritshuis, The Hague",
    },
    script: {
      hook: "One of the most mysterious paintings ever created.",
      context: "Painted in the Dutch Golden Age...",
      detail: "The pearl earring catches light in a way...",
      mystery: "We still don't know who the girl was.",
      cta: "Discover more masterpieces",
    },
    colors: {
      primary: "#D4AF37", // Gold
      secondary: "#2C3E50", // Dark blue
    },
  }),
  durationInFrames: 600,
  fps: 30,
}
```

---

## 🔧 Advanced Patterns

### Conditional Rendering Based on Props

```typescript
export const MyScene: React.FC<SceneProps> = (props) => {
  return (
    <AbsoluteFill>
      {/* Show different content based on prop */}
      {props.variantType === "luxury" ? (
        <LuxuryLayout {...props} />
      ) : (
        <BasicLayout {...props} />
      )}
    </AbsoluteFill>
  );
};
```

Schema with enum:

```typescript
const schema = z.object({
  variantType: z.enum(["basic", "luxury"]).default("basic"),
});
```

### Union Types for Flexibility

```typescript
const musicSource = z.union([
  z.object({
    source: z.literal("file"),
    path: z.string(), // e.g., "audio/music/ambient.wav"
  }),
  z.object({
    source: z.literal("jamendo"),
    trackId: z.string(), // e.g., "1234567"
  }),
]);
```

### Array Props (e.g., Multiple Scenes)

```typescript
const multiSceneSchema = z.object({
  scenes: z
    .array(
      z.object({
        title: z.string(),
        duration: z.number(),
        content: z.string(),
      })
    )
    .min(1)
    .max(10),
});
```

---

## ✅ Type Safety Guarantees

| Level          | Guarantee         | Example                                   |
| -------------- | ----------------- | ----------------------------------------- |
| **Build time** | TypeScript + Zod  | `schema.parse()` ensures no invalid props |
| **Runtime**    | Zod validation    | Missing/wrong type → parse() throws       |
| **Studio UI**  | Schema reflection | Only valid enum values in dropdown        |
| **CLI**        | JSON parsing      | `--props '...'` validated before render   |

---

## 🚀 Best Practices

### ✅ DO:

- **Default everything** — use `.default()` so schema.parse({}) works
- **Describe fields** — `.describe("...")` for Studio labels
- **Type scenes narrowly** — scenes take only props they need
- **Validate at boundary** — Zod at registry, trust internal props
- **Name IDs clearly** — `girl-pearl-earring-landscape`, not `video-1`

### ❌ DON'T:

- Mix hardcoded + prop content (choose one approach per scene)
- Store untyped props in `Record<string, any>` without validation
- Pass entire composition props to every scene (extract subset)
- Forget `.default()` on schema fields (breaks `parse({})`)
- Assume props exist without `?.` checks in JSX

---

## 📖 Reference

### Remotion Composition Props

```typescript
<Composition
  id="my-video-landscape"
  component={MyVideoComposition}
  schema={myVideoSchema}           // ← Zod type for validation + Studio
  defaultProps={{...}}            // ← Merged with Studio edits
  durationInFrames={600}
  fps={30}
  width={1920}
  height={1080}
/>
```

### Zod Common Methods

```typescript
z.string()                      // required string
z.string().optional()           // string | undefined
z.string().default("value")     // string with default
z.string().describe("label")    // UI label in Studio
z.string().min(1).max(100)     // length validation
z.string().regex(/^[A-Z]/)     // pattern match

z.number().int().positive()     // integer > 0
z.object({ ... })              // nested object
z.array(z.string())            // array of strings
z.enum(["a", "b"])             // select from options
z.union([type1, type2])        // one of multiple types
z.literal("fixed")             // exact literal value

schema.parse(data)              // throws on invalid
schema.safeParse(data)          // returns { success, data, error }
```

---

## 🔗 See Also

- [CLAUDE.md — CMS + Input Props section](../CLAUDE.md#cms--input-props-data-driven-videos)
- [Remotion Docs — Input Props](https://www.remotion.dev/docs/compositon-props)
- [Zod Documentation](https://zod.dev)
- [Example: hello-world/schema.ts](../src/videos/hello-world/schema.ts)
- [Example: \_template/schema.ts](../src/videos/_template/schema.ts)

---

**Last updated:** March 2026
**Template version:** 1.1.0 (CMS + Input Props)
