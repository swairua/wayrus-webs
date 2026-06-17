import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

export default function Sitemap() {
  const siteStructure = [
    {
      category: "Main Pages",
      links: [
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Portfolio", path: "/portfolio" },
        { name: "Opportunities", path: "/opportunities" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      category: "Legal",
      links: [
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Cookie Policy", path: "/cookies" },
      ],
    },
    {
      category: "Admin",
      links: [
        { name: "Admin Login", path: "/admin/login" },
        { name: "Dashboard - Opportunities", path: "/admin/opportunities" },
        { name: "Dashboard - Portfolios", path: "/admin/portfolios" },
        { name: "Dashboard - Leads", path: "/admin/leads" },
        { name: "Dashboard - Discovery Leads", path: "/admin/discovery-leads" },
        { name: "Dashboard - Quotations", path: "/admin/quotations" },
        { name: "Dashboard - Contacts", path: "/admin/contacts" },
        { name: "Dashboard - Users", path: "/admin/users" },
        { name: "Dashboard - Logs", path: "/admin/logs" },
      ],
    },
  ];

  return (
    <Layout>
      <SEO
        title="Sitemap"
        description="Complete sitemap of Wayrus Business Solutions website"
      />
      <section className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sitemap
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            A complete guide to all pages and sections on our website.
          </p>

          <div className="grid gap-8">
            {siteStructure.map((section) => (
              <div key={section.category} className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  {section.category}
                </h2>
                <ul className="grid gap-3">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="inline-flex items-center text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
                      >
                        <span className="mr-2">→</span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-lg bg-secondary/10 border border-secondary/20">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Need Help?
            </h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Visit our{" "}
              <Link to="/contact" className="text-primary hover:underline">
                contact page
              </Link>{" "}
              or email us at{" "}
              <a
                href="mailto:info@wayrus.co.ke"
                className="text-primary hover:underline"
              >
                info@wayrus.co.ke
              </a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
