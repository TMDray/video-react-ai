import { interpolate, spring, type SpringConfig } from "remotion";

// ── Spring presets ────────────────────────────────────────

export const SPRING: Record<string, Partial<SpringConfig>> = {
  gentle: { damping: 15, stiffness: 80, mass: 0.8 },
  snappy: { damping: 12, stiffness: 200, mass: 0.5 },
  bouncy: { damping: 8, stiffness: 150, mass: 0.6 },
  heavy: { damping: 20, stiffness: 60, mass: 1.2 },
};

export type SpringPreset = keyof typeof SPRING;

// ── Fade helpers ──────────────────────────────────────────

export function fadeIn(frame: number, startAt = 0, duration = 10): number {
  return interpolate(frame, [startAt, startAt + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function fadeOut(frame: number, endAt: number, duration = 10): number {
  return interpolate(frame, [endAt - duration, endAt], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function fadeInOut(
  frame: number,
  totalDuration: number,
  fadeInDur = 10,
  fadeOutDur = 15
): number {
  return interpolate(
    frame,
    [0, fadeInDur, totalDuration - fadeOutDur, totalDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

// ── Motion helpers ────────────────────────────────────────

export function slideIn(
  frame: number,
  fps: number,
  direction: "left" | "right" | "up" | "down" = "up",
  preset: SpringPreset = "gentle"
): { translateX: number; translateY: number } {
  const progress = spring({ frame, fps, config: SPRING[preset] });
  const d = 60;
  const map: Record<string, { translateX: number; translateY: number }> = {
    left: { translateX: interpolate(progress, [0, 1], [-d, 0]), translateY: 0 },
    right: { translateX: interpolate(progress, [0, 1], [d, 0]), translateY: 0 },
    up: { translateX: 0, translateY: interpolate(progress, [0, 1], [d, 0]) },
    down: { translateX: 0, translateY: interpolate(progress, [0, 1], [-d, 0]) },
  };
  return map[direction];
}

export function scaleIn(frame: number, fps: number, preset: SpringPreset = "gentle"): number {
  return spring({ frame, fps, config: SPRING[preset] });
}

// ── Effect helpers ────────────────────────────────────────

export function glowPulse(frame: number, speed = 0.15, min = 20, max = 40): number {
  return interpolate(Math.sin(frame * speed), [-1, 1], [min, max]);
}

export function typewriter(frame: number, text: string, startAt = 0, charsPerFrame = 0.8): number {
  const elapsed = Math.max(0, frame - startAt);
  return Math.min(Math.floor(elapsed * charsPerFrame), text.length);
}

export function loadingDots(frame: number, interval = 8, maxDots = 3): string {
  return ".".repeat((Math.floor(frame / interval) % maxDots) + 1);
}

export function spinnerRotation(frame: number, speed = 12): number {
  return frame * speed;
}
