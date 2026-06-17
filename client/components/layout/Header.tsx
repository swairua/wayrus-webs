import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-background/70 pointer-events-auto">
      <div className="container flex h-14 sm:h-16 items-center justify-between pointer-events-auto">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold shrink-0 cursor-pointer pointer-events-auto"
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
        <nav className="hidden md:flex items-center gap-6 pointer-events-auto">
          {nav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary cursor-pointer pointer-events-auto",
                  isActive || pathname === item.href
                    ? "text-primary"
                    : "text-foreground/70",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3 pointer-events-auto">
          {!isAuthenticated && (
            <Link
              to="/contact"
              className="hidden sm:inline-block rounded-md bg-primary px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow hover:opacity-95 cursor-pointer pointer-events-auto"
            >
              Get a Quote
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="md:hidden inline-flex items-center justify-center rounded-md border px-2 py-2 h-10 w-10 cursor-pointer pointer-events-auto"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full sm:w-80 pointer-events-auto"
            >
              <div className="flex flex-col gap-6 mt-8 pointer-events-auto">
                <nav className="flex flex-col gap-4 pointer-events-auto">
                  {nav.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            "text-base font-medium transition-colors hover:text-primary cursor-pointer pointer-events-auto",
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
                <div className="border-t pt-4 flex flex-col gap-3 pointer-events-auto">
                  {!isAuthenticated && (
                    <SheetClose asChild>
                      <Link
                        to="/contact"
                        className="w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground shadow hover:opacity-95 cursor-pointer pointer-events-auto"
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
