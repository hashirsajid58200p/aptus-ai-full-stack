const LLMService = require('./llmService');

/**
 * Backward-compatible GroqAI wrapper that delegates to unified LLMService
 */
class GroqAI {
  constructor(options = {}) {
    this.service = new LLMService({
      provider: options.provider || 'groq',
      model: options.model || 'llama-3.3-70b-versatile',
      apiKey: options.apiKey || process.env.GROQ_API_KEY,
    });
  }

  async generateText(prompt, options = {}) {
    const result = await this.service.generateText(prompt, options);
    return result.text;
  }

  async generateContent(contentData, options = {}) {
    return await this.service.generateContent(contentData, options);
  }
}

module.exports = GroqAI;
