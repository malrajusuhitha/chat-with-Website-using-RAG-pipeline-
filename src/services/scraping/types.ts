export interface ScrapingResult {
  content: string;
  title: string;
  metadata: {
    url: string;
    timestamp: string;
  };
}

export interface ScrapingError {
  message: string;
  url: string;
  code: string;
  details?: unknown;
}