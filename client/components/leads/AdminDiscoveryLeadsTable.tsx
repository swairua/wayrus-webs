import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Search,
  Eye,
  Trash2,
  Plus,
  Loader2,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { webLeadsAPI, WebLead } from "@/lib/api/web-leads";

const ITEMS_PER_PAGE = 10;

const STATUS_COLORS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  new: "secondary",
  qualified: "default",
  contacted: "default",
  "proposal-sent": "default",
  rejected: "destructive",
  archived: "outline",
};

interface AdminDiscoveryLeadsTableProps {
  onLeadsUpdated?: () => void;
}

export function AdminDiscoveryLeadsTable({
  onLeadsUpdated,
}: AdminDiscoveryLeadsTableProps) {
  const [leads, setLeads] = useState<WebLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Dialog states
  const [selectedLead, setSelectedLead] = useState<WebLead | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showCleanupConfirm, setShowCleanupConfirm] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  // Progress tracking states
  const [syncProgress, setSyncProgress] = useState({
    current: 0,
    total: 0,
  });

  // Load leads
  useEffect(() => {
    loadLeads();
  }, [searchQuery, selectedStatus]);

  const handleCleanupDuplicates = async () => {
    setIsCleaningUp(true);
    try {
      const result = await webLeadsAPI.cleanupDuplicates();

      if (result.deleted > 0) {
        toast.success(
          `Deleted ${result.deleted} duplicate${result.deleted !== 1 ? "s" : ""}`,
        );
      } else {
        toast.info("No duplicates found");
      }

      setShowCleanupConfirm(false);
      loadLeads();
      onLeadsUpdated?.();
    } catch (error) {
      console.error("Error cleaning up duplicates:", error);
      toast.error("Cleanup failed");
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await webLeadsAPI.sync();

      if (result.total > 0) {
        toast.success(`Synced ${result.total} new leads`);
      } else {
        toast.info("No new leads found");
      }

      loadLeads();
      onLeadsUpdated?.();
    } catch (error) {
      console.error("Error syncing leads:", error);
      toast.error(error instanceof Error ? error.message : "Sync failed");
    } finally {
      setIsSyncing(false);
      setSyncProgress({ current: 0, total: 0 });
    }
  };

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const filters: any = {};

      if (searchQuery.trim()) {
        filters.search = searchQuery;
      }
      if (selectedStatus && selectedStatus !== "all") {
        filters.status = selectedStatus;
      }

      const result = await webLeadsAPI.list(filters);

      // Sort leads by date (newest first)
      const sortedData = (result.leads || []).sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });

      setLeads(sortedData);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLead = async (id: number) => {
    try {
      await webLeadsAPI.delete(id);
      setLeads(leads.filter((l) => l.id !== id));
      setDeleteConfirmId(null);
      toast.success("Lead deleted successfully");
      onLeadsUpdated?.();
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await webLeadsAPI.update(id, { status: newStatus as any });
      setLeads(
        leads.map((l) =>
          l.id === id ? { ...l, status: newStatus as any } : l,
        ),
      );
      toast.success("Lead updated successfully");
      onLeadsUpdated?.();
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    }
  };

  const handleViewLead = (lead: WebLead) => {
    setSelectedLead(lead);
    setShowDetailsDialog(true);
  };

  // Pagination
  const totalPages = Math.ceil(leads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeads = leads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatLeadStatus = (status?: string) => {
    if (!status) return "New";
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <CardTitle>Discovery Leads Management</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={loadLeads}
                variant="outline"
                disabled={isLoading}
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => setShowCleanupConfirm(true)}
                disabled={isCleaningUp || leads.length === 0}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isCleaningUp ? "Cleaning..." : "Clean Duplicates"}
              </Button>
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                size="sm"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isSyncing ? "Discovering..." : "Discover Leads"}
              </Button>
            </div>
          </div>

          {/* Progress Display */}
          {isSyncing && syncProgress.total > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Discovering leads...</span>
                <span className="text-muted-foreground">
                  {syncProgress.current} / {syncProgress.total}
                </span>
              </div>
              <Progress
                value={
                  syncProgress.total > 0
                    ? (syncProgress.current / syncProgress.total) * 100
                    : 0
                }
              />
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="proposal-sent">Proposal Sent</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `${leads.length} lead${leads.length !== 1 ? "s" : ""} found`}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-muted-foreground">No discovery leads found</p>
            <p className="text-sm text-muted-foreground">
              Click "Discover Leads" to automatically find new prospects from
              various sources.
            </p>
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Discover Leads
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Source
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold line-clamp-1">
                            {lead.title}
                          </span>
                          {lead.snippet && (
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {lead.snippet}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs">
                        <span className="line-clamp-1">{lead.source}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs">
                        {lead.url ? (
                          <a
                            href={lead.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline line-clamp-1"
                          >
                            {lead.url}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status || "new"}
                          onValueChange={(newStatus) =>
                            handleUpdateStatus(lead.id!, newStatus)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="proposal-sent">
                              Proposal Sent
                            </SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewLead(lead)}
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {deleteConfirmId === lead.id ? (
                            <div className="flex gap-1">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteLead(lead.id!)}
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteConfirmId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteConfirmId(lead.id || null)
                              }
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4">
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
      </CardContent>

      {/* Lead Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Title</h3>
                <p className="text-sm text-foreground">{selectedLead.title}</p>
              </div>
              {selectedLead.snippet && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Snippet</h3>
                  <p className="text-sm text-foreground">
                    {selectedLead.snippet}
                  </p>
                </div>
              )}
              {selectedLead.url && (
                <div className="space-y-2">
                  <h3 className="font-semibold">URL</h3>
                  <a
                    href={selectedLead.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {selectedLead.url}
                  </a>
                </div>
              )}
              <div className="space-y-2">
                <h3 className="font-semibold">Source</h3>
                <p className="text-sm text-foreground">{selectedLead.source}</p>
              </div>
              {selectedLead.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Notes</h3>
                  <p className="text-sm text-foreground">
                    {selectedLead.notes}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <h3 className="font-semibold">Status</h3>
                <Badge variant={STATUS_COLORS[selectedLead.status || "new"]}>
                  {formatLeadStatus(selectedLead.status)}
                </Badge>
              </div>
              {selectedLead.created_at && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Created</h3>
                  <p className="text-sm text-foreground">
                    {new Date(selectedLead.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cleanup Duplicates Confirmation Dialog */}
      <AlertDialog
        open={showCleanupConfirm}
        onOpenChange={setShowCleanupConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clean Up Duplicate Leads</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove duplicate leads, keeping only the oldest version
              of each. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCleanupDuplicates}
              disabled={isCleaningUp}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCleaningUp ? "Cleaning..." : "Clean Up"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
