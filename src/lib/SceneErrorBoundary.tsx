import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "./colors";

interface SceneErrorBoundaryState {
  error: Error | null;
}

/**
 * Error boundary for catching and displaying scene rendering errors.
 * Wraps individual scenes or transitions to prevent one error from breaking the entire video.
 */
export class SceneErrorBoundary extends React.Component<
  React.PropsWithChildren,
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): SceneErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[SceneErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <AbsoluteFill
          style={{
            backgroundColor: colors.bg,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              color: colors.text,
              fontFamily: "monospace",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Scene Error
          </div>
          <div
            style={{
              color: colors.textMuted,
              fontFamily: "monospace",
              fontSize: 12,
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            {this.state.error.message}
          </div>
        </AbsoluteFill>
      );
    }
    return this.props.children;
  }
}
