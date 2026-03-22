import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RenderCommand } from "../src/components/RenderCommand";

describe("RenderCommand", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });
  });

  it("renders the render command text", () => {
    render(
      <RenderCommand videoId="hello-world" formatId="landscape" props={{ headline: "Test" }} />
    );

    expect(screen.getByText(/Render Command:/)).toBeInTheDocument();
  });

  it("includes composition ID in command", () => {
    const { container } = render(
      <RenderCommand videoId="hello-world" formatId="landscape" props={{ headline: "Test" }} />
    );

    const preElement = container.querySelector("pre");
    expect(preElement?.textContent).toContain("hello-world-landscape");
  });

  it("has a copy button", () => {
    render(<RenderCommand videoId="hello-world" formatId="landscape" props={{}} />);

    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("copy button is clickable", async () => {
    const user = userEvent.setup();
    render(
      <RenderCommand videoId="hello-world" formatId="landscape" props={{ headline: "Test" }} />
    );

    const copyBtn = screen.getByRole("button", { name: /copy/i });
    // Just verify it's clickable without verifying clipboard
    await user.click(copyBtn);
    expect(copyBtn).toBeEnabled();
  });
});
