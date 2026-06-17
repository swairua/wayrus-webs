import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SEO from "@/components/SEO";
import { Pagination } from "@/components/ui/pagination";
import {
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface LogEntry {
  id?: number;
  message: string;
  level: string;
  created_at: string;
}

const LOGS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function AdminLogs() {
  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(10);

  async function load() {
    setLoading(true);
    setError(null);
    setAllLogs([]);
    try {
      const data = await apiClient.get("/logs");

      if (data.data && Array.isArray(data.data)) {
        const parsedLogs: LogEntry[] = data.data
          .map((log: any, index: number) => ({
            id: log.id || index,
            message: log.message || "",
            level: log.level || "INFO",
            created_at: log.created_at || "",
          }))
          .reverse();
        setAllLogs(parsedLogs);
        setCurrentPage(1);
      } else {
        setAllLogs([]);
      }
    } catch (e: any) {
      console.error("Logs fetch error:", e);
      setError(
        e?.message || "Could not fetch logs from server. Check the connection.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <SEO title="Admin – Logs" />
      <section className="space-y-6">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                System Logs
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Live logs from Wayrus system.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={load}
                disabled={loading}
                className="p-2 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border-2 border-destructive/40 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm text-destructive-foreground">
              <p className="font-semibold">Error loading logs</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {!error && allLogs.length > 0 && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              Logs loaded successfully ({allLogs.length} total logs)
            </p>
          </div>
        )}

        {/* Logs Per Page Selector */}
        {allLogs.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium text-foreground">
              Logs per page:
            </label>
            <select
              value={logsPerPage}
              onChange={(e) => {
                setLogsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 text-sm border border-slate-300 rounded-md dark:bg-slate-800 dark:border-slate-600"
            >
              {LOGS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="text-muted-foreground text-sm text-center">
              <div className="animate-spin mb-2 text-2xl">⚡</div>
              Loading logs...
            </div>
          </div>
        ) : allLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            No logs available
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Timestamp
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Level
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allLogs
                      .slice(
                        (currentPage - 1) * logsPerPage,
                        currentPage * logsPerPage,
                      )
                      .map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <span
                              className={`px-2 py-1 rounded-full font-medium inline-block ${
                                log.level === "ERROR"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : log.level === "WARN"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }`}
                            >
                              {log.level}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-foreground break-words">
                            {log.message}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {allLogs
                .slice(
                  (currentPage - 1) * logsPerPage,
                  currentPage * logsPerPage,
                )
                .map((log) => (
                  <div
                    key={log.id}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <time className="text-xs font-mono text-slate-600 dark:text-slate-400">
                        {new Date(log.created_at).toLocaleString()}
                      </time>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          log.level === "ERROR"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : log.level === "WARN"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {log.level}
                      </span>
                    </div>
                    <p className="text-sm text-foreground break-words">
                      {log.message}
                    </p>
                  </div>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(allLogs.length / logsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={logsPerPage}
              totalItems={allLogs.length}
            />
          </>
        )}
      </section>
    </AdminLayout>
  );
}
