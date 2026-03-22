import React from "react";
import { videos } from "@/videos/registry";
import styles from "./VideoSelector.module.css";

interface VideoSelectorProps {
  selectedVideoId: string;
  onSelect: (videoId: string) => void;
}

export const VideoSelector: React.FC<VideoSelectorProps> = ({ selectedVideoId, onSelect }) => {
  return (
    <div className={styles.container}>
      <label htmlFor="video-select">Video:</label>
      <select
        id="video-select"
        value={selectedVideoId}
        onChange={(e) => onSelect(e.target.value)}
        className={styles.select}
      >
        {videos.map((video) => (
          <option key={video.id} value={video.id}>
            {video.title}
          </option>
        ))}
      </select>
    </div>
  );
};
