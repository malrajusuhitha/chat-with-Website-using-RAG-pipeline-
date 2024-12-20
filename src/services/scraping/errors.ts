export class WebsiteScrapingError extends Error {
  constructor(
    public url: string,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'WebsiteScrapingError';
  }
}

export const ScrapingErrorCodes = {
  FETCH_FAILED: 'FETCH_FAILED',
  INVALID_URL: 'INVALID_URL',
  PARSING_FAILED: 'PARSING_FAILED',
} as const;