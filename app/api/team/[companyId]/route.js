import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req, { params }) {
    const { companyId } = await params;
    



    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json(({ error: 'Unauthorized' }), { status: 401 })
    }
    if (userError) {
        return NextResponse.json(({ error: 'Failed to fetch data' }), { status: 500 })
    }

    const { data: membership, error: membershipError } = await supabase
        .from('company_members')
        .select('role')
        .eq('user_id', user.id)
        .eq('company_id', companyId)
        .single()

    if (membershipError || !membership) {
        

        return NextResponse.json(({ error: 'Forbidden' }), { status: 403 })
    }
    if (membership.role !== 'admin') {
        return NextResponse.json(({ error: 'Forbidden: Not Admin of this company' }), { status: 403 })
    }

    
    
    const {data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name, email, created_at, updated_at, role, status')
    .eq('company_id', companyId)
    .order('display_name', { ascending: false })
    
    
    
    if (profilesError) {
        return NextResponse.json(({ error: 'Failed to fetch profiles' }), { status: 500 });
    }
    
    return NextResponse.json(profiles, { status: 200 });
}