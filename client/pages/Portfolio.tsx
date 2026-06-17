import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { CardImage } from "@/components/ui/optimized-image";

interface Portfolio {
  id: number | string;
  title: string;
  description: string;
  website_url: string;
  screenshot_url: string;
  status: string;
}

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const data = await apiClient.get<{ data: Portfolio[] }>(
          "/portfolios/public",
        );
        setPortfolios(data.data || []);
      } catch (error) {
        console.error("Failed to fetch portfolios:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolios();
  }, []);

  return (
    <Layout>
      <SEO title="Portfolio – Wayrus Business Solutions Ltd" />
      <section className="container py-16">
        <h1 className="text-4xl font-extrabold">Portfolio</h1>
        <p className="mt-2 text-muted-foreground">
          Selected case studies across Websites, Mobile Apps, and Enterprise
          Systems.
        </p>
        {loading ? (
          <div className="mt-8 text-center text-muted-foreground">
            Loading portfolio items...
          </div>
        ) : portfolios.length === 0 ? (
          <div className="mt-8 text-center text-muted-foreground">
            No portfolio items available yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {portfolios.map((item) => (
              <a
                key={item.id}
                href={item.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-background hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
              >
                {item.screenshot_url && (
                  <div className="h-40 w-full rounded-lg overflow-hidden">
                    <CardImage
                      src={item.screenshot_url}
                      alt={item.title}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                {!item.screenshot_url && (
                  <div className="h-40 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20" />
                )}
                <h3 className="mt-3 font-semibold group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
