import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  Cloud,
  Smartphone,
  BookOpen,
  Zap,
  Briefcase,
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

export default function Services() {
  const services = [
    {
      title: "Website design & redesign",
      desc: "Modern, responsive sites with SEO and blazing performance.",
      icon: Globe,
      gradient: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
    },
    {
      title: "ERP & SaaS solutions",
      desc: "Cloud-native platforms, subscription billing, and admin portals.",
      icon: Cloud,
      gradient: "from-purple-400 to-pink-500",
      bgGradient:
        "from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
    },
    {
      title: "Android & iOS apps",
      desc: "Cross‑platform experiences with robust APIs and analytics.",
      icon: Smartphone,
      gradient: "from-green-400 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
    },
    {
      title: "School assignments & projects support",
      desc: "Guidance and implementation for academic and personal projects.",
      icon: BookOpen,
      gradient: "from-orange-400 to-red-500",
      bgGradient:
        "from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950",
    },
    {
      title: "Specialized systems",
      desc: "Hospital, school, and transport/logistics platforms ready to scale.",
      icon: Zap,
      gradient: "from-yellow-400 to-orange-500",
      bgGradient:
        "from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950",
    },
    {
      title: "Custom enterprise software",
      desc: "Tailored systems for unique workflows and integrations.",
      icon: Briefcase,
      gradient: "from-indigo-400 to-blue-500",
      bgGradient:
        "from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950",
    },
  ];

  return (
    <Layout>
      <SEO title="Services – Wayrus Business Solutions Ltd" description="Web design, mobile app development, ERP systems, SaaS, custom software, and specialized enterprise solutions by Wayrus Business Solutions in Kenya." extraSchemas={[{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": services.map((s, i) => ({
            "@type": "Service",
            "position": i + 1,
            "name": s.title,
            "description": s.desc,
            "provider": {
              "@type": "Organization",
              "name": "Wayrus Business Solutions Ltd"
            }
          }))
        }]} />

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
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
            >
              Services
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              End‑to‑end delivery with a focus on results. Every service
              includes discovery, design, development, QA, and support.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container py-8 sm:py-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10">
          What We Offer
        </h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
          variants={containerVariants}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.bgGradient} p-8 transition-all duration-300 cursor-pointer`}
              >
                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

                {/* Icon container with gradient background */}
                <div
                  className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} shadow-lg shadow-black/10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                >
                  <Icon className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed flex-1">
                    {s.desc}
                  </p>

                  {/* CTA Button */}
                  <Link
                    to="/contact"
                    className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${s.gradient} px-6 py-3 font-semibold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 group/btn`}
                  >
                    <span>Request Quote</span>
                    <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>

                {/* Gradient accent line */}
                <div
                  className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${s.gradient} transition-all duration-500 group-hover:w-full`}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 sm:py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
          variants={containerVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/80 to-secondary px-8 sm:px-12 py-12 sm:py-16 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-extrabold text-white"
            >
              Need guidance choosing?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-3 text-lg text-white/80 max-w-xl mx-auto"
            >
              Book a free 30‑minute consultation and we'll map the fastest path
              to value.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-primary px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span>Book Consultation</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="container py-12 sm:py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
          className="text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-bold mb-4"
          >
            Why choose Wayrus?
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="grid gap-4 sm:gap-6 md:grid-cols-3 mt-8"
          >
            {[
              {
                title: "Expert Team",
                desc: "Experienced developers and designers with 10+ years track record",
                color: "from-blue-400 to-cyan-500",
              },
              {
                title: "Fast Delivery",
                desc: "Agile methodology ensures quick turnaround without compromising quality",
                color: "from-purple-400 to-pink-500",
              },
              {
                title: "24/7 Support",
                desc: "Dedicated support team available around the clock for any issues",
                color: "from-green-400 to-emerald-500",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -4 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} bg-opacity-10 backdrop-blur border border-white/20`}
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} mb-3`}
                >
                  <span className="text-xl text-white font-bold">✓</span>
                </div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </Layout>
  );
}
