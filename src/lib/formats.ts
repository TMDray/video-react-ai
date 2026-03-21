import type { FormatConfig, FormatId } from "./types";

export const FORMATS: Record<FormatId, FormatConfig> = {
  landscape: { id: "landscape", width: 1920, height: 1080, label: "16:9 Landscape" },
  linkedin: { id: "linkedin", width: 1080, height: 1350, label: "4:5 LinkedIn" },
  short: { id: "short", width: 1080, height: 1920, label: "9:16 Short" },
} as const;

export const ALL_FORMAT_IDS: FormatId[] = ["landscape", "linkedin", "short"];
