import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, X, ArrowRight, CheckCircle } from "lucide-react";
import { CardImage } from "@/components/ui/optimized-image";

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

interface Portfolio {
  id: number;
  title: string;
  description: string;
  website_url: string;
  screenshot_url: string;
  status: string;
  created_at: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const portfolioGradients = [
  "from-blue-400 to-cyan-500",
  "from-purple-400 to-pink-500",
  "from-green-400 to-emerald-500",
  "from-orange-400 to-red-500",
  "from-yellow-400 to-orange-500",
  "from-indigo-400 to-blue-500",
  "from-rose-400 to-pink-500",
  "from-teal-400 to-cyan-500",
  "from-violet-400 to-purple-500",
];

const portfolioBgGradients = [
  "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
  "from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
  "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
  "from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950",
  "from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950",
  "from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950",
  "from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950",
  "from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950",
  "from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950",
];

export default function Portfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null,
  );
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    project_description: "",
    budget_range: "",
    timeline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function loadPortfolios() {
    setLoading(true);
    try {
      const data = await apiClient.get<{ data: Portfolio[] }>(
        "/portfolios/public",
      );
      setPortfolios(data.data || []);
    } catch (e) {
      console.error("Failed to load portfolios", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitQuote(e: React.FormEvent) {
    e.preventDefault();
    if (
      !quoteForm.customer_name ||
      !quoteForm.customer_email ||
      !quoteForm.project_description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/quotations", {
        ...quoteForm,
        portfolio_id: selectedPortfolio?.id,
      });
      setSubmitted(true);
      toast.success("Quote request submitted! We'll be in touch soon.");
      setTimeout(() => {
        setShowQuoteForm(false);
        setSubmitted(false);
        setQuoteForm({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          project_description: "",
          budget_range: "",
          timeline: "",
        });
        setSelectedPortfolio(null);
      }, 2000);
    } catch (e) {
      toast.error("Failed to submit quote request");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    loadPortfolios();
  }, []);

  return (
    <Layout>
      <SEO title="Portfolios – Wayrus Business Solutions Ltd" />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.1 }}
            className="text-center"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
            >
              Our Portfolio
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Explore our recent projects and see what we can do for you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="container py-8 sm:py-12">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center">
              <div className="animate-spin">
                <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary" />
              </div>
              <p className="ml-4 text-muted-foreground">
                Loading portfolios...
              </p>
            </div>
          </motion.div>
        )}

        {!loading && portfolios.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200/50 dark:border-slate-700/50"
          >
            <p className="text-muted-foreground text-lg">
              No portfolios available yet.
            </p>
          </motion.div>
        )}

        {!loading && portfolios.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {portfolios.map((portfolio, idx) => {
              const gradientColor =
                portfolioGradients[idx % portfolioGradients.length];
              const bgGradientColor =
                portfolioBgGradients[idx % portfolioBgGradients.length];

              return (
                <motion.div
                  key={portfolio.id}
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${bgGradientColor} transition-all duration-300 flex flex-col h-full`}
                >
                  {/* Image Container */}
                  <a
                    href={portfolio.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-56 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center overflow-hidden cursor-pointer relative"
                  >
                    {portfolio.screenshot_url ? (
                      <CardImage
                        src={portfolio.screenshot_url}
                        alt={portfolio.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center text-white">
                        <div
                          className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradientColor} shadow-lg mb-3`}
                        >
                          <Globe className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-semibold">Visit Website</p>
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {portfolio.title}
                    </h3>

                    {portfolio.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {portfolio.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                      <a
                        href={portfolio.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${gradientColor} text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-black/20 transition-all duration-300 hover:scale-105 w-full justify-center group/link`}
                      >
                        <span>Visit Website</span>
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                      <button
                        onClick={() => {
                          setSelectedPortfolio(portfolio);
                          setShowQuoteForm(true);
                          setSubmitted(false);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300/50 dark:border-slate-600/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 text-foreground font-semibold transition-all duration-300 hover:scale-105"
                      >
                        Request Quote
                      </button>
                    </div>
                  </div>

                  {/* Accent line */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${gradientColor} transition-all duration-500 group-hover:w-full`}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* Quote Form Modal */}
      <AnimatePresence>
        {showQuoteForm && selectedPortfolio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSubmitting && setShowQuoteForm(false)}
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-800/95 dark:to-slate-900/95 backdrop-blur rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full sm:max-h-[90vh] max-h-[95vh] overflow-y-auto"
            >
              <div className="p-6 sm:p-8">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between items-start mb-8"
                >
                  <div>
                    <h2 className="text-3xl font-extrabold">Request a Quote</h2>
                    <p className="text-muted-foreground mt-1 text-lg">
                      For:{" "}
                      <span className="font-semibold text-foreground">
                        {selectedPortfolio.title}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowQuoteForm(false)}
                    disabled={isSubmitting}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </motion.div>

                {!submitted ? (
                  <form onSubmit={handleSubmitQuote} className="space-y-5">
                    {/* Full Name */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <label className="text-sm font-semibold text-foreground block mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={quoteForm.customer_name}
                        onChange={(e) =>
                          setQuoteForm({
                            ...quoteForm,
                            customer_name: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                      />
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="text-sm font-semibold text-foreground block mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={quoteForm.customer_email}
                        onChange={(e) =>
                          setQuoteForm({
                            ...quoteForm,
                            customer_email: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                      />
                    </motion.div>

                    {/* Phone */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="text-sm font-semibold text-foreground block mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+254..."
                        value={quoteForm.customer_phone}
                        onChange={(e) =>
                          setQuoteForm({
                            ...quoteForm,
                            customer_phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                      />
                    </motion.div>

                    {/* Project Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="text-sm font-semibold text-foreground block mb-2">
                        Project Description *
                      </label>
                      <textarea
                        placeholder="Tell us about your project..."
                        value={quoteForm.project_description}
                        onChange={(e) =>
                          setQuoteForm({
                            ...quoteForm,
                            project_description: e.target.value,
                          })
                        }
                        required
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground resize-none"
                      />
                    </motion.div>

                    {/* Budget & Timeline */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="text-sm font-semibold text-foreground block mb-2">
                          Budget Range
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., $5k-$20k"
                          value={quoteForm.budget_range}
                          onChange={(e) =>
                            setQuoteForm({
                              ...quoteForm,
                              budget_range: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-foreground block mb-2">
                          Timeline
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 1-3 months"
                          value={quoteForm.timeline}
                          onChange={(e) =>
                            setQuoteForm({
                              ...quoteForm,
                              timeline: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                        />
                      </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex gap-3 pt-4"
                    >
                      <button
                        type="button"
                        onClick={() => setShowQuoteForm(false)}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3.5 rounded-xl border-2 border-slate-300/50 dark:border-slate-600/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 text-foreground font-semibold transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 text-white font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin">⚡</span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Quote
                            <CheckCircle className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", damping: 15 }}
                      className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg mb-4"
                    >
                      <CheckCircle className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">
                      Quote Request Submitted!
                    </h3>
                    <p className="text-muted-foreground">
                      Thanks! We'll review your request and get back to you
                      soon.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
