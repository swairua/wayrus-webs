export const API_BASE_URL = "https://wayrus.co.ke/api.php";

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
