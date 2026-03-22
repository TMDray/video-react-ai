import React, { useMemo } from "react";
import { videos } from "@/videos/registry";
import { useEditorState } from "./hooks/useEditorState";
import { usePlayerRef } from "./hooks/usePlayerRef";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { VideoSelector } from "./components/VideoSelector";
import { FormatSelector } from "./components/FormatSelector";
import { PropsToolbar } from "./components/PropsToolbar";
import { PropsForm } from "./components/PropsForm";
import { PresetPanel } from "./components/PresetPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { RenderCommand } from "./components/RenderCommand";
import { TimelineControls } from "./components/TimelineControls";
import { ErrorBoundary } from "./components/ErrorBoundary";
import styles from "./App.module.css";

export const App: React.FC = () => {
  const { state, setVideoId, setFormatId, setProps } = useEditorState();
  const { playerRef, currentFrame } = usePlayerRef(0);

  // Find current video entry
  const currentEntry = useMemo(
    () => videos.find((v) => v.id === state.selectedVideoId),
    [state.selectedVideoId]
  );

  const videoDuration = currentEntry?.durationInFrames || 0;

  // Keyboard shortcuts handler for export
  const handleKeyboardExport = () => {
    const dataStr = JSON.stringify(state.props, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `props-${state.selectedVideoId}-${state.selectedFormatId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    playerRef,
    currentFrame,
    durationInFrames: videoDuration,
    onExport: handleKeyboardExport,
  });

  if (!currentEntry) {
    return <div className={styles.error}>Video not found</div>;
  }

  return (
    <ErrorBoundary>
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
            <PropsToolbar
              videoId={state.selectedVideoId}
              formatId={state.selectedFormatId}
              props={state.props}
              onPropsImport={setProps}
            />
            <PropsForm entry={currentEntry} currentProps={state.props} onPropsChange={setProps} />
            <PresetPanel
              videoId={state.selectedVideoId}
              currentProps={state.props}
              onLoadPreset={setProps}
            />
            <RenderCommand
              videoId={state.selectedVideoId}
              formatId={state.selectedFormatId}
              props={state.props}
            />
          </aside>

          <main className={styles.preview}>
            {currentEntry.schema ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <ErrorBoundary>
                  <PreviewPanel
                    entry={currentEntry}
                    formatId={state.selectedFormatId}
                    props={state.props}
                    playerRef={playerRef}
                  />
                </ErrorBoundary>
                <TimelineControls
                  playerRef={playerRef}
                  currentFrame={currentFrame}
                  durationInFrames={videoDuration}
                />
              </div>
            ) : (
              <div className={styles.noSchema}>
                <p>No schema configured for this video</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};
