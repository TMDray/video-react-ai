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
import type { TemplateProps } from "./schema";

export const TemplateComposition: React.FC<TemplateProps> = (props) => {
  const t = config.transitionDuration;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={config.scenes.intro.duration}>
          <SceneErrorBoundary>
            <Intro title={props.title} logoUrl={props.logoUrl} />
          </SceneErrorBoundary>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fadePresentation()} timing={springTiming(t)} />

        <TransitionSeries.Sequence durationInFrames={config.scenes.main.duration}>
          <SceneErrorBoundary>
            <Main body={props.body} />
          </SceneErrorBoundary>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fadePresentation()} timing={springTiming(t)} />

        <TransitionSeries.Sequence durationInFrames={config.scenes.outro.duration}>
          <SceneErrorBoundary>
            <Outro title={props.title} subtitle={props.subtitle} ctaText={props.ctaText} />
          </SceneErrorBoundary>
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <SfxLayer cues={audioConfig.sfx} />
      {audioConfig.music && (
        <MusicLayer
          src={audioConfig.music.src}
          source={audioConfig.music.source}
          volume={audioConfig.music.volume}
        />
      )}
    </AbsoluteFill>
  );
};
