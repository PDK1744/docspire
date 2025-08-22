"use client";
import { ReactQueryProvider } from "@/components/providers/providers";
import { BookOpen, Files, Settings, Users, Blocks, Menu, X } from "lucide-react";
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
      const { data: { user }, error } = await supabase.auth.getUser();

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
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.mobile-menu-button')) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  if (loading) {
    return <div className="skeleton h-6 w-40" />
  }

  const navigation = [
    { name: "Collections", href: "/dashboard", icon: Blocks },
    { name: "Documents", href: `/dashboard/docs/${companyId}`, icon: Files },
    { name: "Team", href: `/dashboard/team/${companyId}`, icon: Users },
    { name: "Settings", href: `/dashboard/settings/${companyId}`, icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 pb-4">
      <div className={cn(
        "flex h-16 shrink-0 items-center",
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        <Link href="/dashboard" className={cn(
          "flex items-center gap-2",
          sidebarCollapsed && "justify-center"
        )}>
          <BookOpen className="h-6 w-6 text-blue-600" />
          {!sidebarCollapsed && (
            <span className="text-lg font-semibold">DocSpire</span>
          )}
        </Link>
        {/* Desktop collapse button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive
                          ? "bg-gray-50 dark:bg-gray-800 text-blue-600"
                          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                        sidebarCollapsed ? "justify-center" : ""
                      )}
                      title={sidebarCollapsed ? item.name : undefined}
                      onClick={() => setSidebarOpen(false)} // Close mobile sidebar on navigation
                    >
                      <item.icon
                        className={cn(
                          isActive
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-blue-600",
                          "h-6 w-6 shrink-0"
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar overlay */}
        <div className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          <div className="sidebar fixed inset-y-0 left-0 z-50 w-64 flex flex-col">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300",
          sidebarCollapsed ? "lg:w-16" : "lg:w-64"
        )}>
          <SidebarContent />
        </div>

        {/* Main content */}
        <div className={cn(
          "transition-all duration-300",
          "lg:pl-64", // Default desktop padding
          sidebarCollapsed && "lg:pl-16" // Collapsed desktop padding
        )}>
          {/* Mobile header with menu button */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
              <button
                type="button"
                className="mobile-menu-button p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold">DocSpire</span>
              </Link>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>
          
          <DashboardHeader />
          <main className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </ReactQueryProvider>
  );
}