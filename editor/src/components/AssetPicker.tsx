import React, { useMemo, useState } from "react";
import { usePublicAssets } from "../hooks/usePublicAssets";
import styles from "./AssetPicker.module.css";

interface AssetPickerProps {
  onSelect: (asset: string) => void;
  onClose: () => void;
}

const IMAGE_EXTENSIONS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a", ".ogg"];

export const AssetPicker: React.FC<AssetPickerProps> = ({ onSelect, onClose }) => {
  const { assets, loading, error } = usePublicAssets();
  const [filter, setFilter] = useState("all");

  const filteredAssets = useMemo(() => {
    const exts = {
      images: IMAGE_EXTENSIONS,
      videos: VIDEO_EXTENSIONS,
      audio: AUDIO_EXTENSIONS,
    };

    if (filter === "all") return assets;

    const allowed = exts[filter as keyof typeof exts] || [];
    return assets.filter((a) => allowed.some((ext) => a.toLowerCase().endsWith(ext)));
  }, [assets, filter]);

  return (
    <dialog open className={styles.dialog}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3>Select Asset</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.filters}>
          {["all", "images", "videos", "audio"].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && <p className={styles.message}>Loading assets...</p>}
        {error && <p className={styles.error}>Error: {error.message}</p>}
        {!loading && filteredAssets.length === 0 && (
          <p className={styles.message}>No assets found</p>
        )}

        {!loading && filteredAssets.length > 0 && (
          <div className={styles.list}>
            {filteredAssets.map((asset) => (
              <button
                key={asset}
                className={styles.assetItem}
                onClick={() => {
                  onSelect(asset);
                }}
              >
                {asset.split("/").pop()}
                <span className={styles.path}>{asset}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
};
