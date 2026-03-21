import { AbsoluteFill } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { colors } from "../../lib/colors";
import { fadePresentation, springTiming } from "../../lib/transitions";
import { SfxLayer, MusicLayer } from "../../lib/audio";
import { audioConfig } from "./audio.config";
import { config } from "./config";
import { Intro } from "./scenes/Intro";
import { Main } from "./scenes/Main";
import { Outro } from "./scenes/Outro";

export const TemplateComposition: React.FC = () => {
  const t = config.transitionDuration;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={config.scenes.intro.duration}>
          <Intro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fadePresentation()}
          timing={springTiming(t)}
        />

        <TransitionSeries.Sequence durationInFrames={config.scenes.main.duration}>
          <Main />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fadePresentation()}
          timing={springTiming(t)}
        />

        <TransitionSeries.Sequence durationInFrames={config.scenes.outro.duration}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <SfxLayer cues={audioConfig.sfx} />
      {audioConfig.music && (
        <MusicLayer src={audioConfig.music.src} volume={audioConfig.music.volume} />
      )}
    </AbsoluteFill>
  );
};
