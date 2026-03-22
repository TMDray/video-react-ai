import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../../lib/colors";
import { fontHeading, fontBody } from "../../../lib/fonts";
import { fadeIn, scaleIn } from "../../../lib/animations";
import { useFormat } from "../../../lib/useFormat";
import { FeatureCard } from "../components/FeatureCard";

interface MainProps {
  headline: string;
}

export const Main: React.FC<MainProps> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isPortrait, padding } = useFormat();

  const titleScale = scaleIn(frame, fps, "snappy");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding,
        opacity: fadeIn(frame),
      }}
    >
      <div
        style={{
          transform: `scale(${titleScale})`,
          fontSize: isPortrait ? 28 : 36,
          fontWeight: 700,
          fontFamily: fontHeading,
          color: colors.text,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        {headline}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: isPortrait ? "column" : "row",
          gap: 20,
          alignItems: "center",
        }}
      >
        <FeatureCard
          icon="🎬"
          title="Scenes"
          description="Compose with React components"
          delay={10}
        />
        <FeatureCard icon="🎵" title="Audio" description="SFX, music & voiceover sync" delay={20} />
        <FeatureCard
          icon="📐"
          title="Multi-format"
          description="Landscape, LinkedIn & Short"
          delay={30}
        />
      </div>

      <div
        style={{
          fontSize: isPortrait ? 14 : 16,
          fontFamily: fontBody,
          color: colors.textMuted,
          marginTop: 32,
          opacity: fadeIn(frame, 40, 15),
          textAlign: "center",
        }}
      >
        Powered by Remotion + React + Tailwind
      </div>
    </AbsoluteFill>
  );
};
