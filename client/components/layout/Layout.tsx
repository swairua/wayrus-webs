import { PropsWithChildren } from "react";
import { useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const breadcrumbLabels: Record<string, string> = {
  services: "Services",
  portfolios: "Portfolios",
  contact: "Contact",
  opportunities: "Opportunities",
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  cookies: "Cookie Policy",
  sitemap: "Sitemap",
};

export default function Layout({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {!isHome && segments.length > 0 && (
          <div className="container pt-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((seg, idx) => {
                  const href = "/" + segments.slice(0, idx + 1).join("/");
                  const label = breadcrumbLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
                  const isLast = idx === segments.length - 1;
                  return (
                    <BreadcrumbItem key={href}>
                      <BreadcrumbSeparator />
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={href}>{label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
      
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
