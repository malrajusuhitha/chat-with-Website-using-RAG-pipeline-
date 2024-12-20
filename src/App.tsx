import React, { useState } from 'react';
import { WebsiteInput } from './components/WebsiteInput';
import { Chat } from './components/Chat';
import type { ChatMessage } from './types';
import { Bot } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [processedUrls, setProcessedUrls] = useState<string[]>([]);

  const handleWebsiteProcessed = (url: string) => {
    setProcessedUrls(prev => [...prev, url]);
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: `Website processed successfully: ${url}`
      }
    ]);
  };

  const handleSendMessage = async (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // TODO: Implement RAG query processing
    // 1. Convert question to embedding
    // 2. Search vector store for relevant chunks
    // 3. Generate response using retrieved context
    
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: 'This feature is coming soon! The RAG pipeline is being implemented.'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Bot className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold">Website Chat Assistant</h1>
            </div>
            <p className="text-gray-600">
              Add websites to chat with their content using AI
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <WebsiteInput onWebsiteProcessed={handleWebsiteProcessed} />
          </div>

          {processedUrls.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Processed Websites:</h2>
              <ul className="space-y-1">
                {processedUrls.map((url, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {url}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg h-[600px] overflow-hidden">
            <Chat messages={messages} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;