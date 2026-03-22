import React from "react";
import { PlayerRef } from "@remotion/player";
import styles from "./TimelineControls.module.css";

interface TimelineControlsProps {
  playerRef: React.RefObject<PlayerRef | null>;
  currentFrame: number;
  durationInFrames: number;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  playerRef,
  currentFrame,
  durationInFrames,
}) => {
  const handlePrevFrame = () => {
    if (playerRef.current && currentFrame > 0) {
      playerRef.current.seekTo(currentFrame - 1);
    }
  };

  const handleNextFrame = () => {
    if (playerRef.current && currentFrame < durationInFrames - 1) {
      playerRef.current.seekTo(currentFrame + 1);
    }
  };

  const handleScrubber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frame = parseInt(e.target.value, 10);
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
    }
  };

  return (
    <div className={styles.controls}>
      <button
        onClick={handlePrevFrame}
        disabled={currentFrame === 0}
        title="Previous frame (←)"
        className={styles.button}
      >
        ◀
      </button>

      <input
        type="range"
        min="0"
        max={durationInFrames - 1}
        value={currentFrame}
        onChange={handleScrubber}
        className={styles.scrubber}
        title="Scrub timeline"
      />

      <button
        onClick={handleNextFrame}
        disabled={currentFrame === durationInFrames - 1}
        title="Next frame (→)"
        className={styles.button}
      >
        ▶
      </button>

      <span className={styles.frameCounter}>
        {currentFrame} / {durationInFrames}
      </span>
    </div>
  );
};
