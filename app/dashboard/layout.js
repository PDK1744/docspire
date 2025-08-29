"use client";
import { ReactQueryProvider } from "@/components/providers/providers";
import {
  BookOpen,
  Files,
  Settings,
  Users,
  Blocks,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard-header";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    async function fetchCompanyId() {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setLoading(false);
        return;
      }

      const { data: membership, error: membershipError } = await supabase
        .from("company_members")
        .select("company_id")
        .eq("user_id", user.id)
        .single();

      if (membershipError || !membership) {
        setLoading(false);
        return;
      }

      setCompanyId(membership.company_id);
      setLoading(false);
    }

    fetchCompanyId();
  }, []);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  if (loading) {
    return <div className="skeleton h-6 w-40" />;
  }

  const navigation = [
    { name: "Collections", href: "/dashboard", icon: Blocks },
    { name: "Documents", href: `/dashboard/docs/${companyId}`, icon: Files },
    { name: "Team", href: `/dashboard/team/${companyId}`, icon: Users },
    {
      name: "Settings",
      href: `/dashboard/settings/${companyId}`,
      icon: Settings,
    },
  ];

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200/60 bg-white/95 backdrop-blur-sm px-6 pb-4 shadow-sm">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center",
          sidebarCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2",
            sidebarCollapsed && "justify-center"
          )}
        >
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-semibold text-slate-800">
              DocSpire
            </span>
          )}
        </Link>
        {/* Desktop collapse button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100/70 transition-colors"
        >
          <Menu className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                          : "text-slate-600 hover:text-blue-700 hover:bg-slate-50/70",
                        "group flex gap-x-3 rounded-l-lg p-3 text-sm leading-6 font-medium transition-all duration-200",
                        sidebarCollapsed ? "justify-center" : ""
                      )}
                      title={sidebarCollapsed ? item.name : undefined}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          isActive
                            ? "text-blue-600"
                            : "text-slate-400 group-hover:text-blue-600",
                          "h-5 w-5 shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {!sidebarCollapsed && item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <ReactQueryProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50">
        {/* Mobile sidebar overlay */}
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden",
            sidebarOpen ? "block" : "hidden"
          )}
        >
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
          <div className="sidebar fixed inset-y-0 left-0 z-50 w-64 flex flex-col">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-600/20 backdrop-blur focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>

        {/* Desktop sidebar */}
        <div
          className={cn(
            "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300",
            sidebarCollapsed ? "lg:w-16" : "lg:w-64"
          )}
        >
          <SidebarContent />
        </div>

        {/* Main content */}
        <div
          className={cn(
            "transition-all duration-300",
            "lg:pl-64",
            sidebarCollapsed && "lg:pl-16"
          )}
        >
          {/* Mobile header with menu button */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200/60 bg-white/95 backdrop-blur-sm shadow-sm">
              <button
                type="button"
                className="mobile-menu-button p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/70 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-lg font-semibold text-slate-800">
                  DocSpire
                </span>
              </Link>
              <div className="w-10" />
            </div>
          </div>

          <DashboardHeader />
          <main className="py-6 lg:py-8">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </ReactQueryProvider>
  );
}
