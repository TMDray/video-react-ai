/**
 * hello-world — 15s (450 frames @ 30fps)
 *
 * | Scene  | From | Dur | Time         |
 * |--------|------|-----|--------------|
 * | Intro  |    0 | 120 | 0s  → 4s     |
 * | Main   |  105 | 225 | 3.5s → 11s   |
 * | Outro  |  315 | 135 | 10.5s → 15s  |
 *
 * Overlaps of 15 frames = transition duration.
 */
export const config = {
  fps: 30,
  durationInFrames: 450,
  scenes: {
    intro: { from: 0, duration: 120 },
    main: { from: 105, duration: 225 },
    outro: { from: 315, duration: 135 },
  },
  transitionDuration: 15,
} as const;
