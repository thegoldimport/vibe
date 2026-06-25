import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase-server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify agency ownership
    const { data: agency } = await supabase
      .from('agencies')
      .select('id')
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .single()

    if (!agency) {
      return NextResponse.json({ error: 'Agency not found' }, { status: 404 })
    }

    const body = await request.json()
    const { client_id, audit_type, website_url } = body

    if (!client_id || !audit_type) {
      return NextResponse.json({ error: 'Client ID and audit type are required' }, { status: 400 })
    }

    // Trigger the audit (will be processed by Inngest/background job)
    // For now, we create the audit record with a placeholder
    const { data: audit, error } = await supabase
      .from('audits')
      .insert({
        id: uuidv4(),
        agency_id: params.id,
        client_id,
        audit_type,
        data: { status: 'pending', website_url, requested_at: new Date().toISOString() },
        report_url: null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ audit }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}