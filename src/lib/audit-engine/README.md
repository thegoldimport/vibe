# VibeAgencies - AI Website Audit Engine

The core lead generation and conversion tool for VibeAgencies.

## Architecture

```
src/lib/audit-engine/
├── types.ts            # Type definitions for all audit data structures
├── crawler.ts          # Playwright-based website crawling
├── analyzer.ts         # LLM + heuristic analysis engine  
├── report-generator.ts # HTML and PDF report generation
├── index.ts            # Main entry point, exports public API
├── cli.ts              # CLI tool for running audits from command line
```

## API Endpoints

### POST /api/agencies/:id/audits
Trigger a website audit for a prospect.

**Request Body:**
```json
{
  "client_id": "uuid (optional)",
  "website_url": "https://example.com",
  "audit_type": "WEBSITE",
  "generate_report": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "website_url": "https://example.com",
  "overall_score": 67,
  "summary": "...",
  "categories": [...],
  "quick_wins": [...],
  "recommendations": [...],
  "report_html": "<!-- full HTML report -->",
  "completed_at": "2026-06-25T..."
}
```

### GET /api/agencies/:id/audits/:auditId
Retrieve a completed audit. Use `?format=html` to get the HTML report.

## How It Works

1. **Crawl**: Playwright opens the URL in headless Chromium, extracts:
   - Page title, meta description, headings, word count
   - Load time, mobile viewport, favicon
   - Contact info (phones, emails, addresses)
   - Lead capture forms
   - Social media links
   - Image alt text coverage
   - Open Graph tags, canonical URL
   - Sitemap/robots.txt existence

2. **Analyze**: Heuristic engine (always available) scores:
   - SEO & Metadata (30% weight)
   - Performance & Mobile (25% weight)
   - Content & Conversion (25% weight)
   - Technical Foundation (20% weight)
   
   If `GEMINI_API_KEY` is set, Gemini 1.5 Flash enhances the analysis.

3. **Report**: Generates a polished, branded HTML report with:
   - Overall score circle
   - Category score bars
   - Severity-colored findings
   - Top 3 quick wins
   - Estimated ROI opportunity
   - Action plan recommendations
   - Site details summary

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No | Google Gemini API key for enhanced LLM analysis |

Without the API key, the engine falls back to heuristic analysis (no external API calls needed).

## Usage

```typescript
import { runWebsiteAudit, getHtmlReport } from '@/lib/audit-engine';

// Run a complete audit
const result = await runWebsiteAudit({
  websiteUrl: 'https://example.com',
  agencyId: 'agency-uuid',
});

// Get the HTML report
const htmlReport = getHtmlReport(result);

// Get a branded report
const brandedReport = getBrandedHtmlReport(result, {
  name: 'My Agency',
  primaryColor: '#ff6600',
});
```