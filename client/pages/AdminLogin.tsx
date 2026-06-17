import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn, Lock, Mail, Sparkles } from "lucide-react";

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
        const token = apiClient.getToken();
        if (token) {
          await apiClient.get("/admin/me");
          setIsLoggedIn(true);
          navigate("/admin/users");
          return;
        }
      } catch {
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
      await apiClient.post("/admin/login", { email, password });

      try {
        await apiClient.get("/admin/me");
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
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="space-y-4 w-80">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoggedIn) {
    return (
      <Layout>
        <SEO title="Admin Login – Wayrus" />
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center text-muted-foreground space-y-3">
            <Skeleton className="h-6 w-56 mx-auto" />
            <p className="text-sm">Redirecting to dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Admin Login – Wayrus" />
      <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary/95 to-slate-900">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md px-4"
        >
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Admin sign in
              </h1>
              <p className="text-sm text-white/60">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-white/50 pointer-events-none" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-xl bg-white/10 border border-white/20 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/50 pointer-events-none" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl bg-white/10 border border-white/20 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </motion.button>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-300 bg-red-500/10 rounded-lg px-4 py-2 text-center"
                >
                  {error}
                </motion.p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
