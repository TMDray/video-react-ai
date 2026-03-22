import React, { useState } from "react";
import { usePresets, Preset } from "../hooks/usePresets";
import styles from "./PresetPanel.module.css";

interface PresetPanelProps {
  videoId: string;
  currentProps: Record<string, unknown>;
  onLoadPreset: (props: Record<string, unknown>) => void;
}

export const PresetPanel: React.FC<PresetPanelProps> = ({
  videoId,
  currentProps,
  onLoadPreset,
}) => {
  const { presets: allPresets, savePreset, deletePreset } = usePresets(videoId);
  const [presetName, setPresetName] = useState("");

  const videoPresets = allPresets.filter((p) => p.videoId === videoId);

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    savePreset(presetName, currentProps);
    setPresetName("");
  };

  const handleLoadPreset = (preset: Preset) => {
    onLoadPreset(preset.props);
  };

  return (
    <div className={styles.panel}>
      <h4 className={styles.title}>Presets</h4>

      {/* Save new preset */}
      <div className={styles.saveSection}>
        <input
          type="text"
          placeholder="Preset name..."
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSavePreset();
            }
          }}
          className={styles.input}
        />
        <button
          type="button"
          onClick={handleSavePreset}
          disabled={!presetName.trim()}
          className={styles.saveBtn}
        >
          Save
        </button>
      </div>

      {/* Presets list */}
      <div className={styles.list}>
        {videoPresets.length === 0 ? (
          <p className={styles.empty}>No presets yet</p>
        ) : (
          videoPresets.map((preset) => (
            <div key={preset.id} className={styles.item}>
              <button
                type="button"
                onClick={() => handleLoadPreset(preset)}
                className={styles.loadBtn}
              >
                {preset.name}
              </button>
              <button
                type="button"
                onClick={() => deletePreset(preset.id)}
                className={styles.deleteBtn}
                title="Delete preset"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
