import * as React from "react";
import TeamList from "@/components/team/team-list";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TeamPage({ params }) {
  const { id: companyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: membership } = await supabase
    .from("company_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("company_id", companyId)
    .single();
    console.log(membership.role);

  if (!membership || membership.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="">
      <TeamList companyId={companyId} />
    </div>
  );
}
