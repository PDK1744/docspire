import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    // const { companyId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 401 });
    }
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { companyName } = await request.json();
    console.log("Updating company name:", companyName);
    
    const { error } = await supabase
        .from("companies")
        .update({ name: companyName })
        .eq("owner_id", user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
        return NextResponse.json({ success: true, name: companyName }, { status: 200 });
    }
}