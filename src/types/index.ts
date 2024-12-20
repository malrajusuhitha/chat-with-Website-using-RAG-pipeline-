export interface WebsiteContent {
  url: string;
  title: string;
  content: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface EmbeddingResult {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}