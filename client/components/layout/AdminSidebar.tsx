import { useLocation, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { apiClient } from "@/lib/api-client";

const adminNav = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/portfolios", label: "Portfolios" },
  { href: "/admin/quotations", label: "Quotations" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/discovery-leads", label: "Discovery Leads" },
  { href: "/admin/opportunities", label: "Opportunities" },
  { href: "/admin/logs", label: "Logs" },
];

export function AdminSidebarTrigger() {
  const { state } = useSidebar();

  return (
    <div className="flex items-center gap-3">
      <SidebarTrigger className="hover:bg-slate-100 dark:hover:bg-slate-700" />
      <span className="text-sm font-semibold text-foreground">Admin Panel</span>
    </div>
  );
}

export function AdminSidebar() {
  const { pathname } = useLocation();

  async function logout() {
    try {
      await apiClient.post("/admin/logout", {});
    } catch {}
    // Clear token and redirect
    apiClient.setToken(null);
    window.location.href = "/admin/login";
  }

  return (
    <Sidebar className="border-r border-slate-200 dark:border-slate-700">
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 px-4 py-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F0cbe6a5c8ad84d85bde168b920965709%2Ff91e5a0c45e34607957003d5859709e2?format=webp&width=128"
                alt="Wayrus logo"
                className="h-6 w-auto"
              />
            </div>
            <div className="hidden group-data-[collapsible=icon]:hidden">
              <h2 className="text-sm font-bold text-foreground">Wayrus</h2>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="hidden group-data-[collapsible=icon]:hidden">
            <div className="inline-block px-2 py-1 rounded-md bg-primary/10 dark:bg-primary/20">
              <p className="text-xs font-medium text-primary">Admin</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-3">
        <SidebarMenu>
          {adminNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-slate-100 dark:bg-slate-700 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50",
                )}
              >
                <NavLink to={item.href}>{item.label}</NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <div className="border-t border-slate-200 dark:border-slate-700 p-3 mt-auto">
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </button>
      </div>
    </Sidebar>
  );
}
