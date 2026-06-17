import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  RefreshCw,
  Mail,
  Phone,
  FileText,
  Calendar,
  DollarSign,
} from "lucide-react";

interface Quotation {
  id: number;
  portfolio_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  project_description: string;
  budget_range: string;
  timeline: string;
  status: "new" | "contacted" | "quoted" | "rejected" | "archived";
  notes: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "quoted",
  "rejected",
  "archived",
] as const;

export default function AdminQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  async function loadQuotations() {
    setLoading(true);
    try {
      const data = await apiClient.get<{ data: Quotation[] }>("/quotations");
      setQuotations(data.data || []);
    } catch (e) {
      toast.error("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(quotation: Quotation) {
    setSelectedId(quotation.id);
    setEditStatus(quotation.status);
    setEditNotes(quotation.notes || "");
  }

  async function handleUpdate() {
    if (!selectedId) return;

    setIsUpdating(true);
    try {
      await apiClient.put(`/quotations/${selectedId}`, {
        status: editStatus,
        notes: editNotes,
      });
      toast.success("Quotation updated");
      setSelectedId(null);
      loadQuotations();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to update quotation",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  useEffect(() => {
    loadQuotations();
  }, []);

  const selected = quotations.find((q) => q.id === selectedId);

  return (
    <AdminLayout>
      <SEO title="Admin – Quotations" />
      <section className="container py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Quotation Requests
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage customer quotation requests.
              </p>
            </div>
            <Button onClick={loadQuotations} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">
              <div className="animate-spin mb-2 text-2xl">⚡</div>
              Loading quotations...
            </div>
          </div>
        )}

        {!loading && quotations.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/30 p-12 text-center">
            <div className="text-4xl mb-3 opacity-50">📋</div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No quotation requests yet
            </h3>
            <p className="text-muted-foreground">
              Quotation requests will appear here.
            </p>
          </div>
        )}

        {!loading && quotations.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              {quotations.map((quotation) => (
                <button
                  key={quotation.id}
                  onClick={() => handleSelect(quotation)}
                  className={`group w-full text-left rounded-xl border p-4 transition-all ${
                    selectedId === quotation.id
                      ? "border-primary bg-gradient-to-r from-primary/10 to-secondary/10 shadow-md"
                      : "border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {quotation.customer_name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3" />
                        {quotation.customer_email}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-foreground">
                        {quotation.project_description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-semibold inline-block ${
                          quotation.status === "new"
                            ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                            : quotation.status === "contacted"
                              ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                              : quotation.status === "quoted"
                                ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                                : quotation.status === "rejected"
                                  ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {quotation.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selected && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-1">
                  {selected.customer_name}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Quotation request
                </p>

                <div className="space-y-4 text-sm mb-6">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold">
                        Email
                      </p>
                      <a
                        href={`mailto:${selected.customer_email}`}
                        className="text-primary hover:underline"
                      >
                        {selected.customer_email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold">
                        Phone
                      </p>
                      <p>{selected.customer_phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div className="w-full">
                      <p className="text-muted-foreground text-xs font-semibold">
                        Project Description
                      </p>
                      <p className="whitespace-pre-wrap text-foreground mt-1 p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-xs">
                        {selected.project_description}
                      </p>
                    </div>
                  </div>
                  {selected.budget_range && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground text-xs font-semibold">
                          Budget
                        </p>
                        <p className="font-medium">{selected.budget_range}</p>
                      </div>
                    </div>
                  )}
                  {selected.timeline && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground text-xs font-semibold">
                          Timeline
                        </p>
                        <p>{selected.timeline}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold">
                        Submitted
                      </p>
                      <p className="text-xs">
                        {new Date(selected.created_at).toLocaleDateString()}{" "}
                        {new Date(selected.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div>
                    <label className="text-sm font-semibold block mb-2">
                      Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full rounded-lg border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold block mb-2">
                      Notes
                    </label>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add internal notes..."
                      className="w-full rounded-lg border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
