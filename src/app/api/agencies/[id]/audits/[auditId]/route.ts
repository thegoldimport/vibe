// ============================================================
// GET /api/agencies/[id]/audits/[auditId]
// Retrieve a completed audit result
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase-server';
import { getAudit } from '@/lib/audit-store';
import { getHtmlReport } from '@/lib/audit-engine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; auditId: string }> }
) {
  try {
    const { id: agencyId, auditId } = await params;
    const supabase = await createRouteHandlerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify agency ownership
    const { data: agency } = await supabase
      .from('agencies')
      .select('id')
      .eq('id', agencyId)
      .eq('owner_id', user.id)
      .single();

    if (!agency) {
      return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
    }

    // Retrieve the stored audit
    const audit = getAudit(auditId);

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Verify the audit belongs to this agency
    if (audit.agencyId && audit.agencyId !== agencyId) {
      return NextResponse.json(
        { error: 'Audit not found for this agency' },
        { status: 404 }
      );
    }

    // Check if HTML report is requested
    const format = request.nextUrl.searchParams.get('format');

    if (format === 'html') {
      const html = getHtmlReport(audit);
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="audit-${auditId}.html"`,
        },
      });
    }

    // Return JSON result
    return NextResponse.json({
      id: audit.id,
      website_url: audit.websiteUrl,
      overall_score: audit.overallScore,
      summary: audit.summary,
      categories: audit.categories,
      quick_wins: audit.quickWins,
      recommendations: audit.recommendations,
      scored_categories: audit.scoredCategories,
      estimated_roi: audit.estimatedRoi,
      seo_analysis: audit.seoAnalysis,
      content_analysis: audit.contentAnalysis,
      performance_analysis: audit.performanceAnalysis,
      crawl_details: {
        word_count: audit.crawlResult.wordCount,
        load_time_ms: audit.crawlResult.loadTime,
        has_contact_info: audit.crawlResult.hasContactInfo,
        has_lead_form: audit.crawlResult.hasLeadCaptureForm,
        social_links: audit.crawlResult.socialLinks.length,
        images_with_alt: `${audit.crawlResult.imgAltCount.withAlt}/${audit.crawlResult.imgAltCount.total}`,
      },
      completed_at: audit.completedAt,
    });
  } catch (error: any) {
    console.error('Error retrieving audit:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve audit' },
      { status: 500 }
    );
  }
}
