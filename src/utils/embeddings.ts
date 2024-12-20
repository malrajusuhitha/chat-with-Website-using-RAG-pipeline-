import { pipeline } from '@xenova/transformers';

let embeddingModel: any = null;

export async function initializeEmbeddingModel() {
  if (!embeddingModel) {
    embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embeddingModel;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = await initializeEmbeddingModel();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

export function chunkText(text: string, maxChunkSize: number = 512): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  
  for (const word of words) {
    if (currentChunk.join(' ').length + word.length > maxChunkSize) {
      chunks.push(currentChunk.join(' '));
      currentChunk = [word];
    } else {
      currentChunk.push(word);
    }
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }
  
  return chunks;
}