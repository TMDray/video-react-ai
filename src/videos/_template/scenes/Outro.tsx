import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../../lib/colors";
import { fontHeading } from "../../../lib/fonts";
import { fadeInOut, fadeIn } from "../../../lib/animations";

interface OutroProps {
  title: string;
  subtitle: string;
  ctaText: string;
}

export const Outro: React.FC<OutroProps> = ({ title, subtitle, ctaText }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeInOut(frame, durationInFrames, 15, 25),
      }}
    >
      <div
        style={{
          fontSize: 44,
          fontWeight: 600,
          fontFamily: fontHeading,
          color: colors.text,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 18,
          fontFamily: fontHeading,
          color: colors.textMuted,
          marginTop: 12,
          opacity: fadeIn(frame, 20, 15),
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          fontSize: 16,
          fontFamily: fontHeading,
          fontWeight: 500,
          color: colors.primary,
          marginTop: 24,
          opacity: fadeIn(frame, 35, 15),
          padding: "10px 24px",
          borderRadius: 8,
        }}
      >
        {ctaText}
      </div>
    </AbsoluteFill>
  );
};
