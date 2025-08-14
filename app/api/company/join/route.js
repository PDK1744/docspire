import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();
    const trimmedCode = code.trim().toUpperCase();
    

    const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("id")
        .eq("join_code", trimmedCode)
        .single();
    

    if (companyError) {
        return NextResponse.json({ error: "Invalid join code" }, { status: 401 });
    }
    if (!company) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const { error: insertError } = await supabase
        .from("company_members")
        .insert({
            user_id: user.id,
            company_id: company.id,
            role: "member"
        });
    if (insertError) {
        console.log("Insert Error: " + insertError?.message);
        return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}