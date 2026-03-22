import { Audio, Sequence, staticFile } from "remotion";
import type { SfxCue } from "./types";

/**
 * Renders a full SFX layer from an array of cue definitions.
 * Keeps Composition.tsx clean — just pass your cue sheet.
 *
 * Usage:
 *   <SfxLayer cues={audioConfig.sfx} />
 */
export const SfxLayer: React.FC<{ cues: SfxCue[] }> = ({ cues }) => {
  return (
    <>
      {cues.map((cue, i) => (
        <Sequence
          key={`sfx-${i}-${cue.sfx}`}
          from={cue.frame}
          durationInFrames={cue.durationInFrames}
          name={`SFX-${cue.sfx}`}
        >
          <Audio
            src={staticFile(`audio/sfx/${cue.sfx}.wav`)}
            volume={cue.volume ?? 0.5}
          />
        </Sequence>
      ))}
    </>
  );
};

/**
 * Background music with configurable volume.
 * Supports both local files (path relative to public/) and Jamendo tracks (filename in public/audio/music/).
 */
export const MusicLayer: React.FC<{
  src: string;
  source?: "file" | "jamendo";
  volume?: number;
}> = ({ src, source = "file", volume = 0.08 }) => {
  const musicPath =
    source === "jamendo" ? `audio/music/${src}.mp3` : src;
  return <Audio src={staticFile(musicPath)} volume={volume} />;
};

/**
 * Voiceover track.
 */
export const VoiceoverLayer: React.FC<{
  src: string;
  volume?: number;
}> = ({ src, volume = 1 }) => {
  return <Audio src={staticFile(src)} volume={volume} />;
};
