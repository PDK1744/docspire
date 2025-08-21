import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { companyId } = await params;
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ data: [], error: null }, { status: 200 });
  }

  const supabase = await createClient();
  

  // Call the RPC
  const { data, error } = await supabase.rpc('search_documents', {
    company_filter: companyId,
    search_query: query
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}
