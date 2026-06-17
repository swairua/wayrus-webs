import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export function useAdmin() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        // Only check auth if we have a token
        const token = apiClient.getToken();
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const data = await apiClient.get<AdminUser>("/admin/me");
        setAdmin(data);
        setIsAuthenticated(true);
      } catch (error) {
        // Clear invalid token on auth failure
        apiClient.setToken(null);
        setIsAuthenticated(false);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdmin();
  }, []);

  return { admin, isAuthenticated, isLoading };
}
