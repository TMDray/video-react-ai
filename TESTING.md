# Testing Guide — Remotion Video Template

Complete guide for writing and running tests for video compositions.

---

## Quick Start

```bash
# Run all tests
npm run test

# Run tests in watch mode (auto-rerun on file change)
npm run test -- --watch

# Run specific test file
npm run test -- scenes.test.tsx

# Run with coverage
npm run test -- --coverage
```

---

## Testing Architecture

### Test Environment

- **Framework:** Vitest 3.2.4
- **Renderer:** @testing-library/react 16.3.2
- **Environment:** jsdom (DOM simulation for React components)
- **Setup:** `src/__tests__/setup.ts` (imports @testing-library/jest-dom matchers)

### Test Organization

```
src/
├── lib/__tests__/
│   └── animations.test.ts       # Pure function tests (math)
│
└── videos/__tests__/
    └── scenes.test.tsx          # Component rendering tests
```

---

## Testing Scene Components

### The Challenge: Remotion Hooks Require Context

Scene components use Remotion hooks that need a composition context:

```tsx
// ❌ This won't work without mocking
export const Intro: React.FC<IntroProps> = (props) => {
  const frame = useCurrentFrame(); // ← Requires Remotion context!
  const { fps, durationInFrames } = useVideoConfig(); // ← Also requires context
  // ...
};
```

**Solution:** Mock the Remotion hooks with `vi.mock()`.

---

## Complete Testing Pattern

### 1. Import and Mock Remotion (BEFORE component imports)

```tsx
import { vi, describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

// ⚠️ IMPORTANT: Mock BEFORE importing components
vi.mock("remotion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("remotion")>();
  return {
    ...actual,

    // Mock the hooks that components use
    useCurrentFrame: vi.fn(() => 0), // Always return frame 0
    useVideoConfig: vi.fn(() => ({
      fps: 30,
      durationInFrames: 450,
      width: 1920,
      height: 1080,
      id: "test-composition",
    })),

    // Mock Remotion components as simple divs/spans
    staticFile: (path: string) => path, // Return path as-is
    Img: ({ src, style }: { src: string; style?: React.CSSProperties }) => (
      <img src={src} style={style} alt="test-image" />
    ),
    AbsoluteFill: ({
      children,
      style,
    }: {
      children: React.ReactNode;
      style?: React.CSSProperties;
    }) => <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>,

    // Mock animation functions
    spring: vi.fn((config: any) => 1.0),
    interpolate: vi.fn((frame: number, inputRange: number[], outputRange: number[]) => {
      const [inMin, inMax] = inputRange;
      const [outMin, outMax] = outputRange;
      if (frame <= inMin) return outMin;
      if (frame >= inMax) return outMax;
      return outMin + ((frame - inMin) / (inMax - inMin)) * (outMax - outMin);
    }),
  };
});

// Mock other hooks if needed
vi.mock("../../lib/useFormat", () => ({
  useFormat: vi.fn(() => ({
    format: { id: "landscape", width: 1920, height: 1080, label: "Landscape" },
    isPortrait: false,
    scaleFactor: 1,
    padding: 80,
  })),
}));

// NOW import components
import { Intro } from "../hello-world/scenes/Intro";
```

### 2. Write Tests

```tsx
describe("Intro Scene", () => {
  it("renders brandName prop", () => {
    render(<Intro brandName="Acme Corp" tagline="Our tagline" logoUrl="logo.svg" />);
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("renders tagline prop", () => {
    render(<Intro brandName="Test" tagline="Custom tagline" logoUrl="logo.svg" />);
    expect(screen.getByText("Custom tagline")).toBeInTheDocument();
  });

  it("loads logo image with correct src", () => {
    render(<Intro brandName="Test" tagline="Tagline" logoUrl="custom-logo.png" />);
    const img = screen.getByAltText("test-image");
    expect(img).toHaveAttribute("src", "custom-logo.png");
  });
});
```

---

## Testing Patterns by Component Type

### Scene Components (Animated)

Scene components use `useCurrentFrame()` and `useVideoConfig()`. Mock these to return fixed values:

```tsx
// Mock returns frame 0, so animations are at "start" state
useCurrentFrame: (vi.fn(() => 0),
  // Test that component renders without crashing
  it("renders without error", () => {
    render(<MyScene title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  }));
```

### Utility Components (Non-animated)

If a component doesn't use Remotion hooks, you don't need to mock them:

```tsx
// FeatureCard uses useCurrentFrame() internally, so mock it
vi.mock("remotion", async (importOriginal) => ({
  ...(await importOriginal()),
  useCurrentFrame: vi.fn(() => 0),
}));

describe("FeatureCard", () => {
  it("renders title and description", () => {
    render(<FeatureCard icon="🎬" title="Scenes" description="Build videos with React" />);
    expect(screen.getByText("Scenes")).toBeInTheDocument();
    expect(screen.getByText("Build videos with React")).toBeInTheDocument();
  });
});
```

### Animation Functions (Pure Math)

Animation functions are testable without mocking:

```tsx
// src/lib/__tests__/animations.test.ts
import { fadeIn, glowPulse, scaleIn } from "../animations";

describe("fadeIn", () => {
  it("returns 0 at frame 0", () => {
    expect(fadeIn(0)).toBe(0);
  });

  it("returns 1 after duration", () => {
    expect(fadeIn(10)).toBe(1);
  });

  it("supports delayed start", () => {
    expect(fadeIn(0, 10)).toBe(0); // Hasn't started yet
    expect(fadeIn(15, 10, 5)).toBe(1); // Started at frame 10, finished at 15
  });
});
```

---

## Testing New Videos

When you create a new video with `npm run new-video -- my-video "My Video"`, here's how to test it:

### 1. Create test file: `src/videos/my-video/__tests__/scenes.test.tsx`

```tsx
import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock Remotion (copy the pattern from scenes.test.tsx)
vi.mock("remotion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("remotion")>();
  return {
    ...actual,
    useCurrentFrame: vi.fn(() => 0),
    useVideoConfig: vi.fn(() => ({
      fps: 30,
      durationInFrames: 450,
      width: 1920,
      height: 1080,
      id: "test",
    })),
    staticFile: (path: string) => path,
    Img: ({ src }: { src: string }) => <img src={src} alt="test" />,
    AbsoluteFill: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    spring: vi.fn(() => 1.0),
    interpolate: vi.fn(() => 0.5),
  };
});

vi.mock("../../../lib/useFormat", () => ({
  useFormat: () => ({
    format: { id: "landscape", width: 1920, height: 1080, label: "Landscape" },
    isPortrait: false,
    scaleFactor: 1,
    padding: 80,
  }),
}));

// Import after mocking
import { Intro } from "../scenes/Intro";
import { Main } from "../scenes/Main";
import { Outro } from "../scenes/Outro";

describe("MyVideo Scenes", () => {
  describe("Intro", () => {
    it("renders", () => {
      render(<Intro /* YOUR_PROPS */ />);
      expect(screen.getByText("Your expected text")).toBeInTheDocument();
    });
  });

  // Add tests for Main and Outro...
});
```

### 2. Run tests

```bash
npm run test -- my-video
```

---

## Common Testing Patterns

### Testing Text Rendering

```tsx
// Check exact text
expect(screen.getByText("Exact text")).toBeInTheDocument();

// Check partial text
expect(screen.getByText(/partial/)).toBeInTheDocument();

// Check multiple words (ignores whitespace)
expect(screen.getByText("Hello World")).toBeInTheDocument();
```

### Testing Images/Assets

```tsx
const img = screen.getByAltText("test-image");
expect(img).toHaveAttribute("src", "custom-logo.png");
expect(img).toHaveStyle({ width: 140, height: 140 });
```

### Testing Component Props Affect Output

```tsx
// Test with different props
const { rerender } = render(<Scene title="Title A" />);
expect(screen.getByText("Title A")).toBeInTheDocument();

// Change props and re-render
rerender(<Scene title="Title B" />);
expect(screen.queryByText("Title A")).not.toBeInTheDocument();
expect(screen.getByText("Title B")).toBeInTheDocument();
```

### Testing Conditional Rendering

```tsx
// Component shows subtitle only if provided
render(<Scene title="Title" subtitle={undefined} />);
expect(screen.queryByText("Some subtitle")).not.toBeInTheDocument();

render(<Scene title="Title" subtitle="My subtitle" />);
expect(screen.getByText("My subtitle")).toBeInTheDocument();
```

---

## Mocking Reference

### Remotion Hooks

| Hook                     | Mock Value                                                                          | What It Does                 |
| ------------------------ | ----------------------------------------------------------------------------------- | ---------------------------- |
| `useCurrentFrame()`      | `() => 0`                                                                           | Returns current frame number |
| `useVideoConfig()`       | `() => ({ fps: 30, durationInFrames: 450, width: 1920, height: 1080, id: "test" })` | Returns video config         |
| `useVideoConfig().width` | `1920`                                                                              | Video width in pixels        |
| `useVideoConfig().fps`   | `30`                                                                                | Frames per second            |

### Remotion Components

| Component        | Mock As                                            | Reason           |
| ---------------- | -------------------------------------------------- | ---------------- |
| `<AbsoluteFill>` | `<div style={{ position: "absolute", inset: 0 }}>` | CSS positioning  |
| `<Img>`          | `<img>`                                            | HTML image tag   |
| `<Sequence>`     | `<div>`                                            | Just a container |

### Remotion Utilities

| Function           | Mock Value         |
| ------------------ | ------------------ |
| `staticFile(path)` | `(path) => path`   |
| `spring(config)`   | `vi.fn(() => 1.0)` |
| `interpolate(...)` | `vi.fn(() => 0.5)` |

---

## Debugging Tests

### Run tests in watch mode

```bash
npm run test -- --watch
```

Automatically re-runs tests when files change.

### Debug a single test

```bash
npm run test -- --reporter=verbose scenes.test.tsx
```

### See what got rendered

```tsx
import { render, screen } from "@testing-library/react";

it("renders something", () => {
  const { container } = render(<MyScene />);
  console.log(container.innerHTML); // Print HTML
  screen.debug(); // Print DOM tree
});
```

---

## What NOT to Test

- **Animation timings** — Remotion handles frame-accurate rendering
- **Spring physics** — Trust Remotion's implementation
- **CSS computed values** — jsdom doesn't compute styles
- **Pixel-perfect positioning** — Use visual testing (Storybook/Percy) for that

---

## Best Practices

✅ **DO:**

- Mock Remotion hooks at the top of your test file
- Test one concern per test (`it("renders title")`, not `it("renders everything")`)
- Use semantic queries (`getByText`, `getByAltText`) not `getByTestId`
- Keep mocks in sync with your component's actual prop types
- Name test files `*.test.tsx` or `*.spec.tsx`

❌ **DON'T:**

- Mix mocking with actual Remotion imports
- Test implementation details (how many times a hook is called)
- Mock too deeply (mock only the hooks, not the entire library)
- Hardcode frame numbers in tests (use the mocked 0)

---

## Running Tests in CI/CD

If you add tests to GitHub Actions, add this step:

```yaml
- name: Run tests
  run: npm run test
```

The CI will fail if any tests fail, preventing broken code from reaching main.

---

## References

- [Vitest Documentation](https://vitest.dev)
- [Testing Library Documentation](https://testing-library.com/react)
- [Remotion API Reference](https://remotion.dev/docs)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

## Examples

Full examples of tested components:

- **Animations (pure functions):** `src/lib/__tests__/animations.test.ts`
- **Scene components (with mocks):** `src/videos/__tests__/scenes.test.tsx`

Use these as templates when writing tests for new videos.
