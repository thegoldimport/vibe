// ============================================================
// Audit Engine - Main Entry Point
// ============================================================

import { crawlWebsite } from './crawler';
import { generateAuditResult } from './analyzer';
import {
  generateHtmlReport,
  generatePdfReport,
  generateBrandedHtmlReport,
} from './report-generator';
import {
  AuditRequest,
  AuditResult,
  AuditType,
  CrawlResult,
} from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Run a complete website audit from a URL
 * 1. Crawl the website
 * 2. Analyze with LLM/heuristics
 * 3. Return structured audit result
 */
export async function runWebsiteAudit(
  request: AuditRequest
): Promise<AuditResult> {
  const crawl = await crawlWebsite(request.websiteUrl);
  const result = await generateAuditResult(crawl, {
    agencyId: request.agencyId,
    clientId: request.clientId,
  });
  return result;
}

/**
 * Generate an HTML report string from an audit result
 */
export function getHtmlReport(audit: AuditResult): string {
  return generateHtmlReport(audit);
}

/**
 * Generate a branded HTML report
 */
export function getBrandedHtmlReport(
  audit: AuditResult,
  branding?: { name?: string; logo?: string; primaryColor?: string }
): string {
  return generateBrandedHtmlReport(audit, branding);
}

/**
 * Generate a PDF report buffer from an audit result
 */
export async function getPdfReport(audit: AuditResult): Promise<Buffer> {
  return generatePdfReport(audit);
}

/**
 * Run a quick SEO audit (lighter version for bulk checks)
 */
export async function runQuickSeoAudit(url: string): Promise<{
  score: number;
  issues: number;
  summary: string;
}> {
  const crawl = await crawlWebsite(url);
  const result = await generateAuditResult({ websiteUrl: url });
  return {
    score: result.overallScore,
    issues:
      result.categories.reduce(
        (sum, c) =>
          sum +
          c.findings.filter(
            (f) => f.severity === 'critical' || f.severity === 'high'
          ).length,
        0
      ),
    summary: result.summary,
  };
}

// Re-export types
export type {
  AuditResult,
  AuditRequest,
  AuditType,
  CrawlResult,
  AuditCategory,
  AuditFinding,
  QuickWin,
  ROIOpportunity,
  ScoredCategory,
  SEOAnalysis,
  ContentAnalysis,
  PerformanceAnalysis,
} from './types';

// Re-export core functions
export { crawlWebsite } from './crawler';
export { generateAuditResult } from './analyzer';
export { generateHtmlReport, generatePdfReport } from './report-generator';