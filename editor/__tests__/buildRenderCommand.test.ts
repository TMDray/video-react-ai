import { describe, it, expect } from "vitest";
import { buildRenderCommand } from "../src/lib/buildRenderCommand";

describe("buildRenderCommand", () => {
  it("builds a correct render command with simple props", () => {
    const cmd = buildRenderCommand("hello-world-landscape", { headline: "Test Title" });
    expect(cmd).toContain("remotion render src/index.ts hello-world-landscape");
    expect(cmd).toContain("--props");
    expect(cmd).toContain("out/hello-world-landscape.mp4");
  });

  it("handles empty props", () => {
    const cmd = buildRenderCommand("test-short", {});
    expect(cmd).toContain("test-short");
    expect(cmd).toContain("--props '{}'");
  });

  it("escapes single quotes in props", () => {
    const cmd = buildRenderCommand("video-id", { title: "It's a title" });
    expect(cmd).toContain("It\\'s a title");
  });

  it("includes multiple props in JSON", () => {
    const cmd = buildRenderCommand("hello-world-landscape", {
      headline: "Main Title",
      brandName: "Acme",
      ctaText: "Learn More",
    });
    expect(cmd).toContain("headline");
    expect(cmd).toContain("brandName");
    expect(cmd).toContain("ctaText");
  });

  it("handles special characters and spaces in prop values", () => {
    const cmd = buildRenderCommand("video", {
      title: "Hello & Goodbye",
      description: "Line 1, Line 2",
    });
    expect(cmd).toContain('"title":"Hello & Goodbye"');
  });
});
