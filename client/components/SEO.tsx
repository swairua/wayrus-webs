import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  author?: string;
  type?: string;
  robots?: string;
  viewport?: string;
  twitterCard?: string;
  twitterCreator?: string;
  extraSchemas?: Record<string, any>[];
}

export default function SEO({
  title,
  description = "Wayrus Business Solutions Ltd - Smart Digital Solutions for Business Growth. We build websites, mobile apps, ERPs, SaaS, and specialized enterprise systems.",
  keywords = "web development, mobile app development, ERP systems, SaaS, custom software, digital solutions, business software, enterprise systems",
  image = "/logo.svg",
  canonical = typeof window !== "undefined" ? window.location.href : "",
  author = "Wayrus Business Solutions Ltd",
  type = "website",
  robots = "index, follow",
  viewport = "width=device-width, initial-scale=1.0",
  twitterCard = "summary_large_image",
  twitterCreator = "@wayrus_solutions",
}: SEOProps) {
  useEffect(() => {
    // Set page title
    document.title = title;

    // Helper function to set or create meta tags
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Set standard meta tags
    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("author", author);
    setMeta("robots", robots);
    setMeta("viewport", viewport);

    // Set Open Graph meta tags
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", image, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", "Wayrus Business Solutions Ltd", true);
    if (canonical) {
      setMeta("og:url", canonical, true);
    }

    // Set Twitter Card meta tags
    setMeta("twitter:card", twitterCard);
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
    setMeta("twitter:creator", twitterCreator);

    // Set canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    // Remove existing JSON-LD scripts
    document.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());

    // Inject Organization schema (base)
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Wayrus Business Solutions Ltd",
      url: "https://wayrus.co.ke",
      logo: "https://wayrus.co.ke/logo.png",
      description: description,
      sameAs: [
        "https://www.linkedin.com/company/wayrus-business-solutions",
        "https://twitter.com/wayrus_solutions",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        email: "info@wayrus.co.ke",
      },
      areaServed: ["KE", "East Africa"],
      serviceType: [
        "Web Development",
        "Mobile App Development",
        "ERP Systems",
        "SaaS Development",
        "Custom Software",
      ],
    };

    const injectScript = (data: Record<string, any>) => {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    };

    injectScript(orgSchema);

    // Inject page-specific schemas
    if (extraSchemas && extraSchemas.length > 0) {
      extraSchemas.forEach((s) => injectScript(s));
    }

    return () => {
      // Cleanup is optional since meta tags will be replaced on route change
    };
  }, [title, description, keywords, image, canonical, author, robots, type, extraSchemas]);

  return null;
}
