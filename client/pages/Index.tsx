import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { HeroImage, CardImage } from "@/components/ui/optimized-image";
import { useAdmin } from "@/hooks/use-admin";

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

export default function Index() {
  const { isAuthenticated } = useAdmin();
  const seoDescription =
    "Wayrus Business Solutions Ltd - Expert web development, mobile apps, ERP systems, and SaaS solutions. Transforming businesses through smart digital innovation.";
  const seoImage =
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop";

  const slides = [
    {
      url: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=2000&auto=format&fit=crop",
      alt: "Team collaborating on software",
    },
    {
      url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2000&auto=format&fit=crop",
      alt: "Code on screen",
    },
    {
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&auto=format&fit=crop",
      alt: "Tech team brainstorming",
    },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const services = [
    {
      title: "Website Design & Redesign",
      desc: "Modern, responsive sites with SEO and blazing performance.",
      img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1200&auto=format&fit=crop",
      gradient: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
    },
    {
      title: "Android & iOS Apps",
      desc: "Cross‑platform experiences with robust APIs and analytics.",
      img: "https://images.unsplash.com/photo-1497493292307-31c376b6e479?q=80&w=1200&auto=format&fit=crop",
      gradient: "from-purple-400 to-pink-500",
      bgGradient:
        "from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
    },
    {
      title: "ERP & SaaS Solutions",
      desc: "Cloud-native platforms, subscription billing, and admin portals.",
      img: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop",
      gradient: "from-green-400 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
    },
    {
      title: "Custom Enterprise Systems",
      desc: "Tailored systems for unique workflows and integrations.",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
      gradient: "from-orange-400 to-red-500",
      bgGradient:
        "from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950",
    },
    {
      title: "Hospital & School Systems",
      desc: "Specialized solutions for healthcare and education sectors.",
      img: "https://images.unsplash.com/photo-1585435465945-bef5a93f8849?q=80&w=1200&auto=format&fit=crop",
      gradient: "from-yellow-400 to-orange-500",
      bgGradient:
        "from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950",
    },
    {
      title: "Projects & Assignments Support",
      desc: "Guidance and implementation for academic and personal projects.",
      img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
      gradient: "from-indigo-400 to-blue-500",
      bgGradient:
        "from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950",
    },
  ];

  const caseStudies = [
    {
      title: "E‑commerce web app",
      img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop",
      gradient: "from-rose-400 to-pink-500",
      bgGradient: "from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950",
    },
    {
      title: "Healthcare ERP",
      img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
      gradient: "from-teal-400 to-cyan-500",
      bgGradient: "from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950",
    },
    {
      title: "Mobile banking app",
      img: "https://images.pexels.com/photos/5054539/pexels-photo-5054539.jpeg",
      gradient: "from-violet-400 to-purple-500",
      bgGradient:
        "from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950",
    },
  ];

  return (
    <Layout>
      <SEO
        title="Wayrus Business Solutions Ltd – Smart Digital Solutions for Business Growth"
        description="Web, Mobile, ERP, SaaS and IT solutions. Websites, app development, enterprise systems and more."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {slides.map((s, i) => (
            <motion.div
              key={s.url}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{
                opacity: i === idx ? 1 : 0,
                scale: i === idx ? 1 : 1.02,
              }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full"
            >
              <HeroImage
                src={s.url}
                alt={s.alt}
                width={2000}
                height={1200}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/40" />
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
        </div>

        <div className="container grid gap-6 sm:gap-10 py-20 sm:py-32 md:grid-cols-2 items-center pointer-events-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="pointer-events-auto"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-secondary to-secondary/70 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-secondary/30"
            >
              🚀 Wayrus Business Solutions Ltd
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-4xl sm:text-5xl md:text-7xl font-black leading-tight text-white tracking-tight"
            >
              Smart Digital Solutions for Business Growth
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg sm:text-xl text-white/90 max-w-xl leading-relaxed font-medium"
            >
              We design and build high‑impact Websites, Mobile Apps, ERPs, SaaS,
              and specialized systems for healthcare, education, and logistics.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 pointer-events-auto"
            >
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-lg font-bold text-white shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/60 transition-all duration-300 hover:scale-105 group"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 backdrop-blur px-8 py-4 text-lg font-bold text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
              >
                <span>Book Consultation</span>
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
          <div className="hidden md:block" />
        </div>
      </section>

      {/* What We Do Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
            variants={containerVariants}
            className="mb-12 sm:mb-16"
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-extrabold mb-4"
            >
              What We Do
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              From concept to deployment, we provide end‑to‑end engineering that
              scales with your business.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
            variants={containerVariants}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service, idx) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${service.bgGradient} p-6 transition-all duration-300 flex flex-col h-full`}
              >
                {/* Image Container */}
                <div className="h-40 rounded-xl overflow-hidden mb-6 relative">
                  <CardImage
                    src={service.img}
                    alt={service.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {service.desc}
                </p>

                {/* Icon Badge */}
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${service.gradient} shadow-lg shadow-black/10 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Zap className="h-5 w-5 text-white" />
                </div>

                {/* Accent line */}
                <div
                  className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${service.gradient} transition-all duration-500 group-hover:w-full`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Decorative blobs */}
        <div className="absolute -top-40 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
            variants={containerVariants}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 sm:mb-16 gap-4"
          >
            <div>
              <motion.h2
                variants={fadeUp}
                className="text-4xl sm:text-5xl font-extrabold mb-4"
              >
                Case Studies
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
              >
                Real projects, real results. See how we've transformed
                businesses.
              </motion.p>
            </div>
            <motion.div variants={fadeUp}>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 text-lg font-bold text-primary hover:text-secondary transition-colors group"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
            variants={containerVariants}
            className="grid gap-6 md:grid-cols-3"
          >
            {caseStudies.map((caseStudy, idx) => (
              <motion.div
                key={caseStudy.title}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Link to="/portfolio" className="group block h-full">
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${caseStudy.bgGradient} h-full flex flex-col transition-all duration-300`}
                  >
                    {/* Image Container */}
                    <div className="h-64 relative overflow-hidden">
                      <CardImage
                        src={caseStudy.img}
                        alt={caseStudy.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                        {caseStudy.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        Delivered high‑quality UX and measurable outcomes
                      </p>
                    </div>

                    {/* Accent line */}
                    <div
                      className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${caseStudy.gradient} transition-all duration-500 group-hover:w-full`}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
            variants={containerVariants}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/80 to-secondary px-8 sm:px-12 py-16 sm:py-20 text-center"
          >
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <motion.h2
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4"
              >
                Ready to build your solution?
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed"
              >
                Let's transform your idea into a product customers love. Get
                started today.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-primary px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  <span>Let's Build</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/opportunities"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white text-white px-8 py-4 text-lg font-bold hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
                  >
                    <span>Market Hub</span>
                    <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
