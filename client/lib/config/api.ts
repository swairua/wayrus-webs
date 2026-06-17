/**
 * API Configuration
 * Local Dev: /api.php proxied by Vite to remote wayrus.co.ke/api.php
 * Staging (fly.dev): /api.php proxied by Express to remote wayrus.co.ke/api.php
 * Production (Apache): /api.php is local
 *
 * Note: In all environments, the frontend uses /api.php.
 * The environment handles proxying appropriately.
 */

// Determine API base URL based on environment
function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    // Server-side (shouldn't happen, but fallback)
    return "/api.php";
  }

  // Always use local /api.php - proxying is handled by the environment
  // (Vite in dev, Express in staging/fly.dev, Apache in production)
  return "/api.php";
}

export const API_BASE_URL = getApiBaseUrl();

/**
 * Build query parameters for API calls
 */
export function buildApiParams(params: Record<string, any>): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      if (typeof value === "object") {
        // Handle nested objects (like where clauses)
        for (const [subKey, subValue] of Object.entries(value)) {
          searchParams.append(`${key}[${subKey}]`, String(subValue));
        }
      } else {
        searchParams.append(key, String(value));
      }
    }
  }

  return searchParams;
}

/**
 * Build form data for API calls
 */
export function buildFormData(params: Record<string, any>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      if (typeof value === "object" && !(value instanceof File)) {
        // Handle nested objects
        for (const [subKey, subValue] of Object.entries(value)) {
          formData.append(`${key}[${subKey}]`, String(subValue));
        }
      } else {
        formData.append(key, value instanceof File ? value : String(value));
      }
    }
  }

  return formData;
}
