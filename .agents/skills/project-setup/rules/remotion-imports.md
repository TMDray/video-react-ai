---
name: remotion-imports
description: Critical rules about imports in Remotion projects — webpack does not resolve tsconfig aliases
metadata:
  category: Setup
---

# Import Rules for Remotion

## CRITICAL: No `@/` path aliases

Remotion uses its own webpack bundler that **does NOT resolve tsconfig path aliases**.

```ts
// ❌ WRONG — webpack error at build time
import { brand } from "@/brand.config";
import { colors } from "@/lib/colors";

// ✅ CORRECT — relative paths always work
import { brand } from "../../brand.config";
import { colors } from "./colors";
```

Even though `@/*` is defined in `tsconfig.json` and TypeScript won't complain, Remotion's bundler will fail when rendering.

## Rules

1. **Always use relative imports** for project files (`./`, `../`, `../../`)
2. **npm packages are fine** with bare imports (`remotion`, `react`, `@remotion/transitions`)
3. **`@remotion/*` packages** are not path aliases — they're real npm scoped packages, so they work
4. When creating new files, calculate the correct relative path from the file's location

## Common import patterns

From `src/videos/<slug>/scenes/MyScene.tsx`:

```ts
// lib files (3 levels up to src/, then into lib/)
import { colors } from "../../../lib/colors";
import { brand } from "../../../brand.config";

// sibling components
import { MyComponent } from "../components/MyComponent";

// npm packages (always fine)
import { useCurrentFrame } from "remotion";
import { Lottie } from "@remotion/lottie";
```

From `src/lib/components/MyComponent.tsx`:

```ts
// other lib files (1 level up)
import { colors } from "../colors";

// brand config (2 levels up to src/)
import { brand } from "../../brand.config";
```