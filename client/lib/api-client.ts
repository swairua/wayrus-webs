import { API_BASE_URL } from "./config/api";

interface RequestOptions extends RequestInit {
  credentials?: RequestCredentials;
}

export class APIClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("admin_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("admin_token", token);
    } else {
      localStorage.removeItem("admin_token");
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_token");
      if (stored) {
        this.token = stored;
      }
    }
    return this.token;
  }

  private getActionForPath(path: string): string | null {
    const cleanPath = path.replace(/^\/api/, "").replace(/^\//, "");

    if (cleanPath === "admin/login") return "login";
    if (cleanPath === "admin/logout") return "logout";
    if (cleanPath === "admin/me") return "check_auth";

    return null;
  }

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

    if (action) {
      url = `${API_BASE_URL}?action=${action}`;

      if (method !== "GET" && method !== "HEAD") {
        if (options.body && typeof options.body === "string") {
          const jsonData = JSON.parse(options.body);
          fetchOptions.body = this.buildFormData(jsonData);
        } else {
          fetchOptions.body = this.buildFormData({});
        }

        delete (fetchOptions.headers as any)?.["Content-Type"];
      } else {
        delete fetchOptions.body;
      }
    } else {
      url = `${API_BASE_URL}?request=${path.startsWith("/") ? path.slice(1) : path}`;

      fetchOptions.headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (method !== "GET" && method !== "HEAD" && options.body) {
        fetchOptions.body = options.body;
      }
    }

    if (!fetchOptions.headers) {
      fetchOptions.headers = {};
    }

    const currentToken = this.getToken();
    if (currentToken) {
      if (action && ["login", "logout", "check_auth"].includes(action)) {
        if (action !== "login") {
          (fetchOptions.headers as any)["Authorization"] =
            `Bearer ${currentToken}`;
        }
      } else if (url.includes("/api.php")) {
        (fetchOptions.headers as any)["Authorization"] =
          `Bearer ${currentToken}`;
      }
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}`,
      }));
      throw new Error(error.message || error.error || "API request failed");
    }

    const data = await response.json();

    if (action === "login" && data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async get<T = any>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { method: "GET", ...options });
  }

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

  async delete<T = any>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { method: "DELETE", ...options });
  }
}

export const apiClient = new APIClient();
