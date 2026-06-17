import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2, RotateCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useSyncProgress, SyncProgress } from "@/lib/hooks/useSyncProgress";

interface SyncProgressDialogProps {
  isOpen: boolean;
  sessionId?: string;
  onComplete?: () => void;
  onClose?: () => void;
}

export function SyncProgressDialog({
  isOpen,
  sessionId,
  onComplete,
  onClose,
}: SyncProgressDialogProps) {
  const [canClose, setCanClose] = useState(false);
  const { progress } = useSyncProgress({
    sessionId: isOpen ? sessionId : undefined,
    onComplete: () => {
      setCanClose(true);
      onComplete?.();
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setCanClose(false);
    }
  }, [isOpen]);

  // Auto-close after 8 seconds if still no progress (SSE endpoint likely unavailable)
  useEffect(() => {
    if (!isOpen || canClose) return;

    const autoCloseTimer = setTimeout(() => {
      if (!progress) {
        console.info(
          "Auto-closing sync dialog - progress tracking unavailable",
        );
        setCanClose(true);
        onComplete?.();
      }
    }, 8000);

    return () => clearTimeout(autoCloseTimer);
  }, [isOpen, canClose, progress, onComplete]);

  const getStageEmoji = (stage: SyncProgress["stage"]) => {
    switch (stage) {
      case "scraping":
        return "🔍";
      case "verifying":
        return "🌐";
      case "filtering":
        return "🔎";
      case "saving":
        return "💾";
      case "complete":
        return "✅";
      case "error":
        return "❌";
      default:
        return "⏳";
    }
  };

  const getStageLabel = (stage: SyncProgress["stage"]) => {
    switch (stage) {
      case "scraping":
        return "Scraping Sources";
      case "verifying":
        return "Verifying Websites";
      case "filtering":
        return "Filtering Leads";
      case "saving":
        return "Saving to Database";
      case "complete":
        return "Sync Complete";
      case "error":
        return "Sync Failed";
      default:
        return "Processing";
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && canClose) {
          onClose?.();
        }
      }}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {progress ? getStageEmoji(progress.stage) : "🔄"}
            Discovery Lead Sync
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Stage indicator */}
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {progress ? getStageLabel(progress.stage) : "Processing..."}
              </span>
              {progress && (
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {progress.percentage}%
                </span>
              )}
            </div>

            {/* Progress bar */}
            <Progress
              value={progress?.percentage || 50}
              className="h-2 bg-slate-200 dark:bg-slate-700"
            />
          </div>

          {/* Current step */}
          {progress && (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                {progress.stage === "complete" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                ) : progress.stage === "error" ? (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground break-words">
                    {progress.step}
                  </p>
                  <p className="text-xs text-muted-foreground break-words">
                    {progress.message}
                  </p>
                </div>
              </div>

              {/* Counter for save stage */}
              {progress.stage === "saving" && progress.total > 0 && (
                <div className="text-xs text-muted-foreground text-right">
                  {progress.current} / {progress.total}
                </div>
              )}
            </div>
          )}

          {/* Loading indicator when no progress yet */}
          {!progress && (
            <div className="space-y-3 py-4">
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Discovering leads... This may take a minute.
              </p>
            </div>
          )}

          {/* Action button */}
          {canClose && (
            <Button
              onClick={() => onClose?.()}
              className="w-full"
              variant={progress?.stage === "error" ? "destructive" : "default"}
            >
              {progress?.stage === "error" ? "Close" : "Done"}
            </Button>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
