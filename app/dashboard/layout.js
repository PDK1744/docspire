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
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
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
        .select("company_id, role")
        .eq("user_id", user.id)
        .single();

      if (membershipError || !membership) {
        setLoading(false);
        return;
      }

      setCompanyId(membership.company_id);
      setRole(membership.role);
      setLoading(false);
    }

    fetchCompanyId();
  }, []);

  if (loading) {
    return <div className="skeleton h-6 w-40" />;
  }

  const navigation = [
    { name: "Collections", href: "/dashboard", icon: Blocks },
    { name: "Documents", href: `/dashboard/docs/${companyId}`, icon: Files },
    ...(role === "admin"
      ? [{ name: "Team", href: `/dashboard/team/${companyId}`, icon: Users }]
      : []),
    {
      name: "Settings",
      href: `/dashboard/settings/${companyId}`,
      icon: Settings,
    },
  ];

  return (
    <ReactQueryProvider>
      <div className="drawer lg:drawer-open">
        {/* Hidden checkbox that controls drawer state */}
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        
        {/* Main content area */}
        <div className="drawer-content flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-stone-50">
          {/* Mobile navbar */}
          <div className="navbar bg-base-100/95 backdrop-blur-sm shadow-sm lg:hidden">
            <div className="navbar-start">
              <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
                <Menu className="h-6 w-6" />
              </label>
            </div>
            <div className="navbar-center">
              <Link href="/dashboard" className="btn btn-ghost normal-case text-xl">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-lg font-semibold text-slate-800">
                  DocSpire
                </span>
              </Link>
            </div>
            <div className="navbar-end">
              <div className="w-10" />
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block">
            <DashboardHeader />
          </div>

          {/* Main content */}
          <main className="flex-1 py-6 lg:py-8 bg-base-300">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
        
        {/* Sidebar */}
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <aside className={cn(
            "bg-base-100/95 backdrop-blur-sm shadow-xl border-r border-base-200 transition-all duration-300",
            sidebarCollapsed ? "w-16" : "w-64",
            "min-h-full flex flex-col"
          )}>
            {/* Sidebar header */}
            <div className={cn(
              "flex h-16 shrink-0 items-center px-4",
              sidebarCollapsed ? "justify-center" : "justify-between"
            )}>
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-2",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <div className="p-1.5 bg-primary rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary-content" />
                </div>
                {!sidebarCollapsed && (
                  <span className="text-lg font-semibold text-primary">
                    DocSpire
                  </span>
                )}
              </Link>
              {/* Desktop collapse button */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex btn btn-ghost btn-sm"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>

            {/* Navigation menu */}
            <div className="flex-1 px-2">
              <ul className="menu menu-md gap-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? "active bg-primary/10 text-primary border-r-2 border-primary"
                            : "text-base-content/70 hover:text-primary hover:bg-base-200/50",
                          "group gap-3 font-medium transition-all duration-200",
                          sidebarCollapsed ? "justify-center tooltip tooltip-right" : ""
                        )}
                        data-tip={sidebarCollapsed ? item.name : undefined}
                      >
                        <item.icon
                          className={cn(
                            isActive
                              ? "text-primary"
                              : "text-base-content/50 group-hover:text-primary",
                            "h-5 w-5 shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {!sidebarCollapsed && (
                          <span className="truncate">{item.name}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </ReactQueryProvider>
  );
}