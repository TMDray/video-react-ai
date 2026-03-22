import { AbsoluteFill } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { colors } from "../../lib/colors";
import { SceneErrorBoundary } from "../../lib/SceneErrorBoundary";
import { fadePresentation, springTiming } from "../../lib/transitions";
import { SfxLayer, MusicLayer } from "../../lib/audio";
import { audioConfig } from "./audio.config";
import { config } from "./config";
import { Intro } from "./scenes/Intro";
import { Main } from "./scenes/Main";
import { Outro } from "./scenes/Outro";
import type { HelloWorldProps } from "./schema";

/**
 * hello-world — 15s (450 frames @ 30fps)
 *
 * Uses TransitionSeries for smooth scene transitions.
 * Audio is declared in audio.config.ts and rendered via SfxLayer/MusicLayer.
 * All text content is parameterized via HelloWorldProps for CMS integration.
 */
export const HelloWorldComposition: React.FC<HelloWorldProps> = (props) => {
  const t = config.transitionDuration;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* ═══ SCENES with transitions ═══ */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={config.scenes.intro.duration}>
          <SceneErrorBoundary>
            <Intro brandName={props.brandName} tagline={props.tagline} logoUrl={props.logoUrl} />
          </SceneErrorBoundary>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fadePresentation()} timing={springTiming(t)} />

        <TransitionSeries.Sequence durationInFrames={config.scenes.main.duration}>
          <SceneErrorBoundary>
            <Main headline={props.headline} />
          </SceneErrorBoundary>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fadePresentation()} timing={springTiming(t)} />

        <TransitionSeries.Sequence durationInFrames={config.scenes.outro.duration}>
          <SceneErrorBoundary>
            <Outro
              brandName={props.brandName}
              tagline={props.tagline}
              ctaText={props.ctaText}
              logoUrl={props.logoUrl}
            />
          </SceneErrorBoundary>
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* ═══ AUDIO ═══ */}
      <SfxLayer cues={audioConfig.sfx} />
      {audioConfig.music && (
        <MusicLayer src={audioConfig.music.src} volume={audioConfig.music.volume} />
      )}
    </AbsoluteFill>
  );
};
