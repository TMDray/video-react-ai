import { useState, useEffect } from "react";

export interface Preset {
  id: string;
  name: string;
  videoId: string;
  props: Record<string, unknown>;
  createdAt: number;
}

const PRESETS_KEY = "editor-presets";

export function usePresets(videoId: string) {
  const [presets, setPresets] = useState<Preset[]>([]);

  // Load presets from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(PRESETS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Preset[];
        setPresets(parsed);
      } catch {
        setPresets([]);
      }
    }
  }, []);

  const savePreset = (name: string, props: Record<string, unknown>) => {
    const newPreset: Preset = {
      id: `${Date.now()}`,
      name,
      videoId,
      props,
      createdAt: Date.now(),
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
  };

  const deletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
  };

  const getPresetsForVideo = () => presets.filter((p) => p.videoId === videoId);

  return {
    presets: getPresetsForVideo(),
    savePreset,
    deletePreset,
  };
}
