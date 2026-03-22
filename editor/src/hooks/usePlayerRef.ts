import { useRef, useState, useEffect } from "react";
import { PlayerRef } from "@remotion/player";

export function usePlayerRef(durationInFrames: number) {
  const playerRef = useRef<PlayerRef>(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const ref = playerRef.current;
    if (!ref) return;

    const handleFrameUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ frame: number }>;
      setCurrentFrame(customEvent.detail.frame);
    };

    ref.addEventListener("frameupdate", handleFrameUpdate);
    return () => ref.removeEventListener("frameupdate", handleFrameUpdate);
  }, []);

  return { playerRef, currentFrame, durationInFrames };
}
