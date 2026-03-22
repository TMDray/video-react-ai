import React from "react";
import { buildRenderCommand } from "../lib/buildRenderCommand";
import { formatCompositionId } from "../lib/formatCompositionId";
import { FormatId } from "@/lib/types";
import styles from "./RenderCommand.module.css";

interface RenderCommandProps {
  videoId: string;
  formatId: FormatId;
  props: Record<string, unknown>;
}

export const RenderCommand: React.FC<RenderCommandProps> = ({ videoId, formatId, props }) => {
  const compositionId = formatCompositionId(videoId, formatId);
  const command = buildRenderCommand(compositionId, props);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command).catch(() => {
      alert("Failed to copy to clipboard");
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>Render Command:</div>
      <pre className={styles.pre}>
        <code>{command}</code>
      </pre>
      <button className={styles.copyBtn} onClick={copyToClipboard}>
        📋 Copy
      </button>
    </div>
  );
};
