import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Sitemap() {
  const siteStructure = [
    {
      category: "Main Pages",
      gradient: "from-blue-500 to-cyan-500",
      links: [
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Portfolio", path: "/portfolios" },
        { name: "Opportunities", path: "/opportunities" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      category: "Legal",
      gradient: "from-purple-500 to-pink-500",
      links: [
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Cookie Policy", path: "/cookies" },
      ],
    },
    {
      category: "Admin",
      gradient: "from-amber-500 to-orange-500",
      links: [
        { name: "Admin Login", path: "/admin/login" },
        { name: "Dashboard - Users", path: "/admin/users" },
        { name: "Dashboard - Opportunities", path: "/admin/opportunities" },
        { name: "Dashboard - Portfolios", path: "/admin/portfolios" },
        { name: "Dashboard - Leads", path: "/admin/leads" },
        { name: "Dashboard - Discovery Leads", path: "/admin/discovery-leads" },
        { name: "Dashboard - Quotations", path: "/admin/quotations" },
        { name: "Dashboard - Contacts", path: "/admin/contacts" },
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
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Sitemap
            </h1>
            <p className="text-lg text-muted-foreground">
              A complete guide to all pages and sections on our website.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto grid gap-8"
          >
            {siteStructure.map((section) => (
              <motion.div key={section.category} variants={cardUp}>
                <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-1 rounded-full bg-gradient-to-r ${section.gradient} mb-5`} />
                  <h2 className="text-2xl font-bold tracking-tight mb-6">
                    {section.category}
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {section.links.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="group flex items-center justify-between rounded-xl border bg-card/50 p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5"
                      >
                        <span className="font-medium text-sm">{link.name}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="max-w-4xl mx-auto mt-8"
          >
            <div className="rounded-2xl border bg-gradient-to-br from-secondary/5 to-secondary/10 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shrink-0">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                  <p className="text-muted-foreground">
                    Can't find what you're looking for? Visit our{" "}
                    <Link to="/contact" className="text-primary hover:underline font-medium">
                      contact page
                    </Link>{" "}
                    or email us at{" "}
                    <a
                      href="mailto:info@wayrus.co.ke"
                      className="text-primary hover:underline font-medium"
                    >
                      info@wayrus.co.ke
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
