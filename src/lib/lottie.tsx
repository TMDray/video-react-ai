import { Lottie, LottieAnimationData } from "@remotion/lottie";
import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

/**
 * Load a Lottie JSON file from public/ and render it synchronized with Remotion's timeline.
 *
 * Usage:
 *   <LottieAsset src="lottie/confetti.json" />
 *   <LottieAsset src="lottie/check.json" style={{ width: 200 }} loop />
 */
export const LottieAsset: React.FC<{
  /** Path relative to public/ (e.g. "lottie/confetti.json") */
  src: string;
  style?: React.CSSProperties;
  /** Loop the animation (default: false) */
  loop?: boolean;
  /** Playback speed multiplier (default: 1) */
  playbackRate?: number;
}> = ({ src, style, loop = false, playbackRate = 1 }) => {
  const [animationData, setAnimationData] =
    useState<LottieAnimationData | null>(null);
  const [handle] = useState(() => delayRender("Loading Lottie animation"));

  useEffect(() => {
    fetch(staticFile(src))
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data as LottieAnimationData);
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [src, handle]);

  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      style={style}
      loop={loop}
      playbackRate={playbackRate}
    />
  );
};
