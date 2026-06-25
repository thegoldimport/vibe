// ============================================================
// Audit Engine - Type Definitions
// ============================================================

export interface AuditRequest {
  websiteUrl: string;
  agencyId?: string;
  clientId?: string;
}

export interface AuditCategory {
  name: string;
  score: number; // 0-100
  weight: number; // contribution to overall score
  findings: AuditFinding[];
}

export interface AuditFinding {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  recommendation: string;
  category: string;
}

export interface QuickWin {
  title: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  description: string;
}

export interface CrawlResult {
  url: string;
  title: string | null;
  metaDescription: string | null;
  headings: { level: string; text: string }[];
  wordCount: number;
  loadTime: number; // ms
  hasContactInfo: boolean;
  contactInfo: {
    phones: string[];
    emails: string[];
    addresses: string[];
  };
  hasLeadCaptureForm: boolean;
  leadForms: { type: string; action: string }[];
  socialLinks: { platform: string; url: string }[];
  imgAltCount: { total: number; withAlt: number };
  statusCode: number;
  mobileViewport: boolean;
  hasFavicon: boolean;
  hasSitemap: boolean;
  hasRobotsTxt: boolean;
  openGraphTags: Record<string, string>;
  hreflangTags: string[];
  canonicalUrl: string | null;
  error?: string;
}

export interface ScoredCategory {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  weightedScore: number;
}

export interface AuditResult {
  id: string;
  websiteUrl: string;
  agencyId?: string;
  clientId?: string;
  overallScore: number;
  categories: AuditCategory[];
  quickWins: QuickWin[];
  summary: string;
  crawlResult: CrawlResult;
  scoredCategories: ScoredCategory[];
  recommendations: string[];
  estimatedRoi: ROIOpportunity;
  timestamp: string;
  seoAnalysis?: SEOAnalysis;
  contentAnalysis?: ContentAnalysis;
  performanceAnalysis?: PerformanceAnalysis;
  completedAt: string;
}

export interface SEOAnalysis {
  titleTagScore: number;
  metaDescriptionScore: number;
  headingStructureScore: number;
  imageAltScore: number;
  openGraphScore: number;
  canonicalScore: number;
  findings: AuditFinding[];
}

export interface ContentAnalysis {
  wordCount: number;
  hasContactInfo: boolean;
  hasPrivacyPolicy: boolean;
  hasTermsOfService: boolean;
  hasAboutPage: boolean;
  hasBlog: boolean;
  contentQualityScore: number;
  findings: AuditFinding[];
}

export interface PerformanceAnalysis {
  loadTimeMs: number;
  loadTimeScore: number;
  mobileOptimized: boolean;
  hasFavicon: boolean;
  hasSitemap: boolean;
  totalRequests?: number;
  pageSizeKb?: number;
  findings: AuditFinding[];
}

export interface ROIOpportunity {
  estimatedMonthlyValue: string;
  description: string;
  confidence: 'low' | 'medium' | 'high';
  breakdown: {
    category: string;
    estimatedGain: string;
    description: string;
  }[];
}

export type AuditType = 'WEBSITE' | 'SEO' | 'AI_VISIBILITY' | 'GOOGLE_MAPS';