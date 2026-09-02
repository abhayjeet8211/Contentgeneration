const { GoogleGenerativeAI } = require('@google/generative-ai');
const ai = new GoogleGenerativeAI('AQ.Ab8RN6JjFFL32gA_4bG0n9_Zr5Shy90o1TlEfa4wpzCzD836zw');
async function run() {
  const model = ai.getGenerativeModel({ model: 'gemini-3.6-flash', generationConfig: { responseMimeType: 'application/json' } });
  try {
    const rawContent = 'A'.repeat(8000);
    const prompt = `
Analyze the following source document and extract structured content intelligence.

Source Text:
"""
${rawContent}
"""

Return a valid JSON object matching this schema:
{
  "summary": "Concise 2-3 sentence overview of the core document",
  "keyFacts": ["Fact 1", "Fact 2", "Fact 3", "Fact 4"],
  "keyEntities": ["Entity/Person/Company 1", "Entity 2"],
  "topics": ["Topic 1", "Topic 2"],
  "sentiment": "Positive/Neutral/Urgent/Cautionary/Informative",
  "targetAudience": "Identified primary target audience"
}
`;
    const response = await model.generateContent(prompt);
    console.log('SUCCESS');
  } catch (err) {
    console.error('FAILED', err);
  }
}
run();
