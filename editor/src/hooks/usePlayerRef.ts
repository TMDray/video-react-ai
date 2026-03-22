import { useRef, useState, useEffect } from "react";
import type { PlayerRef, CallbackListener } from "@remotion/player";

export function usePlayerRef(durationInFrames: number) {
  const playerRef = useRef<PlayerRef | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const ref = playerRef.current;
    if (!ref) return;

    const handleFrameUpdate: CallbackListener<"frameupdate"> = ({ detail }) => {
      setCurrentFrame(detail.frame);
    };

    ref.addEventListener("frameupdate", handleFrameUpdate);
    return () => ref.removeEventListener("frameupdate", handleFrameUpdate);
  }, []);

  return { playerRef, currentFrame, durationInFrames };
}
