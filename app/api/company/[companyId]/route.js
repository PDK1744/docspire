import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request, { params}) {
    const { companyId } = await params;
    
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized'}), {status: 401})
    }
    if (userError) {
        return new Response(JSON.stringify({ error: 'Failed to fetch data'}), {status: 500})
    }
    
    
    const {data: membership, error: membershipError } = await supabase
    .from('company_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('company_id', companyId)
    .single()
    console.log(membership);

    if (membershipError || !membership) {
        return new Response(JSON.stringify({error: 'Forbidden'}), {status: 403})
    }

    const {data: company, error: companyError} = await supabase
    .from('companies')
    .select('join_code, name, join_code_expires_at')
    .eq('id', companyId)
    .single()

    if (companyError) {
        return new Response(JSON.stringify({ error: 'Failed to fetch company data' }), { status: 500 });
    }

    return new Response(JSON.stringify({ joinCode: company.join_code, companyName: company.name, joinCodeExpiresAt: company.join_code_expires_at }), {status: 200})
}