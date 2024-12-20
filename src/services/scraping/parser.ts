import * as cheerio from 'cheerio';

export function parseHtml(html: string): string {
  const $ = cheerio.load(html);
  
  // Remove unnecessary elements
  $('script').remove();
  $('style').remove();
  $('nav').remove();
  $('footer').remove();
  $('header').remove();
  $('[role="navigation"]').remove();
  $('[role="banner"]').remove();
  $('[role="complementary"]').remove();
  
  // Extract main content
  const mainContent = $('main, article, [role="main"]').text() || $('body').text();
  
  return mainContent
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractMetadata($: cheerio.CheerioAPI): Record<string, string> {
  return {
    title: $('title').text() || '',
    description: $('meta[name="description"]').attr('content') || '',
    keywords: $('meta[name="keywords"]').attr('content') || '',
  };
}