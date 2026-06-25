// ============================================================
// POST /api/agencies/[id]/audits
// Trigger a new website audit for a prospect client
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runWebsiteAudit, getHtmlReport } from '@/lib/audit-engine';
import { saveAudit } from '@/lib/audit-store';

const requestSchema = z.object({
  client_id: z.string().uuid().optional(),
  website_url: z.string().url({ message: 'Invalid website URL provided' }),
  audit_type: z.enum(['WEBSITE', 'SEO', 'AI_VISIBILITY', 'GOOGLE_MAPS']).default('WEBSITE'),
  generate_report: z.boolean().default(true),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validation.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const { website_url, client_id, audit_type, generate_report } = validation.data;
    const agencyId = params.id;

    // Run the audit
    const auditResult = await runWebsiteAudit({
      websiteUrl: website_url,
      agencyId,
      clientId: client_id,
    });

    // Generate HTML report
    let reportHtml: string | null = null;
    if (generate_report) {
      reportHtml = getHtmlReport(auditResult);
    }

    // Store the audit result
    saveAudit(auditResult.id, auditResult);

    // Return the result
    return NextResponse.json(
      {
        id: auditResult.id,
        website_url: auditResult.websiteUrl,
        overall_score: auditResult.overallScore,
        summary: auditResult.summary,
        categories: auditResult.categories.map((c) => ({
          name: c.name,
          score: c.score,
          weight: c.weight,
          findings_count: c.findings.length,
          critical_count: c.findings.filter((f) => f.severity === 'critical').length,
          high_count: c.findings.filter((f) => f.severity === 'high').length,
        })),
        quick_wins: auditResult.quickWins,
        recommendations: auditResult.recommendations,
        estimated_roi: auditResult.estimatedRoi,
        report_html: reportHtml,
        completed_at: auditResult.completedAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Audit error:', error);
    return NextResponse.json(
      {
        error: 'Audit failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred during the audit',
      },
      { status: 500 }
    );
  }
}