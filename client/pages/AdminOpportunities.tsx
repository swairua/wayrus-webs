import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SEO from "@/components/SEO";
import { Trash2, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface Opportunity {
  id?: number;
  source: string;
  snippet?: string;
  url?: string;
  created_at?: string;
}

export default function AdminOpportunities() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(query), 350);
    return () => clearTimeout(id);
  }, [query]);

  async function fetchItems(p = page, q = debouncedQ) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(p),
        pageSize: String(pageSize),
      });
      if (q) params.set("q", q);

      const data = await apiClient.get(`/opportunities?${params.toString()}`);

      if (data.data && Array.isArray(data.data)) {
        const opportunities = data.data;
        setItems(opportunities.slice(0, pageSize));
        setTotal(data.count || opportunities.length);
      } else if (Array.isArray(data)) {
        setItems(data.slice(0, pageSize));
        setTotal(data.length);
      } else {
        setItems([]);
        setTotal(0);
      }
    } catch (e: any) {
      setError(`Failed to load (${e.message || e})`);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems(page, debouncedQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedQ]);

  async function syncNow() {
    setSyncing(true);
    setSyncProgress(0);
    setError(null);

    const progressInterval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * (30 - prev / 10);
      });
    }, 200);

    try {
      await apiClient.post("/opportunities/sync", {});

      setSyncProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 300));
      await fetchItems(1);
      setPage(1);
      toast.success("Sync completed");
    } catch (e: any) {
      setError(`Sync failed (${e.message || e})`);
      toast.error("Failed to sync opportunities");
    } finally {
      clearInterval(progressInterval);
      setSyncing(false);
      setSyncProgress(0);
    }
  }

  async function del(id?: number) {
    if (!id || !confirm("Delete opportunity?")) return;
    try {
      await apiClient.delete(`/opportunities/${id}`);

      const newTotal = Math.max(0, total - 1);
      const lastPage = Math.max(1, Math.ceil(newTotal / pageSize));
      if (page > lastPage) setPage(lastPage);
      await fetchItems(Math.min(page, lastPage));
      setTotal(newTotal);
      toast.success("Opportunity deleted");
    } catch (e: any) {
      setError(`Delete failed (${e.message || e})`);
      toast.error("Failed to delete opportunity");
    }
  }

  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <AdminLayout>
      <SEO title="Admin – Opportunities" description="Manage scraped business opportunities and market leads from various sources." robots="noindex" />
      <section className="space-y-6">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Opportunities
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Scraped leads from marketplaces and tender boards.
              </p>
            </div>
            <button
              onClick={syncNow}
              disabled={syncing}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {syncing ? "Syncing..." : "Sync Now"}
            </button>
          </div>
          {syncing && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Syncing opportunities...</span>
                <span className="text-muted-foreground">
                  {Math.round(syncProgress)}%
                </span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-sm" />
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/30 p-4 border-b">
                <Skeleton className="h-5 w-32" />
              </div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 border-b last:border-0 flex items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No opportunities found. Click "Sync Now" to load opportunities.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Search opportunities..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Source
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Snippet
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        URL
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium">
                          {item.source}
                        </td>
                        <td className="px-4 py-3 text-sm max-w-md">
                          <span className="line-clamp-2">{item.snippet}</span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-xs"
                            >
                              {item.url}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => del(item.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Page {page} of {lastPage} ({from}-{to} of {total})
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(lastPage, page + 1))}
                  disabled={page >= lastPage}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </AdminLayout>
  );
}
