import React, { useMemo } from "react";
import { videos } from "@/videos/registry";
import { useEditorState } from "./hooks/useEditorState";
import { VideoSelector } from "./components/VideoSelector";
import { FormatSelector } from "./components/FormatSelector";
import { PropsForm } from "./components/PropsForm";
import { PreviewPanel } from "./components/PreviewPanel";
import { RenderCommand } from "./components/RenderCommand";
import styles from "./App.module.css";

export const App: React.FC = () => {
  const { state, setVideoId, setFormatId, setProps } = useEditorState();

  // Find current video entry
  const currentEntry = useMemo(
    () => videos.find((v) => v.id === state.selectedVideoId),
    [state.selectedVideoId]
  );

  if (!currentEntry) {
    return <div className={styles.error}>Video not found</div>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.title}>🎬 Remotion Props Editor</div>
        <div className={styles.selectors}>
          <VideoSelector selectedVideoId={state.selectedVideoId} onSelect={setVideoId} />
          <FormatSelector selectedFormatId={state.selectedFormatId} onSelect={setFormatId} />
        </div>
      </header>

      {/* Main content: left sidebar + right preview */}
      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <PropsForm entry={currentEntry} currentProps={state.props} onPropsChange={setProps} />
          <RenderCommand
            videoId={state.selectedVideoId}
            formatId={state.selectedFormatId}
            props={state.props}
          />
        </aside>

        <main className={styles.preview}>
          {currentEntry.schema ? (
            <PreviewPanel
              entry={currentEntry}
              formatId={state.selectedFormatId}
              props={state.props}
            />
          ) : (
            <div className={styles.noSchema}>
              <p>No schema configured for this video</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
