import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

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

const sections = [
  {
    title: "1. Introduction",
    content: 'At Wayrus Business Solutions Ltd ("Company," "we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.',
  },
  {
    title: "2. Information We Collect",
    content: "We may collect information about you in a variety of ways. The information we may collect on the Site includes:",
    list: [
      { label: "Personal Data:", detail: "Name, email address, phone number, postal address, and other information you voluntarily submit" },
      { label: "Derivative Data:", detail: "Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, and your activities on the Site" },
      { label: "Financial Data:", detail: "Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site" },
    ],
  },
  {
    title: "3. Use of Your Information",
    content: "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:",
    list: [
      "Generate a personal profile about you so that future visits to the Site will be personalized as possible",
      "Increase the efficiency and operation of the Site",
      "Monitor and analyze usage and trends to improve your experience with the Site",
      "Notify you of updates to the Site",
      "Offer new products, services, and/or recommendations to you",
    ],
  },
  {
    title: "4. Disclosure of Your Information",
    content: "We may share or disclose your information in the following situations:",
    list: [
      { label: "By Law or to Protect Rights:", detail: "If we believe the release of information about you is necessary to comply with the law or to protect the rights, property, and safety of our Company" },
      { label: "Third-Party Service Providers:", detail: "We may share your information with third parties who perform services for us or on our behalf, including payment processing, data analysis, email delivery, and customer service" },
      { label: "Business Transfers:", detail: "We may share or transfer your information in connection with a merger, sale of company assets, bankruptcy, or other business transaction" },
    ],
  },
  {
    title: "5. Security of Your Information",
    content: "We use administrative, technical, and physical security measures to help protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.",
  },
];

export default function Privacy() {
  return (
    <Layout>
      <SEO
        title="Privacy Policy"
        description="Our privacy policy and data protection practices"
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
              Privacy Policy
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
                  {section.list && Array.isArray(section.list) && (
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
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
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
                    If you have questions or comments about this Privacy Policy, please contact us at:
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
