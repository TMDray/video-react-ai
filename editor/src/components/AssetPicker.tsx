import React, { useMemo, useRef, useState } from "react";
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localAssets, setLocalAssets] = useState(assets);

  const filteredAssets = useMemo(() => {
    const exts = {
      images: IMAGE_EXTENSIONS,
      videos: VIDEO_EXTENSIONS,
      audio: AUDIO_EXTENSIONS,
    };

    const currentAssets = localAssets.length > 0 ? localAssets : assets;

    if (filter === "all") return currentAssets;

    const allowed = exts[filter as keyof typeof exts] || [];
    return currentAssets.filter((a) => allowed.some((ext) => a.toLowerCase().endsWith(ext)));
  }, [assets, localAssets, filter]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const response = await fetch("/api/assets", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: HTTP ${response.status}`);
      }

      const data = (await response.json()) as {
        success: boolean;
        files: string[];
      };
      if (data.success && data.files) {
        setLocalAssets(data.files);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      // Reset input so same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <dialog open className={styles.dialog}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3>Select Asset</h3>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={styles.uploadBtn}
            disabled={uploading}
            title="Upload new asset"
          >
            {uploading ? "⏳ Uploading..." : "📤 Upload"}
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleUpload}
          style={{ display: "none" }}
        />

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

        {uploadError && <p className={styles.error}>Upload error: {uploadError}</p>}
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
