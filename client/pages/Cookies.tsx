import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Cookie, Shield, Mail, Phone, MapPin } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const cookieTypes = [
  {
    title: "Session Cookies",
    color: "from-primary to-primary/80",
    description: "These cookies are temporary and expire when you close your browser. They help us maintain your session while you use our website.",
  },
  {
    title: "Persistent Cookies",
    color: "from-secondary to-secondary/80",
    description: "These cookies remain on your device for a longer period. They help us remember your preferences on future visits.",
  },
  {
    title: "Third-Party Cookies",
    color: "from-amber-500 to-orange-500",
    description: "These cookies are set by third-party services we use, such as analytics providers and advertising partners.",
  },
];

const sections = [
  {
    title: "1. What Are Cookies?",
    content: "Cookies are small files that are stored on your browser or the hard drive of your computer or mobile device. They allow websites to recognize your device and store some information about your preferences or past actions.",
  },
  {
    title: "2. How We Use Cookies",
    content: "We use cookies for various purposes, including:",
    list: [
      { label: "Essential Cookies:", detail: "Necessary for the operation of our website and to provide you with the services you request" },
      { label: "Performance Cookies:", detail: "Help us understand how visitors use our website so we can improve performance and user experience" },
      { label: "Functional Cookies:", detail: "Allow us to remember your preferences and provide enhanced functionality" },
      { label: "Marketing Cookies:", detail: "Used to track visitors across websites to display relevant advertisements" },
    ],
  },
  {
    title: "4. Managing Your Cookies",
    content: "Most web browsers allow you to control cookies through their settings. You can typically:",
    list: [
      "View what cookies are set on your device",
      "Delete cookies from your device",
      "Block all cookies or specific types of cookies",
      "Receive notifications when cookies are being set",
    ],
    note: "Please note that blocking essential cookies may affect the functionality of our website and the services we can provide.",
  },
  {
    title: "5. Changes to This Cookie Policy",
    content: "We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Your continued use of our website following the posting of revised changes means that you accept and agree to the changes.",
  },
];

export default function Cookies() {
  return (
    <Layout>
      <SEO
        title="Cookie Policy"
        description="Information about how we use cookies on our website"
      />
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-secondary mb-5" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {sections.map((section) => (
              <motion.div key={section.title} variants={cardUp}>
                <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-secondary mb-5" />
                  <h2 className="text-2xl font-bold tracking-tight mb-4">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                  {section.list && (
                    <ul className="mt-4 space-y-2">
                      {section.list.map((item, i) => {
                        if (typeof item === "string") {
                          return (
                            <li key={i} className="flex items-start gap-2 text-muted-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              {item}
                            </li>
                          );
                        }
                        return (
                          <li key={i} className="text-muted-foreground">
                            <strong className="text-foreground">{item.label}</strong> {item.detail}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {section.note && (
                    <p className="mt-4 text-sm text-muted-foreground border-l-4 border-primary/40 pl-4 italic">
                      {section.note}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Cookie Types Cards */}
            <motion.div variants={cardUp}>
              <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-secondary mb-5" />
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  3. Types of Cookies We Use
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {cookieTypes.map((type) => (
                    <div
                      key={type.title}
                      className={`rounded-xl border-l-4 p-4 bg-gradient-to-br from-card to-muted/30`}
                      style={{ borderLeftColor: `var(--${type.color.split(" ")[0].replace("from-", "")})` }}
                    >
                      <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${type.color} mb-3`} />
                      <h3 className="font-semibold mb-2 text-sm">{type.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8"
          >
            <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-secondary/5 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gradient-to-br from-primary to-secondary p-3 shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2">
                    6. Contact Us
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    If you have questions about our use of cookies, please contact us at:
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Wayrus Business Solutions Ltd</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <a href="mailto:info@wayrus.co.ke" className="text-primary hover:underline">info@wayrus.co.ke</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href="tel:+254108316608" className="text-primary hover:underline">+254108316608</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Nairobi, Kenya</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
