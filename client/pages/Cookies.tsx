import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";

export default function Cookies() {
  return (
    <Layout>
      <SEO
        title="Cookie Policy"
        description="Information about how we use cookies on our website"
      />
      <section className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Cookie Policy
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                1. What Are Cookies?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small files that are stored on your browser or the
                hard drive of your computer or mobile device. They allow
                websites to recognize your device and store some information
                about your preferences or past actions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                2. How We Use Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies for various purposes, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>Essential Cookies:</strong> Necessary for the
                  operation of our website and to provide you with the services
                  you request
                </li>
                <li>
                  <strong>Performance Cookies:</strong> Help us understand how
                  visitors use our website so we can improve performance and
                  user experience
                </li>
                <li>
                  <strong>Functional Cookies:</strong> Allow us to remember your
                  preferences and provide enhanced functionality
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Used to track visitors
                  across websites to display relevant advertisements
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                3. Types of Cookies We Use
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    Session Cookies
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    These cookies are temporary and expire when you close your
                    browser. They help us maintain your session while you use
                    our website.
                  </p>
                </div>
                <div className="border-l-4 border-secondary pl-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    Persistent Cookies
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    These cookies remain on your device for a longer period.
                    They help us remember your preferences on future visits.
                  </p>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    Third-Party Cookies
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    These cookies are set by third-party services we use, such
                    as analytics providers and advertising partners.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                4. Managing Your Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their
                settings. You can typically:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>View what cookies are set on your device</li>
                <li>Delete cookies from your device</li>
                <li>Block all cookies or specific types of cookies</li>
                <li>Receive notifications when cookies are being set</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Please note that blocking essential cookies may affect the
                functionality of our website and the services we can provide.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                5. Changes to This Cookie Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. Your continued use of our website following
                the posting of revised changes means that you accept and agree
                to the changes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                6. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about our use of cookies, please contact
                us at:
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
