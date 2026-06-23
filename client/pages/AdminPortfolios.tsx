import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
    Plus,
    Trash2,
    ExternalLink,
    Check,
    Clock,
    AlertCircle,
    Image,
    Loader2,
  } from "lucide-react";

interface Portfolio {
  id: number;
  title: string;
  description: string;
  website_url: string;
  screenshot_url: string;
  status: "active" | "inactive" | "pending";
  created_at: string;
}

export default function AdminPortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    website_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [capturingId, setCapturingId] = useState<number | null>(null);

  async function loadPortfolios() {
    setLoading(true);
    try {
      const data = await apiClient.get<{ data: Portfolio[] }>("/portfolios");
      setPortfolios(data.data || []);
    } catch (e) {
      toast.error("Failed to load portfolios");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPortfolio(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.website_url) {
      toast.error("Title and URL are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/portfolios", formData);
      toast.success("Portfolio added successfully");
      setFormData({ title: "", description: "", website_url: "" });
      setShowForm(false);
      loadPortfolios();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add portfolio");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      await apiClient.delete(`/portfolios/${id}`);
      toast.success("Portfolio deleted");
      loadPortfolios();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to delete portfolio",
      );
    }
  }

  async function handleCapturePreview(id: number) {
    setCapturingId(id);
    try {
      const response = await apiClient.post(
        `/portfolios/capture-preview/${id}`,
        {},
      );
      if (response.status === "success") {
        toast.success("Preview captured successfully!");
        loadPortfolios();
      } else {
        toast.error("Failed to capture preview");
      }
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to capture preview",
      );
    } finally {
      setCapturingId(null);
    }
  }

  useEffect(() => {
    loadPortfolios();
  }, []);

  return (
    <AdminLayout>
      <SEO title="Admin – Portfolios" description="Manage portfolio projects, website screenshots, and client work samples." robots="noindex" />
      <section className="container py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Portfolios
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your portfolio websites and projects.
              </p>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              {showForm ? "Cancel" : "Add Portfolio"}
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <form onSubmit={handleAddPortfolio} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Portfolio Title
                </label>
                <Input
                  placeholder="e.g., E-commerce Platform"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Describe your portfolio project..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-700 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Website URL
                </label>
                <Input
                  placeholder="https://example.com"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) =>
                    setFormData({ ...formData, website_url: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Adding..." : "Add Portfolio"}
              </Button>
            </form>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {!loading && portfolios.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/30 p-12 text-center">
            <div className="text-4xl mb-3 opacity-50">📁</div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No portfolios yet
            </h3>
            <p className="text-muted-foreground">Add one to get started.</p>
          </div>
        )}

        <div className="grid gap-4">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {portfolio.title}
                    </h3>
                    <a
                      href={portfolio.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  {portfolio.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {portfolio.description}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono break-all">
                    {portfolio.website_url}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {portfolio.status === "active" ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">
                            Active
                          </span>
                        </>
                      ) : portfolio.status === "pending" ? (
                        <>
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                            Pending
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-slate-400" />
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            Inactive
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(portfolio.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    onClick={() => handleCapturePreview(portfolio.id)}
                    disabled={capturingId === portfolio.id}
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary/10 border-primary/30 hover:border-primary"
                    title="Capture website preview screenshot"
                  >
                    {capturingId === portfolio.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Image className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    onClick={() => handleDelete(portfolio.id)}
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
