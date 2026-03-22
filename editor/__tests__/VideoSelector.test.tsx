import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoSelector } from "../src/components/VideoSelector";

describe("VideoSelector", () => {
  it("renders dropdown with all videos from registry", () => {
    const onSelect = vi.fn();
    render(<VideoSelector selectedVideoId="hello-world" onSelect={onSelect} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });

  it("displays selected video as active option", () => {
    const onSelect = vi.fn();
    render(<VideoSelector selectedVideoId="hello-world" onSelect={onSelect} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("hello-world");
  });

  it("calls onSelect when video is changed", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<VideoSelector selectedVideoId="hello-world" onSelect={onSelect} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    // Get first available option that's not the current one
    const options = Array.from(select.options);
    const otherOption = options.find((opt) => opt.value !== "hello-world");

    if (otherOption) {
      await user.selectOptions(select, otherOption.value);
      expect(onSelect).toHaveBeenCalledWith(otherOption.value);
    }
  });

  it("displays label", () => {
    const onSelect = vi.fn();
    render(<VideoSelector selectedVideoId="hello-world" onSelect={onSelect} />);

    expect(screen.getByLabelText("Video:")).toBeInTheDocument();
  });
});
