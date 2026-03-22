# 📚 Documentation

Bienvenue dans la documentation technique du **Remotion Video Template**. Ce dossier contient des guides détaillés sur l'architecture, les patterns, et les bonnes pratiques.

## 📖 Quick Navigation

### Getting Started

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Vue d'ensemble de la structure du projet
  - 🏗️ System architecture
  - 📦 File structure
  - 🔄 Composition lifecycle
  - 🎬 Video structure
  - 🔗 Type hierarchy

### Core Patterns

- **[CMS-INPUT-PROPS.md](./CMS-INPUT-PROPS.md)** — Pattern pour les vidéos data-driven (complet)
  - 🎯 Vue d'ensemble
  - 🏗️ Architecture du type system
  - 📋 Checklist d'implémentation
  - 🎬 Patterns d'usage (Studio, CLI, variants, CMS)
  - 🎨 Exemple réel (Art History Video)
  - 🔧 Patterns avancés
  - ✅ Garanties de type safety
  - 🚀 Best practices
  - 📖 Référence Zod

---

## 🎯 Common Workflows

### Je veux créer une nouvelle vidéo

1. **Lire:** [ARCHITECTURE.md → Video Composition Structure](./ARCHITECTURE.md#-video-composition-structure)
2. **Lire:** [CMS-INPUT-PROPS.md → Implementation Checklist](./CMS-INPUT-PROPS.md#-implementation-checklist)
3. **Exécuter:** `npm run new-video -- my-video "My Video Title"`
4. **Implémenter:** Suivre le checklist (schema → component → scenes → registry)

### Je veux intégrer une CMS

1. **Lire:** [CMS-INPUT-PROPS.md → Pattern 4: CMS/API Integration](./CMS-INPUT-PROPS.md#pattern-4-cmsapi-integration)
2. **Lire:** [ARCHITECTURE.md → Data Flow: CMS Integration Example](./ARCHITECTURE.md#-data-flow-cms-integration-example)
3. **Implémenter:** Fetch data → validate schema → generate registry entries

### Je veux générer plusieurs variantes

1. **Lire:** [CMS-INPUT-PROPS.md → Pattern 3: Multiple Variants](./CMS-INPUT-PROPS.md#pattern-3-multiple-variants-from-one-composition)
2. **Implémenter:** Une composition, N entrées registry avec différents defaultProps
3. **Rendre:** `npm run render:all` (génère toutes les variantes × formats)

### Je veux éditer les props visuellement

1. **Lancer:** `npm run studio`
2. **Ouvrir:** Une composition dans Remotion Studio
3. **Éditer:** Les champs Props panel qui apparaît à droite
4. **Voir:** Les changements en direct dans la preview

### Je veux surcharger les props par CLI

```bash
npm run render -- my-video-landscape \
  --props '{"title":"Custom Title","ctaText":"Buy Now"}' \
  out/video.mp4
```

**Voir:** [CMS-INPUT-PROPS.md → Pattern 2: CLI Props Override](./CMS-INPUT-PROPS.md#pattern-2-cli-props-override)

---

## 🏛️ Architecture Overview

```
┌──────────────────────────────────────────┐
│         Remotion Video Template           │
├──────────────────────────────────────────┤
│                                          │
│  INPUT: Props (Studio, CLI, Registry)    │
│    ↓                                     │
│  Root.tsx (composition routing)           │
│    ↓                                     │
│  VideoEntry (schema + component)          │
│    ↓                                     │
│  Composition (React.FC<Props>)           │
│    ├─ Scene 1 (Intro)                   │
│    ├─ Scene 2 (Main)                    │
│    └─ Scene 3 (Outro)                   │
│    ↓                                     │
│  Audio Layers (SFX, Music, Voiceover)    │
│    ↓                                     │
│  OUTPUT: video.mp4                       │
│                                          │
└──────────────────────────────────────────┘
```

**Détail complet:** [ARCHITECTURE.md → System Architecture](./ARCHITECTURE.md#-system-architecture)

---

## 🔑 Key Concepts

### **VideoEntry** (registry)

```typescript
{
  id: "my-video",
  component: MyComposition,
  schema: mySchema,           // ← Zod type for validation
  defaultProps: { ... },      // ← Default values
  durationInFrames: 600,
  fps: 30,
}
```

### **Composition** (React component)

```typescript
export const MyComposition: React.FC<MyVideoProps> = (props) => {
  // props are type-safe, validated by schema
  return <Intro title={props.title} ... />;
};
```

### **Scene** (sub-component)

```typescript
interface IntroProps {
  title: string;
  logoUrl: string;
}

export const Intro: React.FC<IntroProps> = ({ title, logoUrl }) => {
  // Only receives props it needs
  return <AbsoluteFill> ... </AbsoluteFill>;
};
```

---

## 📚 Reference

### Project Files

- `src/lib/types.ts` — Type definitions (VideoEntry, Format, AudioConfig)
- `src/Root.tsx` — Main composition router
- `src/videos/registry.ts` — Video registry (all compositions listed here)
- `CLAUDE.md` — Project conventions & guidelines

### Example Videos

- `src/videos/hello-world/` — Simple working example (refactored for CMS)
- `src/videos/_template/` — Template for new videos

### External Links

- [Remotion Docs](https://www.remotion.dev/docs)
- [Remotion Props](https://www.remotion.dev/docs/composition-props)
- [Zod Documentation](https://zod.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🚀 Quick Commands

```bash
# Development
npm run studio                    # Launch Remotion Studio

# New video
npm run new-video -- slug "Title"

# Audio generation
npm run generate:audio            # Generate voiceover + music
npm run generate:voiceover -- slug

# Rendering
npm run render -- my-video-landscape out/video.mp4
npm run render:all                # Render all compositions

# Type checking
npm run typecheck                 # Run TypeScript

# Subtitle translation
npm run translate:srt public/subs/intro.srt fr
```

---

## 🤝 Contributing

When adding new videos or patterns:

1. **Create schema.ts** — Define Zod type for props
2. **Type your components** — Composition + scenes typed with props
3. **Document in registry.ts** — Add VideoEntry with schema + defaultProps
4. **Test in Studio** — Verify props panel renders correctly
5. **Add CLAUDE.md notes** — Document any custom patterns

---

## 📞 Support

- Issues? Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
- Pattern questions? See [CMS-INPUT-PROPS.md](./CMS-INPUT-PROPS.md)
- Code examples? Look at `src/videos/hello-world/` or `_template/`
- Best practices? Review [CMS-INPUT-PROPS.md → Best Practices](./CMS-INPUT-PROPS.md#-best-practices)

---

**Last updated:** March 2026
**Template version:** 1.1.0 (CMS + Input Props)
