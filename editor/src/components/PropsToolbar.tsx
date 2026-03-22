import React, { useRef } from "react";
import styles from "./PropsToolbar.module.css";

interface PropsToolbarProps {
  videoId: string;
  formatId: string;
  props: Record<string, unknown>;
  onPropsImport: (props: Record<string, unknown>) => void;
}

export const PropsToolbar: React.FC<PropsToolbarProps> = ({
  videoId,
  formatId,
  props,
  onPropsImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(props, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `props-${videoId}-${formatId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = JSON.parse(content);
        onPropsImport(imported);
      } catch {
        alert("Failed to import props: invalid JSON");
      }
    };
    reader.readAsText(file);

    // Reset input so same file can be imported again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.toolbar}>
      <button onClick={handleExport} className={styles.button} title="Export props to JSON file">
        ↓ Export
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className={styles.button}
        title="Import props from JSON file"
      >
        ↑ Import
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: "none" }}
      />
    </div>
  );
};
