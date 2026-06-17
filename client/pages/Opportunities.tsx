import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { FormEvent, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Search, Globe, Tag, FileText, ExternalLink, Loader2, Sparkles } from "lucide-react";

interface Opportunity {
  id: string;
  source: string;
  snippet: string;
  url?: string;
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Opportunities() {
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState(
    "website design, app development, SaaS, ERP",
  );
  const [text, setText] = useState("");
  const [results, setResults] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiClient.post("/scrape", {
        url: url || undefined,
        text: text || undefined,
        keywords: keywords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setResults(data.items || []);
    } catch (err) {
      console.error("Scrape error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <SEO title="Market Opportunities Hub – Wayrus" />
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              Opportunity Scanner
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Market Opportunities Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Collect and integrate ad-like expressions of interest into a
              follow-up database. Paste a URL to scan or raw text and choose
              keywords.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      className="w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      placeholder="https://example.com/jobs-or-ads"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      className="w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      placeholder="keywords, comma separated"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>
                </div>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <textarea
                    className="w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                    placeholder="Optional: paste page text here"
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Scan & Save
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {results.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="max-w-5xl mx-auto mt-12 grid gap-4 sm:grid-cols-2"
            >
              {results.map((r) => (
                <motion.div key={r.id} variants={fadeUp}>
                  <div className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {r.source}
                      </span>
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {r.snippet}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-md mx-auto mt-12 text-center"
            >
              <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 p-10">
                <Search className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground text-sm">
                  Enter a URL or text above to scan for opportunities.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
