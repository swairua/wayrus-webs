import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SEO from "@/components/SEO";
import { Pagination } from "@/components/ui/pagination";
import { Trash2, Plus, Mail, Lock, Users, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  async function fetchCurrentUser() {
    try {
      const data = await apiClient.get("/admin/me");
      setCurrentUser(data);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await apiClient.get<{ data: any[] }>("/admin/users");
      const userData =
        response.data || (Array.isArray(response) ? response : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  async function logout() {
    try {
      await apiClient.post("/admin/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear token and redirect
      apiClient.setToken(null);
      window.location.href = "/admin/login";
    }
  }

  async function createUser(e: any) {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    setIsCreating(true);
    try {
      await apiClient.post("/admin/users", { email, password });
      setEmail("");
      setPassword("");
      setShowCreateForm(false);
      fetchUsers();
    } catch (error) {
      alert(
        "Failed to create user: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setIsCreating(false);
    }
  }

  function openDeleteDialog(user: any) {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!userToDelete) return;
    try {
      await apiClient.delete(`/admin/users/${userToDelete.id}`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      alert(
        "Failed to delete user: " +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }

  return (
    <AdminLayout>
      <SEO title="Admin – Users" />
      <section className="container py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">Users</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage website administrators and editors.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="/admin/opportunities"
                className="px-3 py-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                Opportunities
              </a>
              <a
                href="/admin/logs"
                className="px-3 py-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                View Logs
              </a>
              <a
                href="/api.php?action=logs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                External Logs
              </a>
              <button
                onClick={logout}
                className="px-3 py-2 text-sm text-foreground hover:text-destructive transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-foreground">
              Users ({users.length})
            </h2>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/30 p-4 border-b">
                  <Skeleton className="h-5 w-40" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 border-b last:border-0 flex items-center justify-between">
                    <div className="space-y-2 flex-1 max-w-md">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 px-6 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                No users yet. Create one to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
                    <th className="text-left px-6 py-3 font-semibold text-foreground">
                      Email
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">
                      Role
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">
                      Created
                    </th>
                    <th className="text-right px-6 py-3 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .slice(
                      (currentPage - 1) * usersPerPage,
                      currentPage * usersPerPage,
                    )
                    .map((u) => {
                      const isCurrentUser =
                        currentUser && currentUser.email === u.email;
                      return (
                        <tr
                          key={u.id}
                          className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">
                                {u.email}
                              </span>
                              {isCurrentUser && (
                                <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-medium">
                                  You
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-foreground rounded font-medium">
                              {u.role || "user"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {u.created_at
                              ? new Date(u.created_at).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => openDeleteDialog(u)}
                              disabled={isCurrentUser}
                              className="inline-flex items-center gap-1.5 px-2 py-1.5 text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title={
                                isCurrentUser
                                  ? "Cannot delete your own account"
                                  : "Delete user"
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="text-xs font-medium">
                                Delete
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Add New User
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEmail("");
                  setPassword("");
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={createUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  type="email"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors dark:bg-slate-700 text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors dark:bg-slate-700 text-foreground"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEmail("");
                    setPassword("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-foreground border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.email}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
