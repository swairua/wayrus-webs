import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { FormEvent, useState } from "react";

interface Opportunity {
  id: string;
  source: string;
  snippet: string;
  url?: string;
  createdAt: string;
}

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
    const res = await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: url || undefined,
        text: text || undefined,
        keywords: keywords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });
    const data = await res.json();
    setResults(data.items || []);
    setLoading(false);
  }

  return (
    <Layout>
      <SEO title="Market Opportunities Hub – Wayrus" />
      <section className="container py-16">
        <h1 className="text-4xl font-extrabold">Market Opportunities Hub</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Collect and integrate ad‑like expressions of interest into a follow‑up
          database. Paste a URL to scan or raw text and choose keywords.
        </p>
        <form onSubmit={submit} className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-md border px-4 py-2"
            placeholder="https://example.com/jobs-or-ads"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            className="rounded-md border px-4 py-2"
            placeholder="keywords, comma separated"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <textarea
            className="md:col-span-2 h-32 rounded-md border px-4 py-2"
            placeholder="Optional: paste page text here"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="md:col-span-2 rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold">
            {loading ? "Scanning..." : "Scan & Save"}
          </button>
        </form>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {results.map((r) => (
            <div key={r.id} className="rounded-md border p-4">
              <div className="text-xs text-muted-foreground">{r.source}</div>
              <p className="mt-1">{r.snippet}</p>
              {r.url && (
                <a
                  href={r.url}
                  className="text-secondary text-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
