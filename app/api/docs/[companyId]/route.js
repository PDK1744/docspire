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

export async function DELETE(request) {
    const supbase = await createClient();
    const { data: { user }, error: userError } = await supbase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (userError) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }

    const { data: membership, error: membershipError } = await supbase
        .from('company_members')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (!membership) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (membershipError) {
        return NextResponse.json({ error: 'Failed to fetch membership' }, { status: 500 });
    }
    if (membership.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error: deleteError } = await supbase
        .from('documents')
        .delete()
        .eq('id', request.id);

    if (deleteError) {
        return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });
}