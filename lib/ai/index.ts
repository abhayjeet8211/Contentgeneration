import { AIProvider } from './provider';
import { GeminiProvider } from './providers/gemini';
import { MockAIProvider } from './providers/mock';

export function getAIProvider(): AIProvider {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim().length > 0) {
    console.log("API Key: ", apiKey.trim());
    return new GeminiProvider(apiKey.trim());
  }
  console.log("using MockAIProvider");
  return new MockAIProvider();
}
