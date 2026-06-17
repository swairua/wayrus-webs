/**
 * Leads API Service
 * Handles all API communication with the leads endpoint
 */

import { apiClient } from "../api-client";

export interface Lead {
  id?: number;
  business_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  business_category?: string;
  location?: string;
  website_url?: string;
  website_status?: "none" | "broken" | "active" | "expired";
  lead_source?:
    | "google_maps"
    | "facebook"
    | "manual"
    | "referral"
    | "social_media";
  expressed_need?: string;
  notes?: string;
  status?: "new" | "contacted" | "interested" | "converted" | "lost";
  created_at?: string;
  updated_at?: string;
}

export interface LeadFilter {
  business_name?: string;
  website_status?: string;
  status?: string;
  lead_source?: string;
  expressed_need?: string;
}

interface LeadResponse {
  status: string;
  data?: Lead[];
  message?: string;
  id?: number;
}

class LeadsAPI {
  constructor() {
    console.log("📡 Leads API initialized");
  }

  /**
   * Create a new lead
   */
  async create(
    lead: Omit<Lead, "id" | "created_at" | "updated_at">,
  ): Promise<Lead> {
    try {
      const sanitizedData = this.sanitizeData(lead);
      console.log("📤 Sending lead data:", sanitizedData);

      const response = await apiClient.post<LeadResponse>(
        "/leads",
        sanitizedData,
      );

      if (!response.id) {
        throw new Error("No ID returned from server");
      }

      return { ...sanitizedData, id: response.id } as Lead;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Error creating lead:", msg);
      throw new Error(`Failed to create lead: ${msg}`);
    }
  }

  /**
   * Get all leads or filtered leads
   */
  async list(filters?: LeadFilter): Promise<Lead[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.business_name) {
        params.set("business_name", filters.business_name);
      }
      if (filters?.website_status) {
        params.set("website_status", filters.website_status);
      }
      if (filters?.status) {
        params.set("status", filters.status);
      }
      if (filters?.lead_source) {
        params.set("lead_source", filters.lead_source);
      }
      if (filters?.expressed_need) {
        params.set("expressed_need", filters.expressed_need);
      }

      const path = params.toString() ? `/leads?${params}` : "/leads";
      console.log("📤 Fetching leads from:", path);

      const response = await apiClient.get<LeadResponse>(path);
      return response.data || [];
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Error fetching leads:", msg);
      throw new Error(`Failed to load leads: ${msg}`);
    }
  }

  /**
   * Update a lead
   */
  async update(
    id: number,
    updates: Partial<Omit<Lead, "id" | "created_at" | "updated_at">>,
  ): Promise<void> {
    try {
      const sanitized = this.sanitizeData(updates);
      await apiClient.put(`/leads/${id}`, sanitized);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Error updating lead:", msg);
      throw new Error(`Failed to update lead: ${msg}`);
    }
  }

  /**
   * Delete a lead
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/leads/${id}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Error deleting lead:", msg);
      throw new Error(`Failed to delete lead: ${msg}`);
    }
  }

  /**
   * Search leads with custom filters
   */
  async search(filters: LeadFilter): Promise<Lead[]> {
    return this.list(filters);
  }

  /**
   * Sanitize data before sending to API
   */
  private sanitizeData(data: any): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined || value === "") {
        continue;
      }

      // Skip id and timestamp fields
      if (key === "id" || key === "created_at" || key === "updated_at") {
        continue;
      }

      sanitized[key] = String(value).trim();
    }

    return sanitized;
  }
}

export const leadsAPI = new LeadsAPI();
