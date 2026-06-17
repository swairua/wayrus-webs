/**
 * Website Status Checker
 * Performs HTTP checks to determine website status
 */

export type WebsiteStatus = "none" | "broken" | "active" | "expired";

export async function checkWebsiteStatus(
  url: string | undefined,
): Promise<WebsiteStatus> {
  if (!url || url.trim() === "") {
    return "none";
  }

  try {
    // Normalize URL
    let normalizedUrl = url.trim();
    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Use a fetch with timeout to check if website is reachable
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(normalizedUrl, {
      method: "HEAD",
      mode: "no-cors", // CORS limitation workaround
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Since we use no-cors mode, response.ok won't work reliably
    // We'll use the fact that we got a response at all as 'active'
    return "active";
  } catch (error) {
    // If it's a timeout or abort, website might be down
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return "broken";
      }
    }

    // Try alternative method - use image loading to test DNS resolution
    return checkWebsiteStatusWithImage(url);
  }
}

/**
 * Alternative method using image loading (better CORS handling)
 */
function checkWebsiteStatusWithImage(
  url: string | undefined,
): Promise<WebsiteStatus> {
  if (!url || url.trim() === "") {
    return Promise.resolve("none");
  }

  return new Promise((resolve) => {
    try {
      let normalizedUrl = url.trim();
      if (
        !normalizedUrl.startsWith("http://") &&
        !normalizedUrl.startsWith("https://")
      ) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      // Extract domain for favicon check
      const urlObj = new URL(normalizedUrl);
      const faviconUrl = `${urlObj.protocol}//${urlObj.host}/favicon.ico`;

      const img = new Image();
      const timeout = setTimeout(() => {
        img.onerror = null;
        img.onload = null;
        resolve("broken");
      }, 5000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve("active");
      };

      img.onerror = () => {
        clearTimeout(timeout);
        // DNS resolved but image failed = website might be down or blocked
        resolve("broken");
      };

      img.src = faviconUrl;
    } catch {
      resolve("broken");
    }
  });
}

/**
 * Batch check multiple websites
 */
export async function checkWebsiteStatusBatch(
  urls: string[],
): Promise<Map<string, WebsiteStatus>> {
  const results = new Map<string, WebsiteStatus>();

  // Process in parallel with a limit to avoid overwhelming
  const batchSize = 3;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const checks = await Promise.all(
      batch.map(async (url) => ({
        url,
        status: await checkWebsiteStatus(url),
      })),
    );

    checks.forEach(({ url, status }) => {
      results.set(url, status);
    });
  }

  return results;
}

/**
 * Format website status for display
 */
export function formatWebsiteStatus(status: WebsiteStatus): string {
  const statusMap: Record<WebsiteStatus, string> = {
    none: "No Website",
    active: "Active",
    broken: "Broken/Unreachable",
    expired: "Expired",
  };

  return statusMap[status] || "Unknown";
}

/**
 * Get status badge color
 */
export function getStatusColor(
  status: WebsiteStatus,
): "default" | "success" | "destructive" | "warning" {
  switch (status) {
    case "active":
      return "success";
    case "broken":
      return "destructive";
    case "expired":
      return "warning";
    case "none":
    default:
      return "default";
  }
}
