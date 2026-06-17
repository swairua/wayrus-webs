import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { leadsAPI, Lead } from "@/lib/api/leads";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Globe, Check } from "lucide-react";
import { checkWebsiteStatus } from "@/lib/utils/website-checker";

interface LeadDetailsViewProps {
  lead: Lead;
  onUpdated?: () => void;
  onCancel?: () => void;
}

const WEBSITE_STATUSES = [
  { value: "none", label: "No Website" },
  { value: "active", label: "Active" },
  { value: "broken", label: "Broken/Unreachable" },
  { value: "expired", label: "Expired" },
];

const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

export function LeadDetailsView({
  lead,
  onUpdated,
  onCancel,
}: LeadDetailsViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingWebsite, setIsCheckingWebsite] = useState(false);

  const form = useForm({
    defaultValues: {
      business_name: lead.business_name || "",
      contact_person: lead.contact_person || "",
      phone: lead.phone || "",
      email: lead.email || "",
      business_category: lead.business_category || "",
      location: lead.location || "",
      website_url: lead.website_url || "",
      website_status: lead.website_status || "none",
      notes: lead.notes || "",
      status: lead.status || "new",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!data.business_name || !data.business_name.trim()) {
        toast.error("Business name is required");
        return;
      }

      await leadsAPI.update(lead.id!, data);
      toast.success("Lead updated successfully");
      setIsEditing(false);
      onUpdated?.();
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update lead",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkWebsite = async () => {
    const websiteUrl = form.getValues("website_url");
    if (!websiteUrl || !websiteUrl.trim()) {
      toast.error("Please enter a website URL");
      return;
    }

    try {
      setIsCheckingWebsite(true);
      const status = await checkWebsiteStatus(websiteUrl);
      form.setValue("website_status", status);
      toast.success(
        `Website status: ${status === "active" ? "Active" : "Broken/Unreachable"}`,
      );
    } catch (error) {
      console.error("Error checking website:", error);
      toast.error("Failed to check website status");
    } finally {
      setIsCheckingWebsite(false);
    }
  };

  if (!isEditing) {
    // View Mode
    return (
      <div className="space-y-6">
        {/* Header Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold">{lead.business_name}</h2>
              {lead.location && (
                <p className="text-sm text-muted-foreground">{lead.location}</p>
              )}
            </div>
            <Badge variant="default">{lead.status || "new"}</Badge>
          </div>
        </div>

        <Separator />

        {/* Business Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lead.business_category && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Category
              </p>
              <p className="font-medium">{lead.business_category}</p>
            </div>
          )}
          {lead.lead_source && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Lead Source
              </p>
              <p className="font-medium">{lead.lead_source}</p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
          <div className="space-y-2">
            {lead.contact_person && (
              <div>
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p className="font-medium">{lead.contact_person}</p>
              </div>
            )}
            {lead.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a
                  href={`mailto:${lead.email}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {lead.email}
                </a>
              </div>
            )}
            {lead.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <a
                  href={`tel:${lead.phone}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {lead.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Website Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Website Information</h3>
          <div className="space-y-3">
            {lead.website_url && (
              <div>
                <p className="text-sm text-muted-foreground">Website URL</p>
                <a
                  href={
                    lead.website_url.startsWith("http")
                      ? lead.website_url
                      : `https://${lead.website_url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {lead.website_url}
                </a>
              </div>
            )}
            {lead.website_status && (
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={
                    lead.website_status === "active"
                      ? "default"
                      : lead.website_status === "none"
                        ? "outline"
                        : "destructive"
                  }
                >
                  {lead.website_status === "none"
                    ? "No Website"
                    : lead.website_status.charAt(0).toUpperCase() +
                      lead.website_status.slice(1)}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Expressed Needs */}
        {lead.expressed_need && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Expressed Needs</h3>
            <div className="flex flex-wrap gap-2">
              {lead.expressed_need.split(",").map((need) => (
                <Badge key={need.trim()} variant="secondary">
                  {need.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {lead.notes && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Notes</h3>
            <p className="text-sm bg-muted p-3 rounded">{lead.notes}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="text-xs text-muted-foreground space-y-1">
          {lead.created_at && (
            <p>
              Created{" "}
              {formatDistanceToNow(new Date(lead.created_at), {
                addSuffix: true,
              })}
            </p>
          )}
          {lead.updated_at && (
            <p>
              Last updated{" "}
              {formatDistanceToNow(new Date(lead.updated_at), {
                addSuffix: true,
              })}
            </p>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Close
            </Button>
          )}
          <Button onClick={() => setIsEditing(true)}>Edit Lead</Button>
        </div>
      </div>
    );
  }

  // Edit Mode
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Status Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Status</h3>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lead Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LEAD_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Business Information</h3>

          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="business_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>

          <FormField
            control={form.control}
            name="contact_person"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Website Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Website Information</h3>

          <FormField
            control={form.control}
            name="website_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <div className="flex gap-2">
                  <FormControl className="flex-1">
                    <Input {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={checkWebsite}
                    disabled={isCheckingWebsite}
                    className="w-auto"
                  >
                    {isCheckingWebsite ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Globe className="w-4 h-4" />
                    )}
                    <span className="ml-2">Check</span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {WEBSITE_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Notes</h3>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea className="min-h-20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              form.reset();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
