import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-primary">404</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Oops! Page not found
          </p>
          <a
            href="/"
            className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground font-semibold"
          >
            Return to Home
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
