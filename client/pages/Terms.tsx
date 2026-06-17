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
    title: "1. Agreement to Terms",
    content: "By accessing and using Wayrus Business Solutions Ltd services, you accept and agree to be bound by and comply with these Terms of Service. If you do not agree to abide by the above, please do not use this service.",
  },
  {
    title: "2. Use License",
    content: "Permission is granted to temporarily download one copy of the materials (information or software) on Wayrus services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
    list: [
      "Modifying or copying the materials",
      "Using the materials for any commercial purpose or for any public display",
      "Attempting to decompile or reverse engineer any software contained on the services",
      "Removing any copyright or other proprietary notations from the materials",
      "Transferring the materials to another person or 'mirroring' the materials on any other server",
    ],
  },
  {
    title: "3. Disclaimer",
    content: "The materials on Wayrus services are provided on an 'as is' basis. Wayrus makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
  },
  {
    title: "4. Limitations",
    content: "In no event shall Wayrus Business Solutions Ltd or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Wayrus services, even if Wayrus or a Wayrus authorized representative has been notified orally or in writing of the possibility of such damage.",
  },
  {
    title: "5. Accuracy of Materials",
    content: "The materials appearing on Wayrus services could include technical, typographical, or photographic errors. Wayrus does not warrant that any of the materials on its services are accurate, complete, or current. Wayrus may make changes to the materials contained on its services at any time without notice.",
  },
  {
    title: "6. Links",
    content: "Wayrus has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Wayrus of the site. Use of any such linked website is at the user's own risk.",
  },
  {
    title: "7. Modifications",
    content: "Wayrus may revise these terms of service for its services at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service.",
  },
  {
    title: "8. Governing Law",
    content: "These terms and conditions are governed by and construed in accordance with the laws of Kenya, and you irrevocably submit to the exclusive jurisdiction of the courts in Kenya.",
  },
];

export default function Terms() {
  return (
    <Layout>
      <SEO title="Terms of Service – Wayrus" />
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
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
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
                      {section.list.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
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
                    9. Contact Information
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="space-y-2">
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
