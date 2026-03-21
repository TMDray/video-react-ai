export const config = {
  fps: 30,
  durationInFrames: 450, // 15s
  scenes: {
    intro: { from: 0, duration: 120 },
    main: { from: 105, duration: 225 },
    outro: { from: 315, duration: 135 },
  },
  transitionDuration: 15,
} as const;
