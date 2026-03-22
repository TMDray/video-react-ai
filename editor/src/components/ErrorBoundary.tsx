import React from "react";
import styles from "./ErrorBoundary.module.css";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
              <h2>Oops! Something went wrong</h2>
              <p className={styles.errorMessage}>{this.state.error.message}</p>
              <button onClick={() => this.setState({ error: null })} className={styles.retryButton}>
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
