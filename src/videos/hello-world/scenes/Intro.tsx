import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { colors, primaryGlow } from "../../../lib/colors";
import { fontHeading } from "../../../lib/fonts";
import { fadeIn, glowPulse } from "../../../lib/animations";

interface IntroProps {
  brandName: string;
  tagline: string;
  logoUrl: string;
}

export const Intro: React.FC<IntroProps> = ({ brandName, tagline, logoUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn(frame, 0, 8),
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          filter: `drop-shadow(0 0 ${glowPulse(frame)}px ${primaryGlow(0.5)})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Img src={staticFile(logoUrl)} style={{ width: 140, height: 140 }} />
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 600,
          fontFamily: fontHeading,
          color: colors.text,
          letterSpacing: "0.05em",
          marginTop: 20,
          opacity: fadeIn(frame, 15, 10),
        }}
      >
        {brandName}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 300,
          fontFamily: fontHeading,
          color: colors.textMuted,
          letterSpacing: "0.08em",
          marginTop: 8,
          opacity: fadeIn(frame, 25, 10),
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};
