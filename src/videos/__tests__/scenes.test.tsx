import { vi, describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

/**
 * Mock Remotion hooks before importing scene components.
 * These hooks require a Remotion composition context to work.
 */
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
      id: "test-composition",
    })),
    staticFile: (path: string) => path,
    Img: ({ src, style }: { src: string; style?: React.CSSProperties }) => (
      <img src={src} style={style} alt="test-image" />
    ),
    AbsoluteFill: ({
      children,
      style,
    }: {
      children: React.ReactNode;
      style?: React.CSSProperties;
    }) => (
      <div style={{ position: "absolute", inset: 0, ...style }} data-testid="absolute-fill">
        {children}
      </div>
    ),
    spring: vi.fn((config: any) => {
      // Basic spring simulation: return value between 0.8 and 1.2 based on frame
      return 0.8 + (config.frame % 10) * 0.04;
    }),
    interpolate: vi.fn((frame: number, inputRange: number[], outputRange: number[]) => {
      // Simple linear interpolation
      const [inMin, inMax] = inputRange;
      const [outMin, outMax] = outputRange;
      if (frame <= inMin) return outMin;
      if (frame >= inMax) return outMax;
      return outMin + ((frame - inMin) / (inMax - inMin)) * (outMax - outMin);
    }),
  };
});

/**
 * Mock @/lib/useFormat to avoid additional Remotion context requirements.
 */
vi.mock("../../lib/useFormat", () => ({
  useFormat: vi.fn(() => ({
    format: {
      id: "landscape",
      width: 1920,
      height: 1080,
      label: "Landscape",
    },
    isPortrait: false,
    scaleFactor: 1,
    padding: 80,
  })),
}));

/**
 * Import scene components AFTER mocking.
 */
import { Intro as HelloWorldIntro } from "../hello-world/scenes/Intro";
import { Main as HelloWorldMain } from "../hello-world/scenes/Main";
import { Outro as HelloWorldOutro } from "../hello-world/scenes/Outro";
import { Intro as TemplateIntro } from "../_template/scenes/Intro";
import { Main as TemplateMain } from "../_template/scenes/Main";
import { Outro as TemplateOutro } from "../_template/scenes/Outro";

/**
 * Hello World Scene Tests
 */
describe("HelloWorld Scenes", () => {
  describe("Intro", () => {
    it("renders brandName", () => {
      render(<HelloWorldIntro brandName="Acme Corp" tagline="Test tagline" logoUrl="logo.svg" />);
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    });

    it("renders tagline", () => {
      render(
        <HelloWorldIntro brandName="Acme" tagline="Build better software" logoUrl="logo.svg" />
      );
      expect(screen.getByText("Build better software")).toBeInTheDocument();
    });

    it("renders logo image", () => {
      render(<HelloWorldIntro brandName="Acme" tagline="Tagline" logoUrl="custom-logo.png" />);
      const img = screen.getByAltText("test-image");
      expect(img).toHaveAttribute("src", "custom-logo.png");
    });
  });

  describe("Main", () => {
    it("renders headline", () => {
      render(<HelloWorldMain headline="Build videos with code" />);
      expect(screen.getByText("Build videos with code")).toBeInTheDocument();
    });

    it("renders feature cards", () => {
      render(<HelloWorldMain headline="Test headline" />);
      expect(screen.getByText("Scenes")).toBeInTheDocument();
      expect(screen.getByText("Audio")).toBeInTheDocument();
      expect(screen.getByText("Multi-format")).toBeInTheDocument();
    });

    it("renders feature descriptions", () => {
      render(<HelloWorldMain headline="Test" />);
      expect(screen.getByText("Compose with React components")).toBeInTheDocument();
      expect(screen.getByText("SFX, music & voiceover sync")).toBeInTheDocument();
      expect(screen.getByText("Landscape, LinkedIn & Short")).toBeInTheDocument();
    });

    it("renders footer text", () => {
      render(<HelloWorldMain headline="Test" />);
      expect(screen.getByText(/Powered by Remotion/)).toBeInTheDocument();
    });
  });

  describe("Outro", () => {
    it("renders brandName", () => {
      render(
        <HelloWorldOutro
          brandName="Acme"
          tagline="Tagline"
          ctaText="Get Started"
          logoUrl="logo.svg"
        />
      );
      expect(screen.getByText("Acme")).toBeInTheDocument();
    });

    it("renders tagline", () => {
      render(
        <HelloWorldOutro
          brandName="Acme"
          tagline="Your next best thing"
          ctaText="Get Started"
          logoUrl="logo.svg"
        />
      );
      expect(screen.getByText("Your next best thing")).toBeInTheDocument();
    });

    it("renders CTA text", () => {
      render(
        <HelloWorldOutro
          brandName="Acme"
          tagline="Tagline"
          ctaText="Try for Free"
          logoUrl="logo.svg"
        />
      );
      expect(screen.getByText("Try for Free")).toBeInTheDocument();
    });

    it("renders logo image", () => {
      render(
        <HelloWorldOutro
          brandName="Acme"
          tagline="Tagline"
          ctaText="CTA"
          logoUrl="small-logo.png"
        />
      );
      const img = screen.getByAltText("test-image");
      expect(img).toHaveAttribute("src", "small-logo.png");
    });
  });
});

/**
 * Template Scene Tests
 */
describe("Template Scenes", () => {
  describe("Intro", () => {
    it("renders title", () => {
      render(<TemplateIntro title="Template Title" logoUrl="logo.svg" />);
      expect(screen.getByText("Template Title")).toBeInTheDocument();
    });

    it("renders logo image", () => {
      render(<TemplateIntro title="Title" logoUrl="template-logo.png" />);
      const img = screen.getByAltText("test-image");
      expect(img).toHaveAttribute("src", "template-logo.png");
    });
  });

  describe("Main", () => {
    it("renders body text", () => {
      render(<TemplateMain body="This is the main body text" />);
      expect(screen.getByText("This is the main body text")).toBeInTheDocument();
    });

    it("handles long body text", () => {
      const longText =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.";
      render(<TemplateMain body={longText} />);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });

  describe("Outro", () => {
    it("renders title", () => {
      render(<TemplateOutro title="Template Title" subtitle="Subtitle" ctaText="Learn More" />);
      expect(screen.getByText("Template Title")).toBeInTheDocument();
    });

    it("renders subtitle", () => {
      render(<TemplateOutro title="Title" subtitle="This is the subtitle" ctaText="Learn More" />);
      expect(screen.getByText("This is the subtitle")).toBeInTheDocument();
    });

    it("renders CTA text", () => {
      render(<TemplateOutro title="Title" subtitle="Subtitle" ctaText="Subscribe Now" />);
      expect(screen.getByText("Subscribe Now")).toBeInTheDocument();
    });
  });
});
