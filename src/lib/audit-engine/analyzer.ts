// ============================================================
// LLM Analyzer - Uses Gemini Flash to analyze crawl results
// ============================================================

import {
  CrawlResult,
  AuditResult,
  AuditCategory,
  AuditFinding,
  SEOAnalysis,
  ContentAnalysis,
  PerformanceAnalysis,
  QuickWin,
  ROIOpportunity,
  ScoredCategory,
} from './types';
import { v4 as uuidv4 } from 'uuid';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-1.5-flash';

interface LLMRequestBody {
  contents: {
    role: string;
    parts: { text: string }[];
  }[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

interface LLMResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    // Fallback: use heuristic analysis when no API key
    return '{"fallback": true}';
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const body: LLMRequestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.warn(`Gemini API returned ${response.status}, using fallback analysis`);
      return '{"fallback": true}';
    }

    const data: LLMResponse = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || '{"fallback": true}';
    return text;
  } catch (error) {
    console.warn('Gemini API call failed, using fallback:', error);
    return '{"fallback": true}';
  }
}

function extractJsonFromLLMResponse(text: string): any {
  // Try to extract JSON from markdown code blocks or raw JSON
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();

  // Find the first { and last }
  const start = jsonStr.indexOf('{');
  const end = jsonStr.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(jsonStr.slice(start, end + 1));
    } catch {}
  }

  // Try direct parse
  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

// Heuristic/fallback analysis when LLM is not available
function runHeuristicAnalysis(crawl: CrawlResult): {
  categories: AuditCategory[];
  quickWins: QuickWin[];
  recommendations: string[];
} {
  const findings: AuditFinding[] = [];
  const quickWins: QuickWin[] = [];
  const recommendations: string[] = [];

  // --- SEO Category ---
  const seoFindings: AuditFinding[] = [];

  // Title tag
  if (!crawl.title) {
    seoFindings.push({
      severity: 'critical',
      title: 'Missing Page Title',
      description: 'The page does not have a title tag, which is critical for SEO.',
      recommendation: 'Add a descriptive, keyword-rich title tag (50-60 characters).',
      category: 'SEO',
    });
  } else if (crawl.title.length < 30) {
    seoFindings.push({
      severity: 'medium',
      title: 'Short Page Title',
      description: `Title is only ${crawl.title.length} characters. Optimal is 50-60 chars.`,
      recommendation: 'Expand your title to 50-60 characters including primary keywords.',
      category: 'SEO',
    });
  } else if (crawl.title.length > 70) {
    seoFindings.push({
      severity: 'low',
      title: 'Long Page Title',
      description: `Title is ${crawl.title.length} characters. May be truncated in search results.`,
      recommendation: 'Shorten your title to under 60 characters for optimal display.',
      category: 'SEO',
    });
  } else {
    seoFindings.push({
      severity: 'info',
      title: 'Good Title Tag Length',
      description: `Title is ${crawl.title.length} characters — within the optimal range.`,
      recommendation: 'Consider adding your primary keyword near the beginning.',
      category: 'SEO',
    });
  }

  // Meta description
  if (!crawl.metaDescription) {
    seoFindings.push({
      severity: 'high',
      title: 'Missing Meta Description',
      description: 'No meta description found. This hurts click-through rates from search results.',
      recommendation: 'Write a compelling meta description (150-160 characters) with a clear value proposition and CTA.',
      category: 'SEO',
    });
  } else if (crawl.metaDescription.length < 120) {
    seoFindings.push({
      severity: 'medium',
      title: 'Short Meta Description',
      description: `Meta description is only ${crawl.metaDescription.length} characters.`,
      recommendation: 'Expand to 150-160 characters for optimal search result display.',
      category: 'SEO',
    });
  }

  // Heading structure
  const h1Count = crawl.headings.filter((h) => h.level === 'H1').length;
  if (h1Count === 0) {
    seoFindings.push({
      severity: 'high',
      title: 'Missing H1 Tag',
      description: 'No H1 heading found. H1 is crucial for SEO and accessibility.',
      recommendation: 'Add one H1 tag that clearly describes the page content and includes your primary keyword.',
      category: 'SEO',
    });
  } else if (h1Count > 1) {
    seoFindings.push({
      severity: 'medium',
      title: 'Multiple H1 Tags',
      description: `Found ${h1Count} H1 tags. Best practice is one H1 per page.`,
      recommendation: 'Consolidate to a single H1 tag and use H2/H3 for subsections.',
      category: 'SEO',
    });
  }

  const h2Count = crawl.headings.filter((h) => h.level === 'H2').length;
  if (h2Count === 0 && crawl.wordCount > 300) {
    seoFindings.push({
      severity: 'low',
      title: 'No H2 Subheadings',
      description: 'Content over 300 words but no H2 subheadings found.',
      recommendation: 'Add H2 subheadings to break up content and improve readability/SEO.',
      category: 'SEO',
    });
  }

  // Image alt text
  const altPct = crawl.imgAltCount.total > 0
    ? (crawl.imgAltCount.withAlt / crawl.imgAltCount.total) * 100
    : 100;
  if (crawl.imgAltCount.total > 0 && altPct < 50) {
    seoFindings.push({
      severity: 'high',
      title: 'Missing Image Alt Text',
      description: `Only ${crawl.imgAltCount.withAlt} of ${crawl.imgAltCount.total} images have alt text (${Math.round(altPct)}%).`,
      recommendation: 'Add descriptive alt text to all images for SEO and accessibility.',
      category: 'SEO',
    });
    quickWins.push({
      title: 'Add Alt Text to Images',
      impact: 'medium',
      effort: 'low',
      description: `Add descriptive alt text to ${crawl.imgAltCount.total - crawl.imgAltCount.withAlt} images for better SEO and accessibility.`,
    });
  } else if (crawl.imgAltCount.total > 0 && altPct < 100) {
    seoFindings.push({
      severity: 'low',
      title: 'Incomplete Image Alt Text',
      description: `${Math.round(altPct)}% of images have alt text.`,
      recommendation: 'Complete alt text for remaining images.',
      category: 'SEO',
    });
  }

  // OG tags
  if (Object.keys(crawl.openGraphTags).length === 0) {
    seoFindings.push({
      severity: 'medium',
      title: 'Missing Open Graph Tags',
      description: 'No Open Graph tags found. This hurts social media sharing appearance.',
      recommendation: 'Add Open Graph tags (og:title, og:description, og:image) for better social sharing.',
      category: 'SEO',
    });
  }

  // Canonical URL
  if (!crawl.canonicalUrl) {
    seoFindings.push({
      severity: 'low',
      title: 'Missing Canonical Tag',
      description: 'No canonical URL tag found.',
      recommendation: 'Add a canonical URL tag to prevent duplicate content issues.',
      category: 'SEO',
    });
  }

  // --- Performance Category ---
  const perfFindings: AuditFinding[] = [];

  if (crawl.loadTime > 3000) {
    perfFindings.push({
      severity: 'high',
      title: 'Slow Page Load Time',
      description: `Page loaded in ${(crawl.loadTime / 1000).toFixed(1)}s — above the 3s threshold.`,
      recommendation: 'Optimize images, enable caching, minimize JS/CSS, and consider a CDN.',
      category: 'Performance',
    });
    quickWins.push({
      title: 'Improve Page Load Speed',
      impact: 'high',
      effort: 'medium',
      description: `Current load time is ${(crawl.loadTime / 1000).toFixed(1)}s. Target under 2s for better conversion rates.`,
    });
  } else if (crawl.loadTime > 2000) {
    perfFindings.push({
      severity: 'medium',
      title: 'Moderate Page Load Time',
      description: `Page loaded in ${(crawl.loadTime / 1000).toFixed(1)}s.`,
      recommendation: 'Consider image optimization and code minification to improve speed.',
      category: 'Performance',
    });
  } else {
    perfFindings.push({
      severity: 'info',
      title: 'Good Page Load Time',
      description: `Page loaded in ${(crawl.loadTime / 1000).toFixed(1)}s — fast!`,
      recommendation: 'Continue monitoring and maintaining performance.',
      category: 'Performance',
    });
  }

  if (!crawl.mobileViewport) {
    perfFindings.push({
      severity: 'critical',
      title: 'Not Mobile-Optimized',
      description: 'Page is missing a mobile viewport meta tag.',
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> for mobile responsiveness.',
      category: 'Performance',
    });
    quickWins.push({
      title: 'Enable Mobile Responsiveness',
      impact: 'high',
      effort: 'low',
      description: 'Add viewport meta tag to make your site mobile-friendly and avoid Google mobile penalty.',
    });
  }

  if (!crawl.hasFavicon) {
    perfFindings.push({
      severity: 'low',
      title: 'Missing Favicon',
      description: 'No favicon found. This affects brand recognition in browser tabs.',
      recommendation: 'Add a favicon to your site.',
      category: 'Performance',
    });
  }

  // --- Content & Conversion Category ---
  const contentFindings: AuditFinding[] = [];

  if (crawl.wordCount < 300) {
    contentFindings.push({
      severity: 'medium',
      title: 'Thin Content',
      description: `Only ${crawl.wordCount} words found on the page. Google prefers at least 300 words per page.`,
      recommendation: 'Expand your content to at least 500-800 words with valuable information for visitors.',
      category: 'Content',
    });
  } else if (crawl.wordCount < 600) {
    contentFindings.push({
      severity: 'low',
      title: 'Moderate Content Length',
      description: `${crawl.wordCount} words found.`,
      recommendation: 'Consider expanding to 800+ words for better depth and SEO performance.',
      category: 'Content',
    });
  } else {
    contentFindings.push({
      severity: 'info',
      title: 'Good Content Length',
      description: `${crawl.wordCount} words — substantial content.`,
      recommendation: 'Continue maintaining high-quality, regular content updates.',
      category: 'Content',
    });
  }

  if (!crawl.hasContactInfo) {
    contentFindings.push({
      severity: 'critical',
      title: 'No Contact Information',
      description: 'No phone numbers, emails, or addresses found on the page.',
      recommendation: 'Add clear contact information (phone, email, address) to build trust and generate leads.',
      category: 'Content',
    });
    quickWins.push({
      title: 'Add Contact Information',
      impact: 'high',
      effort: 'low',
      description: 'Add phone number, email, and address to the website. Many visitors leave if they can\'t find contact info.',
    });
  }

  if (!crawl.hasLeadCaptureForm) {
    contentFindings.push({
      severity: 'high',
      title: 'No Lead Capture Forms',
      description: 'No email signup or contact forms found on the page.',
      recommendation: 'Add a contact form or email signup CTA to capture leads and build your audience.',
      category: 'Content',
    });
    quickWins.push({
      title: 'Add Lead Capture Form',
      impact: 'high',
      effort: 'low',
      description: 'Install a simple contact form or email signup to start capturing leads from your website traffic.',
    });
  }

  // Social media
  if (crawl.socialLinks.length === 0) {
    contentFindings.push({
      severity: 'low',
      title: 'No Social Media Links',
      description: 'No social media links found on the page.',
      recommendation: 'Add links to your social media profiles to build social proof and engagement.',
      category: 'Content',
    });
  }

  // --- Combine findings into categories ---
  const categories: AuditCategory[] = [
    {
      name: 'SEO & Metadata',
      score: 0, // Will be calculated
      weight: 0.30,
      findings: seoFindings,
    },
    {
      name: 'Performance & Mobile',
      score: 0,
      weight: 0.25,
      findings: perfFindings,
    },
    {
      name: 'Content & Conversion',
      score: 0,
      weight: 0.25,
      findings: contentFindings,
    },
  ];

  // Add general findings
  const generalFindings: AuditFinding[] = [];
  if (crawl.statusCode !== 200) {
    generalFindings.push({
      severity: 'critical',
      title: `Non-200 Status Code (${crawl.statusCode})`,
      description: `The page returned status code ${crawl.statusCode}. This can prevent indexing.`,
      recommendation: 'Ensure the page returns a 200 OK status for proper indexing.',
      category: 'General',
    });
  }

  if (crawl.hasRobotsTxt === false) {
    generalFindings.push({
      severity: 'medium',
      title: 'Missing robots.txt',
      description: 'No robots.txt file found on the site.',
      recommendation: 'Add a robots.txt file to control search engine crawling behavior.',
      category: 'General',
    });
  }

  if (crawl.hasSitemap === false) {
    generalFindings.push({
      severity: 'medium',
      title: 'Missing XML Sitemap',
      description: 'No sitemap.xml found on the site.',
      recommendation: 'Create and submit a sitemap.xml to Google Search Console for better indexing.',
      category: 'General',
    });
  }

  if (generalFindings.length > 0) {
    categories.push({
      name: 'Technical Foundation',
      score: 0,
      weight: 0.20,
      findings: generalFindings,
    });
  }

  // No missing rec yet
  if (recommendations.length === 0) {
    recommendations.push(
      'Fix all critical and high-severity issues first for maximum impact.',
      'Add lead capture forms to convert traffic into leads.',
      'Ensure mobile responsiveness to capture growing mobile traffic.'
    );
  }

  return { categories, quickWins, recommendations };
}

function calculateCategoryScore(findings: AuditFinding[]): number {
  if (findings.length === 0) return 100;

  let deductions = 0;
  for (const f of findings) {
    switch (f.severity) {
      case 'critical':
        deductions += 25;
        break;
      case 'high':
        deductions += 15;
        break;
      case 'medium':
        deductions += 8;
        break;
      case 'low':
        deductions += 3;
        break;
      case 'info':
        // No deduction for info findings
        break;
    }
  }
  return Math.max(0, Math.min(100, 100 - deductions));
}

function getTopQuickWins(allQuickWins: QuickWin[]): QuickWin[] {
  // Prioritize high-impact, low-effort wins
  const sorted = [...allQuickWins].sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    const effortOrder = { low: 0, medium: 1, high: 2 };
    const aScore = impactOrder[a.impact] + effortOrder[a.effort];
    const bScore = impactOrder[b.impact] + effortOrder[b.effort];
    return aScore - bScore;
  });
  return sorted.slice(0, 3);
}

function estimateROI(
  categories: AuditCategory[],
  quickWins: QuickWin[],
  crawl: CrawlResult
): ROIOpportunity {
  const avgScore =
    categories.reduce((sum, c) => sum + c.score, 0) / categories.length;

  let monthlyEstimate = '$0';
  let confidence: 'low' | 'medium' | 'high' = 'medium';
  const breakdown: ROIOpportunity['breakdown'] = [];

  if (avgScore < 50) {
    monthlyEstimate = '$2,000 - $5,000';
    confidence = 'high';
    breakdown.push({
      category: 'SEO Improvements',
      estimatedGain: '$1,000 - $3,000/mo',
      description: 'Fixing critical SEO issues can significantly increase organic traffic.',
    });
  } else if (avgScore < 70) {
    monthlyEstimate = '$1,000 - $3,000';
    confidence = 'medium';
    breakdown.push({
      category: 'Conversion Optimization',
      estimatedGain: '$500 - $2,000/mo',
      description: 'Adding lead capture forms and CTAs can convert more visitors.',
    });
  } else {
    monthlyEstimate = '$500 - $1,500';
    confidence = 'low';
    breakdown.push({
      category: 'Performance & UX',
      estimatedGain: '$500 - $1,000/mo',
      description: 'Speed improvements can boost conversion rates by 2-5%.',
    });
  }

  if (!crawl.hasLeadCaptureForm) {
    breakdown.push({
      category: 'Lead Capture Setup',
      estimatedGain: '$500 - $2,000/mo',
      description: 'Adding a contact form can capture 3-10 additional leads per month.',
    });
  }

  if (!crawl.mobileViewport) {
    breakdown.push({
      category: 'Mobile Optimization',
      estimatedGain: '$500 - $1,500/mo',
      description: 'Mobile optimization can capture the 60%+ of traffic coming from mobile devices.',
    });
  }

  return {
    estimatedMonthlyValue: monthlyEstimate,
    description: `Based on your current website score of ${Math.round(avgScore)}/100, addressing the issues found could generate significant additional revenue.`,
    confidence,
    breakdown,
  };
}

function generateSummary(categories: AuditCategory[], overallScore: number): string {
  const criticalCount = categories.reduce(
    (sum, c) => sum + c.findings.filter((f) => f.severity === 'critical').length,
    0
  );
  const highCount = categories.reduce(
    (sum, c) => sum + c.findings.filter((f) => f.severity === 'high').length,
    0
  );
  const mediumCount = categories.reduce(
    (sum, c) => sum + c.findings.filter((f) => f.severity === 'medium').length,
    0
  );

  if (overallScore >= 80) {
    return `Your website scores ${Math.round(overallScore)}/100 — good shape! ${mediumCount} medium-priority items to polish for even better performance.`;
  } else if (overallScore >= 60) {
    return `Your website scores ${Math.round(overallScore)}/100. ${highCount} high-priority and ${mediumCount} medium-priority items need attention to reach optimal performance.`;
  } else {
    return `Your website scores ${Math.round(overallScore)}/100. ${criticalCount} critical and ${highCount} high-priority issues must be addressed. Significant improvement opportunity.`;
  }
}

export async function analyzeWebsite(
  crawl: CrawlResult
): Promise<{
  categories: AuditCategory[];
  quickWins: QuickWin[];
  recommendations: string[];
}> {
  // Run heuristic analysis (always available)
  const heuristic = runHeuristicAnalysis(crawl);

  // If LLM is available, try to enhance the analysis
  if (GEMINI_API_KEY) {
    const prompt = `Analyze this website crawl data and provide a structured JSON assessment.

Website URL: ${crawl.url}
Page Title: ${crawl.title || 'N/A'}
Meta Description: ${crawl.metaDescription || 'N/A'}
Word Count: ${crawl.wordCount}
Load Time: ${crawl.loadTime}ms
Status Code: ${crawl.statusCode}

Headings:
${crawl.headings.map((h) => `${h.level}: ${h.text}`).join('\n')}

Contact Info: ${crawl.hasContactInfo ? `Phone: ${crawl.contactInfo.phones.join(', ')} | Email: ${crawl.contactInfo.emails.join(', ')}` : 'Not found'}
Lead Forms: ${crawl.hasLeadCaptureForm ? crawl.leadForms.map((f) => `${f.type} (${f.action})`).join(', ') : 'None found'}
Social Links: ${crawl.socialLinks.map((l) => `${l.platform}: ${l.url}`).join(', ') || 'None found'}
Images: ${crawl.imgAltCount.withAlt}/${crawl.imgAltCount.total} with alt text
Mobile Viewport: ${crawl.mobileViewport ? 'Yes' : 'No'}
Favicon: ${crawl.hasFavicon ? 'Yes' : 'No'}
Sitemap: ${crawl.hasSitemap ? 'Yes' : 'No'}
Robots.txt: ${crawl.hasRobotsTxt ? 'Yes' : 'No'}
OG Tags: ${JSON.stringify(crawl.openGraphTags)}
Canonical URL: ${crawl.canonicalUrl || 'N/A'}

Respond in JSON format:
{
  "categories": [
    {
      "name": "SEO & Metadata",
      "findings": [{"severity": "critical|high|medium|low|info", "title": "...", "description": "...", "recommendation": "..."}]
    },
    {
      "name": "Performance & Mobile",
      "findings": [...]
    },
    {
      "name": "Content & Conversion",
      "findings": [...]
    },
    {
      "name": "Technical Foundation",
      "findings": [...]
    }
  ],
  "quickWins": [
    {"title": "...", "impact": "high|medium|low", "effort": "low|medium|high", "description": "..."}
  ],
  "recommendations": ["...", "...", "..."]
}`;

    const llmResponse = await callGemini(prompt);
    const parsed = extractJsonFromLLMResponse(llmResponse);

    if (parsed && !parsed.fallback && parsed.categories) {
      return {
        categories: parsed.categories,
        quickWins: parsed.quickWins || heuristic.quickWins,
        recommendations: parsed.recommendations || heuristic.recommendations,
      };
    }
  }

  return heuristic;
}

export async function generateAuditResult(
  crawl: CrawlResult,
  options?: {
    agencyId?: string;
    clientId?: string;
  }
): Promise<AuditResult> {
  const { categories, quickWins, recommendations } = await analyzeWebsite(crawl);

  // Calculate scores for each category
  const scoredCategories: ScoredCategory[] = categories.map((cat) => ({
    name: cat.name,
    score: calculateCategoryScore(cat.findings),
    maxScore: 100,
    weight: cat.weight,
    weightedScore: calculateCategoryScore(cat.findings) * cat.weight,
  }));

  // Update category objects with scores
  const scoredFullCategories: AuditCategory[] = categories.map((cat, i) => ({
    ...cat,
    score: scoredCategories[i]?.score ?? 0,
  }));

  const totalWeight = scoredCategories.reduce((sum, c) => sum + c.weight, 0);
  const overallScore = Math.round(
    scoredCategories.reduce((sum, c) => sum + c.weightedScore, 0) / (totalWeight || 1)
  );

  const topQuickWins = getTopQuickWins(quickWins);

  const estimatedRoi = estimateROI(scoredFullCategories, topQuickWins, crawl);

  const summary = generateSummary(scoredFullCategories, overallScore);

  const now = new Date().toISOString();

  // Build SEO analysis
  const seoCategory = scoredFullCategories.find((c) => c.name === 'SEO & Metadata');
  const perfCategory = scoredFullCategories.find((c) => c.name === 'Performance & Mobile');
  const contentCategory = scoredFullCategories.find((c) => c.name === 'Content & Conversion');

  // Generate all final recommendations
  const finalRecommendations = recommendations.length > 0
    ? recommendations
    : topQuickWins.map((w) => w.title);

  return {
    id: uuidv4(),
    websiteUrl: crawl.url,
    agencyId: options?.agencyId,
    clientId: options?.clientId,
    overallScore,
    categories: scoredFullCategories,
    quickWins: topQuickWins,
    summary,
    crawlResult: crawl,
    scoredCategories,
    recommendations: finalRecommendations,
    estimatedRoi,
    timestamp: now,
    seoAnalysis: {
      titleTagScore: crawl.title ? (crawl.title.length >= 30 && crawl.title.length <= 60 ? 100 : 60) : 0,
      metaDescriptionScore: crawl.metaDescription
        ? crawl.metaDescription.length >= 120 && crawl.metaDescription.length <= 160 ? 100 : 60
        : 0,
      headingStructureScore: crawl.headings.filter((h) => h.level === 'H1').length === 1 ? 100 : 30,
      imageAltScore: crawl.imgAltCount.total > 0
        ? Math.round((crawl.imgAltCount.withAlt / crawl.imgAltCount.total) * 100)
        : 100,
      openGraphScore: Object.keys(crawl.openGraphTags).length > 0 ? 100 : 0,
      canonicalScore: crawl.canonicalUrl ? 100 : 0,
      findings: seoCategory?.findings ?? [],
    },
    contentAnalysis: {
      wordCount: crawl.wordCount,
      hasContactInfo: crawl.hasContactInfo,
      hasPrivacyPolicy: false,
      hasTermsOfService: false,
      hasAboutPage: false,
      hasBlog: false,
      contentQualityScore: contentCategory?.score ?? 50,
      findings: contentCategory?.findings ?? [],
    },
    performanceAnalysis: {
      loadTimeMs: crawl.loadTime,
      loadTimeScore: perfCategory?.score ?? 50,
      mobileOptimized: crawl.mobileViewport,
      hasFavicon: crawl.hasFavicon,
      hasSitemap: crawl.hasSitemap,
      findings: perfCategory?.findings ?? [],
    },
    completedAt: now,
  };
}