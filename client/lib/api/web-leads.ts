/**
 * Web Leads API Service
 * Handles API communication with the web_app_leads endpoint (discovery leads)
 */

import { apiClient } from "../api-client";

export interface WebLead {
  id?: number;
  source: string;
  source_id?: string;
  title: string;
  url?: string;
  snippet?: string;
  budget?: string;
  location?: string;
  contact?: string;
  status?:
    | "new"
    | "qualified"
    | "contacted"
    | "proposal-sent"
    | "rejected"
    | "archived";
  notes?: string;
  created_at?: string;
  updated_at?: string;
  unique_hash?: string;
}

export interface WebLeadFilter {
  source?: string;
  status?: string;
  search?: string;
}

interface WebLeadResponse {
  leads?: WebLead[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  status?: string;
  data?: WebLead[];
  message?: string;
}

class WebLeadsAPI {
  constructor() {
    console.log("📡 Web Leads API initialized");
  }

  /**
   * Get all web leads with optional filters
   */
  async list(
    filters?: WebLeadFilter,
    page: number = 1,
    limit: number = 50,
  ): Promise<{
    leads: WebLead[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));

      if (filters?.source) {
        params.set("source", filters.source);
      }
      if (filters?.status) {
        params.set("status", filters.status);
      }
      if (filters?.search) {
        params.set("search", filters.search);
      }

      const path = params.toString() ? `/web-leads?${params}` : "/web-leads";
      console.log("📤 Fetching web leads from:", path);

      const response = await apiClient.get<WebLeadResponse>(path);
      return {
        leads: response.leads || response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Error fetching web leads:", msg);
      throw new Error(`Failed to load web leads: ${msg}`);
    }
  }

  /**
   * Update a web lead
   */
  async update(
    id: number,
    updates: Partial<Omit<WebLead, "id" | "created_at" | "updated_at">>,
  ): Promise<void> {
    try {
      const sanitized = this.sanitizeData(updates);
      await apiClient.put(`/web-leads/${id}`, sanitized);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Error updating web lead:", msg);
      throw new Error(`Failed to update web lead: ${msg}`);
    }
  }

  /**
   * Delete a web lead
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/web-leads/${id}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Error deleting web lead:", msg);
      throw new Error(`Failed to delete web lead: ${msg}`);
    }
  }

  /**
   * Search web leads with custom filters
   */
  async search(filters: WebLeadFilter): Promise<WebLead[]> {
    const result = await this.list(filters);
    return result.leads;
  }

  /**
   * Cleanup duplicate web leads
   */
  async cleanupDuplicates(): Promise<{ deleted: number; total: number }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        deleted: number;
        total: number;
        message: string;
      }>("/web-leads/cleanup-duplicates", {});

      return {
        deleted: response.deleted || 0,
        total: response.total || 0,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Error cleaning up duplicates:", msg);
      throw new Error(`Failed to cleanup duplicates: ${msg}`);
    }
  }

  /**
   * Sync web leads from discovery sources
   */
  async sync(): Promise<{
    total: number;
    perSource: Array<{ url: string; count: number }>;
  }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        total: number;
        perSource: Array<{ url: string; count: number }>;
        message: string;
      }>("/web-leads/sync", {});

      return {
        total: response.total || 0,
        perSource: response.perSource || [],
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Error syncing web leads:", msg);
      throw new Error(`Failed to sync web leads: ${msg}`);
    }
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
      if (
        key === "id" ||
        key === "created_at" ||
        key === "updated_at" ||
        key === "unique_hash"
      ) {
        continue;
      }

      sanitized[key] = String(value).trim();
    }

    return sanitized;
  }
}

export const webLeadsAPI = new WebLeadsAPI();
