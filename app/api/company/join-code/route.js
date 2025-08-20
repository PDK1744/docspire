import { createClient } from "@/utils/supabase/server";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { join } from "path";

export async function POST() {
    const supabase = await createClient();
    const { data: { user}, error: userError} = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: membership, error: membershipError } = await supabase
        .from("company_members")
        .select("company_id, role")
        .eq("user_id", user.id)
        .single();
    if (membershipError || membership?.role !== "admin") {
        return NextResponse.json({ error: "Not authorized  " }, { status: 403 });
    }
    
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();

    const { data, error: updateError } = await supabase
        .from("companies")
        .update({ join_code: code, join_code_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }) // 30 days. TODO: Shorten this for production. Also make it configurable.
        .eq("id", membership.company_id)
        .select()
        .single();
    
    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ joinCode: code, joinCodeExpiresAt: data.join_code_expires_at }, { status: 200 });
}