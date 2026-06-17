import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAdmin } from "@/hooks/use-admin";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolios", label: "Portfolios" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAdmin();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl dark:bg-background/80 shadow-sm border-transparent"
          : "bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-background/70",
      )}
    >
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold shrink-0"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0cbe6a5c8ad84d85bde168b920965709%2Ff91e5a0c45e34607957003d5859709e2?format=webp&width=128"
            alt="Wayrus logo"
            className="h-6 sm:h-8 w-auto"
          />
          <span className="text-primary hidden sm:inline text-sm sm:text-base">
            Wayrus
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary relative",
                  isActive || pathname === item.href
                    ? "text-primary"
                    : "text-foreground/70",
                )
              }
            >
              {({ isActive }) => (
                <span className="relative">
                  {item.label}
                  {(isActive || pathname === item.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <Link
              to="/contact"
              className="hidden sm:inline-block rounded-md bg-primary px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow hover:opacity-95"
            >
              Get a Quote
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="md:hidden inline-flex items-center justify-center rounded-md border px-2 py-2 h-10 w-10"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full sm:w-80"
            >
              <div className="flex flex-col gap-6 mt-8">
                <nav className="flex flex-col gap-4">
                  {nav.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            "text-base font-medium transition-colors hover:text-primary",
                            isActive || pathname === item.href
                              ? "text-primary"
                              : "text-foreground/70",
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </nav>
                <div className="border-t pt-4 flex flex-col gap-3">
                  {!isAuthenticated && (
                    <SheetClose asChild>
                      <Link
                        to="/contact"
                        className="w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground shadow hover:opacity-95"
                      >
                        Get a Quote
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
