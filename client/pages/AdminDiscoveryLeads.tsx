import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import { RefreshCw, Plus, Edit2, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { SyncProgressDialog } from "@/components/leads/SyncProgressDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DiscoveryLead {
  id?: number;
  business_name: string;
  location?: string;
  phone?: string;
  email?: string;
  website_url?: string;
  website_status?: string;
  notes?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

const STATUS_OPTIONS = ["new", "contacted", "interested", "converted", "lost"];
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function AdminDiscoveryLeads() {
  const [leads, setLeads] = useState<DiscoveryLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedLead, setSelectedLead] = useState<DiscoveryLead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showSyncProgress, setShowSyncProgress] = useState(false);
  const [syncSessionId, setSyncSessionId] = useState<string | undefined>();
  const [formData, setFormData] = useState<DiscoveryLead>({
    business_name: "",
    location: "",
    phone: "",
    email: "",
    website_url: "",
    website_status: "",
    notes: "",
    status: "new",
  });

  async function loadLeads() {
    setLoading(true);
    try {
      const data = await apiClient.get<any>("/discovery-leads");
      if (data.data) {
        setLeads(Array.isArray(data.data) ? data.data : []);
      } else if (Array.isArray(data)) {
        setLeads(data);
      } else if (data.status === "success" && data.results) {
        setLeads(Array.isArray(data.results) ? data.results : []);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error("Failed to load discovery leads:", error);
      toast.error("Failed to load discovery leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  async function handleSync() {
    setSyncing(true);
    setShowSyncProgress(true);

    try {
      const data = await apiClient.post<any>("/discovery-leads/sync", {
        searchTerms: [],
        locations: [],
      });

      // Set the session ID if provided by the server
      if (data.sessionId) {
        setSyncSessionId(data.sessionId);
      }

      // Show the message in a toast only if explicitly requested
      if (data.message) {
        if (data.total > 0) {
          toast.success(data.message);
        } else {
          toast.info(data.message);
        }
      }
    } catch (error) {
      console.error("Failed to sync discovery leads:", error);
      toast.error("Failed to sync discovery leads");
      setShowSyncProgress(false);
    } finally {
      setSyncing(false);
    }
  }

  function handleSyncComplete() {
    loadLeads();
    setShowSyncProgress(false);
    setSyncSessionId(undefined);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.business_name) {
      toast.error("Business name is required");
      return;
    }

    try {
      if (selectedLead?.id) {
        // Update
        await apiClient.put(`/discovery-leads/${selectedLead.id}`, formData);
        toast.success("Lead updated");
      } else {
        // Create
        await apiClient.post("/discovery-leads", formData);
        toast.success("Lead created");
      }
      resetForm();
      loadLeads();
    } catch (error) {
      console.error("Failed to save lead:", error);
      toast.error("Failed to save lead");
    }
  }

  function resetForm() {
    setFormData({
      business_name: "",
      location: "",
      phone: "",
      email: "",
      website_url: "",
      website_status: "",
      notes: "",
      status: "new",
    });
    setSelectedLead(null);
    setIsEditing(false);
  }

  function handleEdit(lead: DiscoveryLead) {
    setSelectedLead(lead);
    setFormData(lead);
    setIsEditing(true);
  }

  async function handleDelete() {
    if (!deleteId) return;

    try {
      await apiClient.delete(`/discovery-leads/${deleteId}`);
      toast.success("Lead deleted");
      loadLeads();
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete lead:", error);
      toast.error("Failed to delete lead");
    }
  }

  return (
    <AdminLayout>
      <SEO title="Lead Discovery & Tracking" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Lead Discovery & Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover and track businesses with no website or broken websites
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSync}
              disabled={syncing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}
              />
              {syncing ? "Syncing..." : "Sync Now"}
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setIsEditing(true);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
            <h3 className="font-semibold text-sm mb-1">🔍 Auto-Discovery</h3>
            <p className="text-xs text-muted-foreground">
              Click "Sync Now" to automatically discover new business leads
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
            <h3 className="font-semibold text-sm mb-1">📊 Track Status</h3>
            <p className="text-xs text-muted-foreground">
              Monitor lead status from New to Contacted, Interested, Converted,
              or Lost
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
            <h3 className="font-semibold text-sm mb-1">🌐 Website Check</h3>
            <p className="text-xs text-muted-foreground">
              Track website status: No Website, Active, Broken, or Expired
            </p>
          </div>
        </div>

        {/* Form Section */}
        {isEditing && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {selectedLead ? "Edit Lead" : "New Lead"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Business Name *
                  </label>
                  <Input
                    value={formData.business_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        business_name: e.target.value,
                      })
                    }
                    placeholder="Business name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <Input
                    value={formData.location || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <Input
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Website URL
                  </label>
                  <Input
                    type="url"
                    value={formData.website_url || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        website_url: e.target.value,
                      })
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || "new"}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md dark:bg-slate-800 dark:border-slate-600"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md dark:bg-slate-800 dark:border-slate-600"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                >
                  {selectedLead ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Items Per Page Selector */}
        {leads.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium text-foreground">
              Items per page:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 text-sm border border-slate-300 rounded-md dark:bg-slate-800 dark:border-slate-600"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Leads Table / Cards */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading discovery leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No discovery leads yet. Click "Add Lead" or "Sync Now" to get
            started.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Business Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Website
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage,
                      )
                      .map((lead) => (
                        <tr
                          key={lead.id}
                          className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm">
                            {lead.business_name}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {lead.location || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {lead.email ? (
                              <a
                                href={`mailto:${lead.email}`}
                                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                              >
                                {lead.email}
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {lead.website_url ? (
                              <a
                                href={lead.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-xs"
                              >
                                {lead.website_url}
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                                lead.status === "converted"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : lead.status === "lost"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }`}
                            >
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(lead)}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteId(lead.id || null);
                                  setShowDeleteConfirm(true);
                                }}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {leads
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage,
                )
                .map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {lead.business_name}
                        </h3>
                        {lead.location && (
                          <p className="text-xs text-muted-foreground">
                            {lead.location}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          lead.status === "converted"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : lead.status === "lost"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3 text-sm">
                      {lead.email && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Email
                          </p>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                          >
                            {lead.email}
                          </a>
                        </div>
                      )}
                      {lead.website_url && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Website
                          </p>
                          <a
                            href={lead.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                          >
                            {lead.website_url}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(lead)}
                        className="flex-1 flex items-center justify-center gap-2 p-2 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(lead.id || null);
                          setShowDeleteConfirm(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 p-2 rounded-md border border-red-300 dark:border-red-600 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(leads.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={leads.length}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this discovery lead? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sync Progress Dialog */}
      <SyncProgressDialog
        isOpen={showSyncProgress}
        sessionId={syncSessionId}
        onComplete={handleSyncComplete}
        onClose={() => {
          setShowSyncProgress(false);
          setSyncSessionId(undefined);
        }}
      />
    </AdminLayout>
  );
}
