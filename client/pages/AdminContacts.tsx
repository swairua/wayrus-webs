import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  RefreshCw,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  ArrowRight,
} from "lucide-react";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  reply_notes: string;
  created_at: string;
}

const STATUS_OPTIONS = ["new", "read", "replied", "archived"] as const;
const CONTACTS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage, setContactsPerPage] = useState(10);

  async function loadContacts() {
    setLoading(true);
    try {
      const data = await apiClient.get<{ data: Contact[] }>("/contacts");
      setContacts(data.data || []);
    } catch (e) {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(contact: Contact) {
    setSelectedId(contact.id);
    setEditStatus(contact.status);
    setEditNotes(contact.reply_notes || "");
  }

  async function handleUpdate() {
    if (!selectedId) return;

    setIsUpdating(true);
    try {
      await apiClient.put(`/contacts/${selectedId}`, {
        status: editStatus,
        reply_notes: editNotes,
      });
      toast.success("Contact updated");
      setSelectedId(null);
      loadContacts();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update contact");
    } finally {
      setIsUpdating(false);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  const selected = contacts.find((c) => c.id === selectedId);
  const paginatedContacts = contacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage,
  );

  return (
    <AdminLayout>
      <SEO title="Admin – Contacts" />
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Contact Submissions
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage contact form submissions ({contacts.length} total)
            </p>
          </div>
          <Button onClick={loadContacts} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="text-muted-foreground text-center">
              <div className="animate-spin mb-2 text-2xl">⚡</div>
              Loading submissions...
            </div>
          </div>
        )}

        {!loading && contacts.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/30 p-12 text-center">
            <div className="text-4xl mb-3 opacity-50">💌</div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No submissions yet
            </h3>
            <p className="text-muted-foreground">
              Contact form submissions will appear here.
            </p>
          </div>
        )}

        {!loading && contacts.length > 0 && (
          <>
            {/* Items Per Page Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground">
                Contacts per page:
              </label>
              <select
                value={contactsPerPage}
                onChange={(e) => {
                  setContactsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 text-sm border border-slate-300 rounded-md dark:bg-slate-800 dark:border-slate-600"
              >
                {CONTACTS_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Two-Column Layout */}
            <div className="hidden lg:grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-3">
                {paginatedContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelect(contact)}
                    className={`group w-full text-left rounded-lg border p-4 transition-all ${
                      selectedId === contact.id
                        ? "border-primary bg-gradient-to-r from-primary/10 to-secondary/10 shadow-md"
                        : "border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {contact.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1 truncate">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          {contact.email}
                        </p>
                        {contact.subject && (
                          <p className="mt-2 line-clamp-2 text-sm text-foreground">
                            {contact.subject}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-semibold flex-shrink-0 ${
                          contact.status === "new"
                            ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                            : contact.status === "read"
                              ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
                              : contact.status === "replied"
                                ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Desktop Detail Panel */}
              {selected && (
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-lg h-fit sticky top-6">
                  <h2 className="text-xl font-bold mb-1">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contact submission
                  </p>

                  <div className="space-y-3 text-sm mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-primary hover:underline break-all"
                      >
                        {selected.email}
                      </a>
                    </div>

                    {selected.phone && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Phone
                        </p>
                        <a
                          href={`tel:${selected.phone}`}
                          className="text-primary hover:underline"
                        >
                          {selected.phone}
                        </a>
                      </div>
                    )}

                    {selected.subject && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Subject
                        </p>
                        <p className="font-medium">{selected.subject}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Message
                      </p>
                      <p className="whitespace-pre-wrap text-foreground p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-xs">
                        {selected.message}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Submitted
                      </p>
                      <p className="text-xs">
                        {new Date(selected.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold block mb-2">
                        Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 px-3 py-2 text-sm"
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
                        Reply Notes
                      </label>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Add notes..."
                        className="w-full rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 px-3 py-2 text-sm"
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="w-full"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Stack Layout */}
            <div className="lg:hidden space-y-4">
              {paginatedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`rounded-lg border p-4 transition-all ${
                    selectedId === contact.id
                      ? "border-primary bg-gradient-to-r from-primary/10 to-secondary/10"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {contact.email}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-semibold flex-shrink-0 ${
                        contact.status === "new"
                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                          : contact.status === "read"
                            ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
                            : contact.status === "replied"
                              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {contact.status}
                    </span>
                  </div>

                  {contact.subject && (
                    <p className="text-sm text-foreground mb-3">
                      {contact.subject}
                    </p>
                  )}

                  <Button
                    onClick={() => handleSelect(contact)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    View & Edit
                  </Button>

                  {selectedId === contact.id && selected && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Phone
                        </p>
                        {selected.phone ? (
                          <a
                            href={`tel:${selected.phone}`}
                            className="text-primary hover:underline text-sm"
                          >
                            {selected.phone}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Not provided
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Message
                        </p>
                        <p className="whitespace-pre-wrap text-foreground p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-xs">
                          {selected.message}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold block mb-2">
                          Status
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 px-3 py-2 text-sm"
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
                          Reply Notes
                        </label>
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Add notes..."
                          className="w-full rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 px-3 py-2 text-sm"
                          rows={3}
                        />
                      </div>

                      <Button
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="w-full"
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(contacts.length / contactsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={contactsPerPage}
              totalItems={contacts.length}
            />
          </>
        )}
      </section>
    </AdminLayout>
  );
}
