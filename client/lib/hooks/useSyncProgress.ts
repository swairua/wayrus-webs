import { useEffect, useState, useCallback } from "react";

export interface SyncProgress {
  stage:
    | "scraping"
    | "verifying"
    | "filtering"
    | "saving"
    | "complete"
    | "error";
  step: string;
  current: number;
  total: number;
  percentage: number;
  message: string;
}

interface UseSyncProgressOptions {
  sessionId?: string;
  onProgress?: (progress: SyncProgress) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to subscribe to discovery sync progress via SSE
 * Gracefully handles SSE endpoint unavailability
 */
export function useSyncProgress({
  sessionId,
  onProgress,
  onComplete,
  onError,
}: UseSyncProgressOptions = {}) {
  const [progress, setProgress] = useState<SyncProgress | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const subscribe = useCallback(
    (id: string) => {
      if (!id) return;

      setProgress(null);
      setError(null);
      setIsConnected(true);

      let eventSource: EventSource | null = null;
      let timeoutId: NodeJS.Timeout | null = null;

      try {
        eventSource = new EventSource(
          `/api/discovery-leads/sync-progress/${id}`,
        );

        // Set a timeout - if no message received in 5 seconds, assume endpoint doesn't exist
        timeoutId = setTimeout(() => {
          if (isConnected && !progress) {
            console.warn(
              "SSE endpoint not responding - assuming sync is complete",
            );
            setIsConnected(false);
            onComplete?.();
          }
        }, 5000);

        eventSource.onmessage = (event) => {
          try {
            // Clear timeout on first message
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }

            const data = JSON.parse(event.data) as SyncProgress;
            setProgress(data);
            onProgress?.(data);

            if (data.stage === "complete" || data.stage === "error") {
              setIsConnected(false);
              if (data.stage === "complete") {
                onComplete?.();
              }
            }
          } catch (err) {
            console.error("Error parsing progress data:", err);
          }
        };

        eventSource.onerror = (err) => {
          // Clear timeout on error
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }

          const errorMsg =
            err instanceof Error
              ? err.message
              : err && typeof err === "object" && "type" in err
                ? "Progress tracking not available"
                : "Progress tracking not available";

          console.warn(
            "SSE not available, sync may still be running:",
            errorMsg,
          );
          setIsConnected(false);

          // Don't show error to user - sync might still be working
          // Just silently close the connection
          eventSource?.close();
        };
      } catch (err) {
        // Silently handle connection errors - SSE might not be implemented
        console.warn(
          "Could not connect to progress stream - continuing anyway",
        );
        setIsConnected(false);
        // Don't call onError - let the sync complete on its own
      }

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        eventSource?.close();
      };
    },
    [onProgress, onComplete, onError],
  );

  useEffect(() => {
    if (!sessionId) return;
    return subscribe(sessionId);
  }, [sessionId, subscribe]);

  return {
    progress,
    isConnected,
    error,
    subscribe,
  };
}
