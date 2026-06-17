import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Mail,
  Phone,
  User,
  FileText,
  Zap,
  Calendar,
  DollarSign,
  ArrowRight,
  Loader2,
} from "lucide-react";

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

export default function Contact() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    projectType: "Website",
    budget: "$5k-$20k",
    timeline: "1-3 months",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm({ ...form, [k]: v });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiClient = (await import("@/lib/api-client")).apiClient;
      await apiClient.post("/contacts", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject || `${form.projectType} Project Inquiry`,
        message: `Project Type: ${form.projectType}\nBudget: ${form.budget}\nTimeline: ${form.timeline}\n\nDetails:\n${form.message}`,
      });
      setSubmitted(true);
      toast.success("Your inquiry has been received!");
      setTimeout(() => {
        setStep(1);
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          projectType: "Website",
          budget: "$5k-$20k",
          timeline: "1-3 months",
          message: "",
        });
        setSubmitted(false);
      }, 2000);
    } catch (e) {
      toast.error("Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  }

  const steps = [
    {
      number: 1,
      title: "Contact Info",
      icon: User,
      color: "from-blue-400 to-cyan-500",
    },
    {
      number: 2,
      title: "Project Details",
      icon: FileText,
      color: "from-purple-400 to-pink-500",
    },
    {
      number: 3,
      title: "Message",
      icon: Mail,
      color: "from-green-400 to-emerald-500",
    },
  ];

  const contactInfo = [
    {
      title: "Email",
      value: "info@wayrus.co.ke",
      icon: Mail,
      color: "from-blue-400 to-cyan-500",
    },
    {
      title: "Phone",
      value: "+254108316608",
      icon: Phone,
      color: "from-purple-400 to-pink-500",
    },
    {
      title: "Response",
      value: "Within 1 business day",
      icon: Zap,
      color: "from-orange-400 to-red-500",
    },
  ];

  return (
    <Layout>
      <SEO title="Contact – Wayrus Business Solutions Ltd" />

      <section className="relative min-h-screen py-12 sm:py-20">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />

        <div className="container max-w-4xl relative z-10">
          {/* Hero Section */}
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.1 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
            >
              Let's Build Something Great
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Tell us about your project and we'll get back to you within 1
              business day with our thoughts and ideas.
            </motion.p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.1 }}
            className="mb-12 sm:mb-16"
          >
            <div className="flex justify-between items-center">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isCompleted = step > s.number;
                const isCurrent = step === s.number;
                return (
                  <div
                    key={s.number}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="relative flex items-center justify-center mb-3">
                      <motion.div
                        whileHover={{ scale: isCurrent ? 1.15 : 1 }}
                        className={`w-14 h-14 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                          isCompleted
                            ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                            : isCurrent
                              ? `bg-gradient-to-br ${s.color} text-white shadow-lg shadow-black/20 scale-110`
                              : "bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-7 h-7" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </motion.div>
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                        isCurrent
                          ? "text-primary"
                          : isCompleted
                            ? "text-green-600 dark:text-green-400"
                            : "text-muted-foreground"
                      }`}
                    >
                      {s.title}
                    </span>
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute top-6 -left-1/2 w-full h-1.5 transition-all duration-500 rounded-full ${
                          isCompleted
                            ? "bg-gradient-to-r from-green-400 to-emerald-500"
                            : isCurrent
                              ? `bg-gradient-to-r ${s.color}`
                              : "bg-slate-200 dark:bg-slate-700"
                        }`}
                        style={{ width: "calc(100% + 2rem)" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-sm p-8 sm:p-10 border border-white/20 dark:border-slate-700/50 shadow-2xl"
          >
            {/* Decorative corner accents */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

            <form onSubmit={submit} className="space-y-8 relative z-10">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Full Name */}
                  <motion.div variants={fadeUp} initial="hidden" animate="show">
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Full Name *
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-4 w-5 h-5 text-primary/60 group-focus-within:text-primary transition-colors" />
                      <input
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.05 }}
                  >
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Email Address *
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-4 w-5 h-5 text-primary/60 group-focus-within:text-primary transition-colors" />
                      <input
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
                        placeholder="john@example.com"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-4 w-5 h-5 text-primary/60 group-focus-within:text-primary transition-colors" />
                      <input
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.15 }}
                    className="flex justify-end pt-4"
                  >
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 group"
                    >
                      Next
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Project Type */}
                  <motion.div variants={fadeUp} initial="hidden" animate="show">
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Project Type *
                    </label>
                    <select
                      className="w-full px-4 py-3.5 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all duration-200 text-foreground font-medium cursor-pointer"
                      value={form.projectType}
                      onChange={(e) => update("projectType", e.target.value)}
                    >
                      {[
                        "Website",
                        "Mobile App",
                        "ERP",
                        "SaaS",
                        "Custom System",
                        "Other",
                      ].map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Budget */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.05 }}
                  >
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Budget Range *
                    </label>
                    <div className="relative group">
                      <DollarSign className="absolute left-4 top-4 w-5 h-5 text-primary/60 group-focus-within:text-primary transition-colors" />
                      <select
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all duration-200 text-foreground font-medium cursor-pointer"
                        value={form.budget}
                        onChange={(e) => update("budget", e.target.value)}
                      >
                        {["<$5k", "$5k-$20k", "$20k-$50k", "$50k+"].map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>

                  {/* Timeline */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Timeline *
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-4 w-5 h-5 text-primary/60 group-focus-within:text-primary transition-colors" />
                      <select
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all duration-200 text-foreground font-medium cursor-pointer"
                        value={form.timeline}
                        onChange={(e) => update("timeline", e.target.value)}
                      >
                        {[
                          "<1 month",
                          "1-3 months",
                          "3-6 months",
                          "6+ months",
                        ].map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.15 }}
                    className="flex flex-col sm:flex-row justify-between gap-3 pt-4"
                  >
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3.5 rounded-xl border-2 border-slate-300/50 dark:border-slate-600/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 text-foreground font-semibold transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-secondary/30 text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group"
                    >
                      Next
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Message */}
                  <motion.div variants={fadeUp} initial="hidden" animate="show">
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Tell us about your project *
                    </label>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-4 w-5 h-5 text-primary/60 group-focus-within:text-primary transition-colors pointer-events-none" />
                      <textarea
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/70 dark:bg-slate-700/50 border-2 border-slate-200/50 dark:border-slate-600/50 focus:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground/50 resize-none h-40"
                        placeholder="Describe your project, goals, and any specific requirements..."
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.05 }}
                    className="flex flex-col sm:flex-row justify-between gap-3 pt-4"
                  >
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3.5 rounded-xl border-2 border-slate-300/50 dark:border-slate-600/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 text-foreground font-semibold transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit
                          <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </button>
                  </motion.div>

                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 p-5 bg-gradient-to-r from-green-400/20 to-emerald-500/20 border-2 border-green-400/50 dark:border-green-800/50 rounded-xl"
                    >
                      <p className="text-green-700 dark:text-green-400 font-semibold flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Thanks! We'll be in touch shortly.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 sm:mt-16"
          >
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${info.color} bg-opacity-10 backdrop-blur border border-white/20 p-8 text-center transition-all duration-300 cursor-pointer`}
                >
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${info.color} shadow-lg shadow-black/10 mb-4 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    {info.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{info.value}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
