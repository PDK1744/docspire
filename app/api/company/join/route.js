import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();

    const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("id")
        .eq("join_code", code)
        .single();

    if (companyError || !company) {
        return NextResponse.json({ error: "Invalid join code" }, { status: 401 });
    }

    const { error: insertError } = await supabase
        .from("company_members")
        .insert({
            user_id: user.id,
            company_id: company.id,
            role: "member"
        });
    if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}