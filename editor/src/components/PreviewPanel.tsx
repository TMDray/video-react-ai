import React from "react";
import { PlayerRef, Player } from "@remotion/player";
import { VideoEntry } from "@/lib/types";
import { FORMATS } from "@/lib/formats";
import { FormatId } from "@/lib/types";
import styles from "./PreviewPanel.module.css";

interface PreviewPanelProps {
  entry: VideoEntry;
  formatId: FormatId;
  props: Record<string, unknown>;
  playerRef?: React.RefObject<PlayerRef | null>;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  entry,
  formatId,
  props,
  playerRef,
}) => {
  const format = FORMATS[formatId];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Preview</h3>
        <span className={styles.info}>{format.label}</span>
      </div>
      <div className={styles.playerWrapper}>
        <Player
          ref={playerRef}
          component={entry.component}
          compositionWidth={format.width}
          compositionHeight={format.height}
          durationInFrames={entry.durationInFrames}
          fps={entry.fps}
          inputProps={props}
          controls
          numberOfSharedAudioTags={0}
          acknowledgeRemotionLicense
          errorFallback={({ error }) => (
            <div className={styles.errorFallback}>
              <p className={styles.errorTitle}>Rendering Error</p>
              <p className={styles.errorMessage}>{error.message}</p>
            </div>
          )}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
};
