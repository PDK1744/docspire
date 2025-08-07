"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { SearchCommand } from "@/components/search-command";

export function DashboardHeader() {
  const [companyName, setCompanyName] = useState("");
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
          .select(`
            companies (
              name
            ),
            role
          `)
          .eq("user_id", userData.user.id)
          .single();

        if (companyData?.companies) {
          setCompanyName(companyData.companies.name);
          setIsAdmin(companyData.role === 'admin');
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
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div className="h-5 w-40 animate-pulse bg-gray-200 rounded"></div>
        <div className="ml-auto h-8 w-8 animate-pulse bg-gray-200 rounded-full"></div>
      </header>
    );
  }

  // Get the first letter of the company name for the avatar
  const firstLetter = companyName ? companyName[0].toUpperCase() : "?";
  
  // Generate a consistent color based on the company name
  const colors = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", 
    "bg-pink-500", "bg-indigo-500", "bg-rose-500"
  ];
  const colorIndex = [...companyName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex items-center gap-x-3">
        <h1 className="font-semibold text-xl tracking-tight">
          <span>{companyName}</span>
        </h1>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <SearchCommand />
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className={`${avatarColor} h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-gray-200 transition-all`}>
              <span className="text-white font-medium">{firstLetter}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {isAdmin && (
              <>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Company Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600" 
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
                router.refresh();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
