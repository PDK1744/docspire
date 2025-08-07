import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";

export async function POST() {
  const supabase = await createClient();

  // Sign out the user (clears auth cookies)
  supabase.auth.signOut();

  // Redirect to home page
  return redirect("/");
  //   return NextResponse.redirect(new URL("/sign-in", request.url));
}