import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase-server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('agency_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ clients })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const body = await request.json()
    const { business_name, contact_name, email, website } = body

    if (!business_name) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
    }

    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        agency_id: id,
        business_name,
        contact_name: contact_name || null,
        email: email || null,
        website: website || null,
        status: 'prospect',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ client }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
