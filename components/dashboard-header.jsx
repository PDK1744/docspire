"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { SearchCommand } from "@/components/search-command";
import Account from "./subscription-plans/account/account";

export function DashboardHeader() {
  const [companyName, setCompanyName] = useState("");
  const [company_id, setCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadCompanyInfo() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) return;

        const { data: companyData } = await supabase
          .from("company_members")
          .select(
            `
            companies (
              name
            ),
            company_id,
            role
          `
          )
          .eq("user_id", userData.user.id)
          .single();

        if (companyData?.companies) {
          setCompanyName(companyData.companies.name);
          setIsAdmin(companyData.role === "admin");
          setCompanyId(companyData.company_id);
        }
      } catch (error) {
        console.error("Error loading company info:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCompanyInfo();
  }, [supabase]);

  if (loading) {
    return (
      <header className="navbar bg-base-100/95 backdrop-blur-sm border-b border-base-200 shadow-sm sticky top-0 z-50">
        <div className="navbar-start">
          <div className="skeleton h-5 w-40"></div>
        </div>
        <div className="navbar-end">
          <div className="skeleton h-8 w-8 rounded-full"></div>
        </div>
      </header>
    );
  }

  // Get the first letter of the company name for the avatar
  const firstLetter = companyName ? companyName[0].toUpperCase() : "?";

  

  return (
    <header className="navbar bg-secondary shadow-sm sticky top-0 z-50">
      {/* Company name */}
      <div className="navbar-start">
        <h1 className="text-xl font-semibold tracking-tight text-secondary-content">
          {companyName}
        </h1>
      </div>

      {/* Search bar */}
      <div className="navbar-center hidden lg:flex flex-1 max-w-lg px-4">
        <SearchCommand companyId={company_id} />
      </div>

      {/* User menu */}
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-accent-content btn-circle mr-4">
            <div className="w-10 rounded-full flex items-center justify-center">
              
                {firstLetter}
             
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {isAdmin && (
              <>
                <li>
                  <button
                    className="flex items-center gap-2 hover:bg-base-300"
                    onClick={() => router.push(`/dashboard/settings/${company_id}`)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Company Settings</span>
                  </button>
                </li>
                <li>
                  <Account />
                </li>
              </>
            )}
            <li>
              <button
                className="flex items-center gap-2 text-error hover:bg-error/50"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                  router.refresh();
                }}
              >
                <LogOut className="h-4 w-4" color="red"/>
                <span className="text-red-600">Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
