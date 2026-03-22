import React from "react";
import { Player } from "@remotion/player";
import { VideoEntry } from "@/lib/types";
import { FORMATS } from "@/lib/formats";
import { FormatId } from "@/lib/types";
import styles from "./PreviewPanel.module.css";

interface PreviewPanelProps {
  entry: VideoEntry;
  formatId: FormatId;
  props: Record<string, unknown>;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ entry, formatId, props }) => {
  const format = FORMATS[formatId];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Preview</h3>
        <span className={styles.info}>{format.label}</span>
      </div>
      <div className={styles.playerWrapper}>
        <Player
          component={entry.component}
          compositionWidth={format.width}
          compositionHeight={format.height}
          durationInFrames={entry.durationInFrames}
          fps={entry.fps}
          inputProps={props}
          controls
          numberOfSharedAudioTags={0}
          acknowledgeRemotionLicense
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
};
