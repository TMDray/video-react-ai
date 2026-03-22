import { useState, useEffect } from "react";
import { FormatId } from "@/lib/types";
import { useLocalStorage } from "./useLocalStorage";
import { videos } from "@/videos/registry";

export interface EditorState {
  selectedVideoId: string;
  selectedFormatId: FormatId;
  props: Record<string, unknown>;
}

const INITIAL_FORMAT: FormatId = "landscape";
const INITIAL_VIDEO_ID = videos[0]?.id || "hello-world";

/**
 * Central state management for the editor
 */
export function useEditorState() {
  const [state, setState] = useLocalStorage<EditorState>("editor-state", {
    selectedVideoId: INITIAL_VIDEO_ID,
    selectedFormatId: INITIAL_FORMAT,
    props: {},
  });

  // When video changes, reset props to defaults from registry
  const [prevVideoId, setPrevVideoId] = useState(state.selectedVideoId);
  useEffect(() => {
    if (state.selectedVideoId !== prevVideoId) {
      const entry = videos.find((v) => v.id === state.selectedVideoId);
      if (entry?.defaultProps) {
        setState({
          ...state,
          props: entry.defaultProps,
        });
      }
      setPrevVideoId(state.selectedVideoId);
    }
  }, [state.selectedVideoId, prevVideoId, state, setState]);

  const setVideoId = (videoId: string) => {
    setState({ ...state, selectedVideoId: videoId });
  };

  const setFormatId = (formatId: FormatId) => {
    setState({ ...state, selectedFormatId: formatId });
  };

  const setProps = (props: Record<string, unknown>) => {
    setState({ ...state, props });
  };

  return {
    state,
    setVideoId,
    setFormatId,
    setProps,
  };
}
