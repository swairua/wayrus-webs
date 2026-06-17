import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Plus, Edit2, RefreshCw } from "lucide-react";
import { leadsAPI, Lead } from "@/lib/api/leads";
import { apiClient } from "@/lib/api-client";

const STATUS_OPTIONS = ["new", "contacted", "interested", "converted", "lost"];
const ITEMS_PER_PAGE = 10;

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<Lead>({
    business_name: "",
    contact_person: "",
    phone: "",
    email: "",
    business_category: "",
    location: "",
    website_url: "",
    website_status: "none",
    lead_source: "manual",
    expressed_need: "",
    notes: "",
    status: "new",
  });

  async function loadLeads() {
    setLoading(true);
    try {
      console.log("📥 Loading leads from API...");
      const data = await leadsAPI.list();
      console.log("📥 API response type:", typeof data);
      console.log("📥 API response is array:", Array.isArray(data));
      console.log("📥 API response:", data);
      const leadsArray = Array.isArray(data) ? data : [];
      console.log(
        `📥 Final leads count: ${leadsArray.length} (${leadsArray.length === 0 ? "EMPTY" : "has data"})`,
      );
      if (leadsArray.length > 0) {
        console.log(`📥 First lead: ${leadsArray[0].business_name}`);
        console.log(
          `📥 Last lead: ${leadsArray[leadsArray.length - 1].business_name}`,
        );
      }
      setLeads(leadsArray);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to load leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      console.log("🔄 Starting leads sync...");
      const data = await apiClient.post<any>("/leads/sync", {});
      console.log("🔄 Sync response:", {
        message: data.message,
        discovered: data.discovered,
        new: data.new,
        duplicates: data.duplicates,
        saved: data.saved,
        failed: data.failed,
        filtered_out: data.filtered_out,
        total: data.total,
      });

      if (data.message) {
        toast.success(data.message);
      }

      // Longer delay to ensure all database writes are flushed
      // (database may take time to write all concurrent records)
      console.log("⏳ Waiting for database to write all leads...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("🔄 Reloading leads after sync...");
      await loadLeads();
      console.log("🔄 Leads reload complete");
    } catch (error) {
      console.error("Failed to sync leads:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to sync leads",
      );
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.business_name) {
      toast.error("Business name is required");
      return;
    }

    try {
      if (selectedLead?.id) {
        // Update
        await leadsAPI.update(selectedLead.id, formData);
        toast.success("Lead updated");
      } else {
        // Create
        await leadsAPI.create(formData);
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
      contact_person: "",
      phone: "",
      email: "",
      business_category: "",
      location: "",
      website_url: "",
      website_status: "none",
      lead_source: "manual",
      expressed_need: "",
      notes: "",
      status: "new",
    });
    setSelectedLead(null);
    setIsEditing(false);
  }

  function handleEdit(lead: Lead) {
    setSelectedLead(lead);
    setFormData(lead);
    setIsEditing(true);
  }

  async function handleDelete() {
    if (!deleteId) return;

    try {
      await leadsAPI.delete(deleteId);
      toast.success("Lead deleted");
      loadLeads();
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete lead:", error);
      toast.error("Failed to delete lead");
    }
  }

  // Pagination
  const totalPages = Math.ceil(leads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeads = leads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <AdminLayout>
      <SEO title="Leads Management" description="Manage business leads" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leads</h1>
            <p className="text-muted-foreground mt-1">
              Manage incoming business leads
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
                    Contact Person
                  </label>
                  <Input
                    value={formData.contact_person || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_person: e.target.value,
                      })
                    }
                    placeholder="Contact person name"
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
                    Category
                  </label>
                  <Input
                    value={formData.business_category || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        business_category: e.target.value,
                      })
                    }
                    placeholder="Business category"
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
                    Website Status
                  </label>
                  <select
                    value={formData.website_status || "none"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        website_status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md dark:bg-slate-800 dark:border-slate-600"
                  >
                    <option value="none">None</option>
                    <option value="active">Active</option>
                    <option value="broken">Broken</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lead Source
                  </label>
                  <select
                    value={formData.lead_source || "manual"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lead_source: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md dark:bg-slate-800 dark:border-slate-600"
                  >
                    <option value="manual">Manual</option>
                    <option value="google_maps">Google Maps</option>
                    <option value="facebook">Facebook</option>
                    <option value="referral">Referral</option>
                    <option value="social_media">Social Media</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || "new"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
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
                <label className="block text-sm font-medium mb-1">
                  Expressed Need
                </label>
                <Input
                  value={formData.expressed_need || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expressed_need: e.target.value,
                    })
                  }
                  placeholder="e.g., website, hosting, seo, branding, marketing"
                />
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

        {/* Leads Table */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No leads yet. Click "Add Lead" to create one.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Business Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Contact Person
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Website Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Lead Source
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
                    {paginatedLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium">
                          {lead.business_name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {lead.business_category || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {lead.contact_person || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {lead.email ? (
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {lead.email}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {lead.phone ? (
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {lead.phone}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {lead.location || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lead.website_status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : lead.website_status === "broken"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : lead.website_status === "expired"
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            }`}
                          >
                            {lead.website_status || "none"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                            {lead.lead_source || "manual"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lead.status === "converted"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : lead.status === "lost"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : lead.status === "interested"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                    : lead.status === "contacted"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lead? This action cannot be
              undone.
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
    </AdminLayout>
  );
}
