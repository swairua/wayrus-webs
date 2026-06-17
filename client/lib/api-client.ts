/**
 * API Client
 * All requests route through local proxy to ensure consistent sessions
 * - Dev mode: Vite proxy to PHP on port 8000
 * - Production: Netlify serverless functions
 */

import { API_BASE_URL } from "./config/api";

interface RequestOptions extends RequestInit {
  credentials?: RequestCredentials;
}

export class APIClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("admin_token");
    }
  }

  /**
   * Set the authentication token
   */
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("admin_token", token);
    } else {
      localStorage.removeItem("admin_token");
    }
  }

  /**
   * Get the authentication token
   * Refreshes from localStorage in case it was set elsewhere
   */
  getToken(): string | null {
    // Refresh from localStorage to ensure we have the latest token
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_token");
      if (stored) {
        this.token = stored;
      }
    }
    return this.token;
  }

  /**
   * Check if running on Apache (wayrus.co.ke)
   */
  private isApacheDeployment(): boolean {
    if (typeof window === "undefined") return false;
    return window.location.hostname.includes("wayrus.co.ke");
  }

  /**
   * Check if this is a production environment
   */
  private isProduction(): boolean {
    return (
      typeof window !== "undefined" &&
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.includes("127.0.0.1") &&
      !window.location.hostname.startsWith("172.")
    );
  }

  /**
   * Check if a path should use PHP API action parameters
   * On Apache: ALL requests go through PHP API
   * On Netlify: Only auth endpoints go through PHP API
   */
  private usePhpApiActions(path: string): boolean {
    // On Apache, all requests go through PHP API
    if (this.isApacheDeployment()) return true;

    // On other production environments, only use for auth endpoints
    if (!this.isProduction()) return false;

    const cleanPath = path.replace(/^\/api/, "").replace(/^\//, "");
    const phpActionPaths = ["admin/login", "admin/logout", "admin/me"];
    return phpActionPaths.some((p) => cleanPath === p);
  }

  /**
   * Map REST paths to PHP API actions (only for specific endpoints)
   */
  private getActionForPath(path: string): string | null {
    const cleanPath = path.replace(/^\/api/, "").replace(/^\//, "");

    // These endpoints always use PHP API actions
    if (cleanPath === "admin/login") return "login";
    if (cleanPath === "admin/logout") return "logout";
    if (cleanPath === "admin/me") return "check_auth";

    return null;
  }

  /**
   * Check if a path should be routed directly to PHP API via REST
   * Only routes endpoints that are truly PHP-only (no Express handler)
   */
  private shouldUsePhpRestApi(path: string): boolean {
    const cleanPath = path.replace(/^\/api/, "").replace(/^\//, "");

    // These endpoints should use PHP API REST routing (proxy to wayrus.co.ke/api.php)
    // NOTE: discovery-leads is now handled by Express server (removed from here)
    const phpRestPaths: string[] = [];

    return phpRestPaths.some((p) => cleanPath.startsWith(p));
  }

  /**
   * Build form data for PHP API
   */
  private buildFormData(data: any): FormData {
    const form = new FormData();
    for (const [key, value] of Object.entries(data || {})) {
      if (value !== null && value !== undefined) {
        if (typeof value === "object") {
          for (const [subKey, subValue] of Object.entries(value)) {
            form.append(`${key}[${subKey}]`, String(subValue));
          }
        } else {
          form.append(key, String(value));
        }
      }
    }
    return form;
  }

  /**
   * Make an API request
   */
  async request<T = any>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    let url: string;
    let fetchOptions: RequestInit = {
      credentials: "include",
      ...options,
    };

    const method = options.method || "GET";
    const action = this.getActionForPath(path);
    const isApache = this.isApacheDeployment();
    const shouldUsePhpRest = this.shouldUsePhpRestApi(path);

    if (action) {
      // PHP API with action parameters (login, logout, auth check)
      url = `${API_BASE_URL}?action=${action}`;

      if (method !== "GET" && method !== "HEAD") {
        // Use form-encoded data for PHP API
        if (options.body && typeof options.body === "string") {
          const jsonData = JSON.parse(options.body);
          fetchOptions.body = this.buildFormData(jsonData);
        } else {
          fetchOptions.body = this.buildFormData({});
        }

        // Remove Content-Type header so browser sets it with boundary for FormData
        delete (fetchOptions.headers as any)?.["Content-Type"];
      } else {
        // For GET requests, don't send body
        delete fetchOptions.body;
      }
    } else if (shouldUsePhpRest || isApache) {
      // Route discovery-leads and other REST resources directly to PHP API
      // Or on Apache: route all non-action requests through PHP API as REST
      // The .htaccess will rewrite /api/* to api.php?request=*
      url = `${API_BASE_URL}?request=${path.startsWith("/") ? path.slice(1) : path}`;

      fetchOptions.headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      // For POST/PUT, send JSON body to PHP API
      // PHP API will parse it via php://input
      if (method !== "GET" && method !== "HEAD" && options.body) {
        // Keep the JSON body for PHP to parse
        fetchOptions.body = options.body;
      }
    } else {
      // Regular JSON API endpoints (dev or Netlify)
      // In dev: routes through Vite proxy to localhost:8000
      // In prod: routes through Netlify serverless
      url = `/api${path.startsWith("/") ? path : "/" + path}`;

      fetchOptions.headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };
    }

    // Ensure headers object exists
    if (!fetchOptions.headers) {
      fetchOptions.headers = {};
    }

    // Add JWT token to Authorization header for protected endpoints
    // Refresh token from storage to ensure we have the latest one
    const currentToken = this.getToken();
    if (currentToken) {
      // Send token for PHP API auth check endpoints
      if (action && ["login", "logout", "check_auth"].includes(action)) {
        if (action !== "login") {
          (fetchOptions.headers as any)["Authorization"] =
            `Bearer ${currentToken}`;
          console.log("[API] Added auth header for PHP endpoint:", action);
        }
      }
      // Send token for all API endpoints when logged in
      else if (
        url.startsWith("/api/") ||
        url.includes("/api.php") ||
        shouldUsePhpRest
      ) {
        (fetchOptions.headers as any)["Authorization"] =
          `Bearer ${currentToken}`;
        console.log(
          "[API] Added auth header for protected endpoint:",
          url,
          "Token length:",
          currentToken.length,
        );
      }
    } else {
      console.log("[API] No token available for protected endpoint", url);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}`,
      }));
      throw new Error(error.message || error.error || "API request failed");
    }

    const data = await response.json();

    // Extract and store token from login response
    if (action === "login" && data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  /**
   * GET request
   */
  async get<T = any>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { method: "GET", ...options });
  }

  /**
   * POST request
   */
  async post<T = any>(
    path: string,
    data?: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    path: string,
    data?: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(path, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { method: "DELETE", ...options });
  }
}

export const apiClient = new APIClient();
