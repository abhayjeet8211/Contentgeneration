import { AIProvider } from './provider';
import { GeminiProvider } from './providers/gemini';
import { MockAIProvider } from './providers/mock';

export function getAIProvider(): AIProvider {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim().length > 0) {
    return new GeminiProvider(apiKey.trim());
  }
  return new MockAIProvider();
}
