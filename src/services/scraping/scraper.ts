import { validateUrl, validateResponse } from './validator';
import { parseHtml, extractMetadata } from './parser';
import { WebsiteScrapingError, ScrapingErrorCodes } from './errors';
import { fetchWithProxy } from './proxy';
import type { ScrapingResult } from './types';
import * as cheerio from 'cheerio';

export async function scrapeWebsite(url: string): Promise<ScrapingResult> {
  try {
    if (!validateUrl(url)) {
      throw new WebsiteScrapingError(
        url,
        ScrapingErrorCodes.INVALID_URL,
        'Invalid URL format'
      );
    }

    // Normalize URL
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    const response = await fetchWithProxy(normalizedUrl);
    validateResponse(response);
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    return {
      content: parseHtml(html),
      title: $('title').text(),
      metadata: {
        url: normalizedUrl,
        timestamp: new Date().toISOString(),
        ...extractMetadata($),
      },
    };
  } catch (error) {
    if (error instanceof WebsiteScrapingError) {
      throw error;
    }
    
    const message = error instanceof Error ? error.message : 'Failed to scrape website';
    throw new WebsiteScrapingError(
      url,
      ScrapingErrorCodes.FETCH_FAILED,
      message,
      error
    );
  }
}