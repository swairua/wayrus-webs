import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { apiClient } from "@/lib/api-client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Check if we have a valid token and auth is established
        const token = apiClient.getToken();
        if (token) {
          await apiClient.get("/admin/me");
          setIsLoggedIn(true);
          navigate("/admin/users");
          return;
        }
      } catch {
        // Token is invalid or expired, clear it
        apiClient.setToken(null);
      }
      setChecking(false);
    })();
  }, [navigate]);

  async function submit(e: any) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    try {
      // Login and get token (token is automatically stored by apiClient)
      await apiClient.post("/admin/login", { email, password });

      // Verify auth is established with the new token
      try {
        await apiClient.get("/admin/me");
        // Auth confirmed, safe to navigate
        navigate("/admin/users");
      } catch (authErr) {
        setError(
          "Login successful but authentication failed. Please try again.",
        );
        console.error("Auth check failed after login:", authErr);
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  }

  if (checking) {
    return (
      <Layout>
        <SEO title="Admin Login – Wayrus" />
        <section className="container py-20 max-w-md">
          <div className="text-center text-muted-foreground">Loading...</div>
        </section>
      </Layout>
    );
  }

  if (isLoggedIn) {
    return (
      <Layout>
        <SEO title="Admin Login – Wayrus" />
        <section className="container py-20 max-w-md">
          <div className="text-center text-muted-foreground">
            Redirecting to dashboard...
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Admin Login – Wayrus" />
      <section className="container py-20 max-w-md">
        <h1 className="text-3xl font-bold">Admin sign in</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-md border px-4 py-2"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-md border px-4 py-2"
          />
          <button className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold">
            Sign in
          </button>
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </section>
    </Layout>
  );
}
