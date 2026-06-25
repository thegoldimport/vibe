// ============================================================
// Report Generator - Creates branded HTML/PDF audit reports
// ============================================================

import { AuditResult, AuditCategory, QuickWin } from './types';

function severityColor(severity: string): string {
  switch (severity) {
    case 'critical': return '#ef4444';
    case 'high': return '#f97316';
    case 'medium': return '#eab308';
    case 'low': return '#22c55e';
    case 'info': return '#3b82f6';
    default: return '#6b7280';
  }
}

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function scoreEmoji(score: number): string {
  if (score >= 80) return '🔥';
  if (score >= 60) return '👍';
  if (score >= 40) return '⚠️';
  return '🚨';
}

export function generateHtmlReport(audit: AuditResult): string {
  const {
    overallScore,
    websiteUrl,
    summary,
    categories,
    quickWins,
    recommendations,
    estimatedRoi,
    scoredCategories,
    crawlResult,
  } = audit;

  const categoryCards = categories
    .map(
      (cat) => `
    <div class="category-card">
      <div class="category-header">
        <h3>${cat.name}</h3>
        <div class="category-score ${cat.score >= 60 ? 'good' : cat.score >= 40 ? 'medium' : 'poor'}">
          ${cat.score}/100
          <div class="score-bar">
            <div class="score-fill" style="width: ${cat.score}%"></div>
          </div>
        </div>
      </div>
      <div class="findings">
        ${cat.findings
          .map(
            (f) => `
          <div class="finding finding-${f.severity}">
            <div class="finding-severity" style="background: ${severityColor(f.severity)}">
              ${f.severity.toUpperCase()}
            </div>
            <div class="finding-body">
              <strong>${f.title}</strong>
              <p>${f.description}</p>
              <div class="finding-recommendation">💡 ${f.recommendation}</div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `
    )
    .join('');

  const quickWinCards = quickWins
    .map(
      (qw) => `
    <div class="quick-win-card">
      <div class="qw-impact ${qw.impact === 'high' ? 'high' : qw.impact === 'medium' ? 'medium' : 'low'}">
        ${qw.impact.toUpperCase()} IMPACT
      </div>
      <div class="qw-effort ${qw.effort === 'low' ? 'easy' : qw.effort === 'medium' ? 'moderate' : 'hard'}">
        ${qw.effort.toUpperCase()} EFFORT
      </div>
      <h4>${qw.title}</h4>
      <p>${qw.description}</p>
    </div>
  `
    )
    .join('');

  const roiBreakdown = estimatedRoi.breakdown
    .map(
      (item) => `
    <div class="roi-item">
      <strong>${item.category}</strong>
      <span class="roi-value">${item.estimatedGain}</span>
      <p>${item.description}</p>
    </div>
  `
    )
    .join('');

  // Category scores chart bars
  const scoreBars = scoredCategories
    .map(
      (sc) => `
    <div class="score-row">
      <div class="score-label">${sc.name}</div>
      <div class="score-bar-container">
        <div class="score-bar-fill" style="width: ${sc.score}%; background: ${scoreColor(sc.score)}"></div>
      </div>
      <div class="score-value">${sc.score}</div>
    </div>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Website Audit Report — ${websiteUrl}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #0f0f1a;
      color: #e2e8f0;
      line-height: 1.6;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    /* Header */
    .header {
      text-align: center;
      padding: 60px 0 40px;
      border-bottom: 1px solid #1e293b;
      margin-bottom: 40px;
    }

    .header .brand {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #8b5cf6;
      margin-bottom: 16px;
    }

    .header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header .url {
      font-size: 16px;
      color: #94a3b8;
    }

    .header .date {
      font-size: 13px;
      color: #64748b;
      margin-top: 8px;
    }

    /* Overall Score */
    .overall-score {
      text-align: center;
      padding: 40px 0;
      margin-bottom: 40px;
    }

    .score-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      font-size: 48px;
      font-weight: 800;
      border: 6px solid ${scoreColor(overallScore)};
      color: ${scoreColor(overallScore)};
      margin-bottom: 16px;
    }

    .overall-score h2 {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .overall-score p {
      color: #94a3b8;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Score Breakdown */
    .score-breakdown {
      background: #1a1a2e;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 40px;
    }

    .score-breakdown h3 {
      font-size: 18px;
      margin-bottom: 20px;
      color: #e2e8f0;
    }

    .score-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      gap: 12px;
    }

    .score-label {
      flex: 0 0 180px;
      font-size: 14px;
      color: #94a3b8;
    }

    .score-bar-container {
      flex: 1;
      height: 10px;
      background: #1e293b;
      border-radius: 5px;
      overflow: hidden;
    }

    .score-bar-fill {
      height: 100%;
      border-radius: 5px;
      transition: width 0.5s ease;
    }

    .score-value {
      flex: 0 0 40px;
      text-align: right;
      font-weight: 600;
      font-size: 14px;
      color: #e2e8f0;
    }

    /* Sections */
    .section {
      margin-bottom: 40px;
    }

    .section-title {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 2px solid #8b5cf6;
      display: inline-block;
    }

    /* Category Cards */
    .category-card {
      background: #1a1a2e;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .category-header h3 {
      font-size: 18px;
    }

    .category-score {
      text-align: right;
      font-weight: 700;
      font-size: 16px;
    }

    .category-score.good { color: #22c55e; }
    .category-score.medium { color: #eab308; }
    .category-score.poor { color: #ef4444; }

    .score-bar {
      width: 100px;
      height: 6px;
      background: #1e293b;
      border-radius: 3px;
      margin-top: 4px;
      overflow: hidden;
    }

    .score-fill {
      height: 100%;
      background: currentColor;
      border-radius: 3px;
    }

    /* Findings */
    .finding {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: #0f0f1a;
      border-radius: 10px;
      margin-bottom: 8px;
    }

    .finding-severity {
      flex: 0 0 70px;
      text-align: center;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      color: white;
      height: fit-content;
    }

    .finding-body {
      flex: 1;
    }

    .finding-body strong {
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
    }

    .finding-body p {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 4px;
    }

    .finding-recommendation {
      font-size: 13px;
      color: #8b5cf6;
      padding: 6px 10px;
      background: rgba(139, 92, 246, 0.1);
      border-radius: 6px;
      margin-top: 6px;
    }

    /* Quick Wins */
    .quick-wins-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .quick-win-card {
      background: #1a1a2e;
      border-radius: 16px;
      padding: 20px;
      border: 1px solid rgba(139, 92, 246, 0.2);
    }

    .quick-win-card h4 {
      font-size: 15px;
      margin-bottom: 8px;
      color: #e2e8f0;
    }

    .quick-win-card p {
      font-size: 13px;
      color: #94a3b8;
    }

    .qw-impact, .qw-effort {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 8px;
      margin-right: 6px;
    }

    .qw-impact.high { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .qw-impact.medium { background: rgba(234, 179, 8, 0.2); color: #eab308; }
    .qw-impact.low { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
    .qw-effort.easy { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
    .qw-effort.moderate { background: rgba(234, 179, 8, 0.2); color: #eab308; }
    .qw-effort.hard { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

    /* ROI Section */
    .roi-box {
      background: linear-gradient(135deg, #1a1a2e, #1e1b4b);
      border-radius: 16px;
      padding: 24px;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .roi-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .roi-header .roi-value {
      font-size: 36px;
      font-weight: 800;
      background: linear-gradient(135deg, #22c55e, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .roi-header p {
      color: #94a3b8;
      font-size: 14px;
      margin-top: 8px;
    }

    .roi-item {
      padding: 12px 0;
      border-bottom: 1px solid #1e293b;
    }

    .roi-item:last-child { border-bottom: none; }

    .roi-item strong { display: block; font-size: 14px; }
    .roi-item .roi-value { font-size: 14px; color: #22c55e; }
    .roi-item p { font-size: 13px; color: #94a3b8; margin-top: 4px; }

    /* Recommendations List */
    .recommendations-list {
      list-style: none;
    }

    .recommendations-list li {
      padding: 12px 16px;
      background: #1a1a2e;
      border-radius: 10px;
      margin-bottom: 8px;
      border-left: 3px solid #8b5cf6;
      font-size: 14px;
    }

    /* Crawl Details */
    .crawl-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
    }

    .crawl-stat {
      background: #1a1a2e;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }

    .crawl-stat .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #8b5cf6;
    }

    .crawl-stat .stat-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 40px 0;
      border-top: 1px solid #1e293b;
      margin-top: 40px;
      color: #64748b;
      font-size: 13px;
    }

    .footer strong {
      color: #8b5cf6;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="brand">VibeAgencies · AI Website Audit</div>
      <h1>${scoreEmoji(overallScore)} Website Audit Report</h1>
      <div class="url">${websiteUrl}</div>
      <div class="date">Generated ${new Date(audit.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>

    <!-- Overall Score -->
    <div class="overall-score">
      <div class="score-circle">${overallScore}</div>
      <h2>${summary}</h2>
    </div>

    <!-- Score Breakdown -->
    <div class="score-breakdown">
      <h3>📊 Category Scores</h3>
      ${scoreBars}
    </div>

    <!-- Quick Wins -->
    <div class="section">
      <h2 class="section-title">⚡ Top Quick Wins</h2>
      <div class="quick-wins-grid">
        ${quickWinCards}
      </div>
    </div>

    <!-- Detailed Findings -->
    <div class="section">
      <h2 class="section-title">🔍 Detailed Analysis</h2>
      ${categoryCards}
    </div>

    <!-- ROI -->
    <div class="section">
      <h2 class="section-title">💰 ROI Opportunity</h2>
      <div class="roi-box">
        <div class="roi-header">
          <div class="roi-value">${estimatedRoi.estimatedMonthlyValue}</div>
          <p>${estimatedRoi.description}</p>
        </div>
        ${roiBreakdown}
      </div>
    </div>

    <!-- Recommendations -->
    <div class="section">
      <h2 class="section-title">📋 Action Plan</h2>
      <ul class="recommendations-list">
        ${recommendations.map((r) => `<li>${r}</li>`).join('')}
      </ul>
    </div>

    <!-- Site Details -->
    <div class="section">
      <h2 class="section-title">🔧 Site Details</h2>
      <div class="crawl-details">
        <div class="crawl-stat">
          <div class="stat-value">${crawlResult.wordCount.toLocaleString()}</div>
          <div class="stat-label">Words</div>
        </div>
        <div class="crawl-stat">
          <div class="stat-value">${(crawlResult.loadTime / 1000).toFixed(1)}s</div>
          <div class="stat-label">Load Time</div>
        </div>
        <div class="crawl-stat">
          <div class="stat-value">${crawlResult.headings.length}</div>
          <div class="stat-label">Headings</div>
        </div>
        <div class="crawl-stat">
          <div class="stat-value">${crawlResult.socialLinks.length}</div>
          <div class="stat-label">Social Links</div>
        </div>
        <div class="crawl-stat">
          <div class="stat-value">${crawlResult.imgAltCount.withAlt}/${crawlResult.imgAltCount.total}</div>
          <div class="stat-label">Images w/ Alt</div>
        </div>
        <div class="crawl-stat">
          <div class="stat-value">${crawlResult.leadForms.length}</div>
          <div class="stat-label">Lead Forms</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      Powered by <strong>VibeAgencies</strong> — Your AI-Powered Digital Agency
    </div>
  </div>
</body>
</html>`;
}

export async function generatePdfReport(audit: AuditResult): Promise<Buffer> {
  // Since PDFKit requires complex layout code, we use a simple approach:
  // Generate HTML and offer it as the primary report format.
  // For PDF, we can use a basic PDFKit-based report.

  const PDFDocument = (await import('pdfkit')).default;

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `Website Audit Report - ${audit.websiteUrl}`,
          Author: 'VibeAgencies',
          Subject: 'AI Website Audit',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Cover page
      doc.fontSize(10).fillColor('#8b5cf6').text('VIBEAGENCIES', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(28).fillColor('#ffffff').text('AI Website Audit', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('#94a3b8').text(audit.websiteUrl, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#64748b')
        .text(`Generated ${new Date(audit.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });

      doc.moveDown(3);

      // Overall Score
      doc.fontSize(48).fillColor('#8b5cf6').text(`${audit.overallScore}/100`, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor('#e2e8f0').text(audit.summary, { align: 'center' });

      doc.addPage();

      // Category Scores
      doc.fontSize(18).fillColor('#ffffff').text('Category Scores', { underline: true });
      doc.moveDown(0.5);

      for (const sc of audit.scoredCategories) {
        doc.fontSize(12).fillColor('#e2e8f0').text(`${sc.name}: ${sc.score}/100`);
        doc.moveDown(0.2);
      }

      doc.moveDown(1);

      // Quick Wins
      doc.fontSize(18).fillColor('#ffffff').text('Top Quick Wins', { underline: true });
      doc.moveDown(0.5);

      for (const qw of audit.quickWins) {
        doc.fontSize(12).fillColor('#e2e8f0').text(`${qw.title}`);
        doc.fontSize(10).fillColor('#94a3b8').text(`${qw.description}`);
        doc.moveDown(0.3);
      }

      doc.moveDown(1);

      // ROI
      doc.fontSize(18).fillColor('#ffffff').text('ROI Opportunity', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('#22c55e').text(`Estimated: ${audit.estimatedRoi.estimatedMonthlyValue}`);
      doc.fontSize(10).fillColor('#94a3b8').text(audit.estimatedRoi.description);

      doc.moveDown(1);

      // Recommendations
      doc.fontSize(18).fillColor('#ffffff').text('Action Plan', { underline: true });
      doc.moveDown(0.5);

      for (let i = 0; i < audit.recommendations.length; i++) {
        doc.fontSize(11).fillColor('#e2e8f0').text(`${i + 1}. ${audit.recommendations[i]}`);
        doc.moveDown(0.2);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export function generateBrandedHtmlReport(
  audit: AuditResult,
  branding?: { name?: string; logo?: string; primaryColor?: string }
): string {
  const html = generateHtmlReport(audit);

  // Apply branding if provided
  if (branding?.name || branding?.primaryColor) {
    const color = branding.primaryColor || '#8b5cf6';
    const brandName = branding.name || 'VibeAgencies';

    return html
      .replace(/VibeAgencies/g, brandName)
      .replace(/#8b5cf6/g, color);
  }

  return html;
}