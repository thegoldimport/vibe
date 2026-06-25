// ============================================================
// Website Crawler - Uses Playwright to crawl and extract data
// ============================================================

import { CrawlResult, AuditFinding } from './types';

const SOCIAL_PLATFORMS = [
  { name: 'facebook', patterns: ['facebook.com', 'fb.com'] },
  { name: 'instagram', patterns: ['instagram.com'] },
  { name: 'twitter', patterns: ['twitter.com', 'x.com'] },
  { name: 'linkedin', patterns: ['linkedin.com'] },
  { name: 'youtube', patterns: ['youtube.com'] },
  { name: 'tiktok', patterns: ['tiktok.com'] },
  { name: 'pinterest', patterns: ['pinterest.com'] },
  { name: 'yelp', patterns: ['yelp.com'] },
  { name: 'google business', patterns: ['google.com/maps'] },
];

const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function identifyPlatform(url: string): string | null {
  for (const platform of SOCIAL_PLATFORMS) {
    if (platform.patterns.some((p) => url.toLowerCase().includes(p))) {
      return platform.name;
    }
  }
  return null;
}

export async function crawlWebsite(url: string): Promise<CrawlResult> {
  const startTime = Date.now();

  // Ensure URL has protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  // We'll dynamically import playwright to keep things lightweight
  // when the module is loaded but not used for crawling
  let browser;
  try {
    const { chromium } = await import('playwright');
    browser = await chromium.launch({ headless: true });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();
    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    const statusCode = response?.status() ?? 0;
    const loadTime = Date.now() - startTime;

    // Extract page title
    const title = await page.title().catch(() => null);

    // Extract meta description
    const metaDescription = await page
      .$eval('meta[name="description"]', (el) => el.getAttribute('content'))
      .catch(() => null);

    // Extract all headings
    const headings = await page.evaluate(() => {
      const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      const result: { level: string; text: string }[] = [];
      for (const tag of tags) {
        document.querySelectorAll(tag).forEach((el) => {
          const text = (el as HTMLElement).innerText?.trim();
          if (text) {
            result.push({ level: tag.toUpperCase(), text: text.slice(0, 200) });
          }
        });
      }
      return result;
    });

    // Get all page text for content analysis
    const pageText = await page.evaluate(() => document.body?.innerText ?? '');

    // Count words
    const wordCount = pageText
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean).length;

    // Extract contact info
    const contactInfo = await page.evaluate(
      ({ phoneRegex, emailRegex }) => {
        const bodyText = document.body?.innerText ?? '';
        const html = document.documentElement?.innerHTML ?? '';

        const phones = [
          ...new Set(
            (bodyText.match(phoneRegex) || []).map((p: string) => p.trim())
          ),
        ];
        const emails = [
          ...new Set(
            (bodyText.match(emailRegex) || []).map((e: string) => e.trim())
          ),
        ];

        // Try to find address (rough heuristic for addresses)
        const addressPatterns = [
          /(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct|Suite|Ste)[^,]*)/gi,
          /(?:PO\s*Box\s+\d+)/gi,
        ];
        const addresses: string[] = [];
        for (const pat of addressPatterns) {
          const matches = html.match(pat);
          if (matches) {
            matches.forEach((m: string) => addresses.push(m.trim()));
          }
        }

        return { phones: [...new Set(phones)], emails: [...new Set(emails)], addresses: [...new Set(addresses)] };
      },
      { phoneRegex: PHONE_REGEX.source, emailRegex: EMAIL_REGEX.source }
    );

    // Check for lead capture forms
    const leadForms = await page.evaluate(() => {
      const forms: { type: string; action: string }[] = [];
      document.querySelectorAll('form').forEach((form) => {
        const action = (form as HTMLFormElement).action || (form as HTMLFormElement).getAttribute('action') || '';
        const hasEmailInput = form.querySelector('input[type="email"], input[name*="email"]');
        const hasSubmitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (hasEmailInput || hasSubmitBtn) {
          forms.push({
            type: hasEmailInput ? 'email_capture' : 'general_contact',
            action,
          });
        }
      });

      // Also check for newsletter signup patterns
      document.querySelectorAll('input[type="email"]').forEach((input) => {
        const parentForm = input.closest('form');
        if (!parentForm) {
          forms.push({
            type: 'inline_email',
            action: '',
          });
        }
      });

      return forms;
    });

    // Extract social media links
    const socialLinks = await page.evaluate(() => {
      const platforms = [
        { name: 'facebook', patterns: ['facebook.com', 'fb.com'] },
        { name: 'instagram', patterns: ['instagram.com'] },
        { name: 'twitter', patterns: ['twitter.com', 'x.com'] },
        { name: 'linkedin', patterns: ['linkedin.com'] },
        { name: 'youtube', patterns: ['youtube.com'] },
        { name: 'tiktok', patterns: ['tiktok.com'] },
        { name: 'pinterest', patterns: ['pinterest.com'] },
        { name: 'yelp', patterns: ['yelp.com'] },
        { name: 'google business', patterns: ['google.com/maps'] },
      ];

      const links: { platform: string; url: string }[] = [];
      document.querySelectorAll('a[href]').forEach((a) => {
        const href = (a as HTMLAnchorElement).href;
        for (const platform of platforms) {
          if (platform.patterns.some((p) => href.toLowerCase().includes(p))) {
            links.push({ platform: platform.name, url: href });
            break;
          }
        }
      });

      // Deduplicate
      const seen = new Set<string>();
      return links.filter((l) => {
        const key = `${l.platform}:${l.url}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    });

    // Image alt text analysis
    const imgAltCount = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      let withAlt = 0;
      imgs.forEach((img) => {
        if (img.hasAttribute('alt') && (img.getAttribute('alt') || '').trim().length > 0) {
          withAlt++;
        }
      });
      return { total: imgs.length, withAlt };
    });

    // Mobile viewport check
    const mobileViewport = await page
      .$eval('meta[name="viewport"]', (el) => {
        const content = el.getAttribute('content') || '';
        return content.includes('width=device-width');
      })
      .catch(() => false);

    // Favicon check
    const hasFavicon = await page
      .$eval('link[rel*="icon"]', () => true)
      .catch(() => false);

    // OG tags
    const openGraphTags = await page.evaluate(() => {
      const tags: Record<string, string> = {};
      document.querySelectorAll('meta[property^="og:"], meta[name^="og:"]').forEach((el) => {
        const property = el.getAttribute('property') || el.getAttribute('name') || '';
        const content = el.getAttribute('content') || '';
        if (property && content) tags[property] = content;
      });
      return tags;
    });

    // Check sitemap and robots.txt existence
    let hasSitemap = false;
    let hasRobotsTxt = false;
    const domain = extractDomain(url);

    try {
      const sitemapResp = await page.evaluate(async (d) => {
        try {
          const resp = await fetch(`https://${d}/sitemap.xml`, { method: 'HEAD' });
          return resp.ok;
        } catch {
          return false;
        }
      }, domain);
      hasSitemap = sitemapResp;
    } catch {}

    try {
      const robotsResp = await page.evaluate(async (d) => {
        try {
          const resp = await fetch(`https://${d}/robots.txt`, { method: 'HEAD' });
          return resp.ok;
        } catch {
          return false;
        }
      }, domain);
      hasRobotsTxt = robotsResp;
    } catch {}

    // Canonical tag
    const canonicalUrl = await page
      .$eval('link[rel="canonical"]', (el) => el.getAttribute('href'))
      .catch(() => null);

    // Hreflang tags
    const hreflangTags = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('link[rel="alternate"][hreflang]')
      ).map((el) => el.getAttribute('hreflang') || '');
    });

    await browser.close();

    return {
      url,
      title,
      metaDescription,
      headings,
      wordCount,
      loadTime,
      hasContactInfo:
        contactInfo.phones.length > 0 || contactInfo.emails.length > 0 || contactInfo.addresses.length > 0,
      contactInfo,
      hasLeadCaptureForm: leadForms.length > 0,
      leadForms,
      socialLinks,
      imgAltCount,
      statusCode,
      mobileViewport,
      hasFavicon,
      hasSitemap,
      hasRobotsTxt,
      openGraphTags,
      hreflangTags,
      canonicalUrl,
    };
  } catch (error: any) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    return {
      url,
      title: null,
      metaDescription: null,
      headings: [],
      wordCount: 0,
      loadTime: Date.now() - startTime,
      hasContactInfo: false,
      contactInfo: { phones: [], emails: [], addresses: [] },
      hasLeadCaptureForm: false,
      leadForms: [],
      socialLinks: [],
      imgAltCount: { total: 0, withAlt: 0 },
      statusCode: 0,
      mobileViewport: false,
      hasFavicon: false,
      hasSitemap: false,
      hasRobotsTxt: false,
      openGraphTags: {},
      hreflangTags: [],
      canonicalUrl: null,
      error: error instanceof Error ? error.message : 'Unknown crawl error',
    };
  }
}