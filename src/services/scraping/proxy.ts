import { WebsiteScrapingError, ScrapingErrorCodes } from './errors';

// Updated list of more reliable proxy services
const PROXY_SERVICES = [
  {
    url: 'https://api.allorigins.win/raw?url=',
    transform: (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  },
  {
    url: 'https://bypass-cors.herokuapp.com/',
    transform: (url: string) => `https://bypass-cors.herokuapp.com/${url}`,
  },
  {
    url: 'https://api.codetabs.com/v1/proxy?quest=',
    transform: (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  },
  // Fallback to direct fetch if all proxies fail
  {
    url: '',
    transform: (url: string) => url,
  }
];

const DEFAULT_TIMEOUT = 10000; // 10 seconds

export async function fetchWithProxy(url: string): Promise<Response> {
  const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

  const errors: Error[] = [];

  for (const proxy of PROXY_SERVICES) {
    try {
      const proxyUrl = proxy.transform(url);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

      try {
        const response = await fetch(proxyUrl, { 
          headers,
          signal: controller.signal,
          credentials: 'omit',
          mode: 'cors'
        });

        if (response.ok) {
          clearTimeout(timeoutId);
          return response;
        }
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      errors.push(error as Error);
      console.warn(`Proxy ${proxy.url} failed:`, error);
    }
  }

  throw new WebsiteScrapingError(
    url,
    ScrapingErrorCodes.FETCH_FAILED,
    `All fetch attempts failed. Last error: ${errors[errors.length - 1]?.message || 'Unknown error'}`,
    { errors: errors.map(e => e.message) }
  );
}