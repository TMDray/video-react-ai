import { useEffect } from "react";
import type { PlayerRef } from "@remotion/player";

interface UseKeyboardShortcutsOptions {
  playerRef: React.RefObject<PlayerRef | null>;
  currentFrame: number;
  durationInFrames: number;
  onExport?: () => void;
  onToggleHelp?: () => void;
}

/**
 * Check if the event target is an input or textarea
 */
function isInputFocused(target: EventTarget | null): boolean {
  if (!target) return false;
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

/**
 * Hook to handle global keyboard shortcuts
 */
export function useKeyboardShortcuts({
  playerRef,
  currentFrame,
  durationInFrames,
  onExport,
  onToggleHelp,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Space: play/pause
      if (e.code === "Space" && !isInputFocused(e.target)) {
        e.preventDefault();
        playerRef?.current?.toggle?.();
      }

      // ArrowLeft: step backward one frame
      if (e.key === "ArrowLeft" && !isInputFocused(e.target)) {
        e.preventDefault();
        const newFrame = Math.max(0, currentFrame - 1);
        playerRef?.current?.seekTo?.(newFrame);
      }

      // ArrowRight: step forward one frame
      if (e.key === "ArrowRight" && !isInputFocused(e.target)) {
        e.preventDefault();
        const newFrame = Math.min(durationInFrames - 1, currentFrame + 1);
        playerRef?.current?.seekTo?.(newFrame);
      }

      // Cmd+S or Ctrl+S: export props
      if ((e.metaKey || e.ctrlKey) && e.key === "s" && !isInputFocused(e.target)) {
        e.preventDefault();
        onExport?.();
      }

      // ?: toggle help
      if (e.key === "?" && !isInputFocused(e.target)) {
        e.preventDefault();
        onToggleHelp?.();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [playerRef, currentFrame, durationInFrames, onExport, onToggleHelp]);
}
