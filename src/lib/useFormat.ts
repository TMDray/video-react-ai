import { useVideoConfig } from "remotion";
import type { FormatId } from "./types";

/**
 * Detects the current rendering format from video dimensions.
 * Use this to build format-responsive scenes.
 *
 * Usage:
 *   const { format, isPortrait } = useFormat();
 *   const fontSize = isPortrait ? 24 : 32;
 */
export function useFormat() {
  const { width, height } = useVideoConfig();
  const ratio = width / height;

  let format: FormatId;
  if (ratio > 1.5) format = "landscape";
  else if (ratio < 0.7) format = "short";
  else format = "linkedin";

  return {
    format,
    isPortrait: format === "short" || format === "linkedin",
    isLandscape: format === "landscape",
    /** Scale factor relative to 1920px width */
    scaleFactor: width / 1920,
    /** Suggested padding based on format */
    padding: format === "landscape" ? 80 : 48,
  };
}
