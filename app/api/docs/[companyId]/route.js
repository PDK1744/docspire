import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request, { params }) {
    const supabase = await createClient();
    const { companyId } = await params
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data: documents, error: documentsError } = await supabase
        .from("documents")
        .select(`
            id,
            title,
            created_at,
            updated_at,
            last_updated_by,
            document_collections (name)
            `)
        .eq("company_id", companyId);

    if (documentsError) {
        console.log(documentsError)
        return NextResponse.json({ error: documentsError.message }, { status: 500 });
    }
    if (!documents || documents.length === 0) {
        return NextResponse.json(documents, { status: 200 });
    }
    if (documents) {
        return NextResponse.json(documents, { status: 200 });
    }
}

