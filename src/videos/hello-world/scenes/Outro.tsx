import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { colors, primaryGlow } from "../../../lib/colors";
import { fontHeading } from "../../../lib/fonts";
import { fadeInOut, fadeIn } from "../../../lib/animations";

interface OutroProps {
  brandName: string;
  tagline: string;
  ctaText: string;
  logoUrl: string;
}

export const Outro: React.FC<OutroProps> = ({
  brandName,
  tagline,
  ctaText,
  logoUrl,
}) => {
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
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Img
          src={staticFile(logoUrl)}
          style={{ width: 56, height: 56 }}
        />
        <div
          style={{
            fontSize: 48,
            fontWeight: 600,
            fontFamily: fontHeading,
            color: colors.text,
            letterSpacing: "0.05em",
          }}
        >
          {brandName}
        </div>
      </div>

      <div
        style={{
          fontSize: 20,
          fontFamily: fontHeading,
          fontWeight: 400,
          color: colors.textMuted,
          marginTop: 12,
          opacity: fadeIn(frame, 20, 15),
        }}
      >
        {tagline}
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
          border: `1px solid ${primaryGlow(0.4)}`,
          boxShadow: `0 0 20px ${primaryGlow(0.2)}`,
        }}
      >
        {ctaText}
      </div>
    </AbsoluteFill>
  );
};
