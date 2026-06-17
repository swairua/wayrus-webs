import { FormEvent, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Zap, CheckCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        // Only check auth if we have a token
        const token = apiClient.getToken();
        if (!token) {
          if (isMounted) {
            setIsAdmin(false);
          }
          return;
        }

        await apiClient.get("/admin/me");
        if (isMounted) {
          setIsAdmin(true);
        }
      } catch (error) {
        if (isMounted) {
          setIsAdmin(false);
        }
        // Silently fail - the user is not authenticated
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  async function subscribe(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    try {
      await apiClient.post("/newsletter", { email });
      setSubscribed(true);
      setStatus("Subscribed successfully!");
      setEmail("");
      setTimeout(() => {
        setSubscribed(false);
        setStatus(null);
      }, 3000);
    } catch (error) {
      setStatus("Failed to subscribe. Try again.");
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "info@wayrus.co.ke",
      link: "mailto:info@wayrus.co.ke",
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+254108316608",
      link: "tel:+254108316608",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Nairobi, Kenya",
      link: "#",
      gradient: "from-green-400 to-emerald-500",
    },
  ];

  return (
    <footer className="relative border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="container relative z-10 py-16 sm:py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
          variants={containerVariants}
          className="grid gap-8 sm:gap-10 lg:grid-cols-4"
        >
          {/* Company Info */}
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground mb-4">
              Wayrus
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              Smart Digital Solutions for Business Growth. We build websites,
              mobile apps, ERPs, SaaS, and specialized enterprise systems.
            </p>
            <div className="flex gap-3">
              {[
                { color: "from-blue-400 to-cyan-500", label: "Web" },
                { color: "from-purple-400 to-pink-500", label: "Apps" },
                { color: "from-green-400 to-emerald-500", label: "Cloud" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${badge.color} text-xs font-bold text-white shadow-lg shadow-black/10`}
                  title={badge.label}
                >
                  {badge.label.charAt(0)}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={fadeUp} className="lg:col-span-3">
            <h4 className="text-lg font-bold text-foreground mb-6">
              Get in Touch
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.link}
                    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} bg-opacity-10 backdrop-blur border border-white/20 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-black/10`}
                  >
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} shadow-lg shadow-black/10 mb-3 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.value}
                    </p>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
          className="mt-12 sm:mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/80 to-secondary p-8 sm:p-12"
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <motion.div variants={fadeUp} className="max-w-2xl">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                Stay Updated
              </h3>
              <p className="text-lg text-white/80 mb-6">
                Get the latest insights on digital transformation, project
                updates, and industry trends delivered to your inbox.
              </p>
            </motion.div>

            <motion.form
              variants={fadeUp}
              onSubmit={subscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-xl"
            >
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-white/60 pointer-events-none" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-primary font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                {subscribed ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>

            {status && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 text-sm font-medium ${
                  subscribed ? "text-green-200" : "text-red-200"
                }`}
              >
                {status}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Quick Links Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
          variants={containerVariants}
          className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-8 sm:gap-10 md:gap-12"
        >
          <motion.div variants={fadeUp} className="w-48">
            <h4 className="font-bold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {[
                { name: "Website Design", link: "/services" },
                { name: "Mobile Apps", link: "/services" },
                { name: "ERP Solutions", link: "/services" },
                { name: "SaaS Platforms", link: "/services" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="w-48">
            <h4 className="font-bold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { name: "About", link: "/" },
                { name: "Portfolio", link: "/portfolio" },
                { name: "Contact", link: "/contact" },
                { name: "Opportunities", link: "/opportunities" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="w-48">
            <h4 className="font-bold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                { name: "Documentation", link: "#" },
                { name: "Blog", link: "#" },
                { name: "FAQ", link: "#" },
                { name: "Support", link: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="w-48">
            <h4 className="font-bold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                { name: "Privacy", link: "/privacy" },
                { name: "Terms", link: "/terms" },
                { name: "Cookies", link: "/cookies" },
                { name: "Sitemap", link: "/sitemap" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200/50 dark:border-slate-700/50 relative z-10 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          variants={containerVariants}
          className="container py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs sm:text-sm text-yellow-500 dark:text-yellow-400 text-center sm:text-left font-semibold"
          >
            © {new Date().getFullYear()} Wayrus Business Solutions Ltd. All
            rights reserved.
          </motion.p>
          <motion.div variants={fadeUp} className="flex gap-4">
            {!isAdmin && (
              <Link
                to="/admin/login"
                className="text-xs sm:text-sm text-yellow-500 dark:text-yellow-400 hover:text-yellow-300 transition-colors font-medium hover:underline"
              >
                Admin Login
              </Link>
            )}
            <span className="text-xs text-yellow-600 dark:text-yellow-500">
              |
            </span>
            <Link
              to="/terms"
              className="text-xs sm:text-sm text-yellow-500 dark:text-yellow-400 hover:text-yellow-300 transition-colors font-medium hover:underline"
            >
              Terms
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
