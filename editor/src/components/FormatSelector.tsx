import React from "react";
import { FormatId } from "@/lib/types";
import { ALL_FORMAT_IDS } from "@/lib/formats";
import styles from "./FormatSelector.module.css";

interface FormatSelectorProps {
  selectedFormatId: FormatId;
  onSelect: (formatId: FormatId) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ selectedFormatId, onSelect }) => {
  return (
    <div className={styles.container}>
      <label>Format:</label>
      <div className={styles.buttons}>
        {ALL_FORMAT_IDS.map((formatId) => (
          <button
            key={formatId}
            className={`${styles.button} ${selectedFormatId === formatId ? styles.active : ""}`}
            onClick={() => onSelect(formatId)}
          >
            {formatId}
          </button>
        ))}
      </div>
    </div>
  );
};
