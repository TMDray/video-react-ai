import { FormatId } from "@/lib/types";

/**
 * Combine video ID + format ID into a Remotion composition ID
 * @example formatCompositionId("hello-world", "landscape") => "hello-world-landscape"
 */
export function formatCompositionId(videoId: string, formatId: FormatId): string {
  return `${videoId}-${formatId}`;
}
