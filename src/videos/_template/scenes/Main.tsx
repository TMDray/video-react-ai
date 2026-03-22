import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../../../lib/colors";
import { fontBody } from "../../../lib/fonts";
import { fadeIn } from "../../../lib/animations";
import { useFormat } from "../../../lib/useFormat";

interface MainProps {
  body: string;
}

export const Main: React.FC<MainProps> = ({ body }) => {
  const frame = useCurrentFrame();
  const { padding } = useFormat();

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
          fontSize: 32,
          fontFamily: fontBody,
          color: colors.text,
          textAlign: "center",
        }}
      >
        {body}
      </div>
    </AbsoluteFill>
  );
};
