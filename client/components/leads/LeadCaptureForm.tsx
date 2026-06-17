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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { leadsAPI, Lead } from "@/lib/api/leads";
import { checkWebsiteStatus } from "@/lib/utils/website-checker";
import { Loader2, Globe } from "lucide-react";

interface LeadCaptureFormProps {
  onSuccess?: (lead: Lead) => void;
  onCancel?: () => void;
}

const BUSINESS_CATEGORIES = [
  "Retail",
  "Hospitality",
  "Professional Services",
  "Healthcare",
  "Manufacturing",
  "E-commerce",
  "Real Estate",
  "Education",
  "Technology",
  "Finance",
  "Other",
];

const LEAD_SOURCES = [
  { value: "google_maps", label: "Google Maps" },
  { value: "facebook", label: "Facebook" },
  { value: "manual", label: "Manual Entry" },
  { value: "referral", label: "Referral" },
  { value: "social_media", label: "Social Media" },
];

const EXPRESSED_NEEDS = [
  { value: "website", label: "Website" },
  { value: "mobile_app", label: "Mobile App" },
  { value: "hosting", label: "Hosting" },
  { value: "seo", label: "SEO" },
  { value: "repair", label: "Website Repair" },
  { value: "maintenance", label: "Maintenance" },
  { value: "other", label: "Other Services" },
];

const WEBSITE_STATUSES = [
  { value: "none", label: "No Website" },
  { value: "active", label: "Active" },
  { value: "broken", label: "Broken/Unreachable" },
  { value: "expired", label: "Expired" },
];

export function LeadCaptureForm({ onSuccess, onCancel }: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingWebsite, setIsCheckingWebsite] = useState(false);

  const form = useForm<any>({
    defaultValues: {
      business_name: "",
      contact_person: "",
      phone: "",
      email: "",
      business_category: "",
      location: "",
      website_url: "",
      website_status: "none",
      lead_source: "manual",
      expressed_need: [],
      notes: "",
      status: "new",
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

      if (!data.email && !data.phone) {
        toast.error("At least email or phone is required");
        return;
      }

      // Prepare data
      const leadData = {
        business_name: data.business_name,
        contact_person: data.contact_person || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined,
        business_category: data.business_category || undefined,
        location: data.location || undefined,
        website_url: data.website_url || undefined,
        website_status: data.website_status,
        lead_source: data.lead_source,
        expressed_need: data.expressed_need.join(", ") || undefined,
        notes: data.notes || undefined,
        status: "new",
      };

      // Create lead
      const result = await leadsAPI.create(leadData as any);
      toast.success("Lead created successfully");
      form.reset();
      onSuccess?.(result);
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create lead",
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Lead</CardTitle>
        <CardDescription>
          Capture business and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Information</h3>

              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BUSINESS_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input
                        placeholder="City, Region, or Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>

              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
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
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                        />
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
                        <Input
                          placeholder="+254... or local number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Website Information Section */}
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
                        <Input
                          placeholder="example.com or https://example.com"
                          {...field}
                        />
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

            {/* Lead Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Lead Details</h3>

              <FormField
                control={form.control}
                name="lead_source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Source</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEAD_SOURCES.map((source) => (
                          <SelectItem key={source.value} value={source.value}>
                            {source.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expressed_need"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What do they need?</FormLabel>
                    <div className="space-y-3">
                      {EXPRESSED_NEEDS.map((need) => (
                        <div
                          key={need.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={need.value}
                            checked={field.value.includes(need.value)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...field.value, need.value]
                                : field.value.filter(
                                    (v: string) => v !== need.value,
                                  );
                              field.onChange(newValue);
                            }}
                          />
                          <label
                            htmlFor={need.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {need.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information about this lead..."
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Add Lead
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
