import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEditorState } from "../src/hooks/useEditorState";

describe("useEditorState", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("initializes with default state", () => {
    const { result } = renderHook(() => useEditorState());

    expect(result.current.state.selectedVideoId).toBe("hello-world");
    expect(result.current.state.selectedFormatId).toBe("landscape");
    expect(result.current.state.props).toEqual({});
  });

  it("persists state to localStorage", () => {
    const { result } = renderHook(() => useEditorState());

    act(() => {
      result.current.setVideoId("_template");
    });

    const stored = JSON.parse(localStorage.getItem("editor-state") || "{}");
    expect(stored.selectedVideoId).toBe("_template");
  });

  it("restores state from localStorage", () => {
    // Set initial state in localStorage
    localStorage.setItem(
      "editor-state",
      JSON.stringify({
        selectedVideoId: "_template",
        selectedFormatId: "short",
        props: { title: "Test" },
      })
    );

    const { result } = renderHook(() => useEditorState());

    expect(result.current.state.selectedVideoId).toBe("_template");
    expect(result.current.state.selectedFormatId).toBe("short");
    expect(result.current.state.props).toEqual({ title: "Test" });
  });

  it("updates video ID", () => {
    const { result } = renderHook(() => useEditorState());

    act(() => {
      result.current.setVideoId("_template");
    });

    expect(result.current.state.selectedVideoId).toBe("_template");
  });

  it("updates format ID", () => {
    const { result } = renderHook(() => useEditorState());

    act(() => {
      result.current.setFormatId("short");
    });

    expect(result.current.state.selectedFormatId).toBe("short");
  });

  it("updates props", () => {
    const { result } = renderHook(() => useEditorState());

    const newProps = { headline: "New Headline", brandName: "MyBrand" };
    act(() => {
      result.current.setProps(newProps);
    });

    expect(result.current.state.props).toEqual(newProps);
  });
});
