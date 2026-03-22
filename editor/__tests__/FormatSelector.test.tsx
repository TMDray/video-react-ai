import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormatSelector } from "../src/components/FormatSelector";

describe("FormatSelector", () => {
  it("renders buttons for all formats", () => {
    const onSelect = vi.fn();
    render(<FormatSelector selectedFormatId="landscape" onSelect={onSelect} />);

    expect(screen.getByRole("button", { name: /landscape/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /short/i })).toBeInTheDocument();
  });

  it("calls onSelect when a different format button is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<FormatSelector selectedFormatId="landscape" onSelect={onSelect} />);

    const linkedinBtn = screen.getByRole("button", { name: /linkedin/i });
    await user.click(linkedinBtn);

    expect(onSelect).toHaveBeenCalledWith("linkedin");
  });

  it("displays label", () => {
    const onSelect = vi.fn();
    render(<FormatSelector selectedFormatId="landscape" onSelect={onSelect} />);

    expect(screen.getByText("Format:")).toBeInTheDocument();
  });
});
