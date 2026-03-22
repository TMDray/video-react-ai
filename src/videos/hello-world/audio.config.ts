import type { AudioConfig } from "../../lib/types";

export const audioConfig: AudioConfig = {
  voiceover: {
    voiceId: "pNInz6obpgDQGcFmaJgB", // ElevenLabs "Adam"
    voiceSettings: {
      stability: 0.6,
      similarityBoost: 0.8,
      style: 0.2,
    },
    segments: [
      { id: "01-intro", text: "Welcome. This is your video template.", fromFrame: 0, toFrame: 119 },
      {
        id: "02-main",
        text: "Everything you see is built with code. Fully customizable.",
        fromFrame: 105,
        toFrame: 329,
      },
      { id: "03-outro", text: "Get started today.", fromFrame: 315, toFrame: 449 },
    ],
  },
  sfx: [
    { sfx: "whoosh", frame: 103, durationInFrames: 20, volume: 0.3 },
    { sfx: "success-ding", frame: 200, durationInFrames: 30, volume: 0.4 },
    { sfx: "whoosh", frame: 313, durationInFrames: 20, volume: 0.25 },
  ],
  music: {
    source: "file",
    src: "audio/music/ambient.wav",
    volume: 0.08,
  },
};
