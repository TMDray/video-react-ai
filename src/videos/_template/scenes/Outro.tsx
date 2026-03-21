import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { brand } from "../../../brand.config";
import { colors } from "../../../lib/colors";
import { fontHeading } from "../../../lib/fonts";
import { fadeInOut, fadeIn } from "../../../lib/animations";

export const Outro: React.FC = () => {
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
        <Img src={staticFile(brand.logo)} style={{ width: 48, height: 48 }} />
        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            fontFamily: fontHeading,
            color: colors.text,
          }}
        >
          {brand.name}
        </div>
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
        {brand.tagline}
      </div>
    </AbsoluteFill>
  );
};
