import type { AudioConfig } from "../../lib/types";

export const audioConfig: AudioConfig = {
  voiceover: {
    voiceId: "pNInz6obpgDQGcFmaJgB", // ElevenLabs "Adam"
    segments: [
      { id: "01-intro", text: "Your intro text here." },
      { id: "02-main", text: "Main narration here." },
      { id: "03-outro", text: "Closing statement." },
    ],
  },
  sfx: [
    // { sfx: "whoosh", frame: 103, durationInFrames: 20, volume: 0.3 },
  ],
  music: {
    src: "audio/music/ambient.wav",
    volume: 0.08,
  },
};
