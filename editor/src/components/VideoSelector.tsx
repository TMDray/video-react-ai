import React, { useState, useMemo } from "react";
import { videos } from "@/videos/registry";
import styles from "./VideoSelector.module.css";

interface VideoSelectorProps {
  selectedVideoId: string;
  onSelect: (videoId: string) => void;
}

export const VideoSelector: React.FC<VideoSelectorProps> = ({ selectedVideoId, onSelect }) => {
  const [search, setSearch] = useState("");

  const filteredVideos = useMemo(() => {
    if (!search.trim()) return videos;
    const lowerSearch = search.toLowerCase();
    return videos.filter(
      (v) => v.id.toLowerCase().includes(lowerSearch) || v.title.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  const showSearch = videos.length > 5;

  return (
    <div className={styles.container}>
      <label htmlFor="video-select">Video:</label>
      {showSearch && (
        <input
          type="text"
          placeholder="Search videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      )}
      <select
        id="video-select"
        value={selectedVideoId}
        onChange={(e) => onSelect(e.target.value)}
        className={styles.select}
      >
        {filteredVideos.length === 0 ? (
          <option disabled>No videos found</option>
        ) : (
          filteredVideos.map((video) => (
            <option key={video.id} value={video.id}>
              {video.title}
            </option>
          ))
        )}
      </select>
    </div>
  );
};
