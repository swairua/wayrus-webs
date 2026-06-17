import { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { AdminSidebar, AdminSidebarTrigger } from "./AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="min-h-screen flex flex-col">
          <HeaderWithTrigger />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function HeaderWithTrigger() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="container flex h-14 items-center justify-between px-4">
        <AdminSidebarTrigger />
      </div>
    </header>
  );
}
