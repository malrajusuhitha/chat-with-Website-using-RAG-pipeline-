import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { scrapeWebsite } from '../services/scraping/scraper';
import { chunkText, generateEmbedding } from '../utils/embeddings';
import { WebsiteScrapingError } from '../services/scraping/errors';

interface Props {
  onWebsiteProcessed: (url: string) => void;
}

export function WebsiteInput({ onWebsiteProcessed }: Props) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const { content } = await scrapeWebsite(url);
      const chunks = chunkText(content);
      
      // Process chunks and generate embeddings
      for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk);
        // Store in Supabase vector store
        // Implementation will be added when we set up Supabase
      }
      
      onWebsiteProcessed(url);
      setUrl('');
    } catch (error) {
      if (error instanceof WebsiteScrapingError) {
        setError(`Failed to process website: ${error.message}`);
      } else {
        setError('An unexpected error occurred while processing the website');
      }
      console.error('Error processing website:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL to process..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                Processing...
              </span>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </form>
  );
}