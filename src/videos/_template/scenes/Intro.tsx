import {
  AbsoluteFill,
  Img,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { colors, primaryGlow } from "../../../lib/colors";
import { fontHeading } from "../../../lib/fonts";
import { fadeIn, glowPulse } from "../../../lib/animations";

interface IntroProps {
  title: string;
  logoUrl: string;
}

export const Intro: React.FC<IntroProps> = ({ title, logoUrl }) => {
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
        }}
      >
        <Img src={staticFile(logoUrl)} style={{ width: 120, height: 120 }} />
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          fontFamily: fontHeading,
          color: colors.text,
          marginTop: 20,
          opacity: fadeIn(frame, 15, 10),
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};
