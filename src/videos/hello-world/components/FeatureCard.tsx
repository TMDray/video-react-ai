import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../../lib/colors";
import { fontBody } from "../../../lib/fonts";

export const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  delay?: number;
}> = ({ icon, title, description, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);
  const scale = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.6 },
  });
  const opacity = interpolate(adjustedFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        minWidth: 280,
      }}
    >
      <div style={{ fontSize: 36, flexShrink: 0 }}>{icon}</div>
      <div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            fontFamily: fontBody,
            color: colors.text,
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 14,
            fontFamily: fontBody,
            color: colors.textMuted,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};
