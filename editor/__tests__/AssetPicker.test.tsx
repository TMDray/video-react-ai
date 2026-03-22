import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssetPicker } from "../src/components/AssetPicker";

describe("AssetPicker", () => {
  beforeEach(() => {
    // Mock fetch for asset list

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            "logo-placeholder.svg",
            "audio/sfx/whoosh.wav",
            "audio/music/ambient.mp3",
            "images/hero.png",
            "videos/intro.mp4",
          ]),
      })
    ) as any;
  });

  it("renders the dialog with title", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<AssetPicker onSelect={onSelect} onClose={onClose} />);

    await waitFor(() => {
      expect(screen.getByText("Select Asset")).toBeInTheDocument();
    });
  });

  it("displays filter buttons", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<AssetPicker onSelect={onSelect} onClose={onClose} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /images/i })).toBeInTheDocument();
    });
  });

  it("has a close button", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<AssetPicker onSelect={onSelect} onClose={onClose} />);

    const closeBtn = screen.getByRole("button", { name: "✕" });
    expect(closeBtn).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<AssetPicker onSelect={onSelect} onClose={onClose} />);

    const closeBtn = screen.getByRole("button", { name: "✕" });
    await user.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
