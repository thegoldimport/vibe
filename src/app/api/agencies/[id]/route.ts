import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase-server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: agency, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .single()

    if (error || !agency) {
      return NextResponse.json({ error: 'Agency not found' }, { status: 404 })
    }

    return NextResponse.json({ agency })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, branding, website_config, status } = body

    const updateData: Record<string, any> = {}
    if (name) updateData.name = name
    if (branding) updateData.branding = branding
    if (website_config) updateData.website_config = website_config
    if (status) updateData.status = status

    const { data: agency, error } = await supabase
      .from('agencies')
      .update(updateData)
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ agency })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}