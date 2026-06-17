import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";

export default function Privacy() {
  return (
    <Layout>
      <SEO
        title="Privacy Policy"
        description="Our privacy policy and data protection practices"
      />
      <section className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At Wayrus Business Solutions Ltd ("Company," "we," "our," or
                "us"), we are committed to protecting your privacy. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website and use our
                services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                2. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may collect information about you in a variety of ways. The
                information we may collect on the Site includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>Personal Data:</strong> Name, email address, phone
                  number, postal address, and other information you voluntarily
                  submit
                </li>
                <li>
                  <strong>Derivative Data:</strong> Information our servers
                  automatically collect when you access the Site, such as your
                  IP address, browser type, operating system, and your
                  activities on the Site
                </li>
                <li>
                  <strong>Financial Data:</strong> Financial information, such
                  as data related to your payment method (e.g., valid credit
                  card number, card brand, expiration date) that we may collect
                  when you purchase, order, return, exchange, or request
                  information about our services from the Site
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                3. Use of Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Having accurate information about you permits us to provide you
                with a smooth, efficient, and customized experience.
                Specifically, we may use information collected about you via the
                Site to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  Generate a personal profile about you so that future visits to
                  the Site will be personalized as possible
                </li>
                <li>Increase the efficiency and operation of the Site</li>
                <li>
                  Monitor and analyze usage and trends to improve your
                  experience with the Site
                </li>
                <li>Notify you of updates to the Site</li>
                <li>
                  Offer new products, services, and/or recommendations to you
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                4. Disclosure of Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may share or disclose your information in the following
                situations:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
                <li>
                  <strong>By Law or to Protect Rights:</strong> If we believe
                  the release of information about you is necessary to comply
                  with the law or to protect the rights, property, and safety of
                  our Company
                </li>
                <li>
                  <strong>Third-Party Service Providers:</strong> We may share
                  your information with third parties who perform services for
                  us or on our behalf, including payment processing, data
                  analysis, email delivery, and customer service
                </li>
                <li>
                  <strong>Business Transfers:</strong> We may share or transfer
                  your information in connection with a merger, sale of company
                  assets, bankruptcy, or other business transaction
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                5. Security of Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use administrative, technical, and physical security measures
                to help protect your personal information. However, no method of
                transmission over the Internet or method of electronic storage
                is 100% secure. While we strive to use commercially acceptable
                means to protect your personal information, we cannot guarantee
                its absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                6. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions or comments about this Privacy Policy,
                please contact us at:
              </p>
              <div className="mt-4 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                <p className="text-muted-foreground">
                  <strong>Wayrus Business Solutions Ltd</strong>
                  <br />
                  Email: info@wayrus.co.ke
                  <br />
                  Phone: +254108316608
                  <br />
                  Location: Nairobi, Kenya
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
