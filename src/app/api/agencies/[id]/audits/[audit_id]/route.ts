import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase-server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; audit_id: string }> }
) {
  try {
    const { id, audit_id } = await params
    const supabase = await createRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify agency ownership
    const { data: agency } = await supabase
      .from('agencies')
      .select('id')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single()

    if (!agency) {
      return NextResponse.json({ error: 'Agency not found' }, { status: 404 })
    }

    const { data: audit, error } = await supabase
      .from('audits')
      .select('*')
      .eq('id', audit_id)
      .eq('agency_id', id)
      .single()

    if (error || !audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    return NextResponse.json({ audit })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
